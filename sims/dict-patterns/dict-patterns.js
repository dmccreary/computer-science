let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;

let mode = 'counting';
let items = [];
let idx = -1;
let resultDict = {};
let autoPlay = false;
let frameTick = 0;
let speed = 30;

let modeSelect;
let inputField;
let loadBtn;
let stepBtn;
let autoBtn;
let resetBtn;
let speedSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  modeSelect = createSelect();
  modeSelect.option('counting');
  modeSelect.option('grouping');
  modeSelect.changed(() => {
    mode = modeSelect.value();
    setDefaultInput();
    loadInput();
  });

  inputField = createInput('');
  loadBtn = createButton('Load Input');
  loadBtn.mousePressed(loadInput);

  stepBtn = createButton('Step');
  stepBtn.mousePressed(stepOnce);

  autoBtn = createButton('Auto Play');
  autoBtn.mousePressed(() => { autoPlay = !autoPlay; });

  resetBtn = createButton('Reset');
  resetBtn.mousePressed(resetRun);

  speedSlider = createSlider(10, 60, speed, 1);

  setDefaultInput();
  loadInput();
  positionControls();

  describe('Counting and grouping dictionary patterns with step-by-step dictionary growth.', LABEL);
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
    frameTick++;
    if (frameTick >= speed) {
      frameTick = 0;
      stepOnce();
    }
  }

  drawTitle();
  drawInputPanel();
  drawCurrentItemPanel();
  drawDictPanel();

  autoBtn.html(autoPlay ? 'Pause' : 'Auto Play');
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Counting and Grouping Patterns', canvasWidth / 2, 10);
}

function drawInputPanel() {
  const x = 20;
  const y = 72;
  const w = (canvasWidth - 80) / 3;

  fill('#f8fafc');
  stroke('#94a3b8');
  rect(x, y, w, 390, 8);

  noStroke();
  fill('#111827');
  textAlign(LEFT, TOP);
  textSize(14);
  text('Input Data', x + 10, y + 10);

  fill('#334155');
  textSize(12);
  let yy = y + 36;
  for (let i = 0; i < items.length; i++) {
    if (i === idx) {
      fill('#fde68a');
      noStroke();
      rect(x + 8, yy - 2, w - 16, 18, 4);
      fill('#111827');
    }
    text(String(items[i]), x + 12, yy);
    yy += 20;
    fill('#334155');
  }
}

function drawCurrentItemPanel() {
  const x = 30 + (canvasWidth - 80) / 3;
  const y = 72;
  const w = (canvasWidth - 80) / 3;

  fill('#fef3c7');
  stroke('#f59e0b');
  rect(x, y, w, 390, 8);

  noStroke();
  fill('#92400e');
  textAlign(CENTER, TOP);
  textSize(14);
  text('Current Item', x + w / 2, y + 10);

  fill('#451a03');
  textSize(28);
  const txt = idx >= 0 && idx < items.length ? String(items[idx]) : '-';
  text(txt, x + w / 2, y + 80);

  textSize(13);
  text(mode === 'counting' ? 'Increment key count' : 'Append into group list', x + w / 2, y + 128, w - 20, 40);
}

function drawDictPanel() {
  const x = 40 + 2 * (canvasWidth - 80) / 3;
  const y = 72;
  const w = (canvasWidth - 80) / 3;

  fill('#ecfeff');
  stroke('#06b6d4');
  rect(x, y, w, 390, 8);

  noStroke();
  fill('#0c4a6e');
  textAlign(LEFT, TOP);
  textSize(14);
  text('Dictionary Output', x + 10, y + 10);

  fill(15, 23, 42, 240);
  stroke('#334155');
  rect(x + 8, y + 34, w - 16, 346, 6);

  const keys = Object.keys(resultDict);
  let yy = y + 56;
  noStroke();
  fill('#e2e8f0');
  textFont('monospace');
  textSize(12);
  for (const k of keys) {
    text(`${k}: ${JSON.stringify(resultDict[k])}`, x + 14, yy, w - 28, 20);
    yy += 20;
  }
  textFont('Arial, Helvetica, sans-serif');
}

function setDefaultInput() {
  if (mode === 'counting') inputField.value('banana');
  else inputField.value('alice:A,bob:B,amy:A,tom:B');
}

function loadInput() {
  const raw = inputField.value().trim();
  if (mode === 'counting') {
    items = raw.split('');
  } else {
    items = raw.split(',').map((t) => t.trim()).filter(Boolean);
  }
  resetRun();
}

function stepOnce() {
  if (idx >= items.length - 1) {
    autoPlay = false;
    return;
  }

  idx += 1;
  const item = items[idx];

  if (mode === 'counting') {
    resultDict[item] = (resultDict[item] || 0) + 1;
  } else {
    const parts = item.split(':');
    if (parts.length === 2) {
      const name = parts[0];
      const grp = parts[1];
      if (!resultDict[grp]) resultDict[grp] = [];
      resultDict[grp].push(name);
    }
  }
}

function resetRun() {
  idx = -1;
  resultDict = {};
  autoPlay = false;
  frameTick = 0;
}

function positionControls() {
  modeSelect.position(10, drawHeight + 10);
  inputField.position(84, drawHeight + 10);
  inputField.size(max(220, canvasWidth - 440), 24);
  loadBtn.position(canvasWidth - 350, drawHeight + 10);
  stepBtn.position(canvasWidth - 277, drawHeight + 10);
  autoBtn.position(canvasWidth - 229, drawHeight + 10);
  resetBtn.position(canvasWidth - 156, drawHeight + 10);
  speedSlider.position(canvasWidth - 103, drawHeight + 12);
  speedSlider.size(95);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = max(900, container.offsetWidth);
}
