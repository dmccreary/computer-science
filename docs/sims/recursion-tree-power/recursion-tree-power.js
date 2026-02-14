let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;

const trace = [
  { type: 'call', node: 'p8', msg: 'power(2, 8) called' },
  { type: 'call', node: 'p4', msg: 'power(2, 4) called (even)' },
  { type: 'call', node: 'p2', msg: 'power(2, 2) called (even)' },
  { type: 'call', node: 'p1', msg: 'power(2, 1) called (odd)' },
  { type: 'call', node: 'p0', msg: 'power(2, 0) base case -> 1' },
  { type: 'return', node: 'p1', msg: 'return 2 * 1 = 2' },
  { type: 'return', node: 'p2', msg: 'return 2 * 2 = 4' },
  { type: 'return', node: 'p4', msg: 'return 4 * 4 = 16' },
  { type: 'return', node: 'p8', msg: 'return 16 * 16 = 256' }
];

const nodes = {
  p8: { x: 0.50, y: 0.16, label: 'power(2, 8)', val: '256' },
  p4: { x: 0.50, y: 0.31, label: 'power(2, 4)', val: '16' },
  p2: { x: 0.50, y: 0.46, label: 'power(2, 2)', val: '4' },
  p1: { x: 0.50, y: 0.61, label: 'power(2, 1)', val: '2' },
  p0: { x: 0.50, y: 0.76, label: 'power(2, 0)', val: '1 (base)' }
};

const edges = [
  ['p8', 'p4'],
  ['p4', 'p2'],
  ['p2', 'p1'],
  ['p1', 'p0']
];

let idx = -1;
let stepBtn;
let autoBtn;
let resetBtn;
let autoPlay = false;
let lastTickMs = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  stepBtn = createButton('Step');
  stepBtn.mousePressed(stepForward);

  autoBtn = createButton('Auto Play');
  autoBtn.mousePressed(() => {
    autoPlay = !autoPlay;
    autoBtn.html(autoPlay ? 'Pause' : 'Auto Play');
  });

  resetBtn = createButton('Reset');
  resetBtn.mousePressed(() => {
    idx = -1;
    autoPlay = false;
    autoBtn.html('Auto Play');
  });

  positionControls();
  describe('Recursion tree step-through for fast exponentiation power(2, 8).', LABEL);
}

function draw() {
  updateCanvasSize();

  if (autoPlay && millis() - lastTickMs > 900) {
    stepForward();
    lastTickMs = millis();
  }

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawEdges();
  drawNodes();
  drawStatus();
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Recursion Tree for power(2, 8)', canvasWidth / 2, 10);
}

function drawEdges() {
  for (const [a, b] of edges) {
    const pa = toCanvas(nodes[a]);
    const pb = toCanvas(nodes[b]);

    const active = edgeIsActive(a, b);
    stroke(active ? '#2563eb' : '#94a3b8');
    strokeWeight(active ? 3 : 1.5);
    line(pa.x, pa.y + 22, pb.x, pb.y - 22);

    if (active) {
      noStroke();
      fill('#2563eb');
      const t = 0.6;
      const x = lerp(pa.x, pb.x, t);
      const y = lerp(pa.y + 22, pb.y - 22, t);
      circle(x, y, 8);
    }
  }
}

function drawNodes() {
  for (const id of Object.keys(nodes)) {
    const p = toCanvas(nodes[id]);
    const state = nodeState(id);

    if (state === 'activeCall') fill('#bfdbfe');
    else if (state === 'activeReturn') fill('#dcfce7');
    else if (state === 'done') fill('#f1f5f9');
    else fill('#ffffff');

    stroke(state === 'activeCall' || state === 'activeReturn' ? '#1d4ed8' : '#94a3b8');
    strokeWeight(state === 'activeCall' || state === 'activeReturn' ? 2.5 : 1.2);
    rect(p.x - 105, p.y - 24, 210, 48, 10);

    noStroke();
    fill('#0f172a');
    textAlign(CENTER, CENTER);
    textSize(13);
    text(nodes[id].label, p.x, p.y - 6);

    fill('#475569');
    textSize(11);
    text(`returns ${nodes[id].val}`, p.x, p.y + 11);
  }
}

function drawStatus() {
  fill('#ecfeff');
  stroke('#94a3b8');
  rect(40, 372, canvasWidth - 80, 60, 8);

  noStroke();
  fill('#0f172a');
  textAlign(LEFT, TOP);
  textSize(13);

  const stepNum = idx + 1;
  const message = idx >= 0 ? trace[idx].msg : 'Press Step to trace recursive calls and returns.';
  text(`Step ${stepNum}/${trace.length}: ${message}`, 54, 386, canvasWidth - 110, 40);
}

function nodeState(nodeId) {
  if (idx < 0) return 'idle';
  const curr = trace[idx];
  if (curr.node === nodeId && curr.type === 'call') return 'activeCall';
  if (curr.node === nodeId && curr.type === 'return') return 'activeReturn';

  for (let i = idx; i >= 0; i--) {
    if (trace[i].node === nodeId && trace[i].type === 'return') return 'done';
  }
  return 'idle';
}

function edgeIsActive(from, to) {
  if (idx < 0) return false;
  const curr = trace[idx];

  if (curr.type === 'call') {
    return curr.node === to;
  }
  if (curr.type === 'return') {
    return curr.node === from;
  }
  return false;
}

function toCanvas(node) {
  return {
    x: node.x * canvasWidth,
    y: node.y * drawHeight
  };
}

function stepForward() {
  if (idx < trace.length - 1) {
    idx += 1;
  } else {
    autoPlay = false;
    autoBtn.html('Auto Play');
  }
}

function positionControls() {
  stepBtn.position(10, drawHeight + 10);
  autoBtn.position(58, drawHeight + 10);
  resetBtn.position(132, drawHeight + 10);
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
