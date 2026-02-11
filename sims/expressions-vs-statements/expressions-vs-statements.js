// Expressions vs. Statements — Drag-and-Drop Classification MicroSim
// Bloom Level: Understand (L2) — classify, distinguish
// Students drag code fragment cards to the correct zone: Expression or Statement

// === Layout constants ===
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// === Code fragment data ===
// Each item: { code, type ("expression" | "statement"), explanation }
let fragments = [
  { code: '2 + 3',             type: 'expression', explanation: 'Arithmetic that produces a value (5).' },
  { code: 'x = 10',            type: 'statement',  explanation: 'Assignment performs an action — it stores 10 in x.' },
  { code: 'print("hi")',       type: 'statement',  explanation: 'print() performs the action of displaying text.' },
  { code: 'len("hello")',      type: 'expression', explanation: 'len() returns a value (5).' },
  { code: 'score > 100',       type: 'expression', explanation: 'A comparison that produces True or False.' },
  { code: 'name = input("?")', type: 'statement',  explanation: 'Assignment stores the result — that is an action.' },
  { code: '7 * 8',             type: 'expression', explanation: 'Multiplication that produces a value (56).' },
  { code: 'x += 1',            type: 'statement',  explanation: '+= is shorthand assignment — it changes x.' },
  { code: 'True',              type: 'expression', explanation: 'A literal value — it evaluates to itself.' },
  { code: '"hello" + " world"',type: 'expression', explanation: 'String concatenation that produces "hello world".' }
];

// === Game state ===
let currentIndex = 0;        // which fragment is being shown
let score = 0;               // correct answers so far
let totalCards;               // total number of fragments
let gameOver = false;

// Card being dragged
let cardX, cardY;            // current card position
let cardHomeX, cardHomeY;    // resting position (center)
let cardW = 220;
let cardH = 50;
let dragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

// Feedback state
let feedbackText = '';
let feedbackColor;
let feedbackTimer = 0;       // frames remaining to show feedback
let feedbackDuration = 90;   // ~1.5 seconds at 60fps
let lastResult = '';         // 'correct' or 'wrong'
let wrongFlashTimer = 0;     // red flash on wrong answer

// Drop zones
let exprZone = {};           // { x, y, w, h }
let stmtZone = {};           // { x, y, w, h }

// Completed cards stored in each zone
let exprCompleted = [];      // array of fragment indices
let stmtCompleted = [];

// Button
let resetButton;

// === p5.js lifecycle ===

function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    canvasWidth = Math.min(mainEl.clientWidth, 800);
    canvasWidth = Math.max(canvasWidth, 380);
  }
  // Recalculate card width relative to canvas
  cardW = Math.min(240, canvasWidth * 0.5);
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  totalCards = fragments.length;

  // Shuffle fragments for variety on each play
  shuffleFragments();

  // Initialize card home position (set in computeLayout)
  computeLayout();

  // Reset button
  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(doReset);
  resetButton.style('font-size', '14px');
  resetButton.style('padding', '6px 16px');
  resetButton.style('cursor', 'pointer');

  describe('Drag-and-drop game where students classify Python code fragments as expressions or statements.');
}

function draw() {
  // --- Draw area ---
  fill('aliceblue');
  noStroke();
  rect(0, 0, canvasWidth, drawHeight);

  // --- Control area ---
  fill('white');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Position reset button in control area
  resetButton.position(canvasWidth / 2 - 35, drawHeight + 12);

  // Recompute layout each frame so resize works smoothly
  computeLayout();

  // --- Title ---
  noStroke();
  fill(40);
  textSize(Math.max(18, Math.min(24, canvasWidth * 0.042)));
  textAlign(CENTER, TOP);
  text('Expressions vs. Statements', canvasWidth / 2, 8);

  // --- Definitions ---
  textSize(Math.max(13, Math.min(16, canvasWidth * 0.03)));
  fill(60, 60, 180);
  textAlign(CENTER, TOP);
  text('Expression = produces a value', canvasWidth / 2, 36);
  fill(30, 130, 60);
  text('Statement = performs an action', canvasWidth / 2, 54);

  // --- Progress bar ---
  drawProgressBar();

  // --- Drop zones ---
  drawDropZones();

  // --- Completed cards stacked inside zones ---
  drawCompletedCards();

  // --- Feedback text ---
  if (feedbackTimer > 0) {
    feedbackTimer--;
    noStroke();
    fill(feedbackColor);
    textSize(Math.max(14, Math.min(17, canvasWidth * 0.032)));
    textAlign(CENTER, TOP);
    text(feedbackText, canvasWidth / 2, 95);
  }

  // --- Current draggable card or end screen ---
  if (gameOver) {
    drawEndScreen();
  } else if (currentIndex < totalCards) {
    drawCurrentCard();
  }

  // Decrement wrong flash
  if (wrongFlashTimer > 0) wrongFlashTimer--;
}

// === Layout computation ===

function computeLayout() {
  let zoneW = (canvasWidth - margin * 3) / 2;
  let zoneH = 130;
  let zoneY = drawHeight - zoneH - 15;

  exprZone = { x: margin, y: zoneY, w: zoneW, h: zoneH };
  stmtZone = { x: margin * 2 + zoneW, y: zoneY, w: zoneW, h: zoneH };

  // Card home position: centered above the zones
  cardHomeX = canvasWidth / 2 - cardW / 2;
  cardHomeY = 160;

  // If not dragging, keep card at home
  if (!dragging && !gameOver && currentIndex < totalCards) {
    cardX = cardHomeX;
    cardY = cardHomeY;
  }
}

// === Drawing helpers ===

function drawProgressBar() {
  let barX = margin;
  let barY = 76;
  let barW = canvasWidth - margin * 2;
  let barH = 14;
  let completed = exprCompleted.length + stmtCompleted.length;

  // Background
  noStroke();
  fill(210);
  rect(barX, barY, barW, barH, 7);

  // Filled portion
  if (completed > 0) {
    let fillW = (completed / totalCards) * barW;
    fill(80, 180, 120);
    rect(barX, barY, fillW, barH, 7);
  }

  // Label
  fill(40);
  textSize(11);
  textAlign(CENTER, CENTER);
  text(completed + ' / ' + totalCards, barX + barW / 2, barY + barH / 2);
}

function drawDropZones() {
  // Expression zone (blue)
  stroke(60, 100, 200);
  strokeWeight(2);
  fill(220, 230, 255, 180);
  rect(exprZone.x, exprZone.y, exprZone.w, exprZone.h, 10);

  noStroke();
  fill(40, 70, 180);
  textSize(Math.max(14, Math.min(18, canvasWidth * 0.034)));
  textAlign(CENTER, TOP);
  text('Expression', exprZone.x + exprZone.w / 2, exprZone.y + 6);

  // Statement zone (green)
  stroke(40, 140, 70);
  strokeWeight(2);
  fill(220, 255, 230, 180);
  rect(stmtZone.x, stmtZone.y, stmtZone.w, stmtZone.h, 10);

  noStroke();
  fill(20, 110, 50);
  textSize(Math.max(14, Math.min(18, canvasWidth * 0.034)));
  textAlign(CENTER, TOP);
  text('Statement', stmtZone.x + stmtZone.w / 2, stmtZone.y + 6);
}

function drawCompletedCards() {
  let smallH = 20;
  let smallPad = 3;

  // Expression zone completed cards
  let startY = exprZone.y + 28;
  for (let i = 0; i < exprCompleted.length; i++) {
    let frag = fragments[exprCompleted[i]];
    let cy = startY + i * (smallH + smallPad);
    if (cy + smallH > exprZone.y + exprZone.h - 4) break; // don't overflow
    noStroke();
    fill(180, 210, 255);
    rect(exprZone.x + 8, cy, exprZone.w - 16, smallH, 4);
    fill(30);
    textSize(Math.max(11, Math.min(13, canvasWidth * 0.024)));
    textAlign(CENTER, CENTER);
    text(frag.code, exprZone.x + exprZone.w / 2, cy + smallH / 2);
  }

  // Statement zone completed cards
  startY = stmtZone.y + 28;
  for (let i = 0; i < stmtCompleted.length; i++) {
    let frag = fragments[stmtCompleted[i]];
    let cy = startY + i * (smallH + smallPad);
    if (cy + smallH > stmtZone.y + stmtZone.h - 4) break;
    noStroke();
    fill(180, 255, 200);
    rect(stmtZone.x + 8, cy, stmtZone.w - 16, smallH, 4);
    fill(30);
    textSize(Math.max(11, Math.min(13, canvasWidth * 0.024)));
    textAlign(CENTER, CENTER);
    text(frag.code, stmtZone.x + stmtZone.w / 2, cy + smallH / 2);
  }
}

function drawCurrentCard() {
  let frag = fragments[currentIndex];

  // Card shadow
  noStroke();
  fill(0, 0, 0, 30);
  rect(cardX + 3, cardY + 3, cardW, cardH, 10);

  // Card background — flash red on wrong answer
  if (wrongFlashTimer > 0) {
    let flashAlpha = map(wrongFlashTimer, 0, 20, 0, 120);
    fill(255, 80, 80, flashAlpha);
  } else {
    fill(255, 252, 240);
  }
  stroke(120);
  strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 10);

  // Code text in monospace style
  noStroke();
  fill(30);
  textSize(Math.max(15, Math.min(19, canvasWidth * 0.036)));
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text(frag.code, cardX + cardW / 2, cardY + cardH / 2);
  textStyle(NORMAL);

  // Instruction hint below card (only if not dragging)
  if (!dragging && feedbackTimer <= 0) {
    fill(130);
    textSize(Math.max(12, Math.min(14, canvasWidth * 0.026)));
    textAlign(CENTER, TOP);
    text('Drag this card to the correct zone below', canvasWidth / 2, cardY + cardH + 12);
  }
}

function drawEndScreen() {
  // Semi-transparent overlay
  noStroke();
  fill(255, 255, 255, 200);
  rect(margin, 120, canvasWidth - margin * 2, 160, 12);

  // Score display
  fill(40);
  textSize(Math.max(22, Math.min(28, canvasWidth * 0.05)));
  textAlign(CENTER, CENTER);
  text('All Done!', canvasWidth / 2, 155);

  let pct = Math.round((score / totalCards) * 100);
  textSize(Math.max(18, Math.min(24, canvasWidth * 0.042)));

  if (pct === 100) {
    fill(20, 140, 60);
    text('Perfect Score: ' + score + '/' + totalCards + ' (100%)', canvasWidth / 2, 195);
  } else if (pct >= 70) {
    fill(40, 100, 180);
    text('Score: ' + score + '/' + totalCards + ' (' + pct + '%)', canvasWidth / 2, 195);
  } else {
    fill(180, 60, 40);
    text('Score: ' + score + '/' + totalCards + ' (' + pct + '%)', canvasWidth / 2, 195);
  }

  // Encouragement
  fill(80);
  textSize(Math.max(14, Math.min(17, canvasWidth * 0.032)));
  if (pct === 100) {
    text('You nailed every single one!', canvasWidth / 2, 235);
  } else if (pct >= 70) {
    text('Nice work! Try again for a perfect score.', canvasWidth / 2, 235);
  } else {
    text('Keep practicing — you will get there!', canvasWidth / 2, 235);
  }

  fill(110);
  textSize(Math.max(12, Math.min(14, canvasWidth * 0.026)));
  text('Press Reset to play again.', canvasWidth / 2, 262);
}

// === Drag interaction ===

function mousePressed() {
  if (gameOver || currentIndex >= totalCards) return;
  if (feedbackTimer > 0) return; // wait for feedback to clear

  // Check if mouse is on the current card
  if (mouseX >= cardX && mouseX <= cardX + cardW &&
      mouseY >= cardY && mouseY <= cardY + cardH) {
    dragging = true;
    dragOffsetX = mouseX - cardX;
    dragOffsetY = mouseY - cardY;
  }
}

function mouseDragged() {
  if (!dragging) return;
  cardX = mouseX - dragOffsetX;
  cardY = mouseY - dragOffsetY;
}

function mouseReleased() {
  if (!dragging) return;
  dragging = false;

  let frag = fragments[currentIndex];

  // Check if card center is inside a drop zone
  let cx = cardX + cardW / 2;
  let cy = cardY + cardH / 2;

  let droppedExpr = isInsideRect(cx, cy, exprZone);
  let droppedStmt = isInsideRect(cx, cy, stmtZone);

  if (droppedExpr || droppedStmt) {
    let chosenType = droppedExpr ? 'expression' : 'statement';

    if (chosenType === frag.type) {
      // Correct!
      score++;
      feedbackColor = color(20, 140, 60);
      feedbackText = 'Correct! ' + frag.explanation;
      feedbackTimer = feedbackDuration;
      lastResult = 'correct';

      // Add to completed list
      if (frag.type === 'expression') {
        exprCompleted.push(currentIndex);
      } else {
        stmtCompleted.push(currentIndex);
      }

      // Advance to next card
      currentIndex++;
      if (currentIndex >= totalCards) {
        gameOver = true;
      }
    } else {
      // Wrong — bounce back with hint
      wrongFlashTimer = 20;
      feedbackColor = color(200, 50, 30);
      let hint = frag.type === 'expression'
        ? 'Hint: Does this produce a value? Think again!'
        : 'Hint: Does this perform an action? Think again!';
      feedbackText = 'Not quite. ' + hint;
      feedbackTimer = feedbackDuration;
      lastResult = 'wrong';
    }
  }

  // Snap card back to home position
  cardX = cardHomeX;
  cardY = cardHomeY;
}

// Also handle touch events for mobile
function touchStarted() {
  // p5.js maps touch to mouse, but we call mousePressed for safety
  if (touches.length > 0) {
    mousePressed();
  }
  return false; // prevent default
}

function touchMoved() {
  if (touches.length > 0) {
    mouseDragged();
  }
  return false;
}

function touchEnded() {
  mouseReleased();
  return false;
}

// === Utility functions ===

function isInsideRect(px, py, zone) {
  return px >= zone.x && px <= zone.x + zone.w &&
         py >= zone.y && py <= zone.y + zone.h;
}

function shuffleFragments() {
  // Fisher-Yates shuffle
  for (let i = fragments.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = fragments[i];
    fragments[i] = fragments[j];
    fragments[j] = temp;
  }
}

function doReset() {
  currentIndex = 0;
  score = 0;
  gameOver = false;
  feedbackText = '';
  feedbackTimer = 0;
  lastResult = '';
  wrongFlashTimer = 0;
  exprCompleted = [];
  stmtCompleted = [];
  dragging = false;
  shuffleFragments();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  computeLayout();
}
