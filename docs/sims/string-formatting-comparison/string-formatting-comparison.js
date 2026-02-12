// String Formatting Comparison MicroSim
// Side-by-side comparison of f-string and .format() approaches
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 400;
let drawHeight = 430;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// Controls
let nameInput, ageInput, scoreInput;
let exampleSelect;

// State
let varName = 'Alice';
let varAge = '16';
let varScore = '95.5';
let currentExample = 0;

let examples = [
  { label: 'Greeting', template: 'Hello {name}, age {age}!' },
  { label: 'Score report', template: '{name} scored {score} points' },
  { label: 'Name badge', template: 'Hi, my name is {name}' },
  { label: 'All vars', template: '{name}, {age} years old, score: {score}' },
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  nameInput = createInput('Alice');
  nameInput.position(80, drawHeight + 12);
  nameInput.size(70);
  nameInput.input(() => { varName = nameInput.value(); });

  ageInput = createInput('16');
  ageInput.position(195, drawHeight + 12);
  ageInput.size(35);
  ageInput.input(() => { varAge = ageInput.value(); });

  scoreInput = createInput('95.5');
  scoreInput.position(285, drawHeight + 12);
  scoreInput.size(45);
  scoreInput.input(() => { varScore = scoreInput.value(); });

  exampleSelect = createSelect();
  exampleSelect.position(canvasWidth - 120, drawHeight + 12);
  for (let ex of examples) {
    exampleSelect.option(ex.label);
  }
  exampleSelect.changed(() => {
    for (let i = 0; i < examples.length; i++) {
      if (examples[i].label === exampleSelect.value()) {
        currentExample = i;
        break;
      }
    }
  });

  describe('Side-by-side comparison of f-string and .format() string formatting in Python with editable variables.', LABEL);
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
  text('String Formatting Comparison', canvasWidth / 2, 8);

  // Variables display
  drawVariables();

  // Two columns
  let halfW = canvasWidth / 2;
  let colTop = 115;

  // Divider
  stroke(220);
  strokeWeight(1);
  line(halfW, colTop - 5, halfW, drawHeight - 60);

  // f-string column
  drawFStringColumn(margin, colTop, halfW - margin - 5);

  // .format() column
  drawFormatColumn(halfW + 5, colTop, halfW - margin - 5);

  // Equals sign
  noStroke();
  fill(100);
  textAlign(CENTER, CENTER);
  textSize(24);
  text('=', halfW, colTop + 85);

  // Output display
  drawOutput();

  // Control labels
  noStroke();
  fill(80);
  textAlign(LEFT, CENTER);
  textSize(11);
  text('name:', 10, drawHeight + 25);
  text('age:', 163, drawHeight + 25);
  text('score:', 245, drawHeight + 25);
}

function drawVariables() {
  let y = 35;

  fill(248, 248, 252);
  stroke(200);
  strokeWeight(1);
  rect(margin, y, canvasWidth - margin * 2, 65, 8);

  noStroke();
  fill(80);
  textAlign(LEFT, TOP);
  textSize(11);
  textStyle(BOLD);
  text('Variables:', margin + 10, y + 6);
  textStyle(NORMAL);

  textFont('monospace');
  textSize(13);

  // Name variable
  fill(180, 100, 40);
  text('name', margin + 10, y + 24);
  fill(80);
  text(' = ', margin + 48, y + 24);
  fill(40, 120, 40);
  text('"' + varName + '"', margin + 70, y + 24);

  // Age variable
  let col2 = canvasWidth * 0.35;
  fill(180, 100, 40);
  text('age', col2, y + 24);
  fill(80);
  text(' = ', col2 + 30, y + 24);
  fill(40, 40, 180);
  text(varAge, col2 + 52, y + 24);

  // Score variable
  let col3 = canvasWidth * 0.65;
  fill(180, 100, 40);
  text('score', col3, y + 24);
  fill(80);
  text(' = ', col3 + 45, y + 24);
  fill(40, 40, 180);
  text(varScore, col3 + 67, y + 24);

  textFont('Arial');
}

function drawFStringColumn(x, y, w) {
  // Header
  noStroke();
  fill(70, 130, 220);
  textAlign(CENTER, TOP);
  textSize(14);
  textStyle(BOLD);
  text('f-string', x + w / 2, y);
  textStyle(NORMAL);

  // Code box
  let codeY = y + 22;
  fill(30, 30, 42);
  stroke(80);
  strokeWeight(1);
  rect(x, codeY, w, 55, 6);

  // Build f-string code
  let template = examples[currentExample].template;
  let fCode = 'f"' + template + '"';

  noStroke();
  textFont('monospace');
  textSize(11);
  textAlign(LEFT, TOP);

  // Render with colored parts
  let tx = x + 8;
  let ty = codeY + 8;

  fill(200, 200, 255);
  text('f', tx, ty);
  tx += textWidth('f');
  fill(200, 200, 200);
  text('"', tx, ty);
  tx += textWidth('"');

  // Parse template and colorize {var} portions
  let parts = template.split(/(\{[^}]+\})/);
  for (let part of parts) {
    if (part.startsWith('{') && part.endsWith('}')) {
      fill(255, 200, 80);
      text(part, tx, ty);
    } else {
      fill(200, 220, 200);
      text(part, tx, ty);
    }
    tx += textWidth(part);
    if (tx > x + w - 15) {
      tx = x + 8;
      ty += 16;
    }
  }
  fill(200, 200, 200);
  text('"', tx, ty);

  textFont('Arial');

  // Description
  noStroke();
  fill(100);
  textAlign(CENTER, TOP);
  textSize(10);
  text('Variables inside { } are replaced', x + w / 2, codeY + 60);
  text('directly in the string', x + w / 2, codeY + 72);
}

function drawFormatColumn(x, y, w) {
  // Header
  noStroke();
  fill(46, 160, 67);
  textAlign(CENTER, TOP);
  textSize(14);
  textStyle(BOLD);
  text('.format()', x + w / 2, y);
  textStyle(NORMAL);

  // Code box
  let codeY = y + 22;
  fill(30, 30, 42);
  stroke(80);
  strokeWeight(1);
  rect(x, codeY, w, 55, 6);

  // Build .format() code
  let template = examples[currentExample].template;

  // Replace {name} with {0}, {age} with {1}, {score} with {2} for positional
  let formatTemplate = template;
  let args = [];
  if (template.includes('{name}')) args.push(varName);
  if (template.includes('{age}')) args.push(varAge);
  if (template.includes('{score}')) args.push(varScore);

  noStroke();
  textFont('monospace');
  textSize(11);
  textAlign(LEFT, TOP);

  let tx = x + 8;
  let ty = codeY + 8;

  fill(200, 200, 200);
  text('"', tx, ty);
  tx += textWidth('"');

  let parts = template.split(/(\{[^}]+\})/);
  for (let part of parts) {
    if (part.startsWith('{') && part.endsWith('}')) {
      fill(255, 200, 80);
      text(part, tx, ty);
    } else {
      fill(200, 220, 200);
      text(part, tx, ty);
    }
    tx += textWidth(part);
    if (tx > x + w - 15) {
      tx = x + 8;
      ty += 16;
    }
  }

  fill(200, 200, 200);
  text('"', tx, ty);
  tx += textWidth('"');

  // .format(...)
  fill(150, 200, 255);
  let formatArgs = '.format(';
  formatArgs += args.map((a, i) => {
    let isNum = !isNaN(a) && a !== '';
    return isNum ? a : '"' + a + '"';
  }).join(', ');
  formatArgs += ')';

  if (tx + textWidth(formatArgs) > x + w - 5) {
    tx = x + 8;
    ty += 16;
  }
  text(formatArgs, tx, ty);

  textFont('Arial');

  // Description
  noStroke();
  fill(100);
  textAlign(CENTER, TOP);
  textSize(10);
  text('Arguments passed to .format()', x + w / 2, codeY + 60);
  text('fill in the { } placeholders', x + w / 2, codeY + 72);
}

function drawOutput() {
  let y = 310;

  // Compute output
  let template = examples[currentExample].template;
  let output = template
    .replace(/\{name\}/g, varName)
    .replace(/\{age\}/g, varAge)
    .replace(/\{score\}/g, varScore);

  // Output box
  fill(240, 255, 240);
  stroke(46, 160, 67);
  strokeWeight(2);
  rectMode(CENTER);
  rect(canvasWidth / 2, y, canvasWidth - margin * 2, 40, 8);
  rectMode(CORNER);

  noStroke();
  fill(40);
  textAlign(CENTER, TOP);
  textSize(11);
  text('Output:', canvasWidth / 2, y - 30);

  fill(30, 80, 30);
  textSize(16);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(output, canvasWidth / 2, y);
  textStyle(NORMAL);

  // Both produce the same result note
  noStroke();
  fill(150);
  textSize(11);
  textAlign(CENTER, TOP);
  text('Both approaches produce the same result!', canvasWidth / 2, y + 28);

  // Tip
  fill(70, 130, 220);
  textSize(11);
  textAlign(CENTER, TOP);
  text('Tip: f-strings are shorter and easier to read', canvasWidth / 2, y + 45);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
