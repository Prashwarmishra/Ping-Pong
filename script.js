/*-----------------variable declaration-------------------------*/
const ball = document.getElementById('ball');
const rod1 = document.getElementById('player1');
const rod2 = document.getElementById('player2');
const storeName = "BestPlayerName";
const storeScore = "BestPlayerMaxScore";
const rod1Name = "Player1";
const rod2Name = "Player2";
let score;
let maxScore;
let movement;
let rod;
let ballSpeedX = 3;
let ballSpeedY = 3;
let gameOn = false;

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

/*-----------------------Event Listeners-------------------------*/
window.addEventListener('keypress', startGame);


/*----------------------Function declaration --------------------*/

//function to get data from localStorage
function init(){
    rod = localStorage.getItem(storeName);
    maxScore = localStorage.getItem(storeScore);

    //if no data is available in the localStorage, display a message stating 1st game being played
    if (rod === null || maxScore === null) {
        alert("First game, get ready!");
        maxScore = 0;
        rod = "Player1"
    } 
    alert('Press Enter or Space to start the game. To move rods, press a or s.');
    resetBoard(rod);
}
init();

//function to reset the positions of rods, ball, score and game status
function resetBoard(rodName) {

    //place the rods at the center of screen along x axis
    rod1.style.left = (window.innerWidth - rod1.offsetWidth) / 2 + 'px';
    rod2.style.left = (window.innerWidth - rod2.offsetWidth) / 2 + 'px';

    //place the ball to the center of the rod along x axis
    ball.style.left = (windowWidth - ball.offsetWidth) / 2 + 'px';

    // ball is passed to player 1 first and then to loosing player
    if (rodName === rod2Name) {
        ball.style.top = (rod1.offsetTop + rod1.offsetHeight) + 'px';
        ballSpeedY = 3;
    } else if (rodName === rod1Name) {
        ball.style.top = (rod2.offsetTop - rod2.offsetHeight) + 'px';
        ballSpeedY = -3;
    }

    //initialise the score and set game status to false
    score = 0;
    gameOn = false;
}



function storeWin(rod, score) {

    //if current score exceeds maxScore, update the maxScore and the player in local storage
    if (score > maxScore) {
        maxScore = score;
        localStorage.setItem(storeName, rod);
        localStorage.setItem(storeScore, maxScore);
    }

    //clear the set interval to stop the game
    clearInterval(movement);

    //reset the board and pass the loser
    resetBoard(rod);

    //display game result
    alert(`${rod} won scoring ${score*100}. Max score: ${maxScore*100}.`)
}


//function to start the game
function startGame() {

    //set the rod speed
    let rodSpeed = 20;

    let rodRect = rod1.getBoundingClientRect();

    //if key d/D is pressed and there's space left on rightside of the rod, move the rod to right by 20px
    if (event.code === "KeyD" && ((rodRect.x + rodRect.width) < window.innerWidth)) {
        rod1.style.left = (rodRect.x) + rodSpeed + 'px';
        rod2.style.left = rod1.style.left;
    } 
    //if key a/A is pressed and there's space left on left side of the rod, move the rod to left by 20px
    else if (event.code === "KeyA" && (rodRect.x > 0)) {
        rod1.style.left = (rodRect.x) - rodSpeed + 'px';
        rod2.style.left = rod1.style.left;
    }

    //game will start upon pressing start or Enter
    if (event.code === "Enter" || event.code === 'Space') {

        //once enter or space is pressed, start the game only when it wasn't started before
        if (!gameOn) {

            //change the game status to indicate that the game has started
            gameOn = true;

            //get ball dimensions
            let ballRect = ball.getBoundingClientRect();
            let ballX = ballRect.x;
            let ballY = ballRect.y;
            let ballDia = ballRect.width;

            //get the height and width of rod1 and rod2
            let rod1Height = rod1.offsetHeight;
            let rod2Height = rod2.offsetHeight;
            let rod1Width = rod1.offsetWidth;
            let rod2Width = rod2.offsetWidth;

            //set an interval after every 10ms till the game ends
            movement = setInterval(function () {
                // change the x and y coordinates of ball to move the ball
                ballX += ballSpeedX;
                ballY += ballSpeedY;

                rod1X = rod1.getBoundingClientRect().x;
                rod2X = rod2.getBoundingClientRect().x;

                ball.style.left = ballX + 'px';
                ball.style.top = ballY + 'px';

                //reverse the ball's x direction if it reaches either side of the screen
                if ((ballX + ballDia) > windowWidth || ballX < 0) {
                    ballSpeedX = -ballSpeedX; 
                }

                // It specifies the center of the ball on the viewport
                let ballPos = ballX + ballDia / 2;

                // Check for Rod 1
                if (ballY <= rod1Height) {
                    ballSpeedY = -ballSpeedY; // Reverses the direction
                    score++;

                    // Check if the game ends, if it ends clear the interval and declare player 2 the winner
                    if ((ballPos < rod1X) || (ballPos > (rod1X + rod1Width))) {
                        storeWin(rod2Name, score);
                    }
                }

                // Check for Rod 2
                else if ((ballY + ballDia) >= (windowHeight - rod2Height)) {
                    ballSpeedY = -ballSpeedY; // Reverses the direction
                    score++;

                    // Check if the game ends, if it ends clear the interval and declare player 1 the winner
                    if ((ballPos < rod2X) || (ballPos > (rod2X + rod2Width))) {
                        storeWin(rod1Name, score);
                    }
                }
            }, 10);
        }
    }
}

