let canvasWidth = 400;
let drawHeight = 470;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;

const totalItems = 20;
let produced = 0;
let listSlots = Array(totalItems).fill(false);
let genPhase = 'idle'; // idle, produce, deliver, discard
let genPulse = 0;
let running = false;
let lastTick = 0;

let generateBtn;
let resetBtn;
let speedSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  generateBtn = createButton('Generate Items');
  generateBtn.mousePressed(() => {
    running = true;
    lastTick = millis();
  });

  resetBtn = createButton('Reset');
  resetBtn.mousePressed(resetSim);

  speedSlider = createSlider(1, 10, 5, 1);

  positionControls();
  describe('Compare list memory growth to generator lazy item production.', LABEL);
}

function draw() {
  updateCanvasSize();

  tickSimulation();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawListPanel();
  drawGeneratorPanel();
  drawMemoryBars();
  drawStatus();
}

function tickSimulation() {
  if (!running) return;
  const speed = speedSlider.value();
  const intervalMs = map(speed, 1, 10, 700, 120);
  if (millis() - lastTick < intervalMs) return;
  lastTick = millis();

  if (produced >= totalItems) {
    running = false;
    genPhase = 'idle';
    return;
  }

  if (genPhase === 'idle' || genPhase === 'discard') {
    genPhase = 'produce';
  } else if (genPhase === 'produce') {
    genPhase = 'deliver';
    listSlots[produced] = true;
  } else if (genPhase === 'deliver') {
    genPhase = 'discard';
    produced += 1;
  }

  genPulse = 1;
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Generator vs List Memory', canvasWidth / 2, 10);
}

function drawListPanel() {
  const x = 24;
  const y = 60;
  const w = (canvasWidth - 60) / 2;
  const h = 250;

  fill('#eef2ff');
  const usage = listSlots.filter(Boolean).length;
  const glow = usage > 14 ? map(usage, 15, 20, 40, 120) : 0;
  stroke(usage > 14 ? color(239, 68, 68, glow) : '#94a3b8');
  strokeWeight(usage > 14 ? 3 : 1.5);
  rect(x, y, w, h, 10);

  noStroke();
  fill('#1e3a8a');
  textAlign(CENTER, TOP);
  textSize(16);
  text('List', x + w / 2, y + 10);

  const cols = 5;
  const rows = 4;
  const pad = 14;
  const cellW = (w - pad * 2 - (cols - 1) * 6) / cols;
  const cellH = (h - 58 - (rows - 1) * 6) / rows;

  for (let i = 0; i < totalItems; i++) {
    const cx = i % cols;
    const cy = floor(i / cols);
    const bx = x + pad + cx * (cellW + 6);
    const by = y + 40 + cy * (cellH + 6);

    fill(listSlots[i] ? '#22c55e' : '#d1d5db');
    noStroke();
    rect(bx, by, cellW, cellH, 4);
  }

  fill('#334155');
  textSize(13);
  text(`Memory: ${usage} items`, x + w / 2, y + h - 18);
}

function drawGeneratorPanel() {
  const x = 36 + (canvasWidth - 60) / 2;
  const y = 60;
  const w = (canvasWidth - 60) / 2;
  const h = 250;

  fill('#ecfeff');
  stroke('#94a3b8');
  strokeWeight(1.5);
  rect(x, y, w, h, 10);

  noStroke();
  fill('#0f766e');
  textAlign(CENTER, TOP);
  textSize(16);
  text('Generator', x + w / 2, y + 10);

  stroke('#64748b');
  strokeWeight(2);
  line(x + 24, y + 130, x + w - 24, y + 130);
  noStroke();
  fill('#334155');
  textAlign(CENTER, TOP);
  textSize(12);
  text('one-slot conveyor', x + w / 2, y + 136);

  const active = genPhase !== 'idle' && produced < totalItems;
  const px = x + w / 2 + (genPhase === 'deliver' ? 42 : 0);
  const py = y + 112;
  const alpha = active ? 255 : 90;

  fill(34, 197, 94, alpha);
  rect(px - 16, py - 16, 32, 32, 6);

  if (genPulse > 0) genPulse = max(0, genPulse - 0.05);
  if (genPulse > 0 && active) {
    noFill();
    stroke(16, 185, 129, 180 * genPulse);
    strokeWeight(3);
    circle(px, py, 40 + 24 * (1 - genPulse));
  }

  const genMem = active ? 1 : 0;
  noStroke();
  fill('#334155');
  textAlign(CENTER, TOP);
  textSize(13);
  text(`Memory: ${genMem} item`, x + w / 2, y + h - 18);
}

function drawMemoryBars() {
  const x = 24;
  const y = 326;
  const w = canvasWidth - 48;
  const h = 90;

  fill('#ffffff');
  stroke('#94a3b8');
  rect(x, y, w, h, 10);

  const listMem = listSlots.filter(Boolean).length;
  const genMem = running && genPhase !== 'idle' ? 1 : 0;

  const maxBarW = w - 190;
  const listW = map(listMem, 0, totalItems, 0, maxBarW);
  const genW = map(genMem, 0, totalItems, 0, maxBarW);

  noStroke();
  fill('#1d4ed8');
  textAlign(LEFT, CENTER);
  textSize(13);
  text('List memory', x + 14, y + 28);
  fill('#0ea5e9');
  rect(x + 120, y + 20, listW, 16, 4);
  fill('#0f172a');
  text(listMem, x + 126 + listW, y + 28);

  fill('#0f766e');
  text('Generator memory', x + 14, y + 62);
  fill('#14b8a6');
  rect(x + 120, y + 54, genW, 16, 4);
  fill('#0f172a');
  text(genMem, x + 126 + genW, y + 62);
}

function drawStatus() {
  noStroke();
  fill('#334155');
  textAlign(CENTER, CENTER);
  textSize(13);
  text(`Items produced: ${produced}/${totalItems} | Generator phase: ${genPhase}`, canvasWidth / 2, 438);
}

function resetSim() {
  produced = 0;
  listSlots = Array(totalItems).fill(false);
  genPhase = 'idle';
  genPulse = 0;
  running = false;
}

function positionControls() {
  generateBtn.position(10, drawHeight + 10);
  resetBtn.position(118, drawHeight + 10);
  speedSlider.position(170, drawHeight + 14);
  speedSlider.size(160);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = max(840, container.offsetWidth);
}
