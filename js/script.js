

/**
	By dev-abir(https://github.com/dev-abir)
*/

/////////////////////GLOBAL VARS/////////////////////
var canvas = document.getElementById("main_draw_area");
var ctx = canvas.getContext('2d');


/////////////////////SETTINGS/////////////////////
const CELL_WIDTH = 10;					// I may think about makeing it responsive later...
const CELL_HEIGHT = 10;					// I may think about makeing it responsive later...
const CELL_BORDER_WIDTH = 1				// I may think about makeing it responsive later...

const CANVAS_WIDTH = canvas.width;		// I may think about makeing it responsive later...
const CANVAS_HEIGHT = canvas.height;	// I may think about makeing it responsive later...

const N_ROWS = CANVAS_WIDTH / CELL_WIDTH;
const N_COLUMNS = CANVAS_HEIGHT / CELL_HEIGHT;

const DEFAULT_FPS = 10;


/////////////////////GLOBAL VARS/////////////////////
var previousCells;
var currentCells;

var mousedown = false;
var animationIntervalID;


/////////////////////GLOBAL FUNCS/////////////////////
function reset() {
	previousCells = generateDiedCells();
	currentCells = generateDiedCells();

	clearCanvas();

	window.clearInterval(animationIntervalID);
	animationIntervalID = undefined;
}

function clearCanvas() {
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // maybe it's not required, but I am not sure that canvas deletes all the previous drawings or not
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawAliveCell(column, row) {
	ctx.fillStyle = "red";
	ctx.fillRect((column * CELL_WIDTH) + CELL_BORDER_WIDTH, (row * CELL_HEIGHT) + CELL_BORDER_WIDTH, CELL_WIDTH - CELL_BORDER_WIDTH, CELL_HEIGHT - CELL_BORDER_WIDTH);
}

function drawDeadCell(column, row) {
	ctx.fillStyle = "black";
	ctx.fillRect((column * CELL_WIDTH) + CELL_BORDER_WIDTH, (row * CELL_HEIGHT) + CELL_BORDER_WIDTH, CELL_WIDTH - CELL_BORDER_WIDTH, CELL_HEIGHT - CELL_BORDER_WIDTH);
}

function aliveCells(clickPosX, clickPosY) {
	var canvasLeftEdge = canvas.offsetLeft + canvas.clientLeft;
	var canvasTopEdge = canvas.offsetTop + canvas.clientTop;

	clickCanvasPosX = clickPosX - canvasLeftEdge;
	clickCanvasPosY = clickPosY - canvasTopEdge;

	if (((clickCanvasPosX >= 0) && (clickCanvasPosX < CANVAS_WIDTH)) && (clickCanvasPosY >= 0) && (clickCanvasPosY < CANVAS_HEIGHT)) {

		var column = Math.trunc(clickCanvasPosX / CELL_WIDTH);
		var row = Math.trunc(clickCanvasPosY / CELL_HEIGHT);

		currentCells[column][row] = 1;
		drawAliveCell(column, row);
	}
}

function generateDiedCells() {
	var cells = new Array(N_COLUMNS); // create a single dimensional array with no.of columns...
	for (var i = 0; i < cells.length; i++) {
		cells[i] = new Array(N_ROWS); // create a single dimensional array with no.of rows, and assign it to each
		// each element of the SDA, created above, to create a DDA, in which cells[i][j] represents cell at x-coord 'i' and y-coord 'j'
	}

	for (var i = 0; i < N_COLUMNS; i++) {
		for (var j = 0; j < N_ROWS; j++) {
			cells[i][j] = 0; // 1 = "alive", 0 = "dead"
		}
	}
	return cells;
}

function getNumberOfAliveNeighbours(cellsArray, column, row) {
	var result = 0;
	for (var i = (column - 1); i <= (column + 1); i++) {
		for (var j = (row - 1); j <= (row + 1); j++) {
			if ((i == column) && (j == row)) {
				continue; // exclude itself
			} else {
				var x = i,  y = j;

				/*wrap around*/
				if (i == -1) x = N_COLUMNS - 1;
				else if (i == N_COLUMNS) x = 0;

				if (j == -1) y = N_ROWS - 1;
				else if (j == N_ROWS) y = 0;
				/**/

				if (cellsArray[x][y] == 1) result += 1;
			}
		}
	}
	return result;
}

function update() {
	clearCanvas();
	previousCells = JSON.parse(JSON.stringify(currentCells));	// want a much more efficient way...
	for (var i = 0; i < previousCells.length; i++) {
		for (var j = 0; j < previousCells[0].length; j++) {
			var nAlive = getNumberOfAliveNeighbours(previousCells, i, j);
			if (previousCells[i][j] == 1) {
				if (nAlive < 2) currentCells[i][j] = 0;
				else if (nAlive > 3) currentCells[i][j] = 0;
				else drawAliveCell(i, j);
			} else {
				if (nAlive == 3) { currentCells[i][j] = 1; drawAliveCell(i, j); }
			}
		}
	}
}

function startAnimation() {
	window.clearInterval(animationIntervalID); 
	var FPS = document.getElementById("input_FPS").value ? document.getElementById("input_FPS").value : DEFAULT_FPS;
	animationIntervalID = window.setInterval(update, 1000/FPS);
}

function fillRandom() {
	var x;
	for (var i = 0; i < currentCells.length; i++) {
		for (var j = 0; j < currentCells[0].length; j++) {
			x = Math.round(Math.random()); // 1 = "alive", 0 = "dead"
				if (x) {
				currentCells[i][j] = x;
				drawAliveCell(i, j);
			}
		}
	}
}

function fillGliderGun() {
	var data = [[0, 2], [0, 3], [1, 2], [1, 3], [8, 3], [8, 4], [9, 2], [9, 4], [10, 2], [10, 3], [16, 4], [16, 5], [16, 6], [17, 4], [18, 5], [22, 1], [22, 2], [23, 0], [23, 2], [24, 0], [24, 1], [24, 12], [24, 13], [25, 12], [25, 14], [26, 12], [34, 0], [34, 1], [35, 0], [35, 1], [35, 7], [35, 8], [35, 9], [36, 7], [37, 8]];

	for (var i = 0; i < data.length; i++) {
		currentCells[Math.trunc(N_ROWS / 4) + data[i][0]][Math.trunc(N_COLUMNS / 4) + data[i][1]] = 1; // 1 = "alive", 0 = "dead"
		drawAliveCell(Math.trunc(N_ROWS / 4) + data[i][0], Math.trunc(N_COLUMNS / 4) + data[i][1]);
	}
}


/////////////////////<SUGGEST A LABEL HERE...>/////////////////////
reset();

var btn_start = document.getElementById('button_start');
var btn_stop = document.getElementById('button_stop');
var btn_clear_reset = document.getElementById('button_clear_reset');
var btn_fill_random = document.getElementById('button_fill_random');
var btn_fill_glider_gun = document.getElementById('button_fill_glider_gun');
var inp_fps = document.getElementById('input_FPS');


canvas.addEventListener('mouseout', function(event) { mousedown = false; }, false);
canvas.addEventListener('mousedown', function(event) { mousedown = true; aliveCells(event.pageX, event.pageY); }, false);
canvas.addEventListener('mousemove', function(event) { if (mousedown) aliveCells(event.pageX, event.pageY); }, false);
canvas.addEventListener('mouseup', function(event) { mousedown = false }, false);

// works for both mobile and pc
btn_start.addEventListener('click', function(event) { startAnimation(); }, false);
btn_stop.addEventListener('click', function(event) { window.clearInterval(animationIntervalID); animationIntervalID = undefined; }, false);
btn_clear_reset.addEventListener('click', function(event) { reset(); }, false);
btn_fill_random.addEventListener('click', function(event) { reset(); fillRandom(); }, false);
btn_fill_glider_gun.addEventListener('click', function(event) { reset(); fillGliderGun(); }, false);
inp_fps.addEventListener('input', function(event) { if (animationIntervalID) startAnimation(); }, false);

// for mobile devices
canvas.addEventListener('touchcancel', function(event) { event.preventDefault(); mousedown = false; }, false);
canvas.addEventListener('touchstart', function(event) { event.preventDefault(); mousedown = true; aliveCells(event.touches[0].pageX, event.touches[0].pageY); }, false);
canvas.addEventListener('touchmove', function(event) { event.preventDefault(); if (mousedown) aliveCells(event.touches[0].pageX, event.touches[0].pageY); }, false);
canvas.addEventListener('touchend', function(event) { event.preventDefault(); mousedown = false; }, false);
