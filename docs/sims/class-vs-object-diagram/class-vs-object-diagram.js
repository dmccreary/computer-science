/*
 * Class vs. Object Cookie Cutter Diagram
 * Shows a Dog class (cookie cutter) on the left and object instances (cookies)
 * on the right. Hover interactions highlight shared structure or individual
 * attribute values. A button spawns new dogs with random attributes.
 *
 * Bloom Level: Understand (L2) — compare, explain
 * Learning Objective: Distinguish between a class (blueprint) and an object (instance)
 */

// ---- responsive canvas globals (standard MicroSim pattern) ----
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// ---- application globals ----
let dogs = [];
let layoutMode = 'horizontal';
let classBox = null;
let createBtn;

// color palette
const BG_COLOR = '#fdf9f2';
const CLASS_FILL = '#e1edff';
const CLASS_STROKE = '#3c73d6';
const ARROW_COLOR = '#3c73d6';

const DOG_NAMES = [
  'Bailey', 'Coco', 'Rex', 'Bella', 'Milo', 'Charlie',
  'Nova', 'Shadow', 'Penny', 'Ziggy', 'Mocha', 'Hazel'
];
const DOG_BREEDS = [
  'Border Collie', 'Husky', 'Shepherd Mix', 'Terrier',
  'Corgi', 'Lab Mix', 'Dalmatian', 'Boxer', 'Bernedoodle'
];
const COOKIE_COLORS = [
  { base: '#d7975a', edge: '#8c5523' },
  { base: '#c97f4d', edge: '#723c1b' },
  { base: '#e0a36a', edge: '#a06431' },
  { base: '#d58a58', edge: '#874f1f' }
];
const SPRINKLE_COLORS = ['#ff80a6', '#5cc5ff', '#ffe066', '#6dd3a0', '#ffb347'];

// ---- setup ----
function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  textFont('Arial, Helvetica, sans-serif');

  // p5.js builtin button
  createBtn = createButton('Create New Dog');
  createBtn.position(10, drawHeight + 10);
  createBtn.mousePressed(spawnNewDog);

  initializeDogs();

  describe(
    'An infographic showing a Dog class as a blue cookie cutter on the left ' +
    'and multiple cookie-shaped Dog objects on the right, each with unique ' +
    'name, breed, and age values. Arrows labeled instantiation connect the class to each object.',
    LABEL
  );
}

// ---- draw loop ----
function draw() {
  updateCanvasSize();

  layoutMode = canvasWidth > 700 ? 'horizontal' : 'vertical';

  // compute layout positions
  const layout = computeLayout();
  classBox = layout.classRect;

  // draw background
  background(BG_COLOR);

  // draw control area
  fill('white');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);
  // light border between drawing and control area
  stroke('silver');
  strokeWeight(1);
  line(0, drawHeight, canvasWidth, drawHeight);

  // header text
  drawHeader();

  // check if mouse is over the class panel
  let classHovered = pointInRect(mouseX, mouseY, classBox);

  // build display info for each dog
  let displays = [];
  for (let i = 0; i < dogs.length; i++) {
    let slot = layout.slots[i];
    if (!slot) continue;
    displays[i] = buildDisplayForDog(dogs[i], slot);
  }

  // draw arrows from class to each cookie
  drawArrows(displays);

  // draw the class panel
  drawClassPanel(classBox, classHovered);

  // draw each dog cookie
  let hoveredDog = null;
  for (let i = 0; i < dogs.length; i++) {
    if (!displays[i]) continue;
    drawDogCookie(dogs[i], displays[i], classHovered);
    dogs[i]._display = displays[i];
    if (displays[i].hovered) hoveredDog = dogs[i];
  }

  // highlight shared structure when hovering class
  if (classHovered) {
    highlightSharedStructure(displays);
  }

  // draw tooltips
  if (hoveredDog) {
    drawDogTooltip(hoveredDog);
  } else if (classHovered) {
    drawClassTooltip();
  }

  // control area label
  noStroke();
  fill('#555');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Dogs created: ' + dogs.length, 180, drawHeight + 25);
}

// ---- responsive sizing ----
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const mainEl = document.querySelector('main');
  if (mainEl) {
    canvasWidth = mainEl.clientWidth;
  }
}

// ---- data helpers ----
function initializeDogs() {
  let starters = [
    { name: 'Buddy', breed: 'Golden Retriever', age: 3 },
    { name: 'Luna', breed: 'Poodle', age: 5 },
    { name: 'Max', breed: 'Beagle', age: 1 }
  ];
  for (let i = 0; i < starters.length; i++) {
    let d = starters[i];
    d.palette = COOKIE_COLORS[i % COOKIE_COLORS.length];
    d.label = 'Dog ' + (i + 1);
    d.sprinkles = makeSprinkles();
    d.spawnStart = null;
    dogs.push(d);
  }
}

function spawnNewDog() {
  let dog = {
    name: randomChoice(DOG_NAMES),
    breed: randomChoice(DOG_BREEDS),
    age: floor(random(1, 13)),
    palette: randomChoice(COOKIE_COLORS),
    label: 'Dog ' + (dogs.length + 1),
    sprinkles: makeSprinkles(),
    spawnStart: millis()
  };
  dogs.push(dog);
}

function makeSprinkles() {
  let s = [];
  for (let i = 0; i < 10; i++) {
    s.push({
      dx: random(-0.45, 0.45),
      dy: random(-0.45, 0.45),
      angle: random(TWO_PI),
      len: random(10, 16),
      col: randomChoice(SPRINKLE_COLORS)
    });
  }
  return s;
}

function randomChoice(arr) {
  return arr[floor(random(arr.length))];
}

// ---- layout ----
function computeLayout() {
  let pad = 24;
  let slots = [];
  let cr;

  if (layoutMode === 'horizontal') {
    // class panel on left, cookies on right
    let classW = canvasWidth * 0.32;
    let classH = drawHeight - 120;
    cr = { x: pad, y: 80, w: classW, h: classH };

    let areaX = cr.x + cr.w + 40;
    let areaW = canvasWidth - areaX - pad;
    let cols = dogs.length > 3 ? 2 : 1;
    let rows = ceil(dogs.length / cols);
    let cellH = (drawHeight - 140) / max(rows, 1);

    for (let i = 0; i < dogs.length; i++) {
      let col = cols === 1 ? 0 : i % cols;
      let row = cols === 1 ? i : floor(i / cols);
      let cellW = areaW / cols;
      let cx = areaX + cellW * col + cellW / 2;
      let cy = 110 + cellH * row + cellH / 2;
      let sz = min(cellW, cellH) * 0.65;
      slots.push({ x: cx, y: cy, size: sz });
    }
  } else {
    // vertical: class on top, cookies below
    let classH = 200;
    cr = { x: pad, y: 70, w: canvasWidth - pad * 2, h: classH };

    let cols = canvasWidth > 500 ? 2 : 1;
    let cellH = 160;
    let areaTop = cr.y + cr.h + 50;
    let cellW = (canvasWidth - pad * 2) / cols;
    for (let i = 0; i < dogs.length; i++) {
      let col = cols === 1 ? 0 : i % cols;
      let row = floor(i / cols);
      let cx = pad + cellW * col + cellW / 2;
      let cy = areaTop + row * cellH + cellH / 2;
      let sz = min(cellW * 0.6, 110);
      slots.push({ x: cx, y: cy, size: sz });
    }

    // adjust drawHeight if cookies would overflow
    if (slots.length > 0) {
      let lastY = slots[slots.length - 1].y;
      let lastSize = slots[slots.length - 1].size;
      let needed = lastY + lastSize / 2 + 40;
      if (needed > drawHeight) {
        drawHeight = ceil(needed);
        canvasHeight = drawHeight + controlHeight;
        if (createBtn) createBtn.position(10, drawHeight + 10);
      }
    }
  }

  return { classRect: cr, slots: slots };
}

function buildDisplayForDog(dog, slot) {
  let cx = slot.x;
  let cy = slot.y;

  // animate spawn
  if (dog.spawnStart) {
    let elapsed = millis() - dog.spawnStart;
    let t = constrain(elapsed / 800, 0, 1);
    let eased = easeOutCubic(t);
    // spawn origin is the class panel edge
    let originX, originY;
    if (layoutMode === 'horizontal') {
      originX = classBox.x + classBox.w;
      originY = classBox.y + classBox.h / 2;
    } else {
      originX = classBox.x + classBox.w / 2;
      originY = classBox.y + classBox.h;
    }
    cx = lerp(originX, slot.x, eased);
    cy = lerp(originY, slot.y, eased);
    if (t >= 1) dog.spawnStart = null;
  }

  let hovered = dist(mouseX, mouseY, cx, cy) <= slot.size * 0.55;
  return { x: cx, y: cy, size: slot.size, hovered: hovered };
}

// ---- drawing functions ----
function drawHeader() {
  push();
  noStroke();
  textAlign(LEFT, TOP);
  fill('#a7773c');
  textSize(18);
  text('Class (cookie cutter) \u2192 Objects (cookies)', 24, 16);
  fill('#5d4c3a');
  textSize(14);
  text('Hover the class or a cookie to see details. Click the button to create a new dog.', 24, 40);
  pop();
}

function drawClassPanel(box, hovered) {
  push();
  translate(box.x, box.y);

  // panel background
  noStroke();
  fill(hovered ? '#d5e5ff' : CLASS_FILL);
  rect(0, 0, box.w, box.h, 20);

  // cookie cutter outline
  drawCookieCutterShape(box.w * 0.28, box.h * 0.48, box.h * 0.42, hovered);

  // text content
  let tx = box.w * 0.42;
  noStroke();
  fill(CLASS_STROKE);
  textAlign(LEFT, TOP);
  textSize(18);
  text('Dog class', tx, 18);
  textSize(13);
  fill('#6689c4');
  text('(cookie cutter)', tx, 40);

  fill('#203354');
  textSize(15);
  text('Attributes', tx, 68);
  fill('#3f4f63');
  textSize(14);
  text('\u2022 name\n\u2022 breed\n\u2022 age', tx, 90);

  fill('#203354');
  textSize(15);
  text('Methods', tx, 158);
  fill('#3f4f63');
  textSize(14);
  text('\u2022 bark()\n\u2022 sit()\n\u2022 fetch()', tx, 180);

  fill('#4c6bbf');
  textSize(12);
  text('One blueprint stamps out many objects.', box.w * 0.05, box.h - 38);

  pop();
}

function drawCookieCutterShape(cx, cy, sz, hovered) {
  push();
  translate(cx, cy);
  noFill();
  stroke(hovered ? '#4d8dff' : '#7ca5e8');
  strokeWeight(7);
  let r = sz / 2;
  beginShape();
  let steps = 20;
  for (let i = 0; i < steps; i++) {
    let a = (TWO_PI / steps) * i;
    let wobble = 1 + 0.18 * sin(a * 2);
    vertex(cos(a) * r * wobble, sin(a) * r * wobble);
  }
  endShape(CLOSE);
  // inner ring
  stroke('#ffffff');
  strokeWeight(2);
  ellipse(0, 0, sz * 0.85, sz * 0.85);
  pop();
}

function drawArrows(displays) {
  let anchorX, anchorY;
  if (layoutMode === 'horizontal') {
    anchorX = classBox.x + classBox.w;
    anchorY = classBox.y + classBox.h / 2;
  } else {
    anchorX = classBox.x + classBox.w / 2;
    anchorY = classBox.y + classBox.h;
  }

  for (let i = 0; i < displays.length; i++) {
    if (!displays[i]) continue;
    drawSingleArrow(anchorX, anchorY, displays[i].x, displays[i].y, i);
  }
}

function drawSingleArrow(sx, sy, ex, ey, idx) {
  push();
  stroke(ARROW_COLOR);
  strokeWeight(2);
  strokeCap(ROUND);

  let angle = atan2(ey - sy, ex - sx);
  let d = dist(sx, sy, ex, ey);
  let ax = sx + cos(angle) * 16;
  let ay = sy + sin(angle) * 16;
  let bx = sx + cos(angle) * (d - 40);
  let by = sy + sin(angle) * (d - 40);

  line(ax, ay, bx, by);

  // arrowhead
  fill(ARROW_COLOR);
  noStroke();
  push();
  translate(bx, by);
  rotate(angle);
  beginShape();
  vertex(0, 0);
  vertex(-10, 5);
  vertex(-10, -5);
  endShape(CLOSE);
  pop();

  // label
  noStroke();
  fill(ARROW_COLOR);
  textSize(11);
  textAlign(CENTER, CENTER);
  let lx = lerp(ax, bx, 0.55);
  let ly = lerp(ay, by, 0.55);
  // offset label perpendicular to arrow so labels don't overlap
  let perpAngle = angle + HALF_PI;
  let labelSpread = (idx - (dogs.length - 1) / 2) * 12;
  lx += cos(perpAngle) * labelSpread;
  ly += sin(perpAngle) * labelSpread;
  text('instantiation', lx, ly);

  pop();
}

function drawDogCookie(dog, display, classHovered) {
  push();
  translate(display.x, display.y);
  let radius = display.size / 2;

  // soft glow when class hovered or individual hovered
  if (classHovered || display.hovered) {
    noFill();
    stroke(60, 115, 214, 80);
    strokeWeight(4);
    ellipse(0, 0, radius * 2 + 20);
  }

  // cookie body (wobbly circle)
  let baseCol = color(dog.palette.base);
  let fillCol = classHovered ? lerpColor(baseCol, color('#ffffff'), 0.12) : baseCol;
  fill(fillCol);
  stroke(dog.palette.edge);
  strokeWeight(3);
  beginShape();
  let steps = 24;
  for (let i = 0; i < steps; i++) {
    let a = (TWO_PI / steps) * i;
    let wobble = 1 + 0.10 * sin(a * 3 + i * 0.15);
    vertex(cos(a) * radius * wobble, sin(a) * radius * wobble);
  }
  endShape(CLOSE);

  // sprinkles
  for (let s of dog.sprinkles) {
    push();
    translate(s.dx * radius * 1.4, s.dy * radius * 1.4);
    rotate(s.angle);
    stroke(s.col);
    strokeWeight(3);
    line(-s.len / 2, 0, s.len / 2, 0);
    pop();
  }

  // text on cookie
  noStroke();
  fill('#4a321f');
  textAlign(CENTER, CENTER);
  textSize(14);
  text(dog.label, 0, -radius - 20);

  fill('#5a4330');
  textSize(13);
  textStyle(BOLD);
  text(dog.name, 0, -8);
  textStyle(NORMAL);
  textSize(11);
  text(dog.breed, 0, 10);
  text('age ' + dog.age, 0, 26);

  pop();
}

function highlightSharedStructure(displays) {
  push();
  noFill();
  stroke('rgba(60,115,214,0.35)');
  strokeWeight(4);
  rect(classBox.x - 6, classBox.y - 6, classBox.w + 12, classBox.h + 12, 24);
  for (let d of displays) {
    if (!d) continue;
    ellipse(d.x, d.y, d.size + 20);
  }

  noStroke();
  fill('#2a4a92');
  textSize(13);
  textAlign(LEFT, TOP);
  text('All objects share the same attributes + methods from the class', classBox.x, classBox.y - 24);
  pop();
}

// ---- tooltips ----
function drawDogTooltip(dog) {
  let lines = [
    dog.label,
    'name = "' + dog.name + '"',
    'breed = "' + dog.breed + '"',
    'age = ' + dog.age
  ];
  drawTooltip(dog._display, lines);
}

function drawClassTooltip() {
  let lines = [
    'Dog class (blueprint)',
    'Attributes: name, breed, age',
    'Methods: bark(), sit(), fetch()',
    'Creates every Dog object'
  ];
  let target = {
    x: classBox.x + classBox.w * 0.3,
    y: classBox.y + classBox.h * 0.3,
    size: 0
  };
  drawTooltip(target, lines);
}

function drawTooltip(target, lines) {
  push();
  textSize(13);
  textAlign(LEFT, TOP);
  let pad = 12;
  let maxW = 0;
  for (let l of lines) {
    let w = textWidth(l);
    if (w > maxW) maxW = w;
  }
  let bw = maxW + pad * 2;
  let bh = lines.length * 18 + pad * 2;

  let tx = target.x + target.size / 2 + 16;
  let ty = target.y - bh / 2;
  // keep on screen
  if (tx + bw > canvasWidth - 10) tx = canvasWidth - bw - 10;
  if (ty < 10) ty = 10;
  if (ty + bh > drawHeight - 10) ty = drawHeight - bh - 10;
  if (tx < 10) tx = 10;

  fill(255, 255, 255, 235);
  stroke('#cfa168');
  strokeWeight(1.5);
  rect(tx, ty, bw, bh, 10);

  noStroke();
  fill('#5a4330');
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], tx + pad, ty + pad + i * 18);
  }
  pop();
}

// ---- utilities ----
function pointInRect(px, py, r) {
  return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
}

function easeOutCubic(t) {
  return 1 - pow(1 - t, 3);
}
