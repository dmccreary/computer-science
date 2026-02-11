// De Morgan's Laws Visualizer MicroSim
// Bloom Level: Analyze (L4) — prove, transform
// Students apply De Morgan's Laws to transform Boolean expressions and verify equivalence.

let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Boolean input values
let valA = false;
let valB = false;

// UI state
let showTruthTable = false;
let flashTimer = 0;          // countdown frames for flash animation
let flashDuration = 20;      // how many frames the flash lasts

// Buttons
let toggleABtn, toggleBBtn, truthTableBtn;

function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    canvasWidth = Math.min(mainEl.clientWidth, 700);
    canvasWidth = Math.max(canvasWidth, 380);
  }
  // Adjust draw height based on truth table visibility
  drawHeight = showTruthTable ? 600 : 480;
  canvasHeight = drawHeight + controlHeight;
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  // Create control buttons
  let mainEl = document.querySelector('main');

  toggleABtn = createButton('Toggle A');
  toggleABtn.parent(mainEl);
  toggleABtn.mousePressed(handleToggleA);
  toggleABtn.style('font-size', '14px');
  toggleABtn.style('padding', '6px 14px');
  toggleABtn.style('margin', '4px');
  toggleABtn.style('cursor', 'pointer');

  toggleBBtn = createButton('Toggle B');
  toggleBBtn.parent(mainEl);
  toggleBBtn.mousePressed(handleToggleB);
  toggleBBtn.style('font-size', '14px');
  toggleBBtn.style('padding', '6px 14px');
  toggleBBtn.style('margin', '4px');
  toggleBBtn.style('cursor', 'pointer');

  truthTableBtn = createButton('Show Truth Table');
  truthTableBtn.parent(mainEl);
  truthTableBtn.mousePressed(handleToggleTruthTable);
  truthTableBtn.style('font-size', '14px');
  truthTableBtn.style('padding', '6px 14px');
  truthTableBtn.style('margin', '4px');
  truthTableBtn.style('cursor', 'pointer');

  describe('Interactive De Morgan\'s Laws visualizer where students toggle A and B values to see that NOT(A AND B) equals (NOT A) OR (NOT B), and NOT(A OR B) equals (NOT A) AND (NOT B).');
}

function draw() {
  // --- Backgrounds ---
  noStroke();
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // --- Title ---
  noStroke();
  fill(40);
  textAlign(CENTER, TOP);
  textSize(22);
  textStyle(BOLD);
  text("De Morgan's Laws Visualizer", canvasWidth / 2, 12);
  textStyle(NORMAL);

  // --- Current variable display (center area) ---
  let varY = 46;
  drawVariableDisplay(varY);

  // --- Two law panels side by side ---
  let panelTop = varY + 58;
  let panelGap = 14;
  let panelWidth = (canvasWidth - margin * 2 - panelGap) / 2;
  let panelHeight = 200;

  // Evaluate all expressions
  let notAandB = !(valA && valB);
  let notA_orNotB = (!valA) || (!valB);
  let notAorB = !(valA || valB);
  let notA_andNotB = (!valA) && (!valB);

  // Law 1: NOT(A AND B) = (NOT A) OR (NOT B)
  let law1x = margin;
  drawLawPanel(law1x, panelTop, panelWidth, panelHeight,
    'Law 1',
    'NOT (A AND B)', notAandB, [40, 80, 180],
    '(NOT A) OR (NOT B)', notA_orNotB, [200, 100, 20],
    notAandB === notA_orNotB
  );

  // Law 2: NOT(A OR B) = (NOT A) AND (NOT B)
  let law2x = margin + panelWidth + panelGap;
  drawLawPanel(law2x, panelTop, panelWidth, panelHeight,
    'Law 2',
    'NOT (A OR B)', notAorB, [40, 80, 180],
    '(NOT A) AND (NOT B)', notA_andNotB, [200, 100, 20],
    notAorB === notA_andNotB
  );

  // --- Explanation text ---
  let explainY = panelTop + panelHeight + 16;
  noStroke();
  fill(80);
  textAlign(CENTER, TOP);
  textSize(14);
  textStyle(ITALIC);
  text('Both sides of each law always produce the same result!', canvasWidth / 2, explainY);
  textStyle(NORMAL);

  // --- Truth tables (if visible) ---
  if (showTruthTable) {
    let tableTop = explainY + 28;
    let tableWidth = (canvasWidth - margin * 2 - panelGap) / 2;

    drawTruthTable1(margin, tableTop, tableWidth);
    drawTruthTable2(margin + tableWidth + panelGap, tableTop, tableWidth);
  }

  // --- Flash animation countdown ---
  if (flashTimer > 0) {
    flashTimer--;
  }
}

// ----------------------------------------------------------------
// Draw the current A and B values in the center
// ----------------------------------------------------------------
function drawVariableDisplay(y) {
  let centerX = canvasWidth / 2;
  let spacing = 100;

  // A value badge
  drawValueBadge(centerX - spacing, y, 'A', valA);

  // B value badge
  drawValueBadge(centerX + spacing, y, 'B', valB);

  // Small label between them
  noStroke();
  fill(120);
  textAlign(CENTER, CENTER);
  textSize(14);
  text('Current Values', centerX, y + 20);
}

// Draw a rounded badge showing a variable name and its boolean value
function drawValueBadge(x, y, varName, val) {
  let badgeW = 80;
  let badgeH = 40;

  // Background
  noStroke();
  if (val) {
    fill(34, 160, 60);   // green for true
  } else {
    fill(200, 60, 50);   // red for false
  }
  rect(x - badgeW / 2, y, badgeW, badgeH, 10);

  // Flash glow overlay
  if (flashTimer > 0) {
    let alpha = map(flashTimer, 0, flashDuration, 0, 120);
    fill(255, 255, 100, alpha);
    rect(x - badgeW / 2, y, badgeW, badgeH, 10);
  }

  // Text
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(18);
  textStyle(BOLD);
  text(varName + ' = ' + boolStr(val), x, y + badgeH / 2);
  textStyle(NORMAL);
}

// ----------------------------------------------------------------
// Draw a single law panel with two expressions and equivalence badge
// ----------------------------------------------------------------
function drawLawPanel(x, y, w, h, title, expr1, val1, color1, expr2, val2, color2, equivalent) {
  // Panel background
  stroke(180);
  strokeWeight(1.5);
  fill(255, 255, 255, 200);
  rect(x, y, w, h, 10);

  // Title bar
  noStroke();
  fill(60, 60, 80, 30);
  rect(x + 1, y + 1, w - 2, 28, 9, 9, 0, 0);

  // Title text
  noStroke();
  fill(50);
  textAlign(CENTER, TOP);
  textSize(16);
  textStyle(BOLD);
  text(title, x + w / 2, y + 6);
  textStyle(NORMAL);

  // -- Expression 1 (original, blue) --
  let exprStartY = y + 38;
  let exprPad = 10;
  let exprFontSize = Math.max(12, Math.min(14, w * 0.045));

  noStroke();
  fill(color1[0], color1[1], color1[2]);
  textAlign(CENTER, TOP);
  textSize(exprFontSize);
  textStyle(BOLD);
  text(expr1, x + w / 2, exprStartY);
  textStyle(NORMAL);

  // Value box for expression 1
  let valBoxY = exprStartY + 22;
  drawResultBox(x + w / 2, valBoxY, val1, color1);

  // Equals sign / arrow between expressions
  let midY = valBoxY + 36;
  noStroke();
  fill(100);
  textAlign(CENTER, CENTER);
  textSize(20);
  textStyle(BOLD);
  text('=', x + w / 2, midY);
  textStyle(NORMAL);

  // -- Expression 2 (De Morgan equivalent, orange) --
  let expr2Y = midY + 18;
  noStroke();
  fill(color2[0], color2[1], color2[2]);
  textAlign(CENTER, TOP);
  textSize(exprFontSize);
  textStyle(BOLD);
  text(expr2, x + w / 2, expr2Y);
  textStyle(NORMAL);

  // Value box for expression 2
  let val2BoxY = expr2Y + 22;
  drawResultBox(x + w / 2, val2BoxY, val2, color2);

  // Equivalence badge at the bottom of the panel
  if (equivalent) {
    let badgeY = val2BoxY + 34;
    drawEquivalentBadge(x + w / 2, badgeY);
  }
}

// Draw a small rounded result box showing True or False
function drawResultBox(cx, y, val, accentColor) {
  let boxW = 80;
  let boxH = 26;
  let bx = cx - boxW / 2;

  // Background glow for matching result
  if (flashTimer > 0) {
    let glowAlpha = map(flashTimer, 0, flashDuration, 0, 60);
    noStroke();
    fill(100, 255, 100, glowAlpha);
    rect(bx - 4, y - 2, boxW + 8, boxH + 4, 10);
  }

  // Box background
  stroke(180);
  strokeWeight(1);
  if (val) {
    fill(230, 255, 230);
  } else {
    fill(255, 230, 230);
  }
  rect(bx, y, boxW, boxH, 6);

  // Value text
  noStroke();
  if (val) {
    fill(20, 140, 40);
  } else {
    fill(200, 40, 30);
  }
  textAlign(CENTER, CENTER);
  textSize(15);
  textStyle(BOLD);
  text(boolStr(val), cx, y + boxH / 2);
  textStyle(NORMAL);
}

// Draw a green "EQUIVALENT" badge
function drawEquivalentBadge(cx, y) {
  let badgeW = 120;
  let badgeH = 22;

  // Gentle glow
  noStroke();
  fill(50, 200, 80, 40);
  rect(cx - badgeW / 2 - 3, y - 2, badgeW + 6, badgeH + 4, 14);

  // Badge background
  fill(34, 170, 60);
  rect(cx - badgeW / 2, y, badgeW, badgeH, 12);

  // Text
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(12);
  textStyle(BOLD);
  text('EQUIVALENT', cx, y + badgeH / 2);
  textStyle(NORMAL);
}

// ----------------------------------------------------------------
// Truth Table for Law 1: NOT(A AND B) = (NOT A) OR (NOT B)
// ----------------------------------------------------------------
function drawTruthTable1(x, y, w) {
  drawTruthTableGeneric(
    x, y, w,
    'Law 1 Truth Table',
    'NOT(A AND B)',
    '(NOT A) OR (NOT B)',
    function(a, b) { return !(a && b); },
    function(a, b) { return (!a) || (!b); }
  );
}

// ----------------------------------------------------------------
// Truth Table for Law 2: NOT(A OR B) = (NOT A) AND (NOT B)
// ----------------------------------------------------------------
function drawTruthTable2(x, y, w) {
  drawTruthTableGeneric(
    x, y, w,
    'Law 2 Truth Table',
    'NOT(A OR B)',
    '(NOT A) AND (NOT B)',
    function(a, b) { return !(a || b); },
    function(a, b) { return (!a) && (!b); }
  );
}

// ----------------------------------------------------------------
// Generic truth table drawing function
// ----------------------------------------------------------------
function drawTruthTableGeneric(x, y, w, title, header1, header2, evalFn1, evalFn2) {
  let rowHeight = 22;
  let headerHeight = 28;
  let titleHeight = 24;
  let tableHeight = titleHeight + headerHeight + rowHeight * 4 + 4;

  // Table background
  stroke(180);
  strokeWeight(1);
  fill(255, 255, 255, 240);
  rect(x, y, w, tableHeight, 8);

  // Title
  noStroke();
  fill(50);
  textAlign(CENTER, TOP);
  textSize(13);
  textStyle(BOLD);
  text(title, x + w / 2, y + 4);
  textStyle(NORMAL);

  // Column layout: A | B | expr1 result | expr2 result
  let colX = [
    x + w * 0.08,
    x + w * 0.20,
    x + w * 0.48,
    x + w * 0.80
  ];
  let colLabels = ['A', 'B', header1, header2];

  // Header row
  let hy = y + titleHeight;
  noStroke();
  fill(230, 235, 245);
  rect(x + 2, hy, w - 4, headerHeight, 0);

  stroke(200);
  strokeWeight(0.5);
  line(x + 2, hy + headerHeight, x + w - 2, hy + headerHeight);

  noStroke();
  fill(60);
  textAlign(CENTER, CENTER);
  let headerFontSize = Math.max(10, Math.min(12, w * 0.04));
  textSize(headerFontSize);
  textStyle(BOLD);
  for (let c = 0; c < colLabels.length; c++) {
    text(colLabels[c], colX[c], hy + headerHeight / 2);
  }
  textStyle(NORMAL);

  // Data rows: all 4 combinations of A and B
  let combos = [
    [true, true],
    [true, false],
    [false, true],
    [false, false]
  ];

  for (let r = 0; r < combos.length; r++) {
    let a = combos[r][0];
    let b = combos[r][1];
    let v1 = evalFn1(a, b);
    let v2 = evalFn2(a, b);
    let ry = hy + headerHeight + r * rowHeight;

    // Highlight current A/B row
    let isCurrent = (a === valA && b === valB);
    if (isCurrent) {
      noStroke();
      fill(255, 255, 150, 160);
      rect(x + 2, ry, w - 4, rowHeight);

      // Flash overlay on the highlighted row
      if (flashTimer > 0) {
        let alpha = map(flashTimer, 0, flashDuration, 0, 80);
        fill(100, 255, 100, alpha);
        rect(x + 2, ry, w - 4, rowHeight);
      }
    }

    // Row separator
    stroke(230);
    strokeWeight(0.5);
    line(x + 4, ry + rowHeight, x + w - 4, ry + rowHeight);

    // Cell values
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(Math.max(11, Math.min(13, w * 0.04)));

    let cellY = ry + rowHeight / 2;

    // A column
    fill(a ? [20, 140, 40] : [200, 40, 30]);
    text(boolStr(a), colX[0], cellY);

    // B column
    fill(b ? [20, 140, 40] : [200, 40, 30]);
    text(boolStr(b), colX[1], cellY);

    // Expression 1 result
    fill(v1 ? [20, 140, 40] : [200, 40, 30]);
    textStyle(isCurrent ? BOLD : NORMAL);
    text(boolStr(v1), colX[2], cellY);

    // Expression 2 result
    fill(v2 ? [20, 140, 40] : [200, 40, 30]);
    text(boolStr(v2), colX[3], cellY);
    textStyle(NORMAL);

    // Match indicator: green check if both results are equal
    if (v1 === v2) {
      let checkX = x + w - 12;
      fill(34, 170, 60);
      textSize(12);
      text('=', checkX, cellY);
    }
  }
}

// ----------------------------------------------------------------
// Helper: boolean to display string
// ----------------------------------------------------------------
function boolStr(val) {
  return val ? 'T' : 'F';
}

// ----------------------------------------------------------------
// Button handlers
// ----------------------------------------------------------------
function handleToggleA() {
  valA = !valA;
  flashTimer = flashDuration;
}

function handleToggleB() {
  valB = !valB;
  flashTimer = flashDuration;
}

function handleToggleTruthTable() {
  showTruthTable = !showTruthTable;
  truthTableBtn.html(showTruthTable ? 'Hide Truth Table' : 'Show Truth Table');
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

// ----------------------------------------------------------------
// Responsive resize
// ----------------------------------------------------------------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}
