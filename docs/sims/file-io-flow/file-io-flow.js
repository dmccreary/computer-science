let canvasWidth = 400;
let drawHeight = 430;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

let mode = 'read';
let stage = 0; // 0=open, 1=read/write, 2=close
let autoPlay = false;
let autoTimer = 0;
let autoInterval = 55;
let particles = [];

let readBtn;
let writeBtn;
let stepBtn;
let autoBtn;
let resetBtn;

const stageNames = ['Open', 'Read/Write', 'Close'];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  readBtn = createButton('Read Mode');
  readBtn.mousePressed(() => setMode('read'));

  writeBtn = createButton('Write Mode');
  writeBtn.mousePressed(() => setMode('write'));

  stepBtn = createButton('Step');
  stepBtn.mousePressed(nextStage);

  autoBtn = createButton('Auto Play');
  autoBtn.mousePressed(toggleAutoPlay);

  resetBtn = createButton('Reset');
  resetBtn.mousePressed(resetSim);

  positionControls();
  resetSim();

  describe('Animated file input and output flow showing open, read or write, and close stages.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  runAutoPlay();
  updateParticles();

  drawTitle();
  drawProgramBox();
  drawFileBox();
  drawFlowArrows();
  drawParticles();
  drawProgress();
  drawStatus();
  drawButtonStyles();
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('File I/O Flow', canvasWidth / 2, 10);

  fill('#334155');
  textSize(14);
  text('Mode: ' + (mode === 'read' ? 'Read (file  program)' : 'Write (program  file)'), canvasWidth / 2, 40);
}

function drawProgramBox() {
  const x = margin;
  const y = 80;
  const w = canvasWidth * 0.35;
  const h = 210;

  fill('#dbeafe');
  stroke('#2563eb');
  strokeWeight(2);
  rect(x, y, w, h, 10);

  noStroke();
  fill('#1e3a8a');
  textAlign(CENTER, TOP);
  textSize(16);
  text('Python Program', x + w / 2, y + 8);

  const codeLines = mode === 'read'
    ? ['f = open("data.txt", "r")', 'content = f.read()', 'f.close()']
    : ['f = open("data.txt", "w")', 'f.write("hello")', 'f.close()'];

  for (let i = 0; i < codeLines.length; i++) {
    const ly = y + 45 + i * 36;
    if (i === stage) {
      fill(59, 130, 246, 55);
      noStroke();
      rect(x + 10, ly - 5, w - 20, 24, 6);
    }
    noStroke();
    fill('#1f2937');
    textAlign(LEFT, CENTER);
    textSize(13);
    text(codeLines[i], x + 16, ly + 7);
  }
}

function drawFileBox() {
  const w = canvasWidth * 0.26;
  const h = 180;
  const x = canvasWidth - margin - w;
  const y = 95;

  fill('#dcfce7');
  stroke('#16a34a');
  strokeWeight(2);
  rect(x, y + 15, w, h, 10);

  const lidLift = stage === 0 || stage === 1 ? 12 : 0;
  fill('#86efac');
  stroke('#15803d');
  rect(x + 4, y - 5 - lidLift, w - 8, 24, 7);

  noStroke();
  fill('#14532d');
  textAlign(CENTER, TOP);
  textSize(16);
  text('File on Disk', x + w / 2, y + 38);

  textSize(13);
  fill('#166534');
  const state = stage === 2 ? 'Closed' : 'Open';
  text('State: ' + state, x + w / 2, y + 68);

  fill('#166534');
  textSize(12);
  text('data.txt', x + w / 2, y + 104);
  text('line 1', x + w / 2, y + 125);
  text('line 2', x + w / 2, y + 143);
}

function drawFlowArrows() {
  const startX = margin + canvasWidth * 0.35 + 16;
  const endX = canvasWidth - margin - canvasWidth * 0.26 - 16;
  const y = 180;

  const readColor = color('#3b82f6');
  const writeColor = color('#f97316');

  strokeWeight(3);
  if (mode === 'read') {
    stroke(readColor);
    line(endX, y, startX, y);
    drawArrowHead(startX, y, -1, readColor);
  } else {
    stroke(writeColor);
    line(startX, y, endX, y);
    drawArrowHead(endX, y, 1, writeColor);
  }
}

function drawArrowHead(x, y, dir, c) {
  fill(c);
  noStroke();
  triangle(x, y, x - dir * 12, y - 7, x - dir * 12, y + 7);
}

function drawParticles() {
  for (const p of particles) {
    noStroke();
    fill(p.c);
    circle(p.x, p.y, 7);
  }
}

function drawProgress() {
  const labels = ['Open', 'Read/Write', 'Close'];
  const x0 = margin + 35;
  const y = 325;
  const stepGap = min(180, (canvasWidth - 120) / 2);

  for (let i = 0; i < 3; i++) {
    const x = x0 + i * stepGap;

    stroke('#94a3b8');
    if (i < 2) {
      line(x + 16, y, x + stepGap - 16, y);
    }

    if (i === stage) {
      fill('#2563eb');
    } else if (i < stage) {
      fill('#10b981');
    } else {
      fill('#e2e8f0');
    }

    stroke('#475569');
    circle(x, y, 30);
    noStroke();
    fill(i === stage ? 'white' : '#1f2937');
    textAlign(CENTER, CENTER);
    textSize(13);
    text(i + 1, x, y + 1);

    fill('#334155');
    textSize(12);
    text(labels[i], x, y + 25);
  }
}

function drawStatus() {
  noStroke();
  fill('#334155');
  textAlign(LEFT, CENTER);
  textSize(14);
  text('Current Stage: ' + stageNames[stage], margin, 370);
}

function drawButtonStyles() {
  readBtn.style('background', mode === 'read' ? '#dbeafe' : 'white');
  writeBtn.style('background', mode === 'write' ? '#ffedd5' : 'white');
  autoBtn.html(autoPlay ? 'Pause' : 'Auto Play');
}

function nextStage() {
  stage = (stage + 1) % 3;
  if (stage === 1) {
    spawnParticles(16);
  }
}

function toggleAutoPlay() {
  autoPlay = !autoPlay;
  autoTimer = 0;
}

function runAutoPlay() {
  if (!autoPlay) {
    return;
  }

  autoTimer += 1;
  if (autoTimer >= autoInterval) {
    autoTimer = 0;
    nextStage();
  }
}

function setMode(nextMode) {
  mode = nextMode;
  particles = [];
}

function spawnParticles(count) {
  const progRight = margin + canvasWidth * 0.35;
  const fileLeft = canvasWidth - margin - canvasWidth * 0.26;

  for (let i = 0; i < count; i++) {
    const t = random();
    const fromX = mode === 'read' ? fileLeft : progRight;
    const toX = mode === 'read' ? progRight : fileLeft;

    particles.push({
      fromX,
      toX,
      x: lerp(fromX, toX, t),
      y: 180 + random(-8, 8),
      speed: random(1.4, 2.8),
      c: mode === 'read' ? color('#3b82f6') : color('#f97316')
    });
  }
}

function updateParticles() {
  const remaining = [];

  for (const p of particles) {
    const dir = p.toX > p.fromX ? 1 : -1;
    p.x += p.speed * dir;

    const reached = dir > 0 ? p.x >= p.toX : p.x <= p.toX;
    if (!reached) {
      remaining.push(p);
    }
  }

  particles = remaining;
}

function resetSim() {
  stage = 0;
  particles = [];
  autoPlay = false;
  autoTimer = 0;
}

function positionControls() {
  readBtn.position(10, drawHeight + 8);
  writeBtn.position(95, drawHeight + 8);
  stepBtn.position(188, drawHeight + 8);
  autoBtn.position(236, drawHeight + 8);
  resetBtn.position(313, drawHeight + 8);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = max(560, container.offsetWidth);
  }
}
