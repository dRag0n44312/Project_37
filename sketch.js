var PLAY=1;
var END=0;
var gameState=PLAY;

var trex,trex_running,trex_collided;
var ground,invisibleGround,groundImage;

var cloudsGroup,cloudImage;
var obstaclesGroup,obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;

var score;
var gameOverImg,restartImg;
var jumpSound,checkPointSound,dieSound;

function preload(){
  trex_running = loadAnimation("Sprites/trex1.png","Sprites/trex3.png","Sprites/trex4.png");
  trex_collided = loadImage("Sprites/trex_collided.png");
  groundImage = loadImage("Sprites/ground2.png");
  cloudImage = loadImage("Sprites/cloud.png");
  obstacle1 = loadImage("Sprites/obstacle1.png");
  obstacle2 = loadImage("Sprites/obstacle2.png");
  obstacle3 = loadImage("Sprites/obstacle3.png");
  obstacle4 = loadImage("Sprites/obstacle4.png");
  obstacle5 = loadImage("Sprites/obstacle5.png");
  obstacle6 = loadImage("Sprites/obstacle6.png");
  restartImg = loadImage("Sprites/restart.png")
  gameOverImg = loadImage("Sprites/gameOver.png")
  jumpSound = loadSound("Sounds/jump.mp3")
  dieSound = loadSound("Sounds/die.mp3")
  checkPointSound = loadSound("Sounds/checkPoint.mp3")
}

function setup() 
{
  createCanvas(displayWidth-20,displayHeight-300);
  trex = createSprite(50,380,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  ground = createSprite(200,380,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  gameOver = createSprite(displayWidth/2,displayHeight/2-150);
  gameOver.addImage(gameOverImg);
  restart = createSprite(displayWidth/2,displayHeight/2-120);
  restart.addImage(restartImg);
  if(mousePressedOver(restart))
  {
    reset();
  }
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  invisibleGround = createSprite(200,390,400,10);
  invisibleGround.visible = false;
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  score = 0;
}

function draw() 
{
  
  background("white");
  text("Score: "+ score, 500,50);
  
  if(gameState === PLAY)
  {
    gameOver.visible = false;
    restart.visible = false;
    ground.velocityX = -(4 + 3* score/100)
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    if(keyDown("space")&& trex.y >= 300) 
    {
     trex.velocityY = -12;
     jumpSound.play();
    }

    trex.velocityY = trex.velocityY + 0.8
    spawnClouds();
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex))
    {
     jumpSound.play();
     gameState = END;
     dieSound.play()
      
    }
  }
   else if (gameState === END) 
   {
     gameOver.visible = true;
     restart.visible = true;
     
     if(mousePressedOver(restart)) 
     {
      reset();
     }
     ground.velocityX = 0;
     trex.velocityY = 0
     trex.changeAnimation("collided", trex_collided);
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  trex.collide(invisibleGround);
  drawSprites();
}

function reset()
{
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  trex.changeAnimation("running");
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}


function spawnObstacles()
{
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,365,10,40);
   obstacle.velocityX = -(6 + score/100);
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }     
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() 
{
  if (frameCount % 60 === 0) 
  {
    var cloud = createSprite(600,300,40,10);
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(280,320))
    cloud.scale = 0.4;
    cloud.velocityX = -3;
    cloud.lifetime = 220;
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud);
  }
}

