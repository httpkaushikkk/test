
//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34; //width/height ratio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

// var dynamicString;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

var text="";

//pipes
let pipeArray = [];
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2.5; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.3;

let gameOver = false;
let score = 0;

var dynamicString = ""
dynamicString = new URLSearchParams(window.location.search).get('dynamicString');

// Check if the parameter is present and not empty
if (dynamicString) {
    console.log('Dynamic String:', dynamicString);

    // Now you can use the dynamicString in your logic
    // For example, set it as innerHTML of an element
    var yourElement = document.getElementById('yourElementId');
    if (yourElement) {
        yourElement.innerHTML = dynamicString;
    }
} else {
    console.log('Dynamic String not found or empty');
}

async function loadAssets() {
    try {
        var response = "";
        if(dynamicString!=null && dynamicString!=[]  && dynamicString !=""){
            response = dynamicString;
            // response = await fetch('./gameConfig.json');
            const gameConfig = JSON.parse(response);

            // Assuming gameConfig is an array with asset information
            for (const asset of gameConfig) {
                
                if(asset.asset_id == "flappyBird")
                {
                    birdImg = new Image();
                    birdImg.src = asset.asset_path;
                }
                else if(asset.asset_id == "topPipe")
                {
                    topPipeImg = new Image();
                    topPipeImg.src = asset.asset_path;
                }
                else if(asset.asset_id == "bottomPipe")
                {
                    bottomPipeImg = new Image();
                    bottomPipeImg.src = asset.asset_path;
    
                }
                else if(asset.asset_id == "scoreText"){
                    text = asset.asset_text;
                }
            }
        }
        else{
                birdImg = new Image();
                birdImg.src = "./assets/bottompipe.png";
                topPipeImg = new Image();
                topPipeImg.src = "./assets/bottompipe.png";
                bottomPipeImg = new Image();
                bottomPipeImg.src = "./assets/bottompipe.png";
        }
        
        
    } catch (error) {
        console.error('Error loading assets:', error);
    }
}


window.onload = async function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //draw flappy bird
    // context.fillStyle = "green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);
    // useDynamicString();
    await loadAssets();
    //load images
    
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }


    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //every 1.5 seconds
    document.addEventListener("keydown", handleKeyboardEvent);
    document.addEventListener('touchstart', handleTouchEvent);
    document.addEventListener('gesturestart', function (e) {
        e.preventDefault();
    });
    
    // Prevent double tap zoom on some mobile browsers
    document.addEventListener('touchend', function (e) {
        var now = new Date().getTime();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Additional prevention for certain mobile browsers
    document.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, { passive: false });
}

// function useDynamicString() {
//     // Access the global dynamicString variable
//     dynamicString = window.dynamicString;

//     // Use the dynamicString in your logic
//     console.log('Dynamic String:', dynamicString);

//     // Your additional logic here
// }

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to current bird.y, limit the bird.y to top of the canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)||score>=30) {
            gameOver = true;
        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //removes first element from the array
    }

    //score
    context.fillStyle = "white";
    context.font="45px sans-serif";
    context.fillText("Total Score - "+ score,5,45);
    if(score < 10){
        context.fillText(10-score+" more to Pepsi-250ml", 5, 90);
    }
    else if(score >= 10){
        birdImg.src = "./assets/flappybird01.png";
        birdImg.onload = function() {
            context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
        }
    }
    else if(score <= 30){
        
        context.fillText(text,5,90);
    }
    

    if (gameOver && score >=10 &&score<30) {
        
        context.fillText(text, 5, 135);
    }
    else if(gameOver && score>=30){
        context.fillText(text, 5, 135);
    }
    else if(gameOver){
        context.fillText(text, 5, 135);
    }
    
    
}

function placePipes() {
    if (gameOver) {
        return;
    }

    //(0-1) * pipeHeight/2.
    // 0 -> -128 (pipeHeight/4)
    // 1 -> -128 - 256 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function handleKeyboardEvent(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        //jump
        velocityY = -6;

        //reset game
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function handleTouchEvent() {
    
    //jump
    velocityY = -6;

    //reset game
    if (gameOver) {
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }

}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}