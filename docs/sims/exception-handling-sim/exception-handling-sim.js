// Exception Handling Simulator - Step-by-step Code Execution
// Predict what each line does in try-except-else-finally code
// Analyze (L4): predict, trace
// MicroSim template version 2026.02

let canvasWidth = 400;
let drawHeight = 520;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

// Scenarios
const SCENARIOS = [
  {
    title: 'Basic try-except',
    lines: [
      { code: 'try:', action: 'executes', output: null, block: 'try' },
      { code: '    x = int("hello")', action: 'raises', output: null, block: 'try' },
      { code: '    print("Success")', action: 'skipped', output: null, block: 'try' },
      { code: 'except ValueError:', action: 'executes', output: null, block: 'except' },
      { code: '    print("Bad value")', action: 'executes', output: 'Bad value', block: 'except' },
      { code: 'finally:', action: 'executes', output: null, block: 'finally' },
      { code: '    print("Done")', action: 'executes', output: 'Done', block: 'finally' }
    ]
  },
  {
    title: 'No exception (with else)',
    lines: [
      { code: 'try:', action: 'executes', output: null, block: 'try' },
      { code: '    x = int("42")', action: 'executes', output: null, block: 'try' },
      { code: '    print(f"Got {x}")', action: 'executes', output: 'Got 42', block: 'try' },
      { code: 'except ValueError:', action: 'skipped', output: null, block: 'except' },
      { code: '    print("Bad value")', action: 'skipped', output: null, block: 'except' },
      { code: 'else:', action: 'executes', output: null, block: 'else' },
      { code: '    print("No errors!")', action: 'executes', output: 'No errors!', block: 'else' },
      { code: 'finally:', action: 'executes', output: null, block: 'finally' },
      { code: '    print("Done")', action: 'executes', output: 'Done', block: 'finally' }
    ]
  },
  {
    title: 'Multiple except blocks',
    lines: [
      { code: 'data = {"name": "Alice"}', action: 'executes', output: null, block: 'setup' },
      { code: 'try:', action: 'executes', output: null, block: 'try' },
      { code: '    age = data["age"]', action: 'raises', output: null, block: 'try' },
      { code: '    result = 100 / age', action: 'skipped', output: null, block: 'try' },
      { code: 'except KeyError:', action: 'executes', output: null, block: 'except' },
      { code: '    print("Key missing")', action: 'executes', output: 'Key missing', block: 'except' },
      { code: 'except ZeroDivisionError:', action: 'skipped', output: null, block: 'except2' },
      { code: '    print("Divide by zero")', action: 'skipped', output: null, block: 'except2' }
    ]
  },
  {
    title: 'Raising exceptions',
    lines: [
      { code: 'def check_age(age):', action: 'executes', output: null, block: 'setup' },
      { code: '    if age < 0:', action: 'executes', output: null, block: 'setup' },
      { code: '        raise ValueError("Negative")', action: 'raises', output: null, block: 'setup' },
      { code: '    return age', action: 'skipped', output: null, block: 'setup' },
      { code: 'try:', action: 'executes', output: null, block: 'try' },
      { code: '    check_age(-5)', action: 'raises', output: null, block: 'try' },
      { code: 'except ValueError as e:', action: 'executes', output: null, block: 'except' },
      { code: '    print(f"Error: {e}")', action: 'executes', output: 'Error: Negative', block: 'except' }
    ]
  }
];

let currentScenario = 0;
let currentLine = -1;
let output = [];
let score = 0;
let attempts = 0;
let showPrediction = false;
let answered = false;
let lastAnswer = null;
let scenarioSelector;
let stepBtn, resetBtn;

// Prediction button positions
let predBtns = [
  { label: 'Executes normally', value: 'executes', x: 0, y: 0, w: 0, h: 28 },
  { label: 'Raises exception', value: 'raises', x: 0, y: 0, w: 0, h: 28 },
  { label: 'Skipped', value: 'skipped', x: 0, y: 0, w: 0, h: 28 }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  scenarioSelector = createSelect();
  for (let i = 0; i < SCENARIOS.length; i++) {
    scenarioSelector.option(SCENARIOS[i].title, i);
  }
  scenarioSelector.changed(() => {
    currentScenario = parseInt(scenarioSelector.value());
    resetScenario();
  });

  stepBtn = createButton('Step');
  stepBtn.mousePressed(step);

  resetBtn = createButton('Reset');
  resetBtn.mousePressed(resetScenario);

  describe('Exception Handling Simulator. Step through Python code and predict whether each line executes, raises an exception, or is skipped.', LABEL);
}

function resetScenario() {
  currentLine = -1;
  output = [];
  showPrediction = false;
  answered = false;
  lastAnswer = null;
}

function step() {
  if (showPrediction && !answered) return; // must answer first

  let scenario = SCENARIOS[currentScenario];

  if (currentLine >= scenario.lines.length - 1) {
    // Scenario complete
    return;
  }

  // Advance
  currentLine++;
  showPrediction = true;
  answered = false;
  lastAnswer = null;
}

function handlePrediction(value) {
  if (answered) return;
  answered = true;
  attempts++;

  let scenario = SCENARIOS[currentScenario];
  let line = scenario.lines[currentLine];
  lastAnswer = { chosen: value, correct: line.action };

  if (value === line.action) {
    score++;
  }

  // Add output if this line produces any
  if (line.action !== 'skipped' && line.output) {
    output.push(line.output);
  }
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
  text('Exception Handling Simulator', canvasWidth / 2, 6);

  // Score
  textAlign(RIGHT, TOP);
  textSize(12);
  fill(80);
  text('Correct: ' + score + '/' + attempts, canvasWidth - margin, 28);

  let scenario = SCENARIOS[currentScenario];

  // Code panel (left)
  let codeX = margin;
  let codeY = 44;
  let codeW = canvasWidth * 0.58;
  let codeH = scenario.lines.length * 22 + 20;

  fill(40, 44, 52);
  stroke(60);
  strokeWeight(1);
  rect(codeX, codeY, codeW, codeH, 6);

  // Line numbers and code
  let lineH = 22;
  let startLY = codeY + 10;

  for (let i = 0; i < scenario.lines.length; i++) {
    let ly = startLY + i * lineH;
    let line = scenario.lines[i];

    // Background highlight
    if (i === currentLine && !answered) {
      // Current line being predicted - yellow
      fill(100, 90, 30);
      noStroke();
      rect(codeX + 2, ly - 2, codeW - 4, lineH, 2);
    } else if (i <= currentLine && answered && i === currentLine) {
      // Just answered
      if (lastAnswer && lastAnswer.chosen === lastAnswer.correct) {
        fill(30, 80, 30);
      } else {
        fill(80, 30, 30);
      }
      noStroke();
      rect(codeX + 2, ly - 2, codeW - 4, lineH, 2);
    } else if (i < currentLine) {
      // Already executed
      let action = line.action;
      if (action === 'executes' || action === 'raises') {
        fill(30, 60, 30, 80);
      } else {
        fill(50, 50, 50, 80);
      }
      noStroke();
      rect(codeX + 2, ly - 2, codeW - 4, lineH, 2);
    }

    // Line number
    noStroke();
    fill(100);
    textAlign(RIGHT, TOP);
    textSize(10);
    text(i + 1, codeX + 22, ly);

    // Code text
    textAlign(LEFT, TOP);
    textFont('monospace');
    textSize(11);

    // Color based on state
    if (i <= currentLine) {
      let action = line.action;
      if (i === currentLine && !answered) {
        fill(255, 230, 100); // being predicted
      } else if (action === 'skipped') {
        fill(100, 100, 100); // gray for skipped
      } else if (action === 'raises') {
        fill(255, 120, 120); // red for raises
      } else {
        fill(120, 220, 120); // green for executed
      }
    } else {
      fill(180, 195, 220); // default code color
    }

    text(line.code, codeX + 28, ly);
    textFont('sans-serif');

    // Status icon for completed lines
    if (i < currentLine || (i === currentLine && answered)) {
      let action = line.action;
      textSize(10);
      if (action === 'executes') {
        fill(100, 200, 100);
        text('\u2713', codeX + codeW - 14, ly);
      } else if (action === 'raises') {
        fill(255, 100, 100);
        text('\u26A1', codeX + codeW - 14, ly);
      } else {
        fill(120);
        text('\u2014', codeX + codeW - 14, ly);
      }
    }
  }

  // Output panel (right)
  let outX = codeX + codeW + 8;
  let outW = canvasWidth - outX - margin;
  let outY = codeY;
  let outH = codeH;

  fill(30, 34, 42);
  stroke(60);
  strokeWeight(1);
  rect(outX, outY, outW, outH, 6);

  noStroke();
  fill(140);
  textAlign(LEFT, TOP);
  textSize(10);
  textStyle(BOLD);
  text('Output', outX + 8, outY + 5);
  textStyle(NORMAL);

  fill(180, 220, 180);
  textFont('monospace');
  textSize(11);
  for (let i = 0; i < output.length; i++) {
    text(output[i], outX + 8, outY + 22 + i * 16);
  }
  textFont('sans-serif');

  // Prediction area
  let predY = codeY + codeH + 12;

  if (showPrediction && !answered && currentLine >= 0) {
    fill(60);
    noStroke();
    textAlign(CENTER, TOP);
    textSize(14);
    textStyle(BOLD);
    text('What happens at this line?', canvasWidth / 2, predY);
    textStyle(NORMAL);

    // Prediction buttons
    let btnW = (canvasWidth - 4 * margin) / 3;
    let btnGap = margin / 2;
    let btnY = predY + 24;

    for (let i = 0; i < predBtns.length; i++) {
      let b = predBtns[i];
      b.x = margin + i * (btnW + btnGap);
      b.y = btnY;
      b.w = btnW;

      let isHover = mouseX > b.x && mouseX < b.x + b.w &&
                    mouseY > b.y && mouseY < b.y + b.h;

      let colors = {
        executes: [34, 139, 34],
        raises: [200, 60, 60],
        skipped: [130, 130, 130]
      };
      let c = colors[b.value];

      if (isHover) {
        fill(c[0], c[1], c[2]);
        stroke(c[0] - 20, c[1] - 20, c[2] - 20);
        strokeWeight(2);
        cursor(HAND);
      } else {
        fill(c[0] + 50, c[1] + 50, c[2] + 50);
        stroke(c[0], c[1], c[2]);
        strokeWeight(1);
      }
      rect(b.x, b.y, b.w, b.h, 6);

      noStroke();
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(11);
      textStyle(BOLD);
      text(b.label, b.x + b.w / 2, b.y + b.h / 2);
      textStyle(NORMAL);
    }
  }

  // Feedback after answering
  if (answered && lastAnswer) {
    let fbY = predY;
    let fbW = canvasWidth - 2 * margin;

    if (lastAnswer.chosen === lastAnswer.correct) {
      fill(220, 255, 220);
      stroke(0, 150, 0);
    } else {
      fill(255, 220, 220);
      stroke(200, 0, 0);
    }
    strokeWeight(2);
    rect(margin, fbY, fbW, 50, 6);

    noStroke();
    textAlign(LEFT, TOP);

    if (lastAnswer.chosen === lastAnswer.correct) {
      fill(0, 130, 0);
      textSize(13);
      textStyle(BOLD);
      text('Correct!', margin + 10, fbY + 6);
      textStyle(NORMAL);
    } else {
      fill(180, 0, 0);
      textSize(13);
      textStyle(BOLD);
      text('Not quite.', margin + 10, fbY + 6);
      textStyle(NORMAL);
    }

    fill(60);
    textSize(11);
    let actionLabels = { executes: 'executes normally', raises: 'raises an exception', skipped: 'is skipped' };
    text('This line ' + actionLabels[lastAnswer.correct] + '.', margin + 10, fbY + 26);

    // Prompt to click Step
    fill(100);
    textSize(10);
    textAlign(RIGHT, TOP);
    let scenario2 = SCENARIOS[currentScenario];
    if (currentLine < scenario2.lines.length - 1) {
      text('Click "Step" to continue', canvasWidth - margin - 10, fbY + 36);
    } else {
      text('Scenario complete! Try another.', canvasWidth - margin - 10, fbY + 36);
    }
  }

  // Initial instruction
  if (currentLine < 0) {
    fill(100);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(13);
    text('Click "Step" to start tracing through the code.', canvasWidth / 2, predY + 30);
  }

  // Legend
  let legY = drawHeight - 30;
  noStroke();
  textSize(10);
  textAlign(LEFT, CENTER);

  fill(120, 220, 120);
  ellipse(margin + 6, legY, 8, 8);
  fill(80);
  text('Executed', margin + 14, legY);

  fill(255, 120, 120);
  ellipse(margin + 75, legY, 8, 8);
  fill(80);
  text('Exception', margin + 83, legY);

  fill(120);
  ellipse(margin + 150, legY, 8, 8);
  fill(80);
  text('Skipped', margin + 158, legY);

  // Position controls
  scenarioSelector.position(margin, drawHeight + 14);
  stepBtn.position(canvasWidth * 0.6, drawHeight + 14);
  resetBtn.position(canvasWidth * 0.8, drawHeight + 14);
}

function mousePressed() {
  if (showPrediction && !answered && currentLine >= 0) {
    for (let b of predBtns) {
      if (mouseX > b.x && mouseX < b.x + b.w &&
          mouseY > b.y && mouseY < b.y + b.h) {
        handlePrediction(b.value);
        return;
      }
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
