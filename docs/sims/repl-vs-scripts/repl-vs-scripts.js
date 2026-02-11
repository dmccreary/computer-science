// REPL vs. Scripts MicroSim
// Bloom Level: Understand (L2) - compare, distinguish
// Students compare interactive REPL mode with script execution mode.

let canvasWidth = 400;
let drawHeight = 560;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// ---- REPL state ----
let replInput;          // p5 input element for the REPL prompt
let replHistory = [];   // array of { cmd, result } objects
let maxReplHistory = 6; // max visible lines in the REPL panel

// ---- Script state ----
let currentExampleIndex = 0;
let scriptRunning = false;
let scriptStepIndex = -1;     // which line is currently highlighted (-1 = not running)
let scriptOutput = [];         // accumulated output strings
let scriptStepTimer = 0;      // millis timestamp of last step
let scriptStepDelay = 600;    // ms between steps

// ---- Controls ----
let switchExampleBtn, runScriptBtn;

// ---- Example scripts ----
// Each example has lines of code and expected outputs per line (null = no output)
let examples = [
  {
    title: 'Hello World',
    lines: [
      'name = "Monty"',
      'greeting = "Hello, "',
      'message = greeting + name',
      'print(message)'
    ],
    outputs: [null, null, null, 'Hello, Monty']
  },
  {
    title: 'Simple Math',
    lines: [
      'width = 8',
      'height = 5',
      'area = width * height',
      'print("Area:", area)',
      'half = area / 2',
      'print("Half:", half)'
    ],
    outputs: [null, null, null, 'Area: 40', null, 'Half: 20.0']
  },
  {
    title: 'Countdown',
    lines: [
      'for i in range(3, 0, -1):',
      '    print(i)',
      'print("Go!")'
    ],
    outputs: [null, '3\n2\n1', 'Go!']
  }
];

// ---- REPL expression mapping ----
// Maps typed expressions to their "Python" results
let replMap = {
  '2 + 3':        '5',
  '2+3':          '5',
  '7 * 8':        '56',
  '7*8':          '56',
  '10 / 3':       '3.3333333333333335',
  '10/3':         '3.3333333333333335',
  '10 // 3':      '3',
  '10//3':        '3',
  '2 ** 10':      '1024',
  '2**10':        '1024',
  '"hello"':      "'hello'",
  "'hello'":      "'hello'",
  '"Hello" + " World"': "'Hello World'",
  "'Hello' + ' World'": "'Hello World'",
  'len("hello")': '5',
  "len('hello')": '5',
  'len("Python")':'6',
  "len('Python')":'6',
  'type(42)':     "<class 'int'>",
  'type(3.14)':   "<class 'float'>",
  'type("hi")':   "<class 'str'>",
  "type('hi')":   "<class 'str'>",
  'True':         'True',
  'False':        'False',
  'True and False':'False',
  'True or False': 'True',
  'not True':     'False',
  '5 > 3':        'True',
  '5 < 3':        'False',
  '5 == 5':       'True',
  '5 != 3':       'True',
  'abs(-7)':      '7',
  'max(3, 9)':    '9',
  'min(3, 9)':    '3',
  'round(3.7)':   '4',
  'list(range(5))': '[0, 1, 2, 3, 4]',
  '"hello".upper()': "'HELLO'",
  "'hello'.upper()": "'HELLO'",
  'print("hi")':  'hi',
  "print('hi')":  'hi',
  '1 + 1':        '2',
  '1+1':          '2',
  '100 - 37':     '63',
  '100-37':       '63',
  '42':           '42',
  '3.14':         '3.14',
};

// Helpful hints shown when input is empty
let replHints = [
  'Try: 2 + 3',
  'Try: "hello".upper()',
  'Try: len("Python")',
  'Try: 5 > 3',
  'Try: type(42)',
  'Try: 2 ** 10'
];
let currentHintIndex = 0;

function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    canvasWidth = Math.min(mainEl.offsetWidth, 900);
    canvasWidth = Math.max(canvasWidth, 400);
  }
  canvasHeight = drawHeight + controlHeight;
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Courier New, monospace');

  // REPL input field - positioned below the draw area
  replInput = createInput('');
  replInput.parent(document.querySelector('main'));
  replInput.attribute('placeholder', replHints[0]);
  replInput.style('font-family', 'Courier New, monospace');
  replInput.style('font-size', '14px');
  replInput.style('padding', '4px 6px');
  replInput.style('border', '1px solid #666');
  replInput.style('background', '#1e1e1e');
  replInput.style('color', '#00ff88');
  replInput.style('outline', 'none');

  // Handle Enter key in REPL input
  replInput.elt.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      submitReplCommand();
    }
  });

  // Run Script button
  runScriptBtn = createButton('Run Script');
  runScriptBtn.parent(document.querySelector('main'));
  runScriptBtn.mousePressed(startScriptRun);
  runScriptBtn.style('font-size', '14px');
  runScriptBtn.style('padding', '5px 14px');
  runScriptBtn.style('cursor', 'pointer');
  runScriptBtn.style('background', '#4CAF50');
  runScriptBtn.style('color', 'white');
  runScriptBtn.style('border', '1px solid #388E3C');
  runScriptBtn.style('border-radius', '4px');

  // Switch Example button
  switchExampleBtn = createButton('Switch Example');
  switchExampleBtn.parent(document.querySelector('main'));
  switchExampleBtn.mousePressed(cycleExample);
  switchExampleBtn.style('font-size', '14px');
  switchExampleBtn.style('padding', '5px 14px');
  switchExampleBtn.style('cursor', 'pointer');
  switchExampleBtn.style('border-radius', '4px');

  positionControls();

  describe('Interactive comparison of Python REPL and Script modes. Left side shows a simulated REPL terminal. Right side shows script execution with a Run button.', LABEL);
}

function positionControls() {
  let halfW = canvasWidth / 2;

  // REPL input sits inside the left panel near the bottom of draw area
  let inputY = drawHeight - 38;
  let inputX = 12;
  let inputW = halfW - 28;
  replInput.position(inputX, inputY);
  replInput.style('width', inputW + 'px');

  // Run and Switch buttons in the control bar
  let btnY = drawHeight + 12;
  runScriptBtn.position(halfW + 10, btnY);
  switchExampleBtn.position(halfW + 120, btnY);
}

function draw() {
  updateCanvasSize();

  // Main draw area background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('white');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  let halfW = canvasWidth / 2;

  // ---- Title ----
  noStroke();
  fill(40);
  textSize(Math.max(20, canvasWidth * 0.032));
  textAlign(CENTER, TOP);
  textFont('Arial');
  text('REPL vs. Script Mode', canvasWidth / 2, 8);
  textFont('Courier New, monospace');

  // ---- Left Panel: REPL ----
  drawReplPanel(0, 40, halfW, drawHeight - 40);

  // ---- Right Panel: Script ----
  drawScriptPanel(halfW, 40, halfW, drawHeight - 40);

  // ---- Divider line ----
  stroke(180);
  strokeWeight(2);
  line(halfW, 38, halfW, drawHeight);

  // ---- Comparison summary at bottom of draw area ----
  drawComparisonSummary();

  // ---- Script step animation ----
  if (scriptRunning && scriptStepIndex < getCurrentExample().lines.length) {
    if (millis() - scriptStepTimer > scriptStepDelay) {
      executeScriptStep();
      scriptStepTimer = millis();
    }
  }

  // Control area label
  noStroke();
  fill(80);
  textSize(13);
  textFont('Arial');
  textAlign(LEFT, CENTER);
  text('Type below, press Enter', 12, drawHeight + controlHeight / 2);
  textFont('Courier New, monospace');
}

// ==================== REPL PANEL ====================

function drawReplPanel(x, y, w, h) {
  // Dark terminal background
  noStroke();
  fill(30, 30, 36);
  rect(x + 4, y, w - 8, h - 50, 6);

  // Panel header
  fill(50, 50, 60);
  rect(x + 4, y, w - 8, 28, 6, 6, 0, 0);
  noStroke();
  fill(180, 220, 255);
  textSize(Math.max(14, canvasWidth * 0.022));
  textAlign(CENTER, CENTER);
  textFont('Arial');
  text('REPL (Interactive Mode)', x + w / 2, y + 14);
  textFont('Courier New, monospace');

  // Terminal dots decoration
  fill(255, 95, 86);
  ellipse(x + 18, y + 14, 10, 10);
  fill(255, 189, 46);
  ellipse(x + 32, y + 14, 10, 10);
  fill(39, 201, 63);
  ellipse(x + 46, y + 14, 10, 10);

  // Draw REPL history
  let lineY = y + 40;
  let lineH = 18;
  let visibleStart = Math.max(0, replHistory.length - maxReplHistory);
  textSize(Math.max(13, Math.min(15, canvasWidth * 0.02)));
  textAlign(LEFT, TOP);

  for (let i = visibleStart; i < replHistory.length; i++) {
    let entry = replHistory[i];

    // Command line (green prompt)
    noStroke();
    fill(100, 200, 100);
    let cmdText = '>>> ' + entry.cmd;
    text(cmdText, x + 14, lineY);
    lineY += lineH;

    // Result line (white or red for errors)
    if (entry.result !== null && entry.result !== undefined) {
      let resultLines = entry.result.split('\n');
      for (let r = 0; r < resultLines.length; r++) {
        if (entry.isError) {
          fill(255, 100, 100);
        } else {
          fill(230, 230, 230);
        }
        text(resultLines[r], x + 14, lineY);
        lineY += lineH;
      }
    }

    // Stop drawing if we run out of space
    if (lineY > y + h - 80) break;
  }

  // Current prompt indicator (blinking cursor)
  fill(100, 200, 100);
  let promptY = Math.min(lineY, y + h - 80);
  text('>>> ', x + 14, promptY);

  // Blinking cursor
  if (frameCount % 40 < 25) {
    let cursorX = x + 14 + textWidth('>>> ') + textWidth(replInput.value());
    fill(0, 255, 136);
    rect(cursorX, promptY, 8, 15);
  }

  // Hint text when empty
  if (replHistory.length === 0 && replInput.value() === '') {
    fill(100, 100, 120);
    textSize(Math.max(12, canvasWidth * 0.018));
    textAlign(CENTER, TOP);
    text('Type a Python expression and press Enter!', x + w / 2, y + h - 95);
    text(replHints[currentHintIndex], x + w / 2, y + h - 78);
  }
}

function submitReplCommand() {
  let cmd = replInput.value().trim();
  if (cmd === '') return;

  let result = evaluateReplExpression(cmd);
  replHistory.push({ cmd: cmd, result: result.text, isError: result.isError });
  replInput.value('');

  // Cycle hint
  currentHintIndex = (currentHintIndex + 1) % replHints.length;
  replInput.attribute('placeholder', replHints[currentHintIndex]);

  // Keep history manageable
  if (replHistory.length > 50) {
    replHistory.shift();
  }
}

function evaluateReplExpression(expr) {
  // Check our mapping first
  if (replMap.hasOwnProperty(expr)) {
    return { text: replMap[expr], isError: false };
  }

  // Try to handle simple arithmetic with integers
  // Only allow safe characters: digits, spaces, +, -, *, /, (, ), .
  let safePattern = /^[\d\s+\-*/.()%]+$/;
  if (safePattern.test(expr)) {
    try {
      let val = Function('"use strict"; return (' + expr + ')')();
      if (typeof val === 'number' && isFinite(val)) {
        // Format like Python: integers show as integers, floats show decimal
        if (Number.isInteger(val)) {
          return { text: String(val), isError: false };
        } else {
          return { text: String(val), isError: false };
        }
      }
    } catch (e) {
      // Fall through to error
    }
  }

  // Handle print() with a simple string
  let printMatch = expr.match(/^print\(["'](.*)["']\)$/);
  if (printMatch) {
    return { text: printMatch[1], isError: false };
  }

  // Handle simple string expressions
  let strMatch = expr.match(/^["'](.*)["']$/);
  if (strMatch) {
    return { text: "'" + strMatch[1] + "'", isError: false };
  }

  // Variable assignment (no output in REPL for assignment)
  let assignMatch = expr.match(/^\w+\s*=\s*.+$/);
  if (assignMatch) {
    return { text: null, isError: false };
  }

  // Unknown expression
  return { text: "NameError: name '" + expr.split(/[^a-zA-Z_]/)[0] + "' is not defined", isError: true };
}

// ==================== SCRIPT PANEL ====================

function drawScriptPanel(x, y, w, h) {
  let example = getCurrentExample();

  // Light editor background
  noStroke();
  fill(250, 250, 255);
  rect(x + 4, y, w - 8, h - 50, 6);

  // Panel header
  fill(235, 240, 250);
  stroke(200);
  strokeWeight(1);
  rect(x + 4, y, w - 8, 28, 6, 6, 0, 0);
  noStroke();
  fill(60, 80, 130);
  textSize(Math.max(14, canvasWidth * 0.022));
  textAlign(CENTER, CENTER);
  textFont('Arial');
  text('Script Mode: ' + example.title, x + w / 2, y + 14);
  textFont('Courier New, monospace');

  // File tab decoration
  fill(220, 225, 240);
  stroke(200);
  strokeWeight(1);
  rect(x + 10, y + 28, 100, 20, 4, 4, 0, 0);
  noStroke();
  fill(80);
  textSize(11);
  textAlign(LEFT, CENTER);
  text('script.py', x + 18, y + 38);

  // Code area
  let codeY = y + 56;
  let lineH = 22;
  textSize(Math.max(13, Math.min(15, canvasWidth * 0.02)));
  textAlign(LEFT, TOP);

  // Line number gutter
  for (let i = 0; i < example.lines.length; i++) {
    let ly = codeY + i * lineH;

    // Highlight current executing line
    if (scriptRunning && i === scriptStepIndex) {
      noStroke();
      fill(255, 255, 150, 200);
      rect(x + 8, ly - 2, w - 20, lineH, 3);
    } else if (scriptStepIndex > i && scriptStepIndex >= 0) {
      // Already executed lines get a subtle green tint
      noStroke();
      fill(220, 255, 220, 150);
      rect(x + 8, ly - 2, w - 20, lineH, 3);
    }

    // Line number
    noStroke();
    fill(160);
    textAlign(RIGHT, TOP);
    text((i + 1), x + 32, ly);

    // Code text
    fill(40);
    textAlign(LEFT, TOP);
    text(example.lines[i], x + 42, ly);
  }

  // Separator between code and output
  let outputStartY = codeY + example.lines.length * lineH + 15;
  stroke(200);
  strokeWeight(1);
  line(x + 10, outputStartY, x + w - 10, outputStartY);

  // Output label
  noStroke();
  fill(100);
  textSize(12);
  textFont('Arial');
  textAlign(LEFT, TOP);
  text('Output:', x + 14, outputStartY + 5);
  textFont('Courier New, monospace');

  // Output area (dark background for contrast)
  let outBoxY = outputStartY + 22;
  let outBoxH = h - (outBoxY - y) - 55;
  noStroke();
  fill(35, 35, 45);
  rect(x + 8, outBoxY, w - 20, outBoxH, 4);

  // Draw script output
  textSize(Math.max(13, Math.min(15, canvasWidth * 0.02)));
  textAlign(LEFT, TOP);
  let outY = outBoxY + 6;
  for (let i = 0; i < scriptOutput.length; i++) {
    let outLines = scriptOutput[i].split('\n');
    for (let j = 0; j < outLines.length; j++) {
      fill(180, 255, 180);
      text(outLines[j], x + 16, outY);
      outY += 17;
    }
  }

  // Show "Running..." or "Done" status
  if (scriptRunning) {
    noStroke();
    fill(255, 200, 50);
    textSize(13);
    textFont('Arial');
    textAlign(RIGHT, TOP);
    text('Running...', x + w - 14, outputStartY + 5);
    textFont('Courier New, monospace');
  } else if (scriptOutput.length > 0) {
    noStroke();
    fill(100, 220, 100);
    textSize(13);
    textFont('Arial');
    textAlign(RIGHT, TOP);
    text('Done', x + w - 14, outputStartY + 5);
    textFont('Courier New, monospace');
  }

  // Waiting prompt if not started
  if (!scriptRunning && scriptOutput.length === 0) {
    fill(120, 120, 140);
    textSize(Math.max(12, canvasWidth * 0.018));
    textAlign(CENTER, CENTER);
    text('Click "Run Script" to execute', x + w / 2, outBoxY + outBoxH / 2);
  }
}

function getCurrentExample() {
  return examples[currentExampleIndex];
}

function startScriptRun() {
  if (scriptRunning) return; // already running
  scriptOutput = [];
  scriptStepIndex = 0;
  scriptRunning = true;
  scriptStepTimer = millis();
}

function executeScriptStep() {
  let example = getCurrentExample();
  if (scriptStepIndex >= example.lines.length) {
    scriptRunning = false;
    return;
  }

  // If the current line has output, add it
  let output = example.outputs[scriptStepIndex];
  if (output !== null) {
    scriptOutput.push(output);
  }

  scriptStepIndex++;

  // Check if we just finished the last line
  if (scriptStepIndex >= example.lines.length) {
    scriptRunning = false;
  }
}

function cycleExample() {
  currentExampleIndex = (currentExampleIndex + 1) % examples.length;
  // Reset script state
  scriptRunning = false;
  scriptStepIndex = -1;
  scriptOutput = [];
}

// ==================== COMPARISON SUMMARY ====================

function drawComparisonSummary() {
  // Draw a compact comparison table at the bottom of the draw area
  let tableY = drawHeight - 100;
  let halfW = canvasWidth / 2;

  // Background for the comparison
  noStroke();
  fill(240, 243, 250);
  rect(4, tableY, canvasWidth - 8, 95, 6);

  // Header
  stroke(180);
  strokeWeight(1);
  line(10, tableY + 22, canvasWidth - 10, tableY + 22);

  noStroke();
  textFont('Arial');

  // Column headers
  fill(60);
  textSize(Math.max(13, canvasWidth * 0.02));
  textAlign(CENTER, TOP);
  text('Feature', canvasWidth * 0.15, tableY + 4);
  text('REPL', canvasWidth * 0.42, tableY + 4);
  text('Script', canvasWidth * 0.75, tableY + 4);

  // Vertical dividers
  stroke(200);
  line(canvasWidth * 0.28, tableY + 2, canvasWidth * 0.28, tableY + 93);
  line(canvasWidth * 0.58, tableY + 2, canvasWidth * 0.58, tableY + 93);

  // Table rows
  noStroke();
  let rowH = 18;
  let rowY = tableY + 28;
  let labelSize = Math.max(11, Math.min(13, canvasWidth * 0.018));
  textSize(labelSize);

  // Row 1: Execution
  fill(80);
  textAlign(RIGHT, TOP);
  text('Runs', canvasWidth * 0.26, rowY);
  fill(40, 80, 160);
  textAlign(CENTER, TOP);
  text('One line at a time', canvasWidth * 0.42, rowY);
  fill(0, 120, 60);
  text('All lines at once', canvasWidth * 0.75, rowY);

  // Row 2: Feedback
  rowY += rowH;
  fill(80);
  textAlign(RIGHT, TOP);
  text('Feedback', canvasWidth * 0.26, rowY);
  fill(40, 80, 160);
  textAlign(CENTER, TOP);
  text('Instant results', canvasWidth * 0.42, rowY);
  fill(0, 120, 60);
  text('After script finishes', canvasWidth * 0.75, rowY);

  // Row 3: Best for
  rowY += rowH;
  fill(80);
  textAlign(RIGHT, TOP);
  text('Best for', canvasWidth * 0.26, rowY);
  fill(40, 80, 160);
  textAlign(CENTER, TOP);
  text('Testing & exploring', canvasWidth * 0.42, rowY);
  fill(0, 120, 60);
  text('Saving & sharing code', canvasWidth * 0.75, rowY);

  // Row 4: Saved?
  rowY += rowH;
  fill(80);
  textAlign(RIGHT, TOP);
  text('Saved?', canvasWidth * 0.26, rowY);
  fill(40, 80, 160);
  textAlign(CENTER, TOP);
  text('No (temporary)', canvasWidth * 0.42, rowY);
  fill(0, 120, 60);
  text('Yes (in a .py file)', canvasWidth * 0.75, rowY);

  // Reset font
  textFont('Courier New, monospace');
}

// ==================== RESPONSIVE ====================

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}
