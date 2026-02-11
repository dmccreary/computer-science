// Truthiness Tester MicroSim
// Bloom Level: Apply (L3) - classify, predict
// Students drag Python values into Truthy or Falsy bins to learn truthiness rules.

let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// ---- Value pools ----
const falsyPool = [
  { label: '0',     explanation: '0 is falsy because it is the integer zero.' },
  { label: '0.0',   explanation: '0.0 is falsy because it is the float zero.' },
  { label: '""',    explanation: '"" is falsy because it is an empty string.' },
  { label: 'False', explanation: 'False is the boolean falsy value itself.' },
  { label: 'None',  explanation: 'None is falsy because it represents "nothing."' },
  { label: '[]',    explanation: '[] is falsy because it is an empty list.' },
  { label: '()',    explanation: '() is falsy because it is an empty tuple.' },
  { label: '{}',    explanation: '{} is falsy because it is an empty dict.' }
];

const truthyPool = [
  { label: '1',       explanation: '1 is truthy because it is a non-zero integer.' },
  { label: '-1',      explanation: '-1 is truthy because it is a non-zero integer.' },
  { label: '42',      explanation: '42 is truthy because it is a non-zero integer.' },
  { label: '3.14',    explanation: '3.14 is truthy because it is a non-zero float.' },
  { label: '"hello"', explanation: '"hello" is truthy because it is a non-empty string.' },
  { label: '"0"',     explanation: '"0" is truthy because it is a non-empty string (the character zero, not the number).' },
  { label: '" "',     explanation: '" " is truthy because it is a non-empty string (it contains a space).' },
  { label: '[0]',     explanation: '[0] is truthy because it is a non-empty list (it has one element).' },
  { label: 'True',    explanation: 'True is the boolean truthy value itself.' },
  { label: '"False"', explanation: '"False" is truthy because it is a non-empty string (the text False, not the boolean).' },
  { label: '"None"',  explanation: '"None" is truthy because it is a non-empty string (the text None, not the None object).' }
];

// ---- Game state ----
let cards = [];          // current round cards
let draggedCard = null;  // index of card being dragged
let dragOffsetX = 0;
let dragOffsetY = 0;
let checked = false;     // has the player pressed Check?
let score = 0;
let totalAttempted = 0;
let hintIndex = -1;      // index of card highlighted by Hint
let feedbackCard = -1;   // index of card showing explanation tooltip

// Bin geometry (computed in draw based on canvasWidth)
let truthyBin = {};
let falsyBin = {};

// Buttons
let checkBtn, newRoundBtn, hintBtn;

// ---- Setup ----
function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    canvasWidth = Math.min(mainEl.offsetWidth, 780);
  }
  if (canvasWidth < 340) canvasWidth = 340;
  canvasHeight = drawHeight + controlHeight;
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  // Create control buttons
  let mainEl = document.querySelector('main');

  checkBtn = createButton('Check');
  checkBtn.parent(mainEl);
  checkBtn.mousePressed(doCheck);
  checkBtn.style('font-size', '14px');
  checkBtn.style('padding', '6px 16px');
  checkBtn.style('cursor', 'pointer');

  newRoundBtn = createButton('New Round');
  newRoundBtn.parent(mainEl);
  newRoundBtn.mousePressed(doNewRound);
  newRoundBtn.style('font-size', '14px');
  newRoundBtn.style('padding', '6px 16px');
  newRoundBtn.style('cursor', 'pointer');

  hintBtn = createButton('Hint');
  hintBtn.parent(mainEl);
  hintBtn.mousePressed(doHint);
  hintBtn.style('font-size', '14px');
  hintBtn.style('padding', '6px 16px');
  hintBtn.style('cursor', 'pointer');

  positionButtons();
  generateRound();

  describe('A sorting game where students drag Python values into Truthy and Falsy bins to learn truthiness rules.');
}

function positionButtons() {
  let btnY = drawHeight + 12;
  let spacing = canvasWidth / 4;
  let mainEl = document.querySelector('main');
  if (mainEl) {
    let canvasEl = mainEl.querySelector('canvas');
    if (canvasEl) {
      let canvasRect = canvasEl.getBoundingClientRect();
      let mainRect = mainEl.getBoundingClientRect();
      let offsetX = canvasRect.left - mainRect.left;
      let offsetY = canvasRect.top - mainRect.top;
      checkBtn.position(offsetX + spacing * 0.7 - 25, offsetY + btnY);
      newRoundBtn.position(offsetX + spacing * 2.0 - 40, offsetY + btnY);
      hintBtn.position(offsetX + spacing * 3.3 - 20, offsetY + btnY);
    }
  }
}

// ---- Round generation ----
function generateRound() {
  cards = [];
  checked = false;
  hintIndex = -1;
  feedbackCard = -1;

  // Pick 4 falsy and 4 truthy for a balanced round of 8
  let falsyCopy = shuffleArray(falsyPool.slice());
  let truthyCopy = shuffleArray(truthyPool.slice());

  let selected = [];
  for (let i = 0; i < 4 && i < falsyCopy.length; i++) {
    selected.push({ label: falsyCopy[i].label, explanation: falsyCopy[i].explanation, truthy: false });
  }
  for (let i = 0; i < 4 && i < truthyCopy.length; i++) {
    selected.push({ label: truthyCopy[i].label, explanation: truthyCopy[i].explanation, truthy: true });
  }
  selected = shuffleArray(selected);

  // Position cards in center area (two rows of 4)
  layoutCards(selected);
}

function layoutCards(selected) {
  cards = [];
  let cardW = computeCardWidth();
  let cardH = 40;
  let gapX = 12;
  let gapY = 14;
  let cols = 4;
  let rows = Math.ceil(selected.length / cols);
  let totalW = cols * cardW + (cols - 1) * gapX;
  let startX = (canvasWidth - totalW) / 2;
  let startY = 70;

  for (let i = 0; i < selected.length; i++) {
    let row = Math.floor(i / cols);
    let col = i % cols;
    cards.push({
      label: selected[i].label,
      explanation: selected[i].explanation,
      truthy: selected[i].truthy,
      x: startX + col * (cardW + gapX),
      y: startY + row * (cardH + gapY),
      homeX: startX + col * (cardW + gapX),
      homeY: startY + row * (cardH + gapY),
      w: cardW,
      h: cardH,
      bin: null,     // 'truthy', 'falsy', or null
      correct: null  // set after Check
    });
  }
}

function computeCardWidth() {
  return Math.max(65, Math.min(90, (canvasWidth - margin * 2 - 36) / 4));
}

// ---- Draw ----
function draw() {
  // Draw area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area
  fill('white');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  noStroke();
  fill(40);
  textAlign(CENTER, TOP);
  textSize(Math.max(18, Math.min(24, canvasWidth * 0.042)));
  text('Truthiness Tester: Truthy or Falsy?', canvasWidth / 2, 10);

  // Score display
  noStroke();
  fill(80);
  textSize(14);
  textAlign(RIGHT, TOP);
  text('Score: ' + score + ' / ' + totalAttempted, canvasWidth - margin, 14);

  // Compute bin positions
  computeBins();

  // Draw bins
  drawBin(truthyBin, 'Truthy', color(40, 160, 60), color(200, 245, 210));
  drawBin(falsyBin, 'Falsy', color(200, 40, 40), color(255, 215, 215));

  // Draw instruction text
  noStroke();
  fill(120);
  textSize(13);
  textAlign(CENTER, TOP);
  if (!checked) {
    text('Drag each card into the correct bin, then press Check.', canvasWidth / 2, 44);
  } else {
    text('Green = correct, Red = incorrect. Press New Round to try again!', canvasWidth / 2, 44);
  }

  // Draw cards (non-dragged first, dragged on top)
  for (let i = 0; i < cards.length; i++) {
    if (i !== draggedCard) drawCard(i);
  }
  if (draggedCard !== null) drawCard(draggedCard);

  // Draw explanation tooltip if a card is tapped after checking
  if (checked && feedbackCard >= 0 && feedbackCard < cards.length) {
    drawExplanation(feedbackCard);
  }
}

function computeBins() {
  let binW = (canvasWidth - margin * 3) / 2;
  let binH = 180;
  let binY = drawHeight - binH - 20;

  truthyBin = { x: margin, y: binY, w: binW, h: binH };
  falsyBin  = { x: margin * 2 + binW, y: binY, w: binW, h: binH };
}

function drawBin(bin, label, borderColor, bgColor) {
  // Background
  stroke(borderColor);
  strokeWeight(3);
  fill(bgColor);
  rect(bin.x, bin.y, bin.w, bin.h, 12);

  // Dashed interior guide
  noFill();
  stroke(red(borderColor), green(borderColor), blue(borderColor), 60);
  strokeWeight(1);
  drawingContext.setLineDash([6, 4]);
  rect(bin.x + 8, bin.y + 30, bin.w - 16, bin.h - 40, 8);
  drawingContext.setLineDash([]);

  // Label
  noStroke();
  fill(borderColor);
  textAlign(CENTER, TOP);
  textSize(Math.max(16, canvasWidth * 0.032));
  textStyle(BOLD);
  text(label, bin.x + bin.w / 2, bin.y + 6);
  textStyle(NORMAL);
}

function drawCard(i) {
  let c = cards[i];
  let cardW = c.w;
  let cardH = c.h;

  push();

  // Shadow
  noStroke();
  fill(0, 0, 0, 20);
  rect(c.x + 2, c.y + 2, cardW, cardH, 8);

  // Card background
  let bgCol = color(255);
  if (checked && c.correct === true) {
    bgCol = color(180, 240, 180);
  } else if (checked && c.correct === false) {
    bgCol = color(255, 190, 190);
  } else if (i === hintIndex) {
    // Hint: pulse yellow
    let pulse = (sin(frameCount * 0.1) + 1) / 2;
    bgCol = lerpColor(color(255, 255, 180), color(255, 230, 100), pulse);
  } else if (i === draggedCard) {
    bgCol = color(230, 240, 255);
  }

  stroke(100);
  strokeWeight(1.5);
  fill(bgCol);
  rect(c.x, c.y, cardW, cardH, 8);

  // Card label (monospace-style)
  noStroke();
  fill(30);
  textAlign(CENTER, CENTER);
  textSize(Math.max(14, Math.min(16, canvasWidth * 0.03)));
  textStyle(BOLD);
  text(c.label, c.x + cardW / 2, c.y + cardH / 2);
  textStyle(NORMAL);

  // If checked, show small checkmark or X
  if (checked && c.bin !== null) {
    textSize(18);
    textAlign(RIGHT, TOP);
    if (c.correct) {
      fill(0, 140, 0);
      text('\u2713', c.x + cardW - 4, c.y + 2);
    } else {
      fill(200, 0, 0);
      text('\u2717', c.x + cardW - 4, c.y + 2);
    }
  }

  pop();
}

function drawExplanation(i) {
  let c = cards[i];
  let tipW = Math.min(280, canvasWidth - 40);
  let tipH = 50;
  let tipX = constrain(c.x + c.w / 2 - tipW / 2, 10, canvasWidth - tipW - 10);
  let tipY = c.y - tipH - 8;
  if (tipY < 10) tipY = c.y + c.h + 8;

  // Background
  noStroke();
  fill(0, 0, 0, 25);
  rect(tipX + 2, tipY + 2, tipW, tipH, 8);

  fill(255, 255, 240);
  stroke(180);
  strokeWeight(1);
  rect(tipX, tipY, tipW, tipH, 8);

  // Text
  noStroke();
  fill(50);
  textAlign(CENTER, CENTER);
  textSize(12);
  textStyle(NORMAL);
  text(c.explanation, tipX + tipW / 2, tipY + tipH / 2, tipW - 16, tipH - 10);
}

// ---- Drag and drop ----
function mousePressed() {
  if (mouseY > drawHeight) return; // ignore clicks in control area

  // After checking, allow tapping cards to see explanations
  if (checked) {
    feedbackCard = -1;
    for (let i = cards.length - 1; i >= 0; i--) {
      let c = cards[i];
      if (mouseX >= c.x && mouseX <= c.x + c.w && mouseY >= c.y && mouseY <= c.y + c.h) {
        feedbackCard = i;
        return;
      }
    }
    feedbackCard = -1;
    return;
  }

  // Find topmost card under cursor
  for (let i = cards.length - 1; i >= 0; i--) {
    let c = cards[i];
    if (mouseX >= c.x && mouseX <= c.x + c.w && mouseY >= c.y && mouseY <= c.y + c.h) {
      draggedCard = i;
      dragOffsetX = c.x - mouseX;
      dragOffsetY = c.y - mouseY;
      // Bring to front by moving to end of array
      let card = cards.splice(i, 1)[0];
      cards.push(card);
      draggedCard = cards.length - 1;
      hintIndex = -1; // clear hint on interaction
      return;
    }
  }
}

function mouseDragged() {
  if (draggedCard === null) return;
  cards[draggedCard].x = mouseX + dragOffsetX;
  cards[draggedCard].y = mouseY + dragOffsetY;
}

function mouseReleased() {
  if (draggedCard === null) return;
  let c = cards[draggedCard];

  // Check if dropped in a bin
  if (isInsideBin(c, truthyBin)) {
    c.bin = 'truthy';
    snapToBin(draggedCard, truthyBin);
  } else if (isInsideBin(c, falsyBin)) {
    c.bin = 'falsy';
    snapToBin(draggedCard, falsyBin);
  } else {
    // Return to home position and clear bin assignment
    c.x = c.homeX;
    c.y = c.homeY;
    c.bin = null;
  }

  draggedCard = null;
}

function isInsideBin(card, bin) {
  let cx = card.x + card.w / 2;
  let cy = card.y + card.h / 2;
  return cx > bin.x && cx < bin.x + bin.w && cy > bin.y && cy < bin.y + bin.h;
}

function snapToBin(cardIndex, bin) {
  // Arrange cards neatly inside the bin
  let cardsInBin = [];
  for (let i = 0; i < cards.length; i++) {
    let b = cards[i].bin;
    if ((b === 'truthy' && bin === truthyBin) || (b === 'falsy' && bin === falsyBin)) {
      cardsInBin.push(i);
    }
  }

  let cols = Math.max(2, Math.floor((bin.w - 16) / (computeCardWidth() + 6)));
  let startX = bin.x + 12;
  let startY = bin.y + 32;
  let gapX = 6;
  let gapY = 6;
  let cw = computeCardWidth();

  for (let j = 0; j < cardsInBin.length; j++) {
    let row = Math.floor(j / cols);
    let col = j % cols;
    cards[cardsInBin[j]].x = startX + col * (cw + gapX);
    cards[cardsInBin[j]].y = startY + row * (cards[0].h + gapY);
  }
}

// ---- Touch support ----
function touchStarted() {
  if (touches.length > 0) {
    // Synthesize mouse position from first touch
    mouseX = touches[0].x;
    mouseY = touches[0].y;
    mousePressed();
  }
  return false; // prevent default
}

function touchMoved() {
  if (touches.length > 0) {
    mouseX = touches[0].x;
    mouseY = touches[0].y;
    mouseDragged();
  }
  return false;
}

function touchEnded() {
  mouseReleased();
  return false;
}

// ---- Button actions ----
function doCheck() {
  if (checked) return;
  checked = true;
  feedbackCard = -1;
  let roundCorrect = 0;
  let roundTotal = 0;

  for (let i = 0; i < cards.length; i++) {
    let c = cards[i];
    if (c.bin === null) {
      c.correct = null; // not placed
      continue;
    }
    roundTotal++;
    let isCorrect = (c.truthy && c.bin === 'truthy') || (!c.truthy && c.bin === 'falsy');
    c.correct = isCorrect;
    if (isCorrect) roundCorrect++;
  }

  score += roundCorrect;
  totalAttempted += roundTotal;
}

function doNewRound() {
  generateRound();
}

function doHint() {
  if (checked) return;
  hintIndex = -1;

  // Find a card that is placed in the wrong bin
  for (let i = 0; i < cards.length; i++) {
    let c = cards[i];
    if (c.bin !== null) {
      let isCorrect = (c.truthy && c.bin === 'truthy') || (!c.truthy && c.bin === 'falsy');
      if (!isCorrect) {
        hintIndex = i;
        return;
      }
    }
  }

  // If no wrong placements found, find a card that hasn't been placed yet
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].bin === null) {
      hintIndex = i;
      return;
    }
  }
}

// ---- Utility ----
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

// ---- Responsive resize ----
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionButtons();

  // Re-layout unplaced cards
  let cardW = computeCardWidth();
  let gapX = 12;
  let gapY = 14;
  let cols = 4;
  let totalW = cols * cardW + (cols - 1) * gapX;
  let startX = (canvasWidth - totalW) / 2;
  let startY = 70;

  let unplaced = 0;
  for (let i = 0; i < cards.length; i++) {
    cards[i].w = cardW;
    if (cards[i].bin === null) {
      let row = Math.floor(unplaced / cols);
      let col = unplaced % cols;
      cards[i].x = startX + col * (cardW + gapX);
      cards[i].y = startY + row * (cards[i].h + gapY);
      cards[i].homeX = cards[i].x;
      cards[i].homeY = cards[i].y;
      unplaced++;
    }
  }

  // Re-snap binned cards
  computeBins();
  reSnapBinnedCards('truthy', truthyBin);
  reSnapBinnedCards('falsy', falsyBin);
}

function reSnapBinnedCards(binName, bin) {
  let cardsInBin = [];
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].bin === binName) cardsInBin.push(i);
  }

  let cols = Math.max(2, Math.floor((bin.w - 16) / (computeCardWidth() + 6)));
  let startX = bin.x + 12;
  let startY = bin.y + 32;
  let gapX = 6;
  let gapY = 6;
  let cw = computeCardWidth();

  for (let j = 0; j < cardsInBin.length; j++) {
    let row = Math.floor(j / cols);
    let col = j % cols;
    cards[cardsInBin[j]].x = startX + col * (cw + gapX);
    cards[cardsInBin[j]].y = startY + row * (cards[0].h + gapY);
  }
}
