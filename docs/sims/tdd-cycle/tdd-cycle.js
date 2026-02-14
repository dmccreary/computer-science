let canvasWidth = 400;
let drawHeight = 470;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;

let nodes = [];
let selected = 0;
let hovered = -1;
let animateCycle = false;
let frameTick = 0;

let animateBtn;
let nextBtn;

const phases = [
  {
    name: 'Red',
    color: '#ef4444',
    summary: 'Write a failing test first.',
    question: 'What should it do?',
    snippet: 'def test_total():\n    assert total([1,2]) == 3  # fails first'
  },
  {
    name: 'Green',
    color: '#22c55e',
    summary: 'Write minimal code to pass.',
    question: "What's the simplest fix?",
    snippet: 'def total(items):\n    return sum(items)'
  },
  {
    name: 'Refactor',
    color: '#3b82f6',
    summary: 'Improve design without changing behavior.',
    question: 'Can I make it cleaner?',
    snippet: 'def total(items):\n    return sum(int(x) for x in items)'
  }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  animateBtn = createButton('Animate Cycle');
  animateBtn.mousePressed(() => {
    animateCycle = !animateCycle;
    frameTick = 0;
  });

  nextBtn = createButton('Next Phase');
  nextBtn.mousePressed(() => {
    selected = (selected + 1) % phases.length;
  });

  positionControls();
  describe('Interactive Red Green Refactor TDD cycle diagram with phase details.', LABEL);
}

function draw() {
  updateCanvasSize();
  computeNodes();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  runAnimation();
  hovered = findHovered();

  drawTitle();
  drawCycle();
  drawCenter();
  drawTooltip();

  animateBtn.html(animateCycle ? 'Pause' : 'Animate Cycle');
}

function computeNodes() {
  const cx = canvasWidth * 0.5;
  const cy = drawHeight * 0.47;
  const r = min(canvasWidth, drawHeight) * 0.28;

  nodes = [
    { x: cx, y: cy - r, ...phases[0] },
    { x: cx + cos(radians(30)) * r, y: cy + sin(radians(30)) * r, ...phases[1] },
    { x: cx - cos(radians(30)) * r, y: cy + sin(radians(30)) * r, ...phases[2] }
  ];
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('TDD Red-Green-Refactor Cycle', canvasWidth / 2, 10);
}

function drawCycle() {
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    const b = nodes[(i + 1) % nodes.length];
    stroke('#94a3b8');
    strokeWeight(2);
    line(a.x, a.y, b.x, b.y);
    drawArrow(a.x, a.y, b.x, b.y);
  }

  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    const active = i === selected || i === hovered;

    fill(n.color);
    stroke(active ? '#111827' : '#334155');
    strokeWeight(active ? 3 : 1.5);
    circle(n.x, n.y, active ? 122 : 110);

    noStroke();
    fill('white');
    textAlign(CENTER, CENTER);
    textSize(20);
    text(n.name, n.x, n.y - 6);

    textSize(12);
    text(n.question, n.x, n.y + 18);
  }
}

function drawArrow(x1, y1, x2, y2) {
  const tx = lerp(x1, x2, 0.54);
  const ty = lerp(y1, y2, 0.54);
  const ang = atan2(y2 - y1, x2 - x1);

  push();
  translate(tx, ty);
  rotate(ang);
  fill('#64748b');
  noStroke();
  triangle(0, 0, -10, 4, -10, -4);
  pop();
}

function drawCenter() {
  const p = phases[selected];
  const w = min(420, canvasWidth * 0.6);
  const h = 120;
  const x = (canvasWidth - w) / 2;
  const y = drawHeight - 148;

  fill(255, 255, 255, 235);
  stroke('#cbd5e1');
  rect(x, y, w, h, 10);

  noStroke();
  fill('#0f172a');
  textAlign(LEFT, TOP);
  textSize(15);
  text(p.name + ': ' + p.summary, x + 12, y + 10, w - 24, 24);

  fill(15, 23, 42, 242);
  stroke('#334155');
  rect(x + 10, y + 36, w - 20, h - 46, 6);

  noStroke();
  fill('#e2e8f0');
  textFont('monospace');
  textSize(12);
  text(p.snippet, x + 16, y + 44, w - 32, h - 56);
  textFont('Arial, Helvetica, sans-serif');
}

function drawTooltip() {
  if (hovered < 0) return;
  const n = nodes[hovered];

  let x = n.x + 60;
  let y = n.y - 30;
  if (x + 200 > canvasWidth) x = n.x - 220;

  fill(15, 23, 42, 240);
  stroke('#334155');
  rect(x, y, 200, 44, 8);

  noStroke();
  fill('#e2e8f0');
  textAlign(LEFT, TOP);
  textSize(12);
  text(n.summary, x + 8, y + 8, 184, 32);
}

function findHovered() {
  for (let i = 0; i < nodes.length; i++) {
    if (dist(mouseX, mouseY, nodes[i].x, nodes[i].y) < 56) return i;
  }
  return -1;
}

function mousePressed() {
  if (hovered >= 0) selected = hovered;
}

function runAnimation() {
  if (!animateCycle) return;
  frameTick += 1;
  if (frameTick > 120) {
    frameTick = 0;
    selected = (selected + 1) % phases.length;
  }
}

function positionControls() {
  animateBtn.position(10, drawHeight + 10);
  nextBtn.position(108, drawHeight + 10);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = max(760, container.offsetWidth);
  }
}
