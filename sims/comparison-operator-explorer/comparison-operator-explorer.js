// Comparison Operator Explorer MicroSim
// Bloom Level: Apply (L3) - experiment, predict, verify
// Students predict the result of comparison expressions, then reveal the answer.

let canvasWidth = 400;
let drawHeight = 380;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// ── State machine ──────────────────────────────────────────────────
// PREDICTING  -> student picks True or False
// REVEALED    -> answer shown; student clicks New Challenge
const PREDICTING = 0;
const REVEALED   = 1;
let gameState = PREDICTING;

// ── Expression data ────────────────────────────────────────────────
let leftValue  = 0;
let rightValue = 0;
let currentOperator = '==';
let operators = ['==', '!=', '>', '<', '>=', '<='];

// ── Prediction & scoring ───────────────────────────────────────────
let prediction = null;   // true, false, or null (not yet chosen)
let actualResult = null; // computed when revealed
let isCorrect = false;
let score = 0;
let totalAttempts = 0;

// ── Animation helpers ──────────────────────────────────────────────
let revealFrame = 0;     // frame counter for glow animation
let glowAlpha = 0;       // pulsing glow intensity

// ── p5 DOM controls ────────────────────────────────────────────────
let leftInput, rightInput, operatorSelect;
let trueBtn, falseBtn, revealBtn, newChallengeBtn;

// ────────────────────────────────────────────────────────────────────
//  Canvas sizing
// ────────────────────────────────────────────────────────────────────
function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    canvasWidth = Math.min(mainEl.clientWidth, 550);
    canvasWidth = Math.max(canvasWidth, 340);
  }
  canvasHeight = drawHeight + controlHeight;
}

// ────────────────────────────────────────────────────────────────────
//  Setup
// ────────────────────────────────────────────────────────────────────
function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  // --- Left value input ---
  leftInput = createInput('', 'text');
  leftInput.parent(document.querySelector('main'));
  leftInput.attribute('maxlength', '6');
  leftInput.style('font-size', '16px');
  leftInput.style('width', '60px');
  leftInput.style('text-align', 'center');
  leftInput.style('border', '2px solid #888');
  leftInput.style('border-radius', '4px');
  leftInput.style('padding', '4px');

  // --- Operator dropdown ---
  operatorSelect = createSelect();
  operatorSelect.parent(document.querySelector('main'));
  for (let op of operators) {
    operatorSelect.option(op);
  }
  operatorSelect.style('font-size', '16px');
  operatorSelect.style('padding', '4px 8px');
  operatorSelect.style('border', '2px solid #888');
  operatorSelect.style('border-radius', '4px');
  operatorSelect.style('font-family', 'monospace');

  // --- Right value input ---
  rightInput = createInput('', 'text');
  rightInput.parent(document.querySelector('main'));
  rightInput.attribute('maxlength', '6');
  rightInput.style('font-size', '16px');
  rightInput.style('width', '60px');
  rightInput.style('text-align', 'center');
  rightInput.style('border', '2px solid #888');
  rightInput.style('border-radius', '4px');
  rightInput.style('padding', '4px');

  // --- Prediction buttons ---
  trueBtn = createButton('True');
  trueBtn.parent(document.querySelector('main'));
  trueBtn.mousePressed(predictTrue);
  trueBtn.style('font-size', '16px');
  trueBtn.style('padding', '6px 20px');
  trueBtn.style('cursor', 'pointer');
  trueBtn.style('border-radius', '6px');
  trueBtn.style('border', '2px solid #4488cc');
  trueBtn.style('background', '#e8f0fe');

  falseBtn = createButton('False');
  falseBtn.parent(document.querySelector('main'));
  falseBtn.mousePressed(predictFalse);
  falseBtn.style('font-size', '16px');
  falseBtn.style('padding', '6px 20px');
  falseBtn.style('cursor', 'pointer');
  falseBtn.style('border-radius', '6px');
  falseBtn.style('border', '2px solid #4488cc');
  falseBtn.style('background', '#e8f0fe');

  // --- Reveal Answer button ---
  revealBtn = createButton('Reveal Answer');
  revealBtn.parent(document.querySelector('main'));
  revealBtn.mousePressed(revealAnswer);
  revealBtn.style('font-size', '16px');
  revealBtn.style('padding', '6px 18px');
  revealBtn.style('cursor', 'pointer');
  revealBtn.style('border-radius', '6px');
  revealBtn.style('border', '2px solid #666');
  revealBtn.style('background', '#f5f5f5');

  // --- New Challenge button ---
  newChallengeBtn = createButton('New Challenge');
  newChallengeBtn.parent(document.querySelector('main'));
  newChallengeBtn.mousePressed(generateNewChallenge);
  newChallengeBtn.style('font-size', '16px');
  newChallengeBtn.style('padding', '6px 18px');
  newChallengeBtn.style('cursor', 'pointer');
  newChallengeBtn.style('border-radius', '6px');
  newChallengeBtn.style('border', '2px solid #666');
  newChallengeBtn.style('background', '#f5f5f5');

  // Generate the first challenge
  generateNewChallenge();
  positionControls();

  describe('An interactive comparison operator explorer where students predict whether a comparison expression evaluates to True or False, then reveal the answer to check their prediction.');
}

// ────────────────────────────────────────────────────────────────────
//  Position all DOM controls relative to the canvas
// ────────────────────────────────────────────────────────────────────
function positionControls() {
  let mainEl = document.querySelector('main');
  if (!mainEl) return;
  let canvasEl = mainEl.querySelector('canvas');
  if (!canvasEl) return;

  let canvasRect = canvasEl.getBoundingClientRect();
  let mainRect  = mainEl.getBoundingClientRect();
  let offsetX = canvasRect.left - mainRect.left;
  let offsetY = canvasRect.top  - mainRect.top;

  // Row 1 (control area): left input, operator, right input
  let row1Y = offsetY + drawHeight + 10;
  let centerX = offsetX + canvasWidth / 2;

  leftInput.position(centerX - 100, row1Y);
  operatorSelect.position(centerX - 30, row1Y);
  rightInput.position(centerX + 40, row1Y);

  // Row 2: True / False / Reveal / New Challenge
  let row2Y = row1Y + 40;
  let btnGroupWidth = 420;
  let startX = centerX - btnGroupWidth / 2;

  trueBtn.position(startX, row2Y);
  falseBtn.position(startX + 80, row2Y);
  revealBtn.position(startX + 170, row2Y);
  newChallengeBtn.position(startX + 310, row2Y);
}

// ────────────────────────────────────────────────────────────────────
//  Draw loop
// ────────────────────────────────────────────────────────────────────
function draw() {
  // --- Draw area (aliceblue) ---
  noStroke();
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);

  // --- Control area (white) ---
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Subtle separator line
  stroke(200);
  strokeWeight(1);
  line(0, drawHeight, canvasWidth, drawHeight);

  // ── Title ──
  noStroke();
  fill(40);
  textAlign(CENTER, TOP);
  textSize(24);
  text('Comparison Operator Explorer', canvasWidth / 2, 14);

  // ── Score display ──
  textSize(defaultTextSize);
  fill(80);
  textAlign(RIGHT, TOP);
  text('Score: ' + score + ' / ' + totalAttempts, canvasWidth - margin, 18);

  // ── Build expression string ──
  let lVal = leftInput.value();
  let op   = operatorSelect.value();
  let rVal = rightInput.value();
  let expressionStr = lVal + '  ' + op + '  ' + rVal;

  // ── Expression display ──
  let exprY = 70;
  drawExpressionBox(expressionStr, exprY);

  // ── Prediction prompt ──
  let promptY = 150;
  noStroke();
  fill(60);
  textAlign(CENTER, TOP);
  textSize(18);
  text('What do you predict?', canvasWidth / 2, promptY);

  // Show current prediction
  let predY = promptY + 28;
  textSize(defaultTextSize);
  if (prediction === true) {
    fill(30, 100, 200);
    text('Your prediction: True', canvasWidth / 2, predY);
  } else if (prediction === false) {
    fill(30, 100, 200);
    text('Your prediction: False', canvasWidth / 2, predY);
  } else {
    fill(160);
    text('Click True or False to make your prediction', canvasWidth / 2, predY);
  }

  // ── Highlight selected prediction button ──
  updatePredictionButtonStyles();

  // ── Result area ──
  let resultY = 220;
  if (gameState === REVEALED) {
    drawResultFeedback(resultY, expressionStr);
  } else {
    // Placeholder area
    noStroke();
    fill(180);
    textAlign(CENTER, TOP);
    textSize(defaultTextSize);
    text('Make a prediction, then click Reveal Answer', canvasWidth / 2, resultY + 20);
  }

  // ── Update button enabled/disabled appearance ──
  updateButtonStates();
}

// ────────────────────────────────────────────────────────────────────
//  Draw the expression in a styled box
// ────────────────────────────────────────────────────────────────────
function drawExpressionBox(expressionStr, y) {
  let boxW = canvasWidth - margin * 4;
  let boxH = 56;
  let boxX = margin * 2;

  // Background box
  noStroke();
  fill(255);
  rect(boxX, y, boxW, boxH, 10);

  // Border
  stroke(100, 140, 200);
  strokeWeight(2);
  noFill();
  rect(boxX, y, boxW, boxH, 10);

  // Expression text in monospace style
  noStroke();
  fill(30);
  textAlign(CENTER, CENTER);
  textSize(28);
  text(expressionStr, boxX + boxW / 2, y + boxH / 2);
}

// ────────────────────────────────────────────────────────────────────
//  Draw feedback after reveal
// ────────────────────────────────────────────────────────────────────
function drawResultFeedback(y, expressionStr) {
  // Pulsing glow animation
  revealFrame++;
  glowAlpha = 60 + 40 * sin(revealFrame * 0.08);

  let feedbackBoxW = canvasWidth - margin * 4;
  let feedbackBoxH = 130;
  let feedbackBoxX = margin * 2;

  // Glow background
  noStroke();
  if (isCorrect) {
    fill(0, 200, 80, glowAlpha);
  } else {
    fill(220, 50, 50, glowAlpha);
  }
  rect(feedbackBoxX - 6, y - 6, feedbackBoxW + 12, feedbackBoxH + 12, 14);

  // Solid background
  if (isCorrect) {
    fill(230, 255, 230);
    stroke(0, 180, 60);
  } else {
    fill(255, 230, 230);
    stroke(200, 50, 50);
  }
  strokeWeight(2);
  rect(feedbackBoxX, y, feedbackBoxW, feedbackBoxH, 10);

  noStroke();
  textAlign(CENTER, TOP);

  if (isCorrect) {
    // Correct feedback
    fill(0, 140, 40);
    textSize(24);
    text('Correct!', feedbackBoxX + feedbackBoxW / 2, y + 12);

    fill(40);
    textSize(defaultTextSize);
    text(expressionStr + '  is  ' + formatBool(actualResult),
         feedbackBoxX + feedbackBoxW / 2, y + 46);

    fill(80);
    textSize(14);
    text('Great job! Click New Challenge to try another.',
         feedbackBoxX + feedbackBoxW / 2, y + 74);

    // Celebration stars
    drawCelebrationStars(feedbackBoxX + feedbackBoxW / 2, y + 105);
  } else {
    // Incorrect feedback
    fill(180, 30, 30);
    textSize(24);
    text('Not quite!', feedbackBoxX + feedbackBoxW / 2, y + 12);

    fill(40);
    textSize(defaultTextSize);
    text(expressionStr + '  is  ' + formatBool(actualResult),
         feedbackBoxX + feedbackBoxW / 2, y + 46);

    fill(80);
    textSize(14);
    let explanation = buildExplanation();
    text(explanation, feedbackBoxX + feedbackBoxW / 2, y + 74);

    fill(100);
    textSize(13);
    text('Click New Challenge to try again!',
         feedbackBoxX + feedbackBoxW / 2, y + 104);
  }
}

// ────────────────────────────────────────────────────────────────────
//  Simple celebration stars drawn with shapes
// ────────────────────────────────────────────────────────────────────
function drawCelebrationStars(cx, cy) {
  let t = revealFrame * 0.05;
  noStroke();
  for (let i = 0; i < 5; i++) {
    let angle = t + i * TWO_PI / 5;
    let radius = 12 + 4 * sin(t * 2 + i);
    let sx = cx + cos(angle) * (40 + i * 10);
    let sy = cy + sin(angle) * 4;
    fill(255, 200, 0, 160 + 60 * sin(t * 3 + i));
    drawStar(sx, sy, radius * 0.4, radius, 5);
  }
}

// ────────────────────────────────────────────────────────────────────
//  Draw a star shape at (x, y)
// ────────────────────────────────────────────────────────────────────
function drawStar(x, y, innerR, outerR, npoints) {
  let angleStep = TWO_PI / npoints;
  let halfStep  = angleStep / 2;
  beginShape();
  for (let a = -HALF_PI; a < TWO_PI - HALF_PI; a += angleStep) {
    let sx = x + cos(a) * outerR;
    let sy = y + sin(a) * outerR;
    vertex(sx, sy);
    let ix = x + cos(a + halfStep) * innerR;
    let iy = y + sin(a + halfStep) * innerR;
    vertex(ix, iy);
  }
  endShape(CLOSE);
}

// ────────────────────────────────────────────────────────────────────
//  Build an explanation string for incorrect answers
// ────────────────────────────────────────────────────────────────────
function buildExplanation() {
  let lNum = parseNumericValue(leftInput.value());
  let rNum = parseNumericValue(rightInput.value());
  let op   = operatorSelect.value();

  if (lNum === null || rNum === null) {
    return 'Check that both values are valid numbers.';
  }

  let opWord = '';
  switch (op) {
    case '==': opWord = 'is equal to'; break;
    case '!=': opWord = 'is not equal to'; break;
    case '>':  opWord = 'is greater than'; break;
    case '<':  opWord = 'is less than'; break;
    case '>=': opWord = 'is greater than or equal to'; break;
    case '<=': opWord = 'is less than or equal to'; break;
  }

  return lNum + ' ' + opWord + ' ' + rNum + '?  ' + formatBool(actualResult) + '!';
}

// ────────────────────────────────────────────────────────────────────
//  Format boolean as "True" / "False"
// ────────────────────────────────────────────────────────────────────
function formatBool(val) {
  return val ? 'True' : 'False';
}

// ────────────────────────────────────────────────────────────────────
//  Evaluate the comparison expression safely (no eval)
// ────────────────────────────────────────────────────────────────────
function evaluateComparison(leftStr, op, rightStr) {
  let a = parseNumericValue(leftStr);
  let b = parseNumericValue(rightStr);

  // If either value isn't numeric, compare as strings
  if (a === null || b === null) {
    a = leftStr.trim();
    b = rightStr.trim();
  }

  switch (op) {
    case '==': return a == b;
    case '!=': return a != b;
    case '>':  return a > b;
    case '<':  return a < b;
    case '>=': return a >= b;
    case '<=': return a <= b;
    default:   return false;
  }
}

// ────────────────────────────────────────────────────────────────────
//  Parse a string as a number; return null if not numeric
// ────────────────────────────────────────────────────────────────────
function parseNumericValue(str) {
  let trimmed = str.trim();
  if (trimmed === '') return null;
  let num = Number(trimmed);
  if (isNaN(num)) return null;
  return num;
}

// ────────────────────────────────────────────────────────────────────
//  Prediction callbacks
// ────────────────────────────────────────────────────────────────────
function predictTrue() {
  if (gameState === PREDICTING) {
    prediction = true;
  }
}

function predictFalse() {
  if (gameState === PREDICTING) {
    prediction = false;
  }
}

// ────────────────────────────────────────────────────────────────────
//  Update prediction button highlight styles
// ────────────────────────────────────────────────────────────────────
function updatePredictionButtonStyles() {
  if (prediction === true) {
    trueBtn.style('background', '#4488cc');
    trueBtn.style('color', 'white');
    falseBtn.style('background', '#e8f0fe');
    falseBtn.style('color', 'black');
  } else if (prediction === false) {
    falseBtn.style('background', '#4488cc');
    falseBtn.style('color', 'white');
    trueBtn.style('background', '#e8f0fe');
    trueBtn.style('color', 'black');
  } else {
    trueBtn.style('background', '#e8f0fe');
    trueBtn.style('color', 'black');
    falseBtn.style('background', '#e8f0fe');
    falseBtn.style('color', 'black');
  }
}

// ────────────────────────────────────────────────────────────────────
//  Reveal the answer
// ────────────────────────────────────────────────────────────────────
function revealAnswer() {
  if (gameState !== PREDICTING) return;
  if (prediction === null) return; // must pick True or False first

  let lVal = leftInput.value();
  let op   = operatorSelect.value();
  let rVal = rightInput.value();

  actualResult = evaluateComparison(lVal, op, rVal);
  isCorrect = (prediction === actualResult);

  totalAttempts++;
  if (isCorrect) {
    score++;
  }

  revealFrame = 0;
  gameState = REVEALED;
}

// ────────────────────────────────────────────────────────────────────
//  Generate a new random challenge
// ────────────────────────────────────────────────────────────────────
function generateNewChallenge() {
  // Random integers from 1 to 100
  leftValue  = floor(random(1, 101));
  rightValue = floor(random(1, 101));

  // Occasionally make them equal for == and != practice
  if (random() < 0.25) {
    rightValue = leftValue;
  }

  // Random operator
  currentOperator = random(operators);

  // Update the DOM inputs
  leftInput.value(String(leftValue));
  rightInput.value(String(rightValue));
  operatorSelect.selected(currentOperator);

  // Reset state
  prediction = null;
  actualResult = null;
  isCorrect = false;
  revealFrame = 0;
  gameState = PREDICTING;
}

// ────────────────────────────────────────────────────────────────────
//  Update button enabled/disabled visual states
// ────────────────────────────────────────────────────────────────────
function updateButtonStates() {
  if (gameState === REVEALED) {
    // Disable prediction and reveal; enable new challenge
    trueBtn.attribute('disabled', '');
    falseBtn.attribute('disabled', '');
    revealBtn.attribute('disabled', '');
    revealBtn.style('opacity', '0.4');
    trueBtn.style('opacity', '0.5');
    falseBtn.style('opacity', '0.5');
    newChallengeBtn.style('background', '#4488cc');
    newChallengeBtn.style('color', 'white');
    newChallengeBtn.style('border-color', '#336699');
  } else {
    // Enable prediction and reveal; dim new challenge
    trueBtn.removeAttribute('disabled');
    falseBtn.removeAttribute('disabled');
    revealBtn.removeAttribute('disabled');
    revealBtn.style('opacity', '1');
    trueBtn.style('opacity', '1');
    falseBtn.style('opacity', '1');
    newChallengeBtn.style('background', '#f5f5f5');
    newChallengeBtn.style('color', 'black');
    newChallengeBtn.style('border-color', '#666');

    // Highlight Reveal button when a prediction is selected
    if (prediction !== null) {
      revealBtn.style('background', '#5a5');
      revealBtn.style('color', 'white');
      revealBtn.style('border-color', '#484');
    } else {
      revealBtn.style('background', '#f5f5f5');
      revealBtn.style('color', 'black');
      revealBtn.style('border-color', '#666');
    }
  }
}

// ────────────────────────────────────────────────────────────────────
//  Window resize handler
// ────────────────────────────────────────────────────────────────────
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}
