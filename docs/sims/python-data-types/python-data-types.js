// Python Data Types Overview - Interactive MicroSim
// Bloom Level: Remember (L1) - identify, classify
// Students identify the four fundamental Python data types and classify
// example values into the correct type using drag-and-drop.

let canvasWidth = 400;
let drawHeight = 550;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// --------------- Data Type Definitions ---------------

const typeCards = [
  {
    name: 'Integer',
    keyword: 'int',
    color: [60, 120, 210],        // blue
    examples: ['42', '-7', '0', '1000'],
    iconType: 'blocks'
  },
  {
    name: 'Float',
    keyword: 'float',
    color: [34, 160, 80],         // green
    examples: ['3.14', '-0.5', '2.0', '99.99'],
    iconType: 'ruler'
  },
  {
    name: 'Boolean',
    keyword: 'bool',
    color: [220, 140, 30],        // orange
    examples: ['True', 'False'],
    iconType: 'switch'
  },
  {
    name: 'String',
    keyword: 'str',
    color: [130, 60, 180],        // purple
    examples: ['"hello"', "'Python'", '""', '"42"'],
    iconType: 'bubble'
  }
];

// --------------- Value Pools for the Sorter ---------------
// Each object: { display, correctType (0=int, 1=float, 2=bool, 3=str) }

const allValues = [
  // Integers
  { display: '42',       correctType: 0 },
  { display: '-7',       correctType: 0 },
  { display: '0',        correctType: 0 },
  { display: '1000',     correctType: 0 },
  { display: '255',      correctType: 0 },
  { display: '-100',     correctType: 0 },
  { display: '1',        correctType: 0 },
  { display: '999',      correctType: 0 },
  // Floats
  { display: '3.14',     correctType: 1 },
  { display: '-0.5',     correctType: 1 },
  { display: '2.0',      correctType: 1 },
  { display: '99.99',    correctType: 1 },
  { display: '0.001',    correctType: 1 },
  { display: '-3.7',     correctType: 1 },
  { display: '1.0',      correctType: 1 },
  { display: '0.0',      correctType: 1 },
  // Booleans
  { display: 'True',     correctType: 2 },
  { display: 'False',    correctType: 2 },
  // Strings
  { display: '"hello"',  correctType: 3 },
  { display: "'Python'", correctType: 3 },
  { display: '""',       correctType: 3 },
  { display: '"42"',     correctType: 3 },
  { display: '"3.14"',   correctType: 3 },
  { display: '"True"',   correctType: 3 },
  { display: '"hi!"',    correctType: 3 },
  { display: "'code'",   correctType: 3 }
];

// --------------- Runtime State ---------------

let roundValues = [];    // 8 draggable value objects for current round
let dragIndex = -1;      // index into roundValues currently being dragged
let dragOffsetX = 0;
let dragOffsetY = 0;
let score = 0;
let totalAttempts = 0;
let roundComplete = false;

// Button
let newRoundBtn;

// Card region cache (filled each frame for responsive layout)
let cardRegions = [];    // [{x, y, w, h}, ...] for the 4 type cards

// Divider Y between cards and sorter area
let sorterY = 0;

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.min(container.offsetWidth, 700);
    canvasWidth = Math.max(canvasWidth, 360);
  }
  canvasHeight = drawHeight + controlHeight;
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  // New Round button
  newRoundBtn = createButton('New Round');
  newRoundBtn.parent(document.querySelector('main'));
  newRoundBtn.mousePressed(startNewRound);
  newRoundBtn.style('font-size', '14px');
  newRoundBtn.style('padding', '6px 16px');
  newRoundBtn.style('cursor', 'pointer');

  startNewRound();

  describe('Interactive Python data types explorer with four colored type cards and a drag-and-drop sorting challenge.');
}

// --------------- New Round Logic ---------------

function startNewRound() {
  roundValues = [];
  roundComplete = false;

  // Pick 2 values per type so each type is represented
  let pool = { 0: [], 1: [], 2: [], 3: [] };
  for (let v of allValues) {
    pool[v.correctType].push(v);
  }

  for (let t = 0; t < 4; t++) {
    let available = pool[t].slice(); // copy
    shuffleArray(available);
    // Booleans only have 2 values total, so take min(2, available)
    let count = t === 2 ? Math.min(2, available.length) : 2;
    for (let i = 0; i < count; i++) {
      roundValues.push({
        display: available[i].display,
        correctType: available[i].correctType,
        x: 0, y: 0,       // will be set by layoutSorterValues
        homeX: 0, homeY: 0,
        w: 0, h: 0,
        sorted: false,
        correct: false,
        shakeTimer: 0
      });
    }
  }

  shuffleArray(roundValues);
  layoutSorterValues();
}

// Position draggable values in the sorter area
function layoutSorterValues() {
  let sorterAreaY = sorterY + 30;
  let sorterAreaH = drawHeight - sorterAreaY - 10;
  let cols = 4;
  let rows = 2;
  let cellW = (canvasWidth - margin * 2) / cols;
  let cellH = sorterAreaH / rows;
  let valW = Math.min(cellW - 12, 110);
  let valH = 32;

  for (let i = 0; i < roundValues.length; i++) {
    let col = i % cols;
    let row = Math.floor(i / cols);
    let cx = margin + col * cellW + cellW / 2;
    let cy = sorterAreaY + row * cellH + cellH / 2;
    roundValues[i].x = cx - valW / 2;
    roundValues[i].y = cy - valH / 2;
    roundValues[i].homeX = cx - valW / 2;
    roundValues[i].homeY = cy - valH / 2;
    roundValues[i].w = valW;
    roundValues[i].h = valH;
  }
}

// --------------- Draw ---------------

function draw() {
  updateCanvasSize();

  // Background
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
  fill('#333');
  textAlign(CENTER, TOP);
  textSize(Math.max(20, canvasWidth * 0.04));
  textStyle(BOLD);
  text('Python Data Types', canvasWidth / 2, 10);
  textStyle(NORMAL);

  // Draw the 2x2 type cards
  drawTypeCards();

  // Divider label
  sorterY = margin + 10 + cardRegions[0].h + cardRegions[0].h + 30;
  noStroke();
  fill('#555');
  textAlign(CENTER, TOP);
  textSize(Math.max(16, canvasWidth * 0.032));
  textStyle(BOLD);
  text('Type Sorter Challenge', canvasWidth / 2, sorterY - 4);
  textStyle(NORMAL);

  // Instruction
  fill('#888');
  textSize(Math.max(12, canvasWidth * 0.025));
  text('Drag each value to the correct type card above', canvasWidth / 2, sorterY + 16);

  // Layout sorter values responsively
  layoutSorterValues();

  // Update shake timers
  for (let v of roundValues) {
    if (v.shakeTimer > 0) v.shakeTimer--;
  }

  // Draw non-dragged values first, then the dragged one on top
  for (let i = 0; i < roundValues.length; i++) {
    if (i !== dragIndex) drawValueChip(roundValues[i]);
  }
  if (dragIndex >= 0 && dragIndex < roundValues.length) {
    drawValueChip(roundValues[dragIndex]);
  }

  // Score display in control area
  noStroke();
  fill('#333');
  textAlign(LEFT, CENTER);
  textSize(16);
  text('Score: ' + score + ' / ' + totalAttempts, margin, drawHeight + controlHeight / 2);

  // Round complete message
  if (checkRoundComplete() && !roundComplete) {
    roundComplete = true;
  }
  if (roundComplete) {
    noStroke();
    fill(0, 150, 60);
    textAlign(CENTER, CENTER);
    textSize(Math.max(16, canvasWidth * 0.032));
    textStyle(BOLD);
    text('All sorted! Great job!', canvasWidth / 2, sorterY + 45);
    textStyle(NORMAL);
  }

  // Position button
  positionButton();
}

// --------------- Draw Type Cards (2x2 grid) ---------------

function drawTypeCards() {
  let gridTop = 40;
  let gap = 8;
  let totalW = canvasWidth - margin * 2;
  let cardW = (totalW - gap) / 2;
  let cardH = Math.max(100, (drawHeight * 0.38 - gridTop) / 2 - gap);

  cardRegions = [];

  for (let i = 0; i < 4; i++) {
    let col = i % 2;
    let row = Math.floor(i / 2);
    let cx = margin + col * (cardW + gap);
    let cy = gridTop + row * (cardH + gap);

    cardRegions.push({ x: cx, y: cy, w: cardW, h: cardH });

    let tc = typeCards[i];
    let r = tc.color[0], g = tc.color[1], b = tc.color[2];

    // Check if any sorted value is hovering over this card (green glow)
    let hasCorrectDrop = false;
    for (let v of roundValues) {
      if (v.sorted && v.correct && v.correctType === i) {
        hasCorrectDrop = true;
        break;
      }
    }

    // Card shadow
    noStroke();
    fill(0, 0, 0, 20);
    rect(cx + 3, cy + 3, cardW, cardH, 10);

    // Card background
    fill(r, g, b);
    stroke(255, 255, 255, 80);
    strokeWeight(2);
    rect(cx, cy, cardW, cardH, 10);

    // Highlight glow if dragging over this card
    if (dragIndex >= 0) {
      let dv = roundValues[dragIndex];
      let dvCx = dv.x + dv.w / 2;
      let dvCy = dv.y + dv.h / 2;
      if (dvCx > cx && dvCx < cx + cardW && dvCy > cy && dvCy < cy + cardH) {
        noFill();
        stroke(255, 255, 255, 150);
        strokeWeight(3);
        rect(cx - 2, cy - 2, cardW + 4, cardH + 4, 12);
      }
    }

    // Draw icon in top-right corner
    drawTypeIcon(tc.iconType, cx + cardW - 28, cy + 22, r, g, b);

    // Type name (large)
    noStroke();
    fill(255);
    textAlign(LEFT, TOP);
    textSize(Math.max(18, cardW * 0.14));
    textStyle(BOLD);
    text(tc.name, cx + 10, cy + 8);
    textStyle(NORMAL);

    // Keyword
    fill(255, 255, 255, 200);
    textSize(Math.max(13, cardW * 0.1));
    textStyle(ITALIC);
    text(tc.keyword, cx + 10, cy + 32);
    textStyle(NORMAL);

    // Example values
    fill(255, 255, 255, 220);
    textSize(Math.max(12, cardW * 0.085));
    let exStr = tc.examples.join('   ');
    text(exStr, cx + 10, cy + 52);

    // Analogy label
    fill(255, 255, 255, 160);
    textSize(Math.max(10, cardW * 0.07));
    let analogies = ['counting blocks', 'measuring ruler', 'on/off switch', 'speech bubble'];
    text(analogies[i], cx + 10, cy + cardH - 18);

    // Show sorted values stacked inside the card
    let sortedCount = 0;
    for (let v of roundValues) {
      if (v.sorted && v.correct && v.correctType === i) {
        // Draw small sorted chip inside card
        let chipX = cx + 10 + sortedCount * 60;
        let chipY = cy + cardH - 38;
        noStroke();
        fill(255, 255, 255, 200);
        rect(chipX, chipY, 54, 20, 5);
        fill(r, g, b);
        textAlign(CENTER, CENTER);
        textSize(12);
        textStyle(BOLD);
        text(v.display, chipX + 27, chipY + 10);
        textStyle(NORMAL);
        sortedCount++;
      }
    }
  }
}

// --------------- Draw Simple Icons ---------------

function drawTypeIcon(iconType, x, y, r, g, b) {
  // Draw simple icons using p5.js primitives
  // Slightly lighter/translucent version of card color as background
  let iconSize = 18;

  push();
  translate(x, y);
  noStroke();

  if (iconType === 'blocks') {
    // Counting blocks: 3 small stacked squares
    fill(255, 255, 255, 180);
    rect(-10, -4, 9, 9, 2);
    rect(-10, -14, 9, 9, 2);
    rect(0, -4, 9, 9, 2);
  } else if (iconType === 'ruler') {
    // Ruler: horizontal bar with tick marks
    fill(255, 255, 255, 180);
    rect(-12, -3, 24, 6, 2);
    stroke(r, g, b);
    strokeWeight(1.5);
    for (let t = -10; t <= 10; t += 5) {
      let tickH = (t === 0) ? 5 : 3;
      line(t, -3, t, -3 - tickH);
    }
  } else if (iconType === 'switch') {
    // Light switch: rounded rect with circle toggle
    fill(255, 255, 255, 180);
    rect(-8, -12, 16, 24, 4);
    fill(r, g, b);
    ellipse(0, -4, 10, 10);
  } else if (iconType === 'bubble') {
    // Speech bubble: rounded rect with tail
    fill(255, 255, 255, 180);
    rect(-12, -12, 24, 16, 6);
    triangle(-4, 4, 2, 4, -2, 10);
  }

  pop();
}

// --------------- Draw Draggable Value Chip ---------------

function drawValueChip(v) {
  if (v.sorted) return; // sorted values are drawn inside cards

  let shakeX = 0;
  if (v.shakeTimer > 0) {
    shakeX = sin(v.shakeTimer * 1.5) * 4;
  }

  let isBeingDragged = (roundValues.indexOf(v) === dragIndex);

  push();
  translate(shakeX, 0);

  // Shadow for dragged chip
  if (isBeingDragged) {
    noStroke();
    fill(0, 0, 0, 40);
    rect(v.x + 3, v.y + 3, v.w, v.h, 8);
  }

  // Chip background
  noStroke();
  if (isBeingDragged) {
    fill(255, 255, 230);
    stroke(200, 180, 50);
    strokeWeight(2);
  } else if (v.shakeTimer > 0) {
    fill(255, 220, 220);
    stroke(200, 80, 80);
    strokeWeight(2);
  } else {
    fill(255);
    stroke(180);
    strokeWeight(1);
  }
  rect(v.x, v.y, v.w, v.h, 8);

  // Value text (monospace style)
  noStroke();
  fill('#333');
  textAlign(CENTER, CENTER);
  textSize(Math.max(14, v.w * 0.14));
  textStyle(BOLD);
  text(v.display, v.x + v.w / 2, v.y + v.h / 2);
  textStyle(NORMAL);

  pop();
}

// --------------- Mouse Interaction ---------------

function mousePressed() {
  if (mouseX < 0 || mouseX > canvasWidth || mouseY < 0 || mouseY > canvasHeight) return;

  // Check if clicking on a value chip (unsorted)
  // Check in reverse order so top-drawn chips are picked first
  for (let i = roundValues.length - 1; i >= 0; i--) {
    let v = roundValues[i];
    if (v.sorted) continue;
    if (mouseX >= v.x && mouseX <= v.x + v.w &&
        mouseY >= v.y && mouseY <= v.y + v.h) {
      dragIndex = i;
      dragOffsetX = mouseX - v.x;
      dragOffsetY = mouseY - v.y;
      return;
    }
  }
}

function mouseDragged() {
  if (dragIndex < 0 || dragIndex >= roundValues.length) return;
  let v = roundValues[dragIndex];
  v.x = mouseX - dragOffsetX;
  v.y = mouseY - dragOffsetY;
}

function mouseReleased() {
  if (dragIndex < 0 || dragIndex >= roundValues.length) return;

  let v = roundValues[dragIndex];
  let vCx = v.x + v.w / 2;
  let vCy = v.y + v.h / 2;

  // Check if dropped on a type card
  let droppedOnCard = -1;
  for (let i = 0; i < cardRegions.length; i++) {
    let cr = cardRegions[i];
    if (vCx > cr.x && vCx < cr.x + cr.w && vCy > cr.y && vCy < cr.y + cr.h) {
      droppedOnCard = i;
      break;
    }
  }

  if (droppedOnCard >= 0) {
    totalAttempts++;
    if (droppedOnCard === v.correctType) {
      // Correct!
      v.sorted = true;
      v.correct = true;
      score++;
    } else {
      // Wrong - shake and bounce back
      v.shakeTimer = 20;
      v.x = v.homeX;
      v.y = v.homeY;
    }
  } else {
    // Dropped outside any card - return home
    v.x = v.homeX;
    v.y = v.homeY;
  }

  dragIndex = -1;
}

// Prevent default touch behavior for mobile drag
function touchStarted() {
  if (mouseX >= 0 && mouseX <= canvasWidth && mouseY >= 0 && mouseY <= canvasHeight) {
    mousePressed();
    return false; // prevent default
  }
}

function touchMoved() {
  mouseDragged();
  return false;
}

function touchEnded() {
  mouseReleased();
  return false;
}

// --------------- Helpers ---------------

function checkRoundComplete() {
  for (let v of roundValues) {
    if (!v.sorted) return false;
  }
  return true;
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function positionButton() {
  let mainEl = document.querySelector('main');
  if (!mainEl) return;
  let canvasEl = mainEl.querySelector('canvas');
  if (!canvasEl) return;
  let canvasRect = canvasEl.getBoundingClientRect();
  let mainRect = mainEl.getBoundingClientRect();
  let offsetX = canvasRect.left - mainRect.left;
  let offsetY = canvasRect.top - mainRect.top;
  newRoundBtn.position(
    offsetX + canvasWidth - margin - 100,
    offsetY + drawHeight + 10
  );
}

// --------------- Responsive ---------------

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  layoutSorterValues();
}
