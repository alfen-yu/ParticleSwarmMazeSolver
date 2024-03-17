// The depth-first search algorithm of maze generation is frequently implemented using backtracking. This can be described with a following recursive routine:

// Given a current cell as a parameter
// Mark the current cell as visited
// While the current cell has any unvisited neighbour cells
// Choose one of the unvisited neighbours
// Remove the wall between the current cell and the chosen cell
// Invoke the routine recursively for the chosen cell
// which is invoked once for any initial cell in the area.


let cols, rows; // variables to store number of columns and rows in the grid 
const size = 50; // size of each cell in the grid 
var grid = []; // an array to hold the cells of the grid 

var current; // keep track of the visited cell in the grid 
var stack = []; 

function index(column, row) {
    if (column < 0 || row < 0 || column > cols - 1 || row > rows - 1){ // edge cases 
        return -1;
    }

    return column + row * cols; 
}

class Cell {
    constructor(i, j) {
        this.i = i; // i is the column number 
        this.j = j; // j is the row number
        this.walls = [true, true, true, true]; // each side of the wall
    }

    show() {
        var x = this.i * size; // x position of the cell
        var y = this.j * size; // y position of the cell
        stroke(255); // color of the cell = white 


        // walls of every grid box 
        if (this.walls[0]) { // top wall 
            line(x,        y,        x + size, y);
        }
        if (this.walls[1]) { // right wall 
            line(x + size, y,        x + size, y + size);
        }
        if (this.walls[2]) { // bottom wall 
            line(x + size, y + size, x,        y + size);
        }
        if (this.walls[3]) { // left wall 
            line(x,        y + size, x,        y);
        }

        if (this.visited) {
            // change the color of the visited node 
            noStroke();
            fill(255, 0, 255, 100);
            rect(x, y, size, size); 
        }
    }

    checkNeighbours() {
        var neighbours = [];
        
        // i is the column number, j is the row number 
        var top = grid[index(this.i, this.j - 1)];    // top neighbour 
        var right = grid[index(this.i + 1, this.j)];  // right neighbour
        var bottom = grid[index(this.i, this.j + 1)]; // bottom neighbour  
        var left = grid[index(this.i - 1, this.j)];   // left neighbour 

        if (top && !top.visited) {
            neighbours.push(top);
        }
        if (right && !right.visited) {
            neighbours.push(right);
        }
        if (bottom && !bottom.visited) {
            neighbours.push(bottom);
        }
        if (left && !left.visited) {
            neighbours.push(left);
        }

        if (neighbours.length > 0) {
            var randomNeighbour = floor(random(0, neighbours.length))
            return neighbours[randomNeighbour];
        }
        else {
            return undefined; 
        }
    }



}

function removeWall(current, neighbour) {
    // the differences between the row and columns of the neighbour and the current cell 
    var x = current.i - neighbour.i;

    if (x === 1){
        current.walls[3] = false;
        neighbour.walls[1] = false;
    }
    else if (x === -1) {
        current.walls[1] = false;
        neighbour.walls[3] = false;
    }

    var y = current.j - neighbour.j;
    if (y === 1) {
        current.walls[0] = false;
        neighbour.walls[2] = false;
    }
    else if (y === -1) {
        current.walls[2] = false;
        neighbour.walls[0] = false;
    }
}


// sets up the canvas and initialization of the cells 
function setup() {
    createCanvas(1000, 800);
    cols = floor(width / size);
    rows = floor(height / size);

    for (var row = 0; row < rows; row++) {
        for (var column = 0; column < cols; column++){
            var cell = new Cell(column, row); // each cell of the grid is the class Cell 
            grid.push(cell);
        }
    }

    current = grid[0]; 
}

function draw() {
    background(40);
    for (var i = 0; i < grid.length; i++) {
        grid[i].show();
    }

    current.visited = true; 

    var next = current.checkNeighbours();

    if (next) {
        next.visited = true;
        stack.push(current);
        removeWall(current, next)
        current = next; 
    }
    else if (stack.length > 0) { 
        current = stack.pop();
    }
}
