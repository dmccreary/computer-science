// Variable Scope Visualizer MicroSim
// Step-through code execution showing global/local scope boxes
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
let stepFwdButton, stepBackButton, autoButton, resetButton;
let exampleSelect;

// State
let currentLine = 0;
let autoPlay = false;
let autoTimer = 0;
let globalVars = {};
let localVars = {};
let localScopeName = '';
let localScopeVisible = false;
let outputText = '';
let localFadeAlpha = 0;

// Examples
let examples = [
  {
    label: 'Basic Scope',
    code: [
      'x = 10',
      'y = 20',
      '',
      'def double(n):',
      '    result = n * 2',
      '    return result',
      '',
      'z = double(x)',
      'print(x, y, z)',
    ],
    steps: [
      { line: 0, action: () => { globalVars = { x: 10 }; }, narration: 'Create global variable x = 10' },
      { line: 1, action: () => { globalVars.y = 20; }, narration: 'Create global variable y = 20' },
      { line: 7, action: () => { localScopeName = 'double()'; localScopeVisible = true; localVars = { n: 10 }; }, narration: 'Call double(x) — enters function, n = 10' },
      { line: 4, action: () => { localVars.result = 20; }, narration: 'Execute body: result = n * 2 = 20' },
      { line: 5, action: () => { localScopeVisible = false; localVars = {}; globalVars.z = 20; }, narration: 'Return 20 — local scope destroyed! z = 20' },
      { line: 8, action: () => { outputText = '10 20 20'; }, narration: 'Print x, y, z → 10 20 20' },
    ],
  },
  {
    label: 'Name Collision',
    code: [
      'x = "global"',
      '',
      'def confuse():',
      '    x = "local"',
      '    print(x)',
      '',
      'confuse()',
      'print(x)',
    ],
    steps: [
      { line: 0, action: () => { globalVars = { x: '"global"' }; }, narration: 'Create global variable x = "global"' },
      { line: 6, action: () => { localScopeName = 'confuse()'; localScopeVisible = true; localVars = {}; }, narration: 'Call confuse() — enters function' },
      { line: 3, action: () => { localVars.x = '"local"'; }, narration: 'Create LOCAL x = "local" (shadows global x!)' },
      { line: 4, action: () => { outputText = 'local'; }, narration: 'Print x → "local" (uses local x)' },
      { line: 6, action: () => { localScopeVisible = false; localVars = {}; }, narration: 'Function returns — local x is destroyed!' },
      { line: 7, action: () => { outputText += '\nglobal'; }, narration: 'Print x → "global" (back to global x)' },
    ],
  },
  {
    label: 'Global Keyword',
    code: [
      'count = 0',
      '',
      'def increment():',
      '    global count',
      '    count = count + 1',
      '',
      'increment()',
      'increment()',
      'print(count)',
    ],
    steps: [
      { line: 0, action: () => { globalVars = { count: 0 }; }, narration: 'Create global variable count = 0' },
      { line: 6, action: () => { localScopeName = 'increment()'; localScopeVisible = true; localVars = {}; }, narration: 'Call increment() — enters function' },
      { line: 3, action: () => {}, narration: '"global count" — tells Python to use the global count' },
      { line: 4, action: () => { globalVars.count = 1; }, narration: 'count = count + 1 → modifies GLOBAL count to 1' },
      { line: 6, action: () => { localScopeVisible = false; localVars = {}; }, narration: 'Function returns' },
      { line: 7, action: () => { localScopeName = 'increment()'; localScopeVisible = true; localVars = {}; }, narration: 'Call increment() again' },
      { line: 4, action: () => { globalVars.count = 2; }, narration: 'count = count + 1 → GLOBAL count is now 2' },
      { line: 7, action: () => { localScopeVisible = false; localVars = {}; }, narration: 'Function returns' },
      { line: 8, action: () => { outputText = '2'; }, narration: 'Print count → 2' },
    ],
  },
];

let currentExample = 0;
let currentStep = -1;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  stepBackButton = createButton('← Back');
  stepBackButton.position(10, drawHeight + 12);
  stepBackButton.mousePressed(doStepBack);

  stepFwdButton = createButton('Step →');
  stepFwdButton.position(80, drawHeight + 12);
  stepFwdButton.mousePressed(doStepForward);

  autoButton = createButton('Auto Play');
  autoButton.position(150, drawHeight + 12);
  autoButton.mousePressed(toggleAuto);

  resetButton = createButton('Reset');
  resetButton.position(230, drawHeight + 12);
  resetButton.mousePressed(doReset);

  exampleSelect = createSelect();
  exampleSelect.position(canvasWidth - 140, drawHeight + 14);
  for (let ex of examples) {
    exampleSelect.option(ex.label);
  }
  exampleSelect.changed(() => {
    for (let i = 0; i < examples.length; i++) {
      if (examples[i].label === exampleSelect.value()) {
        currentExample = i;
        doReset();
        break;
      }
    }
  });

  describe('Step-through code execution showing global and local variable scopes appearing and disappearing.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Variable Scope Visualizer', canvasWidth / 2, 8);

  let halfW = canvasWidth / 2;

  // Code panel
  drawCodePanel(margin, 34, halfW - margin - 10);

  // Scope panel
  drawScopePanel(halfW + 5, 34, halfW - margin - 10);

  // Narration bar
  drawNarration();

  // Output panel
  drawOutputPanel();

  // Auto play
  if (autoPlay) {
    autoTimer += deltaTime;
    if (autoTimer > 1500) {
      autoTimer = 0;
      doStepForward();
    }
  }

  // Fade animation for local scope
  if (localScopeVisible && localFadeAlpha < 255) {
    localFadeAlpha = Math.min(255, localFadeAlpha + 12);
  } else if (!localScopeVisible && localFadeAlpha > 0) {
    localFadeAlpha = Math.max(0, localFadeAlpha - 12);
  }
}

function drawCodePanel(x, y, w) {
  let ex = examples[currentExample];
  let h = ex.code.length * 22 + 30;

  fill(30, 30, 42);
  stroke(80);
  strokeWeight(1);
  rect(x, y, w, h, 8);

  // Header
  noStroke();
  fill(200);
  textAlign(LEFT, TOP);
  textSize(10);
  text('Python Code:', x + 8, y + 6);

  textFont('monospace');
  textSize(Math.min(12, canvasWidth * 0.025));
  let lineH = 22;

  let currentLineNum = -1;
  if (currentStep >= 0 && currentStep < ex.steps.length) {
    currentLineNum = ex.steps[currentStep].line;
  }

  for (let i = 0; i < ex.code.length; i++) {
    let ly = y + 22 + i * lineH;
    let line = ex.code[i];

    // Line highlight
    if (i === currentLineNum) {
      fill(255, 255, 100, 60);
      noStroke();
      rect(x + 4, ly - 1, w - 8, lineH, 3);
    }

    // Line number
    noStroke();
    fill(100);
    textAlign(RIGHT, TOP);
    text(i + 1, x + 22, ly);

    // Code with coloring
    textAlign(LEFT, TOP);
    let codeLine = line;

    if (codeLine.startsWith('def ')) {
      fill(70, 130, 220);
      text('def', x + 30, ly);
      fill(200);
      text(codeLine.substring(3), x + 30 + textWidth('def'), ly);
    } else if (codeLine.trimStart().startsWith('return')) {
      let indent = codeLine.length - codeLine.trimStart().length;
      fill(200);
      text(codeLine.substring(0, indent), x + 30, ly);
      fill(220, 60, 60);
      text('return', x + 30 + textWidth(codeLine.substring(0, indent)), ly);
      fill(200);
      text(codeLine.substring(indent + 6), x + 30 + textWidth(codeLine.substring(0, indent) + 'return'), ly);
    } else if (codeLine.trimStart().startsWith('global ')) {
      let indent = codeLine.length - codeLine.trimStart().length;
      fill(200);
      text(codeLine.substring(0, indent), x + 30, ly);
      fill(220, 60, 60);
      text('global', x + 30 + textWidth(codeLine.substring(0, indent)), ly);
      fill(200);
      text(codeLine.substring(indent + 6), x + 30 + textWidth(codeLine.substring(0, indent) + 'global'), ly);
    } else if (codeLine.trimStart().startsWith('print')) {
      let indent = codeLine.length - codeLine.trimStart().length;
      fill(200);
      text(codeLine.substring(0, indent), x + 30, ly);
      fill(100, 200, 100);
      text('print', x + 30 + textWidth(codeLine.substring(0, indent)), ly);
      fill(200);
      text(codeLine.substring(indent + 5), x + 30 + textWidth(codeLine.substring(0, indent) + 'print'), ly);
    } else {
      fill(200);
      text(codeLine, x + 30, ly);
    }
  }

  textFont('Arial');
}

function drawScopePanel(x, y, w) {
  let globalH = 100;
  let localH = 90;

  // Global scope box
  fill(235, 245, 255);
  stroke(70, 130, 220);
  strokeWeight(2);
  rect(x, y, w, globalH, 8);

  noStroke();
  fill(70, 130, 220);
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(BOLD);
  text('Global Scope', x + 10, y + 8);
  textStyle(NORMAL);

  // Global variables
  textFont('monospace');
  textSize(13);
  let gKeys = Object.keys(globalVars);
  let gy = y + 30;

  for (let i = 0; i < gKeys.length; i++) {
    let k = gKeys[i];
    let v = globalVars[k];

    fill(70, 130, 220);
    text(k, x + 15, gy + i * 22);
    fill(120);
    text(' = ', x + 15 + textWidth(k), gy + i * 22);

    let valStr = String(v);
    fill(typeof v === 'number' ? [40, 40, 180] : [40, 120, 40]);
    text(valStr, x + 15 + textWidth(k + ' = '), gy + i * 22);
  }

  if (gKeys.length === 0) {
    fill(180);
    textFont('Arial');
    textSize(11);
    text('(no variables yet)', x + 15, gy);
  }

  textFont('Arial');

  // Local scope box (with fade animation)
  let localY = y + globalH + 15;
  let alpha = localFadeAlpha;

  if (alpha > 0 || localScopeVisible) {
    fill(255, 240, 230, alpha);
    stroke(230, 150, 50, alpha);
    strokeWeight(2);
    rect(x, localY, w, localH, 8);

    noStroke();
    fill(230, 150, 50, alpha);
    textAlign(LEFT, TOP);
    textSize(12);
    textStyle(BOLD);
    text('Local Scope: ' + localScopeName, x + 10, localY + 8);
    textStyle(NORMAL);

    // Local variables
    textFont('monospace');
    textSize(13);
    let lKeys = Object.keys(localVars);
    let ly = localY + 30;

    for (let i = 0; i < lKeys.length; i++) {
      let k = lKeys[i];
      let v = localVars[k];

      fill(230, 150, 50, alpha);
      text(k, x + 15, ly + i * 22);
      fill(120, 120, 120, alpha);
      text(' = ', x + 15 + textWidth(k), ly + i * 22);

      let valStr = String(v);
      fill(typeof v === 'number' ? [40, 40, 180, alpha] : [40, 120, 40, alpha]);
      text(valStr, x + 15 + textWidth(k + ' = '), ly + i * 22);
    }

    if (lKeys.length === 0 && localScopeVisible) {
      fill(180, 180, 180, alpha);
      textFont('Arial');
      textSize(11);
      text('(entering function...)', x + 15, ly);
    }

    textFont('Arial');

    // Destroyed label when fading out
    if (!localScopeVisible && alpha > 0 && alpha < 200) {
      fill(220, 60, 60, 255 - alpha);
      textAlign(CENTER, CENTER);
      textSize(14);
      textStyle(BOLD);
      text('DESTROYED', x + w / 2, localY + localH / 2);
      textStyle(NORMAL);
    }
  } else {
    // Empty placeholder
    fill(245);
    stroke(220);
    strokeWeight(1);
    setLineDash([5, 5]);
    rect(x, localY, w, localH, 8);
    setLineDash([]);

    noStroke();
    fill(200);
    textAlign(CENTER, CENTER);
    textSize(11);
    text('(no local scope active)', x + w / 2, localY + localH / 2);
  }
}

function drawNarration() {
  let y = 320;
  let ex = examples[currentExample];

  fill(248, 248, 252);
  stroke(200);
  strokeWeight(1);
  rect(margin, y, canvasWidth - margin * 2, 40, 8);

  noStroke();
  if (currentStep >= 0 && currentStep < ex.steps.length) {
    fill(60);
    textAlign(CENTER, CENTER);
    textSize(12);
    text(ex.steps[currentStep].narration, canvasWidth / 2, y + 20);
  } else {
    fill(150);
    textAlign(CENTER, CENTER);
    textSize(12);
    text('Click "Step →" to begin execution', canvasWidth / 2, y + 20);
  }

  // Step indicator
  let maxSteps = ex.steps.length;
  let dotY = y + 50;

  noStroke();
  fill(120);
  textAlign(CENTER, TOP);
  textSize(10);
  text('Step ' + Math.max(0, currentStep + 1) + ' of ' + maxSteps, canvasWidth / 2, dotY);

  let dotR = 6;
  let totalDotsW = maxSteps * (dotR * 2 + 4);
  let startDotX = canvasWidth / 2 - totalDotsW / 2;

  for (let i = 0; i < maxSteps; i++) {
    let dx = startDotX + i * (dotR * 2 + 4) + dotR;
    let dy = dotY + 18;

    if (i <= currentStep) {
      fill(70, 130, 220);
    } else {
      fill(220);
    }
    noStroke();
    circle(dx, dy, dotR * 2);
  }
}

function drawOutputPanel() {
  let y = 415;

  fill(240, 255, 240);
  stroke(46, 160, 67);
  strokeWeight(1);
  rect(margin, y, canvasWidth - margin * 2, 50, 8);

  noStroke();
  fill(80);
  textAlign(LEFT, TOP);
  textSize(11);
  textStyle(BOLD);
  text('Console Output:', margin + 10, y + 6);
  textStyle(NORMAL);

  textFont('monospace');
  fill(30, 100, 30);
  textSize(13);
  if (outputText) {
    let lines = outputText.split('\n');
    for (let i = 0; i < lines.length; i++) {
      text('>>> ' + lines[i], margin + 10, y + 22 + i * 14);
    }
  } else {
    fill(180);
    textFont('Arial');
    textSize(11);
    text('(no output yet)', margin + 10, y + 24);
  }
  textFont('Arial');
}

function doStepForward() {
  let ex = examples[currentExample];
  if (currentStep < ex.steps.length - 1) {
    currentStep++;
    ex.steps[currentStep].action();
  } else {
    autoPlay = false;
    autoButton.html('Auto Play');
  }
}

function doStepBack() {
  if (currentStep <= 0) return;

  // Re-execute from beginning to currentStep - 1
  let targetStep = currentStep - 1;
  resetState();
  let ex = examples[currentExample];
  for (let i = 0; i <= targetStep; i++) {
    currentStep = i;
    ex.steps[i].action();
  }
}

function toggleAuto() {
  autoPlay = !autoPlay;
  autoTimer = 0;
  autoButton.html(autoPlay ? 'Pause' : 'Auto Play');
  if (autoPlay && currentStep >= examples[currentExample].steps.length - 1) {
    doReset();
  }
}

function doReset() {
  resetState();
  autoPlay = false;
  autoButton.html('Auto Play');
}

function resetState() {
  currentStep = -1;
  globalVars = {};
  localVars = {};
  localScopeName = '';
  localScopeVisible = false;
  localFadeAlpha = 0;
  outputText = '';
}

function setLineDash(pattern) {
  drawingContext.setLineDash(pattern);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  exampleSelect.position(canvasWidth - 140, drawHeight + 14);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
