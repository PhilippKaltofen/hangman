// Hangman Game 
// Philipp Kaltofen

// wortliste:
// "hallo","test","baum","wort","hangman","ente","produkt",
// "laptop", "xylophon", "rom", "dude","gitarre", "haltestelle", "laufen", "yak"

// --------- --------- --------- --------- ---------
//       --------- INGAME SURROUNDINGS ---------
// --------- --------- --------- --------- ---------

// Game states
// 0 -- Start
// 1 -- In Game
// 2 -- Winscreen
// 3 -- Gameover

var gameState = 0;
var singlePlayer = true;
var overAllScore = 0;
var gameOverTime = 0;

// background

var bg_r = 198;
var bg_g = 226;
var bg_b = 247;

// body to drop at game over

var bodyObject = function(){

    this.posX = 250;
    this.height = 340;
    this.color = 200;

    this.drawBody = function(){
        
        //          6 -- body || UPPER BODY
        fill(this.color);
        ellipse(this.posX, this.height+20, 15, 30);
        
        fill(20);
        arc(250, this.height+5, 10, 10, 0, 180);
        
        //          5 -- body || HEAD
        fill(this.color);
        ellipse(this.posX, this.height, 15, 15);
        //          7 -- body || LEG LEFT
        rect(this.posX-5, this.height+30, 5, 15);
        //          8 -- body || LEG RIGHT
        rect(this.posX+1, this.height+30, 5, 15);
        if(this.height > 350){
            stroke(107, 92, 62);
            strokeWeight(5);
            line(230, 405, 240, this.height+50);
        }
        noStroke();
        // overlapping wood
        fill(107, 92, 62);
        rect(240, 403, 20, 7);
        fill(125, 108, 73);
        rect(240, 400, 20, 3);
    };
    
    this.drawBodyStart = function(){
        fill(255,255,255);
        ellipse(this.posX, this.height, 15, 15);
        ellipse(this.posX, this.height+20, 15, 30);
        rect(this.posX-5, this.height+30, 5, 15);
        rect(this.posX+1, this.height+30, 5, 15);
    };
    
    this.moveBody = function(){
        if(this.height <= 380){
            this.height += 6;
        }
    };
    
    this.resetBody = function(){
        this.height = 340;
        this.posX = 250;
    };
};

var bodyGameOver = new bodyObject();

// sun object

var sun = function(){
    this.posX = 250;
    this.posY = 350;
    this.sunSize = 200;

    this.drawSun = function(){
        fill(227, 182, 68);
        ellipse(this.posX, this.posY, this.sunSize, this.sunSize);
        if(gameState === 1 && this.posY >= 350){
            this.posY--;
        }
        if((gameState === 3 || gameState === 2) && this.posY <= 800){
            this.posY++;
        }
        /*
        fill(227, 182, 68, 90);
        ellipse(this.posX, this.posY, this.sunSize + 50, this.sunSize + 50);
        
        fill(227, 182, 68, 40);
        ellipse(this.posX, this.posY, this.sunSize + 100, this.sunSize + 100);
        
        fill(227, 182, 68, 20);
        ellipse(this.posX, this.posY, this.sunSize + 100, this.sunSize + 100);
        
        fill(227, 182, 68, 20);
        ellipse(this.posX, this.posY, this.sunSize + 150, this.sunSize + 150);
        */
    };
    
};

var sunObj = new sun();

// cloud object

var cloud = function(posX, posY){
    this.posX = posX;
    this.posY = posY;
    this.speed = random(0.2, 0.6);
    this.ellipseSize = random(30,50);
    this.ellipsePosX = random(-30, 30);
    this.color = random(230, 255);
    
    this.drawCloud = function(){
        fill(this.color);
        arc(this.posX+10, this.posY+25, 150, 50, 180, 360);
        ellipse(this.posX + this.ellipsePosX, this.posY, this.ellipseSize + 20, this.ellipseSize);
    };
    
    this.moveCloud = function(){
        this.posX += this.speed;
        if(this.posX > 570){
            this.posX = -100;
        }
    };
};

// start letter objects

var letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","i","o","p","q","r","s","t","u","v","w","x","y","z"];

var letter = function(randNum){
    this.content = letters[randNum];
    this.posX = random(0, 500);
    this.posY = random(0, 500);
    this.tSize = random(10,30);
    this.alpha = random(0, 200);
    
    this.drawLetter = function(){
        fill(255, 255, 255, this.alpha);
        textSize(this.tSize);
        text(this.content, this.posX, this.posY);
    };
    
    this.moveLetter = function(){
        this.posX = this.posX + random(-1, 1);
        this.posY+= (this.posY / 15) + 0.1;
        if(this.posY >= 550){
            this.posY = 0;
            this.posX = random(0,500);
            this.alpha = random(0, 200);
        }
    };
};

var gameLetter = function(startPosX, startPosY, endPosX, endPosY, content){
    this.content = content;
    this.startPosX = startPosX;
    this.startPosY = startPosY;
    this.endPosX = endPosX;
    this.endPosY = endPosY;
    this.speed = 5;
    
    this.color = 20;
    
    this.currentPosX = startPosX;
    this.currentPosY = startPosY;
    
    this.moveLetter = function(){
        if(this.currentPosX > this.endPosX){
            this.currentPosX -= this.speed;
        } else if(this.currentPosX < this.endPosX){
            this.currentPosX += this.speed;
        }
        if(this.currentPosY > this.endPosY){
            this.currentPosY -= this.speed;
        } else if(this.currentPosY < this.endPosY){
            this.currentPosY += this.speed;
        }
        if(this.color < 230){
            this.color+= 5;
        }
    };
    
    this.drawLetter = function(){
        fill(this.color);
        textAlign(CENTER);
        textSize(40);
        if(gameState === 2){
            fill(255,255,255);
        }
        text(this.content, this.currentPosX, this.currentPosY);
    };
    
    this.moveLetterToMid = function(){
        this.endPosY = 250;  
    };
    
};

var lettersArray = [];
for(var i = 0; i < 20; i++){
    lettersArray[i] = new letter(i);
}

// fire stuff

var fireParticle = function(sPosX, sPosY) {
    this.posX = sPosX;
    this.posY = sPosY;
    this.r = random(200,255);
    this.g = 0;
    this.b = 0;
    this.speed = random(1, 1.5);
    this.fadeOut = 200;
    this.fadeOutSpeed = random(1,5);
    this.spread = random(1,2);
    this.size = random(1,7);
    
    this.randSndParticle = random(-5,5);
    
    this.gMaxSize = 20;
    this.gMinSize = 10;
    
    this.moveParticle = function(){
        this.posY -= this.speed;
        this.posX = this.posX + random(-this.spread,this.spread);
        this.g += 3;
        this.fadeOut -= this.fadeOutSpeed;
    };
    
    this.drawParticle = function(){
        fill(this.r,this.g,this.b, this.fadeOut);
        noStroke();
        ellipse(this.posX, this.posY, this.size,this.size);
        ellipse(this.posX + this.randSndParticle, this.posY + this.randSndParticle, this.size,this.size);
    };
    
};

// particle system

var particleSystem = [];
var particleSystem2 = [];

var psSize = 100;

for(var i = 0; i < psSize; i++){
    particleSystem[i] = new fireParticle(1500,1500);
    particleSystem2[i] = new fireParticle(1500,1500);
}

// non-animated objects

// torch

var torch = function(posX, posY, left){
    fill(77, 63, 42);
    triangle(posX - 10, posY, posX + 10, posY, posX, posY + 20);
    rect(posX-4,posY+5, 8, 40);
    fill(94, 53, 24);
    rect(posX-10,posY-5,20,10);
    fill(143, 136, 136);
    ellipse(posX, posY-5,20,10);
    fill(110, 14, 14);
    ellipse(posX, posY-5,15,5);
    stroke(0, 0, 0, 20);
    strokeWeight(10);
    if(left){
        line(posX, posY + 50, posX - sunObj.posY / 4, posY + 150);
    } else {
        line(posX, posY + 50, posX + sunObj.posY / 4, posY + 150);
    }
    strokeWeight(2);
    noStroke();
};

// ground

var ground = function(height){
    // tower background
    fill(120);
    rect(65, height - 190, 70, 40);
    fill(100);
    rect(30, height - 150, 140, 100);
    for(var i = 1; i < 6; i++){
        rect(30 * i, height - 160, 20, 10);
    }
    fill(89, 62, 52);
    triangle(55, height - 190, 100, height - 210, 145, height - 190);
    
    fill(150);
    rect(0,height, 500, 200);
    for(var i = 0; i < 10; i++){
        stroke(168,168,168);
        line(250 + i * 30, height, 250+ i * 40, 550);
        stroke(168,168,168);
        line(250 - i * 30, height, 250 - i * 40, 550);
    }
    for(var i = 1; i < 6; i++){
        line(0, height + i * (20 + i * 2), 500, height + i * (20 + i * 2)); 
    }
    noStroke();
    fill(20, 20, 20, 50);
    rect(0, height, 500, sunObj.posY / 7);
    rect(140, height + 5, 220, 25);
    // mauer
    fill(120);
    rect(0, height - 50, 500, 50);
    for(var i = 1; i < 4; i++){
        stroke(150, 150, 150);
        line(0, height - (i * 17), 500, height - i * 17);
    }
    noStroke();
    // mauer oben
    fill(140);
    rect(0, height - 55, 500, 5);
    // zacken
    for(var i = 0; i < 5; i++){ 
        fill(120);
        rect(25 +i * 100, height - 65, 50, 15);
        fill(140);
        rect(25 + i * 100, height - 70, 50, 5);
    }
};

// hanging station (?)

var ropeAnchorX = 250;
var ropeAnchorY = 330;

var hangingStation = function(step){
    if(step <= 1){
        fill(107, 92, 62, 50);
    } else {
        fill(107, 92, 62);
    }
    //          1 -- Floor
    // support
    if(step <= 1){
        stroke(66, 56, 37, 50);
    } else {
        stroke(66, 56, 37);
    }
    strokeWeight(5);
    line(150, 430, 170, 410);
    line(350, 420, 340, 410);
    noStroke();
    // stands
    rect(150, 400, 10, 50);
    rect(350, 403, 10, 47);
    rect(180, 400, 20, 50);
    rect(300, 400, 20, 50);
    if(step <= 1){
        fill(66, 56, 37, 50);
    } else {
        fill(66, 56, 37);
    }
    rect(200, 415, 100, 5);
    if(step <= 1){
        fill(107, 92, 62, 50);
    } else {
        fill(107, 92, 62);
    }
    // ground
    rect(150, 400, 200, 10);
    if(step <= 1){
        fill(125, 108, 73, 50);
    } else {
        fill(125, 108, 73);
    }
    rect(150, 393, 201, 10);
    triangle(350, 393, 350, 403, 360, 403);
    // stairs
    triangle(140, 405, 150, 405, 150, 393);
    if(step <= 1){
        fill(107, 92, 62, 50);
    } else {
        fill(107, 92, 62);
    }
    rect(120, 440, 40, 10);
    if(step <= 1){
        fill(125, 108, 73, 50);
    } else {
        fill(125, 108, 73);
    }
    triangle(130, 420, 140, 420, 150, 393);
    triangle(120, 440, 140, 440, 139, 420);
    if(step <= 1){
        fill(107, 92, 62,50);
    } else {
        fill(107, 92, 62);
    }
    rect(130, 420, 20, 20);
    rect(140, 403, 10, 20);
    
    // box
    if(gameState !== 3){
        rect(240, 385, 20, 15);
    } else {
        if(bodyGameOver.height >= 380){
            rect(240, bodyGameOver.height+60, 20, 15);
        } else {
            rect(240, bodyGameOver.height+45, 20, 15);
        }
    }
    if(step <= 2){
        fill(153, 130, 83, 50);
    } else {
        fill(153, 130, 83);
    }
    //          2 -- sideStands
    rect(180, 300, 20, 100);
    rect(300, 300, 20, 100);
    if(step <= 2){
        fill(102, 87, 57, 50);
    } else {
        fill(102, 87, 57);
    }
    rect(200, 300, 5, 100);
    rect(300, 310, 5, 90);
    // support side - top
    if(step <= 2){
        stroke(102, 87, 57, 50);
    } else {
        stroke(102, 87, 57);
    }
    line(204, 330, 225, 305);
    line(300, 330, 280, 305);
    noStroke();
    if(step <= 3){
        fill(153, 130, 83, 50);
    } else {
        fill(153, 130, 83);
    }
    //          3 -- top
    rect(180, 300, 120, 10);
    if(step <= 3){
        fill(102, 87, 57, 50);
    } else {
        fill(102, 87, 57);
    }
    rect(180, 298, 140, 2);
    
    if(step <= 4){
        stroke(61, 57, 32, 50);
    } else {
        stroke(61, 57, 32);
    }
    //          4 -- rope
    strokeWeight(2);
    line(250, 310, ropeAnchorX, ropeAnchorY);
    noStroke();
    if(gameState !== 3){
        if(step <= 6){
            fill(200,200,200, 50);
        } else {
            fill(200,200,200);
        }
        //          6 -- body || UPPER BODY
        ellipse(250, 360, 15, 30);
        // rope around neck
        if(step <= 6){
            fill(20, 20, 20, 50);
        } else {
            fill(20);
        }
        arc(250, 345, 10, 10, 0, 180);
        if(step <= 5){
            fill(200,200,200, 50);
        } else {
            fill(200,200,200);
        }
        //          5 -- body || HEAD
        ellipse(250, 340, 15, 15);
        if(step <= 7){
            fill(200,200,200, 50);
        } else {
            fill(200,200,200);
        }
        //          7 -- body || LEG LEFT
        rect(245, 370, 5, 15);
        if(step <= 8){
            fill(200,200,200, 50);
        } else {
            fill(200,200,200);
        }
        //          8 -- body || LEG RIGHT
        rect(251, 370, 5, 15);
    }
};

// draw all object

var wrongGuesses = 0;

var groundStart = 420;
var torchStart = 395;

var drawNonAnimatedObjects = function(){
    rectMode(LEFT);
    sunObj.drawSun();
    if(gameState === 2){
        if(groundStart < 550){
            groundStart++;
        }
    }
    ground(groundStart);
    if(gameState === 2){
        torch(50, torchStart, true);
        torch(450, torchStart, false);
        if(torchStart <= 500){
            torchStart++;
        }
    } else {
        torch(50, 405, true);
        torch(450, 405, false);
    }
    if(gameState !== 2){
        hangingStation(wrongGuesses+1);
    }
};

// --------- --------- --------- --------- ---------
// --------- ACTUAL GAME LOGIC STARTS HERE ---------
// --------- --------- --------- --------- ---------


// Start Screen
// --------------------------

// title animation
var r1_posX = -220;
var r2_posX = 720;

// new game button
var buttonColor = 220;
var b_posX = 250;
var b_posY = 450;

// select player mode button
// 1 player
var pm_b1_color = 220;
var pm_b1_posX = 150;
var pm_b1_posY = 370;
// 2 player
var pm_b2_color = 220;
var pm_b2_posX = 255;
var pm_b2_posY = 370;

// 2 player name areas
var name_area_p1_posX = 250;
var name_area_p1_posY = 188;
var name_area_p2_posX;
var name_area_p2_posY;

var playerName_p1 = "enter Name";
var playerName_p2 = "Yoloswaggings";

var drawSmiley = function(posX, posY, color){
    fill(100);
    ellipse(posX + 50, posY + 25, 25, 25);
    fill(color);
    ellipse(posX + 46, posY + 23, 5, 5);
    ellipse(posX + 54, posY + 23, 5, 5);
    arc(posX + 50, posY + 30, 12, 7, 0, 180);
};

var hangingGuy = new bodyObject();
var startCloud = new cloud(100, 100);
var anotherCloud = new cloud(-150, 70);

var drawStartScreen = function(){
    if(singlePlayer){
        pm_b1_color = 255;
        pm_b2_color = 240;
    } else {
        pm_b1_color = 240;
        pm_b2_color = 255;
    }
    
    background(198, 226, 247);
    
    startCloud.drawCloud();
    startCloud.moveCloud();
    anotherCloud.drawCloud();
    anotherCloud.moveCloud();
    
    // floating letters background
    
    for(var i = 0; i < lettersArray.length; i++){
        lettersArray[i].drawLetter();
        lettersArray[i].moveLetter();
    }
    
    // hanging guy
    
    strokeWeight(1);
    stroke(255,255,255);
    line(r1_posX, 220, hangingGuy.posX, hangingGuy.height);
    noStroke();
    hangingGuy.height = 250 + (mouseY / 20);
    hangingGuy.posX = 250 + (mouseX / 20 - 10);
    hangingGuy.drawBodyStart();
    
    // TITEL
    noStroke();
    rectMode(CENTER);
    fill(198, 226, 247);
    rect(250, 185, 220, 70);
    fill(255, 255, 255);
    textAlign(CENTER);
    textSize(50);
    text("Hangman", 250, 200);
    rect(r1_posX, 220, 220, 1);
    rect(r2_posX, 150, 220, 1);
    // NEW GAME BUTTON
    fill(buttonColor);
    rect(b_posX, b_posY, 200, 50);
    fill(100);
    textSize(20);
    text("New Game", b_posX, b_posY + 8);
    // SELECT SINGLE PLAYER OR MULTIPLAYER
    rectMode(LEFT);
    fill(pm_b1_color);
    rect(pm_b1_posX, pm_b1_posY, 95, 50);
    
    fill(pm_b2_color);
    rect(pm_b2_posX, pm_b2_posY, 95, 50);
    // Icons 
    // left
    drawSmiley(pm_b1_posX, pm_b1_posY);
    // right
    drawSmiley(pm_b2_posX - 20, pm_b2_posY);
    drawSmiley(pm_b2_posX + 15, pm_b2_posY);
    
    // name entry if 2 player
    if(singlePlayer === false){
        fill(198, 226, 247);
        rectMode(CENTER);
        rect(name_area_p1_posX, name_area_p1_posY, 210, 60);
        fill(255);
        textSize(50);
        text(playerName_p1, name_area_p1_posX, name_area_p1_posY + 15);
        rectMode(LEFT);
    }
};

// IN GAME
// --------------------------

// pressedKey == all letters that are right and pressed
var pressedKeys = [];
var letterAnimation = true;
var wrongKeys = [];

// generate new Word

var words = ["hallo","test","baum","wort","hangman","ente","produkt", "laptop", "xylophon", "rom", "dude","gitarre", "haltestelle", "laufen","yak","handy", "schnee", "tasse", "firlefanz","feuer","wasser","pfeiler", "tafel", "beamer", "steckdose", "pinnwand", "gras", "schlau","sonne","tonne", "wonne"];
var currentWord = "empty";

var generateWord = function(){
    var r = round(random(0, words.length));
    currentWord = words[r];
};

var drawUnderscores = function(){
    for(var i = 0; i < currentWord.length; i++){
        fill(240,240,240);
        rect((250 - (currentWord.length / 2) * 50) + i * 50, 520, 30, 5);
    }
};

var newGame = function(){
    // reset everything
    generateWord();
    ropeAnchorY = 330;
    wrongGuesses = 0;
    pressedKeys = [];
    wrongKeys = [];
    torchStart = 395;
    gameState = 1;
    bg_r = 198;
    bg_g = 226;
    bg_b = 247;
    groundStart = 420;
    sunObj.posY = 500;
    bodyGameOver.resetBody();
    gameOverTime = 0;
};

var winScreen = function(){
};

// clouds

var gameOverClouds = [];

for(var i = 0; i < 5; i++){
    gameOverClouds[i] = new cloud(-100, 100);
}

var gameOver = function(){
    // gameover text
    fill(255,255,255);
    textSize(20);
    text("Nice. You killed him.", 250, 150);
    textSize(40);
    text(currentWord, 250, 280);
    // score
    fill(0,0,0,0);
    stroke(255,255,255);
    rect(200, 60, 100, 60);
    noStroke();
    fill(255,255,255);
    text(overAllScore, 250, 100);
    textSize(10);
    text("TOTAL SCORE",250, 115);
    
    // show clouds
    for(var i = 0; i < gameOverClouds.length; i++){
        gameOverClouds[i].drawCloud();
        gameOverClouds[i].moveCloud();
    }
};

// --------- --------- --------- --------- ---------
// --------- ---------   INPUT   --------- ---------
// --------- --------- --------- --------- --------- 

var newGameButtonAlpha = 20;

var mouseMoved = function(){
    // START SCREEN
    if(gameState === 0){
        // highlight start button
        if((mouseX > b_posX - 100 && mouseX < b_posX + 100) && (mouseY > b_posY - 25 && mouseY < b_posY+25)){
            buttonColor = 255;
        } else {
            buttonColor = 240;
        }
    }
    // new game button
    if(gameState === 2 || gameState === 3){
        if((mouseX > 170 && mouseX < 325) && (mouseY > 445 && mouseY < 510)){
            newGameButtonAlpha = 100;
        } else {
            newGameButtonAlpha = 20;
        }
    }
};

var mousePressed = function(){
    // new game from start button
    if(gameState === 0){
        // start new game
        if((mouseX > b_posX - 100 && mouseX < b_posX + 100) && (mouseY > b_posY - 25 && mouseY < b_posY+25)){
            gameState = 1;
            newGame();
        }
        // select player
        if((mouseX > pm_b1_posX && mouseX < pm_b1_posX + 95) && (mouseY > pm_b1_posY && mouseY < pm_b1_posY+50)){
            singlePlayer = true;
        }
        if((mouseX > pm_b2_posX && mouseX < pm_b2_posX +95) && (mouseY > pm_b2_posY && mouseY < pm_b2_posY+50)){
            singlePlayer = false;
        }
    }
    // new game after game
    if(gameState === 2 || gameState === 3){
        if((mouseX > 170 && mouseX < 325) && (mouseY > 445 && mouseY < 510)){
            gameState = 1;
            newGame();
        } 
    }
};

var keyPressed = function(){
    var endPosAnimation;
    var positionInWord = [];
    var alreadyGuessed = false;
    var guess = false;
    
    // start 
    if(gameState === 0){
        
    }
    
    // in game
    if(gameState === 1){
        // check if letter is already guessed
        
        for(var i = 0; i < pressedKeys.length; i++){
            if(pressedKeys[i].content === key.toString()){
                alreadyGuessed = true;
            }
        }
        
        if(alreadyGuessed === false){
            // check if key if a right guess or false
            for(var i = 0; i < currentWord.length; i++){
                if(key.toString() === currentWord[i]){
                    guess = true;
                    positionInWord.push(i+1);
                }
            }
            
            if(guess){
                // create new letter object(s)
                for(var i = 0; i < positionInWord.length; i++){
                    
                    // da muss man auch erstmal drauf kommen (>.<)
                    endPosAnimation = (215 - (currentWord.length / 2) * 50) + positionInWord[i] * 50;
                    
                    var newLetter = new gameLetter(250,250,endPosAnimation,500,key.toString());
                    pressedKeys.push(newLetter);
                    letterAnimation = true;
                }
                if(pressedKeys.length === currentWord.length){
                    gameState = 2;
                    overAllScore++;
                    winScreen();
                }
            } else {
                // display wrong letter and move it somewhere up
                wrongGuesses++;
                var r = round(random(200, 300));
                wrongKeys.push(new gameLetter(250,250,r,0,key.toString()));
                if(wrongGuesses >= 8){
                    gameState = 3;
                    overAllScore = 0;
                    gameOver();
                }
            }
        }
    }
};

var fadeOut = 200;

var newGameButtonSize = 150;

var torchOnFire = true;

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
    if(gameState === 1 || gameState === 2){
        background(bg_r, bg_g, bg_b);
        textSize(20);
        fill(255,255,255);
        text("Score: " + overAllScore, 50, 30);
        
        fill(0,0,0);
        
        drawNonAnimatedObjects();
        
        for(var i = 0; i < psSize; i++){
            // left
            particleSystem[i].drawParticle();
            particleSystem[i].moveParticle();
            if(i === psSize-1){
                particleSystem.splice(1, 0, new fireParticle(50,torchStart));
                particleSystem.pop();
            }
            // right
            particleSystem2[i].drawParticle();
            particleSystem2[i].moveParticle();
            if(i === psSize-1){
                particleSystem2.splice(1, 0, new fireParticle(450,torchStart));
                particleSystem2.pop();
            }
        }
        
        // display current letter
        
        if(gameState === 2){
            fill(20,20,20,fadeOut);
            fadeOut -= 5;
            // change background sky color
            if(bg_r > 28){
                bg_r--;
            }
            if(bg_g > 41){
                bg_g--;
            }
            if(bg_b > 77){
                bg_b--;
            }
        } else {
            fill(20,20,20);
            drawUnderscores();
        }
        
        if(letterAnimation){
            for(var i = 0; i < pressedKeys.length; i++){
                pressedKeys[i].drawLetter();
                pressedKeys[i].moveLetter();
            }
            if(wrongKeys.length > 0){
                wrongKeys[wrongKeys.length-1].drawLetter();
                wrongKeys[wrongKeys.length-1].moveLetter();
            }
        }
    }
    // Winscreen
    if(gameState === 2){
        if(psSize > 0 && torchOnFire){
            psSize--;
        } else {
            torchOnFire = false;
        }
        if(!torchOnFire){
            psSize = 100;
        }
        for(var i = 0; i < currentWord.length; i++){
            pressedKeys[i].moveLetterToMid();
        }
        /*if(sunObj.posY > 250){
            sunObj.posY--;
        }*/
        rectMode(CENTER);
        fill(230,230,230, newGameButtonAlpha);
        rect(250, 480, newGameButtonSize, newGameButtonSize / 2.5);
        textSize(20);
        fill(230,240,240);
        text("new Game", 250, 485);
        
    }
    // GameOver
    if(gameState === 3){
        if(gameOverTime < 180){
            gameOverTime++;
        }
        if(bg_r < 247){
            bg_r++;
        }
        if(bg_g > 139){
            bg_g--;
        }
        if(bg_b > 139){
            bg_b--;
        }
        background(bg_r, bg_g, bg_b);
        strokeWeight(2);
        drawNonAnimatedObjects();
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
        gameOver();
        bodyGameOver.drawBody();
        if(gameOverTime === 180){
            bodyGameOver.moveBody();
            ropeAnchorX = 250;
            ropeAnchorY = bodyGameOver.height;
            
            // new game button
            rectMode(CENTER);
            fill(230,230,230, newGameButtonAlpha);
            rect(250, 480, newGameButtonSize, newGameButtonSize / 2.5);
            textSize(20);
            fill(230,240,240);
            text("new Game", 250, 485);
        }
    }
};