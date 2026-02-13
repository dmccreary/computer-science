// Nested List Grid Visualizer MicroSim
// Interactive grid showing how nested lists work with double-index notation

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Grid data presets
let grids = {
  numbers: {
    name: 'Number Grid',
    data: [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, 16]
    ]
  },
  tictactoe: {
    name: 'Tic-Tac-Toe',
    data: [
      ['X', 'O', 'X'],
      ['O', 'X', 'O'],
      ['O', 'X', 'X']
    ]
  },
  gradebook: {
    name: 'Gradebook',
    data: [
      ['Alice', 92, 88, 95],
      ['Bob', 85, 90, 87],
      ['Charlie', 78, 82, 80]
    ]
  }
};

let currentGridKey = 'numbers';
let selectedRow = -1;
let selectedCol = -1;
let highlightRow = -1; // For row-only highlight

// Quiz mode
let quizMode = false;
let quizRow = -1;
let quizCol = -1;
let quizMessage = '';
let quizCorrect = false;

// Controls
let numberBtn, tttBtn, gradeBtn, quizBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Row 1: Preset buttons and quiz toggle
  numberBtn = createButton('Number Grid');
  numberBtn.position(10, drawHeight + 10);
  numberBtn.mousePressed(() => { currentGridKey = 'numbers'; resetSelection(); });

  tttBtn = createButton('Tic-Tac-Toe');
  tttBtn.position(110, drawHeight + 10);
  tttBtn.mousePressed(() => { currentGridKey = 'tictactoe'; resetSelection(); });

  gradeBtn = createButton('Gradebook');
  gradeBtn.position(205, drawHeight + 10);
  gradeBtn.mousePressed(() => { currentGridKey = 'gradebook'; resetSelection(); });

  quizBtn = createButton('Quiz Mode');
  quizBtn.position(295, drawHeight + 10);
  quizBtn.mousePressed(toggleQuiz);

  describe('Interactive nested list grid visualizer showing double-index notation for accessing elements in a list of lists', LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area
  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(24);
  text('Nested List Grid Visualizer', canvasWidth / 2, 12);

  let grid = grids[currentGridKey].data;
  let rows = grid.length;
  let cols = grid[0].length;

  // Calculate cell sizes
  let maxCellW = 80;
  let maxCellH = 50;
  let labelSpace = 50; // space for row/col labels
  let availW = canvasWidth - 2 * margin - labelSpace;
  let availH = 180;
  let cellW = Math.min(maxCellW, availW / cols);
  let cellH = Math.min(maxCellH, availH / rows);
  let gridW = cols * cellW;
  let gridH = rows * cellH;
  let gridX = (canvasWidth - gridW - labelSpace) / 2 + labelSpace;
  let gridY = 70;

  // Column index labels
  noStroke();
  fill('#444');
  textAlign(CENTER, BOTTOM);
  textSize(13);
  for (let c = 0; c < cols; c++) {
    text(c, gridX + c * cellW + cellW / 2, gridY - 4);
  }

  // Column label header
  fill('#888');
  textSize(11);
  text('col', gridX + gridW / 2, gridY - 18);

  // Row index labels
  textAlign(RIGHT, CENTER);
  textSize(13);
  fill('#444');
  for (let r = 0; r < rows; r++) {
    text(r, gridX - 8, gridY + r * cellH + cellH / 2);
  }

  // Row label header
  fill('#888');
  textSize(11);
  textAlign(RIGHT, CENTER);
  text('row', gridX - 8, gridY - 10);

  // Draw grid cells
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let cx = gridX + c * cellW;
      let cy = gridY + r * cellH;

      let isSelected = (r === selectedRow && c === selectedCol);
      let isRowHighlight = (r === highlightRow && selectedCol === -1);

      if (isSelected) {
        fill('#FFD700');
        stroke('#B8860B');
        strokeWeight(2);
      } else if (isRowHighlight) {
        fill('#A8D8EA');
        stroke('#6BA3C4');
        strokeWeight(1.5);
      } else {
        fill((r + c) % 2 === 0 ? '#F5F5F5' : '#E8E8E8');
        stroke('#CCC');
        strokeWeight(1);
      }
      rect(cx, cy, cellW, cellH);

      // Cell text
      noStroke();
      fill(isSelected ? '#333' : '#555');
      textAlign(CENTER, CENTER);
      textSize(Math.min(14, cellW * 0.3));
      let val = grid[r][c];
      let displayVal = typeof val === 'string' ? '"' + val + '"' : val;
      text(displayVal, cx + cellW / 2, cy + cellH / 2);
    }
  }

  // Expression display below grid
  noStroke();
  textAlign(CENTER, TOP);

  if (quizMode) {
    // Quiz prompt
    fill('#003399');
    textSize(16);
    text('Click the cell for: grid[' + quizRow + '][' + quizCol + ']',
         canvasWidth / 2, gridY + gridH + 15);

    if (quizMessage !== '') {
      fill(quizCorrect ? '#006600' : '#CC0000');
      textSize(14);
      text(quizMessage, canvasWidth / 2, gridY + gridH + 40);
    }
  } else if (selectedRow >= 0 && selectedCol >= 0) {
    // Show selected expression
    fill('#006600');
    textSize(16);
    let val = grid[selectedRow][selectedCol];
    let displayVal = typeof val === 'string' ? '"' + val + '"' : val;
    text('grid[' + selectedRow + '][' + selectedCol + '] = ' + displayVal,
         canvasWidth / 2, gridY + gridH + 15);

    // Explanation
    fill('#555');
    textSize(13);
    text('Row ' + selectedRow + ', Column ' + selectedCol,
         canvasWidth / 2, gridY + gridH + 38);
  } else if (highlightRow >= 0) {
    fill('#003399');
    textSize(16);
    text('grid[' + highlightRow + '] = ' + JSON.stringify(grid[highlightRow]),
         canvasWidth / 2, gridY + gridH + 15);
  } else {
    fill('#888');
    textSize(14);
    text('Click a cell to see its index expression', canvasWidth / 2, gridY + gridH + 15);
  }

  // Python code
  fill('#333');
  textSize(12);
  textAlign(CENTER, TOP);
  let codeY = gridY + gridH + 60;
  text('grid = [', canvasWidth / 2 - 80, codeY);
  for (let r = 0; r < rows; r++) {
    text(JSON.stringify(grid[r]) + (r < rows - 1 ? ',' : ''),
         canvasWidth / 2, codeY + 16 + r * 16);
  }
  text(']', canvasWidth / 2 - 80, codeY + 16 + rows * 16);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function mousePressed() {
  let grid = grids[currentGridKey].data;
  let rows = grid.length;
  let cols = grid[0].length;

  let labelSpace = 50;
  let cellW = Math.min(80, (canvasWidth - 2 * margin - labelSpace) / cols);
  let cellH = Math.min(50, 180 / rows);
  let gridW = cols * cellW;
  let gridX = (canvasWidth - gridW - labelSpace) / 2 + labelSpace;
  let gridY = 70;

  // Check if click is on row label
  if (mouseX >= gridX - 40 && mouseX < gridX && mouseY >= gridY && mouseY < gridY + rows * cellH) {
    let r = Math.floor((mouseY - gridY) / cellH);
    if (r >= 0 && r < rows) {
      highlightRow = r;
      selectedRow = -1;
      selectedCol = -1;
      return;
    }
  }

  // Check cell clicks
  if (mouseX >= gridX && mouseX < gridX + cols * cellW &&
      mouseY >= gridY && mouseY < gridY + rows * cellH) {
    let c = Math.floor((mouseX - gridX) / cellW);
    let r = Math.floor((mouseY - gridY) / cellH);
    if (r >= 0 && r < rows && c >= 0 && c < cols) {
      if (quizMode) {
        if (r === quizRow && c === quizCol) {
          quizMessage = 'Correct!';
          quizCorrect = true;
          // Generate new quiz after a moment
          setTimeout(generateQuiz, 1000);
        } else {
          quizMessage = 'That is grid[' + r + '][' + c + ']. Try again!';
          quizCorrect = false;
        }
      } else {
        selectedRow = r;
        selectedCol = c;
        highlightRow = -1;
      }
    }
  }
}

function resetSelection() {
  selectedRow = -1;
  selectedCol = -1;
  highlightRow = -1;
  quizMode = false;
  quizMessage = '';
  quizBtn.html('Quiz Mode');
}

function toggleQuiz() {
  quizMode = !quizMode;
  quizBtn.html(quizMode ? 'Exit Quiz' : 'Quiz Mode');
  selectedRow = -1;
  selectedCol = -1;
  highlightRow = -1;
  quizMessage = '';
  if (quizMode) {
    generateQuiz();
  }
}

function generateQuiz() {
  let grid = grids[currentGridKey].data;
  quizRow = Math.floor(Math.random() * grid.length);
  quizCol = Math.floor(Math.random() * grid[0].length);
  quizMessage = '';
  selectedRow = -1;
  selectedCol = -1;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
