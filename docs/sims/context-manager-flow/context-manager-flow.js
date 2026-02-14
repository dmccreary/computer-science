let canvasWidth = 400;
let drawHeight = 470;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;

const normalPath = ['enter', 'body', 'exit'];
const errorPath = ['enter', 'body', 'error', 'exit'];
let activePath = normalPath;
let stepIdx = -1;
let autoRun = false;
let lastTick = 0;

let normalBtn;
let errorBtn;
let stepBtn;
let resetBtn;

const nodes = {
  enter: { x: 0.5, y: 0.18, label: 'Enter (__enter__)' },
  body: { x: 0.5, y: 0.40, label: 'Body (your code)' },
  error: { x: 0.27, y: 0.62, label: 'Exception raised' },
  exit: { x: 0.5, y: 0.78, label: 'Exit (__exit__)' }
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  normalBtn = createButton('Normal Flow');
  normalBtn.mousePressed(() => {
    activePath = normalPath;
    stepIdx = -1;
    autoRun = true;
    lastTick = millis();
  });

  errorBtn = createButton('Error Flow');
  errorBtn.mousePressed(() => {
    activePath = errorPath;
    stepIdx = -1;
    autoRun = true;
    lastTick = millis();
  });

  stepBtn = createButton('Step Through');
  stepBtn.mousePressed(stepForward);

  resetBtn = createButton('Reset');
  resetBtn.mousePressed(() => {
    stepIdx = -1;
    autoRun = false;
  });

  positionControls();
  describe('Trace context manager flow through enter body and exit with success and exception paths.', LABEL);
}

function draw() {
  updateCanvasSize();

  if (autoRun && millis() - lastTick > 800) {
    stepForward();
    lastTick = millis();
  }

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawConnections();
  drawNodes();
  drawStatus();
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Context Manager Flow', canvasWidth / 2, 10);
}

function drawConnections() {
  const pEnter = toCanvas(nodes.enter);
  const pBody = toCanvas(nodes.body);
  const pErr = toCanvas(nodes.error);
  const pExit = toCanvas(nodes.exit);

  drawArrow(pEnter, pBody, pathHasEdge('enter', 'body') ? '#16a34a' : '#94a3b8', 3);
  drawArrow(pBody, pExit, pathHasEdge('body', 'exit') ? '#16a34a' : '#94a3b8', 3);
  drawArrow(pBody, pErr, pathHasEdge('body', 'error') ? '#dc2626' : '#94a3b8', 3);
  drawArrow(pErr, pExit, pathHasEdge('error', 'exit') ? '#dc2626' : '#94a3b8', 3);
}

function drawNodes() {
  for (const key of ['enter', 'body', 'error', 'exit']) {
    const p = toCanvas(nodes[key]);
    const state = nodeState(key);

    if (state === 'active-ok') fill('#dcfce7');
    else if (state === 'active-err') fill('#fee2e2');
    else if (state === 'done') fill('#f1f5f9');
    else fill('#ffffff');

    stroke(state.startsWith('active') ? '#1d4ed8' : '#94a3b8');
    strokeWeight(state.startsWith('active') ? 2.6 : 1.2);
    rect(p.x - 120, p.y - 24, 240, 48, 10);

    noStroke();
    fill('#0f172a');
    textAlign(CENTER, CENTER);
    textSize(14);
    text(nodes[key].label, p.x, p.y);
  }

  drawCodeHints();
}

function drawCodeHints() {
  fill('#0f172a');
  stroke('#334155');
  rect(20, 330, canvasWidth - 40, 108, 8);

  const lines = [
    'with open("file.txt") as f:',
    '    data = f.read()      # body',
    '# __enter__ before body',
    '# __exit__ always runs, even on error'
  ];

  noStroke();
  fill('#e2e8f0');
  textAlign(LEFT, TOP);
  textSize(12);
  textFont('monospace');
  for (let i = 0; i < lines.length; i++) text(lines[i], 30, 344 + i * 20);
  textFont('Arial, Helvetica, sans-serif');
}

function pathHasEdge(a, b) {
  const idxA = activePath.indexOf(a);
  const idxB = activePath.indexOf(b);
  return idxA >= 0 && idxB === idxA + 1;
}

function nodeState(k) {
  const idx = activePath.indexOf(k);
  if (idx === -1 || stepIdx < idx) return 'idle';
  if (stepIdx === idx) {
    return activePath.includes('error') && (k === 'error' || (k === 'body' && stepIdx >= 1)) ? 'active-err' : 'active-ok';
  }
  return 'done';
}

function toCanvas(n) {
  return { x: n.x * canvasWidth, y: n.y * drawHeight };
}

function drawArrow(a, b, c, w) {
  stroke(c);
  strokeWeight(w);
  line(a.x, a.y + 25, b.x, b.y - 25);
  const ang = atan2((b.y - 25) - (a.y + 25), b.x - a.x);
  const s = 8;
  line(b.x, b.y - 25, b.x - s * cos(ang - PI / 6), b.y - 25 - s * sin(ang - PI / 6));
  line(b.x, b.y - 25, b.x - s * cos(ang + PI / 6), b.y - 25 - s * sin(ang + PI / 6));
}

function stepForward() {
  if (stepIdx < activePath.length - 1) {
    stepIdx += 1;
  } else {
    autoRun = false;
  }
}

function drawStatus() {
  fill('#ecfeff');
  stroke('#94a3b8');
  rect(20, 438, canvasWidth - 40, 24, 6);
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, CENTER);
  textSize(13);

  const msg = stepIdx < 0 ? 'Choose a flow and step through execution.' : `Step ${stepIdx + 1}/${activePath.length}: ${activePath[stepIdx]}`;
  text(msg, canvasWidth / 2, 450);
}

function positionControls() {
  normalBtn.position(10, drawHeight + 10);
  errorBtn.position(96, drawHeight + 10);
  stepBtn.position(170, drawHeight + 10);
  resetBtn.position(262, drawHeight + 10);
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
