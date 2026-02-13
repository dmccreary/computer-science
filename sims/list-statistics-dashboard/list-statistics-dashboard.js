// List Statistics Dashboard MicroSim
// Interactive dashboard showing len, min, max, sum, average with a bar chart

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Data
let numbers = [72, 68, 75, 80, 65, 71, 88, 55];
let hoveredBar = -1;

// Controls
let inputField;
let randomBtn, addBtn, removeBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Row 1: Input field
  inputField = createInput('72, 68, 75, 80, 65, 71, 88, 55');
  inputField.position(10, drawHeight + 8);
  inputField.size(canvasWidth - 30);
  inputField.attribute('placeholder', 'Enter comma-separated numbers');
  inputField.input(parseInput);

  // Row 2: Buttons
  randomBtn = createButton('Random List');
  randomBtn.position(10, drawHeight + 42);
  randomBtn.mousePressed(generateRandom);

  addBtn = createButton('Add Number');
  addBtn.position(105, drawHeight + 42);
  addBtn.mousePressed(addRandom);

  removeBtn = createButton('Remove Last');
  removeBtn.position(200, drawHeight + 42);
  removeBtn.mousePressed(removeLast);

  describe('Interactive list statistics dashboard showing bar chart with len, min, max, sum, and average calculations', LABEL);
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
  text('List Statistics Dashboard', canvasWidth / 2, 8);

  if (numbers.length === 0) {
    fill('#666');
    textAlign(CENTER, CENTER);
    textSize(16);
    text('Enter numbers or click "Random List"', canvasWidth / 2, 200);
    return;
  }

  // Calculate stats
  let stats = {
    len: numbers.length,
    min: Math.min(...numbers),
    max: Math.max(...numbers),
    sum: numbers.reduce((a, b) => a + b, 0),
    avg: numbers.reduce((a, b) => a + b, 0) / numbers.length
  };

  // Draw bar chart
  drawBarChart(stats);

  // Draw statistics panel
  drawStatsPanel(stats);

  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawBarChart(stats) {
  let chartX = margin + 40;
  let chartY = 45;
  let chartW = canvasWidth - chartX - margin - 140;
  let chartH = 220;
  let maxVal = stats.max * 1.15;
  let barGap = 4;
  let barW = Math.max(8, (chartW - barGap * (numbers.length - 1)) / numbers.length);

  // Chart background
  fill(255, 255, 255, 150);
  noStroke();
  rect(chartX, chartY, chartW, chartH);

  // Y-axis labels
  noStroke();
  fill('#888');
  textAlign(RIGHT, CENTER);
  textSize(10);
  for (let i = 0; i <= 4; i++) {
    let val = Math.round(maxVal * i / 4);
    let y = chartY + chartH - (chartH * i / 4);
    text(val, chartX - 5, y);
    stroke('#EEE');
    strokeWeight(0.5);
    line(chartX, y, chartX + chartW, y);
    noStroke();
  }

  // Bars
  hoveredBar = -1;
  for (let i = 0; i < numbers.length; i++) {
    let x = chartX + i * (barW + barGap);
    let barH = (numbers[i] / maxVal) * chartH;
    let y = chartY + chartH - barH;

    // Check hover
    if (mouseX >= x && mouseX <= x + barW && mouseY >= y && mouseY <= chartY + chartH) {
      hoveredBar = i;
    }

    // Color bars: min=blue, max=red, others=green
    if (numbers[i] === stats.min) {
      fill('#3498DB');
    } else if (numbers[i] === stats.max) {
      fill('#E74C3C');
    } else if (i === hoveredBar) {
      fill('#82E0AA');
    } else {
      fill('#82E0AA');
    }

    stroke(i === hoveredBar ? '#333' : 'transparent');
    strokeWeight(i === hoveredBar ? 2 : 0);
    rect(x, y, barW, barH, 2, 2, 0, 0);

    // Index below
    noStroke();
    fill('#888');
    textAlign(CENTER, TOP);
    textSize(9);
    text(i, x + barW / 2, chartY + chartH + 3);
  }

  // Average line
  let avgY = chartY + chartH - (stats.avg / maxVal) * chartH;
  stroke('#FF8C00');
  strokeWeight(2);
  drawingContext.setLineDash([6, 4]);
  line(chartX, avgY, chartX + chartW, avgY);
  drawingContext.setLineDash([]);

  // Average label
  noStroke();
  fill('#FF8C00');
  textAlign(LEFT, CENTER);
  textSize(11);
  text('avg: ' + stats.avg.toFixed(1), chartX + chartW + 5, avgY);

  // Hover tooltip
  if (hoveredBar >= 0) {
    let x = chartX + hoveredBar * (barW + barGap) + barW / 2;
    let barH = (numbers[hoveredBar] / maxVal) * chartH;
    let y = chartY + chartH - barH - 18;

    fill(40, 44, 52, 220);
    noStroke();
    rect(x - 25, y, 50, 18, 4);

    fill('white');
    textAlign(CENTER, CENTER);
    textSize(12);
    text(numbers[hoveredBar], x, y + 9);
  }
}

function drawStatsPanel(stats) {
  let panelX = canvasWidth - margin - 125;
  let panelY = 50;
  let panelW = 120;

  // Panel background
  fill(255, 255, 255, 230);
  stroke('#DDD');
  strokeWeight(1);
  rect(panelX, panelY, panelW, 195, 8);

  noStroke();
  textAlign(LEFT, TOP);
  textSize(13);

  let items = [
    { label: 'len()', value: stats.len, color: '#333' },
    { label: 'min()', value: stats.min, color: '#3498DB' },
    { label: 'max()', value: stats.max, color: '#E74C3C' },
    { label: 'sum()', value: stats.sum, color: '#333' },
    { label: 'average', value: stats.avg.toFixed(1), color: '#FF8C00' }
  ];

  // Title
  fill('#333');
  textSize(14);
  text('Statistics', panelX + 10, panelY + 8);

  // Divider
  stroke('#EEE');
  line(panelX + 8, panelY + 28, panelX + panelW - 8, panelY + 28);

  noStroke();
  for (let i = 0; i < items.length; i++) {
    let y = panelY + 35 + i * 32;

    // Label
    fill('#888');
    textSize(11);
    textFont('monospace');
    text(items[i].label, panelX + 10, y);
    textFont('sans-serif');

    // Value
    fill(items[i].color);
    textSize(16);
    text(items[i].value, panelX + 10, y + 13);
  }

  // Python code snippet below chart
  noStroke();
  fill('#555');
  textAlign(LEFT, TOP);
  textSize(11);
  textFont('monospace');
  let codeY = 290;
  text('nums = [' + numbers.slice(0, 5).join(', ') + (numbers.length > 5 ? ', ...' : '') + ']', margin, codeY);
  text('len(nums)  = ' + stats.len, margin, codeY + 16);
  text('min(nums)  = ' + stats.min, margin, codeY + 32);
  text('max(nums)  = ' + stats.max, margin, codeY + 48);
  text('sum(nums)  = ' + stats.sum, margin, codeY + 64);
  text('avg = sum/len = ' + stats.avg.toFixed(1), margin, codeY + 80);
  textFont('sans-serif');
}

function parseInput() {
  let val = inputField.value().trim();
  if (val === '') {
    numbers = [];
    return;
  }
  let parsed = val.split(',')
    .map(s => parseFloat(s.trim()))
    .filter(n => !isNaN(n));
  if (parsed.length > 0) {
    numbers = parsed;
  }
}

function generateRandom() {
  let count = Math.floor(Math.random() * 6) + 5;
  numbers = [];
  for (let i = 0; i < count; i++) {
    numbers.push(Math.floor(Math.random() * 100) + 1);
  }
  inputField.value(numbers.join(', '));
}

function addRandom() {
  let newNum = Math.floor(Math.random() * 100) + 1;
  numbers.push(newNum);
  inputField.value(numbers.join(', '));
}

function removeLast() {
  if (numbers.length > 0) {
    numbers.pop();
    inputField.value(numbers.join(', '));
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  inputField.size(canvasWidth - 30);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
