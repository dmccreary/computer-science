// Recursive Call Stack Visualizer MicroSim
// Trace the call stack during recursive execution
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// Controls
let stepButton, autoButton, resetButton;
let speedSlider, argSlider;
let funcSelect;

// State
let currentStep = 0;
let totalSteps = 0;
let autoPlay = false;
let autoTimer = 0;
let pulsePhase = 0;

// Execution trace
let trace = [];          // Array of step snapshots
let callStack = [];      // Current stack of frames for display
let currentCodeLine = -1;
let narrationText = '';
let currentFuncType = 'Factorial';
let currentArg = 4;

// Function definitions
let functions = {
  Factorial: {
    code: [
      'def factorial(n):',
      '    if n <= 1:',
      '        return 1',
      '    else:',
      '        result = n * factorial(n-1)',
      '        return result',
    ],
    buildTrace: function(n) {
      let steps = [];
      // Build recursive descent and ascent
      buildFactorialTrace(steps, n);
      return steps;
    }
  },
  Countdown: {
    code: [
      'def countdown(n):',
      '    if n <= 0:',
      '        print("Go!")',
      '        return',
      '    else:',
      '        print(n)',
      '        countdown(n-1)',
    ],
    buildTrace: function(n) {
      let steps = [];
      buildCountdownTrace(steps, n);
      return steps;
    }
  }
};

function buildFactorialTrace(steps, n) {
  // Recursive descent: push frames
  for (let i = n; i >= 1; i--) {
    // Enter function - highlight def line
    steps.push({
      action: 'enter',
      arg: i,
      line: 0,
      narration: 'Call factorial(' + i + ') — push new frame onto stack',
      stackSnapshot: buildFactorialStack(n, i, 'entering'),
    });

    // Check condition
    if (i <= 1) {
      // Base case
      steps.push({
        action: 'check',
        arg: i,
        line: 1,
        narration: 'Check: n = ' + i + ' <= 1? Yes! Base case reached.',
        stackSnapshot: buildFactorialStack(n, i, 'active'),
      });
      steps.push({
        action: 'base_return',
        arg: i,
        line: 2,
        narration: 'Return 1 — base case sends back 1',
        stackSnapshot: buildFactorialStack(n, i, 'returning', 1),
      });
    } else {
      steps.push({
        action: 'check',
        arg: i,
        line: 1,
        narration: 'Check: n = ' + i + ' <= 1? No — take the else branch.',
        stackSnapshot: buildFactorialStack(n, i, 'active'),
      });
      steps.push({
        action: 'recurse',
        arg: i,
        line: 4,
        narration: 'Need factorial(' + (i-1) + ') to compute ' + i + ' * factorial(' + (i-1) + ')',
        stackSnapshot: buildFactorialStack(n, i, 'waiting'),
      });
    }
  }

  // Recursive ascent: pop frames and compute results
  let result = 1;
  for (let i = 2; i <= n; i++) {
    let prevResult = result;
    result = i * result;
    steps.push({
      action: 'compute',
      arg: i,
      line: 4,
      narration: 'Back in factorial(' + i + '): result = ' + i + ' * ' + prevResult + ' = ' + result,
      stackSnapshot: buildFactorialReturnStack(n, i, result),
    });
    steps.push({
      action: 'return',
      arg: i,
      line: 5,
      narration: 'Return ' + result + ' — pop factorial(' + i + ') from the stack',
      stackSnapshot: buildFactorialPopStack(n, i, result),
    });
  }

  // Final done
  steps.push({
    action: 'done',
    arg: n,
    line: -1,
    narration: 'Done! factorial(' + n + ') = ' + result + '. Stack is empty.',
    stackSnapshot: [],
  });
}

function buildFactorialStack(n, currentArg, state, retVal) {
  // Build the stack from bottom (first call) to top (current call)
  let stack = [];
  for (let i = n; i >= currentArg; i--) {
    let frame = {
      name: 'factorial(' + i + ')',
      vars: { n: i },
      returnValue: (i === currentArg && retVal !== undefined) ? retVal : null,
      state: 'waiting', // default
      isBase: (i === 1),
    };
    if (i === currentArg) {
      frame.state = state;
    }
    stack.push(frame);
  }
  return stack;
}

function buildFactorialReturnStack(n, currentArg, result) {
  // During ascent: frames below currentArg are already popped
  let stack = [];
  for (let i = n; i >= currentArg; i--) {
    let frame = {
      name: 'factorial(' + i + ')',
      vars: { n: i },
      returnValue: (i === currentArg) ? result : null,
      state: (i === currentArg) ? 'computing' : 'waiting',
      isBase: false,
    };
    stack.push(frame);
  }
  return stack;
}

function buildFactorialPopStack(n, currentArg, result) {
  // After pop: frame at currentArg is gone
  let stack = [];
  for (let i = n; i > currentArg; i--) {
    let frame = {
      name: 'factorial(' + i + ')',
      vars: { n: i },
      returnValue: null,
      state: 'waiting',
      isBase: false,
    };
    stack.push(frame);
  }
  return stack;
}

function buildCountdownTrace(steps, n) {
  // Recursive descent
  for (let i = n; i >= 0; i--) {
    // Enter function
    steps.push({
      action: 'enter',
      arg: i,
      line: 0,
      narration: 'Call countdown(' + i + ') — push new frame onto stack',
      stackSnapshot: buildCountdownStack(n, i, 'entering'),
    });

    if (i <= 0) {
      // Base case
      steps.push({
        action: 'check',
        arg: i,
        line: 1,
        narration: 'Check: n = ' + i + ' <= 0? Yes! Base case.',
        stackSnapshot: buildCountdownStack(n, i, 'active'),
      });
      steps.push({
        action: 'print',
        arg: i,
        line: 2,
        narration: 'Print "Go!" — the countdown is finished!',
        stackSnapshot: buildCountdownStack(n, i, 'returning', '"Go!"'),
      });
      steps.push({
        action: 'base_return',
        arg: i,
        line: 3,
        narration: 'Return — base case done, start popping frames',
        stackSnapshot: buildCountdownStack(n, i, 'returning', 'None'),
      });
    } else {
      steps.push({
        action: 'check',
        arg: i,
        line: 1,
        narration: 'Check: n = ' + i + ' <= 0? No — take the else branch.',
        stackSnapshot: buildCountdownStack(n, i, 'active'),
      });
      steps.push({
        action: 'print',
        arg: i,
        line: 5,
        narration: 'Print ' + i,
        stackSnapshot: buildCountdownStack(n, i, 'active'),
      });
      steps.push({
        action: 'recurse',
        arg: i,
        line: 6,
        narration: 'Call countdown(' + (i-1) + ') — recursive call',
        stackSnapshot: buildCountdownStack(n, i, 'waiting'),
      });
    }
  }

  // Ascent: pop all frames
  for (let i = 1; i <= n; i++) {
    steps.push({
      action: 'return',
      arg: i,
      line: 6,
      narration: 'countdown(' + i + ') resumes and finishes — pop from stack',
      stackSnapshot: buildCountdownPopStack(n, i),
    });
  }

  steps.push({
    action: 'done',
    arg: n,
    line: -1,
    narration: 'Done! All frames popped. Stack is empty.',
    stackSnapshot: [],
  });
}

function buildCountdownStack(n, currentArg, state, retVal) {
  let stack = [];
  for (let i = n; i >= currentArg; i--) {
    let frame = {
      name: 'countdown(' + i + ')',
      vars: { n: i },
      returnValue: (i === currentArg && retVal) ? retVal : null,
      state: (i === currentArg) ? state : 'waiting',
      isBase: (i === 0),
    };
    stack.push(frame);
  }
  return stack;
}

function buildCountdownPopStack(n, currentArg) {
  let stack = [];
  for (let i = n; i > currentArg; i--) {
    let frame = {
      name: 'countdown(' + i + ')',
      vars: { n: i },
      returnValue: null,
      state: 'waiting',
      isBase: false,
    };
    stack.push(frame);
  }
  return stack;
}

function rebuildTrace() {
  let func = functions[currentFuncType];
  trace = func.buildTrace(currentArg);
  totalSteps = trace.length;
  currentStep = -1;
  callStack = [];
  currentCodeLine = -1;
  narrationText = 'Click "Step" or "Auto Play" to begin';
  autoPlay = false;
  autoTimer = 0;
  if (autoButton) autoButton.html('Auto Play');
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Function select
  funcSelect = createSelect();
  funcSelect.option('Factorial');
  funcSelect.option('Countdown');
  funcSelect.position(10, drawHeight + 14);
  funcSelect.changed(() => {
    currentFuncType = funcSelect.value();
    rebuildTrace();
  });

  // Argument slider
  argSlider = createSlider(1, 6, 4, 1);
  argSlider.position(170, drawHeight + 16);
  argSlider.size(70);
  argSlider.input(() => {
    currentArg = argSlider.value();
    rebuildTrace();
  });

  // Buttons
  stepButton = createButton('Step');
  stepButton.position(260, drawHeight + 12);
  stepButton.mousePressed(doStep);

  autoButton = createButton('Auto Play');
  autoButton.position(310, drawHeight + 12);
  autoButton.mousePressed(toggleAuto);

  resetButton = createButton('Reset');
  resetButton.position(390, drawHeight + 12);
  resetButton.mousePressed(doReset);

  // Speed slider
  speedSlider = createSlider(0.5, 3, 1.5, 0.1);
  speedSlider.position(canvasWidth - 100, drawHeight + 16);
  speedSlider.size(70);

  rebuildTrace();

  describe('Interactive visualization of the recursive call stack. Shows code with line highlighting on the left and stack frames building up and down on the right as a recursive function executes.', LABEL);
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
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  textStyle(BOLD);
  text('Recursive Call Stack', canvasWidth / 2, 8);
  textStyle(NORMAL);

  // Layout: left 58%, right 42%
  let codeW = Math.floor(canvasWidth * 0.58) - margin - 5;
  let stackX = Math.floor(canvasWidth * 0.58) + 5;
  let stackW = canvasWidth - stackX - margin;

  // Draw code panel
  drawCodePanel(margin, 34, codeW);

  // Draw call stack panel
  drawStackPanel(stackX, 34, stackW);

  // Draw narration bar
  drawNarration();

  // Draw step indicator
  drawStepIndicator();

  // Pulse animation
  pulsePhase += 0.05;

  // Auto play
  if (autoPlay) {
    autoTimer += deltaTime;
    let delay = 1200 / speedSlider.value();
    if (autoTimer > delay) {
      autoTimer = 0;
      doStep();
    }
  }

  // Control labels
  noStroke();
  fill(80);
  textAlign(LEFT, CENTER);
  textSize(11);
  text('n=' + argSlider.value(), 245, drawHeight + 25);
  text('Speed:', canvasWidth - 140, drawHeight + 25);

  // Reposition speed slider on resize
  speedSlider.position(canvasWidth - 100, drawHeight + 16);
}

function drawCodePanel(x, y, w) {
  let func = functions[currentFuncType];
  let codeLines = func.code;
  let lineH = 26;
  let h = codeLines.length * lineH + 34;

  // Panel background (dark code editor)
  fill(30, 30, 42);
  stroke(80);
  strokeWeight(1);
  rect(x, y, w, h, 8);

  // Header
  noStroke();
  fill(180);
  textAlign(LEFT, TOP);
  textSize(11);
  text('Python Code:', x + 10, y + 6);

  textFont('monospace');
  let fontSize = Math.min(13, canvasWidth * 0.026);
  textSize(fontSize);

  for (let i = 0; i < codeLines.length; i++) {
    let ly = y + 24 + i * lineH;

    // Line highlight
    if (currentCodeLine === i) {
      fill(255, 255, 100, 70);
      noStroke();
      rect(x + 4, ly - 2, w - 8, lineH - 2, 3);
    }

    // Line number
    noStroke();
    fill(100);
    textAlign(RIGHT, TOP);
    text(i + 1, x + 22, ly);

    // Code text with syntax highlighting
    textAlign(LEFT, TOP);
    let line = codeLines[i];
    let indent = line.length - line.trimStart().length;
    let trimmed = line.trimStart();

    // Render indent
    let curX = x + 30;
    if (indent > 0) {
      fill(60);
      text(line.substring(0, indent), curX, ly);
      curX += textWidth(line.substring(0, indent));
    }

    // Syntax coloring
    if (trimmed.startsWith('def ')) {
      fill(70, 130, 220);
      text('def ', curX, ly);
      curX += textWidth('def ');
      fill(200, 200, 120);
      let rest = trimmed.substring(4);
      text(rest, curX, ly);
    } else if (trimmed.startsWith('if ') || trimmed.startsWith('else:')) {
      fill(200, 120, 220);
      let keyword = trimmed.startsWith('if ') ? 'if ' : 'else:';
      text(keyword, curX, ly);
      curX += textWidth(keyword);
      fill(200);
      text(trimmed.substring(keyword.length), curX, ly);
    } else if (trimmed.startsWith('return')) {
      fill(220, 80, 80);
      text('return', curX, ly);
      curX += textWidth('return');
      fill(200);
      text(trimmed.substring(6), curX, ly);
    } else if (trimmed.startsWith('print')) {
      fill(100, 200, 100);
      text('print', curX, ly);
      curX += textWidth('print');
      fill(200);
      text(trimmed.substring(5), curX, ly);
    } else {
      fill(200);
      text(trimmed, curX, ly);
    }
  }

  textFont('Arial');

  // Legend below code panel
  let legendY = y + h + 10;
  textSize(10);
  noStroke();

  // Active frame color
  fill(255, 255, 100);
  rect(x + 5, legendY, 12, 12, 2);
  fill(80);
  textAlign(LEFT, CENTER);
  text('Current line', x + 20, legendY + 6);

  // Base case
  fill(100, 210, 130);
  rect(x + 95, legendY, 12, 12, 2);
  fill(80);
  text('Base case', x + 110, legendY + 6);

  // Return value
  fill(255, 210, 80);
  rect(x + 180, legendY, 12, 12, 2);
  fill(80);
  text('Return value', x + 195, legendY + 6);
}

function drawStackPanel(x, y, w) {
  let panelH = drawHeight - y - 110;

  // Panel background
  fill(248, 250, 255);
  stroke(150, 170, 210);
  strokeWeight(1);
  rect(x, y, w, panelH, 8);

  // Header
  noStroke();
  fill(60, 80, 130);
  textAlign(CENTER, TOP);
  textSize(13);
  textStyle(BOLD);
  text('Call Stack', x + w / 2, y + 6);
  textStyle(NORMAL);

  // Stack label
  fill(140);
  textSize(9);
  textAlign(LEFT, TOP);
  text('TOP', x + 6, y + 24);

  // Draw stack frames from top to bottom
  // callStack[0] is the bottom (first call), last is top (most recent)
  let frameH = 52;
  let framePad = 6;
  let stackTop = y + 36;
  let maxVisible = Math.floor((panelH - 50) / (frameH + framePad));

  let snapshot = (currentStep >= 0 && currentStep < trace.length)
    ? trace[currentStep].stackSnapshot
    : [];

  // Draw from top of stack (last element) to bottom
  for (let i = 0; i < snapshot.length && i < maxVisible; i++) {
    let frame = snapshot[snapshot.length - 1 - i]; // Reverse: top of stack first
    let fy = stackTop + i * (frameH + framePad);
    drawStackFrame(x + 8, fy, w - 16, frameH, frame);
  }

  // Empty stack message
  if (snapshot.length === 0) {
    fill(180);
    textAlign(CENTER, CENTER);
    textSize(12);
    text('(stack is empty)', x + w / 2, y + panelH / 2);
  }

  // Bottom label
  fill(140);
  textSize(9);
  textAlign(LEFT, BOTTOM);
  noStroke();
  text('BOTTOM', x + 6, y + panelH - 4);
}

function drawStackFrame(x, y, w, h, frame) {
  let isActive = (frame.state === 'active' || frame.state === 'entering' || frame.state === 'computing');
  let isBase = frame.isBase;
  let isReturning = (frame.state === 'returning');
  let isWaiting = (frame.state === 'waiting');

  // Frame background
  if (isBase && (isActive || isReturning)) {
    fill(220, 255, 230); // Green for base case
  } else if (isActive || isReturning || frame.state === 'computing') {
    fill(255, 255, 240); // Light yellow for active
  } else {
    fill(230, 240, 255); // Light blue for waiting
  }

  // Frame border
  if (isActive || frame.state === 'entering' || frame.state === 'computing') {
    // Pulsing yellow border for current active frame
    let pulse = Math.sin(pulsePhase) * 0.3 + 0.7;
    stroke(220 * pulse, 200 * pulse, 40);
    strokeWeight(3);
  } else if (isBase && isReturning) {
    stroke(60, 170, 90);
    strokeWeight(2);
  } else if (isWaiting) {
    stroke(120, 150, 200);
    strokeWeight(1.5);
  } else {
    stroke(150);
    strokeWeight(1);
  }

  rect(x, y, w, h, 6);

  // Function name and argument
  noStroke();
  textAlign(LEFT, TOP);
  textSize(Math.min(13, w * 0.09));
  textStyle(BOLD);
  fill(40, 60, 110);
  text(frame.name, x + 8, y + 5);
  textStyle(NORMAL);

  // Local variable
  textFont('monospace');
  textSize(Math.min(11, w * 0.075));
  fill(80);
  let varKeys = Object.keys(frame.vars);
  let varStr = varKeys.map(k => k + ' = ' + frame.vars[k]).join(', ');
  text(varStr, x + 8, y + 23);
  textFont('Arial');

  // Return value if present
  if (frame.returnValue !== null) {
    let retW = textWidth('return: ' + frame.returnValue) + 16;
    let retX = x + w - retW - 6;
    let retY = y + h - 20;

    fill(255, 210, 80);
    noStroke();
    rect(retX, retY, retW, 16, 3);

    fill(80, 60, 0);
    textAlign(LEFT, CENTER);
    textSize(Math.min(10, w * 0.065));
    textStyle(BOLD);
    text('return: ' + frame.returnValue, retX + 4, retY + 8);
    textStyle(NORMAL);
  }

  // State label
  textAlign(RIGHT, TOP);
  textSize(9);
  if (isActive || frame.state === 'entering') {
    fill(180, 140, 0);
    text('running', x + w - 8, y + 5);
  } else if (frame.state === 'computing') {
    fill(180, 100, 0);
    text('computing', x + w - 8, y + 5);
  } else if (isReturning) {
    fill(60, 140, 80);
    text('returning', x + w - 8, y + 5);
  } else if (isWaiting) {
    fill(100, 130, 180);
    text('paused', x + w - 8, y + 5);
  }
}

function drawNarration() {
  let y = drawHeight - 70;

  fill(248, 248, 252);
  stroke(200);
  strokeWeight(1);
  rect(margin, y, canvasWidth - margin * 2, 36, 8);

  noStroke();
  fill(60);
  textAlign(CENTER, CENTER);
  textSize(Math.min(12, canvasWidth * 0.025));
  text(narrationText, canvasWidth / 2, y + 18);
}

function drawStepIndicator() {
  let y = drawHeight - 28;

  noStroke();
  fill(120);
  textAlign(CENTER, TOP);
  textSize(10);

  let stepDisplay = Math.max(0, currentStep + 1);
  text('Step ' + stepDisplay + ' of ' + totalSteps, canvasWidth / 2, y);

  // Progress bar
  let barW = Math.min(200, canvasWidth - 60);
  let barX = canvasWidth / 2 - barW / 2;
  let barY = y + 14;

  fill(230);
  noStroke();
  rect(barX, barY, barW, 5, 3);

  if (totalSteps > 0) {
    let progress = stepDisplay / totalSteps;
    fill(70, 130, 220);
    rect(barX, barY, barW * progress, 5, 3);
  }
}

function doStep() {
  if (currentStep < totalSteps - 1) {
    currentStep++;
    applyStep(currentStep);
  } else {
    autoPlay = false;
    autoButton.html('Auto Play');
  }
}

function applyStep(idx) {
  let step = trace[idx];
  currentCodeLine = step.line;
  narrationText = step.narration;
  callStack = step.stackSnapshot;
}

function toggleAuto() {
  autoPlay = !autoPlay;
  autoTimer = 0;
  autoButton.html(autoPlay ? 'Pause' : 'Auto Play');
  if (autoPlay && currentStep >= totalSteps - 1) {
    doReset();
  }
}

function doReset() {
  currentStep = -1;
  callStack = [];
  currentCodeLine = -1;
  narrationText = 'Click "Step" or "Auto Play" to begin';
  autoPlay = false;
  autoTimer = 0;
  autoButton.html('Auto Play');
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const mainEl = document.querySelector('main');
  canvasWidth = mainEl.clientWidth;
}
