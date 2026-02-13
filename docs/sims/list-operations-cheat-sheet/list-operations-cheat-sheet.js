// List Operations Cheat Sheet MicroSim
// Interactive reference organized by category with accordion tiles
// Bloom Level: Remember (L1) - recall, identify

let canvasWidth = 400;
let drawHeight = 550;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

// Categories with operations
let categories = [
  {
    name: 'Copying',
    color: '#E67E22',
    ops: [
      { name: 'b = a', desc: 'Alias (shared ref)', code: 'a = [1,2,3]; b = a', output: 'Both point to same list', tip: 'Changes to b affect a!' },
      { name: 'a.copy()', desc: 'Shallow copy', code: 'b = a.copy()', output: 'Independent for flat lists', tip: 'Also: a[:] or list(a)' },
      { name: 'deepcopy(a)', desc: 'Deep copy', code: 'import copy\nb = copy.deepcopy(a)', output: 'Fully independent', tip: 'Use for lists of lists' }
    ]
  },
  {
    name: 'Combining',
    color: '#2ECC71',
    ops: [
      { name: '+', desc: 'Concatenation', code: '[1,2] + [3,4]', output: '[1, 2, 3, 4]', tip: 'Creates a new list' },
      { name: '*', desc: 'Repetition', code: '[0] * 3', output: '[0, 0, 0]', tip: 'Watch out with nested lists!' }
    ]
  },
  {
    name: 'Searching',
    color: '#3498DB',
    ops: [
      { name: 'in', desc: 'Membership test', code: '"cat" in ["cat","dog"]', output: 'True', tip: 'Use "not in" for negation' },
      { name: '.index()', desc: 'Find position', code: '["a","b","c"].index("b")', output: '1', tip: 'Raises ValueError if missing' },
      { name: '.count()', desc: 'Count occurrences', code: '[1,2,2,3].count(2)', output: '2', tip: 'Returns 0 if not found' }
    ]
  },
  {
    name: 'Statistics',
    color: '#9B59B6',
    ops: [
      { name: 'len()', desc: 'Length', code: 'len([10,20,30])', output: '3', tip: 'Works on any sequence' },
      { name: 'min()', desc: 'Minimum', code: 'min([5,2,8])', output: '2', tip: 'Alphabetical for strings' },
      { name: 'max()', desc: 'Maximum', code: 'max([5,2,8])', output: '8', tip: 'Empty list = ValueError' },
      { name: 'sum()', desc: 'Sum total', code: 'sum([1,2,3])', output: '6', tip: 'Only works with numbers' }
    ]
  },
  {
    name: 'Sorting',
    color: '#E74C3C',
    ops: [
      { name: '.sort()', desc: 'Sort in place', code: 'a.sort()', output: 'Modifies a, returns None', tip: "Don't write a = a.sort()!" },
      { name: 'sorted()', desc: 'Sort to new list', code: 'sorted([3,1,2])', output: '[1, 2, 3]', tip: 'Original unchanged' }
    ]
  },
  {
    name: 'Data Structures',
    color: '#1ABC9C',
    ops: [
      { name: 'Stack', desc: 'LIFO: append/pop', code: 's.append(x); s.pop()', output: 'Last in, first out', tip: 'Like a stack of plates' },
      { name: 'Queue', desc: 'FIFO: append/pop(0)', code: 'q.append(x); q.pop(0)', output: 'First in, first out', tip: 'Use deque for speed' }
    ]
  }
];

// State
let expandedTile = null; // { catIdx, opIdx }
let quizMode = false;
let scrollOffset = 0;

// Controls
let quizBtn, showAllBtn;

// Layout cache
let panelRects = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  quizBtn = createButton('Quiz Me');
  quizBtn.position(10, drawHeight + 12);
  quizBtn.mousePressed(toggleQuiz);

  showAllBtn = createButton('Collapse All');
  showAllBtn.position(85, drawHeight + 12);
  showAllBtn.mousePressed(collapseAll);

  describe('Interactive cheat sheet for Python list operations organized by category. Click any operation to see syntax, examples, and tips.', LABEL);
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
  textSize(20);
  text('List Operations Cheat Sheet', canvasWidth / 2, 8);

  // Subtitle
  textSize(12);
  fill('#888');
  text(quizMode ? 'Quiz Mode: Click to reveal!' : 'Click any operation to see details', canvasWidth / 2, 32);

  // Draw the 2x3 grid of category panels
  drawCategoryGrid();

  // Quiz mode label
  if (quizMode) {
    noStroke();
    fill('#E74C3C');
    textAlign(LEFT, CENTER);
    textSize(11);
    text('Quiz Mode ON', 165, drawHeight + 25);
  }
}

function drawCategoryGrid() {
  let gridStartY = 50;
  let cols = 2;
  let rows = 3;
  let panelPadX = 8;
  let panelPadY = 6;
  let panelW = (canvasWidth - margin * 2 - panelPadX) / cols;

  panelRects = [];
  let currentY = gridStartY;

  for (let row = 0; row < rows; row++) {
    let rowMaxH = 0;

    // First pass: calculate heights for this row
    let rowHeights = [];
    for (let col = 0; col < cols; col++) {
      let catIdx = row * cols + col;
      if (catIdx >= categories.length) break;
      let h = calcPanelHeight(catIdx);
      rowHeights.push(h);
      rowMaxH = Math.max(rowMaxH, h);
    }

    // Second pass: draw panels
    for (let col = 0; col < cols; col++) {
      let catIdx = row * cols + col;
      if (catIdx >= categories.length) break;

      let x = margin + col * (panelW + panelPadX);
      let y = currentY;
      let h = rowMaxH;

      drawCategoryPanel(catIdx, x, y, panelW, h);
    }

    currentY += rowMaxH + panelPadY;
  }
}

function calcPanelHeight(catIdx) {
  let cat = categories[catIdx];
  let headerH = 24;
  let tileH = 22;
  let expandedH = 78;
  let padBottom = 6;

  let h = headerH;
  for (let i = 0; i < cat.ops.length; i++) {
    if (expandedTile && expandedTile.catIdx === catIdx && expandedTile.opIdx === i) {
      h += expandedH;
    } else {
      h += tileH;
    }
  }
  return h + padBottom;
}

function drawCategoryPanel(catIdx, x, y, w, h) {
  let cat = categories[catIdx];

  // Panel background
  fill(255, 255, 255, 230);
  stroke('#DDD');
  strokeWeight(1);
  rect(x, y, w, h, 6);

  // Header bar
  let headerH = 22;
  fill(cat.color);
  noStroke();
  rect(x, y, w, headerH, 6, 6, 0, 0);

  // Category name
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(12);
  textStyle(BOLD);
  text(cat.name, x + w / 2, y + headerH / 2);
  textStyle(NORMAL);

  // Operation tiles
  let tileY = y + headerH + 2;
  let tileH = 22;
  let tilePad = 0;

  for (let i = 0; i < cat.ops.length; i++) {
    let op = cat.ops[i];
    let isExpanded = expandedTile && expandedTile.catIdx === catIdx && expandedTile.opIdx === i;

    // Store tile rect for click detection
    let thisTileH = isExpanded ? 78 : tileH;
    panelRects.push({ catIdx: catIdx, opIdx: i, x: x + 2, y: tileY, w: w - 4, h: thisTileH });

    // Tile background
    if (isExpanded) {
      fill(250, 248, 245);
    } else {
      fill(255);
    }
    stroke(cat.color);
    strokeWeight(0);

    // Left color border
    noStroke();
    fill(cat.color);
    rect(x + 2, tileY, 3, thisTileH);

    // Tile content area
    fill(isExpanded ? 250 : 255);
    noStroke();
    rect(x + 5, tileY, w - 7, thisTileH);

    // Divider line
    stroke('#EEE');
    strokeWeight(0.5);
    line(x + 5, tileY + thisTileH, x + w - 2, tileY + thisTileH);

    if (isExpanded) {
      drawExpandedTile(op, cat.color, x + 8, tileY, w - 12);
    } else {
      drawCollapsedTile(op, x + 8, tileY, w - 12);
    }

    tileY += thisTileH + tilePad;
  }
}

function drawCollapsedTile(op, x, y, w) {
  noStroke();
  textAlign(LEFT, CENTER);

  // Operation name
  textFont('monospace');
  textSize(11);
  fill('#333');
  textStyle(BOLD);
  text(op.name, x + 2, y + 11);
  textStyle(NORMAL);
  textFont('Arial');

  // Description (hidden in quiz mode)
  if (!quizMode) {
    fill('#888');
    textSize(10);
    let nameW = 70;
    text(op.desc, x + nameW, y + 11);
  } else {
    fill('#CCC');
    textSize(10);
    text('(click to reveal)', x + 70, y + 11);
  }
}

function drawExpandedTile(op, catColor, x, y, w) {
  noStroke();
  textAlign(LEFT, TOP);

  // Operation name and description
  textFont('monospace');
  textSize(11);
  fill('#333');
  textStyle(BOLD);
  text(op.name, x + 2, y + 3);
  textStyle(NORMAL);

  fill('#666');
  textFont('Arial');
  textSize(10);
  text('- ' + op.desc, x + 70, y + 4);

  // Code example
  let codeY = y + 18;
  fill(40, 44, 52);
  noStroke();
  rect(x, codeY, w, 16, 3);
  fill('#98C379');
  textFont('monospace');
  textSize(10);
  text(op.code, x + 4, codeY + 2);
  textFont('Arial');

  // Output
  let outY = codeY + 18;
  fill(catColor);
  textSize(10);
  textStyle(BOLD);
  text('→ ' + op.output, x + 2, outY);
  textStyle(NORMAL);

  // Tip
  let tipY = outY + 14;
  fill('#FF8C00');
  textSize(9);
  text('💡 ' + op.tip, x + 2, tipY);
}

function mousePressed() {
  // Check if click is in the drawing area
  if (mouseY > drawHeight || mouseY < 0) return;

  // Check panel rects (iterate in reverse to get topmost)
  for (let i = panelRects.length - 1; i >= 0; i--) {
    let r = panelRects[i];
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
      if (expandedTile && expandedTile.catIdx === r.catIdx && expandedTile.opIdx === r.opIdx) {
        expandedTile = null; // collapse
      } else {
        expandedTile = { catIdx: r.catIdx, opIdx: r.opIdx }; // expand
      }
      return;
    }
  }
}

function toggleQuiz() {
  quizMode = !quizMode;
  expandedTile = null;
  quizBtn.html(quizMode ? 'Exit Quiz' : 'Quiz Me');
}

function collapseAll() {
  expandedTile = null;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const mainEl = document.querySelector('main');
  canvasWidth = mainEl.clientWidth;
}
