// Hangman Game 
// by Philipp Kaltofen

// --------- --------- --------- --------- ---------
//        --------- SURROUNDINGS ---------
// --------- --------- --------- --------- ---------

// fire stuff

var fireParticle = function(sPosX, sPosY) {
    this.posX = sPosX;
    this.posY = sPosY;
    this.r = random(200,255);
    this.g = 0;
    this.b = 0;
    this.speed = 3;
    this.fadeOut = 200;
    this.fadeOutSpeed = random(1,5);
    this.spread = random(1.5,3);
    this.size = random(1,7);
    
    this.gMaxSize = 20;
    this.gMinSize = 10;
    
    this.moveParticle = function(){
        this.posY -= this.speed;
        this.posX = this.posX + random(-this.spread,this.spread);
        this.g += 2;
        this.fadeOut -= this.fadeOutSpeed;
    };
    
    this.drawParticle = function(){
        fill(this.r,this.g,this.b, this.fadeOut);
        noStroke();
        ellipse(this.posX, this.posY, this.size,this.size);
    };
    
    this.gS = true;
    
    this.glow = function(){
        if(this.size > this.gMinSize && this.gS){
            this.size-= 0.3;
            if(this.size < this.gMinSize){
                this.gS = false;
            }
        } else if(this.size < this.gMaxSize) {
            this.size += 0.3;
            if(this.size > this.gMaxSize-1){
                this.gS = true;
            }
        }
    };
    
};

// particle system

var particleSystem = [];
var particleSystem2 = [];

var psSize = 100;

for(var i = 0; i < psSize; i++){
    particleSystem[i] = new fireParticle(200 + random(-10,10),200 + random(-10,10));
    particleSystem2[i] = new fireParticle(200 + random(-10,10),200 + random(-10,10));
}

// non-animated objects

// torch

var torch = function(posX, posY){
    fill(77, 63, 42);
    triangle(posX - 10, posY, posX + 10, posY, posX, posY + 20);
    rect(posX-5,posY+5, 10, 60);
    fill(20,20,20);
    rect(posX-10,posY-5,20,10);
};

// sun

var sun = function(posX, posY, sunSize){
    fill(227, 182, 68);
    ellipse(posX, posY, sunSize, sunSize);
};

// ground

var ground = function(height){
    fill(217, 208, 171);
    rect(0,height, 500, 200);
};

// hanging station (?)

var hangingStation = function(){
    fill(107, 92, 62);
    //          1 -- Floor
    // stands
    rect(150, 400, 10, 50);
    rect(350, 400, 10, 50);
    // ground
    rect(150, 400, 200, 10);
    // stairs
    rect(120, 440, 40, 10);
    rect(130, 420, 20, 20);
    rect(140, 400, 10, 20);
    // box
    rect(240, 385, 20, 15);
    //          2 -- sideStands
    rect(180, 300, 20, 100);
    rect(300, 300, 20, 100);
    //          3 -- top
    rect(180, 300, 120, 10);
    
    // color change
    fill(128, 126, 114);
    
    //          4 -- rope
    rect(248, 310, 4, 25);
    
    //          5 -- body || HEAD
    ellipse(250, 340, 15, 15);
    //          6 -- body || UPPER BODY
    ellipse(250, 360, 15, 30);
    //          7 -- body || LEG LEFT
    rect(245, 370, 5, 15);
    //          8 -- body || LEG RIGHT
    rect(251, 370, 5, 15);
    
};

// draw all object

var drawNonAnimatedObjects = function(){
    rectMode(LEFT);
    sun(250,420,200);
    ground(420);
    torch(50, 405);
    torch(450, 405);
    hangingStation();
};

// --------- --------- --------- --------- ---------
// --------- ACTUAL GAME LOGIC STARTS HERE ---------
// --------- --------- --------- --------- ---------

// Game states
// 0 -- Start
// 1 -- In Game
// 2 -- Winscreen
// 3 -- Gameover

var gameState = 0;

// Start Screen

var r1_posX = -220;
var r2_posX = 720;

var buttonColor = 220;
var b_posX = 250;
var b_posY = 450;

var drawStartScreen = function(){
    // TITEL
    noStroke();
    rectMode(CENTER);
    background(230, 230, 230);
    fill(40,40,40);
    textAlign(CENTER);
    textSize(50);
    text("Hangman", 250, 200);
    rect(r1_posX, 220, 220, 1);
    rect(r2_posX, 150, 220, 1);
    // BUTTON
    fill(buttonColor);
    rect(b_posX, b_posY, 200, 50);
    fill(100);
    textSize(20);
    text("New Game", b_posX, b_posY + 8);
};

var mouseMoved = function(){
    // hightlight start button
    if(gameState === 0){
        if((mouseX > b_posX - 100 && mouseX < b_posX + 100) && (mouseY > b_posY - 25 && mouseY < b_posY+25)){
            buttonColor = 255;
        } else {
            buttonColor = 220;
        }
    }
};

var mousePressed = function(){
    // new game from start button
    if(gameState === 0){
        if((mouseX > b_posX - 100 && mouseX < b_posX + 100) && (mouseY > b_posY - 25 && mouseY < b_posY+25)){
            gameState = 1;
        }
    }
};

// draw function

var draw = function() {
    frameRate(60);
    
    // Start
    if(gameState === 0){
        drawStartScreen();
        if(r1_posX <= 249 && r2_posX >= 249){
            r1_posX += 5;
            r2_posX -= 5;
        }
    }
    // In Game
    if(gameState === 1){
        background(198, 226, 247);
        for(var i = 0; i < psSize; i++){
            // left
            particleSystem[i].drawParticle();
            particleSystem[i].moveParticle();
            if(i === psSize-1){
                particleSystem.splice(1, 0, new fireParticle(50,400));
                particleSystem.pop();
            }
            // right
            particleSystem2[i].drawParticle();
            particleSystem2[i].moveParticle();
            if(i === psSize-1){
                particleSystem2.splice(1, 0, new fireParticle(450,400));
                particleSystem2.pop();
            }
        }
        
        drawNonAnimatedObjects();
    }
    // Winscreen
    if(gameState === 2){
    }
    // GameOver
    if(gameState === 3){
    }
    
    /* DEBUG OUTPUT
    fill(255,255,255);
    text("active particles: " + particleSystem.length + " - " + particleSystem2.length, 10, 20);
    */
};