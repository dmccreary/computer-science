let canvasWidth = 400;
let drawHeight = 460;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;

let stages = [];
let selectedStage = 0;
let hoveredStage = -1;
let autoTour = false;
let tourFrame = 0;

let autoBtn;
let nextBtn;

const stageData = [
  { name: 'Planning', summary: 'Define goals and project scope.', details: 'Set objectives, timeline, and resources.', analogy: 'Making a road trip plan before driving.', color: '#3b82f6' },
  { name: 'Analysis', summary: 'Understand user and system needs.', details: 'Gather requirements and constraints.', analogy: 'Interviewing people before designing a house.', color: '#8b5cf6' },
  { name: 'Design', summary: 'Create architecture and interfaces.', details: 'Plan modules, data, and user flow.', analogy: 'Drawing the blueprint before construction.', color: '#22c55e' },
  { name: 'Implementation', summary: 'Build the software components.', details: 'Write and integrate production code.', analogy: 'Actually building the house from plans.', color: '#f97316' },
  { name: 'Testing', summary: 'Find and fix defects.', details: 'Verify features and edge cases.', analogy: 'Quality check before opening a store.', color: '#ef4444' },
  { name: 'Maintenance', summary: 'Operate and improve over time.', details: 'Fix bugs and release updates.', analogy: 'Servicing a car after purchase.', color: '#14b8a6' }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  autoBtn = createButton('Auto Tour');
  autoBtn.mousePressed(() => {
    autoTour = !autoTour;
    tourFrame = 0;
  });

  nextBtn = createButton('Next Stage');
  nextBtn.mousePressed(() => {
    selectedStage = (selectedStage + 1) % stageData.length;
  });

  positionControls();
  describe('Interactive SDLC cycle with six stages and click-to-view details.', LABEL);
}

function draw() {
  updateCanvasSize();
  updateLayout();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  runAutoTour();
  hoveredStage = findHoveredStage();

  drawTitle();
  drawCycle();
  drawCenterPanel();
  drawTooltip();

  autoBtn.html(autoTour ? 'Pause Tour' : 'Auto Tour');
}

function updateLayout() {
  const cx = canvasWidth * 0.5;
  const cy = drawHeight * 0.47;
  const radius = min(canvasWidth, drawHeight) * 0.31;

  stages = [];
  for (let i = 0; i < stageData.length; i++) {
    const a = -HALF_PI + (TWO_PI * i) / stageData.length;
    stages.push({
      x: cx + cos(a) * radius,
      y: cy + sin(a) * radius,
      r: 42,
      ...stageData[i]
    });
  }
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Software Development Lifecycle', canvasWidth / 2, 10);
}

function drawCycle() {
  for (let i = 0; i < stages.length; i++) {
    const a = stages[i];
    const b = stages[(i + 1) % stages.length];
    stroke('#94a3b8');
    strokeWeight(2);
    line(a.x, a.y, b.x, b.y);
    drawArrow(a.x, a.y, b.x, b.y);
  }

  for (let i = 0; i < stages.length; i++) {
    const s = stages[i];
    const active = i === selectedStage || i === hoveredStage;

    fill(s.color);
    stroke(active ? '#111827' : '#334155');
    strokeWeight(active ? 3 : 1.5);
    circle(s.x, s.y, active ? s.r * 2.1 : s.r * 2);

    noStroke();
    fill('white');
    textAlign(CENTER, CENTER);
    textSize(12);
    text(s.name, s.x, s.y);
  }
}

function drawArrow(x1, y1, x2, y2) {
  const ang = atan2(y2 - y1, x2 - x1);
  const tx = lerp(x1, x2, 0.56);
  const ty = lerp(y1, y2, 0.56);

  push();
  translate(tx, ty);
  rotate(ang);
  fill('#64748b');
  noStroke();
  triangle(0, 0, -10, 4, -10, -4);
  pop();
}

function drawCenterPanel() {
  const s = stages[selectedStage];
  const w = min(360, canvasWidth * 0.55);
  const h = 120;
  const x = (canvasWidth - w) / 2;
  const y = drawHeight * 0.38;

  fill(255, 255, 255, 235);
  stroke('#cbd5e1');
  rect(x, y, w, h, 10);

  noStroke();
  fill('#0f172a');
  textAlign(LEFT, TOP);
  textSize(16);
  text(s.name, x + 12, y + 10);

  fill('#334155');
  textSize(13);
  text('Summary: ' + s.summary, x + 12, y + 36, w - 24, 32);
  text('Activities: ' + s.details, x + 12, y + 58, w - 24, 40);
  text('Analogy: ' + s.analogy, x + 12, y + 84, w - 24, 30);
}

function drawTooltip() {
  if (hoveredStage < 0) return;

  const s = stages[hoveredStage];
  const tw = 220;
  const th = 42;
  let x = s.x + 20;
  let y = s.y - 52;

  if (x + tw > canvasWidth - 5) x = s.x - tw - 20;
  if (y < 60) y = s.y + 20;

  fill(15, 23, 42, 240);
  stroke('#334155');
  rect(x, y, tw, th, 8);
  noStroke();
  fill('#e2e8f0');
  textAlign(LEFT, TOP);
  textSize(12);
  text(s.name + ': ' + s.summary, x + 8, y + 8, tw - 16, 30);
}

function findHoveredStage() {
  for (let i = 0; i < stages.length; i++) {
    const s = stages[i];
    if (dist(mouseX, mouseY, s.x, s.y) <= s.r) return i;
  }
  return -1;
}

function runAutoTour() {
  if (!autoTour) return;
  tourFrame += 1;
  if (tourFrame >= 120) {
    tourFrame = 0;
    selectedStage = (selectedStage + 1) % stages.length;
  }
}

function mousePressed() {
  if (hoveredStage >= 0) {
    selectedStage = hoveredStage;
  }
}

function positionControls() {
  autoBtn.position(10, drawHeight + 12);
  nextBtn.position(88, drawHeight + 12);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = max(620, container.offsetWidth);
  }
}
