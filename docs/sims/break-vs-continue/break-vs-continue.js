// Break vs Continue Visualizer MicroSim
// Side-by-side comparison of break and continue in a for loop
// Students step through both loops simultaneously
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
let triggerSelect;

// State
let triggerNum = 3;
let currentIter = 0;     // which iteration we're on (0-based into items array)
let maxIter = 5;
let items = [1, 2, 3, 4, 5];

// Break side state
let breakDone = false;
let breakOutput = [];
let breakCurrent = -1;
let breakSkipped = [];

// Continue side state
let contOutput = [];
let contCurrent = -1;
let contSkipped = [];

// Animation
let isAutoPlaying = false;
let autoTimer = 0;
let autoInterval = 40; // frames between steps

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

  triggerSelect = createSelect();
  triggerSelect.position(canvasWidth - 120, drawHeight + 12);
  for (let i = 1; i <= 5; i++) {
    triggerSelect.option(i);
  }
  triggerSelect.selected('3');
  triggerSelect.changed(() => {
    triggerNum = parseInt(triggerSelect.value());
    doReset();
  });

  describe('Side-by-side comparison of break and continue statements in a for loop, stepping through iterations to see the difference.', LABEL);
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

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Break vs Continue', canvasWidth / 2, 10);

  let halfW = canvasWidth / 2;

  // Divider
  stroke(200);
  strokeWeight(1);
  line(halfW, 35, halfW, drawHeight - 10);

  // Column headers
  noStroke();
  textSize(15);
  textStyle(BOLD);
  fill(200, 60, 60);
  textAlign(CENTER, TOP);
  text('break', halfW / 2, 36);
  fill(50, 130, 200);
  text('continue', halfW + halfW / 2, 36);
  textStyle(NORMAL);

  // Draw iteration boxes
  drawIterationBoxes(margin, 70, halfW - margin * 2, 'break');
  drawIterationBoxes(halfW + margin, 70, halfW - margin * 2, 'continue');

  // Output consoles
  drawConsole(margin, 240, halfW - margin * 2, 'break');
  drawConsole(halfW + margin, 240, halfW - margin * 2, 'continue');

  // Code snippets
  drawCode(margin, 330, halfW - margin * 2, 'break');
  drawCode(halfW + margin, 330, halfW - margin * 2, 'continue');

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
  text('Trigger at:', canvasWidth - 195, drawHeight + 25);
}

function drawIterationBoxes(x, y, w, mode) {
  let boxW = Math.min(50, (w - 10) / items.length - 5);
  let totalW = items.length * (boxW + 5) - 5;
  let startX = x + (w - totalW) / 2;

  for (let i = 0; i < items.length; i++) {
    let bx = startX + i * (boxW + 5);
    let isActive = false;
    let isSkipped = false;
    let isDone = false;

    if (mode === 'break') {
      isActive = (breakCurrent === i);
      isSkipped = breakSkipped.includes(i);
      isDone = (breakOutput.includes(items[i]) || (i < currentIter && !breakSkipped.includes(i) && !breakDone));
      if (breakDone && i > breakCurrent && breakCurrent >= 0) isSkipped = true;
    } else {
      isActive = (contCurrent === i);
      isSkipped = contSkipped.includes(i);
      isDone = contOutput.includes(items[i]);
    }

    // Box color
    if (isActive) {
      fill(255, 220, 50);
      stroke(200, 180, 0);
    } else if (isSkipped && mode === 'break') {
      fill(240, 200, 200);
      stroke(200, 150, 150);
    } else if (isSkipped && mode === 'continue') {
      fill(255, 220, 180);
      stroke(220, 180, 130);
    } else if (isDone) {
      fill(200, 240, 200);
      stroke(100, 180, 100);
    } else {
      fill(255);
      stroke(180);
    }
    strokeWeight(isActive ? 3 : 1.5);
    rect(bx, y, boxW, boxW, 6);

    // Number
    noStroke();
    fill(isSkipped ? 180 : 40);
    textAlign(CENTER, CENTER);
    textSize(16);
    textStyle(BOLD);
    text(items[i], bx + boxW / 2, y + boxW / 2);
    textStyle(NORMAL);
  }

  // Legend
  noStroke();
  textSize(10);
  textAlign(LEFT, TOP);
  let ly = y + boxW + 8;
  fill(200, 240, 200);
  rect(x, ly, 10, 10, 2);
  fill(100);
  noStroke();
  text('processed', x + 14, ly);

  fill(255, 220, 50);
  rect(x + 80, ly, 10, 10, 2);
  fill(100);
  noStroke();
  text('current', x + 94, ly);

  if (mode === 'break') {
    fill(240, 200, 200);
    rect(x + 150, ly, 10, 10, 2);
    fill(100);
    noStroke();
    text('skipped', x + 164, ly);
  } else {
    fill(255, 220, 180);
    rect(x + 150, ly, 10, 10, 2);
    fill(100);
    noStroke();
    text('skipped', x + 164, ly);
  }
}

function drawConsole(x, y, w, mode) {
  // Console background
  fill(30, 30, 40);
  stroke(100);
  strokeWeight(1);
  rect(x, y, w, 80, 6);

  // Console title
  noStroke();
  fill(150);
  textAlign(LEFT, TOP);
  textSize(10);
  text('Output:', x + 8, y + 5);

  let output = (mode === 'break') ? breakOutput : contOutput;

  fill(100, 255, 100);
  textFont('monospace');
  textSize(14);
  let oy = y + 22;
  for (let i = 0; i < output.length; i++) {
    text(output[i], x + 8 + i * 22, oy);
  }

  // Show result summary when done
  if ((mode === 'break' && breakDone) || (mode === 'continue' && currentIter >= items.length)) {
    fill(180, 180, 255);
    textSize(11);
    text('Done! ' + output.length + ' printed', x + 8, oy + 22);
  }

  textFont('Arial');
}

function drawCode(x, y, w, mode) {
  fill(248, 248, 252);
  stroke(200);
  strokeWeight(1);
  rect(x, y, w, 78, 6);

  noStroke();
  textFont('monospace');
  textSize(10);
  textAlign(LEFT, TOP);

  let lines;
  if (mode === 'break') {
    lines = [
      'for i in range(1, 6):',
      '    if i == ' + triggerNum + ':',
      '        break',
      '    print(i)',
    ];
  } else {
    lines = [
      'for i in range(1, 6):',
      '    if i == ' + triggerNum + ':',
      '        continue',
      '    print(i)',
    ];
  }

  let highlightLine = getCodeHighlight(mode);

  let ly = y + 6;
  for (let i = 0; i < lines.length; i++) {
    if (i === highlightLine) {
      fill(255, 255, 100, 200);
      noStroke();
      rect(x + 3, ly - 1, w - 6, 14, 2);
      fill(0, 0, 150);
    } else {
      fill(60);
    }
    noStroke();
    text(lines[i], x + 8, ly);
    ly += 16;
  }
  textFont('Arial');
}

function getCodeHighlight(mode) {
  let idx = (mode === 'break') ? breakCurrent : contCurrent;
  if (idx < 0) return -1;

  let val = items[idx];
  if (val === triggerNum) {
    return 2; // break or continue line
  }
  return 3; // print line
}

function doStep() {
  if (currentIter >= items.length && breakDone) {
    isAutoPlaying = false;
    return;
  }

  // Break side
  if (!breakDone && currentIter < items.length) {
    breakCurrent = currentIter;
    if (items[currentIter] === triggerNum) {
      breakDone = true;
      // Mark remaining as skipped
      for (let j = currentIter; j < items.length; j++) {
        breakSkipped.push(j);
      }
    } else {
      breakOutput.push(items[currentIter]);
    }
  }

  // Continue side
  if (currentIter < items.length) {
    contCurrent = currentIter;
    if (items[currentIter] === triggerNum) {
      contSkipped.push(currentIter);
    } else {
      contOutput.push(items[currentIter]);
    }
  }

  currentIter++;

  if (currentIter >= items.length && !breakDone) {
    breakDone = true;
  }

  // Stop auto if both done
  if (currentIter >= items.length && breakDone) {
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
  currentIter = 0;
  breakDone = false;
  breakOutput = [];
  breakCurrent = -1;
  breakSkipped = [];
  contOutput = [];
  contCurrent = -1;
  contSkipped = [];
  isAutoPlaying = false;
  autoButton.html('Auto Play');
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
