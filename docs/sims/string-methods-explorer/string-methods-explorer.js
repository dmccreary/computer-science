// String Methods Explorer MicroSim
// Interactive sandbox: select a method, see the result
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// Controls
let stringInput;
let runButton;

// State
let currentString = '  Hello, World!  ';
let selectedMethod = null;
let methodArg = '';
let result = null;
let resultType = '';
let history = [];

// Method definitions
let methods = {
  case: [
    { name: 'upper()', fn: s => s.toUpperCase(), args: false, cat: 'case' },
    { name: 'lower()', fn: s => s.toLowerCase(), args: false, cat: 'case' },
    { name: 'title()', fn: s => s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase()), args: false, cat: 'case' },
    { name: 'capitalize()', fn: s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(), args: false, cat: 'case' },
    { name: 'swapcase()', fn: s => s.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''), args: false, cat: 'case' },
  ],
  whitespace: [
    { name: 'strip()', fn: s => s.trim(), args: false, cat: 'whitespace' },
    { name: 'lstrip()', fn: s => s.replace(/^\s+/, ''), args: false, cat: 'whitespace' },
    { name: 'rstrip()', fn: s => s.replace(/\s+$/, ''), args: false, cat: 'whitespace' },
  ],
  search: [
    { name: 'find(sub)', fn: (s, a) => s.indexOf(a), args: true, argLabel: 'substring', argDefault: 'World', cat: 'search' },
    { name: 'replace(old,new)', fn: (s, a) => { let parts = a.split(','); return s.replace(new RegExp(escapeRegex(parts[0]), 'g'), parts[1] || ''); }, args: true, argLabel: 'old,new', argDefault: 'World,Python', cat: 'search' },
    { name: 'count(sub)', fn: (s, a) => (s.match(new RegExp(escapeRegex(a), 'g')) || []).length, args: true, argLabel: 'substring', argDefault: 'l', cat: 'search' },
    { name: 'startswith()', fn: (s, a) => s.startsWith(a), args: true, argLabel: 'prefix', argDefault: '  Hello', cat: 'search' },
    { name: 'endswith()', fn: (s, a) => s.endsWith(a), args: true, argLabel: 'suffix', argDefault: '!  ', cat: 'search' },
  ],
  split: [
    { name: 'split()', fn: s => JSON.stringify(s.trim().split(/\s+/)), args: false, cat: 'split' },
    { name: 'split(sep)', fn: (s, a) => JSON.stringify(s.split(a)), args: true, argLabel: 'separator', argDefault: ',', cat: 'split' },
  ],
  validate: [
    { name: 'isalpha()', fn: s => /^[a-zA-Z]+$/.test(s), args: false, cat: 'validate' },
    { name: 'isdigit()', fn: s => /^\d+$/.test(s), args: false, cat: 'validate' },
    { name: 'isalnum()', fn: s => /^[a-zA-Z0-9]+$/.test(s), args: false, cat: 'validate' },
    { name: 'isspace()', fn: s => /^\s+$/.test(s), args: false, cat: 'validate' },
    { name: 'isupper()', fn: s => s === s.toUpperCase() && /[a-zA-Z]/.test(s), args: false, cat: 'validate' },
    { name: 'islower()', fn: s => s === s.toLowerCase() && /[a-zA-Z]/.test(s), args: false, cat: 'validate' },
  ],
};

let catColors = {
  case: [70, 130, 220],
  whitespace: [46, 160, 67],
  search: [230, 150, 50],
  split: [160, 80, 200],
  validate: [200, 80, 120],
};

let catLabels = {
  case: 'Case',
  whitespace: 'Whitespace',
  search: 'Search',
  split: 'Split/Join',
  validate: 'Validation',
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  stringInput = createInput('  Hello, World!  ');
  stringInput.position(70, drawHeight + 12);
  stringInput.size(canvasWidth - 150);
  stringInput.input(() => {
    currentString = stringInput.value();
    result = null;
    selectedMethod = null;
  });

  runButton = createButton('Run');
  runButton.position(canvasWidth - 60, drawHeight + 10);
  runButton.mousePressed(runMethod);

  describe('Interactive string methods explorer. Select a method, see the result applied to your input string.', LABEL);
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
  text('String Methods Explorer', canvasWidth / 2, 8);

  // Input string display
  drawInputDisplay();

  // Method buttons
  drawMethodButtons();

  // Argument input area (if needed)
  drawArgInput();

  // Result display
  drawResult();

  // History
  drawHistory();

  // Control labels
  noStroke();
  fill(80);
  textAlign(LEFT, CENTER);
  textSize(11);
  text('String:', 10, drawHeight + 25);
}

function drawInputDisplay() {
  let y = 32;

  fill(248, 248, 252);
  stroke(200);
  strokeWeight(1);
  rect(margin, y, canvasWidth - margin * 2, 28, 6);

  noStroke();
  textFont('monospace');
  textAlign(CENTER, CENTER);
  textSize(13);
  fill(40, 40, 140);

  // Show whitespace as visible dots
  let displayStr = currentString.replace(/ /g, '·');
  text('"' + displayStr + '"', canvasWidth / 2, y + 14);
  textFont('Arial');
}

function drawMethodButtons() {
  let y = 68;
  let categories = ['case', 'whitespace', 'search', 'split', 'validate'];

  for (let cat of categories) {
    let col = catColors[cat];
    let methodList = methods[cat];

    // Category label
    noStroke();
    fill(col);
    textAlign(LEFT, TOP);
    textSize(10);
    textStyle(BOLD);
    text(catLabels[cat] + ':', margin, y);
    textStyle(NORMAL);

    // Buttons
    let bx = margin;
    let by = y + 14;
    textSize(10);

    for (let m of methodList) {
      let btnW = textWidth(m.name) + 14;
      let isSelected = (selectedMethod === m);
      let isHovered = mouseX > bx && mouseX < bx + btnW && mouseY > by && mouseY < by + 22;

      fill(isSelected ? [col[0], col[1], col[2], 60] : isHovered ? [240, 240, 255] : [250]);
      stroke(isSelected ? col : isHovered ? col : [200]);
      strokeWeight(isSelected ? 2 : 1);
      rect(bx, by, btnW, 22, 4);

      noStroke();
      fill(isSelected || isHovered ? col : [80]);
      textAlign(CENTER, CENTER);
      textSize(10);
      text(m.name, bx + btnW / 2, by + 11);

      bx += btnW + 4;
      if (bx + 60 > canvasWidth - margin) {
        bx = margin;
        by += 26;
      }
    }
    y = by + 28;
  }
}

function drawArgInput() {
  if (!selectedMethod || !selectedMethod.args) return;

  let y = 290;
  noStroke();
  fill(80);
  textAlign(LEFT, CENTER);
  textSize(12);
  text('Argument (' + selectedMethod.argLabel + '):', margin, y);

  // Simple display of current arg
  fill(248, 248, 252);
  stroke(200);
  strokeWeight(1);
  rect(margin + 150, y - 12, 120, 24, 4);

  noStroke();
  fill(40);
  textFont('monospace');
  textAlign(LEFT, CENTER);
  textSize(12);
  text(methodArg, margin + 155, y);
  textFont('Arial');
}

function drawResult() {
  if (result === null) return;

  let y = 325;

  fill(240, 255, 240);
  stroke(46, 160, 67);
  strokeWeight(2);
  rect(margin, y, canvasWidth - margin * 2, 55, 8);

  noStroke();
  fill(80);
  textAlign(LEFT, TOP);
  textSize(11);
  textStyle(BOLD);
  text('Result:', margin + 10, y + 6);
  textStyle(NORMAL);

  // Code line
  textFont('monospace');
  fill(40, 40, 140);
  textSize(11);
  let codeLine = '"' + currentString + '".' + selectedMethod.name;
  if (selectedMethod.args) {
    let displayName = selectedMethod.name.replace(')', '');
    codeLine = '"' + currentString + '".' + displayName + '"' + methodArg + '")';
  }
  if (codeLine.length > 50) codeLine = codeLine.substring(0, 47) + '...';
  text(codeLine, margin + 10, y + 22);

  // Result value
  fill(30, 100, 30);
  textSize(13);
  textStyle(BOLD);
  let displayResult = String(result);
  if (typeof result === 'string' && !displayResult.startsWith('[')) {
    displayResult = '"' + displayResult.replace(/ /g, '·') + '"';
  }
  if (displayResult.length > 60) displayResult = displayResult.substring(0, 57) + '...';
  text('→ ' + displayResult, margin + 10, y + 38);
  textStyle(NORMAL);
  textFont('Arial');
}

function drawHistory() {
  if (history.length === 0) return;

  let y = 390;
  let maxShow = Math.min(history.length, 3);

  noStroke();
  fill(100);
  textAlign(LEFT, TOP);
  textSize(10);
  textStyle(BOLD);
  text('History:', margin, y);
  textStyle(NORMAL);

  textFont('monospace');
  textSize(9);
  for (let i = 0; i < maxShow; i++) {
    let h = history[history.length - 1 - i];
    fill(120);
    text(h.method + ' → ' + h.result, margin + 50, y + i * 14);
  }
  textFont('Arial');
}

function mousePressed() {
  // Check method button clicks
  let y = 68;
  let categories = ['case', 'whitespace', 'search', 'split', 'validate'];

  for (let cat of categories) {
    let methodList = methods[cat];
    let bx = margin;
    let by = y + 14;
    textSize(10);

    for (let m of methodList) {
      let btnW = textWidth(m.name) + 14;

      if (mouseX > bx && mouseX < bx + btnW && mouseY > by && mouseY < by + 22) {
        selectedMethod = m;
        methodArg = m.argDefault || '';
        result = null;

        // Auto-run if no args needed
        if (!m.args) {
          runMethod();
        }
        return;
      }

      bx += btnW + 4;
      if (bx + 60 > canvasWidth - margin) {
        bx = margin;
        by += 26;
      }
    }
    y = by + 28;
  }
}

function keyPressed() {
  // Handle typing in the argument area
  if (selectedMethod && selectedMethod.args) {
    if (keyCode === BACKSPACE) {
      methodArg = methodArg.slice(0, -1);
    } else if (keyCode === ENTER) {
      runMethod();
    } else if (key.length === 1 && methodArg.length < 30) {
      methodArg += key;
    }
  }
}

function runMethod() {
  if (!selectedMethod) return;

  try {
    if (selectedMethod.args) {
      result = selectedMethod.fn(currentString, methodArg);
    } else {
      result = selectedMethod.fn(currentString);
    }
  } catch (e) {
    result = 'Error: ' + e.message;
  }

  // Add to history
  let histResult = String(result);
  if (histResult.length > 30) histResult = histResult.substring(0, 27) + '...';
  history.push({
    method: selectedMethod.name,
    result: histResult,
  });
  if (history.length > 10) history.shift();
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  stringInput.size(canvasWidth - 150);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
