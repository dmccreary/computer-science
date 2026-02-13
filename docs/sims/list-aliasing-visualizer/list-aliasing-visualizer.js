// List Aliasing Visualizer MicroSim
// Shows how variable names map to list objects in memory
// Demonstrates alias vs copy behavior

let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// State
let mode = 'alias'; // 'alias', 'slice', 'list_func', 'copy_method'
let listA = [1, 2, 3];
let listB = [1, 2, 3];
let isAlias = true;
let appended = false;
let appendValue = 4;
let statusMsg = '';
let statusColor = '#333';

// Animation
let animating = false;
let animProgress = 0;

// Controls
let modeSelect;
let appendBtn, resetBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Row 1: Mode selector and buttons
  modeSelect = createSelect();
  modeSelect.position(10, drawHeight + 12);
  modeSelect.option('Alias: b = a', 'alias');
  modeSelect.option('Slice copy: b = a[:]', 'slice');
  modeSelect.option('list() copy: b = list(a)', 'list_func');
  modeSelect.option('.copy(): b = a.copy()', 'copy_method');
  modeSelect.changed(changeMode);

  appendBtn = createButton('Append 4 to b');
  appendBtn.position(230, drawHeight + 12);
  appendBtn.mousePressed(doAppend);

  resetBtn = createButton('Reset');
  resetBtn.position(345, drawHeight + 12);
  resetBtn.mousePressed(doReset);

  describe('Interactive visualization showing the difference between list aliasing and copying in Python', LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area
  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(22);
  text('List Aliasing Visualizer', canvasWidth / 2, 10);

  // Animation update
  if (animating) {
    animProgress += 0.04;
    if (animProgress >= 1) {
      animProgress = 1;
      animating = false;
    }
  }

  // Draw the code snippet
  drawCodePanel();

  // Draw memory diagram
  drawMemoryDiagram();

  // Status message
  if (statusMsg) {
    noStroke();
    fill(statusColor);
    textAlign(CENTER, TOP);
    textSize(14);
    text(statusMsg, canvasWidth / 2, drawHeight - 30);
  }

  // Label in control area
  noStroke();
  fill('#666');
  textAlign(LEFT, CENTER);
  textSize(12);
  text('Mode:', 10, drawHeight + 5);

  textSize(defaultTextSize);
}

function drawCodePanel() {
  let codeX = margin;
  let codeY = 45;
  let codeW = canvasWidth - 2 * margin;
  let codeH = 70;

  // Code background
  fill(40, 44, 52);
  stroke('#555');
  strokeWeight(1);
  rect(codeX, codeY, codeW, codeH, 6);

  noStroke();
  textFont('monospace');
  textSize(14);
  textAlign(LEFT, TOP);

  fill('#ABB2BF');
  text('a = [1, 2, 3]', codeX + 12, codeY + 10);

  fill('#61AFEF');
  let line2 = '';
  switch (mode) {
    case 'alias': line2 = 'b = a'; break;
    case 'slice': line2 = 'b = a[:]'; break;
    case 'list_func': line2 = 'b = list(a)'; break;
    case 'copy_method': line2 = 'b = a.copy()'; break;
  }
  text(line2, codeX + 12, codeY + 32);

  if (appended) {
    fill('#98C379');
    text('b.append(' + appendValue + ')', codeX + 12, codeY + 54);
  }

  textFont('sans-serif');
}

function drawMemoryDiagram() {
  let diagramY = 135;
  let varColX = margin + 20;
  let objColX = canvasWidth / 2 + 20;
  let cellW = 40;
  let cellH = 35;

  // Section label
  noStroke();
  fill('#666');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Variables', varColX, diagramY);
  text('Objects in Memory', objColX - 10, diagramY);

  diagramY += 25;

  // Variable box for 'a'
  let varAY = diagramY + 10;
  drawVarBox('a', varColX, varAY);

  // Variable box for 'b'
  let varBY = diagramY + 80;
  drawVarBox('b', varColX, varBY);

  // List object(s)
  let objAY = diagramY + 10;
  let objBY = diagramY + 80;

  if (isAlias) {
    // Both point to same object - draw one list centered vertically
    let sharedY = diagramY + 40;
    drawListObject(listA, objColX, sharedY, '#FF9999', 'id: 0x1A2B');

    // Draw arrows from both variables to same object
    drawArrow(varColX + 50, varAY + 15, objColX - 5, sharedY + 15, '#E74C3C');
    drawArrow(varColX + 50, varBY + 15, objColX - 5, sharedY + 15, '#E74C3C');

    // Shared label
    noStroke();
    fill('#E74C3C');
    textAlign(CENTER, TOP);
    textSize(12);
    text('Same object!', (varColX + 50 + objColX) / 2, sharedY + 45);
  } else {
    // Independent objects
    drawListObject(listA, objColX, objAY, '#90EE90', 'id: 0x1A2B');
    drawListObject(listB, objColX, objBY, '#90EE90', 'id: 0x3C4D');

    // Draw arrows
    drawArrow(varColX + 50, varAY + 15, objColX - 5, objAY + 15, '#27AE60');
    drawArrow(varColX + 50, varBY + 15, objColX - 5, objBY + 15, '#27AE60');

    // Independent label
    noStroke();
    fill('#27AE60');
    textAlign(CENTER, TOP);
    textSize(12);
    text('Independent copies', (varColX + 50 + objColX) / 2, objBY + 50);
  }

  // Identity check display
  let checkY = diagramY + 155;
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  textFont('monospace');

  fill('#333');
  text('a == b  →  ', margin + 10, checkY);
  fill(listA.toString() === listB.toString() ? '#27AE60' : '#E74C3C');
  text(listA.toString() === listB.toString() ? 'True' : 'False', margin + 120, checkY);

  fill('#333');
  text('a is b  →  ', margin + 10, checkY + 22);
  fill(isAlias ? '#E74C3C' : '#27AE60');
  let isResult = isAlias ? 'True  (same object!)' : 'False (different objects)';
  text(isResult, margin + 120, checkY + 22);

  textFont('sans-serif');
}

function drawVarBox(name, x, y) {
  fill('#E8E8F0');
  stroke('#888');
  strokeWeight(1);
  rect(x, y, 50, 30, 5);

  noStroke();
  fill('#333');
  textAlign(CENTER, CENTER);
  textSize(16);
  textFont('monospace');
  text(name, x + 25, y + 15);
  textFont('sans-serif');
}

function drawListObject(items, x, y, bgColor, idLabel) {
  let cellW = 38;
  let cellH = 30;

  for (let i = 0; i < items.length; i++) {
    let cx = x + i * cellW;

    // Animate new items
    let alpha = 255;
    if (animating && appended && i === items.length - 1) {
      alpha = Math.floor(animProgress * 255);
    }

    fill(red(color(bgColor)), green(color(bgColor)), blue(color(bgColor)), alpha);
    stroke(150, 150, 150, alpha);
    strokeWeight(1);
    rect(cx, y, cellW, cellH, 4);

    // Index above
    noStroke();
    fill(100, 100, 100, alpha);
    textAlign(CENTER, BOTTOM);
    textSize(10);
    text(i, cx + cellW / 2, y - 1);

    // Value
    fill(50, 50, 50, alpha);
    textAlign(CENTER, CENTER);
    textSize(14);
    text(items[i], cx + cellW / 2, y + cellH / 2);
  }

  // ID label below
  noStroke();
  fill('#999');
  textAlign(LEFT, TOP);
  textSize(9);
  text(idLabel, x, y + cellH + 3);
}

function drawArrow(x1, y1, x2, y2, col) {
  stroke(col);
  strokeWeight(2);
  line(x1, y1, x2, y2);

  // Arrowhead
  let angle = atan2(y2 - y1, x2 - x1);
  let headLen = 8;
  fill(col);
  noStroke();
  triangle(
    x2, y2,
    x2 - headLen * cos(angle - 0.4), y2 - headLen * sin(angle - 0.4),
    x2 - headLen * cos(angle + 0.4), y2 - headLen * sin(angle + 0.4)
  );
}

function changeMode() {
  mode = modeSelect.value();
  doReset();
}

function doAppend() {
  if (appended) return;
  appended = true;
  animating = true;
  animProgress = 0;

  if (isAlias) {
    // Both point to same list
    listA.push(appendValue);
    // listB is same reference, already has the value
    statusMsg = 'b.append(4) also changed a! Both point to the same list.';
    statusColor = '#E74C3C';
  } else {
    // Independent copies
    listB.push(appendValue);
    statusMsg = 'b.append(4) only changed b. a is unaffected (independent copy).';
    statusColor = '#27AE60';
  }
}

function doReset() {
  listA = [1, 2, 3];
  listB = [1, 2, 3];
  appended = false;
  animating = false;
  animProgress = 0;
  statusMsg = '';

  isAlias = (mode === 'alias');
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
