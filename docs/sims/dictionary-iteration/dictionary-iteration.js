let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;

const dictData = { name: 'Alice', grade: 10, gpa: 3.8, club: 'Robotics' };
let keys = Object.keys(dictData);
let stepIndex = -1;
let mode = 'keys';
let autoPlay = false;
let speed = 35;
let frameTick = 0;
let outputLines = [];

let modeSelect;
let stepBtn;
let autoBtn;
let resetBtn;
let speedSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  modeSelect = createSelect();
  modeSelect.option('keys');
  modeSelect.option('values');
  modeSelect.option('items');
  modeSelect.changed(() => {
    mode = modeSelect.value();
    resetSim();
  });

  stepBtn = createButton('Step');
  stepBtn.mousePressed(stepOnce);

  autoBtn = createButton('Auto Play');
  autoBtn.mousePressed(() => {
    autoPlay = !autoPlay;
  });

  resetBtn = createButton('Reset');
  resetBtn.mousePressed(resetSim);

  speedSlider = createSlider(10, 60, speed, 1);

  positionControls();
  resetSim();
  describe('Dictionary iteration flowchart showing keys values and items traversal with output.', LABEL);
}

function draw() {
  updateCanvasSize();
  speed = speedSlider.value();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  if (autoPlay) {
    frameTick += 1;
    if (frameTick >= speed) {
      frameTick = 0;
      stepOnce();
    }
  }

  drawTitle();
  drawDictTable();
  drawCodeBlock();
  drawOutput();

  autoBtn.html(autoPlay ? 'Pause' : 'Auto Play');
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Dictionary Iteration Flowchart', canvasWidth / 2, 10);
}

function drawDictTable() {
  const x = margin;
  const y = 70;
  const w = canvasWidth - margin * 2;
  const rowH = 36;

  fill('#f8fafc');
  stroke('#94a3b8');
  rect(x, y, w, 180, 8);

  for (let i = 0; i < keys.length; i++) {
    const ry = y + 38 + i * rowH;
    const active = i === stepIndex;
    const visited = i < stepIndex;

    if (active) fill('#fde68a');
    else if (visited) fill('#e5e7eb');
    else fill('#ffffff');
    stroke('#cbd5e1');
    rect(x + 8, ry, w - 16, rowH - 4, 5);

    noStroke();
    fill('#1f2937');
    textAlign(LEFT, CENTER);
    textSize(13);
    text(`${keys[i]} : ${dictData[keys[i]]}`, x + 16, ry + (rowH - 4) / 2);
  }
}

function drawCodeBlock() {
  const x = margin;
  const y = 262;
  const w = (canvasWidth - margin * 3) / 2;
  const h = 210;

  fill(15, 23, 42, 245);
  stroke('#334155');
  rect(x, y, w, h, 8);

  const code = mode === 'keys'
    ? ['for key in data:', '    print(key)']
    : mode === 'values'
      ? ['for value in data.values():', '    print(value)']
      : ['for key, value in data.items():', '    print(key, value)'];

  noStroke();
  fill('#93c5fd');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Loop Code', x + 10, y + 8);

  textFont('monospace');
  for (let i = 0; i < code.length; i++) {
    const ly = y + 42 + i * 26;
    fill(i === 1 && stepIndex >= 0 ? '#22c55e' : '#e2e8f0');
    text(code[i], x + 12, ly);
  }
  textFont('Arial, Helvetica, sans-serif');
}

function drawOutput() {
  const x = margin * 2 + (canvasWidth - margin * 3) / 2;
  const y = 262;
  const w = (canvasWidth - margin * 3) / 2;
  const h = 210;

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
  let yy = y + 36;
  for (const line of outputLines.slice(-8)) {
    text(line, x + 10, yy);
    yy += 20;
  }
  textFont('Arial, Helvetica, sans-serif');
}

function stepOnce() {
  if (stepIndex >= keys.length - 1) {
    autoPlay = false;
    return;
  }

  stepIndex += 1;
  const k = keys[stepIndex];
  if (mode === 'keys') outputLines.push(String(k));
  if (mode === 'values') outputLines.push(String(dictData[k]));
  if (mode === 'items') outputLines.push(`${k} ${dictData[k]}`);
}

function resetSim() {
  stepIndex = -1;
  outputLines = [];
  autoPlay = false;
  frameTick = 0;
}

function positionControls() {
  modeSelect.position(10, drawHeight + 10);
  stepBtn.position(76, drawHeight + 10);
  autoBtn.position(122, drawHeight + 10);
  resetBtn.position(194, drawHeight + 10);
  speedSlider.position(244, drawHeight + 12);
  speedSlider.size(170);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = max(760, container.offsetWidth);
}
