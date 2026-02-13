// List Traversal Animator MicroSim
// Step-through animation of for loop execution over a list

let canvasWidth = 400;
let drawHeight = 430;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// List data
let fruits = ["apple", "banana", "cherry", "date"];

// Code examples
let examples = [
  {
    name: 'Basic for loop',
    code: [
      'fruits = ["apple", "banana", "cherry", "date"]',
      'for fruit in fruits:',
      '    print(fruit)'
    ],
    getOutput: function(i) { return fruits[i]; },
    getVars: function(i) { return { fruit: '"' + fruits[i] + '"' }; }
  },
  {
    name: 'With enumerate',
    code: [
      'fruits = ["apple", "banana", "cherry", "date"]',
      'for i, fruit in enumerate(fruits):',
      '    print(f"{i}: {fruit}")'
    ],
    getOutput: function(i) { return i + ': ' + fruits[i]; },
    getVars: function(i) { return { i: i, fruit: '"' + fruits[i] + '"' }; }
  },
  {
    name: 'With condition',
    code: [
      'fruits = ["apple", "banana", "cherry", "date"]',
      'for fruit in fruits:',
      '    if len(fruit) > 5:',
      '        print(fruit)'
    ],
    getOutput: function(i) { return fruits[i].length > 5 ? fruits[i] : null; },
    getVars: function(i) { return { fruit: '"' + fruits[i] + '"', 'len(fruit)': fruits[i].length }; }
  }
];

let currentExample = 0;
let currentStep = -1; // -1 means not started
let outputLines = [];
let isAutoPlaying = false;
let autoPlayTimer = 0;
let autoPlayInterval = 60; // frames between steps

// Controls
let stepBtn, autoBtn, resetBtn;
let exampleSelect;
let speedSlider;
let sliderLeftMargin = 200;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Row 1: Step, Auto Play, Reset, Example selector
  stepBtn = createButton('Step');
  stepBtn.position(10, drawHeight + 10);
  stepBtn.mousePressed(doStep);

  autoBtn = createButton('Auto Play');
  autoBtn.position(60, drawHeight + 10);
  autoBtn.mousePressed(toggleAutoPlay);

  resetBtn = createButton('Reset');
  resetBtn.position(140, drawHeight + 10);
  resetBtn.mousePressed(doReset);

  exampleSelect = createSelect();
  exampleSelect.position(200, drawHeight + 10);
  for (let i = 0; i < examples.length; i++) {
    exampleSelect.option(examples[i].name, i);
  }
  exampleSelect.changed(() => {
    currentExample = parseInt(exampleSelect.value());
    doReset();
  });

  speedSlider = createSlider(1, 5, 3, 1);
  speedSlider.position(sliderLeftMargin + 180, drawHeight + 10);
  speedSlider.size(canvasWidth - sliderLeftMargin - 180 - margin);

  describe('Animated step-through visualization of Python for loop traversal over a list', LABEL);
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
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(22);
  text('List Traversal Animator', canvasWidth / 2, 8);

  // Auto play logic
  autoPlayInterval = Math.max(20, 80 - speedSlider.value() * 15);
  if (isAutoPlaying) {
    autoPlayTimer++;
    if (autoPlayTimer >= autoPlayInterval) {
      autoPlayTimer = 0;
      if (currentStep < fruits.length - 1) {
        currentStep++;
      } else {
        isAutoPlaying = false;
        autoBtn.html('Auto Play');
      }
    }
  }

  let ex = examples[currentExample];
  let thirdWidth = canvasWidth / 3;

  // Draw three panels
  drawCodePanel(margin, 38, thirdWidth - margin, ex);
  drawListPanel(thirdWidth, 38, thirdWidth, ex);
  drawOutputPanel(thirdWidth * 2, 38, thirdWidth - margin, ex);
  drawVariablePanel(margin, 310, canvasWidth - 2 * margin, ex);

  // Speed label
  noStroke();
  fill('#666');
  textAlign(LEFT, CENTER);
  textSize(12);
  text('Speed: ' + speedSlider.value(), sliderLeftMargin + 140, drawHeight + 20);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawCodePanel(x, y, w, ex) {
  // Panel header
  noStroke();
  fill('#333');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Python Code', x, y);

  // Code background
  fill(40, 44, 52);
  stroke('#555');
  strokeWeight(1);
  rect(x, y + 18, w, ex.code.length * 22 + 10, 6);

  // Code lines
  noStroke();
  textSize(11);
  textFont('monospace');
  for (let i = 0; i < ex.code.length; i++) {
    let lineY = y + 26 + i * 22;

    // Highlight active line
    if (currentStep >= 0) {
      let activeLine;
      if (ex.code.length === 3) {
        activeLine = currentStep < fruits.length ? 2 : -1;
      } else {
        // Condition example
        activeLine = currentStep < fruits.length ? (fruits[currentStep].length > 5 ? 3 : 2) : -1;
      }
      if (i === activeLine || (i === 1 && currentStep < fruits.length)) {
        fill(255, 255, 0, 40);
        noStroke();
        rect(x + 2, lineY - 3, w - 4, 20, 3);
      }
    }

    fill(i === 0 ? '#ABB2BF' : '#61AFEF');
    noStroke();
    textAlign(LEFT, TOP);
    text(ex.code[i], x + 8, lineY);
  }
  textFont('sans-serif');
}

function drawListPanel(x, y, w) {
  // Panel header
  noStroke();
  fill('#333');
  textAlign(CENTER, TOP);
  textSize(13);
  text('List Elements', x + w / 2, y);

  // Draw list boxes vertically for better visibility
  let boxW = Math.min(80, w - 20);
  let boxH = 35;
  let gap = 5;
  let listStartX = x + (w - boxW) / 2;
  let listStartY = y + 22;

  for (let i = 0; i < fruits.length; i++) {
    let by = listStartY + i * (boxH + gap);
    let isCurrent = (i === currentStep);
    let isPast = (i < currentStep);

    // Box
    if (isCurrent) {
      fill('#FFD700');
      stroke('#B8860B');
      strokeWeight(2);
    } else if (isPast) {
      fill('#D4EDDA');
      stroke('#999');
      strokeWeight(1);
    } else {
      fill('#E8E8E8');
      stroke('#CCC');
      strokeWeight(1);
    }
    rect(listStartX, by, boxW, boxH, 6);

    // Arrow pointer for current
    if (isCurrent) {
      fill('#CC6600');
      noStroke();
      triangle(listStartX - 15, by + boxH / 2,
               listStartX - 5, by + boxH / 2 - 8,
               listStartX - 5, by + boxH / 2 + 8);
    }

    // Index
    noStroke();
    fill('#888');
    textAlign(RIGHT, CENTER);
    textSize(11);
    text('[' + i + ']', listStartX - 18, by + boxH / 2);

    // Value
    fill(isCurrent ? '#333' : '#555');
    textAlign(CENTER, CENTER);
    textSize(13);
    text('"' + fruits[i] + '"', listStartX + boxW / 2, by + boxH / 2);
  }
}

function drawOutputPanel(x, y, w, ex) {
  // Panel header
  noStroke();
  fill('#333');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Output Console', x, y);

  // Console background
  fill(0, 20, 0);
  stroke('#333');
  strokeWeight(1);
  rect(x, y + 18, w, 150, 6);

  // Output lines
  noStroke();
  fill('#33FF33');
  textSize(12);
  textFont('monospace');
  textAlign(LEFT, TOP);

  // Build output up to current step
  let lines = [];
  for (let i = 0; i <= currentStep && i < fruits.length; i++) {
    let out = ex.getOutput(i);
    if (out !== null) {
      lines.push(out);
    }
  }

  for (let i = 0; i < lines.length; i++) {
    text('>>> ' + lines[i], x + 8, y + 26 + i * 18);
  }

  // Cursor
  if (currentStep < fruits.length - 1 || currentStep === -1) {
    let cursorY = y + 26 + lines.length * 18;
    if (frameCount % 40 < 20) {
      fill('#33FF33');
      rect(x + 8, cursorY, 8, 14);
    }
  }
  textFont('sans-serif');
}

function drawVariablePanel(x, y, w, ex) {
  // Panel header
  noStroke();
  fill('#333');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Variable Watch', x, y);

  // Background
  fill(250, 250, 255);
  stroke('#DDD');
  strokeWeight(1);
  rect(x, y + 18, w, 80, 6);

  if (currentStep >= 0 && currentStep < fruits.length) {
    let vars = ex.getVars(currentStep);
    let keys = Object.keys(vars);
    noStroke();
    textSize(14);
    textFont('monospace');

    let col = 0;
    let colWidth = w / Math.max(keys.length, 1);
    for (let key of keys) {
      let vx = x + 12 + col * colWidth;

      // Variable name
      fill('#0066CC');
      textAlign(LEFT, TOP);
      text(key, vx, y + 28);

      // Value
      fill('#333');
      text('= ' + vars[key], vx, y + 48);

      // Iteration indicator
      fill('#888');
      textSize(11);
      text('(iteration ' + (currentStep + 1) + ' of ' + fruits.length + ')', vx, y + 68);
      textSize(14);

      col++;
    }
    textFont('sans-serif');
  } else {
    noStroke();
    fill('#999');
    textAlign(CENTER, CENTER);
    textSize(13);
    text('Click "Step" or "Auto Play" to begin', x + w / 2, y + 55);
  }
}

function doStep() {
  if (currentStep < fruits.length - 1) {
    currentStep++;
  }
}

function toggleAutoPlay() {
  isAutoPlaying = !isAutoPlaying;
  autoBtn.html(isAutoPlaying ? 'Pause' : 'Auto Play');
  autoPlayTimer = 0;
}

function doReset() {
  currentStep = -1;
  isAutoPlaying = false;
  autoBtn.html('Auto Play');
  autoPlayTimer = 0;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  speedSlider.size(canvasWidth - sliderLeftMargin - 180 - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
