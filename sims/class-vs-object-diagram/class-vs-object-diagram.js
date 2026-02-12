/*
 * Class vs. Object Cookie Cutter Diagram
 * Visualizes the relationship between a Dog class (cookie cutter) and object instances (cookies).
 * Hover interactions highlight shared structure or individual attributes, and a button spawns new dogs.
 */

let dogs = [];
let layoutMode = 'horizontal';
let classRect = null;
let createButtonEl;

const BG_COLOR = '#fdf9f2';
const CLASS_FILL = '#e1edff';
const CLASS_STROKE = '#3c73d6';
const ARROW_COLOR = '#3c73d6';

const DOG_NAMES = ['Bailey', 'Coco', 'Rex', 'Bella', 'Milo', 'Charlie', 'Nova', 'Shadow', 'Penny', 'Ziggy', 'Mocha', 'Hazel'];
const DOG_BREEDS = ['Border Collie', 'Husky', 'Shepherd Mix', 'Terrier', 'Corgi', 'Lab Mix', 'Dalmatian', 'Boxer', 'Bernedoodle'];
const COOKIE_COLORS = [
  { base: '#d7975a', edge: '#8c5523' },
  { base: '#c97f4d', edge: '#723c1b' },
  { base: '#e0a36a', edge: '#a06431' },
  { base: '#d58a58', edge: '#874f1f' }
];

function setup() {
  const container = document.querySelector('main') || document.body;
  const canvas = createCanvas(getCanvasWidth(), 540);
  canvas.parent(container);

  textFont('Inter, "Helvetica Neue", Arial, sans-serif');
  textAlign(LEFT, TOP);

  createButtonEl = createButton('Create New Dog');
  createButtonEl.parent(container);
  styleButton(createButtonEl);
  createButtonEl.mousePressed(spawnNewDog);

  initializeDogs();
}

function getCanvasWidth() {
  return Math.min(windowWidth - 32, 1100);
}

function styleButton(btn) {
  btn.addClass('create-button');
  btn.style('border', 'none');
  btn.style('border-radius', '999px');
  btn.style('background-color', '#3c73d6');
  btn.style('color', '#fff');
  btn.style('font-size', '16px');
  btn.style('font-weight', '600');
  btn.style('padding', '12px 28px');
  btn.style('margin', '18px 24px');
  btn.style('box-shadow', '0 6px 18px rgba(60, 115, 214, 0.25)');
  btn.style('cursor', 'pointer');
}

function initializeDogs() {
  const starterDogs = [
    { name: 'Buddy', breed: 'Golden Retriever', age: 3 },
    { name: 'Luna', breed: 'Poodle', age: 5 },
    { name: 'Max', breed: 'Beagle', age: 1 }
  ];

  starterDogs.forEach((data) => {
    const palette = COOKIE_COLORS[starterDogs.indexOf(data) % COOKIE_COLORS.length];
    addDog(createDog({ ...data, palette }));
  });
}

function addDog(dog) {
  dog.label = `Dog ${dogs.length + 1}`;
  dog.sprinkles = buildSprinkles(dog.palette.base);
  dogs.push(dog);
}

function createDog({ name, breed, age, palette, animate = false }) {
  return {
    name,
    breed,
    age,
    palette: palette || randomChoice(COOKIE_COLORS),
    spawnStart: animate ? millis() : null,
    label: ''
  };
}

function buildSprinkles(baseColor) {
  const colors = ['#ff80a6', '#5cc5ff', '#ffe066', '#6dd3a0', '#ffb347'];
  const sprinkles = [];
  for (let i = 0; i < 10; i++) {
    sprinkles.push({
      dx: random(-0.5, 0.5),
      dy: random(-0.5, 0.5),
      angle: random(TWO_PI),
      length: random(10, 18),
      color: random(colors)
    });
  }
  return sprinkles;
}

function spawnNewDog() {
  const dog = createDog({
    name: randomChoice(DOG_NAMES),
    breed: randomChoice(DOG_BREEDS),
    age: floor(random(1, 13)),
    palette: randomChoice(COOKIE_COLORS),
    animate: true
  });
  addDog(dog);
}

function windowResized() {
  resizeCanvas(getCanvasWidth(), height);
}

function draw() {
  layoutMode = width > 760 ? 'horizontal' : 'vertical';
  const layout = computeLayout();
  if (Math.abs(height - layout.desiredHeight) > 2) {
    resizeCanvas(width, layout.desiredHeight);
    return;
  }

  background(BG_COLOR);
  drawHeader();

  classRect = layout.classRect;
  const classHovered = pointInRect(mouseX, mouseY, classRect);

  const displays = layout.slots.map((slot, idx) =>
    buildDisplayForDog(dogs[idx], slot, classRect)
  );

  drawGuides(displays);
  drawClassPanel(classRect, classHovered);

  let hoveredDog = null;
  dogs.forEach((dog, idx) => {
    const display = displays[idx];
    drawDogInstance(dog, display, classHovered);
    dog.display = display;
    if (display.hovered) {
      hoveredDog = dog;
    }
  });

  if (classHovered) {
    highlightSharedStructure(displays);
  }

  if (hoveredDog) {
    drawDogTooltip(hoveredDog);
  } else if (classHovered) {
    drawClassTooltip();
  }
}

function drawHeader() {
  push();
  textAlign(LEFT, TOP);
  fill('#a7773c');
  textSize(18);
  text('Cookie cutter blueprint (class) → Cookies (objects)', 32, 20);
  fill('#5d4c3a');
  textSize(14);
  text('Hover the class to highlight shared structure. Hover a cookie to see its unique attributes.', 32, 44);
  pop();
}

function computeLayout() {
  const padding = 32;
  if (layoutMode === 'horizontal') {
    const desiredHeight = 520;
    const classWidth = width * 0.32;
    const classHeight = desiredHeight - 160;
    const classRect = {
      x: padding,
      y: 90,
      w: classWidth,
      h: classHeight
    };

    const areaX = classRect.x + classRect.w + 40;
    const areaWidth = width - areaX - padding;
    const columns = dogs.length > 3 ? 2 : 1;
    const rows = Math.ceil(dogs.length / columns);
    const cellHeight = (desiredHeight - 180) / Math.max(rows, 1);

    const slots = [];
    for (let i = 0; i < dogs.length; i++) {
      const col = columns === 1 ? 0 : i % columns;
      const row = columns === 1 ? i : floor(i / columns);
      const cellWidth = areaWidth / columns;
      const cx = areaX + cellWidth * col + cellWidth / 2;
      const cy = 120 + cellHeight * row + cellHeight / 2;
      const size = Math.min(cellWidth, cellHeight) * 0.68;
      slots.push({ x: cx, y: cy, size });
    }
    return { desiredHeight, classRect, slots };
  }

  const columns = width > 560 ? 2 : 1;
  const cellHeight = 170;
  const rows = Math.max(1, Math.ceil(dogs.length / columns));
  const desiredHeight = 120 + 220 + 40 + rows * cellHeight + 40;
  const classRect = {
    x: padding,
    y: 80,
    w: width - padding * 2,
    h: 220
  };
  const slots = [];
  const areaTop = classRect.y + classRect.h + 60;
  const cellWidth = (width - padding * 2) / columns;
  for (let i = 0; i < dogs.length; i++) {
    const col = columns === 1 ? 0 : i % columns;
    const row = floor(i / columns);
    const cx = padding + cellWidth * col + cellWidth / 2;
    const cy = areaTop + row * cellHeight + cellHeight / 2;
    const size = Math.min(cellWidth * 0.7, 120);
    slots.push({ x: cx, y: cy, size });
  }
  return { desiredHeight, classRect, slots };
}

function buildDisplayForDog(dog, slot, classRect) {
  if (!slot) return null;
  const start = layoutMode === 'horizontal'
    ? { x: classRect.x + classRect.w * 0.9, y: classRect.y + classRect.h * 0.5 }
    : { x: classRect.x + classRect.w * 0.5, y: classRect.y + classRect.h * 0.85 };

  let cx = slot.x;
  let cy = slot.y;
  if (dog.spawnStart) {
    const elapsed = millis() - dog.spawnStart;
    const t = constrain(elapsed / 900, 0, 1);
    const eased = easeOutCubic(t);
    cx = lerp(start.x, slot.x, eased);
    cy = lerp(start.y, slot.y, eased);
    if (t >= 1) {
      dog.spawnStart = null;
    }
  }

  const hovered = dist(mouseX, mouseY, cx, cy) <= slot.size * 0.55;
  return { ...slot, x: cx, y: cy, hovered };
}

function drawGuides(displays) {
  const anchor = layoutMode === 'horizontal'
    ? { x: classRect.x + classRect.w, y: classRect.y + classRect.h / 2 }
    : { x: classRect.x + classRect.w / 2, y: classRect.y + classRect.h };

  displays.forEach((display, idx) => {
    if (!display) return;
    drawArrow(anchor, { x: display.x, y: display.y }, idx);
  });
}

function drawArrow(start, end, idx) {
  push();
  stroke(ARROW_COLOR);
  strokeWeight(2.5);
  strokeCap(ROUND);
  const offsetAngle = atan2(end.y - start.y, end.x - start.x);
  const arrowLen = dist(start.x, start.y, end.x, end.y) - 50;
  const ax = start.x + cos(offsetAngle) * 20;
  const ay = start.y + sin(offsetAngle) * 20;
  const bx = ax + cos(offsetAngle) * arrowLen;
  const by = ay + sin(offsetAngle) * arrowLen;
  line(ax, ay, bx, by);
  drawArrowHead({ x: bx, y: by }, offsetAngle);

  noStroke();
  fill(ARROW_COLOR);
  textSize(12);
  textAlign(CENTER, CENTER);
  const labelOffset = (idx - (dogs.length - 1) / 2) * 14;
  const tx = lerp(ax, bx, 0.6) + (layoutMode === 'horizontal' ? 0 : labelOffset);
  const ty = lerp(ay, by, 0.6) - (layoutMode === 'horizontal' ? labelOffset : 0);
  text('instantiation', tx, ty);
  pop();
}

function drawArrowHead(point, angle) {
  push();
  translate(point.x, point.y);
  rotate(angle);
  fill(ARROW_COLOR);
  noStroke();
  beginShape();
  vertex(0, 0);
  vertex(-12, 5);
  vertex(-12, -5);
  endShape(CLOSE);
  pop();
}

function drawClassPanel(classBox, hovered) {
  push();
  translate(classBox.x, classBox.y);
  noStroke();
  fill(hovered ? '#d5e5ff' : CLASS_FILL);
  rect(0, 0, classBox.w, classBox.h, 28);

  drawCookieCutter(classBox.w * 0.3, classBox.h * 0.52, classBox.h * 0.55, hovered);

  fill(CLASS_STROKE);
  textSize(20);
  text('Dog class (cookie cutter)', classBox.w * 0.43, 20);

  fill('#203354');
  textSize(15);
  text('Attributes', classBox.w * 0.43, 70);
  fill('#3f4f63');
  text('• name\n• breed\n• age', classBox.w * 0.43, 96);

  fill('#203354');
  textSize(15);
  text('Methods', classBox.w * 0.43, 170);
  fill('#3f4f63');
  text('• bark()\n• sit()\n• fetch()', classBox.w * 0.43, 196);

  fill('#4c6bbf');
  textSize(13);
  text('One blueprint can stamp out many Dog objects.', classBox.w * 0.05, classBox.h - 60);

  pop();
}

function drawCookieCutter(cx, cy, size, hovered) {
  push();
  translate(cx, cy);
  noFill();
  stroke(hovered ? '#4d8dff' : '#7ca5e8');
  strokeWeight(8);
  const r = size / 2;
  beginShape();
  const steps = 22;
  for (let i = 0; i < steps; i++) {
    const angle = (TWO_PI / steps) * i;
    const wobble = 1 + 0.2 * sin(angle * 2);
    vertex(cos(angle) * r * wobble, sin(angle) * r * wobble);
  }
  endShape(CLOSE);
  stroke('#ffffff');
  strokeWeight(2);
  ellipse(0, 0, size * 0.9, size * 0.9);
  pop();
}

function drawDogInstance(dog, display, classHovered) {
  if (!display) return;
  push();
  translate(display.x, display.y);
  const radius = display.size / 2;

  for (let i = 3; i >= 1; i--) {
    const alpha = map(i, 1, 3, 0.15, 0.4) * 255;
    noFill();
    stroke(60, 115, 214, alpha);
    strokeWeight(i);
    ellipse(0, 0, radius * 2 + i * 10);
  }

  noStroke();
  const baseColor = color(dog.palette.base);
  const cookieColor = classHovered ? lerpColor(baseColor, color('#ffffff'), 0.15) : baseColor;
  fill(cookieColor);
  stroke(dog.palette.edge);
  strokeWeight(3);
  beginShape();
  const steps = 26;
  for (let i = 0; i < steps; i++) {
    const angle = (TWO_PI / steps) * i;
    const wobble = 1 + 0.12 * sin(angle * 3 + i * 0.1);
    vertex(cos(angle) * radius * wobble, sin(angle) * radius * wobble);
  }
  endShape(CLOSE);

  drawSprinkles(dog.sprinkles, radius);

  noStroke();
  fill('#4a321f');
  textAlign(CENTER, CENTER);
  textSize(16);
  text(dog.label, 0, -radius - 24);

  fill('#5a4330');
  textSize(13);
  textStyle(BOLD);
  text(dog.name, 0, -8);
  textStyle(NORMAL);
  textSize(12);
  text(`${dog.breed}`, 0, 12);
  text(`age ${dog.age}`, 0, 30);

  pop();
}

function drawSprinkles(sprinkles, radius) {
  sprinkles.forEach((s) => {
    push();
    const x = s.dx * radius * 1.6;
    const y = s.dy * radius * 1.6;
    translate(x, y);
    rotate(s.angle);
    stroke(s.color);
    strokeWeight(3);
    line(-s.length / 2, 0, s.length / 2, 0);
    pop();
  });
}

function highlightSharedStructure(displays) {
  push();
  noFill();
  stroke('rgba(60,115,214,0.4)');
  strokeWeight(5);
  rect(classRect.x - 8, classRect.y - 8, classRect.w + 16, classRect.h + 16, 30);
  displays.forEach((display) => {
    if (!display) return;
    ellipse(display.x, display.y, display.size + 26);
  });
  pop();

  push();
  fill('#2a4a92');
  noStroke();
  textSize(13);
  textAlign(LEFT, TOP);
  text('Shared structure = same attributes + methods', classRect.x, classRect.y - 36);
  pop();
}

function drawDogTooltip(dog) {
  const lines = [
    `${dog.label}`,
    `name: ${dog.name}`,
    `breed: ${dog.breed}`,
    `age: ${dog.age}`
  ];
  drawTooltipBox(dog.display, lines);
}

function drawClassTooltip() {
  const lines = [
    'Dog class blueprint',
    '• Defines attributes (name, breed, age)',
    '• Defines methods (bark, sit, fetch)',
    '• Guides every Dog object'
  ];
  const display = {
    x: classRect.x + classRect.w * 0.25,
    y: classRect.y + classRect.h * 0.25,
    size: 0
  };
  drawTooltipBox(display, lines, true);
}

function drawTooltipBox(target, lines, alignLeft = false) {
  push();
  textSize(13);
  textAlign(LEFT, TOP);
  const padding = 14;
  let widthNeeded = 0;
  lines.forEach((line) => {
    widthNeeded = max(widthNeeded, textWidth(line));
  });
  const boxWidth = widthNeeded + padding * 2;
  const boxHeight = lines.length * 18 + padding * 2;

  let tx = alignLeft ? target.x : target.x + target.size / 2 + 20;
  let ty = target.y - target.size / 2 - boxHeight / 2;

  if (tx + boxWidth > width - 20) tx = width - boxWidth - 20;
  if (ty < 20) ty = 20;
  if (ty + boxHeight > height - 20) ty = height - boxHeight - 20;
  if (tx < 20) tx = 20;

  fill(255, 255, 255, 230);
  stroke('#cfa168');
  strokeWeight(1.5);
  rect(tx, ty, boxWidth, boxHeight, 14);

  fill('#5a4330');
  lines.forEach((line, idx) => {
    text(line, tx + padding, ty + padding + idx * 18);
  });
  pop();
}

function easeOutCubic(t) {
  return 1 - pow(1 - t, 3);
}

function randomChoice(arr) {
  return arr[floor(random(arr.length))];
}

function pointInRect(px, py, rect) {
  return px >= rect.x && px <= rect.x + rect.w && py >= rect.y && py <= rect.y + rect.h;
}
