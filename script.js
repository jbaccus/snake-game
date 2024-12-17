// Get the canvas element and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Get the score element
const scoreElement = document.getElementById('score');

// Define the size of each box in the grid
const box = 20;
const canvasSize = 400;
const rows = canvasSize / box;
const cols = canvasSize / box;

// Initialize the snake with one segment
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

// Generate the initial food position
let food = {
    x: Math.floor(Math.random() * cols) * box,
    y: Math.floor(Math.random() * rows) * box
};

// Define obstacles
let obstacles = [
    { x: 5 * box, y: 5 * box },
    { x: 10 * box, y: 10 * box },
    { x: 15 * box, y: 15 * box }
];

// Initialize the score and direction
let score = 0;
let direction;


// Listen for keydown events to set the direction
document.addEventListener('keydown', setDirection);

function setDirection(event) {
    if (event.keyCode === 37 && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (event.keyCode === 38 && direction !== 'DOWN') {
        direction = 'UP';
    } else if (event.keyCode === 39 && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if (event.keyCode === 40 && direction !== 'UP') {
        direction = 'DOWN';
    }
}

// Check for collision with the snake itself
function collision(newHead, snake) {
    for (let i = 0; i < snake.length; i++) {
        if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// Draw the game elements on the canvas
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw the snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? 'green' : 'white';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = 'red';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw the food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    // Draw the obstacles
    ctx.fillStyle = 'gray';
    for (let i = 0; i < obstacles.length; i++) {
        ctx.fillRect(obstacles[i].x, obstacles[i].y, box, box);
    }

    // Get the current head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Update the head position based on the direction
    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    // Wrap the snake position when it goes through the wall
    if (snakeX < 0) snakeX = canvasSize - box;
    if (snakeY < 0) snakeY = canvasSize - box;
    if (snakeX >= canvasSize) snakeX = 0;
    if (snakeY >= canvasSize) snakeY = 0;

    // Check if the snake has eaten the food
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        scoreElement.innerHTML = "Score: " + score;
        // Generate new food position
        food = {
            x: Math.floor(Math.random() * cols) * box,
            y: Math.floor(Math.random() * rows) * box
        };
    } else {
        // Remove the last segment of the snake
        snake.pop();
    }

    // Create the new head position
    let newHead = {
        x: snakeX,
        y: snakeY
    };

    // Check for collision with itself or obstacles
    if (collision(newHead, snake) || collision(newHead, obstacles)) {
        clearInterval(game);
    }

    // Add the new head to the snake
    snake.unshift(newHead);

    // Draw the score
    ctx.fillStyle = 'white';
    ctx.font = '45px Changa one';
    ctx.fillText(score, 2 * box, 1.6 * box);
}

// Set the game loop to run every 100 milliseconds
let game = setInterval(draw, 200);