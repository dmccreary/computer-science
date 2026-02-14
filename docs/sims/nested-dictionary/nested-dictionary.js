let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;

let data = {
  classroom: {
    Alice: { grade: 10, gpa: 3.8 },
    Bob: { grade: 11, gpa: 3.5 }
  },
  metadata: { room: 'A1', teacher: 'Ms. Lee' }
};

let expanded = new Set(['classroom', 'Alice', 'Bob', 'metadata']);
let selectedPath = [];
let expressionInput;
let evaluateBtn;
let resultText = 'Select a leaf value or enter an expression.';

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  expressionInput = createInput('data["classroom"]["Alice"]["gpa"]');
  evaluateBtn = createButton('Evaluate');
  evaluateBtn.mousePressed(evaluateExpression);

  positionControls();
  describe('Nested dictionary explorer with tree navigation and access-expression builder.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawTreePanel();
  drawRightPanel();
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Nested Dictionary Explorer', canvasWidth / 2, 10);
}

function drawTreePanel() {
  const x = margin;
  const y = 70;
  const w = (canvasWidth - margin * 3) / 2;
  const h = 410;

  fill('#f8fafc');
  stroke('#94a3b8');
  rect(x, y, w, h, 8);

  noStroke();
  fill('#111827');
  textAlign(LEFT, TOP);
  textSize(14);
  text('Tree View', x + 10, y + 8);

  let row = 0;
  row = drawNode('data', data, ['data'], 0, x, y, w, row);
}

function drawNode(label, node, path, depth, x, y, w, row) {
  const yy = y + 34 + row * 24;
  if (yy > y + 390) return row;

  const key = path.join('.');
  const isObj = node && typeof node === 'object' && !Array.isArray(node);
  const isExpanded = expanded.has(key);
  const isLeaf = !isObj;
  const selected = arraysEqual(path, selectedPath);

  if (selected) {
    fill('#fde68a');
    noStroke();
    rect(x + 6, yy - 3, w - 12, 20, 4);
  }

  noStroke();
  fill('#1f2937');
  textAlign(LEFT, CENTER);
  textSize(12);

  const prefix = isObj ? (isExpanded ? '▼ ' : '▶ ') : '• ';
  const textVal = isLeaf ? `${label}: ${node}` : label;
  text(' '.repeat(depth * 2) + prefix + textVal, x + 10, yy + 6);

  nodeHitboxes.push({ x: x + 8, y: yy - 4, w: w - 16, h: 20, path, isObj, key, value: node });

  row += 1;
  if (isObj && isExpanded) {
    for (const k of Object.keys(node)) {
      row = drawNode(k, node[k], [...path, k], depth + 1, x, y, w, row);
    }
  }
  return row;
}

let nodeHitboxes = [];

function drawRightPanel() {
  const x = margin * 2 + (canvasWidth - margin * 3) / 2;
  const y = 70;
  const w = (canvasWidth - margin * 3) / 2;
  const h = 410;

  fill('#f8fafc');
  stroke('#94a3b8');
  rect(x, y, w, h, 8);

  noStroke();
  fill('#111827');
  textAlign(LEFT, TOP);
  textSize(14);
  text('Access Expression', x + 10, y + 8);

  const expr = selectedPath.length > 1 ? buildExpression(selectedPath) : 'data';

  fill(15, 23, 42, 245);
  stroke('#334155');
  rect(x + 10, y + 36, w - 20, 90, 6);

  noStroke();
  fill('#e2e8f0');
  textFont('monospace');
  textSize(12);
  text(expr, x + 14, y + 50, w - 28, 60);
  textFont('Arial, Helvetica, sans-serif');

  fill('#334155');
  textSize(13);
  text('Result:', x + 10, y + 138);
  fill('#1e3a8a');
  text(resultText, x + 10, y + 160, w - 20, 220);
}

function buildExpression(path) {
  let e = 'data';
  for (let i = 1; i < path.length; i++) e += `["${path[i]}"]`;
  return e;
}

function evaluateExpression() {
  const expr = expressionInput.value().trim();
  try {
    const fn = new Function('data', `return ${expr};`);
    const v = fn(data);
    resultText = `Value = ${JSON.stringify(v)}`;
  } catch (err) {
    resultText = 'Error: ' + err.message;
  }
}

function mousePressed() {
  for (const h of nodeHitboxes) {
    if (mouseX >= h.x && mouseX <= h.x + h.w && mouseY >= h.y && mouseY <= h.y + h.h) {
      if (h.isObj) {
        if (expanded.has(h.key)) expanded.delete(h.key);
        else expanded.add(h.key);
      } else {
        selectedPath = h.path;
        resultText = `${buildExpression(selectedPath)} = ${JSON.stringify(h.value)}`;
      }
      return;
    }
  }
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function positionControls() {
  expressionInput.position(10, drawHeight + 10);
  expressionInput.size(max(280, canvasWidth - 150), 24);
  evaluateBtn.position(canvasWidth - 80, drawHeight + 10);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = max(780, container.offsetWidth);
  nodeHitboxes = [];
}
