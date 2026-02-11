// Boolean Order of Operations MicroSim
// Bloom Level: Analyze (L4) - trace, differentiate
// Students trace step-by-step evaluation of complex Boolean expressions
// following Python's operator precedence: not > and > or

let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// ── Preset expressions and their pre-computed evaluation steps ──
// Each step: { expr: string[], highlightStart, highlightEnd, opType, description }
// expr is an array of tokens for the full expression at that point
// highlightStart/End are indices into that token array for the sub-expression being evaluated
// opType: 'not', 'and', 'or' (for color coding)
// description: human-readable explanation of what happened

let presets = [];
let allSteps = [];    // steps for the currently selected expression
let currentStep = 0;  // 0 = initial (no evaluation yet), 1..N = after each reduction

// Controls
let expressionSelect, stepBtn, autoPlayBtn, resetBtn;
let autoPlaying = false;
let lastStepTime = 0;
let autoPlayDelay = 1500; // ms

// Colors for operators
let notColor, andColor, orColor, highlightBg;
let trueColor, falseColor;

// Animation
let animProgress = 1.0; // 1.0 = fully settled, <1.0 = animating

function buildPresets() {
  // Each preset has a label (for the dropdown) and a token array
  presets = [
    {
      label: 'not True or False and True',
      tokens: ['not', 'True', 'or', 'False', 'and', 'True']
    },
    {
      label: 'True and False or not False',
      tokens: ['True', 'and', 'False', 'or', 'not', 'False']
    },
    {
      label: 'not (True and False) or True',
      tokens: ['not', '(', 'True', 'and', 'False', ')', 'or', 'True']
    },
    {
      label: '(True or False) and (not True or False)',
      tokens: ['(', 'True', 'or', 'False', ')', 'and', '(', 'not', 'True', 'or', 'False', ')']
    }
  ];
}

// ── Evaluation engine ──
// Tokenize, then repeatedly find highest-priority operation, record the step, reduce.
// Priority: parentheses first (innermost), then not, then and, then or.

function computeSteps(tokens) {
  let steps = [];
  let current = tokens.slice(); // working copy

  // Record initial state (step 0)
  steps.push({
    expr: current.slice(),
    highlightStart: -1,
    highlightEnd: -1,
    opType: null,
    description: 'Start: evaluate this expression'
  });

  let safety = 0;
  while (current.length > 1 && safety < 20) {
    safety++;
    let op = findNextOperation(current);
    if (!op) break;

    let result = evaluateSubExpr(current, op.start, op.end);
    let newExpr = [];
    for (let i = 0; i < op.start; i++) newExpr.push(current[i]);
    newExpr.push(result);
    for (let i = op.end + 1; i < current.length; i++) newExpr.push(current[i]);

    // Build description
    let subExprStr = current.slice(op.start, op.end + 1).join(' ');
    let desc = subExprStr + '  =>  ' + result;

    steps.push({
      expr: current.slice(),          // expression BEFORE reduction (to show highlight)
      highlightStart: op.start,
      highlightEnd: op.end,
      opType: op.type,
      result: result,
      newExpr: newExpr.slice(),        // expression AFTER reduction
      description: desc
    });

    current = newExpr;
  }

  // Final result step
  if (current.length === 1) {
    steps.push({
      expr: current.slice(),
      highlightStart: -1,
      highlightEnd: -1,
      opType: null,
      description: 'Final result: ' + current[0]
    });
  }

  return steps;
}

function findNextOperation(tokens) {
  // 1. Find innermost parenthesized group that contains no inner parens
  //    and evaluate the highest-priority op inside it
  let innerStart = -1;
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === '(') innerStart = i;
    if (tokens[i] === ')' && innerStart >= 0) {
      // Found innermost group: tokens[innerStart..i]
      let inner = tokens.slice(innerStart + 1, i); // without parens
      let innerOp = findPriorityOp(inner);
      if (innerOp) {
        return {
          start: innerStart + 1 + innerOp.start,
          end: innerStart + 1 + innerOp.end,
          type: innerOp.type
        };
      } else {
        // The inside is a single value - strip parens
        return {
          start: innerStart,
          end: i,
          type: 'parens'
        };
      }
    }
  }

  // 2. No parentheses - find highest priority op in flat tokens
  return findPriorityOp(tokens);
}

function findPriorityOp(tokens) {
  // Priority 1: not (right-most not is evaluated? No - leftmost not)
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === 'not' && i + 1 < tokens.length && isValue(tokens[i + 1])) {
      return { start: i, end: i + 1, type: 'not' };
    }
  }

  // Priority 2: and (left to right)
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === 'and' && i > 0 && i + 1 < tokens.length &&
        isValue(tokens[i - 1]) && isValue(tokens[i + 1])) {
      return { start: i - 1, end: i + 1, type: 'and' };
    }
  }

  // Priority 3: or (left to right)
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === 'or' && i > 0 && i + 1 < tokens.length &&
        isValue(tokens[i - 1]) && isValue(tokens[i + 1])) {
      return { start: i - 1, end: i + 1, type: 'or' };
    }
  }

  return null;
}

function isValue(token) {
  return token === 'True' || token === 'False';
}

function evaluateSubExpr(tokens, start, end) {
  let sub = tokens.slice(start, end + 1);

  // Handle paren stripping: ( value )
  if (sub[0] === '(' && sub[sub.length - 1] === ')') {
    return sub.slice(1, sub.length - 1).join('');
  }

  // not X
  if (sub.length === 2 && sub[0] === 'not') {
    return sub[1] === 'True' ? 'False' : 'True';
  }

  // X and Y
  if (sub.length === 3 && sub[1] === 'and') {
    let a = sub[0] === 'True';
    let b = sub[2] === 'True';
    return (a && b) ? 'True' : 'False';
  }

  // X or Y
  if (sub.length === 3 && sub[1] === 'or') {
    let a = sub[0] === 'True';
    let b = sub[2] === 'True';
    return (a || b) ? 'True' : 'False';
  }

  return 'Error';
}

// ── p5.js Setup ──

function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    canvasWidth = Math.min(mainEl.clientWidth, 750);
    canvasWidth = Math.max(canvasWidth, 400);
  }
  canvasHeight = drawHeight + controlHeight;
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  // Define colors
  notColor = color(140, 50, 180);    // purple for 'not'
  andColor = color(40, 80, 200);     // blue for 'and'
  orColor = color(220, 130, 20);     // orange for 'or'
  trueColor = color(0, 140, 60);     // green for True
  falseColor = color(190, 40, 40);   // red for False

  buildPresets();

  // Create expression dropdown
  let mainEl = document.querySelector('main');
  expressionSelect = createSelect();
  expressionSelect.parent(mainEl);
  for (let i = 0; i < presets.length; i++) {
    expressionSelect.option(presets[i].label);
  }
  expressionSelect.changed(onExpressionChanged);

  // Create buttons
  stepBtn = createButton('Step');
  stepBtn.parent(mainEl);
  stepBtn.mousePressed(advanceStep);
  stepBtn.style('font-size', '14px');
  stepBtn.style('padding', '4px 14px');
  stepBtn.style('cursor', 'pointer');

  autoPlayBtn = createButton('Auto Play');
  autoPlayBtn.parent(mainEl);
  autoPlayBtn.mousePressed(toggleAutoPlay);
  autoPlayBtn.style('font-size', '14px');
  autoPlayBtn.style('padding', '4px 14px');
  autoPlayBtn.style('cursor', 'pointer');

  resetBtn = createButton('Reset');
  resetBtn.parent(mainEl);
  resetBtn.mousePressed(doReset);
  resetBtn.style('font-size', '14px');
  resetBtn.style('padding', '4px 14px');
  resetBtn.style('cursor', 'pointer');

  // Style the dropdown
  expressionSelect.style('font-size', '14px');
  expressionSelect.style('padding', '4px 8px');
  expressionSelect.style('max-width', (canvasWidth - 2 * margin) + 'px');

  // Load first expression
  loadExpression(0);

  positionControls();

  describe('Step-through visualizer for Boolean expression evaluation order showing how not, and, and or operators are evaluated according to Python precedence rules.');
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

  let row1Y = offsetY + drawHeight + 10;
  let row2Y = offsetY + drawHeight + 44;

  // Row 1: dropdown (full width)
  expressionSelect.position(offsetX + margin, row1Y);
  expressionSelect.style('max-width', (canvasWidth - 2 * margin) + 'px');

  // Row 2: buttons
  let btnX = offsetX + margin;
  stepBtn.position(btnX, row2Y);
  autoPlayBtn.position(btnX + 65, row2Y);
  resetBtn.position(btnX + 160, row2Y);
}

function loadExpression(index) {
  allSteps = computeSteps(presets[index].tokens);
  currentStep = 0;
  autoPlaying = false;
  autoPlayBtn.html('Auto Play');
  animProgress = 1.0;
}

function onExpressionChanged() {
  let selectedLabel = expressionSelect.value();
  for (let i = 0; i < presets.length; i++) {
    if (presets[i].label === selectedLabel) {
      loadExpression(i);
      break;
    }
  }
}

// ── Controls ──

function advanceStep() {
  if (currentStep < allSteps.length - 1) {
    currentStep++;
    animProgress = 0.0;
  }
}

function toggleAutoPlay() {
  autoPlaying = !autoPlaying;
  if (autoPlaying) {
    autoPlayBtn.html('Pause');
    lastStepTime = millis();
  } else {
    autoPlayBtn.html('Auto Play');
  }
}

function doReset() {
  currentStep = 0;
  autoPlaying = false;
  autoPlayBtn.html('Auto Play');
  animProgress = 1.0;
}

// ── Draw ──

function draw() {
  // Advance animation
  if (animProgress < 1.0) {
    animProgress = min(1.0, animProgress + 0.04);
  }

  // Auto play logic
  if (autoPlaying && currentStep < allSteps.length - 1) {
    if (millis() - lastStepTime > autoPlayDelay) {
      advanceStep();
      lastStepTime = millis();
    }
  }
  if (autoPlaying && currentStep >= allSteps.length - 1) {
    autoPlaying = false;
    autoPlayBtn.html('Auto Play');
  }

  // ── Drawing area ──
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // ── Control area ──
  fill('white');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Layout dimensions
  let sidebarWidth = 150;
  let exprAreaWidth = canvasWidth - sidebarWidth - margin;

  // ── Title ──
  noStroke();
  fill(40);
  textAlign(CENTER, TOP);
  textSize(Math.max(18, Math.min(24, canvasWidth * 0.038)));
  text('Boolean Order of Operations', canvasWidth / 2, 12);

  // ── Draw priority rules sidebar on the right ──
  drawSidebar(canvasWidth - sidebarWidth - 10, 45, sidebarWidth, 130);

  // ── Draw step counter ──
  noStroke();
  fill(80);
  textAlign(LEFT, TOP);
  textSize(14);
  let totalEvalSteps = allSteps.length - 1; // step 0 is initial, last is final result
  if (currentStep === 0) {
    text('Ready to evaluate', margin, 42);
  } else {
    text('Step ' + currentStep + ' of ' + totalEvalSteps, margin, 42);
  }

  // ── Draw expression history and current state ──
  drawExpressionArea(margin, 65, exprAreaWidth);

  // ── Draw description of current step ──
  drawStepDescription(margin, drawHeight - 50, exprAreaWidth);
}

function drawSidebar(x, y, w, h) {
  // Background box
  stroke(180);
  strokeWeight(1);
  fill(248, 248, 255);
  rect(x, y, w, h, 6);

  noStroke();
  fill(60);
  textAlign(CENTER, TOP);
  textSize(Math.max(13, Math.min(15, canvasWidth * 0.025)));
  text('Priority Rules', x + w / 2, y + 8);

  let ruleY = y + 32;
  let lineH = 28;
  textAlign(LEFT, TOP);
  textSize(Math.max(13, Math.min(15, canvasWidth * 0.024)));

  // 1. not (purple)
  fill(notColor);
  text('1.', x + 10, ruleY);
  noStroke();
  fill(notColor);
  let notBoxX = x + 30;
  drawOperatorBadge('not', notBoxX, ruleY, notColor);

  // 2. and (blue)
  ruleY += lineH;
  fill(andColor);
  text('2.', x + 10, ruleY);
  drawOperatorBadge('and', notBoxX, ruleY, andColor);

  // 3. or (orange)
  ruleY += lineH;
  fill(orColor);
  text('3.', x + 10, ruleY);
  drawOperatorBadge('or', notBoxX, ruleY, orColor);
}

function drawOperatorBadge(label, x, y, col) {
  // Colored rounded rect behind operator name
  noStroke();
  fill(red(col), green(col), blue(col), 40);
  rect(x, y - 2, textWidth(label) + 14, 22, 4);
  fill(col);
  textAlign(LEFT, TOP);
  text(label, x + 7, y);
}

function drawExpressionArea(x, y, areaWidth) {
  let stepData = allSteps[currentStep];
  let lineH = 36;

  // Show history of previous steps (dimmed)
  let historyStart = Math.max(1, currentStep - 4); // show up to 4 previous steps
  let historyY = y;

  // Draw previous steps as history
  for (let i = historyStart; i < currentStep; i++) {
    let sData = allSteps[i];
    // Show the expression after reduction (newExpr) for completed steps
    let exprToShow = sData.newExpr ? sData.newExpr : sData.expr;
    drawTokenLine(exprToShow, x, historyY, areaWidth, 120, -1, -1, null, 14);
    // Draw step number
    noStroke();
    fill(160);
    textAlign(LEFT, TOP);
    textSize(11);
    historyY += lineH * 0.75;
  }

  // Add a small gap before current expression
  let currentY = historyY + 8;

  // Draw current expression with highlighting
  if (stepData.highlightStart >= 0) {
    // Show expression with highlighted sub-expression
    drawTokenLine(
      stepData.expr, x, currentY, areaWidth, 255,
      stepData.highlightStart, stepData.highlightEnd,
      stepData.opType, Math.max(18, Math.min(22, canvasWidth * 0.035))
    );

    // If animation is complete, also show the result below
    if (animProgress >= 0.8 && stepData.newExpr) {
      let resultY = currentY + lineH + 4;
      let alphaVal = map(animProgress, 0.8, 1.0, 0, 255);
      drawTokenLine(
        stepData.newExpr, x, resultY, areaWidth, alphaVal,
        -1, -1, null,
        Math.max(18, Math.min(22, canvasWidth * 0.035))
      );

      // Draw arrow between
      let arrowX = x + 20;
      stroke(lerpColor(color(200), color(100, 100, 100), map(animProgress, 0.8, 1.0, 0, 1)));
      strokeWeight(1.5);
      noFill();
      line(arrowX, currentY + lineH - 4, arrowX, resultY - 2);
      // Small arrowhead
      fill(100);
      noStroke();
      triangle(arrowX, resultY, arrowX - 4, resultY - 6, arrowX + 4, resultY - 6);
    }
  } else {
    // No highlight (initial or final state)
    let fontSize = Math.max(18, Math.min(22, canvasWidth * 0.035));
    drawTokenLine(
      stepData.expr, x, currentY, areaWidth, 255,
      -1, -1, null, fontSize
    );

    // If this is the final step, draw a result box
    if (currentStep === allSteps.length - 1 && currentStep > 0) {
      let resultVal = stepData.expr[0];
      let boxY = currentY + lineH + 10;
      let boxW = 180;
      let boxH = 40;
      let boxX = x + (areaWidth - boxW) / 2;

      // Celebration box
      noStroke();
      fill(resultVal === 'True' ? color(200, 255, 200) : color(255, 210, 210));
      rect(boxX, boxY, boxW, boxH, 8);
      stroke(resultVal === 'True' ? trueColor : falseColor);
      strokeWeight(2);
      noFill();
      rect(boxX, boxY, boxW, boxH, 8);

      noStroke();
      fill(resultVal === 'True' ? trueColor : falseColor);
      textAlign(CENTER, CENTER);
      textSize(Math.max(18, Math.min(24, canvasWidth * 0.038)));
      text('Result: ' + resultVal, boxX + boxW / 2, boxY + boxH / 2);
    }
  }
}

function drawTokenLine(tokens, x, y, areaWidth, alpha, hlStart, hlEnd, hlType, fontSize) {
  textSize(fontSize);
  textAlign(LEFT, TOP);

  // Measure total width first to check if we need to center
  let totalW = 0;
  let tokenWidths = [];
  let spacingW = textWidth(' ');
  for (let i = 0; i < tokens.length; i++) {
    let tw = textWidth(tokens[i]);
    tokenWidths.push(tw);
    totalW += tw;
    if (i < tokens.length - 1) totalW += spacingW;
  }

  // Start position (left-aligned with some offset)
  let startX = x + 35;
  let curX = startX;

  // Draw highlight box behind the sub-expression being evaluated
  if (hlStart >= 0 && hlEnd >= 0) {
    let hlX = startX;
    for (let i = 0; i < hlStart; i++) {
      hlX += tokenWidths[i] + spacingW;
    }
    let hlW = 0;
    for (let i = hlStart; i <= hlEnd; i++) {
      hlW += tokenWidths[i];
      if (i < hlEnd) hlW += spacingW;
    }

    // Pulsing highlight box
    let pulse = (sin(frameCount * 0.08) + 1) / 2;
    let hlColor = getOpColor(hlType);
    let bgAlpha = lerp(30, 70, pulse);
    noStroke();
    fill(red(hlColor), green(hlColor), blue(hlColor), bgAlpha * (alpha / 255));
    rect(hlX - 5, y - 4, hlW + 10, fontSize + 10, 5);

    // Border
    stroke(red(hlColor), green(hlColor), blue(hlColor), 150 * (alpha / 255));
    strokeWeight(2);
    noFill();
    rect(hlX - 5, y - 4, hlW + 10, fontSize + 10, 5);
  }

  // Draw each token
  for (let i = 0; i < tokens.length; i++) {
    noStroke();
    let tok = tokens[i];
    let tokColor = getTokenColor(tok);

    // Apply alpha
    fill(red(tokColor), green(tokColor), blue(tokColor), alpha);
    textAlign(LEFT, TOP);
    textSize(fontSize);
    text(tok, curX, y);

    curX += tokenWidths[i] + spacingW;
  }
}

function getTokenColor(token) {
  if (token === 'not') return notColor;
  if (token === 'and') return andColor;
  if (token === 'or') return orColor;
  if (token === 'True') return trueColor;
  if (token === 'False') return falseColor;
  if (token === '(' || token === ')') return color(100);
  return color(60);
}

function getOpColor(opType) {
  if (opType === 'not') return notColor;
  if (opType === 'and') return andColor;
  if (opType === 'or') return orColor;
  if (opType === 'parens') return color(100, 100, 100);
  return color(100);
}

function drawStepDescription(x, y, areaWidth) {
  let stepData = allSteps[currentStep];

  noStroke();
  fill(240, 240, 248);
  rect(x, y, areaWidth, 40, 6);
  stroke(200);
  strokeWeight(1);
  noFill();
  rect(x, y, areaWidth, 40, 6);

  noStroke();
  fill(60);
  textAlign(LEFT, CENTER);
  textSize(Math.max(14, Math.min(16, canvasWidth * 0.026)));

  let desc = stepData.description;
  // Truncate if too wide
  let maxW = areaWidth - 20;
  while (textWidth(desc) > maxW && desc.length > 10) {
    desc = desc.substring(0, desc.length - 4) + '...';
  }
  text(desc, x + 10, y + 20);
}

// ── Responsive ──

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();

  if (expressionSelect) {
    expressionSelect.style('max-width', (canvasWidth - 2 * margin) + 'px');
  }
}
