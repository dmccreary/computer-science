let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;

let breakpoints = new Set();
let pc = 0;
let running = false;
let bugFound = false;

let varsState = { numbers: '[3, 1, 4, 1]', current: '-', maxVal: '-' };
let consoleOut = [];

let runBtn;
let stepBtn;
let continueBtn;
let resetBtn;
let findBugBtn;

const code = [
  'numbers = [3, 1, 4, 1]',
  'max_val = 0   # bug for all-negative lists',
  'for n in numbers:',
  '    if n > max_val:',
  '        max_val = n',
  'print(max_val)'
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  runBtn = createButton('Run');
  runBtn.mousePressed(startRun);

  stepBtn = createButton('Step Over');
  stepBtn.mousePressed(stepOnce);

  continueBtn = createButton('Continue');
  continueBtn.mousePressed(() => {
    running = true;
  });

  resetBtn = createButton('Reset');
  resetBtn.mousePressed(resetSim);

  findBugBtn = createButton('Find the Bug');
  findBugBtn.mousePressed(() => {
    bugFound = true;
  });

  positionControls();
  resetSim();

  describe('Visual debugger simulation with breakpoints line stepping and variable inspector.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  if (running) stepAuto();

  drawTitle();
  drawCodePanel();
  drawVarsPanel();
  drawConsolePanel();
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Visual Debugger Simulator', canvasWidth / 2, 10);
}

function drawCodePanel() {
  const x = margin;
  const y = 68;
  const w = (canvasWidth - margin * 3) * 0.58;
  const h = 300;

  fill('#0f172a');
  stroke('#334155');
  rect(x, y, w, h, 8);

  for (let i = 0; i < code.length; i++) {
    const ly = y + 24 + i * 42;

    if (i === pc) {
      fill(250, 204, 21, 75);
      noStroke();
      rect(x + 24, ly - 8, w - 34, 25, 4);
    }

    if (i === 1 && bugFound) {
      fill(239, 68, 68, 90);
      noStroke();
      rect(x + 24, ly - 8, w - 34, 25, 4);
    }

    noStroke();
    fill('#94a3b8');
    textAlign(RIGHT, CENTER);
    textSize(12);
    text(i + 1, x + 18, ly + 4);

    fill('#e2e8f0');
    textAlign(LEFT, CENTER);
    text(code[i], x + 30, ly + 4);

    const bpX = x + 10;
    const bpY = ly + 4;
    fill(breakpoints.has(i) ? '#ef4444' : '#334155');
    stroke('#94a3b8');
    circle(bpX, bpY, 10);
  }
}

function drawVarsPanel() {
  const x = margin * 2 + (canvasWidth - margin * 3) * 0.58;
  const y = 68;
  const w = (canvasWidth - margin * 3) * 0.42;
  const h = 300;

  fill('#f8fafc');
  stroke('#94a3b8');
  rect(x, y, w, h, 8);

  noStroke();
  fill('#111827');
  textAlign(LEFT, TOP);
  textSize(14);
  text('Variable Inspector', x + 10, y + 10);

  textSize(13);
  fill('#334155');
  text('numbers: ' + varsState.numbers, x + 10, y + 46, w - 20, 40);
  text('current n: ' + varsState.current, x + 10, y + 88);
  text('max_val: ' + varsState.maxVal, x + 10, y + 118);
  text('line: ' + (pc + 1), x + 10, y + 148);

  if (bugFound) {
    fill('#b91c1c');
    text('Bug identified: line 2 initialization', x + 10, y + 190, w - 20, 44);
  }
}

function drawConsolePanel() {
  const x = margin;
  const y = 382;
  const w = canvasWidth - margin * 2;
  const h = 104;

  fill(15, 23, 42, 245);
  stroke('#334155');
  rect(x, y, w, h, 8);

  noStroke();
  fill('#93c5fd');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Output Console', x + 10, y + 8);

  fill('#e2e8f0');
  textFont('monospace');
  textSize(12);
  let yy = y + 30;
  for (const line of consoleOut.slice(-4)) {
    text(line, x + 10, yy);
    yy += 18;
  }
  textFont('Arial, Helvetica, sans-serif');
}

function mousePressed() {
  const x = margin;
  const y = 68;
  for (let i = 0; i < code.length; i++) {
    const ly = y + 24 + i * 42 + 4;
    if (dist(mouseX, mouseY, x + 10, ly) <= 6) {
      if (breakpoints.has(i)) breakpoints.delete(i);
      else breakpoints.add(i);
      return;
    }
  }
}

function startRun() {
  running = true;
}

function stepAuto() {
  if (frameCount % 24 !== 0) return;

  if (breakpoints.has(pc) && consoleOut.length > 0) {
    running = false;
    return;
  }
  stepOnce();
}

function stepOnce() {
  if (pc > 5) return;

  if (pc === 0) {
    varsState.numbers = '[3, 1, 4, 1]';
    varsState.maxVal = '-';
  } else if (pc === 1) {
    varsState.maxVal = '0';
  } else if (pc === 2) {
    varsState.current = '3';
  } else if (pc === 3) {
    if (Number(varsState.current) > Number(varsState.maxVal)) varsState.maxVal = varsState.current;
  } else if (pc === 4) {
    varsState.current = '4';
    if (4 > Number(varsState.maxVal)) varsState.maxVal = '4';
  } else if (pc === 5) {
    consoleOut.push('print(max_val) -> ' + varsState.maxVal);
  }

  pc += 1;
  if (pc > 5) running = false;
}

function resetSim() {
  breakpoints = new Set();
  pc = 0;
  running = false;
  bugFound = false;
  varsState = { numbers: '[3, 1, 4, 1]', current: '-', maxVal: '-' };
  consoleOut = [];
}

function positionControls() {
  runBtn.position(10, drawHeight + 10);
  stepBtn.position(50, drawHeight + 10);
  continueBtn.position(118, drawHeight + 10);
  resetBtn.position(187, drawHeight + 10);
  findBugBtn.position(235, drawHeight + 10);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = max(780, container.offsetWidth);
}
