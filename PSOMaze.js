// The depth-first search algorithm of maze generation is frequently implemented using backtracking. This can be described with a following recursive routine:
// Given a current cell as a parameter
// Mark the current cell as visited
// While the current cell has any unvisited neighbour cells
// Choose one of the unvisited neighbours
// Remove the wall between the current cell and the chosen cell
// Invoke the routine recursively for the chosen cell
// which is invoked once for any initial cell in the area.


let cols, rows; 
const size = 50; // Size of each cell in the grid 
var grid = []; // Array to hold the cells of the grid 
let current; 
let last; 
let stack = [];
const particles = []; 
let noOfParticles = 1000; 
let speed = 1;
// buttons and sliders
let newMazeButton, startButton, pauseButton, resetButton;
let particleSlider, speedSlider;
let startButtonPressed = false;
let elapsedTime = "00:00:00";

// Function to calculate the index of a cell in the grid array
function index(column, row) {
    // Check if the column or row is out of bounds
    if (column < 0 || row < 0 || column > cols - 1 || row > rows - 1) {
        return -1;
    }
    // Return the calculated index
    return column + row * cols;
}
// Cell class representing each cell in the grid
class Cell {
    constructor(i, j) {
        // Column number of the cell
        this.i = i;
        // Row number of the cell
        this.j = j;

        this.walls = [true, true, true, true];
        
        this.visited = false;
    }

    show() {
        // Calculate the position of the cell on the canvas
        var x = this.i * size;
        var y = this.j * size;
        stroke(255);

        // Draw walls of the cell
        if (this.walls[0]) line(x, y, x + size, y); // Top wall
        if (this.walls[1]) line(x + size, y, x + size, y + size); // Right wall
        if (this.walls[2]) line(x + size, y + size, x, y + size); // Bottom wall
        if (this.walls[3]) line(x, y + size, x, y); // Left wall

        // If cell has been visited, fill it with a semi-transparent color
        if (this.visited && this !== last && this !== grid[0]) {
            noStroke();
            fill(206, 20, 131, 100);
            rect(x, y, size, size);
        } 
        
    }

    // Method to check neighboring cells and return unvisited neighbors
    checkNeighbours() {
        var neighbours = [];

        // Get neighboring cells
        var top = grid[index(this.i, this.j - 1)];    // Top neighbor
        var right = grid[index(this.i + 1, this.j)];  // Right neighbor
        var bottom = grid[index(this.i, this.j + 1)]; // Bottom neighbor
        var left = grid[index(this.i - 1, this.j)];   // Left neighbor

        // Add unvisited neighbors to the list
        if (top && !top.visited) neighbours.push(top);
        if (right && !right.visited) neighbours.push(right);
        if (bottom && !bottom.visited) neighbours.push(bottom);
        if (left && !left.visited) neighbours.push(left);

        // Return list of unvisited neighbors
        return neighbours.length > 0 ? neighbours[floor(random(0, neighbours.length))] : undefined;
    }
}

// Function to remove wall between current cell and neighboring cell to generate maze
function removeWall(current, neighbour) {
    // Calculate the difference between the row and column indices of the neighboring cell and the current cell
    var x = current.i - neighbour.i;

    // Remove wall between current cell and neighboring cell based on their relative positions
    if (x === 1) {
        current.walls[3] = false;
        neighbour.walls[1] = false;
    } else if (x === -1) {
        current.walls[1] = false;
        neighbour.walls[3] = false;
    }

    var y = current.j - neighbour.j;
    if (y === 1) {
        current.walls[0] = false;
        neighbour.walls[2] = false;
    } else if (y === -1) {
        current.walls[2] = false;
        neighbour.walls[0] = false;
    }
}


// Setup function to initialize the canvas and grid
function setup() {
    createCanvas(1000, 800);
    cols = floor(width / size);
    rows = floor(height / size);
    
    frameRate(120);

    document.getElementById("time-heading").textContent = "ELAPSED TIME: " + elapsedTime; 

    // Create cells and add them to the grid
    for (var row = 0; row < rows; row++) {
        for (var column = 0; column < cols; column++) {
            var cell = new Cell(column, row);
            grid.push(cell);
        }
    }

    generateMaze();

    
    // Create the "Generate New Maze" button
    newMazeButton = createButton('Generate New Maze');
    newMazeButton.position(1150, 200);
    newMazeButton.elt.addEventListener('click', generateNewMaze);
    newMazeButton.style('background-color', '#4CAF50');
    newMazeButton.style('padding', '10px 20px');
    newMazeButton.style('font-size', '16px');
    newMazeButton.style('border', 'none');
    newMazeButton.style('border-radius', '5px');

    // Create the "Start" button
    startButton = createButton("Start the Maze");
    startButton.position(1150, 250);
    startButton.elt.addEventListener('click', startMaze);
    startButton.style('background-color', '#4CAF50');
    startButton.style('padding', '10px 20px');
    startButton.style('font-size', '16px');
    startButton.style('border', 'none');
    startButton.style('border-radius', '5px');

    // Create the "Pause" button
    pauseButton = createButton("Pause the Maze");
    pauseButton.position(1150, 300);
    pauseButton.elt.addEventListener('click', pauseMaze);
    pauseButton.attribute('disabled', true);
    pauseButton.style('background-color', '#4CAF50');
    pauseButton.style('padding', '10px 20px');
    pauseButton.style('font-size', '16px');
    pauseButton.style('border', 'none');
    pauseButton.style('border-radius', '5px');

    // Create the "Stop" button
    resetButton = createButton("Reset the Maze");
    resetButton.position(1150, 350);
    resetButton.elt.addEventListener('click', resetMaze);
    resetButton.attribute('disabled', true);
    resetButton.style('background-color', '#4CAF50');
    resetButton.style('padding', '10px 20px');
    resetButton.style('font-size', '16px');
    resetButton.style('border', 'none');
    resetButton.style('border-radius', '5px');

    // paramters: min, max, initial value, step
    // Create the "Number of Particles" slider
    particleSlider = createSlider(300, 10000, noOfParticles, 50);
    noOfParticles = particleSlider.value();
    particleSlider.position(1450, 200);
    particleSlider.size(200);
    // Function to create no of particles based on the slider value
    particleSlider.input(() => {
        noOfParticles = particleSlider.value();
    });

    // Create the "Speed" slider
    speedSlider = createSlider(1, 10, speed, 1);
    speed = speedSlider.value();
    speedSlider.position(1450, 250);
    speedSlider.size(200);
    // function to change the speed of the particles based on the slider value
    speedSlider.input(() => {
        speed = speedSlider.value();
    });
}


// Draw function to continuously update and display the grid
function draw() {
    background(40);
    
    // Values of the Sliders
    document.getElementById("particle-text").textContent = "Particles: " + particleSlider.value();
    document.getElementById("speed-text").textContent = "Speed: " + speedSlider.value();


    // Display each cell in the grid
    for (var i = 0; i < grid.length; i++) {
        grid[i].show();
    }

    // display the particles 
    // if condition to check if start button is pressed
    for (var i = 0; i < particles.length; i++){
        particles[i].show();
        if (startButtonPressed) {
            particles[i].move();
            particles[i].handleCollision();
        }
    }

    
}

// function that generates the maze instantly instead of backtracking every cell, as seen previously
function generateMaze() {
    // Start maze generation from the first cell
    current = grid[0];
    last = grid[grid.length - 1];

    // Create a stack to hold the path
    stack = [];

    // Generate the maze
    while (true) {
        // Mark current cell as visited
        current.visited = true;

        // Get a random unvisited neighbor of the current cell
        var next = current.checkNeighbours();

        // If a valid neighbor is found
        if (next) {
            // Mark neighbor as visited
            next.visited = true;
            // Add current cell to the stack
            stack.push(current);
            // Remove wall between current cell and neighbor
            removeWall(current, next);
            // Move to the neighbor
            current = next;
        }
        // If no valid neighbor is found and there are cells in the stack
        else if (stack.length > 0) {
            // Pop a cell from the stack and make it the current cell
            current = stack.pop();
        }
        // If the stack is empty, the maze is complete
        else {
            break;
        }
    }
}  

// Function to generate new maze
function generateNewMaze() {
    // Reset the grid
    grid = [];
    stack = [];
    clear();

    if (particleSlider.attribute('disabled')) {
        particleSlider.removeAttribute('disabled');
    }
    if (speedSlider.attribute('disabled')) {
        speedSlider.removeAttribute('disabled');
    }
    if (startButton.attribute('disabled')) {
        startButton.removeAttribute('disabled');
    }
    pauseButton.attribute('disabled', true);
    resetButton.attribute('disabled', true);

    // Create cells and add them to the grid
    for (var row = 0; row < rows; row++) {
        for (var column = 0; column < cols; column++) {
            var cell = new Cell(column, row);
            grid.push(cell);
        }
    }

    generateMaze();
    particles.splice(0, particles.length); // Remove all particles
}

// Function to start the maze
function startMaze() {
    // setting up the initialization of the particles 
    for (var i = 0; i < noOfParticles; i++) {
        let particle = new Particle();
        particle.velocity.mult(speed);
        particles.push(particle);
    }

    startButtonPressed = true;

    // disable all these buttons and sliders
    startButton.attribute('disabled', true);
    speedSlider.attribute('disabled', 'true'); 
    particleSlider.attribute('disabled', 'true');

    // enable stop and reset buttons
    if (pauseButton.attribute('disabled')) {
        pauseButton.removeAttribute('disabled');
    }
    if (resetButton.attribute('disabled')) {
        resetButton.removeAttribute('disabled');
    }
}

// Function to pause the maze
function pauseMaze() {
    startButtonPressed = false;
    startButton.removeAttribute('disabled');
    pauseButton.attribute('disabled', true);
}

// Function to reset the maze
function resetMaze() {
    if (startButtonPressed || pauseButton.attribute('disabled')) {
        startButtonPressed = false;
        startButton.removeAttribute('disabled');
        // removing previous and creating new particles
        particles.splice(0, particles.length); 
        for (var i = 0; i < noOfParticles; i++) {
            let particle = new Particle();
            particles.push(particle);
        }
        // disable the pause and reset buttons
        resetButton.attribute('disabled', true);
        pauseButton.attribute('disabled', true);
        // enable the sliders
        speedSlider.removeAttribute('disabled'); 
        particleSlider.removeAttribute('disabled');
    }
}

class Particle {
    constructor() {
        this.radius = 10;

        // the ball will appear in the first cell, however, it will be random between 1 - 50 at what pixel it appears 
        this.position = createVector(grid[0].i * size + random(size - 10), grid[0].j * size + random(size- 10)); // position of the particles, will always start with the first cell
        this.velocity = p5.Vector.random2D(); // new 2D unit vector with a random heading.
    }

    show() { // style of the ellipse
        stroke(0, 150);
        fill(112, 183, 126);
        ellipse(this.position.x, this.position.y, this.radius);
    }

    move() {
        this.position.add(this.velocity); // continuously adds the change in position to the position vector 
    }

    handleCollision() {
        for (var gridElement = 0; gridElement < grid.length; gridElement++) {
            var cell = grid[gridElement];
            if (this.position.x > cell.i * size && this.position.x < (cell.i + 1) * size &&
                this.position.y > cell.j * size && this.position.y < (cell.j + 1) * size) {
                // Particle is inside the cell
                if (cell.walls[0] && this.position.y - this.radius < cell.j * size) {
                    // Top wall collision
                    this.velocity.y *= -1; // Reverse the y velocity
                    this.position.y = cell.j * size + this.radius; // Adjust position to prevent overlap
                }
                if (cell.walls[1] && this.position.x + this.radius > (cell.i + 1) * size) {
                    // Right wall collision
                    this.velocity.x *= -1; // Reverse the x velocity
                    this.position.x = (cell.i + 1) * size - this.radius; // Adjust position to prevent overlap
                }
                if (cell.walls[2] && this.position.y + this.radius > (cell.j + 1) * size) {
                    // Bottom wall collision
                    this.velocity.y *= -1; // Reverse the y velocity
                    this.position.y = (cell.j + 1) * size - this.radius; // Adjust position to prevent overlap
                }
                if (cell.walls[3] && this.position.x - this.radius < cell.i * size) {
                    // Left wall collision
                    this.velocity.x *= -1; // Reverse the x velocity
                    this.position.x = cell.i * size + this.radius; // Adjust position to prevent overlap
                }
            }
        }
        
    }
}
