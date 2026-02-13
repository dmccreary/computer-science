// List Indexing & Slicing Explorer MicroSim
// Students type index or slice expressions and see which items are selected

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// The list data
let items = ["ant", "bee", "cat", "dog", "elk", "fox", "goat", "hawk"];
let selectedIndices = [];
let resultText = '';
let errorText = '';

// Controls
let exprInput;
let evalBtn;
let presetBtns = [];
let presets = ['[0]', '[-1]', '[2:5]', '[:3]', '[::2]', '[::-1]'];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Row 1: Expression input and Evaluate button
  exprInput = createInput('[2:5]');
  exprInput.position(10, drawHeight + 8);
  exprInput.size(180);
  exprInput.attribute('placeholder', 'e.g. [2:5] or [-1]');
  exprInput.input(() => evaluateExpression());

  evalBtn = createButton('Evaluate');
  evalBtn.position(200, drawHeight + 7);
  evalBtn.mousePressed(evaluateExpression);

  // Row 2: Preset buttons
  let xPos = 10;
  for (let i = 0; i < presets.length; i++) {
    let btn = createButton(presets[i]);
    btn.position(xPos, drawHeight + 42);
    btn.mousePressed(makePresetHandler(presets[i]));
    presetBtns.push(btn);
    xPos += btn.size().width + 8;
  }

  // Initial evaluation
  evaluateExpression();

  describe('Interactive list indexing and slicing explorer with visual highlighting of selected elements', LABEL);
}

function makePresetHandler(preset) {
  return function() {
    exprInput.value(preset);
    evaluateExpression();
  };
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
  textSize(24);
  text('List Indexing & Slicing Explorer', canvasWidth / 2, 12);

  // Draw the list boxes
  let boxWidth = Math.min(80, (canvasWidth - 2 * margin - 7 * 6) / 8);
  let boxHeight = 55;
  let gap = 6;
  let totalWidth = items.length * boxWidth + (items.length - 1) * gap;
  let startX = (canvasWidth - totalWidth) / 2;
  let boxY = 100;

  for (let i = 0; i < items.length; i++) {
    let bx = startX + i * (boxWidth + gap);
    let isSelected = selectedIndices.includes(i);

    // Box
    if (isSelected) {
      fill('#FFD700');
      stroke('#B8860B');
      strokeWeight(2);
    } else {
      fill('#A8D8EA');
      stroke('#999');
      strokeWeight(1);
    }
    rect(bx, boxY, boxWidth, boxHeight, 8);

    // Positive index above
    noStroke();
    fill('#444');
    textAlign(CENTER, BOTTOM);
    textSize(13);
    text(i, bx + boxWidth / 2, boxY - 3);

    // Item text inside
    fill(isSelected ? '#333' : '#555');
    textAlign(CENTER, CENTER);
    textSize(Math.min(14, boxWidth * 0.35));
    text('"' + items[i] + '"', bx + boxWidth / 2, boxY + boxHeight / 2);

    // Negative index below
    fill('#888');
    textAlign(CENTER, TOP);
    textSize(12);
    text(i - items.length, bx + boxWidth / 2, boxY + boxHeight + 4);
  }

  // Labels
  noStroke();
  fill('#666');
  textAlign(LEFT, CENTER);
  textSize(12);
  text('Positive index:', startX - 5, boxY - 15);
  text('Negative index:', startX - 5, boxY + boxHeight + 15);

  // Variable name
  fill('#333');
  textAlign(CENTER, TOP);
  textSize(14);
  text('animals = ["ant", "bee", "cat", "dog", "elk", "fox", "goat", "hawk"]',
       canvasWidth / 2, boxY + boxHeight + 35);

  // Expression and result
  let exprStr = exprInput.value().trim();
  textSize(18);
  fill('#222');
  textAlign(CENTER, TOP);

  if (errorText !== '') {
    fill('#CC0000');
    textSize(16);
    text(errorText, canvasWidth / 2, boxY + boxHeight + 65);
  } else if (resultText !== '') {
    // Show expression
    fill('#006600');
    textSize(16);
    text('animals' + exprStr + '  =  ' + resultText, canvasWidth / 2, boxY + boxHeight + 65);

    // Show explanation
    fill('#555');
    textSize(13);
    text(getExplanation(exprStr), canvasWidth / 2, boxY + boxHeight + 90);
  }

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function evaluateExpression() {
  let expr = exprInput.value().trim();
  selectedIndices = [];
  resultText = '';
  errorText = '';

  if (expr === '') return;

  // Remove surrounding brackets if present
  let inner = expr;
  if (inner.startsWith('[') && inner.endsWith(']')) {
    inner = inner.substring(1, inner.length - 1);
  }

  // Check if it's a single index or a slice
  if (inner.includes(':')) {
    // Slice
    parseSlice(inner);
  } else {
    // Single index
    parseSingleIndex(inner);
  }
}

function parseSingleIndex(expr) {
  let idx = parseInt(expr);
  if (isNaN(idx)) {
    errorText = 'Invalid index: ' + expr;
    return;
  }

  let actualIdx = idx < 0 ? items.length + idx : idx;
  if (actualIdx < 0 || actualIdx >= items.length) {
    errorText = 'IndexError: list index out of range';
    return;
  }

  selectedIndices = [actualIdx];
  resultText = '"' + items[actualIdx] + '"';
}

function parseSlice(expr) {
  let parts = expr.split(':');
  let start, stop, step;

  if (parts.length === 2) {
    start = parts[0].trim() === '' ? null : parseInt(parts[0]);
    stop = parts[1].trim() === '' ? null : parseInt(parts[1]);
    step = 1;
  } else if (parts.length === 3) {
    start = parts[0].trim() === '' ? null : parseInt(parts[0]);
    stop = parts[1].trim() === '' ? null : parseInt(parts[1]);
    step = parts[2].trim() === '' ? 1 : parseInt(parts[2]);
  } else {
    errorText = 'Invalid slice syntax';
    return;
  }

  if (step === 0) {
    errorText = 'ValueError: slice step cannot be zero';
    return;
  }

  let len = items.length;

  // Resolve start and stop for positive step
  if (step > 0) {
    if (start === null) start = 0;
    else if (start < 0) start = Math.max(0, len + start);
    else start = Math.min(start, len);

    if (stop === null) stop = len;
    else if (stop < 0) stop = Math.max(0, len + stop);
    else stop = Math.min(stop, len);

    selectedIndices = [];
    for (let i = start; i < stop; i += step) {
      selectedIndices.push(i);
    }
  } else {
    // Negative step
    if (start === null) start = len - 1;
    else if (start < 0) start = Math.max(-1, len + start);
    else start = Math.min(start, len - 1);

    if (stop === null) stop = -1;
    else if (stop < 0) stop = Math.max(-1, len + stop);
    else stop = Math.min(stop, len);

    selectedIndices = [];
    for (let i = start; i > stop; i += step) {
      if (i >= 0 && i < len) {
        selectedIndices.push(i);
      }
    }
  }

  // Build result text
  let resultItems = selectedIndices.map(i => '"' + items[i] + '"');
  resultText = '[' + resultItems.join(', ') + ']';
}

function getExplanation(expr) {
  let inner = expr;
  if (inner.startsWith('[') && inner.endsWith(']')) {
    inner = inner.substring(1, inner.length - 1);
  }

  if (!inner.includes(':')) {
    let idx = parseInt(inner);
    if (idx < 0) {
      return 'Negative index: counts ' + Math.abs(idx) + ' from the end';
    }
    return 'Access item at position ' + idx;
  }

  let parts = inner.split(':');
  if (parts.length === 2) {
    let s = parts[0].trim(), e = parts[1].trim();
    if (s === '' && e === '') return 'Copy of the entire list';
    if (s === '') return 'From start up to (not including) index ' + e;
    if (e === '') return 'From index ' + s + ' to the end';
    return 'From index ' + s + ' up to (not including) index ' + e;
  }
  if (parts.length === 3) {
    let step = parts[2].trim();
    if (step === '-1') return 'Reversed list (step = -1)';
    if (step !== '' && step !== '1') return 'Every ' + step + 'th item in the range';
    return 'Slice with step';
  }
  return '';
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  exprInput.size(Math.min(180, canvasWidth / 3));
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
