let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;

let pairs = [
  { key: 'name', value: 'Alice' },
  { key: 'grade', value: '10' },
  { key: 'gpa', value: '3.8' }
];

let hoveredIndex = -1;
let showCode = false;

let keyInput;
let valueInput;
let addBtn;
let showCodeBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  keyInput = createInput('');
  keyInput.attribute('placeholder', 'key');
  valueInput = createInput('');
  valueInput.attribute('placeholder', 'value');

  addBtn = createButton('Add Pair');
  addBtn.mousePressed(addPair);

  showCodeBtn = createButton('Show Code: OFF');
  showCodeBtn.mousePressed(() => {
    showCode = !showCode;
  });

  positionControls();
  describe('Dictionary structure visualizer with key-value mapping arrows and add/remove controls.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  hoveredIndex = -1;

  drawTitle();
  drawPairs();
  if (showCode) drawCodePanel();

  showCodeBtn.html(showCode ? 'Show Code: ON' : 'Show Code: OFF');
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Dictionary Structure Visualizer', canvasWidth / 2, 10);
}

function drawPairs() {
  const keyX = margin + 30;
  const valX = canvasWidth - margin - 230;
  const top = 72;
  const rowH = 58;

  for (let i = 0; i < pairs.length; i++) {
    const y = top + i * rowH;

    const keyHover = inRect(mouseX, mouseY, keyX, y, 160, 40);
    if (keyHover) hoveredIndex = i;

    fill(i === hoveredIndex ? '#93c5fd' : '#dbeafe');
    stroke('#2563eb');
    rect(keyX, y, 160, 40, 8);

    noStroke();
    fill('#1e3a8a');
    textAlign(CENTER, CENTER);
    textSize(14);
    text(pairs[i].key, keyX + 80, y + 20);

    fill(i === hoveredIndex ? '#86efac' : '#dcfce7');
    stroke('#16a34a');
    rect(valX, y, 160, 40, 8);

    noStroke();
    fill('#14532d');
    text(pairs[i].value, valX + 80, y + 20);

    stroke(i === hoveredIndex ? '#111827' : '#94a3b8');
    strokeWeight(i === hoveredIndex ? 3 : 2);
    line(keyX + 160, y + 20, valX, y + 20);
    fill(i === hoveredIndex ? '#111827' : '#94a3b8');
    noStroke();
    triangle(valX, y + 20, valX - 10, y + 14, valX - 10, y + 26);

    drawRemoveButton(i, valX + 170, y + 10);
  }
}

function drawRemoveButton(i, x, y) {
  const hover = inRect(mouseX, mouseY, x, y, 56, 20);
  fill(hover ? '#fecaca' : '#fee2e2');
  stroke('#ef4444');
  rect(x, y, 56, 20, 6);
  noStroke();
  fill('#991b1b');
  textAlign(CENTER, CENTER);
  textSize(11);
  text('Remove', x + 28, y + 10);

  pairs[i]._rx = x;
  pairs[i]._ry = y;
  pairs[i]._rw = 56;
  pairs[i]._rh = 20;
}

function drawCodePanel() {
  const x = margin;
  const y = drawHeight - 160;
  const w = canvasWidth - margin * 2;
  const h = 130;

  fill(15, 23, 42, 240);
  stroke('#334155');
  rect(x, y, w, h, 8);

  noStroke();
  fill('#93c5fd');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Python Code', x + 10, y + 8);

  const entries = pairs.map((p) => `"${p.key}": ${formatValue(p.value)}`);
  const code = 'data = {' + entries.join(', ') + '}';

  fill('#e2e8f0');
  textFont('monospace');
  textSize(12);
  text(code, x + 10, y + 34, w - 20, h - 44);
  textFont('Arial, Helvetica, sans-serif');
}

function formatValue(v) {
  if (/^[-+]?\d+(\.\d+)?$/.test(v)) return v;
  return `"${v}"`;
}

function addPair() {
  const k = keyInput.value().trim();
  const v = valueInput.value().trim();
  if (!k) return;
  const idx = pairs.findIndex((p) => p.key === k);
  if (idx >= 0) pairs[idx].value = v;
  else pairs.push({ key: k, value: v });
  keyInput.value('');
  valueInput.value('');
}

function mousePressed() {
  for (let i = 0; i < pairs.length; i++) {
    const p = pairs[i];
    if (inRect(mouseX, mouseY, p._rx, p._ry, p._rw, p._rh)) {
      pairs.splice(i, 1);
      return;
    }
  }
}

function inRect(mx, my, x, y, w, h) {
  return mx >= x && mx <= x + w && my >= y && my <= y + h;
}

function positionControls() {
  keyInput.position(10, drawHeight + 10);
  keyInput.size(120, 24);
  valueInput.position(138, drawHeight + 10);
  valueInput.size(150, 24);
  addBtn.position(296, drawHeight + 10);
  showCodeBtn.position(367, drawHeight + 10);
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
