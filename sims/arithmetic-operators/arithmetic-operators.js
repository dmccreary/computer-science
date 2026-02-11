// Arithmetic Operators Explorer MicroSim
// Bloom Level: Apply (L3) - calculate, use
// Students apply Python's seven arithmetic operators to compute correct results.

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Controls
let inputA, inputB, operatorSelect;
let challengeBtn, revealBtn;

// Operator list matching Python's seven arithmetic operators
let operators = ['+', '-', '*', '/', '//', '%', '**'];

// Challenge mode state
let challengeMode = false;
let challengeA = 0;
let challengeB = 0;
let challengeOp = '+';
let challengeAnswer = null;
let challengeRevealed = false;
let challengeUserInput = null;
let challengeScore = 0;
let challengeTotal = 0;
let challengeFeedback = '';
let challengeFeedbackTimer = 0;

function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    canvasWidth = Math.min(mainEl.clientWidth, 600);
    canvasWidth = Math.max(canvasWidth, 350);
  }
  canvasHeight = drawHeight + controlHeight;
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  let mainEl = document.querySelector('main');

  // Input A
  inputA = createInput('7');
  inputA.parent(mainEl);
  inputA.attribute('type', 'number');
  inputA.style('width', '60px');
  inputA.style('font-size', '16px');
  inputA.style('text-align', 'center');
  inputA.style('padding', '4px');

  // Operator dropdown
  operatorSelect = createSelect();
  operatorSelect.parent(mainEl);
  for (let i = 0; i < operators.length; i++) {
    operatorSelect.option(operators[i]);
  }
  operatorSelect.selected('+');
  operatorSelect.style('font-size', '16px');
  operatorSelect.style('padding', '4px');

  // Input B
  inputB = createInput('3');
  inputB.parent(mainEl);
  inputB.attribute('type', 'number');
  inputB.style('width', '60px');
  inputB.style('font-size', '16px');
  inputB.style('text-align', 'center');
  inputB.style('padding', '4px');

  // Challenge mode button
  challengeBtn = createButton('Challenge Mode');
  challengeBtn.parent(mainEl);
  challengeBtn.mousePressed(toggleChallengeMode);
  challengeBtn.style('font-size', '14px');
  challengeBtn.style('padding', '4px 12px');
  challengeBtn.style('cursor', 'pointer');

  // Challenge answer input (hidden initially)
  challengeUserInput = createInput('');
  challengeUserInput.parent(mainEl);
  challengeUserInput.attribute('type', 'number');
  challengeUserInput.style('width', '70px');
  challengeUserInput.style('font-size', '16px');
  challengeUserInput.style('text-align', 'center');
  challengeUserInput.style('padding', '4px');
  challengeUserInput.hide();

  // Reveal / Submit button
  revealBtn = createButton('Check');
  revealBtn.parent(mainEl);
  revealBtn.mousePressed(checkChallengeAnswer);
  revealBtn.style('font-size', '14px');
  revealBtn.style('padding', '4px 12px');
  revealBtn.style('cursor', 'pointer');
  revealBtn.hide();

  positionControls();

  describe('An interactive arithmetic operators explorer where students enter two numbers and an operator to see the result with visual explanations. Includes a challenge mode for practice.');
}

function positionControls() {
  let mainEl = document.querySelector('main');
  if (!mainEl) return;
  let canvasEl = mainEl.querySelector('canvas');
  if (!canvasEl) return;

  let canvasRect = canvasEl.getBoundingClientRect();
  let mainRect = mainEl.getBoundingClientRect();
  let offsetX = canvasRect.left - mainRect.left;
  let offsetY = canvasRect.top - mainRect.top;

  let ctrlY = offsetY + drawHeight + 10;
  let centerX = offsetX + canvasWidth / 2;

  // Position A, operator, B inputs centered
  let groupWidth = 60 + 8 + 55 + 8 + 60; // A + gap + select + gap + B
  let startX = centerX - groupWidth / 2;

  inputA.position(startX, ctrlY);
  operatorSelect.position(startX + 68, ctrlY);
  inputB.position(startX + 131, ctrlY);

  // Challenge button
  challengeBtn.position(centerX - 60, ctrlY + 38);

  // Challenge answer input and check button
  challengeUserInput.position(centerX + 60, ctrlY + 38);
  revealBtn.position(centerX + 140, ctrlY + 38);
}

function draw() {
  // Draw area background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  noStroke();
  fill(40);
  textAlign(CENTER, TOP);
  textSize(22);
  text('Arithmetic Operators Explorer', canvasWidth / 2, 10);

  if (challengeMode) {
    drawChallengeMode();
  } else {
    drawExplorerMode();
  }
}

// ========== EXPLORER MODE ==========

function drawExplorerMode() {
  let a = parseFloat(inputA.value());
  let b = parseFloat(inputB.value());
  let op = operatorSelect.value();

  // Validate inputs
  if (isNaN(a) || isNaN(b)) {
    noStroke();
    fill(180, 50, 50);
    textAlign(CENTER, CENTER);
    textSize(18);
    text('Enter valid numbers for A and B.', canvasWidth / 2, 70);
    return;
  }

  // Compute result
  let result = computeResult(a, b, op);
  let resultStr = formatResult(result);
  let exprStr = formatExpression(a, b, op);

  // Expression display
  noStroke();
  fill(30);
  textAlign(CENTER, TOP);
  textSize(28);

  if (result === 'ERROR') {
    text(exprStr + ' = Error!', canvasWidth / 2, 50);
    fill(180, 50, 50);
    textSize(16);
    text('Division by zero is not allowed.', canvasWidth / 2, 88);
  } else {
    text(exprStr + ' = ' + resultStr, canvasWidth / 2, 50);
  }

  // Operator description
  noStroke();
  fill(80);
  textAlign(CENTER, TOP);
  textSize(14);
  text(getOperatorDescription(op), canvasWidth / 2, 90);

  // Visual explanation area
  if (result !== 'ERROR') {
    drawVisualExplanation(a, b, op, result, 120);
  }
}

// ========== COMPUTATION ==========

function computeResult(a, b, op) {
  switch (op) {
    case '+':  return a + b;
    case '-':  return a - b;
    case '*':  return a * b;
    case '/':
      if (b === 0) return 'ERROR';
      return a / b;
    case '//':
      if (b === 0) return 'ERROR';
      return Math.floor(a / b);
    case '%':
      if (b === 0) return 'ERROR';
      // Python-style modulo: result has same sign as divisor
      return ((a % b) + b) % b;
    case '**':
      return Math.pow(a, b);
    default:
      return 0;
  }
}

function formatResult(result) {
  if (result === 'ERROR') return 'Error';
  if (Number.isInteger(result)) return result.toString();
  // Show up to 4 decimal places
  let rounded = Math.round(result * 10000) / 10000;
  return rounded.toString();
}

function formatExpression(a, b, op) {
  let aStr = Number.isInteger(a) ? a.toString() : a.toString();
  let bStr = Number.isInteger(b) ? b.toString() : b.toString();
  return aStr + ' ' + op + ' ' + bStr;
}

function getOperatorDescription(op) {
  switch (op) {
    case '+':  return 'Addition: adds two numbers together';
    case '-':  return 'Subtraction: finds the difference between two numbers';
    case '*':  return 'Multiplication: multiplies two numbers together';
    case '/':  return 'Division: divides and returns a decimal (float) result';
    case '//': return 'Integer Division (floor): divides and rounds down to the nearest whole number';
    case '%':  return 'Modulo: returns the remainder after division';
    case '**': return 'Exponentiation: raises a number to a power';
    default:   return '';
  }
}

// ========== VISUAL EXPLANATIONS ==========

function drawVisualExplanation(a, b, op, result, startY) {
  let visAreaX = margin;
  let visAreaW = canvasWidth - margin * 2;
  let visAreaY = startY;
  let visAreaH = drawHeight - startY - 10;

  switch (op) {
    case '+':
      drawAdditionVisual(a, b, result, visAreaX, visAreaY, visAreaW, visAreaH);
      break;
    case '-':
      drawSubtractionVisual(a, b, result, visAreaX, visAreaY, visAreaW, visAreaH);
      break;
    case '*':
      drawMultiplicationVisual(a, b, result, visAreaX, visAreaY, visAreaW, visAreaH);
      break;
    case '/':
      drawDivisionVisual(a, b, result, visAreaX, visAreaY, visAreaW, visAreaH);
      break;
    case '//':
      drawFloorDivisionVisual(a, b, result, visAreaX, visAreaY, visAreaW, visAreaH);
      break;
    case '%':
      drawModuloVisual(a, b, result, visAreaX, visAreaY, visAreaW, visAreaH);
      break;
    case '**':
      drawExponentiationVisual(a, b, result, visAreaX, visAreaY, visAreaW, visAreaH);
      break;
  }
}

// --- ADDITION VISUAL: two bars joined end-to-end ---
function drawAdditionVisual(a, b, result, x, y, w, h) {
  let barY = y + 50;
  let barH = 36;
  let maxVal = Math.abs(a) + Math.abs(b);
  if (maxVal === 0) maxVal = 1;
  let scale = (w - 20) / maxVal;

  // Clamp scale so bars are not absurdly large
  scale = Math.min(scale, (w - 20) / Math.max(Math.abs(result), 1));

  let barA = Math.abs(a) * scale;
  let barB = Math.abs(b) * scale;
  let startX = x + 10;

  // Label
  noStroke();
  fill(60);
  textAlign(LEFT, TOP);
  textSize(15);
  text('Visual: combining A and B on a bar', x, y + 5);

  // Bar for A
  fill(70, 130, 220);
  noStroke();
  rect(startX, barY, barA, barH, 4);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(14);
  if (barA > 30) text(a, startX + barA / 2, barY + barH / 2);

  // Bar for B
  fill(220, 130, 70);
  noStroke();
  rect(startX + barA, barY, barB, barH, 4);
  fill(255);
  if (barB > 30) text(b, startX + barA + barB / 2, barY + barH / 2);

  // Result bracket below
  noStroke();
  fill(40);
  textAlign(CENTER, TOP);
  textSize(16);
  text('Total = ' + formatResult(result), startX + (barA + barB) / 2, barY + barH + 12);

  // Legend
  textSize(13);
  fill(70, 130, 220);
  textAlign(LEFT, TOP);
  rect(x + 10, barY + barH + 50, 14, 14, 2);
  fill(60);
  noStroke();
  text('A = ' + a, x + 30, barY + barH + 50);

  fill(220, 130, 70);
  rect(x + 120, barY + barH + 50, 14, 14, 2);
  fill(60);
  noStroke();
  text('B = ' + b, x + 140, barY + barH + 50);
}

// --- SUBTRACTION VISUAL: bar for A with B portion removed ---
function drawSubtractionVisual(a, b, result, x, y, w, h) {
  let barY = y + 50;
  let barH = 36;
  let maxVal = Math.max(Math.abs(a), Math.abs(b), Math.abs(result), 1);
  let scale = (w - 20) / maxVal;

  let startX = x + 10;

  noStroke();
  fill(60);
  textAlign(LEFT, TOP);
  textSize(15);
  text('Visual: removing B from A', x, y + 5);

  // Full bar for A (dimmed where B will be removed)
  let barA = Math.abs(a) * scale;
  let barB = Math.min(Math.abs(b) * scale, barA);
  let barResult = Math.abs(result) * scale;

  // Result portion
  fill(70, 130, 220);
  noStroke();
  rect(startX, barY, barResult, barH, 4);

  // B portion (what gets removed), shown with hatching
  fill(220, 100, 100, 120);
  rect(startX + barResult, barY, barB, barH, 4);

  // Labels
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(14);
  if (barResult > 40) text(formatResult(result), startX + barResult / 2, barY + barH / 2);

  fill(255, 200, 200);
  if (barB > 30) text('-' + b, startX + barResult + barB / 2, barY + barH / 2);

  // Result label
  noStroke();
  fill(40);
  textAlign(CENTER, TOP);
  textSize(16);
  text('Result = ' + formatResult(result), x + w / 2, barY + barH + 15);
}

// --- MULTIPLICATION VISUAL: area model (grid of rows) ---
function drawMultiplicationVisual(a, b, result, x, y, w, h) {
  noStroke();
  fill(60);
  textAlign(LEFT, TOP);
  textSize(15);
  text('Visual: area model (rows x columns)', x, y + 5);

  let absA = Math.abs(a);
  let absB = Math.abs(b);

  // For small integer values, draw a grid
  if (Number.isInteger(a) && Number.isInteger(b) && absA <= 12 && absB <= 12 && absA > 0 && absB > 0) {
    let gridY = y + 30;
    let maxCellSize = 28;
    let cellW = Math.min(maxCellSize, (w - 40) / absB);
    let cellH = Math.min(maxCellSize, (h - 80) / absA);
    let cellSize = Math.min(cellW, cellH);
    let gridW = absB * cellSize;
    let gridH = absA * cellSize;
    let gridX = x + (w - gridW) / 2;

    for (let r = 0; r < absA; r++) {
      for (let c = 0; c < absB; c++) {
        let hueVal = map(r, 0, absA, 160, 240);
        fill(hueVal, 180, 240);
        stroke(255);
        strokeWeight(1);
        rect(gridX + c * cellSize, gridY + r * cellSize, cellSize, cellSize, 2);
      }
    }

    // Dimension labels
    noStroke();
    fill(40);
    textAlign(CENTER, TOP);
    textSize(14);
    text(absB + ' columns', gridX + gridW / 2, gridY + gridH + 8);

    textAlign(RIGHT, CENTER);
    push();
    translate(gridX - 8, gridY + gridH / 2);
    rotate(-HALF_PI);
    textAlign(CENTER, BOTTOM);
    text(absA + ' rows', 0, 0);
    pop();

    noStroke();
    fill(40);
    textAlign(CENTER, TOP);
    textSize(16);
    text(a + ' x ' + b + ' = ' + formatResult(result) + ' cells', x + w / 2, gridY + gridH + 30);
  } else {
    // For large or non-integer values, show text explanation
    noStroke();
    fill(40);
    textAlign(CENTER, CENTER);
    textSize(18);
    text(a + ' x ' + b + ' = ' + formatResult(result), x + w / 2, y + h / 2 - 10);
    textSize(14);
    fill(80);
    text('(Values too large or non-integer for grid)', x + w / 2, y + h / 2 + 20);
  }
}

// --- DIVISION VISUAL: number line with result marker ---
function drawDivisionVisual(a, b, result, x, y, w, h) {
  noStroke();
  fill(60);
  textAlign(LEFT, TOP);
  textSize(15);
  text('Visual: result on a number line', x, y + 5);

  let lineY = y + 80;
  let lineX1 = x + 30;
  let lineX2 = x + w - 30;
  let lineW = lineX2 - lineX1;

  // Determine range for number line
  let minVal = Math.min(0, result);
  let maxVal = Math.max(0, result);
  if (minVal === maxVal) { minVal = result - 1; maxVal = result + 1; }
  // Add padding
  let range = maxVal - minVal;
  minVal -= range * 0.15;
  maxVal += range * 0.15;
  range = maxVal - minVal;

  // Number line
  stroke(80);
  strokeWeight(2);
  line(lineX1, lineY, lineX2, lineY);

  // Tick marks
  let numTicks = 5;
  noStroke();
  fill(80);
  textAlign(CENTER, TOP);
  textSize(12);
  for (let i = 0; i <= numTicks; i++) {
    let val = minVal + (range * i / numTicks);
    let tickX = lineX1 + (lineW * i / numTicks);
    stroke(80);
    strokeWeight(1);
    line(tickX, lineY - 5, tickX, lineY + 5);
    noStroke();
    fill(80);
    let tickLabel = Math.round(val * 100) / 100;
    text(tickLabel, tickX, lineY + 10);
  }

  // Result marker
  let resultX = lineX1 + ((result - minVal) / range) * lineW;
  resultX = constrain(resultX, lineX1, lineX2);

  fill(220, 60, 60);
  noStroke();
  triangle(resultX - 8, lineY - 14, resultX + 8, lineY - 14, resultX, lineY - 4);
  ellipse(resultX, lineY, 8, 8);

  // Result label
  fill(220, 60, 60);
  textAlign(CENTER, BOTTOM);
  textSize(16);
  text(formatResult(result), resultX, lineY - 16);

  // Explanation
  noStroke();
  fill(40);
  textAlign(CENTER, TOP);
  textSize(15);
  text(a + ' / ' + b + ' = ' + formatResult(result), x + w / 2, lineY + 40);
  textSize(13);
  fill(100);
  text('Note: Python / always returns a float (decimal)', x + w / 2, lineY + 62);
}

// --- FLOOR DIVISION VISUAL: bar split into groups ---
function drawFloorDivisionVisual(a, b, result, x, y, w, h) {
  noStroke();
  fill(60);
  textAlign(LEFT, TOP);
  textSize(15);
  text('Visual: dividing into groups of ' + b, x, y + 5);

  let absA = Math.abs(a);
  let absB = Math.abs(b);
  let absResult = Math.abs(result);
  let remainder = ((a % b) + b) % b; // Python-style remainder

  let barY = y + 55;
  let barH = 40;
  let barW = w - 20;
  let startX = x + 10;

  if (absA === 0) {
    noStroke();
    fill(40);
    textAlign(CENTER, CENTER);
    textSize(18);
    text('0 // ' + b + ' = 0', x + w / 2, y + h / 2);
    return;
  }

  // Draw full bar
  stroke(120);
  strokeWeight(1);
  fill(230);
  rect(startX, barY, barW, barH, 4);

  // Color groups
  let unitW = barW / absA;
  let groupColors = [
    [70, 130, 220],
    [220, 130, 70],
    [70, 200, 120],
    [180, 100, 200],
    [200, 200, 70],
    [100, 200, 200]
  ];

  let unitIndex = 0;
  for (let g = 0; g < absResult; g++) {
    let gc = groupColors[g % groupColors.length];
    fill(gc[0], gc[1], gc[2]);
    noStroke();
    for (let u = 0; u < absB; u++) {
      if (unitIndex < absA) {
        rect(startX + unitIndex * unitW, barY, unitW, barH);
        unitIndex++;
      }
    }
    // Group label
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(12);
    let groupStart = startX + (unitIndex - absB) * unitW;
    let groupW = absB * unitW;
    if (groupW > 20) {
      text('Group ' + (g + 1), groupStart + groupW / 2, barY + barH / 2);
    }
  }

  // Remainder (leftover) highlighted differently
  if (remainder > 0) {
    fill(255, 100, 100, 160);
    noStroke();
    for (let u = 0; u < remainder; u++) {
      if (unitIndex < absA) {
        rect(startX + unitIndex * unitW, barY, unitW, barH);
        unitIndex++;
      }
    }
    fill(120, 30, 30);
    textAlign(CENTER, CENTER);
    textSize(12);
    let remStart = startX + (absA - remainder) * unitW;
    let remW = remainder * unitW;
    if (remW > 30) {
      text('leftover', remStart + remW / 2, barY + barH / 2);
    }
  }

  // Grid lines between units
  stroke(255, 255, 255, 150);
  strokeWeight(1);
  for (let i = 1; i < absA; i++) {
    line(startX + i * unitW, barY, startX + i * unitW, barY + barH);
  }

  // Explanation text
  noStroke();
  fill(40);
  textAlign(CENTER, TOP);
  textSize(15);
  text(a + ' // ' + b + ' = ' + result + '  (full groups: ' + absResult + ', leftover: ' + remainder + ')', x + w / 2, barY + barH + 15);

  // Additional note about floor division
  fill(100);
  textSize(13);
  text('Floor division always rounds DOWN toward negative infinity.', x + w / 2, barY + barH + 38);

  // Comparison with regular division
  let exactDiv = a / b;
  fill(80);
  textSize(13);
  text('Regular division: ' + a + ' / ' + b + ' = ' + formatResult(exactDiv), x + w / 2, barY + barH + 58);
}

// --- MODULO VISUAL: bar with remainder highlighted ---
function drawModuloVisual(a, b, result, x, y, w, h) {
  noStroke();
  fill(60);
  textAlign(LEFT, TOP);
  textSize(15);
  text('Visual: finding the remainder', x, y + 5);

  let absA = Math.abs(a);
  let absB = Math.abs(b);
  let quotient = Math.floor(a / b);
  let absQuotient = Math.abs(quotient);
  let remainder = result; // Python-style

  let barY = y + 55;
  let barH = 40;
  let barW = w - 20;
  let startX = x + 10;

  if (absA === 0) {
    noStroke();
    fill(40);
    textAlign(CENTER, CENTER);
    textSize(18);
    text('0 % ' + b + ' = 0', x + w / 2, y + h / 2);
    return;
  }

  // Draw full bar
  stroke(120);
  strokeWeight(1);
  fill(230);
  rect(startX, barY, barW, barH, 4);

  let unitW = barW / absA;
  let usedUnits = absQuotient * absB;

  // Used portion (dimmed)
  fill(160, 180, 200);
  noStroke();
  let usedW = Math.min(usedUnits * unitW, barW);
  rect(startX, barY, usedW, barH, 4);

  // Remainder portion (bright)
  let absRemainder = Math.abs(remainder);
  if (absRemainder > 0) {
    fill(255, 180, 60);
    let remW = absRemainder * unitW;
    rect(startX + usedW, barY, remW, barH, 4);

    fill(120, 60, 0);
    textAlign(CENTER, CENTER);
    textSize(14);
    if (remW > 50) {
      text('Remainder', startX + usedW + remW / 2, barY + barH / 2);
    }
  }

  // Grid lines
  stroke(255, 255, 255, 150);
  strokeWeight(1);
  for (let i = 1; i < absA; i++) {
    line(startX + i * unitW, barY, startX + i * unitW, barY + barH);
  }

  // Used label
  noStroke();
  fill(80, 100, 120);
  textAlign(CENTER, CENTER);
  textSize(13);
  if (usedW > 60) {
    text(absQuotient + ' full group' + (absQuotient !== 1 ? 's' : '') + ' of ' + absB, startX + usedW / 2, barY + barH / 2);
  }

  // Explanation
  noStroke();
  fill(40);
  textAlign(CENTER, TOP);
  textSize(15);
  text(a + ' % ' + b + ' = ' + formatResult(remainder), x + w / 2, barY + barH + 15);

  fill(100);
  textSize(13);
  text(a + ' = ' + quotient + ' x ' + b + ' + ' + formatResult(remainder), x + w / 2, barY + barH + 38);
  text('The modulo operator returns just the remainder.', x + w / 2, barY + barH + 58);

  // Legend
  textSize(12);
  fill(160, 180, 200);
  rect(x + w / 2 - 100, barY + barH + 80, 14, 14, 2);
  fill(80);
  noStroke();
  textAlign(LEFT, CENTER);
  text('Used', x + w / 2 - 82, barY + barH + 87);

  fill(255, 180, 60);
  rect(x + w / 2, barY + barH + 80, 14, 14, 2);
  fill(80);
  noStroke();
  text('Remainder', x + w / 2 + 18, barY + barH + 87);
}

// --- EXPONENTIATION VISUAL: repeated multiplication ---
function drawExponentiationVisual(a, b, result, x, y, w, h) {
  noStroke();
  fill(60);
  textAlign(LEFT, TOP);
  textSize(15);
  text('Visual: repeated multiplication', x, y + 5);

  let displayY = y + 40;

  // Build repeated multiplication string
  if (Number.isInteger(b) && b >= 0 && b <= 10) {
    let parts = [];
    for (let i = 0; i < b; i++) {
      parts.push(a.toString());
    }
    let repeatStr = b === 0 ? '(anything to the power 0 = 1)' : parts.join(' x ');

    noStroke();
    fill(40);
    textAlign(CENTER, TOP);
    textSize(16);

    // Break into lines if too long
    if (repeatStr.length > 40) {
      textSize(14);
    }
    text(a + '**' + b + ' means:', x + w / 2, displayY);

    fill(70, 50, 150);
    textSize(Math.max(14, Math.min(20, w / (repeatStr.length * 0.6))));
    text(repeatStr, x + w / 2, displayY + 30);

    // Show step-by-step accumulation
    if (b >= 2 && b <= 10) {
      let stepY = displayY + 70;
      textSize(14);
      fill(80);
      textAlign(CENTER, TOP);
      text('Step by step:', x + w / 2, stepY);

      let accumulated = a;
      let stepStr = '';
      for (let i = 1; i < b; i++) {
        let prev = accumulated;
        accumulated *= a;
        stepStr += a + '^' + (i + 1) + ' = ' + formatResult(prev) + ' x ' + a + ' = ' + formatResult(accumulated);
        if (i < b - 1) stepStr += '   |   ';
      }

      // Draw each step on its own line for clarity
      accumulated = a;
      for (let i = 1; i < b; i++) {
        let prev = accumulated;
        accumulated *= a;
        let lineStr = a + ' x ' + formatResult(prev) + ' = ' + formatResult(accumulated);

        fill(i === b - 1 ? color(0, 130, 50) : color(80));
        textSize(i === b - 1 ? 16 : 14);
        text('Step ' + (i + 1) + ':  ' + lineStr, x + w / 2, stepY + 22 + (i - 1) * 22);
      }
    }

    // Final result
    noStroke();
    fill(40);
    textAlign(CENTER, TOP);
    textSize(18);
    let finalY = displayY + 70 + (Math.max(0, b - 1) * 22) + 20;
    if (finalY < drawHeight - 30) {
      fill(0, 100, 180);
      text('Result: ' + formatResult(result), x + w / 2, finalY);
    }
  } else {
    // Non-integer or large exponent
    noStroke();
    fill(40);
    textAlign(CENTER, CENTER);
    textSize(18);
    text(a + ' ** ' + b + ' = ' + formatResult(result), x + w / 2, y + h / 2 - 10);
    fill(80);
    textSize(14);
    if (b < 0) {
      text('Negative exponent: ' + a + '**' + b + ' = 1 / ' + a + '**' + Math.abs(b), x + w / 2, y + h / 2 + 20);
    } else {
      text('(Exponent too large for step-by-step display)', x + w / 2, y + h / 2 + 20);
    }
  }
}

// ========== CHALLENGE MODE ==========

function toggleChallengeMode() {
  challengeMode = !challengeMode;
  if (challengeMode) {
    generateChallenge();
    challengeBtn.html('New Challenge');
    challengeUserInput.show();
    revealBtn.show();
    inputA.hide();
    inputB.hide();
    operatorSelect.hide();
  } else {
    challengeBtn.html('Challenge Mode');
    challengeUserInput.hide();
    revealBtn.hide();
    inputA.show();
    inputB.show();
    operatorSelect.show();
    challengeScore = 0;
    challengeTotal = 0;
  }
}

function generateChallenge() {
  // Pick random operator
  challengeOp = random(operators);

  // Generate appropriate numbers based on operator
  switch (challengeOp) {
    case '+':
      challengeA = floor(random(1, 50));
      challengeB = floor(random(1, 50));
      break;
    case '-':
      challengeA = floor(random(5, 50));
      challengeB = floor(random(1, challengeA + 1));
      break;
    case '*':
      challengeA = floor(random(2, 13));
      challengeB = floor(random(2, 13));
      break;
    case '/':
      challengeB = floor(random(2, 10));
      challengeA = challengeB * floor(random(2, 10));
      break;
    case '//':
      challengeB = floor(random(2, 8));
      challengeA = floor(random(5, 30));
      break;
    case '%':
      challengeB = floor(random(2, 10));
      challengeA = floor(random(5, 30));
      break;
    case '**':
      challengeA = floor(random(2, 6));
      challengeB = floor(random(2, 4));
      break;
  }

  challengeAnswer = computeResult(challengeA, challengeB, challengeOp);
  challengeRevealed = false;
  challengeFeedback = '';
  challengeUserInput.value('');
}

function checkChallengeAnswer() {
  let userVal = parseFloat(challengeUserInput.value());
  if (isNaN(userVal)) {
    challengeFeedback = 'Please enter a number!';
    challengeFeedbackTimer = millis();
    return;
  }

  challengeTotal++;
  // Allow small floating point tolerance for division
  let correct = false;
  if (typeof challengeAnswer === 'number') {
    correct = Math.abs(userVal - challengeAnswer) < 0.01;
  }

  if (correct) {
    challengeScore++;
    challengeFeedback = 'Correct! Great job!';
  } else {
    challengeFeedback = 'Not quite! The answer is ' + formatResult(challengeAnswer);
  }
  challengeRevealed = true;
  challengeFeedbackTimer = millis();
}

function drawChallengeMode() {
  // Challenge expression
  noStroke();
  fill(40);
  textAlign(CENTER, TOP);
  textSize(14);
  text('Solve this problem:', canvasWidth / 2, 42);

  // The problem
  textSize(32);
  fill(30, 60, 140);
  let expr = challengeA + ' ' + challengeOp + ' ' + challengeB + ' = ?';
  text(expr, canvasWidth / 2, 62);

  // Operator hint
  fill(100);
  textSize(14);
  text(getOperatorDescription(challengeOp), canvasWidth / 2, 102);

  // Score display
  noStroke();
  fill(60);
  textAlign(RIGHT, TOP);
  textSize(16);
  text('Score: ' + challengeScore + ' / ' + challengeTotal, canvasWidth - margin, 42);

  // Feedback
  if (challengeFeedback !== '') {
    textAlign(CENTER, TOP);
    textSize(20);
    if (challengeRevealed && challengeFeedback.startsWith('Correct')) {
      fill(0, 150, 60);
    } else if (challengeRevealed) {
      fill(200, 60, 30);
    } else {
      fill(180, 120, 0);
    }
    text(challengeFeedback, canvasWidth / 2, 135);
  }

  // If revealed, show the visual explanation
  if (challengeRevealed && challengeAnswer !== 'ERROR') {
    drawVisualExplanation(challengeA, challengeB, challengeOp, challengeAnswer, 170);

    // Show "Next" prompt
    noStroke();
    fill(80);
    textAlign(CENTER, BOTTOM);
    textSize(14);
    text('Click "New Challenge" for another problem!', canvasWidth / 2, drawHeight - 5);
  } else if (!challengeRevealed) {
    // Encouragement text
    noStroke();
    fill(120);
    textAlign(CENTER, CENTER);
    textSize(16);
    text('Type your answer below and click "Check"!', canvasWidth / 2, 200);

    // Hint area
    fill(140);
    textSize(14);
    textAlign(CENTER, TOP);
    let hintY = 240;
    switch (challengeOp) {
      case '//':
        text('Hint: Integer division rounds DOWN.', canvasWidth / 2, hintY);
        text('Example: 7 // 2 = 3 (not 3.5)', canvasWidth / 2, hintY + 20);
        break;
      case '%':
        text('Hint: Modulo gives the REMAINDER.', canvasWidth / 2, hintY);
        text('Example: 7 % 3 = 1 (because 7 = 2x3 + 1)', canvasWidth / 2, hintY + 20);
        break;
      case '**':
        text('Hint: Exponentiation means repeated multiplication.', canvasWidth / 2, hintY);
        text('Example: 2 ** 3 = 2 x 2 x 2 = 8', canvasWidth / 2, hintY + 20);
        break;
      case '/':
        text('Hint: Division returns a decimal (float).', canvasWidth / 2, hintY);
        text('Example: 7 / 2 = 3.5', canvasWidth / 2, hintY + 20);
        break;
      default:
        break;
    }
  }
}

// ========== WINDOW RESIZE ==========

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}
