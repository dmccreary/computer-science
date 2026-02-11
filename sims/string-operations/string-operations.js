// String Operations Playground MicroSim
// Bloom Level: Apply (L3) — construct, demonstrate
// Students construct string expressions using concatenation, repetition, and f-string formatting.

let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// Input controls
let inputA, inputB;
let repeatSlider;
let labelA, labelB, labelN;

// Example gallery
let examples = [
  { label: 'Greeting',   expr: 'A + ", " + B + "!"' },
  { label: 'Cheer',      expr: 'A * 3' },
  { label: 'Path',       expr: 'A + "/" + B' },
  { label: 'Polite',     expr: '"Dear " + A + ", welcome to " + B + "."' },
  { label: 'Shout',      expr: '(A + " " + B + "! ") * 2' }
];

// Currently selected example index (-1 means none)
let selectedExample = -1;

// Panel colors
let concatColor, repeatColor, fstringColor;

function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    canvasWidth = Math.min(mainEl.clientWidth, 780);
    canvasWidth = Math.max(canvasWidth, 380);
  }
  canvasHeight = drawHeight + controlHeight;
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  // Define panel colors
  concatColor = { border: [34, 139, 34], bg: [240, 255, 240], title: [20, 100, 20] };
  repeatColor = { border: [30, 100, 200], bg: [235, 245, 255], title: [20, 60, 160] };
  fstringColor = { border: [128, 0, 200], bg: [248, 240, 255], title: [90, 0, 150] };

  // Create String A input
  labelA = createSpan('String A:');
  labelA.parent(document.querySelector('main'));
  labelA.style('font-size', '14px');
  labelA.style('font-family', 'Arial, sans-serif');
  labelA.style('margin-right', '4px');

  inputA = createInput('Hello');
  inputA.parent(document.querySelector('main'));
  inputA.style('font-size', '14px');
  inputA.style('padding', '3px 6px');
  inputA.style('width', '90px');
  inputA.style('font-family', 'monospace');

  // Small spacer
  let spacer1 = createSpan('  ');
  spacer1.parent(document.querySelector('main'));

  // Create String B input
  labelB = createSpan('String B:');
  labelB.parent(document.querySelector('main'));
  labelB.style('font-size', '14px');
  labelB.style('font-family', 'Arial, sans-serif');
  labelB.style('margin-right', '4px');

  inputB = createInput('World');
  inputB.parent(document.querySelector('main'));
  inputB.style('font-size', '14px');
  inputB.style('padding', '3px 6px');
  inputB.style('width', '90px');
  inputB.style('font-family', 'monospace');

  // Second row: repetition slider
  let lineBreak = createElement('br');
  lineBreak.parent(document.querySelector('main'));

  labelN = createSpan('Repeat N:');
  labelN.parent(document.querySelector('main'));
  labelN.style('font-size', '14px');
  labelN.style('font-family', 'Arial, sans-serif');
  labelN.style('margin-right', '4px');
  labelN.style('margin-top', '6px');

  repeatSlider = createSlider(1, 10, 3, 1);
  repeatSlider.parent(document.querySelector('main'));
  repeatSlider.style('width', '180px');
  repeatSlider.style('vertical-align', 'middle');

  describe('Interactive string operations playground where students type two strings and see concatenation, repetition, and f-string formatting results update in real time.');
}

function draw() {
  // Get current input values
  let strA = inputA.value();
  let strB = inputB.value();
  let repeatN = repeatSlider.value();

  // --- Draw area background ---
  noStroke();
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);

  // --- Control area background ---
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // --- Title ---
  noStroke();
  fill(40);
  textAlign(CENTER, TOP);
  textSize(24);
  text('String Operations Playground', canvasWidth / 2, 10);

  // --- Draw the three operation panels ---
  let panelTop = 44;
  let panelHeight = 105;
  let panelGap = 10;
  let panelWidth = (canvasWidth - margin * 2 - panelGap * 2) / 3;

  // Panel 1: Concatenation
  let p1x = margin;
  drawPanel(p1x, panelTop, panelWidth, panelHeight, concatColor, 'Concatenation');
  drawPanelExpression(p1x, panelTop, panelWidth, panelHeight, concatColor,
    'A + " " + B',
    strA + ' ' + strB
  );

  // Panel 2: Repetition
  let p2x = margin + panelWidth + panelGap;
  drawPanel(p2x, panelTop, panelWidth, panelHeight, repeatColor, 'Repetition');
  drawPanelExpression(p2x, panelTop, panelWidth, panelHeight, repeatColor,
    'A * ' + repeatN,
    repeatString(strA, repeatN)
  );

  // Panel 3: F-String
  let p3x = margin + (panelWidth + panelGap) * 2;
  drawPanel(p3x, panelTop, panelWidth, panelHeight, fstringColor, 'F-String');
  drawPanelExpression(p3x, panelTop, panelWidth, panelHeight, fstringColor,
    'f"Dear {A}, welcome to {B}!"',
    'Dear ' + strA + ', welcome to ' + strB + '!'
  );

  // --- Variable display ---
  let varY = panelTop + panelHeight + 14;
  noStroke();
  fill(80);
  textAlign(LEFT, TOP);
  textSize(14);
  text('Current values:', margin, varY);

  // Show A = "..." and B = "..."
  textSize(14);
  fill(40);
  let varLineY = varY + 20;
  text('A = "' + strA + '"', margin, varLineY);
  text('B = "' + strB + '"', margin + canvasWidth * 0.35, varLineY);
  text('N = ' + repeatN, margin + canvasWidth * 0.7, varLineY);

  // --- Example Gallery ---
  let galleryTop = varLineY + 30;
  noStroke();
  fill(60);
  textSize(16);
  textAlign(LEFT, TOP);
  text('Try an Example:', margin, galleryTop);

  let btnY = galleryTop + 24;
  let btnX = margin;
  let btnPadding = 10;
  let btnHeight = 28;

  for (let i = 0; i < examples.length; i++) {
    let btnLabel = examples[i].label;
    textSize(13);
    let btnW = textWidth(btnLabel) + btnPadding * 2;

    // Check if button would go off canvas, wrap to next line
    if (btnX + btnW > canvasWidth - margin) {
      btnX = margin;
      btnY += btnHeight + 6;
    }

    // Hover detection
    let isHover = mouseX >= btnX && mouseX <= btnX + btnW &&
                  mouseY >= btnY && mouseY <= btnY + btnHeight;
    let isSelected = (selectedExample === i);

    // Draw button background
    if (isSelected) {
      fill(100, 60, 180);
      stroke(80, 40, 160);
    } else if (isHover) {
      fill(180, 200, 255);
      stroke(100, 140, 220);
    } else {
      fill(235, 240, 250);
      stroke(180, 190, 210);
    }
    strokeWeight(1.5);
    rect(btnX, btnY, btnW, btnHeight, 6);

    // Button label
    noStroke();
    fill(isSelected ? 255 : 40);
    textSize(13);
    textAlign(CENTER, CENTER);
    text(btnLabel, btnX + btnW / 2, btnY + btnHeight / 2);

    btnX += btnW + 8;
  }

  // --- Selected Example Result ---
  let resultY = btnY + btnHeight + 16;
  if (selectedExample >= 0 && selectedExample < examples.length) {
    let ex = examples[selectedExample];
    let exprStr = ex.expr;
    let resultStr = evaluateExample(exprStr, strA, strB, repeatN);

    // Expression box
    noStroke();
    fill(60);
    textAlign(LEFT, TOP);
    textSize(14);
    text('Expression:', margin, resultY);

    // Expression in monospace style
    fill(100, 60, 180);
    textSize(15);
    text(exprStr, margin + 85, resultY);

    // Result
    let resLineY = resultY + 22;
    fill(60);
    textSize(14);
    text('Result:', margin, resLineY);

    fill(0, 120, 60);
    textSize(15);
    let resultDisplay = '"' + resultStr + '"';
    // Truncate if very long
    if (resultDisplay.length > 60) {
      resultDisplay = resultDisplay.substring(0, 57) + '..."';
    }
    text(resultDisplay, margin + 85, resLineY);
  } else {
    noStroke();
    fill(150);
    textSize(14);
    textAlign(LEFT, TOP);
    text('Click an example above to see it in action!', margin, resultY);
  }

  // --- Slider value label ---
  noStroke();
  fill(80);
  textSize(13);
  textAlign(LEFT, TOP);
}

// Draw a panel with colored border and title
function drawPanel(x, y, w, h, colors, titleText) {
  // Panel background
  stroke(colors.border[0], colors.border[1], colors.border[2]);
  strokeWeight(2.5);
  fill(colors.bg[0], colors.bg[1], colors.bg[2]);
  rect(x, y, w, h, 8);

  // Title bar
  noStroke();
  fill(colors.border[0], colors.border[1], colors.border[2], 30);
  rect(x + 1, y + 1, w - 2, 24, 7, 7, 0, 0);

  // Title text
  fill(colors.title[0], colors.title[1], colors.title[2]);
  textAlign(CENTER, TOP);
  textSize(Math.max(13, Math.min(15, canvasWidth * 0.022)));
  text(titleText, x + w / 2, y + 5);
}

// Draw expression and result inside a panel
function drawPanelExpression(x, y, w, h, colors, exprText, resultText) {
  let innerPad = 8;
  let exprY = y + 30;
  let resultY = y + h - 30;

  // Expression label
  noStroke();
  fill(100);
  textAlign(LEFT, TOP);
  textSize(Math.max(11, Math.min(12, canvasWidth * 0.018)));
  text('Expression:', x + innerPad, exprY);

  // Expression value (monospace-style, smaller to fit)
  fill(colors.title[0], colors.title[1], colors.title[2]);
  textSize(Math.max(11, Math.min(13, canvasWidth * 0.02)));
  textAlign(LEFT, TOP);
  let displayExpr = exprText;
  // Truncate expression if too wide for panel
  while (textWidth(displayExpr) > w - innerPad * 2 - 4 && displayExpr.length > 4) {
    displayExpr = displayExpr.substring(0, displayExpr.length - 2) + '..';
  }
  text(displayExpr, x + innerPad, exprY + 14);

  // Result label
  fill(100);
  textSize(Math.max(11, Math.min(12, canvasWidth * 0.018)));
  text('Result:', x + innerPad, resultY);

  // Result value
  fill(40);
  textSize(Math.max(12, Math.min(14, canvasWidth * 0.022)));
  let displayResult = '"' + resultText + '"';
  // Truncate result if too wide for panel
  let maxResultW = w - innerPad * 2 - 4;
  while (textWidth(displayResult) > maxResultW && displayResult.length > 6) {
    displayResult = displayResult.substring(0, displayResult.length - 2) + '..."';
  }
  text(displayResult, x + innerPad, resultY + 14);
}

// Repeat a string n times (Python-style string * N)
function repeatString(s, n) {
  let result = '';
  for (let i = 0; i < n; i++) {
    result += s;
  }
  return result;
}

// Evaluate an example expression given A, B, and N
function evaluateExample(expr, strA, strB, repeatN) {
  // Simple expression evaluator that handles our known example patterns
  // Replace A and B with actual values in a safe way
  try {
    // Build result by parsing the expression manually
    // This handles: A, B, string literals, +, *, and parentheses
    let result = parseExpression(expr, strA, strB, repeatN);
    return result;
  } catch (e) {
    return '(error)';
  }
}

// Simple recursive-descent parser for our mini expression language
// Supports: string literals "...", A, B, +, * (repetition with number), parentheses
function parseExpression(expr, strA, strB, repeatN) {
  let tokens = tokenize(expr);
  let pos = { i: 0 };
  let result = parseAddition(tokens, pos, strA, strB, repeatN);
  return result;
}

// Tokenizer: breaks expression into tokens
function tokenize(expr) {
  let tokens = [];
  let i = 0;
  while (i < expr.length) {
    let ch = expr[i];
    // Skip whitespace
    if (ch === ' ') { i++; continue; }
    // String literal
    if (ch === '"') {
      let j = i + 1;
      while (j < expr.length && expr[j] !== '"') j++;
      tokens.push({ type: 'string', value: expr.substring(i + 1, j) });
      i = j + 1;
      continue;
    }
    // Variable A
    if (ch === 'A' && (i + 1 >= expr.length || !isAlpha(expr[i + 1]))) {
      tokens.push({ type: 'var', value: 'A' });
      i++;
      continue;
    }
    // Variable B
    if (ch === 'B' && (i + 1 >= expr.length || !isAlpha(expr[i + 1]))) {
      tokens.push({ type: 'var', value: 'B' });
      i++;
      continue;
    }
    // Number
    if (isDigit(ch)) {
      let j = i;
      while (j < expr.length && isDigit(expr[j])) j++;
      tokens.push({ type: 'number', value: parseInt(expr.substring(i, j)) });
      i = j;
      continue;
    }
    // Operators
    if (ch === '+') { tokens.push({ type: 'op', value: '+' }); i++; continue; }
    if (ch === '*') { tokens.push({ type: 'op', value: '*' }); i++; continue; }
    if (ch === '(') { tokens.push({ type: 'paren', value: '(' }); i++; continue; }
    if (ch === ')') { tokens.push({ type: 'paren', value: ')' }); i++; continue; }
    // Skip unknown characters
    i++;
  }
  return tokens;
}

function isAlpha(ch) {
  return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
}

function isDigit(ch) {
  return ch >= '0' && ch <= '9';
}

// Parse addition: handles + operator (string concatenation)
function parseAddition(tokens, pos, strA, strB, repeatN) {
  let left = parseMultiplication(tokens, pos, strA, strB, repeatN);
  while (pos.i < tokens.length && tokens[pos.i].type === 'op' && tokens[pos.i].value === '+') {
    pos.i++; // consume +
    let right = parseMultiplication(tokens, pos, strA, strB, repeatN);
    left = left + right; // string concatenation
  }
  return left;
}

// Parse multiplication: handles * operator (string repetition)
function parseMultiplication(tokens, pos, strA, strB, repeatN) {
  let left = parsePrimary(tokens, pos, strA, strB, repeatN);
  while (pos.i < tokens.length && tokens[pos.i].type === 'op' && tokens[pos.i].value === '*') {
    pos.i++; // consume *
    let right = parsePrimary(tokens, pos, strA, strB, repeatN);
    // String * number = repetition
    if (typeof left === 'string' && typeof right === 'number') {
      left = repeatString(left, right);
    } else if (typeof left === 'number' && typeof right === 'string') {
      left = repeatString(right, left);
    } else {
      left = String(left) + String(right);
    }
  }
  return left;
}

// Parse primary: variables, literals, numbers, parenthesized expressions
function parsePrimary(tokens, pos, strA, strB, repeatN) {
  if (pos.i >= tokens.length) return '';

  let token = tokens[pos.i];

  // Parenthesized expression
  if (token.type === 'paren' && token.value === '(') {
    pos.i++; // consume (
    let result = parseAddition(tokens, pos, strA, strB, repeatN);
    if (pos.i < tokens.length && tokens[pos.i].type === 'paren' && tokens[pos.i].value === ')') {
      pos.i++; // consume )
    }
    return result;
  }

  // String literal
  if (token.type === 'string') {
    pos.i++;
    return token.value;
  }

  // Variable
  if (token.type === 'var') {
    pos.i++;
    if (token.value === 'A') return strA;
    if (token.value === 'B') return strB;
    return '';
  }

  // Number
  if (token.type === 'number') {
    pos.i++;
    return token.value;
  }

  // Unknown token, skip
  pos.i++;
  return '';
}

// Handle mouse clicks on example gallery buttons
function mousePressed() {
  let strA = inputA.value();
  let strB = inputB.value();
  let repeatN = repeatSlider.value();

  // Calculate gallery button positions (must match draw() layout)
  let varY = 44 + 105 + 14;
  let varLineY = varY + 20;
  let galleryTop = varLineY + 30;
  let btnY = galleryTop + 24;
  let btnX = margin;
  let btnPadding = 10;
  let btnHeight = 28;

  for (let i = 0; i < examples.length; i++) {
    let btnLabel = examples[i].label;
    textSize(13);
    let btnW = textWidth(btnLabel) + btnPadding * 2;

    // Check wrap
    if (btnX + btnW > canvasWidth - margin) {
      btnX = margin;
      btnY += btnHeight + 6;
    }

    // Hit test
    if (mouseX >= btnX && mouseX <= btnX + btnW &&
        mouseY >= btnY && mouseY <= btnY + btnHeight) {
      selectedExample = (selectedExample === i) ? -1 : i;
      return;
    }

    btnX += btnW + 8;
  }
}

// Update cursor to pointer when hovering over example buttons
function mouseMoved() {
  let varY = 44 + 105 + 14;
  let varLineY = varY + 20;
  let galleryTop = varLineY + 30;
  let btnY = galleryTop + 24;
  let btnX = margin;
  let btnPadding = 10;
  let btnHeight = 28;
  let overButton = false;

  for (let i = 0; i < examples.length; i++) {
    let btnLabel = examples[i].label;
    textSize(13);
    let btnW = textWidth(btnLabel) + btnPadding * 2;

    if (btnX + btnW > canvasWidth - margin) {
      btnX = margin;
      btnY += btnHeight + 6;
    }

    if (mouseX >= btnX && mouseX <= btnX + btnW &&
        mouseY >= btnY && mouseY <= btnY + btnHeight) {
      overButton = true;
      break;
    }

    btnX += btnW + 8;
  }

  cursor(overButton ? HAND : ARROW);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  if (repeatSlider) {
    repeatSlider.style('width', Math.min(180, canvasWidth * 0.35) + 'px');
  }
}
