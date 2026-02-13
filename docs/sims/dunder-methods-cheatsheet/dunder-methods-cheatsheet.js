// Dunder Methods Cheat Sheet - Interactive Reference Card
// Hover over operator cards to see dunder method, example, and description
// Click to pin cards for comparison
// MicroSim template version 2026.02

let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 40;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

let mouseOverCanvas = false;
let searchInput;
let searchTerm = '';
let hoveredCard = null;
let pinnedCards = [];

// Category definitions
const CATEGORIES = [
  { name: 'Comparison', color: [65, 105, 225], lightColor: [200, 215, 255] },
  { name: 'Arithmetic', color: [34, 139, 34], lightColor: [200, 240, 200] },
  { name: 'String/Display', color: [220, 130, 0], lightColor: [255, 220, 180] },
  { name: 'Iteration', color: [138, 43, 226], lightColor: [220, 190, 255] }
];

// Card data: operator, dunder method, example, description, category index
const CARDS = [
  // Comparison (0)
  { op: '==', dunder: '__eq__', example: 'a == b', desc: 'Check if two objects are equal', cat: 0 },
  { op: '!=', dunder: '__ne__', example: 'a != b', desc: 'Check if two objects are not equal', cat: 0 },
  { op: '<',  dunder: '__lt__', example: 'a < b',  desc: 'Check if a is less than b', cat: 0 },
  { op: '>',  dunder: '__gt__', example: 'a > b',  desc: 'Check if a is greater than b', cat: 0 },
  { op: '<=', dunder: '__le__', example: 'a <= b', desc: 'Check if a is less than or equal to b', cat: 0 },
  { op: '>=', dunder: '__ge__', example: 'a >= b', desc: 'Check if a is greater than or equal to b', cat: 0 },

  // Arithmetic (1)
  { op: '+',  dunder: '__add__', example: 'a + b',  desc: 'Add two objects together', cat: 1 },
  { op: '-',  dunder: '__sub__', example: 'a - b',  desc: 'Subtract b from a', cat: 1 },
  { op: '*',  dunder: '__mul__', example: 'a * b',  desc: 'Multiply two objects', cat: 1 },
  { op: '/',  dunder: '__truediv__', example: 'a / b', desc: 'Divide a by b (true division)', cat: 1 },
  { op: '//', dunder: '__floordiv__', example: 'a // b', desc: 'Floor division (integer result)', cat: 1 },
  { op: '%',  dunder: '__mod__', example: 'a % b',  desc: 'Modulo (remainder of division)', cat: 1 },
  { op: '**', dunder: '__pow__', example: 'a ** b', desc: 'Raise a to the power of b', cat: 1 },

  // String/Display (2)
  { op: 'str()', dunder: '__str__', example: 'str(obj)', desc: 'Human-readable string representation', cat: 2 },
  { op: 'repr()', dunder: '__repr__', example: 'repr(obj)', desc: 'Developer/debug string representation', cat: 2 },
  { op: 'len()', dunder: '__len__', example: 'len(obj)', desc: 'Return the length/size of object', cat: 2 },

  // Iteration (3)
  { op: 'iter()', dunder: '__iter__', example: 'iter(obj)', desc: 'Return an iterator for the object', cat: 3 },
  { op: 'next()', dunder: '__next__', example: 'next(it)', desc: 'Get the next item from iterator', cat: 3 }
];

let cardRects = []; // store card positions for hit testing

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  canvas.mouseOver(() => mouseOverCanvas = true);
  canvas.mouseOut(() => mouseOverCanvas = false);

  // Search input
  searchInput = createInput('');
  searchInput.position(70, drawHeight + 10);
  searchInput.size(canvasWidth - 100);
  searchInput.attribute('placeholder', 'Search operators or methods...');
  searchInput.input(() => { searchTerm = searchInput.value().toLowerCase(); });

  describe('Interactive dunder methods cheat sheet. Hover over operator cards to see the corresponding Python dunder method, code example, and description.', LABEL);
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

  // Search label
  noStroke();
  fill(0);
  textAlign(LEFT, CENTER);
  textSize(14);
  text('Search:', 10, drawHeight + 20);

  // Resize search input
  searchInput.size(canvasWidth - 100);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('Dunder Methods Cheat Sheet', canvasWidth / 2, 8);

  // Draw cards grid
  cardRects = [];
  hoveredCard = null;
  let y = 38;

  for (let catIdx = 0; catIdx < CATEGORIES.length; catIdx++) {
    let cat = CATEGORIES[catIdx];
    let catCards = CARDS.filter(c => c.cat === catIdx);

    // Filter by search
    if (searchTerm) {
      catCards = catCards.filter(c =>
        c.op.toLowerCase().includes(searchTerm) ||
        c.dunder.toLowerCase().includes(searchTerm) ||
        c.desc.toLowerCase().includes(searchTerm)
      );
      if (catCards.length === 0) continue;
    }

    // Category label
    noStroke();
    fill(cat.color[0], cat.color[1], cat.color[2]);
    textAlign(LEFT, TOP);
    textSize(13);
    textStyle(BOLD);
    text(cat.name, margin, y);
    textStyle(NORMAL);
    y += 18;

    // Calculate card layout
    let cardW = 70;
    let cardH = 55;
    let gap = 8;
    let maxCols = Math.floor((canvasWidth - 2 * margin + gap) / (cardW + gap));
    if (maxCols < 1) maxCols = 1;

    let col = 0;
    for (let card of catCards) {
      let cx = margin + col * (cardW + gap);
      let cy = y;

      // Check hover
      let isHovered = mouseX > cx && mouseX < cx + cardW &&
                      mouseY > cy && mouseY < cy + cardH;
      let isPinned = pinnedCards.includes(card.dunder);

      if (isHovered) {
        hoveredCard = card;
        cursor(HAND);
      }

      // Card background
      strokeWeight(isPinned ? 3 : isHovered ? 2 : 1);
      stroke(cat.color[0], cat.color[1], cat.color[2]);

      if (isPinned) {
        fill(cat.lightColor[0], cat.lightColor[1], cat.lightColor[2]);
      } else if (isHovered) {
        fill(cat.lightColor[0] - 10, cat.lightColor[1] - 10, cat.lightColor[2] - 10);
      } else {
        fill(255);
      }
      rect(cx, cy, cardW, cardH, 6);

      // Operator text
      noStroke();
      fill(cat.color[0], cat.color[1], cat.color[2]);
      textAlign(CENTER, CENTER);
      textSize(18);
      textStyle(BOLD);
      text(card.op, cx + cardW / 2, cy + 20);

      // Dunder name (small)
      textSize(8);
      textStyle(NORMAL);
      fill(100);
      text(card.dunder, cx + cardW / 2, cy + 42);

      // Store rect for click detection
      cardRects.push({ x: cx, y: cy, w: cardW, h: cardH, card: card });

      col++;
      if (col >= maxCols) {
        col = 0;
        y += cardH + gap;
      }
    }
    if (col > 0) y += cardH + gap;
    y += 4;
  }

  // Draw tooltip/detail for hovered card
  if (hoveredCard) {
    drawTooltip(hoveredCard);
  }

  // Draw pinned comparison panel
  if (pinnedCards.length > 0 && !hoveredCard) {
    drawPinnedPanel();
  }
}

function drawTooltip(card) {
  let cat = CATEGORIES[card.cat];
  let tw = 260;
  let th = 90;
  let tx = mouseX + 15;
  let ty = mouseY - 10;

  // Keep tooltip within canvas
  if (tx + tw > canvasWidth - 5) tx = mouseX - tw - 15;
  if (ty + th > drawHeight - 5) ty = drawHeight - th - 5;
  if (ty < 5) ty = 5;

  // Shadow
  fill(0, 0, 0, 30);
  noStroke();
  rect(tx + 3, ty + 3, tw, th, 8);

  // Background
  fill(255, 255, 255, 245);
  stroke(cat.color[0], cat.color[1], cat.color[2]);
  strokeWeight(2);
  rect(tx, ty, tw, th, 8);

  // Content
  noStroke();
  textAlign(LEFT, TOP);

  // Dunder method name
  fill(cat.color[0], cat.color[1], cat.color[2]);
  textSize(15);
  textStyle(BOLD);
  text(card.dunder, tx + 10, ty + 8);
  textStyle(NORMAL);

  // Example
  fill(60);
  textSize(13);
  text('Example: ' + card.example, tx + 10, ty + 30);

  // Description
  fill(80);
  textSize(12);
  // Word wrap the description
  let words = card.desc.split(' ');
  let line = '';
  let lineY = ty + 52;
  for (let w of words) {
    let test = line + (line ? ' ' : '') + w;
    if (textWidth(test) > tw - 20 && line) {
      text(line, tx + 10, lineY);
      line = w;
      lineY += 16;
    } else {
      line = test;
    }
  }
  if (line) text(line, tx + 10, lineY);
}

function drawPinnedPanel() {
  let pinnedData = CARDS.filter(c => pinnedCards.includes(c.dunder));
  if (pinnedData.length === 0) return;

  let panelH = 20 + pinnedData.length * 20;
  let panelW = canvasWidth * 0.6;
  let panelX = canvasWidth - panelW - margin;
  let panelY = drawHeight - panelH - 10;

  fill(255, 255, 255, 235);
  stroke(100);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 8);

  noStroke();
  fill(60);
  textAlign(LEFT, TOP);
  textSize(11);
  textStyle(BOLD);
  text('Pinned for comparison (click to unpin):', panelX + 8, panelY + 4);
  textStyle(NORMAL);

  let y = panelY + 20;
  textSize(11);
  for (let card of pinnedData) {
    let cat = CATEGORIES[card.cat];
    fill(cat.color[0], cat.color[1], cat.color[2]);
    text(card.op + '  \u2192  ' + card.dunder + '  \u2014  ' + card.desc, panelX + 12, y);
    y += 20;
  }
}

function mousePressed() {
  // Check card clicks
  for (let r of cardRects) {
    if (mouseX > r.x && mouseX < r.x + r.w &&
        mouseY > r.y && mouseY < r.y + r.h) {
      let idx = pinnedCards.indexOf(r.card.dunder);
      if (idx >= 0) {
        pinnedCards.splice(idx, 1); // unpin
      } else {
        pinnedCards.push(r.card.dunder); // pin
      }
      return;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  searchInput.size(canvasWidth - 100);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
