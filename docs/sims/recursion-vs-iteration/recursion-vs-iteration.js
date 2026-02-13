// Recursion vs Iteration Side-by-Side MicroSim
// Compare factorial implementations: recursive (blue) vs iterative (green)

let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let sliderLeftMargin = 140;

// Controls
let nSlider, stepBothBtn, runBothBtn, resetBtn;

// State
let nValue = 5;
let recSteps = [];   // Array of state snapshots for recursive execution
let iterSteps = [];  // Array of state snapshots for iterative execution
let recIndex = 0;    // Current step index for recursive side
let iterIndex = 0;   // Current step index for iterative side

// Code lines for display
let recCode = [
  'def factorial(n):',
  '    if n == 0:',
  '        return 1',
  '    return n * factorial(n-1)'
];

let iterCode = [
  'def factorial(n):',
  '    result = 1',
  '    for i in range(1, n+1):',
  '        result *= i',
  '    return result'
];

// ---- Trace generation ----

function generateRecursiveTrace(n) {
  // Each step: { line: 0-3, callStack: [{n, returning, value}], description }
  let steps = [];
  let stack = [];

  // Initial state
  steps.push({
    line: -1,
    callStack: [],
    desc: 'Ready to call factorial(' + n + ')',
    done: false,
    result: null
  });

  // Build call-down phase
  for (let i = n; i >= 0; i--) {
    // Enter function, highlight line 0
    stack.push({ n: i, returning: false, value: null });
    steps.push({
      line: 0,
      callStack: deepCopyStack(stack),
      desc: 'Call factorial(' + i + ')',
      done: false,
      result: null
    });

    // Check if n == 0, highlight line 1
    steps.push({
      line: 1,
      callStack: deepCopyStack(stack),
      desc: 'Check: is ' + i + ' == 0?',
      done: false,
      result: null
    });

    if (i === 0) {
      // Base case: return 1, highlight line 2
      stack[stack.length - 1].returning = true;
      stack[stack.length - 1].value = 1;
      steps.push({
        line: 2,
        callStack: deepCopyStack(stack),
        desc: 'Base case! Return 1',
        done: false,
        result: null
      });
    }
    // If not base case, we go to line 3 (call factorial(n-1)),
    // but the actual recursive call happens in the next loop iteration
    if (i > 0) {
      steps.push({
        line: 3,
        callStack: deepCopyStack(stack),
        desc: 'Compute ' + i + ' * factorial(' + (i - 1) + ')',
        done: false,
        result: null
      });
    }
  }

  // Build return-up phase (unwinding the stack)
  let returnVal = 1;
  // Pop base case
  stack.pop();

  for (let i = 1; i <= n; i++) {
    returnVal = returnVal * i;
    // Mark top of stack as returning
    if (stack.length > 0) {
      stack[stack.length - 1].returning = true;
      stack[stack.length - 1].value = returnVal;
    }
    steps.push({
      line: 3,
      callStack: deepCopyStack(stack),
      desc: 'factorial(' + i + ') returns ' + returnVal,
      done: false,
      result: null
    });
    stack.pop();
  }

  // Final done state
  steps.push({
    line: -1,
    callStack: [],
    desc: 'Result: ' + factorial(n),
    done: true,
    result: factorial(n)
  });

  return steps;
}

function generateIterativeTrace(n) {
  // Each step: { line: 0-4, vars: {result, i}, description }
  let steps = [];

  // Initial state
  steps.push({
    line: -1,
    vars: { result: null, i: null },
    desc: 'Ready to call factorial(' + n + ')',
    done: false,
    result: null
  });

  // Line 0: def factorial(n)
  steps.push({
    line: 0,
    vars: { result: null, i: null },
    desc: 'Enter factorial(' + n + ')',
    done: false,
    result: null
  });

  // Line 1: result = 1
  steps.push({
    line: 1,
    vars: { result: 1, i: null },
    desc: 'Set result = 1',
    done: false,
    result: null
  });

  // Loop iterations
  let result = 1;
  for (let i = 1; i <= n; i++) {
    // Line 2: for i in range(1, n+1)
    steps.push({
      line: 2,
      vars: { result: result, i: i },
      desc: 'Loop: i = ' + i,
      done: false,
      result: null
    });

    // Line 3: result *= i
    result *= i;
    steps.push({
      line: 3,
      vars: { result: result, i: i },
      desc: 'result = ' + (result / i) + ' * ' + i + ' = ' + result,
      done: false,
      result: null
    });
  }

  // Line 4: return result
  steps.push({
    line: 4,
    vars: { result: result, i: n },
    desc: 'Return ' + result,
    done: false,
    result: null
  });

  // Done
  steps.push({
    line: -1,
    vars: { result: result, i: n },
    desc: 'Result: ' + result,
    done: true,
    result: result
  });

  return steps;
}

function deepCopyStack(stack) {
  return stack.map(function(frame) {
    return { n: frame.n, returning: frame.returning, value: frame.value };
  });
}

function factorial(n) {
  if (n <= 0) return 1;
  let r = 1;
  for (let i = 1; i <= n; i++) r *= i;
  return r;
}

// ---- p5.js lifecycle ----

function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    canvasWidth = mainEl.clientWidth;
  }
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Courier New, monospace');

  // n slider
  nSlider = createSlider(1, 7, 5, 1);
  nSlider.parent(document.querySelector('main'));
  nSlider.style('width', '100px');
  nSlider.input(onSliderChange);

  // Step Both button
  stepBothBtn = createButton('Step Both');
  stepBothBtn.parent(document.querySelector('main'));
  stepBothBtn.mousePressed(stepBoth);
  stepBothBtn.style('font-size', '14px');
  stepBothBtn.style('padding', '4px 10px');
  stepBothBtn.style('cursor', 'pointer');

  // Run Both button
  runBothBtn = createButton('Run Both');
  runBothBtn.parent(document.querySelector('main'));
  runBothBtn.mousePressed(runBoth);
  runBothBtn.style('font-size', '14px');
  runBothBtn.style('padding', '4px 10px');
  runBothBtn.style('cursor', 'pointer');

  // Reset button
  resetBtn = createButton('Reset');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.mousePressed(doReset);
  resetBtn.style('font-size', '14px');
  resetBtn.style('padding', '4px 10px');
  resetBtn.style('cursor', 'pointer');

  generateTraces();

  describe('Side-by-side comparison of recursive and iterative factorial implementations, showing code execution steps, call stack or variable state, and performance metrics.');
}

function draw() {
  // Drawing area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area
  fill('white');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  let halfW = canvasWidth / 2;

  // Title
  noStroke();
  fill(50);
  textFont('Arial');
  textSize(max(14, canvasWidth * 0.028));
  textAlign(CENTER, TOP);
  text('Recursion vs Iteration: factorial(' + nValue + ')', canvasWidth / 2, 6);
  textFont('Courier New, monospace');

  // Divider
  stroke(180);
  strokeWeight(1);
  line(halfW, 28, halfW, drawHeight - 2);

  // Draw panels
  drawRecursivePanel(0, halfW);
  drawIterativePanel(halfW, halfW);

  // Draw comparison metrics at bottom of draw area
  drawMetrics();

  // Position controls in control area
  positionControls();
}

// ---- Recursive panel (left, blue) ----

function drawRecursivePanel(xOff, w) {
  let cx = xOff + w / 2;
  let codeSize = max(10, min(13, canvasWidth * 0.02));
  let currentState = recSteps[recIndex];

  // Panel header
  noStroke();
  fill(30, 80, 180);
  textSize(max(13, canvasWidth * 0.024));
  textAlign(CENTER, TOP);
  text('Recursive', cx, 30);

  // Code section
  let codeY = 52;
  let lineH = max(14, canvasWidth * 0.022);
  textSize(codeSize);
  textAlign(LEFT, TOP);

  for (let i = 0; i < recCode.length; i++) {
    let ly = codeY + i * lineH;

    // Yellow highlight on active line
    if (currentState && currentState.line === i) {
      noStroke();
      fill(255, 255, 100, 200);
      rect(xOff + 4, ly - 1, w - 8, lineH, 3);
    }

    noStroke();
    fill(30);
    textSize(codeSize);
    text(recCode[i], xOff + 8, ly);
  }

  // Call stack visualization
  let stackY = codeY + recCode.length * lineH + 12;
  noStroke();
  fill(30, 80, 180);
  textSize(max(11, canvasWidth * 0.019));
  textAlign(LEFT, TOP);
  text('Call Stack:', xOff + 8, stackY);
  stackY += max(14, canvasWidth * 0.022);

  if (currentState && currentState.callStack.length > 0) {
    let frameH = max(22, canvasWidth * 0.035);
    let frameW = w - 24;
    let stackFrames = currentState.callStack;

    // Draw frames bottom-up (first call at bottom)
    for (let i = 0; i < stackFrames.length; i++) {
      let frame = stackFrames[i];
      let fy = stackY + (stackFrames.length - 1 - i) * (frameH + 3);

      // Frame background
      stroke(30, 80, 180);
      strokeWeight(1);
      if (frame.returning) {
        fill(180, 210, 255);
      } else {
        fill(220, 235, 255);
      }
      rect(xOff + 10, fy, frameW, frameH, 4);

      // Frame text
      noStroke();
      fill(30);
      textSize(max(10, min(12, canvasWidth * 0.018)));
      textAlign(LEFT, CENTER);
      let label = 'factorial(' + frame.n + ')';
      if (frame.returning && frame.value !== null) {
        label += ' -> ' + frame.value;
      }
      text(label, xOff + 16, fy + frameH / 2);
    }
  } else if (currentState && currentState.done) {
    fill(30, 130, 30);
    textSize(max(11, canvasWidth * 0.019));
    textAlign(LEFT, TOP);
    text('Stack empty', xOff + 8, stackY);
  } else {
    fill(140);
    textSize(max(11, canvasWidth * 0.019));
    textAlign(LEFT, TOP);
    text('(empty)', xOff + 8, stackY);
  }

  // Description / status
  if (currentState) {
    let descY = drawHeight - 72;
    noStroke();
    fill(30, 80, 180);
    textSize(max(10, min(12, canvasWidth * 0.018)));
    textAlign(LEFT, TOP);
    // Truncate long descriptions for narrow screens
    let descText = currentState.desc;
    text(descText, xOff + 8, descY, w - 16, 30);
  }

  // Step counter
  noStroke();
  fill(80);
  textSize(max(10, canvasWidth * 0.017));
  textAlign(LEFT, BOTTOM);
  text('Step: ' + recIndex + '/' + (recSteps.length - 1), xOff + 8, drawHeight - 42);
}

// ---- Iterative panel (right, green) ----

function drawIterativePanel(xOff, w) {
  let cx = xOff + w / 2;
  let codeSize = max(10, min(13, canvasWidth * 0.02));
  let currentState = iterSteps[iterIndex];

  // Panel header
  noStroke();
  fill(0, 130, 60);
  textSize(max(13, canvasWidth * 0.024));
  textAlign(CENTER, TOP);
  text('Iterative', cx, 30);

  // Code section
  let codeY = 52;
  let lineH = max(14, canvasWidth * 0.022);
  textSize(codeSize);
  textAlign(LEFT, TOP);

  for (let i = 0; i < iterCode.length; i++) {
    let ly = codeY + i * lineH;

    // Yellow highlight on active line
    if (currentState && currentState.line === i) {
      noStroke();
      fill(255, 255, 100, 200);
      rect(xOff + 4, ly - 1, w - 8, lineH, 3);
    }

    noStroke();
    fill(30);
    textSize(codeSize);
    text(iterCode[i], xOff + 8, ly);
  }

  // Variable state
  let varsY = codeY + iterCode.length * lineH + 12;
  noStroke();
  fill(0, 130, 60);
  textSize(max(11, canvasWidth * 0.019));
  textAlign(LEFT, TOP);
  text('Variables:', xOff + 8, varsY);
  varsY += max(14, canvasWidth * 0.022);

  if (currentState) {
    let varBoxH = max(22, canvasWidth * 0.035);
    let varBoxW = w - 24;

    // result variable
    stroke(0, 130, 60);
    strokeWeight(1);
    fill(220, 245, 220);
    rect(xOff + 10, varsY, varBoxW, varBoxH, 4);
    noStroke();
    fill(30);
    textSize(max(10, min(12, canvasWidth * 0.018)));
    textAlign(LEFT, CENTER);
    let rText = 'result = ' + (currentState.vars.result !== null ? currentState.vars.result : '---');
    text(rText, xOff + 16, varsY + varBoxH / 2);

    // i variable
    let iy = varsY + varBoxH + 4;
    stroke(0, 130, 60);
    strokeWeight(1);
    fill(220, 245, 220);
    rect(xOff + 10, iy, varBoxW, varBoxH, 4);
    noStroke();
    fill(30);
    textSize(max(10, min(12, canvasWidth * 0.018)));
    textAlign(LEFT, CENTER);
    let iText = 'i = ' + (currentState.vars.i !== null ? currentState.vars.i : '---');
    text(iText, xOff + 16, iy + varBoxH / 2);

    // Memory note
    let memY = iy + varBoxH + 8;
    fill(100);
    textSize(max(9, canvasWidth * 0.015));
    textAlign(LEFT, TOP);
    text('Memory: constant (2 vars)', xOff + 10, memY);
  }

  // Description / status
  if (currentState) {
    let descY = drawHeight - 72;
    noStroke();
    fill(0, 130, 60);
    textSize(max(10, min(12, canvasWidth * 0.018)));
    textAlign(LEFT, TOP);
    let descText = currentState.desc;
    text(descText, xOff + 8, descY, w - 16, 30);
  }

  // Step counter
  noStroke();
  fill(80);
  textSize(max(10, canvasWidth * 0.017));
  textAlign(LEFT, BOTTOM);
  text('Step: ' + iterIndex + '/' + (iterSteps.length - 1), xOff + 8, drawHeight - 42);
}

// ---- Comparison metrics (bottom of draw area) ----

function drawMetrics() {
  let metricsY = drawHeight - 38;
  let halfW = canvasWidth / 2;

  noStroke();
  fill(240, 240, 250);
  rect(0, metricsY, canvasWidth, 38);
  stroke('silver');
  strokeWeight(1);
  line(0, metricsY, canvasWidth, metricsY);

  noStroke();
  textSize(max(10, min(12, canvasWidth * 0.018)));
  textAlign(CENTER, TOP);

  let recState = recSteps[recIndex];
  let iterState = iterSteps[iterIndex];

  // Steps comparison
  fill(30, 80, 180);
  text('Rec steps: ' + recIndex, canvasWidth * 0.17, metricsY + 3);
  fill(0, 130, 60);
  text('Iter steps: ' + iterIndex, canvasWidth * 0.17, metricsY + 19);

  // Memory comparison
  let recMem = recState && recState.callStack ? recState.callStack.length : 0;
  fill(30, 80, 180);
  text('Rec memory: ' + recMem + ' frame' + (recMem !== 1 ? 's' : ''), canvasWidth * 0.5, metricsY + 3);
  fill(0, 130, 60);
  text('Iter memory: constant', canvasWidth * 0.5, metricsY + 19);

  // Output comparison
  let recResult = recState && recState.done ? recState.result : '...';
  let iterResult = iterState && iterState.done ? iterState.result : '...';
  fill(30, 80, 180);
  text('Rec output: ' + recResult, canvasWidth * 0.83, metricsY + 3);
  fill(0, 130, 60);
  text('Iter output: ' + iterResult, canvasWidth * 0.83, metricsY + 19);
}

// ---- Controls positioning ----

function positionControls() {
  // Lay out controls in a row within control area
  let y = drawHeight + 14;
  let x = margin;

  // n slider label
  noStroke();
  fill(60);
  textFont('Arial');
  textSize(13);
  textAlign(LEFT, CENTER);
  text('n = ' + nValue, x, y + 5);
  textFont('Courier New, monospace');
  x += 38;

  nSlider.position(x, y);
  x += 110;

  stepBothBtn.position(x, y - 3);
  x += stepBothBtn.elt.offsetWidth + 6;

  runBothBtn.position(x, y - 3);
  x += runBothBtn.elt.offsetWidth + 6;

  resetBtn.position(x, y - 3);
}

// ---- Control callbacks ----

function onSliderChange() {
  nValue = nSlider.value();
  generateTraces();
}

function stepBoth() {
  if (recIndex < recSteps.length - 1) {
    recIndex++;
  }
  if (iterIndex < iterSteps.length - 1) {
    iterIndex++;
  }
}

function runBoth() {
  recIndex = recSteps.length - 1;
  iterIndex = iterSteps.length - 1;
}

function doReset() {
  nValue = nSlider.value();
  generateTraces();
}

function generateTraces() {
  recSteps = generateRecursiveTrace(nValue);
  iterSteps = generateIterativeTrace(nValue);
  recIndex = 0;
  iterIndex = 0;
}

// ---- Responsive ----

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}
