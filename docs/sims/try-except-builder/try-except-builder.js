// Try-Except Block Builder - Drag & Drop Code Placement
// Students construct try-except blocks by placing code in correct zones
// Apply (L3): construct, implement
// MicroSim template version 2026.02

let canvasWidth = 400;
let drawHeight = 520;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

// Rounds data
const ROUNDS = [
  {
    title: 'Round 1: Safe Input',
    exceptType: 'ValueError',
    cards: [
      { code: 'user_input = input("Enter age: ")', zone: 'try' },
      { code: 'age = int(user_input)', zone: 'try' },
      { code: 'print("Invalid input")', zone: 'except' },
      { code: 'print(f"Age: {age}")', zone: 'try' }
    ],
    successOutput: 'Enter age: 16\nAge: 16',
    errorOutput: 'Enter age: abc\nInvalid input'
  },
  {
    title: 'Round 2: Safe List Access',
    exceptType: 'IndexError',
    cards: [
      { code: 'items = [1, 2, 3]', zone: 'try' },
      { code: 'print(items[index])', zone: 'try' },
      { code: 'print("Index out of range")', zone: 'except' },
      { code: 'index = int(input("Index: "))', zone: 'try' }
    ],
    successOutput: 'Index: 1\n2',
    errorOutput: 'Index: 10\nIndex out of range'
  },
  {
    title: 'Round 3: Safe File Read',
    exceptType: 'FileNotFoundError',
    cards: [
      { code: 'file = open("data.txt")', zone: 'try' },
      { code: 'content = file.read()', zone: 'try' },
      { code: 'print("File not found")', zone: 'except' },
      { code: 'print(content)', zone: 'try' }
    ],
    successOutput: 'Hello, World!',
    errorOutput: 'File not found'
  }
];

let currentRound = 0;
let score = 0;
let totalAttempts = 0;

// Card state
let cards = [];
let dragging = null;
let dragOffX = 0;
let dragOffY = 0;

// Zone definitions (calculated in draw)
let zones = {};
let bankZone = {};

// Feedback state
let feedback = null; // { correct: bool, text: string }
let showOutput = false;
let outputText = '';

// Buttons
let checkBtn, runBtn, nextBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  checkBtn = createButton('Check');
  checkBtn.mousePressed(checkAnswer);

  runBtn = createButton('Run Code');
  runBtn.mousePressed(runCode);
  runBtn.hide();

  nextBtn = createButton('Next Round');
  nextBtn.mousePressed(nextRound);
  nextBtn.hide();

  initRound();

  describe('Try-Except Block Builder. Drag code cards into the correct try or except zones to build exception handling blocks.', LABEL);
}

function initRound() {
  let round = ROUNDS[currentRound];
  cards = [];
  feedback = null;
  showOutput = false;
  outputText = '';

  // Shuffle the cards
  let shuffled = [...round.cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  for (let i = 0; i < shuffled.length; i++) {
    cards.push({
      code: shuffled[i].code,
      correctZone: shuffled[i].zone,
      currentZone: 'bank',
      x: 0, y: 0,
      w: 0, h: 30,
      placed: false
    });
  }

  checkBtn.show();
  runBtn.hide();
  nextBtn.hide();
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
  text('Try-Except Block Builder', canvasWidth / 2, 6);

  // Round title and score
  textSize(13);
  fill(80);
  textAlign(LEFT, TOP);
  let round = ROUNDS[currentRound];
  text(round.title, margin, 30);
  textAlign(RIGHT, TOP);
  text('Score: ' + score + ' / ' + totalAttempts, canvasWidth - margin, 30);

  // Calculate layout
  let zoneTop = 50;
  let zoneW = canvasWidth - 2 * margin;
  let tryH = 100;
  let exceptH = 60;
  let zoneGap = 6;

  // Try zone
  zones.try = { x: margin, y: zoneTop, w: zoneW, h: tryH };
  drawZone(zones.try, 'try:', [70, 130, 220], [220, 235, 255]);

  // Except zone
  zones.except = { x: margin, y: zoneTop + tryH + zoneGap, w: zoneW, h: exceptH };
  drawZone(zones.except, 'except ' + round.exceptType + ':', [200, 60, 60], [255, 225, 225]);

  // Bank zone
  let bankTop = zones.except.y + zones.except.h + zoneGap + 4;
  let bankH = 140;
  bankZone = { x: margin, y: bankTop, w: zoneW, h: bankH };

  // Draw bank
  fill(245);
  stroke(180);
  strokeWeight(1);
  rect(bankZone.x, bankZone.y, bankZone.w, bankZone.h, 6);
  noStroke();
  fill(120);
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(BOLD);
  text('Code Bank — drag cards into the zones above', bankZone.x + 8, bankZone.y + 5);
  textStyle(NORMAL);

  // Position cards that are in zones
  positionCardsInZones();

  // Draw cards (non-dragging first)
  for (let c of cards) {
    if (c !== dragging) drawCard(c);
  }
  // Draw dragging card on top
  if (dragging) drawCard(dragging);

  // Feedback area
  let fbY = bankZone.y + bankZone.h + 8;
  if (feedback) {
    let fbH = showOutput ? 105 : 55;
    if (feedback.correct) {
      fill(220, 255, 220, 240);
      stroke(0, 150, 0);
    } else {
      fill(255, 220, 220, 240);
      stroke(200, 0, 0);
    }
    strokeWeight(2);
    rect(margin, fbY, zoneW, fbH, 6);

    noStroke();
    textAlign(LEFT, TOP);
    if (feedback.correct) {
      fill(0, 130, 0);
      textSize(14);
      textStyle(BOLD);
      text('Correct!', margin + 10, fbY + 8);
      textStyle(NORMAL);
      fill(60);
      textSize(12);
      text(feedback.text, margin + 10, fbY + 28);
    } else {
      fill(180, 0, 0);
      textSize(14);
      textStyle(BOLD);
      text('Not quite!', margin + 10, fbY + 8);
      textStyle(NORMAL);
      fill(60);
      textSize(12);
      text(feedback.text, margin + 10, fbY + 28);
    }

    if (showOutput) {
      fill(40, 44, 52);
      noStroke();
      rect(margin + 10, fbY + 50, zoneW - 20, 48, 4);
      fill(180, 220, 180);
      textFont('monospace');
      textSize(11);
      let outLines = outputText.split('\n');
      for (let i = 0; i < outLines.length; i++) {
        text(outLines[i], margin + 18, fbY + 58 + i * 14);
      }
      textFont('sans-serif');
    }
  }

  // Position buttons
  let btnY = drawHeight + 12;
  let btnSpacing = canvasWidth / 4;
  checkBtn.position(btnSpacing - 30, btnY);
  runBtn.position(btnSpacing * 2 - 35, btnY);
  nextBtn.position(btnSpacing * 3 - 40, btnY);
}

function drawZone(zone, label, borderColor, bgColor) {
  // Background
  fill(bgColor[0], bgColor[1], bgColor[2]);
  stroke(borderColor[0], borderColor[1], borderColor[2]);

  // Highlight if dragging over
  let isOver = dragging && mouseX > zone.x && mouseX < zone.x + zone.w &&
               mouseY > zone.y && mouseY < zone.y + zone.h;
  strokeWeight(isOver ? 3 : 1.5);
  if (isOver) {
    fill(bgColor[0] - 15, bgColor[1] - 15, bgColor[2] - 15);
  }

  rect(zone.x, zone.y, zone.w, zone.h, 6);

  // Label
  noStroke();
  fill(borderColor[0], borderColor[1], borderColor[2]);
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(BOLD);
  textFont('monospace');
  text(label, zone.x + 8, zone.y + 5);
  textFont('sans-serif');
  textStyle(NORMAL);
}

function positionCardsInZones() {
  let cardH = 30;
  let gap = 4;

  // Cards in try zone
  let tryCards = cards.filter(c => c.currentZone === 'try' && c !== dragging);
  let tryStartY = zones.try.y + 24;
  for (let i = 0; i < tryCards.length; i++) {
    tryCards[i].x = zones.try.x + 12;
    tryCards[i].y = tryStartY + i * (cardH + gap);
    tryCards[i].w = zones.try.w - 24;
  }

  // Cards in except zone
  let excCards = cards.filter(c => c.currentZone === 'except' && c !== dragging);
  let excStartY = zones.except.y + 24;
  for (let i = 0; i < excCards.length; i++) {
    excCards[i].x = zones.except.x + 12;
    excCards[i].y = excStartY + i * (cardH + gap);
    excCards[i].w = zones.except.w - 24;
  }

  // Cards in bank
  let bankCards = cards.filter(c => c.currentZone === 'bank' && c !== dragging);
  let bankStartY = bankZone.y + 22;
  for (let i = 0; i < bankCards.length; i++) {
    bankCards[i].x = bankZone.x + 10;
    bankCards[i].y = bankStartY + i * (cardH + gap);
    bankCards[i].w = bankZone.w - 20;
  }
}

function drawCard(card) {
  let isHover = !dragging && mouseX > card.x && mouseX < card.x + card.w &&
                mouseY > card.y && mouseY < card.y + card.h;

  // Shadow for dragging card
  if (card === dragging) {
    fill(0, 0, 0, 30);
    noStroke();
    rect(card.x + 3, card.y + 3, card.w, card.h, 6);
  }

  // Card background
  if (card === dragging) {
    fill(255, 255, 220);
    stroke(180, 150, 0);
    strokeWeight(2);
  } else if (isHover) {
    fill(255, 250, 230);
    stroke(160, 130, 0);
    strokeWeight(2);
    cursor(HAND);
  } else {
    fill(255);
    stroke(180);
    strokeWeight(1);
  }
  rect(card.x, card.y, card.w, card.h, 6);

  // Code text
  noStroke();
  fill(40);
  textAlign(LEFT, CENTER);
  textSize(12);
  textFont('monospace');
  text(card.code, card.x + 10, card.y + card.h / 2);
  textFont('sans-serif');
}

function checkAnswer() {
  let round = ROUNDS[currentRound];
  let allCorrect = true;

  // Check if all cards are placed correctly
  for (let c of cards) {
    if (c.currentZone !== c.correctZone) {
      allCorrect = false;
      break;
    }
  }

  // Also check that no cards remain in bank
  let bankCards = cards.filter(c => c.currentZone === 'bank');
  if (bankCards.length > 0) {
    allCorrect = false;
  }

  totalAttempts++;
  if (allCorrect) {
    score++;
    feedback = {
      correct: true,
      text: 'All code is in the right place! Click "Run Code" to see it work.'
    };
    runBtn.show();
    checkBtn.hide();
  } else {
    feedback = {
      correct: false,
      text: 'Some cards are in the wrong zone. Think about which lines might raise a ' + round.exceptType + '.'
    };
  }
}

function runCode() {
  let round = ROUNDS[currentRound];
  showOutput = true;
  outputText = 'Success path:\n' + round.successOutput + '\n\nError path:\n' + round.errorOutput;
  runBtn.hide();
  nextBtn.show();
}

function nextRound() {
  currentRound++;
  if (currentRound >= ROUNDS.length) {
    currentRound = 0;
    score = 0;
    totalAttempts = 0;
  }
  initRound();
}

function mousePressed() {
  if (feedback && feedback.correct) return; // locked after correct

  for (let i = cards.length - 1; i >= 0; i--) {
    let c = cards[i];
    if (mouseX > c.x && mouseX < c.x + c.w &&
        mouseY > c.y && mouseY < c.y + c.h) {
      dragging = c;
      dragOffX = mouseX - c.x;
      dragOffY = mouseY - c.y;
      // Move to end of array so it draws on top
      cards.splice(i, 1);
      cards.push(c);
      return;
    }
  }
}

function mouseDragged() {
  if (dragging) {
    dragging.x = mouseX - dragOffX;
    dragging.y = mouseY - dragOffY;
  }
}

function mouseReleased() {
  if (!dragging) return;

  // Check which zone the card was dropped into
  let dropped = false;

  // Try zone
  if (mouseX > zones.try.x && mouseX < zones.try.x + zones.try.w &&
      mouseY > zones.try.y && mouseY < zones.try.y + zones.try.h) {
    dragging.currentZone = 'try';
    dropped = true;
  }

  // Except zone
  if (mouseX > zones.except.x && mouseX < zones.except.x + zones.except.w &&
      mouseY > zones.except.y && mouseY < zones.except.y + zones.except.h) {
    dragging.currentZone = 'except';
    dropped = true;
  }

  // Bank zone (or anywhere else)
  if (!dropped) {
    if (mouseX > bankZone.x && mouseX < bankZone.x + bankZone.w &&
        mouseY > bankZone.y && mouseY < bankZone.y + bankZone.h) {
      dragging.currentZone = 'bank';
    } else {
      dragging.currentZone = 'bank';
    }
  }

  // Clear feedback when rearranging
  feedback = null;
  showOutput = false;

  dragging = null;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
