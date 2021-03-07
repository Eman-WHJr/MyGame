var background1,mario,invisibleGround,mario_collided;
var background1Img,marioImg;
var  Block,block1Image,  block2Image,  block3Image
var obstacle, obstacle2, obstacle3, obstacle4, obstacle4;
var cloud,cloud1Image,cloud2Image;
var gameOver,restart,gameOverImg,  restartImg;
var coin ,coinImage1,coinImage2,coinImage3,coinImage4,coinImage5;
var enemyGroup, blockGroup,cloudGroup,coinGroup;

var jumpSound,coinSound,dieSound;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var score;

function preload(){
  background1Img = loadImage("Images/finalbg.png");
marioImg =   loadAnimation("Images/mario01.png","Images/mario02.png","Images/mario03.png");
  mario_collided = loadAnimation("Images/mario24.png");
  
   obstacle1 = loadAnimation("Images/enemy04.png","Images/enemy05.png","Images/enemy06.png","Images/enemy07.png");
  obstacle2 = loadAnimation("Images/enemy19.png","Images/enemy20.png","Images/enemy21.png","Images/enemy22.png");
  obstacle3 = loadAnimation("Images/enemy29.png","Images/enemy30.png","Images/enemy31.png","Images/enemy32.png");
  obstacle4 = loadAnimation("Images/enemy46.png","Images/enemy47.png","Images/enemy48.png","Images/enemy49.png");
  
  cloud1Image = loadImage("Images/cloud01.png");
  cloud2Image = loadImage("Images/cloud02.png");
  
  coinImage1 = loadImage("Images/coin01.png");
  coinImage2 = loadImage("Images/coin02.png");
  coinImage3 = loadImage("Images/coin03.png");
  coinImage4 = loadImage("Images/coin04.png");
  coinImage5 = loadImage("Images/coin05.png");
  
  block1Image = loadImage("Images/blocks13.png");
  block2Image = loadImage("Images/blocks14.png");
  block3Image = loadImage("Images/blocks15.png");
  
  enemyGroup=new Group();
  blockGroup=new Group();
  cloudGroup=new Group();
  coinGroup=new Group();
  
  gameOverImg = loadImage("Images/game-over-png-rpg-transparent.png");
  restartImg = loadImage("Images/restsrt.png");
  
  jumpSound=loadSound("sounds/smb_jump-super.wav");
  dieSound=loadSound("sounds/smb_gameover.wav");
  coinSound=loadSound("sounds/smb_coin.wav")
}

function setup() {
  createCanvas(600, 600);
  
  background1 = createSprite(200,200,400,600);
  background1.addImage(background1Img);
  background1.scale=1.2;
  background1.x =  background1.width/2;
  background1.velocityX=-4;
  
  mario = createSprite(50,325,20,50);
  mario.addAnimation("running", marioImg);
  mario.addAnimation("collided", mario_collided);
  mario.scale=0.5;

  invisibleGround = createSprite(200,370,600,20);
  invisibleGround.visible=false;
  
  gameOver = createSprite(280,160);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.3;
  gameOver.visible = false;
  
  restart = createSprite(280,240);
  restart.addImage(restartImg);
  
  restart.scale = 0.1;
  restart.visible = false;
  
  score=0;
  
}

function draw() {

  background(255);
    
  if (gameState===PLAY){
    
  if(keyDown("space")  && mario.y>=259) {
      mario.velocityY = -12;
    jumpSound.play();
    }
  
   mario.velocityY = mario.velocityY + 0.8
  
    if(keyDown("right_arrow")){
      mario.x=mario.x+1;
    }
    
    if(keyDown("left_arrow")){
      mario.x=mario.x-1;
    }
    
    if (background1.x <250){
     background1.x =  background1.width/2;
     }
    
    spawnObstacles();
    spawnClouds() 
    spawnCoins();
    spawnBlocks();
    
    if(enemyGroup.isTouching(mario)){
        gameState = END;
      dieSound.play();
    }
    
    if(blockGroup.isTouching(mario)){
      mario.velocityY = 0;
    }
    
    if(coinGroup.isTouching(mario)){
      coinGroup.destroyEach();
      coinSound.play();
      score=score+5;
    }
  }
  else if (gameState===END){
    
    gameOver.visible = true;
    restart.visible = true;
    
    background1.velocityX=0;
    
    coinGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    blockGroup.setVelocityXEach(0);
    enemyGroup.setVelocityXEach(0);
    
    enemyGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    
    mario.changeAnimation("collided",mario_collided);
    
    if(mousePressedOver(restart)) {
      reset();
    }
   }
  
    mario.collide(invisibleGround);
    drawSprites();
    stroke("red");
    fill("red");
    textSize(20);
    text("Score: "+ score, 50,50);


}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  enemyGroup.destroyEach();
  cloudGroup.destroyEach();
  
  mario.changeAnimation("running", marioImg);
  
  score = 0;
}

function spawnObstacles() {
  if(frameCount % 150 === 0) {
    var obstacle = createSprite(600,340,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -5;
    
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: 
        obstacle.addAnimation("moving1",obstacle1);
        break;
      case 2: 
        obstacle.addAnimation("moving2",obstacle2);
              break;
      case 3: 
        obstacle.addAnimation("moving3",obstacle3);
              break;
      case 4: 
        obstacle.addAnimation("moving4",obstacle4);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale =2;
    obstacle.lifetime = 300;
    
    enemyGroup.add(obstacle);
   
  }
}
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 90 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    
    var ran = Math.round(random(1,2));
    switch(ran) {
      case 1: cloud.addImage(cloud1Image);
      break;
      case 2:cloud.addImage(cloud2Image);
      break;
      default: break;
    }
    
    cloud.scale =1.2;
    cloud.velocityX = -3;
    
    cloud.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    cloud.depth = gameOver.depth;
    gameOver.depth = gameOver.depth + 1;
    
    //assign lifetime to the variable
    cloud.lifetime = 300;
    cloudGroup.add(cloud);
  
  }
  
}

function spawnCoins() {
  //write code here to spawn the clouds
  if (frameCount %120 === 0) {
    var coin = createSprite(600,120,40,10);
    coin.y = Math.round(random(150,250));
 
    var ran1= Math.round(random(1,5));
    switch(ran1) {
      case 1: 
         coin.addImage(coinImage1);
        break;
      case 2: 
      coin.addImage(coinImage2);
              break;
      case 3: 
       coin.addImage(coinImage3);
              break;
      case 4: 
          coin.addImage(coinImage4);
              break;
      case 5: 
        coin.addImage(coinImage5);
              break;
     
      default: break;
    }
    coin.scale = 1.5;
    coin.velocityX = -3;
    
    coin.lifetime = 200;
    coinGroup.add(coin);
    
  }
  
}
function spawnBlocks() {
  //write code here to spawn the clouds
  if (frameCount % 200 === 0) {
    var Block = createSprite(600,120,20,20);
    Block.y = Math.round(random(180,260));
    
    var ran2 = Math.round(random(1,3));
    switch(ran2) {
      case 1: Block.addImage(block1Image);
      break;
      case 2:Block.addImage(block2Image);
      break;
      case 3:Block.addImage(block3Image);
      break;
      default: break;
    }
    
     Block.scale =2;
     Block.velocityX = -3;
    
     Block.depth = mario.depth;
     mario.depth = mario.depth + 1;
    
    Block.depth = restart.depth;
     restart.depth = restart.depth + 1;
  
     Block.lifetime = 200;
    
     blockGroup.add(Block);
    
  }
}
  