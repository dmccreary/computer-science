// Control Flow Patterns - Interactive Flowchart MicroSim
// Shows three patterns side by side: Sequential, Selection, Iteration
// Students click each pattern to see an animated execution trace
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// Animation state
let animDots = [null, null, null]; // one per pattern
let animPaths = [[], [], []];     // waypoints per pattern
let animProgress = [0, 0, 0];
let animActive = [false, false, false];
let animSpeed = 0.02;
let iterationCount = [0, 0, 0]; // track iteration loops

// Show code toggle
let showCodeCheckbox;
let showAllButton;

// Hover state
let hoveredNode = null;

// Color scheme
const colors = {
  sequential: [70, 130, 220],   // blue
  selection:  [50, 170, 80],    // green
  iteration:  [230, 150, 50],   // orange
  dot:        [255, 230, 0],    // bright yellow
  bg:         [245, 248, 255],  // aliceblue
};

// Node definitions for each pattern
let patterns = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  showAllButton = createButton('Show All');
  showAllButton.position(10, drawHeight + 10);
  showAllButton.mousePressed(showAll);

  showCodeCheckbox = createCheckbox('Show Code', false);
  showCodeCheckbox.position(100, drawHeight + 12);

  describe('Interactive diagram comparing three control flow patterns: sequential, selection, and iteration. Click each pattern to trace execution.', LABEL);

  buildPatterns();
}

function buildPatterns() {
  let colW = canvasWidth / 3;
  let topY = 80;
  let boxW = 100;
  let boxH = 40;
  let diaSize = 40;

  // Pattern 0: Sequential
  let cx0 = colW * 0.5;
  patterns[0] = {
    name: 'Sequential',
    desc: 'Statements run one after another, top to bottom.',
    color: colors.sequential,
    code: 'x = 10\ny = 20\nprint(x + y)',
    nodes: [
      { type: 'rect', x: cx0, y: topY + 30, w: boxW, h: boxH, label: 'Step 1', desc: 'Execute first statement' },
      { type: 'rect', x: cx0, y: topY + 110, w: boxW, h: boxH, label: 'Step 2', desc: 'Execute second statement' },
      { type: 'rect', x: cx0, y: topY + 190, w: boxW, h: boxH, label: 'Step 3', desc: 'Execute third statement' },
    ],
    edges: [
      [0, 1],
      [1, 2],
    ]
  };

  // Pattern 1: Selection
  let cx1 = colW * 1.5;
  patterns[1] = {
    name: 'Selection',
    desc: 'Choose a path based on a condition (if/else).',
    color: colors.selection,
    code: 'if x > 0:\n    print("pos")\nelse:\n    print("neg")',
    nodes: [
      { type: 'diamond', x: cx1, y: topY + 30, w: diaSize, h: diaSize, label: 'Condition?', desc: 'Evaluate Boolean condition' },
      { type: 'rect', x: cx1 - 60, y: topY + 120, w: 80, h: boxH, label: 'True Path', desc: 'Runs when condition is True' },
      { type: 'rect', x: cx1 + 60, y: topY + 120, w: 80, h: boxH, label: 'False Path', desc: 'Runs when condition is False' },
      { type: 'rect', x: cx1, y: topY + 210, w: boxW, h: boxH, label: 'Continue', desc: 'Both paths merge and continue' },
    ],
    edges: [
      [0, 1, 'T'],
      [0, 2, 'F'],
      [1, 3],
      [2, 3],
    ]
  };

  // Pattern 2: Iteration
  let cx2 = colW * 2.5;
  patterns[2] = {
    name: 'Iteration',
    desc: 'Repeat a block while a condition is true (loops).',
    color: colors.iteration,
    code: 'while x < 5:\n    print(x)\n    x += 1',
    nodes: [
      { type: 'diamond', x: cx2, y: topY + 30, w: diaSize, h: diaSize, label: 'Condition?', desc: 'Check loop condition' },
      { type: 'rect', x: cx2, y: topY + 130, w: boxW, h: boxH, label: 'Loop Body', desc: 'Execute loop body statements' },
      { type: 'rect', x: cx2, y: topY + 250, w: boxW, h: boxH, label: 'Done', desc: 'Exit when condition is False' },
    ],
    edges: [
      [0, 1, 'T'],
      [1, 0, 'loop'],
      [0, 2, 'F'],
    ]
  };

  // Build animation paths
  buildAnimPaths();
}

function buildAnimPaths() {
  // Sequential: straight down through 3 boxes
  let n0 = patterns[0].nodes;
  animPaths[0] = [
    { x: n0[0].x, y: n0[0].y - 30 },
    { x: n0[0].x, y: n0[0].y },
    { x: n0[0].x, y: n0[0].y + 20 },
    { x: n0[1].x, y: n0[1].y },
    { x: n0[1].x, y: n0[1].y + 20 },
    { x: n0[2].x, y: n0[2].y },
    { x: n0[2].x, y: n0[2].y + 20 },
    { x: n0[2].x, y: n0[2].y + 50 },
  ];

  // Selection: go through condition, then True path, then merge
  let n1 = patterns[1].nodes;
  animPaths[1] = [
    { x: n1[0].x, y: n1[0].y - 30 },
    { x: n1[0].x, y: n1[0].y },
    { x: n1[1].x, y: n1[1].y },
    { x: n1[1].x, y: n1[1].y + 20 },
    { x: n1[3].x, y: n1[3].y },
    { x: n1[3].x, y: n1[3].y + 20 },
    { x: n1[3].x, y: n1[3].y + 50 },
  ];

  // Iteration: condition -> body -> back to condition (2 loops), then exit
  let n2 = patterns[2].nodes;
  animPaths[2] = [
    { x: n2[0].x, y: n2[0].y - 30 },
    { x: n2[0].x, y: n2[0].y },        // condition check 1
    { x: n2[1].x, y: n2[1].y },        // body
    { x: n2[1].x + 60, y: n2[1].y },   // loop right
    { x: n2[0].x + 60, y: n2[0].y },   // loop up
    { x: n2[0].x, y: n2[0].y },        // condition check 2
    { x: n2[1].x, y: n2[1].y },        // body again
    { x: n2[1].x + 60, y: n2[1].y },   // loop right
    { x: n2[0].x + 60, y: n2[0].y },   // loop up
    { x: n2[0].x, y: n2[0].y },        // condition check 3 (fail)
    { x: n2[2].x + 60, y: n2[0].y },   // go right for false
    { x: n2[2].x + 60, y: n2[2].y },   // go down
    { x: n2[2].x, y: n2[2].y },        // done
  ];
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

  // Rebuild patterns with current width
  buildPatterns();

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('Control Flow Patterns', canvasWidth / 2, 10);
  textSize(defaultTextSize);

  let colW = canvasWidth / 3;
  hoveredNode = null;

  // Draw each pattern
  for (let p = 0; p < 3; p++) {
    let pat = patterns[p];
    let cx = colW * (p + 0.5);

    // Column separator
    if (p > 0) {
      stroke(220);
      strokeWeight(1);
      line(colW * p, 40, colW * p, drawHeight - 10);
    }

    // Pattern label
    noStroke();
    fill(pat.color[0], pat.color[1], pat.color[2]);
    textAlign(CENTER, TOP);
    textSize(16);
    textStyle(BOLD);
    text(pat.name, cx, 38);
    textStyle(NORMAL);

    // Draw edges
    drawEdges(pat, p);

    // Draw nodes
    drawNodes(pat, p);

    // Description
    noStroke();
    fill(100);
    textAlign(CENTER, TOP);
    textSize(12);
    let descY = drawHeight - 60;
    text(pat.desc, cx - colW * 0.4, descY, colW * 0.8, 50);

    // Show code if checkbox active
    if (showCodeCheckbox.checked()) {
      fill(240);
      stroke(200);
      strokeWeight(1);
      let codeY = drawHeight - 120;
      let codeW = colW * 0.8;
      rect(cx - codeW / 2, codeY - 5, codeW, 55, 5);
      noStroke();
      fill(40, 40, 120);
      textAlign(LEFT, TOP);
      textFont('monospace');
      textSize(11);
      text(pat.code, cx - codeW / 2 + 8, codeY + 3);
      textFont('Arial');
    }

    // Animate dot
    if (animActive[p]) {
      let pts = animPaths[p];
      let totalSegs = pts.length - 1;
      let overallT = animProgress[p];
      let segIndex = Math.min(Math.floor(overallT * totalSegs), totalSegs - 1);
      let segT = (overallT * totalSegs) - segIndex;

      if (segIndex >= 0 && segIndex < totalSegs) {
        let ax = lerp(pts[segIndex].x, pts[segIndex + 1].x, segT);
        let ay = lerp(pts[segIndex].y, pts[segIndex + 1].y, segT);

        // Glow
        noStroke();
        fill(255, 230, 0, 80);
        circle(ax, ay, 24);
        fill(255, 230, 0, 150);
        circle(ax, ay, 16);
        fill(255, 240, 50);
        circle(ax, ay, 10);
      }

      animProgress[p] += animSpeed;
      if (animProgress[p] >= 1) {
        animActive[p] = false;
        animProgress[p] = 0;
      }
    }
  }

  // Tooltip
  if (hoveredNode) {
    drawTooltip(hoveredNode);
  }

  // Control area labels
  noStroke();
  fill(80);
  textAlign(LEFT, CENTER);
  textSize(12);
  text('Click a pattern to trace execution', canvasWidth - 230, drawHeight + 25);
}

function drawEdges(pat, pIdx) {
  let nodes = pat.nodes;
  let col = pat.color;

  for (let e of (pat.edges || [])) {
    let from = nodes[e[0]];
    let to = nodes[e[1]];
    let label = e[2] || '';

    stroke(col[0], col[1], col[2], 180);
    strokeWeight(2);
    noFill();

    if (label === 'loop') {
      // Draw curved loop-back arrow
      let midX = from.x + 60;
      line(from.x + from.w / 2, from.y, midX, from.y);
      line(midX, from.y, midX, to.y);
      line(midX, to.y, to.x + to.w / 2, to.y);
      // Arrow head
      drawArrowHead(to.x + to.w / 2, to.y, -1, 0, col);
    } else if (label === 'T' && pIdx === 1) {
      // True branch goes left
      line(from.x - from.w / 2, from.y, to.x, to.y - to.h / 2);
      drawArrowHead(to.x, to.y - to.h / 2, 0, 1, col);
      // T label
      noStroke();
      fill(col[0], col[1], col[2]);
      textSize(12);
      textAlign(RIGHT, CENTER);
      text('T', from.x - from.w / 2 - 4, from.y + 10);
    } else if (label === 'F' && pIdx === 1) {
      // False branch goes right
      stroke(col[0], col[1], col[2], 180);
      strokeWeight(2);
      line(from.x + from.w / 2, from.y, to.x, to.y - to.h / 2);
      drawArrowHead(to.x, to.y - to.h / 2, 0, 1, col);
      noStroke();
      fill(col[0], col[1], col[2]);
      textSize(12);
      textAlign(LEFT, CENTER);
      text('F', from.x + from.w / 2 + 4, from.y + 10);
    } else if (label === 'T' && pIdx === 2) {
      // Iteration True goes down
      line(from.x, from.y + from.h / 2, to.x, to.y - to.h / 2);
      drawArrowHead(to.x, to.y - to.h / 2, 0, 1, col);
      noStroke();
      fill(col[0], col[1], col[2]);
      textSize(12);
      textAlign(RIGHT, CENTER);
      text('T', from.x - from.w / 2 - 4, from.y + from.h / 2 + 10);
    } else if (label === 'F' && pIdx === 2) {
      // Iteration False exits right then down
      let exitX = from.x + 60;
      stroke(col[0], col[1], col[2], 180);
      strokeWeight(2);
      line(from.x + from.w / 2, from.y, exitX, from.y);
      line(exitX, from.y, exitX, to.y);
      line(exitX, to.y, to.x + to.w / 2, to.y);
      drawArrowHead(to.x + to.w / 2, to.y, -1, 0, col);
      noStroke();
      fill(col[0], col[1], col[2]);
      textSize(12);
      textAlign(LEFT, CENTER);
      text('F', from.x + from.w / 2 + 4, from.y - 10);
    } else {
      // Standard vertical edge
      line(from.x, from.y + (from.h || from.w) / 2, to.x, to.y - (to.h || to.w) / 2);
      drawArrowHead(to.x, to.y - (to.h || to.w) / 2, 0, 1, col);
    }
  }
}

function drawArrowHead(x, y, dx, dy, col) {
  fill(col[0], col[1], col[2]);
  noStroke();
  push();
  translate(x, y);
  let angle = atan2(dy, dx);
  rotate(angle);
  triangle(0, 0, -10, -5, -10, 5);
  pop();
}

function drawNodes(pat, pIdx) {
  let nodes = pat.nodes;
  let col = pat.color;

  for (let i = 0; i < nodes.length; i++) {
    let n = nodes[i];
    let isHovered = dist(mouseX, mouseY, n.x, n.y) < 30;

    if (isHovered) {
      hoveredNode = n;
    }

    stroke(col[0], col[1], col[2]);
    strokeWeight(isHovered ? 3 : 2);

    if (n.type === 'rect') {
      fill(255, 255, 255, 230);
      rectMode(CENTER);
      rect(n.x, n.y, n.w, n.h, 8);
      rectMode(CORNER);
    } else if (n.type === 'diamond') {
      fill(255, 255, 255, 230);
      push();
      translate(n.x, n.y);
      rotate(PI / 4);
      rectMode(CENTER);
      rect(0, 0, n.w, n.h, 4);
      rectMode(CORNER);
      pop();
    }

    // Node label
    noStroke();
    fill(40);
    textAlign(CENTER, CENTER);
    textSize(11);
    textStyle(BOLD);
    text(n.label, n.x, n.y);
    textStyle(NORMAL);
  }
}

function drawTooltip(node) {
  let tx = mouseX + 15;
  let ty = mouseY - 20;
  let tw = textWidth(node.desc) + 20;
  let th = 28;

  // Keep on screen
  if (tx + tw > canvasWidth - 5) tx = mouseX - tw - 15;
  if (ty < 5) ty = mouseY + 15;

  fill(0, 0, 0, 200);
  noStroke();
  rect(tx, ty, tw, th, 5);
  fill(255);
  textAlign(LEFT, CENTER);
  textSize(12);
  text(node.desc, tx + 10, ty + th / 2);
}

function mousePressed() {
  if (mouseY > drawHeight) return;

  let colW = canvasWidth / 3;
  let clickedPattern = Math.floor(mouseX / colW);
  if (clickedPattern >= 0 && clickedPattern < 3) {
    startAnimation(clickedPattern);
  }
}

function startAnimation(idx) {
  animActive[idx] = true;
  animProgress[idx] = 0;
}

function showAll() {
  for (let i = 0; i < 3; i++) {
    startAnimation(i);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
