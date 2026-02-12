// Range Function Explorer MicroSim
// Students adjust start, stop, step sliders and see the generated sequence on a number line
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 400;
let drawHeight = 350;
let controlHeight = 115;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 120;
let defaultTextSize = 16;

// Sliders
let startSlider, stopSlider, stepSlider;

// Challenge mode
let challengeButton;
let challengeActive = false;
let challengeTarget = [];
let challengeText = '';

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Row 1: Start slider
  startSlider = createSlider(-5, 15, 0, 1);
  startSlider.position(sliderLeftMargin, drawHeight + 5);
  startSlider.size(canvasWidth - sliderLeftMargin - margin);

  // Row 2: Stop slider
  stopSlider = createSlider(-5, 15, 5, 1);
  stopSlider.position(sliderLeftMargin, drawHeight + 38);
  stopSlider.size(canvasWidth - sliderLeftMargin - margin);

  // Row 3: Step slider
  stepSlider = createSlider(-5, 5, 1, 1);
  stepSlider.position(sliderLeftMargin, drawHeight + 71);
  stepSlider.size(canvasWidth - sliderLeftMargin - margin);

  challengeButton = createButton('Challenge');
  challengeButton.position(canvasWidth - 100, drawHeight + 88);
  challengeButton.mousePressed(newChallenge);

  describe('Interactive range function explorer with sliders for start, stop, and step parameters, displaying results on a number line.', LABEL);
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
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('Range Function Explorer', canvasWidth / 2, 10);

  // Get slider values
  let startVal = startSlider.value();
  let stopVal = stopSlider.value();
  let stepVal = stepSlider.value();

  // Generate range values
  let rangeValues = generateRange(startVal, stopVal, stepVal);

  // Draw number line
  drawNumberLine(rangeValues, startVal, stopVal);

  // Display Python code
  drawPythonCode(startVal, stopVal, stepVal, rangeValues);

  // Warning message
  if (stepVal === 0) {
    drawWarning('Step cannot be 0 (infinite loop!)');
  } else if (rangeValues.length === 0) {
    drawWarning('Empty range — no values generated');
  }

  // Challenge display
  if (challengeActive) {
    drawChallenge(rangeValues);
  }

  // Control labels
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(14);
  text('Start: ' + startVal, 10, drawHeight + 15);
  text('Stop: ' + stopVal, 10, drawHeight + 48);
  text('Step: ' + stepVal, 10, drawHeight + 81);
}

function generateRange(start, stop, step) {
  if (step === 0) return [];
  let result = [];
  if (step > 0) {
    for (let i = start; i < stop; i += step) {
      result.push(i);
      if (result.length > 30) break;
    }
  } else {
    for (let i = start; i > stop; i += step) {
      result.push(i);
      if (result.length > 30) break;
    }
  }
  return result;
}

function drawNumberLine(values, startVal, stopVal) {
  let lineY = 160;
  let lineLeft = 50;
  let lineRight = canvasWidth - 50;
  let lineW = lineRight - lineLeft;

  // Number range to display
  let minNum = -6;
  let maxNum = 16;
  let range = maxNum - minNum;

  // Draw the line
  stroke(180);
  strokeWeight(2);
  line(lineLeft, lineY, lineRight, lineY);

  // Draw tick marks and labels
  textAlign(CENTER, TOP);
  textSize(12);
  for (let i = minNum; i <= maxNum; i++) {
    let x = lineLeft + ((i - minNum) / range) * lineW;

    stroke(200);
    strokeWeight(1);
    line(x, lineY - 6, x, lineY + 6);

    noStroke();
    fill(160);
    text(i, x, lineY + 10);
  }

  // Highlight the stop value with a red dashed mark
  let stopX = lineLeft + ((stopVal - minNum) / range) * lineW;
  stroke(220, 60, 60, 150);
  strokeWeight(2);
  for (let dy = -15; dy < 15; dy += 6) {
    line(stopX, lineY + dy, stopX, lineY + dy + 3);
  }
  noStroke();
  fill(220, 60, 60);
  textSize(10);
  text('stop', stopX, lineY + 26);

  // Draw generated value dots
  for (let i = 0; i < values.length; i++) {
    let v = values[i];
    let x = lineLeft + ((v - minNum) / range) * lineW;

    // Dot
    noStroke();
    fill(46, 160, 67, 80);
    circle(x, lineY, 28);
    fill(46, 160, 67);
    circle(x, lineY, 16);

    // Value label above
    fill(30, 100, 40);
    textAlign(CENTER, BOTTOM);
    textSize(14);
    textStyle(BOLD);
    text(v, x, lineY - 18);
    textStyle(NORMAL);

    // Index label below
    fill(100);
    textAlign(CENTER, TOP);
    textSize(10);
    text('[' + i + ']', x, lineY + 38);
  }
}

function drawPythonCode(startVal, stopVal, stepVal, values) {
  let codeY = 230;
  let codeX = canvasWidth / 2;

  // Code background
  fill(245, 245, 252);
  stroke(200);
  strokeWeight(1);
  rectMode(CENTER);
  rect(codeX, codeY, canvasWidth - 60, 42, 6);
  rectMode(CORNER);

  noStroke();
  textFont('monospace');
  textAlign(CENTER, CENTER);

  // Python code
  fill(40, 40, 140);
  textSize(16);
  let codeStr;
  if (stepVal === 1) {
    if (startVal === 0) {
      codeStr = 'range(' + stopVal + ')';
    } else {
      codeStr = 'range(' + startVal + ', ' + stopVal + ')';
    }
  } else {
    codeStr = 'range(' + startVal + ', ' + stopVal + ', ' + stepVal + ')';
  }
  text(codeStr, codeX, codeY - 8);

  // Result list
  fill(80);
  textSize(13);
  let listStr = '[' + values.join(', ') + ']';
  if (listStr.length > 50) listStr = listStr.substring(0, 47) + '...]';
  text(listStr, codeX, codeY + 10);

  textFont('Arial');

  // Count display
  noStroke();
  fill(100);
  textAlign(CENTER, TOP);
  textSize(13);
  text(values.length + ' value' + (values.length !== 1 ? 's' : '') + ' generated', codeX, codeY + 30);
}

function drawWarning(msg) {
  let wy = 290;
  fill(255, 240, 240);
  stroke(220, 100, 100);
  strokeWeight(1);
  rectMode(CENTER);
  rect(canvasWidth / 2, wy, textWidth(msg) + 30, 28, 5);
  rectMode(CORNER);
  noStroke();
  fill(180, 40, 40);
  textAlign(CENTER, CENTER);
  textSize(13);
  text(msg, canvasWidth / 2, wy);
}

function drawChallenge(currentValues) {
  let cy = 310;

  // Check if current matches target
  let matches = arraysEqual(currentValues, challengeTarget);

  fill(matches ? [220, 255, 220] : [255, 250, 230]);
  stroke(matches ? [46, 160, 67] : [200, 180, 100]);
  strokeWeight(1);
  rectMode(CENTER);
  rect(canvasWidth / 2, cy, canvasWidth - 60, 30, 5);
  rectMode(CORNER);

  noStroke();
  fill(matches ? [30, 120, 40] : [120, 100, 40]);
  textAlign(CENTER, CENTER);
  textSize(13);
  textStyle(BOLD);
  if (matches) {
    text('Correct! ' + challengeText, canvasWidth / 2, cy);
  } else {
    text('Challenge: Generate ' + challengeText, canvasWidth / 2, cy);
  }
  textStyle(NORMAL);
}

function newChallenge() {
  challengeActive = true;
  // Pick a random challenge
  let challenges = [
    { target: [2, 5, 8, 11], text: '[2, 5, 8, 11]' },
    { target: [0, 1, 2, 3, 4], text: '[0, 1, 2, 3, 4]' },
    { target: [10, 8, 6, 4, 2], text: '[10, 8, 6, 4, 2]' },
    { target: [1, 3, 5, 7, 9], text: '[1, 3, 5, 7, 9]' },
    { target: [5, 4, 3, 2, 1], text: '[5, 4, 3, 2, 1]' },
    { target: [0, 3, 6, 9], text: '[0, 3, 6, 9]' },
    { target: [-3, -2, -1, 0, 1, 2], text: '[-3, -2, -1, 0, 1, 2]' },
    { target: [0, 2, 4, 6, 8, 10], text: '[0, 2, 4, 6, 8, 10]' },
  ];
  let pick = challenges[Math.floor(Math.random() * challenges.length)];
  challengeTarget = pick.target;
  challengeText = pick.text;
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  startSlider.size(canvasWidth - sliderLeftMargin - margin);
  stopSlider.size(canvasWidth - sliderLeftMargin - margin);
  stepSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
