// Compiled vs. Interpreted Languages MicroSim
// A side-by-side step-through demonstration

let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 240;
let defaultTextSize = 16;

// State
let currentStep = 0;
let totalSteps = 7; // unified step counter (compiled finishes at 3, interpreted at 7)
let autoPlaying = false;
let lastStepTime = 0;

// Controls
let stepButton, autoPlayButton, resetButton, speedSlider;

// Source code lines
let sourceLines = ['x = 5', 'y = 10', 'print x + y'];

// Compiled side states per step:
// Step 0: Show source code (idle)
// Step 1: All 3 lines highlight yellow -> "Compiling..."
// Step 2: Machine code appears -> "Compiled!"
// Step 3: Execute all -> output "15"
// Steps 4-7: Compiled side stays at finished state

// Interpreted side states per step:
// Step 0: Show source code (idle)
// Step 1: Line 1 highlights -> "Interpreting line 1..."
// Step 2: Line 1 executes -> x = 5
// Step 3: Line 2 highlights -> "Interpreting line 2..."
// Step 4: Line 2 executes -> y = 10
// Step 5: Line 3 highlights -> "Interpreting line 3..."
// Step 6: Line 3 executes -> output "15"
// Step 7: Done

// Arrow animation helper
let arrowPulse = 0;

function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    canvasWidth = Math.min(mainEl.clientWidth, 900);
    canvasWidth = Math.max(canvasWidth, 400);
  }
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  // Create buttons
  stepButton = createButton('Step');
  stepButton.parent(document.querySelector('main'));
  stepButton.position(margin, drawHeight + 12);
  stepButton.mousePressed(advanceStep);
  stepButton.style('font-size', '14px');
  stepButton.style('padding', '4px 12px');
  stepButton.style('cursor', 'pointer');

  autoPlayButton = createButton('Auto Play');
  autoPlayButton.parent(document.querySelector('main'));
  autoPlayButton.position(margin + 70, drawHeight + 12);
  autoPlayButton.mousePressed(toggleAutoPlay);
  autoPlayButton.style('font-size', '14px');
  autoPlayButton.style('padding', '4px 12px');
  autoPlayButton.style('cursor', 'pointer');

  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.position(margin + 170, drawHeight + 12);
  resetButton.mousePressed(doReset);
  resetButton.style('font-size', '14px');
  resetButton.style('padding', '4px 12px');
  resetButton.style('cursor', 'pointer');

  // Speed slider: 500ms to 2000ms, default 1000ms
  speedSlider = createSlider(500, 2000, 1000, 100);
  speedSlider.parent(document.querySelector('main'));
  speedSlider.position(sliderLeftMargin, drawHeight + 15);
  speedSlider.style('width', (canvasWidth - sliderLeftMargin - margin) + 'px');

  describe('Interactive side-by-side comparison of compiled and interpreted language execution, with step-through animation showing how source code is translated and run differently in each model.');
}

function draw() {
  arrowPulse = (sin(frameCount * 0.08) + 1) / 2; // 0 to 1 pulsing

  // Draw area background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('white');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Divider line
  stroke(180);
  strokeWeight(1);
  line(canvasWidth / 2, 40, canvasWidth / 2, drawHeight - 30);

  // Title
  noStroke();
  fill(40);
  textSize(Math.max(16, canvasWidth * 0.035));
  textAlign(CENTER, TOP);
  text('Compiled vs. Interpreted Languages', canvasWidth / 2, 8);

  let halfW = canvasWidth / 2;

  // Draw both sides
  drawCompiledSide(0, halfW);
  drawInterpretedSide(halfW, halfW);

  // Step counter in footer area
  noStroke();
  fill(100);
  textSize(14);
  textAlign(CENTER, BOTTOM);
  text('Step ' + currentStep + ' of ' + totalSteps, canvasWidth / 2, drawHeight - 5);

  // Speed label
  noStroke();
  fill(80);
  textSize(12);
  textAlign(LEFT, CENTER);
  text('Speed', sliderLeftMargin, drawHeight + 8);

  // Auto play logic
  if (autoPlaying && currentStep < totalSteps) {
    let interval = speedSlider.value();
    if (millis() - lastStepTime > interval) {
      advanceStep();
      lastStepTime = millis();
    }
  }
  if (autoPlaying && currentStep >= totalSteps) {
    autoPlaying = false;
    autoPlayButton.html('Auto Play');
  }
}

function drawCompiledSide(xOff, w) {
  let cx = xOff + w / 2;
  let stageY1 = 50;  // Source code stage
  let stageY2 = 190; // Translation stage
  let stageY3 = 330; // Execution stage
  let boxW = w - 30;
  let boxH = 90;

  // Header
  noStroke();
  fill(40, 80, 160);
  textSize(Math.max(14, canvasWidth * 0.028));
  textAlign(CENTER, TOP);
  text('Compiled (e.g., C)', cx, 38);

  // --- Stage 1: Source Code ---
  drawStageBox(xOff + 15, stageY1, boxW, boxH, 'Source Code');
  drawSourceCode(xOff + 15, stageY1, boxW, boxH, getCompiledHighlights());

  // --- Arrow from source to translation ---
  let arrowActive1 = currentStep >= 1 && currentStep <= 2;
  drawArrow(cx, stageY1 + boxH + 2, cx, stageY2 - 2, arrowActive1);

  // --- Stage 2: Translation ---
  let transLabel = 'Compiler';
  let transStatus = '';
  let transColor = color(220, 230, 240);
  if (currentStep >= 1 && currentStep < 2) {
    transStatus = 'Compiling...';
    transColor = color(255, 255, 180);
  } else if (currentStep >= 2) {
    transStatus = 'Compiled!';
    transColor = color(180, 255, 180);
  }
  drawStageBox(xOff + 15, stageY2, boxW, boxH, transLabel, transColor);
  drawTranslationContent(xOff + 15, stageY2, boxW, boxH, 'compiled', transStatus);

  // --- Arrow from translation to execution ---
  let arrowActive2 = currentStep >= 3;
  drawArrow(cx, stageY2 + boxH + 2, cx, stageY3 - 2, arrowActive2);

  // --- Stage 3: Execution/Output ---
  let execColor = color(220, 230, 240);
  if (currentStep >= 3) {
    execColor = color(200, 255, 200);
  }
  drawStageBox(xOff + 15, stageY3, boxW, boxH - 10, 'Output', execColor);
  drawOutput(xOff + 15, stageY3, boxW, boxH - 10, 'compiled');

  // Finished indicator
  if (currentStep >= 3) {
    noStroke();
    fill(0, 150, 0);
    textSize(Math.max(13, canvasWidth * 0.024));
    textAlign(CENTER, TOP);
    text('Done at step 3!', cx, stageY3 + boxH - 5);
  }
}

function drawInterpretedSide(xOff, w) {
  let cx = xOff + w / 2;
  let stageY1 = 50;
  let stageY2 = 190;
  let stageY3 = 330;
  let boxW = w - 30;
  let boxH = 90;

  // Header
  noStroke();
  fill(0, 120, 60);
  textSize(Math.max(14, canvasWidth * 0.028));
  textAlign(CENTER, TOP);
  text('Interpreted (e.g., Python)', cx, 38);

  // --- Stage 1: Source Code ---
  drawStageBox(xOff + 15, stageY1, boxW, boxH, 'Source Code');
  drawSourceCode(xOff + 15, stageY1, boxW, boxH, getInterpretedHighlights());

  // --- Arrow from source to translation ---
  let arrowActive1 = currentStep >= 1 && currentStep <= 6;
  drawArrow(cx, stageY1 + boxH + 2, cx, stageY2 - 2, arrowActive1);

  // --- Stage 2: Translation ---
  let transLabel = 'Interpreter';
  let transStatus = '';
  let transColor = color(220, 230, 240);
  if (currentStep === 1) {
    transStatus = 'Interpreting line 1...';
    transColor = color(255, 255, 180);
  } else if (currentStep === 2) {
    transStatus = 'x = 5';
    transColor = color(180, 255, 180);
  } else if (currentStep === 3) {
    transStatus = 'Interpreting line 2...';
    transColor = color(255, 255, 180);
  } else if (currentStep === 4) {
    transStatus = 'y = 10';
    transColor = color(180, 255, 180);
  } else if (currentStep === 5) {
    transStatus = 'Interpreting line 3...';
    transColor = color(255, 255, 180);
  } else if (currentStep === 6) {
    transStatus = 'print x + y -> 15';
    transColor = color(180, 255, 180);
  } else if (currentStep >= 7) {
    transStatus = 'Done!';
    transColor = color(180, 255, 180);
  }
  drawStageBox(xOff + 15, stageY2, boxW, boxH, transLabel, transColor);
  drawTranslationContent(xOff + 15, stageY2, boxW, boxH, 'interpreted', transStatus);

  // --- Arrow from translation to execution ---
  let arrowActive2 = (currentStep === 2 || currentStep === 4 || currentStep >= 6);
  drawArrow(cx, stageY2 + boxH + 2, cx, stageY3 - 2, arrowActive2);

  // --- Stage 3: Execution/Output ---
  let execColor = color(220, 230, 240);
  if (currentStep >= 2) {
    execColor = color(200, 255, 200);
  }
  drawStageBox(xOff + 15, stageY3, boxW, boxH - 10, 'Output', execColor);
  drawOutput(xOff + 15, stageY3, boxW, boxH - 10, 'interpreted');

  // Finished indicator
  if (currentStep >= 7) {
    noStroke();
    fill(0, 120, 60);
    textSize(Math.max(13, canvasWidth * 0.024));
    textAlign(CENTER, TOP);
    text('Done at step 7!', cx, stageY3 + boxH - 5);
  }
}

// Returns an array of booleans for which source lines to highlight (compiled side)
function getCompiledHighlights() {
  if (currentStep === 1) {
    return [true, true, true]; // All lines glow at once
  }
  return [false, false, false];
}

// Returns an array of booleans for which source lines to highlight (interpreted side)
function getInterpretedHighlights() {
  if (currentStep === 1 || currentStep === 2) return [true, false, false];
  if (currentStep === 3 || currentStep === 4) return [false, true, false];
  if (currentStep === 5 || currentStep === 6) return [false, false, true];
  return [false, false, false];
}

function drawStageBox(x, y, w, h, label, bgColor) {
  if (!bgColor) bgColor = color(220, 230, 240);
  stroke(150);
  strokeWeight(1);
  fill(bgColor);
  rect(x, y, w, h, 6);

  // Label
  noStroke();
  fill(80);
  textSize(Math.max(12, canvasWidth * 0.022));
  textAlign(LEFT, TOP);
  text(label, x + 8, y + 4);
}

function drawSourceCode(x, y, w, h, highlights) {
  let lineH = 20;
  let startY = y + 26;
  let codeSize = Math.max(14, canvasWidth * 0.026);
  textSize(codeSize);
  textAlign(LEFT, TOP);

  for (let i = 0; i < sourceLines.length; i++) {
    // Highlight background
    if (highlights[i]) {
      noStroke();
      fill(255, 255, 100, 180);
      rect(x + 6, startY + i * lineH - 2, w - 12, lineH, 3);
    }
    noStroke();
    fill(30);
    text((i + 1) + ':  ' + sourceLines[i], x + 10, startY + i * lineH);
  }
}

function drawTranslationContent(x, y, w, h, side, statusText) {
  noStroke();
  textAlign(CENTER, CENTER);

  if (side === 'compiled') {
    if (currentStep >= 2) {
      // Show machine code
      fill(60);
      textSize(Math.max(11, canvasWidth * 0.02));
      textAlign(LEFT, TOP);
      let mcY = y + 26;
      text('MOV R0, #5', x + 10, mcY);
      text('MOV R1, #10', x + 10, mcY + 16);
      text('ADD R2, R0, R1', x + 10, mcY + 32);
      text('OUT R2', x + 10, mcY + 48);
    }
    if (statusText) {
      textAlign(RIGHT, BOTTOM);
      fill(statusText === 'Compiling...' ? color(180, 120, 0) : color(0, 130, 0));
      textSize(Math.max(13, canvasWidth * 0.024));
      text(statusText, x + w - 10, y + h - 6);
    }
  } else {
    // interpreted side
    if (statusText) {
      fill(60);
      textSize(Math.max(14, canvasWidth * 0.026));
      textAlign(CENTER, CENTER);
      text(statusText, x + w / 2, y + h / 2 + 8);
    }
  }
}

function drawOutput(x, y, w, h, side) {
  noStroke();
  textSize(Math.max(14, canvasWidth * 0.026));
  textAlign(LEFT, TOP);
  let outY = y + 26;

  if (side === 'compiled') {
    if (currentStep >= 3) {
      fill(0, 100, 0);
      textSize(Math.max(16, canvasWidth * 0.032));
      textAlign(CENTER, CENTER);
      text('> 15', x + w / 2, y + h / 2 + 8);
    } else {
      fill(160);
      textAlign(CENTER, CENTER);
      text('(waiting...)', x + w / 2, y + h / 2 + 8);
    }
  } else {
    // Interpreted side: show incremental output
    let lines = [];
    if (currentStep >= 2) lines.push('x = 5');
    if (currentStep >= 4) lines.push('y = 10');
    if (currentStep >= 6) lines.push('> 15');

    if (lines.length === 0) {
      fill(160);
      textAlign(CENTER, CENTER);
      text('(waiting...)', x + w / 2, y + h / 2 + 8);
    } else {
      fill(0, 100, 0);
      textSize(Math.max(13, canvasWidth * 0.024));
      textAlign(LEFT, TOP);
      for (let i = 0; i < lines.length; i++) {
        text(lines[i], x + 10, outY + i * 18);
      }
    }
  }
}

function drawArrow(x1, y1, x2, y2, active) {
  let col = active ? lerpColor(color(150), color(60, 120, 220), arrowPulse) : color(180);
  stroke(col);
  strokeWeight(active ? 2.5 : 1.5);
  line(x1, y1, x2, y2);

  // Arrowhead
  let arrowSize = 7;
  let angle = atan2(y2 - y1, x2 - x1);
  fill(col);
  noStroke();
  triangle(
    x2 + cos(angle) * 2, y2 + sin(angle) * 2,
    x2 - arrowSize * cos(angle - PI / 6), y2 - arrowSize * sin(angle - PI / 6),
    x2 - arrowSize * cos(angle + PI / 6), y2 - arrowSize * sin(angle + PI / 6)
  );
}

function advanceStep() {
  if (currentStep < totalSteps) {
    currentStep++;
  }
}

function toggleAutoPlay() {
  autoPlaying = !autoPlaying;
  if (autoPlaying) {
    autoPlayButton.html('Pause');
    lastStepTime = millis();
  } else {
    autoPlayButton.html('Auto Play');
  }
}

function doReset() {
  currentStep = 0;
  autoPlaying = false;
  autoPlayButton.html('Auto Play');
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  if (speedSlider) {
    speedSlider.style('width', (canvasWidth - sliderLeftMargin - margin) + 'px');
  }
}
