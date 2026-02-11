// Truth Table Builder MicroSim
// Bloom Level: Analyze (L4) - construct, evaluate
// Students construct truth tables for compound Boolean expressions
// and evaluate logical equivalence between two expressions.

let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// ── UI Controls ──────────────────────────────────────────────────
let expressionInput;
let generateBtn, practiceBtn, checkBtn, compareBtn;
let varCountSelect;
let compareInput; // second expression for compare mode

// ── State ────────────────────────────────────────────────────────
let varCount = 2;             // 2 = A,B  |  3 = A,B,C
let currentExpr = 'A and B';  // the active expression string
let truthRows = [];           // array of { inputs: [bool,...], result: bool }
let parseError = '';          // non-empty when the expression is invalid

// Practice mode
let practiceMode = false;
let studentAnswers = [];      // one bool per row (toggled by clicking)
let answersChecked = false;

// Compare mode
let compareMode = false;
let compareExpr = '';
let compareTruthRows = [];
let compareParseError = '';
let tablesMatch = null;       // null = not yet checked, true/false after compare

// Scroll offset for tall tables (3 variables = 8 rows)
let scrollY = 0;

function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    let containerW = mainEl.getBoundingClientRect().width;
    if (containerW > 0) {
      canvasWidth = containerW;
    }
  }
  canvasHeight = drawHeight + controlHeight;
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  // ── Controls ─────────────────────────────────────────────────
  let mainEl = document.querySelector('main');

  // Variable count selector
  varCountSelect = createSelect();
  varCountSelect.option('2 variables (A, B)', '2');
  varCountSelect.option('3 variables (A, B, C)', '3');
  varCountSelect.selected('2');
  varCountSelect.changed(onVarCountChanged);
  varCountSelect.parent(mainEl);

  // Expression input
  expressionInput = createInput('A and B');
  expressionInput.attribute('placeholder', 'e.g. A and B, not A or B');
  expressionInput.parent(mainEl);

  // Buttons
  generateBtn = createButton('Generate Table');
  generateBtn.mousePressed(onGenerate);
  generateBtn.parent(mainEl);

  practiceBtn = createButton('Practice Mode');
  practiceBtn.mousePressed(onTogglePractice);
  practiceBtn.parent(mainEl);

  checkBtn = createButton('Check Answers');
  checkBtn.mousePressed(onCheckAnswers);
  checkBtn.parent(mainEl);

  compareBtn = createButton('Compare');
  compareBtn.mousePressed(onToggleCompare);
  compareBtn.parent(mainEl);

  // Compare expression input (hidden initially)
  compareInput = createInput('');
  compareInput.attribute('placeholder', '2nd expression');
  compareInput.parent(mainEl);
  compareInput.hide();

  positionControls();

  // Build the initial table for "A and B"
  buildTruthTable();

  describe(
    'Interactive truth table builder where students enter Boolean expressions ' +
    'using A, B, C with and, or, not operators and see the resulting truth table. ' +
    'Includes practice mode and expression comparison.'
  );
}

// ── Layout helpers ───────────────────────────────────────────────

function positionControls() {
  // Row 1: var selector + expression input + generate button
  let row1Y = drawHeight + 8;
  let x = 8;

  varCountSelect.position(x, row1Y);
  varCountSelect.style('font-size', '13px');
  varCountSelect.style('height', '28px');
  x += 170;

  expressionInput.position(x, row1Y);
  expressionInput.style('font-size', '13px');
  expressionInput.style('width', '180px');
  expressionInput.style('height', '22px');
  x += 190;

  generateBtn.position(x, row1Y);
  generateBtn.style('font-size', '13px');

  // Row 2: practice, check, compare buttons + compare input
  let row2Y = drawHeight + 42;
  x = 8;

  practiceBtn.position(x, row2Y);
  practiceBtn.style('font-size', '13px');
  x += 110;

  checkBtn.position(x, row2Y);
  checkBtn.style('font-size', '13px');
  x += 115;

  compareBtn.position(x, row2Y);
  compareBtn.style('font-size', '13px');
  x += 80;

  compareInput.position(x, row2Y);
  compareInput.style('font-size', '13px');
  compareInput.style('width', '150px');
  compareInput.style('height', '22px');
}

// ── Draw ─────────────────────────────────────────────────────────

function draw() {
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
  noStroke();
  fill(30);
  textAlign(CENTER, TOP);
  textSize(24);
  text('Truth Table Builder', canvasWidth / 2, 10);

  // Show error message if parsing failed
  if (parseError !== '') {
    noStroke();
    fill(200, 40, 40);
    textSize(14);
    textAlign(CENTER, TOP);
    text(parseError, canvasWidth / 2, 42);
    return; // nothing else to draw
  }

  // Decide layout: single table or side-by-side comparison
  if (compareMode && compareTruthRows.length > 0) {
    drawCompareLayout();
  } else {
    drawSingleTable(truthRows, currentExpr, margin, 50, canvasWidth - margin * 2);
  }
}

// ── Single truth table rendering ─────────────────────────────────

function drawSingleTable(rows, expr, tx, ty, availW) {
  if (rows.length === 0) return;

  let varNames = varCount === 2 ? ['A', 'B'] : ['A', 'B', 'C'];
  let numCols = varNames.length + 1; // +1 for result column
  let colW = min(availW / numCols, 100);
  let tableW = colW * numCols;
  let startX = tx + (availW - tableW) / 2;
  let rowH = 28;
  let headerH = 32;

  // Expression label above the table
  noStroke();
  fill(50);
  textSize(16);
  textAlign(CENTER, TOP);
  text('Expression: ' + expr, tx + availW / 2, ty);
  ty += 26;

  // ── Header row ─────────────────────────────────────────────
  fill(60, 100, 180);
  noStroke();
  rect(startX, ty, tableW, headerH, 4, 4, 0, 0);

  fill(255);
  textSize(15);
  textAlign(CENTER, CENTER);
  for (let c = 0; c < varNames.length; c++) {
    text(varNames[c], startX + c * colW + colW / 2, ty + headerH / 2);
  }
  text('Result', startX + varNames.length * colW + colW / 2, ty + headerH / 2);
  ty += headerH;

  // ── Data rows ──────────────────────────────────────────────
  for (let r = 0; r < rows.length; r++) {
    let rowY = ty + r * rowH;

    // Alternating row background
    noStroke();
    if (r % 2 === 0) {
      fill(235, 240, 250);
    } else {
      fill(248, 248, 255);
    }
    // Bottom row gets rounded corners
    if (r === rows.length - 1) {
      rect(startX, rowY, tableW, rowH, 0, 0, 4, 4);
    } else {
      rect(startX, rowY, tableW, rowH);
    }

    // Grid lines
    stroke(200);
    strokeWeight(0.5);
    line(startX, rowY, startX + tableW, rowY);

    // Input columns
    noStroke();
    textSize(15);
    textAlign(CENTER, CENTER);
    for (let c = 0; c < varNames.length; c++) {
      let val = rows[r].inputs[c];
      fill(val ? color(30, 140, 60) : color(190, 40, 40));
      text(val ? 'True' : 'False', startX + c * colW + colW / 2, rowY + rowH / 2);
    }

    // Result column
    let resColX = startX + varNames.length * colW;

    if (practiceMode && !answersChecked && rows === truthRows) {
      // Practice mode: show clickable cells
      drawPracticeCell(r, resColX, rowY, colW, rowH);
    } else if (practiceMode && answersChecked && rows === truthRows) {
      // After checking: show student answer with feedback
      drawCheckedCell(r, rows[r].result, resColX, rowY, colW, rowH);
    } else {
      // Normal mode: show the result
      let val = rows[r].result;
      fill(val ? color(30, 140, 60) : color(190, 40, 40));
      text(val ? 'True' : 'False', resColX + colW / 2, rowY + rowH / 2);
    }
  }

  // Outer border
  noFill();
  stroke(150);
  strokeWeight(1);
  rect(startX, ty - headerH, tableW, headerH + rows.length * rowH, 4);
}

// ── Practice mode cells ──────────────────────────────────────────

function drawPracticeCell(rowIdx, cx, cy, cw, ch) {
  // Clickable toggle cell showing student's current guess
  let val = studentAnswers[rowIdx];
  noStroke();
  if (val === null) {
    // Not yet answered — show a question mark
    fill(180);
    textSize(15);
    textAlign(CENTER, CENTER);
    text('?', cx + cw / 2, cy + ch / 2);
  } else {
    fill(val ? color(80, 160, 100) : color(200, 100, 80));
    textSize(15);
    textAlign(CENTER, CENTER);
    text(val ? 'True' : 'False', cx + cw / 2, cy + ch / 2);
  }

  // Subtle border to indicate clickability
  stroke(120, 120, 200);
  strokeWeight(1);
  noFill();
  rect(cx + 2, cy + 2, cw - 4, ch - 4, 3);
}

function drawCheckedCell(rowIdx, correctVal, cx, cy, cw, ch) {
  let studentVal = studentAnswers[rowIdx];
  let isCorrect = studentVal === correctVal;

  // Background highlight
  noStroke();
  if (studentVal === null) {
    fill(255, 220, 220); // missed
  } else if (isCorrect) {
    fill(200, 245, 200); // correct
  } else {
    fill(255, 200, 200); // wrong
  }
  rect(cx, cy, cw, ch);

  // Text
  textSize(15);
  textAlign(CENTER, CENTER);
  if (studentVal === null) {
    fill(190, 40, 40);
    text('--', cx + cw / 2, cy + ch / 2);
  } else {
    fill(isCorrect ? color(30, 140, 60) : color(190, 40, 40));
    text(studentVal ? 'True' : 'False', cx + cw / 2, cy + ch / 2);
  }

  // Show the correct answer in small text below if wrong
  if (!isCorrect) {
    textSize(10);
    fill(100);
    text('(' + (correctVal ? 'True' : 'False') + ')', cx + cw / 2, cy + ch - 4);
  }
}

// ── Compare layout (two tables side by side) ─────────────────────

function drawCompareLayout() {
  let halfW = (canvasWidth - margin * 3) / 2;

  // Draw first table
  drawSingleTable(truthRows, currentExpr, margin, 50, halfW);

  // Draw second table
  drawSingleTable(compareTruthRows, compareExpr, margin * 2 + halfW, 50, halfW);

  // Equivalence result at the bottom of the draw area
  noStroke();
  textSize(18);
  textAlign(CENTER, TOP);
  let msgY = drawHeight - 36;

  if (tablesMatch === true) {
    fill(30, 160, 60);
    text('Equivalent! Both expressions produce the same outputs.', canvasWidth / 2, msgY);
  } else if (tablesMatch === false) {
    fill(200, 50, 50);
    text('Not equivalent. The outputs differ.', canvasWidth / 2, msgY);
  }
}

// ── Mouse interaction for practice mode ──────────────────────────

function mousePressed() {
  if (!practiceMode || answersChecked) return;
  if (compareMode) return;
  if (truthRows.length === 0) return;

  // Figure out where the result column cells are
  let varNames = varCount === 2 ? ['A', 'B'] : ['A', 'B', 'C'];
  let numCols = varNames.length + 1;
  let availW = canvasWidth - margin * 2;
  let colW = min(availW / numCols, 100);
  let tableW = colW * numCols;
  let startX = margin + (availW - tableW) / 2;
  let rowH = 28;
  let headerH = 32;
  let ty = 50 + 26 + headerH; // matches draw offset

  let resColX = startX + varNames.length * colW;

  for (let r = 0; r < truthRows.length; r++) {
    let rowY = ty + r * rowH;
    if (mouseX >= resColX && mouseX <= resColX + colW &&
        mouseY >= rowY && mouseY <= rowY + rowH) {
      // Toggle the student answer: null -> True -> False -> null
      if (studentAnswers[r] === null) {
        studentAnswers[r] = true;
      } else if (studentAnswers[r] === true) {
        studentAnswers[r] = false;
      } else {
        studentAnswers[r] = null;
      }
      break;
    }
  }
}

// ── Button handlers ──────────────────────────────────────────────

function onVarCountChanged() {
  varCount = int(varCountSelect.value());
  // Rebuild with current expression
  onGenerate();
}

function onGenerate() {
  practiceMode = false;
  answersChecked = false;
  compareMode = false;
  compareInput.hide();
  tablesMatch = null;
  compareTruthRows = [];
  currentExpr = expressionInput.value().trim();
  if (currentExpr === '') currentExpr = 'A and B';
  buildTruthTable();
}

function onTogglePractice() {
  if (parseError !== '') return;
  compareMode = false;
  compareInput.hide();
  tablesMatch = null;
  practiceMode = !practiceMode;
  answersChecked = false;
  studentAnswers = [];
  for (let i = 0; i < truthRows.length; i++) {
    studentAnswers.push(null);
  }
  practiceBtn.html(practiceMode ? 'Exit Practice' : 'Practice Mode');
}

function onCheckAnswers() {
  if (!practiceMode) return;
  answersChecked = true;
}

function onToggleCompare() {
  if (parseError !== '') return;
  practiceMode = false;
  answersChecked = false;
  compareMode = !compareMode;

  if (compareMode) {
    compareInput.show();
    compareBtn.html('Run Compare');
    // If the compare input already has text, run comparison
    let expr2 = compareInput.value().trim();
    if (expr2 !== '') {
      runComparison(expr2);
    }
  } else {
    // If we are in compare mode and hit the button, actually run the comparison
    // or toggle off
    let expr2 = compareInput.value().trim();
    if (expr2 !== '' && compareTruthRows.length === 0) {
      compareMode = true;
      runComparison(expr2);
    } else {
      compareInput.hide();
      compareBtn.html('Compare');
      compareTruthRows = [];
      tablesMatch = null;
    }
  }
}

function runComparison(expr2) {
  compareExpr = expr2;
  compareParseError = '';
  compareTruthRows = [];
  tablesMatch = null;

  let varNames = varCount === 2 ? ['A', 'B'] : ['A', 'B', 'C'];
  let numRows = Math.pow(2, varCount);

  for (let i = 0; i < numRows; i++) {
    let inputs = [];
    for (let v = 0; v < varCount; v++) {
      // MSB first: e.g. for 2 vars row 0 = [false,false], row 3 = [true,true]
      inputs.push(Boolean(i >> (varCount - 1 - v) & 1));
    }
    let env = {};
    for (let v = 0; v < varCount; v++) {
      env[varNames[v]] = inputs[v];
    }
    try {
      let result = evaluateExpression(compareExpr, env);
      compareTruthRows.push({ inputs: inputs, result: result });
    } catch (e) {
      compareParseError = 'Error in 2nd expression: ' + e.message;
      compareTruthRows = [];
      return;
    }
  }

  // Check equivalence
  if (compareTruthRows.length === truthRows.length) {
    tablesMatch = true;
    for (let r = 0; r < truthRows.length; r++) {
      if (truthRows[r].result !== compareTruthRows[r].result) {
        tablesMatch = false;
        break;
      }
    }
  }
}

// ── Build the primary truth table ────────────────────────────────

function buildTruthTable() {
  parseError = '';
  truthRows = [];
  studentAnswers = [];

  let varNames = varCount === 2 ? ['A', 'B'] : ['A', 'B', 'C'];
  let numRows = Math.pow(2, varCount);

  for (let i = 0; i < numRows; i++) {
    let inputs = [];
    for (let v = 0; v < varCount; v++) {
      inputs.push(Boolean(i >> (varCount - 1 - v) & 1));
    }
    let env = {};
    for (let v = 0; v < varCount; v++) {
      env[varNames[v]] = inputs[v];
    }
    try {
      let result = evaluateExpression(currentExpr, env);
      truthRows.push({ inputs: inputs, result: result });
      studentAnswers.push(null);
    } catch (e) {
      parseError = 'Parse error: ' + e.message;
      truthRows = [];
      return;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
// EXPRESSION PARSER
// Supports: A, B, C, true, false, and, or, not, parentheses
// Grammar (precedence low to high):
//   expr     -> orExpr
//   orExpr   -> andExpr ( 'or' andExpr )*
//   andExpr  -> notExpr ( 'and' notExpr )*
//   notExpr  -> 'not' notExpr | primary
//   primary  -> 'true' | 'false' | VARIABLE | '(' expr ')'
// ═══════════════════════════════════════════════════════════════════

function evaluateExpression(exprStr, env) {
  let tokens = tokenize(exprStr);
  let pos = { i: 0 }; // wrap in object so sub-functions can mutate
  let result = parseOr(tokens, pos, env);
  if (pos.i < tokens.length) {
    throw new Error('Unexpected token: "' + tokens[pos.i] + '"');
  }
  return result;
}

// ── Tokenizer ────────────────────────────────────────────────────
// Splits the expression into meaningful tokens.
// Recognizes: ( ) and or not A B C true false
// Also supports && || ! for convenience.

function tokenize(exprStr) {
  let tokens = [];
  let i = 0;
  let s = exprStr;

  while (i < s.length) {
    // Skip whitespace
    if (s[i] === ' ' || s[i] === '\t') {
      i++;
      continue;
    }

    // Parentheses
    if (s[i] === '(' || s[i] === ')') {
      tokens.push(s[i]);
      i++;
      continue;
    }

    // Two-character operators
    if (s[i] === '&' && i + 1 < s.length && s[i + 1] === '&') {
      tokens.push('and');
      i += 2;
      continue;
    }
    if (s[i] === '|' && i + 1 < s.length && s[i + 1] === '|') {
      tokens.push('or');
      i += 2;
      continue;
    }

    // Single-character operator: !
    if (s[i] === '!') {
      tokens.push('not');
      i++;
      continue;
    }

    // Words: read until non-letter
    if (isLetter(s[i])) {
      let start = i;
      while (i < s.length && isLetter(s[i])) {
        i++;
      }
      let word = s.substring(start, i).toLowerCase();

      // Map keywords
      if (word === 'and') tokens.push('and');
      else if (word === 'or') tokens.push('or');
      else if (word === 'not') tokens.push('not');
      else if (word === 'true') tokens.push('true');
      else if (word === 'false') tokens.push('false');
      else if (word === 'a') tokens.push('A');
      else if (word === 'b') tokens.push('B');
      else if (word === 'c') tokens.push('C');
      else throw new Error('Unknown word: "' + word + '"');
      continue;
    }

    throw new Error('Unexpected character: "' + s[i] + '"');
  }
  return tokens;
}

function isLetter(ch) {
  return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
}

// ── Recursive descent parser ─────────────────────────────────────

function parseOr(tokens, pos, env) {
  let left = parseAnd(tokens, pos, env);
  while (pos.i < tokens.length && tokens[pos.i] === 'or') {
    pos.i++; // consume 'or'
    let right = parseAnd(tokens, pos, env);
    left = left || right;
  }
  return left;
}

function parseAnd(tokens, pos, env) {
  let left = parseNot(tokens, pos, env);
  while (pos.i < tokens.length && tokens[pos.i] === 'and') {
    pos.i++; // consume 'and'
    let right = parseNot(tokens, pos, env);
    left = left && right;
  }
  return left;
}

function parseNot(tokens, pos, env) {
  if (pos.i < tokens.length && tokens[pos.i] === 'not') {
    pos.i++; // consume 'not'
    let val = parseNot(tokens, pos, env); // right-recursive for chained not
    return !val;
  }
  return parsePrimary(tokens, pos, env);
}

function parsePrimary(tokens, pos, env) {
  if (pos.i >= tokens.length) {
    throw new Error('Unexpected end of expression');
  }

  let tok = tokens[pos.i];

  // Boolean literals
  if (tok === 'true') {
    pos.i++;
    return true;
  }
  if (tok === 'false') {
    pos.i++;
    return false;
  }

  // Variables
  if (tok === 'A' || tok === 'B' || tok === 'C') {
    pos.i++;
    if (!(tok in env)) {
      throw new Error('Variable ' + tok + ' is not defined for ' +
        (varCount === 2 ? '2' : '3') + '-variable mode');
    }
    return env[tok];
  }

  // Parenthesized sub-expression
  if (tok === '(') {
    pos.i++; // consume '('
    let val = parseOr(tokens, pos, env);
    if (pos.i >= tokens.length || tokens[pos.i] !== ')') {
      throw new Error('Missing closing parenthesis');
    }
    pos.i++; // consume ')'
    return val;
  }

  throw new Error('Unexpected token: "' + tok + '"');
}

// ── Responsive resize ────────────────────────────────────────────

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}
