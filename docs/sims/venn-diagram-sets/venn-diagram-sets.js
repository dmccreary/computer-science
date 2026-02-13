// Set Operations with Venn Diagrams MicroSim
// Demonstrates union, intersection, difference, and symmetric difference.

let canvasWidth = 400;
let drawHeight = 440;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

let operation = 'union';
let setA = new Set(['apple', 'banana', 'cherry', 'date']);
let setB = new Set(['cherry', 'date', 'elderberry', 'fig']);

let statusMessage = 'Select an operation or edit Set A / Set B.';
let statusColor = '#334155';

let unionBtn;
let intersectionBtn;
let differenceBtn;
let symDiffBtn;

let inputA;
let addABtn;
let removeABtn;

let inputB;
let addBBtn;
let removeBBtn;

let swapBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  unionBtn = createButton('Union');
  unionBtn.mousePressed(() => setOperation('union'));

  intersectionBtn = createButton('Intersection');
  intersectionBtn.mousePressed(() => setOperation('intersection'));

  differenceBtn = createButton('Difference (A-B)');
  differenceBtn.mousePressed(() => setOperation('difference'));

  symDiffBtn = createButton('Symmetric Difference');
  symDiffBtn.mousePressed(() => setOperation('symdiff'));

  inputA = createInput('');
  inputA.attribute('placeholder', 'item for Set A');

  addABtn = createButton('Add to A');
  addABtn.mousePressed(() => addItem('A'));

  removeABtn = createButton('Remove from A');
  removeABtn.mousePressed(() => removeItem('A'));

  inputB = createInput('');
  inputB.attribute('placeholder', 'item for Set B');

  addBBtn = createButton('Add to B');
  addBBtn.mousePressed(() => addItem('B'));

  removeBBtn = createButton('Remove from B');
  removeBBtn.mousePressed(() => removeItem('B'));

  swapBtn = createButton('Swap A and B');
  swapBtn.mousePressed(swapSets);

  positionControls();
  updateButtonStyles();

  describe(
    'Interactive Venn diagram for Python set operations. '
      + 'Students select union, intersection, difference, or symmetric difference and see highlighted regions and code output.',
    LABEL
  );
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawVennDiagram();
  drawCodeOutput();
  drawStatus();
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  noStroke();
  text('Set Operations with Venn Diagrams', canvasWidth / 2, 10);

  noStroke();
  fill('#334155');
  textAlign(CENTER, TOP);
  textSize(14);
  noStroke();
  text('Apply: demonstrate and compute set operations', canvasWidth / 2, 40);
}

function drawVennDiagram() {
  const cy = 195;
  const ellipseW = min(250, max(190, (canvasWidth - 120) * 0.48));
  const ellipseH = ellipseW * 0.74;
  // Increase overlap by ~30% compared with the previous layout.
  const centerDistance = ellipseW * 0.70;
  const cxA = canvasWidth / 2 - centerDistance / 2;
  const cxB = canvasWidth / 2 + centerDistance / 2;
  const overlapW = max(40, ellipseW - centerDistance);
  const pulse = 0.6 + 0.4 * sin(frameCount * 0.08);

  // Base circles.
  noStroke();
  fill(59, 130, 246, 85);
  ellipse(cxA, cy, ellipseW, ellipseH);

  noStroke();
  fill(249, 115, 22, 85);
  ellipse(cxB, cy, ellipseW, ellipseH);

  // Operation highlights (pulsing).
  if (operation === 'union') {
    noStroke();
    fill(34, 197, 94, floor(70 * pulse));
    ellipse(cxA, cy, ellipseW, ellipseH);
    noStroke();
    fill(34, 197, 94, floor(70 * pulse));
    ellipse(cxB, cy, ellipseW, ellipseH);
  }

  if (operation === 'intersection') {
    noStroke();
    fill(34, 197, 94, floor(140 * pulse));
    ellipse((cxA + cxB) / 2, cy, overlapW * 1.08, ellipseH * 0.95);
  }

  if (operation === 'difference') {
    noStroke();
    fill(34, 197, 94, floor(90 * pulse));
    ellipse(cxA, cy, ellipseW, ellipseH);

    // Dim overlap to indicate exclusion from A-B.
    noStroke();
    fill(240, 248, 255, 180);
    ellipse((cxA + cxB) / 2, cy, overlapW * 1.08, ellipseH * 0.95);
  }

  if (operation === 'symdiff') {
    noStroke();
    fill(34, 197, 94, floor(90 * pulse));
    ellipse(cxA, cy, ellipseW, ellipseH);
    noStroke();
    fill(34, 197, 94, floor(90 * pulse));
    ellipse(cxB, cy, ellipseW, ellipseH);

    // Remove overlap highlight for symmetric difference.
    noStroke();
    fill(240, 248, 255, 200);
    ellipse((cxA + cxB) / 2, cy, overlapW * 1.08, ellipseH * 0.95);
  }

  // Circle outlines.
  stroke('#1d4ed8');
  strokeWeight(2);
  noFill();
  ellipse(cxA, cy, ellipseW, ellipseH);

  stroke('#c2410c');
  strokeWeight(2);
  noFill();
  ellipse(cxB, cy, ellipseW, ellipseH);

  // Labels.
  noStroke();
  fill('#1d4ed8');
  textAlign(CENTER, CENTER);
  textSize(18);
  noStroke();
  text('Set A', cxA, cy - ellipseH / 2 - 20);

  noStroke();
  fill('#c2410c');
  textAlign(CENTER, CENTER);
  textSize(18);
  noStroke();
  text('Set B', cxB, cy - ellipseH / 2 - 20);

  drawElements(cxA, cxB, cy, ellipseW);
}

function drawElements(cxA, cxB, cy, ellipseW) {
  const onlyA = getOnlyA();
  const inter = getIntersection();
  const onlyB = getOnlyB();

  const leftX = cxA - ellipseW * 0.22;
  const centerX = (cxA + cxB) / 2;
  const rightX = cxB + ellipseW * 0.22;

  drawRegionItems(onlyA, leftX, cy - 24, isRegionHighlighted('onlyA'));
  drawRegionItems(inter, centerX, cy - 24, isRegionHighlighted('intersection'));
  drawRegionItems(onlyB, rightX, cy - 24, isRegionHighlighted('onlyB'));
}

function drawRegionItems(items, x, startY, highlighted) {
  const maxRows = 6;
  for (let i = 0; i < min(items.length, maxRows); i += 1) {
    noStroke();
    if (highlighted) {
      fill('#0f172a');
      textStyle(BOLD);
    } else {
      fill(15, 23, 42, 95);
      textStyle(NORMAL);
    }
    textAlign(CENTER, CENTER);
    textSize(14);
    noStroke();
    text(items[i], x, startY + i * 20);
  }
  textStyle(NORMAL);
}

function drawCodeOutput() {
  const x = margin;
  const y = 315;
  const w = canvasWidth - margin * 2;
  const h = 90;

  fill(15, 23, 42, 240);
  stroke('#334155');
  strokeWeight(1);
  rect(x, y, w, h, 8);

  const op = getOperationSymbol();
  const result = getResultSet();
  const codeLine = 'A ' + op + ' B = ' + formatPythonSet(result);

  noStroke();
  fill('#e2e8f0');
  textAlign(LEFT, TOP);
  textSize(14);
  noStroke();
  text('Python Code Output', x + 10, y + 8);

  noStroke();
  fill('#93c5fd');
  textAlign(LEFT, TOP);
  textSize(16);
  noStroke();
  text('A = ' + formatPythonSet(setA), x + 10, y + 30);

  noStroke();
  fill('#fdba74');
  textAlign(LEFT, TOP);
  textSize(16);
  noStroke();
  text('B = ' + formatPythonSet(setB), x + 10, y + 50);

  noStroke();
  fill('#86efac');
  textAlign(LEFT, TOP);
  textSize(16);
  noStroke();
  text(codeLine, x + 10, y + 70);
}

function drawStatus() {
  noStroke();
  fill(statusColor);
  textAlign(LEFT, CENTER);
  textSize(13);
  noStroke();
  text(statusMessage, margin, drawHeight + controlHeight - 12);

  textSize(defaultTextSize);
}

function setOperation(nextOperation) {
  operation = nextOperation;
  updateButtonStyles();

  if (operation === 'union') {
    statusMessage = 'Union selected: all elements in A or B.';
  } else if (operation === 'intersection') {
    statusMessage = 'Intersection selected: only elements shared by A and B.';
  } else if (operation === 'difference') {
    statusMessage = 'Difference selected: elements in A but not in B.';
  } else {
    statusMessage = 'Symmetric difference selected: elements in A or B, but not both.';
  }
  statusColor = '#1e293b';
}

function addItem(targetSet) {
  const input = targetSet === 'A' ? inputA : inputB;
  const value = normalizeItem(input.value());
  if (!value) {
    statusMessage = 'Enter an item before adding.';
    statusColor = '#991b1b';
    return;
  }

  const target = targetSet === 'A' ? setA : setB;
  target.add(value);
  input.value('');

  statusMessage = "Added '" + value + "' to Set " + targetSet + '.';
  statusColor = '#166534';
}

function removeItem(targetSet) {
  const input = targetSet === 'A' ? inputA : inputB;
  const value = normalizeItem(input.value());
  if (!value) {
    statusMessage = 'Enter an item before removing.';
    statusColor = '#991b1b';
    return;
  }

  const target = targetSet === 'A' ? setA : setB;
  const existed = target.delete(value);
  input.value('');

  if (existed) {
    statusMessage = "Removed '" + value + "' from Set " + targetSet + '.';
    statusColor = '#166534';
  } else {
    statusMessage = "Item '" + value + "' not found in Set " + targetSet + '.';
    statusColor = '#92400e';
  }
}

function swapSets() {
  const temp = setA;
  setA = setB;
  setB = temp;
  statusMessage = 'Swapped Set A and Set B. Notice how A-B changes.';
  statusColor = '#1e293b';
}

function getOnlyA() {
  const out = [];
  for (const item of setA) {
    if (!setB.has(item)) {
      out.push(item);
    }
  }
  return out.sort();
}

function getIntersection() {
  const out = [];
  for (const item of setA) {
    if (setB.has(item)) {
      out.push(item);
    }
  }
  return out.sort();
}

function getOnlyB() {
  const out = [];
  for (const item of setB) {
    if (!setA.has(item)) {
      out.push(item);
    }
  }
  return out.sort();
}

function isRegionHighlighted(region) {
  if (operation === 'union') {
    return true;
  }
  if (operation === 'intersection') {
    return region === 'intersection';
  }
  if (operation === 'difference') {
    return region === 'onlyA';
  }
  return region === 'onlyA' || region === 'onlyB';
}

function getResultSet() {
  const out = new Set();
  if (operation === 'union') {
    for (const item of setA) out.add(item);
    for (const item of setB) out.add(item);
    return out;
  }
  if (operation === 'intersection') {
    for (const item of setA) {
      if (setB.has(item)) out.add(item);
    }
    return out;
  }
  if (operation === 'difference') {
    for (const item of setA) {
      if (!setB.has(item)) out.add(item);
    }
    return out;
  }

  // Symmetric difference.
  for (const item of setA) {
    if (!setB.has(item)) out.add(item);
  }
  for (const item of setB) {
    if (!setA.has(item)) out.add(item);
  }
  return out;
}

function getOperationSymbol() {
  if (operation === 'union') return '|';
  if (operation === 'intersection') return '&';
  if (operation === 'difference') return '-';
  return '^';
}

function formatPythonSet(values) {
  const arr = Array.from(values).sort();
  if (arr.length === 0) {
    return 'set()';
  }
  const inner = arr.map((item) => "'" + item + "'").join(', ');
  return '{' + inner + '}';
}

function normalizeItem(value) {
  const trimmed = value.trim().toLowerCase();
  return trimmed;
}

function updateButtonStyles() {
  styleOpButton(unionBtn, operation === 'union');
  styleOpButton(intersectionBtn, operation === 'intersection');
  styleOpButton(differenceBtn, operation === 'difference');
  styleOpButton(symDiffBtn, operation === 'symdiff');

  styleActionButton(addABtn, '#dbeafe');
  styleActionButton(removeABtn, '#fee2e2');
  styleActionButton(addBBtn, '#ffedd5');
  styleActionButton(removeBBtn, '#fee2e2');

  swapBtn.style('font-size', '14px');
  swapBtn.style('background-color', '#e2e8f0');
  swapBtn.style('border', '1px solid #64748b');
}

function styleOpButton(btn, active) {
  btn.style('font-size', '14px');
  btn.style('font-weight', active ? '700' : '500');
  btn.style('border', active ? '2px solid #16a34a' : '1px solid #64748b');
  btn.style('background-color', active ? '#bbf7d0' : '#e2e8f0');
}

function styleActionButton(btn, bg) {
  btn.style('font-size', '13px');
  btn.style('border', '1px solid #64748b');
  btn.style('background-color', bg);
}

function positionControls() {
  if (!unionBtn) {
    return;
  }

  // Row 1: operation buttons.
  const row1Y = drawHeight + 8;
  const opGap = 8;
  const opW = floor((canvasWidth - margin * 2 - opGap * 3) / 4);

  unionBtn.position(margin, row1Y);
  unionBtn.size(opW, 30);

  intersectionBtn.position(margin + (opW + opGap), row1Y);
  intersectionBtn.size(opW, 30);

  differenceBtn.position(margin + 2 * (opW + opGap), row1Y);
  differenceBtn.size(opW, 30);

  symDiffBtn.position(margin + 3 * (opW + opGap), row1Y);
  symDiffBtn.size(opW, 30);

  // Row 2: Set A input and actions.
  const row2Y = drawHeight + 46;
  const inputW = max(110, floor(canvasWidth * 0.26));
  const smallGap = 6;
  const actionW = floor((canvasWidth - margin * 2 - inputW - smallGap * 2) / 2);

  inputA.position(margin, row2Y);
  inputA.size(inputW, 28);

  addABtn.position(margin + inputW + smallGap, row2Y);
  addABtn.size(actionW, 28);

  removeABtn.position(margin + inputW + smallGap + actionW + smallGap, row2Y);
  removeABtn.size(actionW, 28);

  // Row 3: Set B input and actions + swap.
  const row3Y = drawHeight + 82;
  const swapW = min(130, floor(canvasWidth * 0.28));
  const actionW3 = floor((canvasWidth - margin * 2 - inputW - swapW - smallGap * 3) / 2);

  inputB.position(margin, row3Y);
  inputB.size(inputW, 28);

  addBBtn.position(margin + inputW + smallGap, row3Y);
  addBBtn.size(actionW3, 28);

  removeBBtn.position(margin + inputW + smallGap + actionW3 + smallGap, row3Y);
  removeBBtn.size(actionW3, 28);

  swapBtn.position(canvasWidth - margin - swapW, row3Y + 34);
  swapBtn.size(swapW, 26);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = max(400, container.offsetWidth);
    positionControls();
  }
}
