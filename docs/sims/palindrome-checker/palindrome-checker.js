// Palindrome Checker MicroSim
// Step-by-step visualization: Clean → Reverse → Compare
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// Controls
let textInput;
let checkButton, stepButton, resetButton;
let exampleSelect;

// State
let inputText = 'racecar';
let cleanedText = '';
let reversedText = '';
let currentStage = 0; // 0=idle, 1=clean, 2=reverse, 3=compare, 4=verdict
let compareIndex = -1;
let isPalindrome = false;
let mismatchFound = -1;

// Examples
let exampleTexts = ['racecar', 'hello', 'A man a plan a canal Panama', 'madam', 'python', 'Was it a car or a cat I saw'];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  textInput = createInput('racecar');
  textInput.position(55, drawHeight + 12);
  textInput.size(130);
  textInput.input(() => {
    inputText = textInput.value();
    doReset();
  });

  checkButton = createButton('Check');
  checkButton.position(200, drawHeight + 10);
  checkButton.mousePressed(runAll);

  stepButton = createButton('Step');
  stepButton.position(260, drawHeight + 10);
  stepButton.mousePressed(doStep);

  exampleSelect = createSelect();
  exampleSelect.position(canvasWidth - 130, drawHeight + 12);
  for (let ex of exampleTexts) {
    exampleSelect.option(ex.length > 15 ? ex.substring(0, 15) + '...' : ex, ex);
  }
  exampleSelect.changed(() => {
    inputText = exampleSelect.value();
    textInput.value(inputText);
    doReset();
  });

  describe('Step-by-step palindrome checker showing cleaning, reversing, and comparing stages for any input string.', LABEL);
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
  text('Palindrome Checker', canvasWidth / 2, 8);

  // Stage indicators
  drawStageIndicators();

  // Draw current stage content
  if (currentStage >= 1) drawCleanStage();
  if (currentStage >= 2) drawReverseStage();
  if (currentStage >= 3) drawCompareStage();
  if (currentStage >= 4) drawVerdict();

  if (currentStage === 0) {
    noStroke();
    fill(150);
    textAlign(CENTER, CENTER);
    textSize(14);
    text('Enter a word or phrase, then click "Check" or "Step"', canvasWidth / 2, 180);

    // Show the original string
    drawOriginalString(100);
  }

  // Control labels
  noStroke();
  fill(80);
  textAlign(LEFT, CENTER);
  textSize(11);
  text('Text:', 10, drawHeight + 25);
}

function drawStageIndicators() {
  let y = 32;
  let stageNames = ['Clean', 'Reverse', 'Compare'];
  let stageW = 90;
  let totalW = stageNames.length * stageW + (stageNames.length - 1) * 20;
  let startX = canvasWidth / 2 - totalW / 2;

  for (let i = 0; i < stageNames.length; i++) {
    let sx = startX + i * (stageW + 20);
    let stageNum = i + 1;
    let isActive = currentStage === stageNum;
    let isDone = currentStage > stageNum;

    // Circle
    fill(isDone ? [46, 160, 67] : isActive ? [70, 130, 220] : [220]);
    stroke(isDone ? [36, 130, 57] : isActive ? [50, 100, 180] : [200]);
    strokeWeight(isActive ? 2 : 1);
    circle(sx + 15, y + 10, 24);

    // Number
    noStroke();
    fill(isDone || isActive ? 255 : 150);
    textAlign(CENTER, CENTER);
    textSize(12);
    textStyle(BOLD);
    text(stageNum, sx + 15, y + 10);
    textStyle(NORMAL);

    // Label
    fill(isActive ? [40] : isDone ? [46, 160, 67] : [150]);
    textSize(11);
    text(stageNames[i], sx + 55, y + 10);

    // Arrow
    if (i < stageNames.length - 1) {
      stroke(200);
      strokeWeight(1);
      let arrowX = sx + stageW + 5;
      line(arrowX, y + 10, arrowX + 10, y + 10);
      line(arrowX + 10, y + 10, arrowX + 6, y + 6);
      line(arrowX + 10, y + 10, arrowX + 6, y + 14);
    }
  }
}

function drawOriginalString(y) {
  noStroke();
  fill(80);
  textAlign(CENTER, TOP);
  textSize(12);
  text('Original:', canvasWidth / 2, y - 18);

  drawCharBoxes(inputText, canvasWidth / 2, y, [], 'default');
}

function drawCleanStage() {
  let y = 75;

  noStroke();
  fill(80);
  textAlign(LEFT, TOP);
  textSize(11);
  textStyle(BOLD);
  text('Original:', margin, y);
  textStyle(NORMAL);

  // Original with removed chars dimmed
  drawCharBoxesWithDim(inputText, canvasWidth / 2, y + 16);

  // Arrow
  fill(150);
  textAlign(CENTER, CENTER);
  textSize(16);
  text('↓', canvasWidth / 2, y + 55);

  // Cleaned
  fill(80);
  textAlign(LEFT, TOP);
  textSize(11);
  textStyle(BOLD);
  text('Cleaned:', margin, y + 68);
  textStyle(NORMAL);

  drawCharBoxes(cleanedText, canvasWidth / 2, y + 84, [], 'clean');
}

function drawReverseStage() {
  let y = 190;

  noStroke();
  fill(80);
  textAlign(LEFT, TOP);
  textSize(11);
  textStyle(BOLD);
  text('Cleaned:', margin, y);
  textStyle(NORMAL);

  drawCharBoxes(cleanedText, canvasWidth / 2, y + 16, [], 'clean');

  // Arrow
  fill(150);
  textAlign(CENTER, CENTER);
  textSize(16);
  text('↓ [::-1]', canvasWidth / 2, y + 52);

  fill(80);
  textAlign(LEFT, TOP);
  textSize(11);
  textStyle(BOLD);
  text('Reversed:', margin, y + 65);
  textStyle(NORMAL);

  drawCharBoxes(reversedText, canvasWidth / 2, y + 81, [], 'reverse');
}

function drawCompareStage() {
  let y = 300;

  noStroke();
  fill(80);
  textAlign(CENTER, TOP);
  textSize(11);
  textStyle(BOLD);
  text('Comparing character by character:', canvasWidth / 2, y);
  textStyle(NORMAL);

  let len = cleanedText.length;
  let charW = Math.min(28, (canvasWidth - margin * 2) / Math.max(len, 1) - 3);
  let totalW = len * (charW + 3);
  let startX = canvasWidth / 2 - totalW / 2;

  // Top row (cleaned)
  let topY = y + 18;
  for (let i = 0; i < len; i++) {
    let bx = startX + i * (charW + 3);
    let compared = i <= compareIndex;
    let matches = compared && cleanedText[i] === reversedText[i];
    let isMismatch = compared && !matches;

    fill(isMismatch ? [255, 200, 200] : matches ? [200, 255, 200] : [250]);
    stroke(isMismatch ? [220, 60, 60] : matches ? [46, 160, 67] : [200]);
    strokeWeight(1);
    rect(bx, topY, charW, charW, 3);

    noStroke();
    fill(isMismatch ? [200, 40, 40] : matches ? [30, 100, 30] : [80]);
    textAlign(CENTER, CENTER);
    textSize(charW > 20 ? 14 : 10);
    text(cleanedText[i], bx + charW / 2, topY + charW / 2);
  }

  // Bottom row (reversed)
  let botY = topY + charW + 4;
  for (let i = 0; i < len; i++) {
    let bx = startX + i * (charW + 3);
    let compared = i <= compareIndex;
    let matches = compared && cleanedText[i] === reversedText[i];
    let isMismatch = compared && !matches;

    fill(isMismatch ? [255, 200, 200] : matches ? [200, 255, 200] : [250]);
    stroke(isMismatch ? [220, 60, 60] : matches ? [46, 160, 67] : [200]);
    strokeWeight(1);
    rect(bx, botY, charW, charW, 3);

    noStroke();
    fill(isMismatch ? [200, 40, 40] : matches ? [30, 100, 30] : [80]);
    textAlign(CENTER, CENTER);
    textSize(charW > 20 ? 14 : 10);
    text(reversedText[i], bx + charW / 2, botY + charW / 2);

    // Match/mismatch indicator
    if (compared) {
      textSize(12);
      fill(matches ? [46, 160, 67] : [220, 60, 60]);
      text(matches ? '✓' : '✗', bx + charW / 2, topY - 10);
    }
  }
}

function drawVerdict() {
  let y = drawHeight - 30;

  if (isPalindrome) {
    fill(220, 255, 220);
    stroke(46, 160, 67);
    strokeWeight(2);
    rectMode(CENTER);
    rect(canvasWidth / 2, y, 280, 35, 8);
    rectMode(CORNER);

    noStroke();
    fill(30, 120, 40);
    textAlign(CENTER, CENTER);
    textSize(18);
    textStyle(BOLD);
    text('Palindrome!', canvasWidth / 2, y);
  } else {
    fill(255, 230, 230);
    stroke(220, 80, 80);
    strokeWeight(2);
    rectMode(CENTER);
    rect(canvasWidth / 2, y, 280, 35, 8);
    rectMode(CORNER);

    noStroke();
    fill(180, 40, 40);
    textAlign(CENTER, CENTER);
    textSize(18);
    textStyle(BOLD);
    text('Not a palindrome', canvasWidth / 2, y);
  }
  textStyle(NORMAL);
}

function drawCharBoxes(str, cx, y, highlights, colorType) {
  let len = str.length;
  if (len === 0) return;
  let charW = Math.min(28, (canvasWidth - margin * 2) / len - 3);
  let totalW = len * (charW + 3);
  let startX = cx - totalW / 2;

  for (let i = 0; i < len; i++) {
    let bx = startX + i * (charW + 3);
    let bgCol = colorType === 'clean' ? [230, 242, 255] : colorType === 'reverse' ? [255, 240, 230] : [245];

    fill(bgCol);
    stroke(180);
    strokeWeight(1);
    rect(bx, y, charW, charW, 3);

    noStroke();
    fill(40);
    textAlign(CENTER, CENTER);
    textSize(charW > 20 ? 14 : 10);
    text(str[i], bx + charW / 2, y + charW / 2);
  }
}

function drawCharBoxesWithDim(str, cx, y) {
  let len = str.length;
  if (len === 0) return;
  let charW = Math.min(28, (canvasWidth - margin * 2) / len - 3);
  let totalW = len * (charW + 3);
  let startX = cx - totalW / 2;

  for (let i = 0; i < len; i++) {
    let bx = startX + i * (charW + 3);
    let ch = str[i];
    let isKept = /[a-zA-Z0-9]/.test(ch);

    fill(isKept ? [245] : [255, 230, 230, 150]);
    stroke(isKept ? [180] : [220, 150, 150, 100]);
    strokeWeight(1);
    rect(bx, y, charW, charW, 3);

    noStroke();
    fill(isKept ? [40] : [200, 100, 100, 120]);
    textAlign(CENTER, CENTER);
    textSize(charW > 20 ? 14 : 10);
    textStyle(isKept ? NORMAL : ITALIC);
    text(ch === ' ' ? '·' : ch, bx + charW / 2, y + charW / 2);
    textStyle(NORMAL);
  }
}

function doClean() {
  cleanedText = inputText.toLowerCase().replace(/[^a-z0-9]/g, '');
  reversedText = '';
  compareIndex = -1;
  mismatchFound = -1;
  currentStage = 1;
}

function doReverse() {
  if (currentStage < 1) doClean();
  reversedText = cleanedText.split('').reverse().join('');
  currentStage = 2;
}

function doCompare() {
  if (currentStage < 2) doReverse();
  compareIndex++;
  if (compareIndex >= cleanedText.length) {
    isPalindrome = (mismatchFound === -1);
    currentStage = 4;
    return;
  }
  if (cleanedText[compareIndex] !== reversedText[compareIndex]) {
    mismatchFound = compareIndex;
    isPalindrome = false;
    currentStage = 4;
    return;
  }
  currentStage = 3;
}

function doStep() {
  if (currentStage === 0) {
    doClean();
  } else if (currentStage === 1) {
    doReverse();
  } else if (currentStage === 2 || currentStage === 3) {
    doCompare();
  }
}

function runAll() {
  doClean();
  doReverse();
  // Compare all at once
  isPalindrome = (cleanedText === reversedText);
  compareIndex = cleanedText.length - 1;
  if (!isPalindrome) {
    for (let i = 0; i < cleanedText.length; i++) {
      if (cleanedText[i] !== reversedText[i]) {
        mismatchFound = i;
        compareIndex = i;
        break;
      }
    }
  }
  currentStage = 4;
}

function doReset() {
  currentStage = 0;
  cleanedText = '';
  reversedText = '';
  compareIndex = -1;
  mismatchFound = -1;
  isPalindrome = false;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  textInput.size(canvasWidth - 270);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
