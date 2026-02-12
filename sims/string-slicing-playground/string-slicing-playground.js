// String Slicing Playground MicroSim
// Adjust start, stop, step sliders to see which characters are selected
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 400;
let drawHeight = 360;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 100;
let defaultTextSize = 16;

// Controls
let startSlider, stopSlider, stepSlider;
let stringInput;
let challengeButton;

// State
let currentString = 'COMPUTER SCIENCE';
let challengeActive = false;
let challengeTarget = '';
let challengeSlice = '';

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  stringInput = createInput('COMPUTER SCIENCE');
  stringInput.position(70, drawHeight + 5);
  stringInput.size(canvasWidth - 180);
  stringInput.input(() => {
    currentString = stringInput.value();
    updateSliderRanges();
  });

  let len = currentString.length;

  startSlider = createSlider(-len, len, 0, 1);
  startSlider.position(sliderLeftMargin, drawHeight + 35);
  startSlider.size(canvasWidth - sliderLeftMargin - margin);

  stopSlider = createSlider(-len, len, len, 1);
  stopSlider.position(sliderLeftMargin, drawHeight + 60);
  stopSlider.size(canvasWidth - sliderLeftMargin - margin);

  stepSlider = createSlider(-len, len, 1, 1);
  stepSlider.position(sliderLeftMargin, drawHeight + 85);
  stepSlider.size(canvasWidth - sliderLeftMargin - margin);

  challengeButton = createButton('Challenge');
  challengeButton.position(canvasWidth - 95, drawHeight + 5);
  challengeButton.mousePressed(newChallenge);

  describe('Interactive string slicing playground. Adjust start, stop, and step sliders to see which characters are selected.', LABEL);
}

function updateSliderRanges() {
  let len = currentString.length;
  if (len === 0) len = 1;
  startSlider.elt.min = -len;
  startSlider.elt.max = len;
  stopSlider.elt.min = -len;
  stopSlider.elt.max = len;
  stepSlider.elt.min = -len;
  stepSlider.elt.max = len;
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
  textSize(20);
  text('String Slicing Playground', canvasWidth / 2, 8);

  let len = currentString.length;
  if (len === 0) {
    fill(150);
    textSize(14);
    textAlign(CENTER, CENTER);
    text('Type a string to slice', canvasWidth / 2, 150);
    drawControlLabels();
    return;
  }

  let startVal = startSlider.value();
  let stopVal = stopSlider.value();
  let stepVal = stepSlider.value();

  // Skip step=0
  if (stepVal === 0) stepVal = 1;

  // Compute slice indices
  let selectedIndices = computeSlice(len, startVal, stopVal, stepVal);
  let resultStr = '';
  for (let idx of selectedIndices) {
    resultStr += currentString[idx];
  }

  // Draw character boxes
  let maxBoxW = 42;
  let gap = 3;
  let boxW = maxBoxW;
  let totalW = len * boxW + (len - 1) * gap;

  if (totalW > canvasWidth - margin * 2) {
    boxW = Math.floor((canvasWidth - margin * 2 - (len - 1) * gap) / len);
    totalW = len * boxW + (len - 1) * gap;
  }

  let startX = (canvasWidth - totalW) / 2;
  let boxY = 80;
  let boxH = 44;

  // Positive indices above
  for (let i = 0; i < len; i++) {
    let bx = startX + i * (boxW + gap);
    let isSelected = selectedIndices.includes(i);

    // Positive index
    noStroke();
    fill(isSelected ? [70, 130, 220] : [180]);
    textAlign(CENTER, BOTTOM);
    textSize(10);
    text(i, bx + boxW / 2, boxY - 3);

    // Box
    if (isSelected) {
      stroke(218, 165, 32);
      strokeWeight(2);
      fill(255, 248, 220);
    } else {
      stroke(210);
      strokeWeight(1);
      fill(240, 240, 240, 150);
    }
    rect(bx, boxY, boxW, boxH, 5);

    // Character
    noStroke();
    fill(isSelected ? [40] : [180]);
    textAlign(CENTER, CENTER);
    textSize(boxW > 30 ? 20 : 14);
    textStyle(isSelected ? BOLD : NORMAL);
    text(currentString[i], bx + boxW / 2, boxY + boxH / 2);
    textStyle(NORMAL);

    // Negative index below
    fill(isSelected ? [200, 60, 60] : [200]);
    textAlign(CENTER, TOP);
    textSize(10);
    text(i - len, bx + boxW / 2, boxY + boxH + 3);
  }

  // Direction arrow
  if (selectedIndices.length > 1) {
    let arrowY = boxY + boxH + 25;
    let firstIdx = selectedIndices[0];
    let lastIdx = selectedIndices[selectedIndices.length - 1];
    let ax1 = startX + firstIdx * (boxW + gap) + boxW / 2;
    let ax2 = startX + lastIdx * (boxW + gap) + boxW / 2;

    stroke(218, 165, 32, 150);
    strokeWeight(2);
    line(ax1, arrowY, ax2, arrowY);
    // Arrow head
    let dir = ax2 > ax1 ? 1 : -1;
    line(ax2, arrowY, ax2 - dir * 8, arrowY - 5);
    line(ax2, arrowY, ax2 - dir * 8, arrowY + 5);

    noStroke();
    fill(180, 140, 50);
    textAlign(CENTER, TOP);
    textSize(10);
    text(stepVal > 0 ? 'left → right' : 'right → left', (ax1 + ax2) / 2, arrowY + 6);
  }

  // Slice notation display
  let codeY = 195;
  fill(245, 245, 252);
  stroke(200);
  strokeWeight(1);
  rectMode(CENTER);
  rect(canvasWidth / 2, codeY, canvasWidth - 60, 40, 6);
  rectMode(CORNER);

  noStroke();
  textFont('monospace');
  textAlign(CENTER, CENTER);
  textSize(15);
  fill(40, 40, 140);

  // Build slice notation
  let notation = buildNotation(startVal, stopVal, stepVal, len);
  text('"' + currentString + '"' + notation, canvasWidth / 2, codeY - 7);

  fill(80);
  textSize(14);
  text('→ "' + resultStr + '"', canvasWidth / 2, codeY + 10);
  textFont('Arial');

  // Result count
  noStroke();
  fill(100);
  textAlign(CENTER, TOP);
  textSize(12);
  text(selectedIndices.length + ' character' + (selectedIndices.length !== 1 ? 's' : '') + ' selected', canvasWidth / 2, codeY + 28);

  // Challenge display
  if (challengeActive) {
    let cy = 260;
    let matches = (resultStr === challengeTarget);

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
      text('Correct! Slice produces "' + challengeTarget + '"', canvasWidth / 2, cy);
    } else {
      text('Challenge: Produce "' + challengeTarget + '"', canvasWidth / 2, cy);
    }
    textStyle(NORMAL);
  }

  // Common slices reference
  drawSliceReference();

  drawControlLabels();
}

function buildNotation(start, stop, step, len) {
  let s = '[';
  if (start !== 0) s += start;
  s += ':';
  if (stop !== len) s += stop;
  if (step !== 1) s += ':' + step;
  s += ']';
  return s;
}

function computeSlice(len, start, stop, step) {
  if (step === 0) return [];

  // Normalize negative indices
  let s = start < 0 ? Math.max(start + len, 0) : Math.min(start, len);
  let e = stop < 0 ? Math.max(stop + len, 0) : Math.min(stop, len);

  let result = [];
  if (step > 0) {
    for (let i = s; i < e; i += step) {
      if (i >= 0 && i < len) result.push(i);
    }
  } else {
    // For negative step, Python's actual behavior:
    // default start is len-1, default stop is -1 (before beginning)
    // but here we have explicit values
    if (start >= len) s = len - 1;
    if (stop < -len) e = -1;
    for (let i = s; i > e; i += step) {
      if (i >= 0 && i < len) result.push(i);
    }
  }
  return result;
}

function drawSliceReference() {
  let refY = 295;
  let refX = margin;

  noStroke();
  fill(100);
  textAlign(LEFT, TOP);
  textSize(11);
  textStyle(BOLD);
  text('Common slices:', refX, refY);
  textStyle(NORMAL);

  let examples = [
    { label: '[:3]', desc: 'first 3' },
    { label: '[-3:]', desc: 'last 3' },
    { label: '[::2]', desc: 'every other' },
    { label: '[::-1]', desc: 'reversed' },
  ];

  textSize(10);
  textFont('monospace');
  let ex = refX;
  for (let eg of examples) {
    let labelW = textWidth(eg.label);
    textFont('Arial');
    let descW = textWidth(eg.desc);
    textFont('monospace');
    let w = labelW + descW + 20;
    fill(240, 240, 255);
    stroke(200);
    strokeWeight(1);
    rect(ex, refY + 18, w, 22, 4);
    noStroke();
    fill(60, 60, 140);
    textAlign(LEFT, CENTER);
    text(eg.label, ex + 5, refY + 29);
    fill(120);
    textFont('Arial');
    textSize(10);
    text(eg.desc, ex + labelW + 10, refY + 29);
    textFont('monospace');
    textSize(10);
    ex += w + 6;
  }
  textFont('Arial');
}

function drawControlLabels() {
  noStroke();
  fill(80);
  textAlign(LEFT, CENTER);
  textSize(12);
  text('String:', 10, drawHeight + 15);
  text('Start: ' + startSlider.value(), 10, drawHeight + 45);
  text('Stop: ' + stopSlider.value(), 10, drawHeight + 70);
  text('Step: ' + stepSlider.value(), 10, drawHeight + 95);
}

function newChallenge() {
  challengeActive = true;
  let len = currentString.length;
  if (len < 2) return;

  let challenges = [];
  // Generate some random valid slices
  if (len >= 3) challenges.push(currentString.substring(0, 3));
  if (len >= 3) challenges.push(currentString.substring(len - 3));
  if (len >= 4) {
    let every2 = '';
    for (let i = 0; i < len; i += 2) every2 += currentString[i];
    challenges.push(every2);
  }
  // Reversed
  let rev = '';
  for (let i = len - 1; i >= 0; i--) rev += currentString[i];
  challenges.push(rev);
  // Middle portion
  if (len >= 6) challenges.push(currentString.substring(2, len - 2));

  challengeTarget = challenges[Math.floor(Math.random() * challenges.length)];
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  startSlider.size(canvasWidth - sliderLeftMargin - margin);
  stopSlider.size(canvasWidth - sliderLeftMargin - margin);
  stepSlider.size(canvasWidth - sliderLeftMargin - margin);
  stringInput.size(canvasWidth - 180);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
