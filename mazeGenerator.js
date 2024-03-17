// The depth-first search algorithm of maze generation is frequently implemented using backtracking. This can be described with a following recursive routine:

// Given a current cell as a parameter
// Mark the current cell as visited
// While the current cell has any unvisited neighbour cells
// Choose one of the unvisited neighbours
// Remove the wall between the current cell and the chosen cell
// Invoke the routine recursively for the chosen cell
// which is invoked once for any initial cell in the area.


let cols, rows; // Variables to store the number of columns and rows in the grid 
const size = 50; // Size of each cell in the grid 
var grid = []; // Array to hold the cells of the grid 
var current; // Current cell being visited
var stack = []; // Stack for backtracking during maze generation

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
        // Array representing walls on each side of the cell
        this.walls = [true, true, true, true];
        // Flag to mark if the cell has been visited
        this.visited = false;
    }

    // Method to display the cell on the canvas
    show() {
        // Calculate the position of the cell on the canvas
        var x = this.i * size;
        var y = this.j * size;
        stroke(255); // Set color of cell to white

        // Draw walls of the cell
        if (this.walls[0]) line(x, y, x + size, y); // Top wall
        if (this.walls[1]) line(x + size, y, x + size, y + size); // Right wall
        if (this.walls[2]) line(x + size, y + size, x, y + size); // Bottom wall
        if (this.walls[3]) line(x, y + size, x, y); // Left wall

        // If cell has been visited, fill it with a semi-transparent color
        if (this.visited) {
            noStroke();
            fill(255, 0, 255, 100);
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

// Function to remove wall between current cell and neighboring cell
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

    // Create cells and add them to the grid
    for (var row = 0; row < rows; row++) {
        for (var column = 0; column < cols; column++) {
            var cell = new Cell(column, row);
            grid.push(cell);
        }
    }

    // Start maze generation from the first cell
    current = grid[0];
}

// Draw function to continuously update and display the grid
function draw() {
    background(40);

    // Display each cell in the grid
    for (var i = 0; i < grid.length; i++) {
        grid[i].show();
    }

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
}