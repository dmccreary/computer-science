// Nested Loop Grid Visualizer MicroSim
// Animates cell-by-cell filling to show nested for loop execution order
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// Controls
let stepButton, autoButton, resetButton;
let sizeSlider;

// Grid state
let gridSize = 4;
let currentCell = -1;  // -1 = not started
let totalCells;
let isAutoPlaying = false;
let autoTimer = 0;
let autoInterval = 25;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  stepButton = createButton('Step');
  stepButton.position(10, drawHeight + 10);
  stepButton.mousePressed(doStep);

  autoButton = createButton('Auto Play');
  autoButton.position(65, drawHeight + 10);
  autoButton.mousePressed(toggleAutoPlay);

  resetButton = createButton('Reset');
  resetButton.position(145, drawHeight + 10);
  resetButton.mousePressed(doReset);

  sizeSlider = createSlider(2, 6, 4, 1);
  sizeSlider.position(280, drawHeight + 10);
  sizeSlider.size(canvasWidth - 280 - margin);
  sizeSlider.input(doReset);

  totalCells = gridSize * gridSize;

  describe('Animated grid that fills cell by cell to show nested for loop execution order. Step through or auto-play to see rows and columns fill.', LABEL);
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
  rect(0, drawHeight, canvasWidth, controlHeight);

  gridSize = sizeSlider.value();
  totalCells = gridSize * gridSize;

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Nested Loop Grid', canvasWidth / 2, 8);

  // Current variable values
  let curRow = -1, curCol = -1, iteration = -1;
  if (currentCell >= 0 && currentCell < totalCells) {
    curRow = Math.floor(currentCell / gridSize);
    curCol = currentCell % gridSize;
    iteration = currentCell + 1;
  } else if (currentCell >= totalCells) {
    iteration = totalCells;
    curRow = gridSize - 1;
    curCol = gridSize - 1;
  }

  // Variable display
  textSize(14);
  textAlign(CENTER, TOP);
  noStroke();

  let varY = 32;
  fill(60);
  text('row = ', canvasWidth / 2 - 100, varY);
  fill(curRow >= 0 ? [200, 60, 60] : [180]);
  textStyle(BOLD);
  text(curRow >= 0 ? curRow : '?', canvasWidth / 2 - 60, varY);
  textStyle(NORMAL);

  fill(60);
  text('col = ', canvasWidth / 2 - 10, varY);
  fill(curCol >= 0 ? [50, 130, 200] : [180]);
  textStyle(BOLD);
  text(curCol >= 0 ? curCol : '?', canvasWidth / 2 + 30, varY);
  textStyle(NORMAL);

  fill(60);
  text('iteration = ', canvasWidth / 2 + 75, varY);
  fill(iteration >= 0 ? [80] : [180]);
  textStyle(BOLD);
  text(iteration >= 0 ? iteration : '?', canvasWidth / 2 + 145, varY);
  textStyle(NORMAL);

  // Draw grid
  drawGrid();

  // Draw code panel
  drawCodePanel();

  // Auto play
  if (isAutoPlaying) {
    autoTimer++;
    if (autoTimer >= autoInterval) {
      autoTimer = 0;
      doStep();
    }
  }

  // Control labels
  noStroke();
  fill(80);
  textAlign(LEFT, CENTER);
  textSize(12);
  text('Size: ' + gridSize, 220, drawHeight + 25);
}

function drawGrid() {
  let gridTop = 60;
  let gridLeft = margin + 30;
  let gridAreaW = canvasWidth * 0.55;
  let gridAreaH = drawHeight - gridTop - 60;
  let cellSize = Math.min(gridAreaW / gridSize, gridAreaH / gridSize, 70);
  let gridW = cellSize * gridSize;
  let gridH = cellSize * gridSize;

  // Center the grid
  let gx = gridLeft;
  let gy = gridTop + (gridAreaH - gridH) / 2;

  // Row labels
  for (let r = 0; r < gridSize; r++) {
    let cy = gy + r * cellSize + cellSize / 2;
    let isActiveRow = (currentCell >= 0 && Math.floor(currentCell / gridSize) === r && currentCell < totalCells);

    noStroke();
    fill(isActiveRow ? [200, 60, 60] : 150);
    textAlign(CENTER, CENTER);
    textSize(12);
    textStyle(isActiveRow ? BOLD : NORMAL);
    text(r, gx - 18, cy);
    textStyle(NORMAL);
  }

  // Column labels
  for (let c = 0; c < gridSize; c++) {
    let cx = gx + c * cellSize + cellSize / 2;
    let isActiveCol = (currentCell >= 0 && currentCell % gridSize === c && currentCell < totalCells);

    noStroke();
    fill(isActiveCol ? [50, 130, 200] : 150);
    textAlign(CENTER, CENTER);
    textSize(12);
    textStyle(isActiveCol ? BOLD : NORMAL);
    text(c, cx, gy - 14);
    textStyle(NORMAL);
  }

  // Label headers
  noStroke();
  fill(100);
  textSize(10);
  textAlign(CENTER, CENTER);
  text('col', gx + gridW / 2, gy - 28);
  push();
  translate(gx - 32, gy + gridH / 2);
  rotate(-HALF_PI);
  text('row', 0, 0);
  pop();

  // Draw cells
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      let cellIdx = r * gridSize + c;
      let cx = gx + c * cellSize;
      let cy = gy + r * cellSize;

      let isCurrent = (cellIdx === currentCell && currentCell < totalCells);
      let isFilled = (cellIdx <= currentCell);

      if (isCurrent) {
        // Bright yellow glow for current
        fill(255, 230, 50);
        stroke(200, 180, 0);
        strokeWeight(3);
      } else if (isFilled) {
        // Gradient from light to dark blue based on fill order
        let t = cellIdx / Math.max(totalCells - 1, 1);
        fill(lerpColor(color(180, 210, 255), color(50, 100, 200), t));
        stroke(100, 140, 200);
        strokeWeight(1);
      } else {
        fill(255);
        stroke(200);
        strokeWeight(1);
      }

      rect(cx, cy, cellSize, cellSize, 4);

      // Cell content
      if (isFilled) {
        noStroke();
        fill(isCurrent ? 40 : 255);
        textAlign(CENTER, CENTER);
        textSize(cellSize > 50 ? 14 : 11);
        text(cellIdx + 1, cx + cellSize / 2, cy + cellSize / 2);
      }
    }
  }
}

function drawCodePanel() {
  let panelX = canvasWidth * 0.6 + 10;
  let panelY = 70;
  let panelW = canvasWidth - panelX - margin;
  let panelH = 120;

  fill(248, 248, 252);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 6);

  noStroke();
  textAlign(LEFT, TOP);
  textSize(10);
  textStyle(BOLD);
  fill(80);
  text('Python Code:', panelX + 8, panelY + 6);
  textStyle(NORMAL);

  let lines = [
    'for row in range(' + gridSize + '):',
    '    for col in range(' + gridSize + '):',
    '        print(f"({row},{col})")',
    '    print()  # new line',
  ];

  let highlightLine = -1;
  if (currentCell >= 0 && currentCell < totalCells) {
    highlightLine = 2; // inner print
    let col = currentCell % gridSize;
    if (col === gridSize - 1) {
      // Could highlight outer print too, but keep it simple
    }
  }

  textFont('monospace');
  textSize(10);
  let ly = panelY + 22;
  for (let i = 0; i < lines.length; i++) {
    if (i === highlightLine) {
      fill(255, 255, 100, 200);
      noStroke();
      rect(panelX + 3, ly - 2, panelW - 6, 14, 2);
      fill(0, 0, 150);
    } else if (i === 0) {
      fill(200, 60, 60); // outer loop in red
    } else if (i === 1) {
      fill(50, 130, 200); // inner loop in blue
    } else {
      fill(60);
    }
    noStroke();
    text(lines[i], panelX + 8, ly);
    ly += 18;
  }
  textFont('Arial');

  // Explanation text
  let expY = panelY + panelH + 15;
  noStroke();
  fill(80);
  textAlign(LEFT, TOP);
  textSize(12);
  textFont('Arial');

  if (currentCell >= 0 && currentCell < totalCells) {
    let r = Math.floor(currentCell / gridSize);
    let c = currentCell % gridSize;
    text('Inner loop (col) changes fast', panelX, expY);
    text('Outer loop (row) changes slow', panelX, expY + 18);

    textStyle(BOLD);
    fill(100);
    textSize(13);
    text('(' + r + ', ' + c + ')', panelX, expY + 42);
    textStyle(NORMAL);
  } else if (currentCell >= totalCells) {
    fill(46, 160, 67);
    textStyle(BOLD);
    text('Done! ' + totalCells + ' iterations', panelX, expY);
    text(gridSize + ' x ' + gridSize + ' = ' + totalCells, panelX, expY + 18);
    textStyle(NORMAL);
  }
}

function doStep() {
  if (currentCell >= totalCells) {
    isAutoPlaying = false;
    autoButton.html('Auto Play');
    return;
  }
  currentCell++;
  if (currentCell >= totalCells) {
    isAutoPlaying = false;
    autoButton.html('Auto Play');
  }
}

function toggleAutoPlay() {
  isAutoPlaying = !isAutoPlaying;
  autoButton.html(isAutoPlaying ? 'Pause' : 'Auto Play');
  autoTimer = 0;
}

function doReset() {
  currentCell = -1;
  isAutoPlaying = false;
  autoButton.html('Auto Play');
}

function mousePressed() {
  // Click on grid cell to see its info
  if (mouseY > 60 && mouseY < drawHeight - 50 && currentCell >= totalCells) {
    // Allow clicking cells after animation is done - future enhancement
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  sizeSlider.size(canvasWidth - 280 - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
