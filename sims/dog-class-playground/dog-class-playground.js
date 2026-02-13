/*
 * Dog Class Interactive Playground
 * Create Dog objects, call methods, and observe results interactively.
 * Simulates Python class instantiation, method calls, and attribute access.
 *
 * Bloom Level: Apply (L3) — construct, demonstrate
 * Learning Objective: Create Dog objects, call methods, and observe results.
 */

// ---- responsive canvas globals ----
let canvasWidth = 400;
let drawHeight = 600;
let controlHeight = 0; // controls are integrated into the canvas
let canvasHeight = drawHeight;
let margin = 12;
let defaultTextSize = 14;

// ---- application state ----
let dogs = [];
let dogCount = 0;
let consoleLines = [];
let maxConsoleLines = 8;

// input fields
let nameInput, breedInput, ageInput, createBtn;

// kennel scroll
let kennelScrollY = 0;

// card buttons hovered
let hoveredBtn = null;

// ---- color palette ----
const BG = '#f5f0e8';
const CARD_COLORS = ['#fff3e0', '#e8f5e9', '#e3f2fd', '#fce4ec', '#f3e5f5', '#fff8e1'];
const CARD_BORDERS = ['#ef6c00', '#2e7d32', '#1565c0', '#c62828', '#6a1b9a', '#f9a825'];
const CONSOLE_BG = '#1e1e2e';
const CONSOLE_TEXT = '#a6e3a1';
const HEADER_BG = '#2c5693';

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // create input fields
  nameInput = createInput('Buddy');
  nameInput.attribute('placeholder', 'Name');
  nameInput.size(80);

  breedInput = createInput('Golden Retriever');
  breedInput.attribute('placeholder', 'Breed');
  breedInput.size(110);

  ageInput = createInput('3');
  ageInput.attribute('placeholder', 'Age');
  ageInput.size(30);

  createBtn = createButton('Create Dog');
  createBtn.mousePressed(createDog);

  positionInputs();

  // start with one demo dog
  addDog('Buddy', 'Golden Retriever', 3);

  describe(
    'An interactive playground where students create Dog objects, ' +
    'call methods like bark and birthday, and see output in a console.',
    LABEL
  );
}

function draw() {
  updateCanvasSize();
  background(BG);
  hoveredBtn = null;

  // ---- Header ----
  noStroke();
  fill(HEADER_BG);
  rect(0, 0, canvasWidth, 40, 0);
  fill('white');
  textAlign(LEFT, CENTER);
  textSize(18);
  textStyle(BOLD);
  text('Dog Class Playground', 14, 20);
  textStyle(NORMAL);

  // Dog count badge
  let badge = 'Dogs: ' + dogCount;
  textSize(13);
  let bw = textWidth(badge) + 16;
  fill('#ef6c00');
  rect(canvasWidth - bw - 10, 10, bw, 22, 11);
  fill('white');
  textAlign(CENTER, CENTER);
  text(badge, canvasWidth - bw / 2 - 10, 21);

  // ---- Create form area ----
  fill('#ffffff');
  stroke('#d0d0d0');
  strokeWeight(1);
  rect(0, 40, canvasWidth, 45);
  noStroke();
  fill('#555');
  textAlign(LEFT, CENTER);
  textSize(12);
  text('Create:', 8, 62);

  positionInputs();

  // ---- Kennel area ----
  let kennelTop = 90;
  let consoleH = 160;
  let kennelBottom = drawHeight - consoleH - 5;
  let kennelH = kennelBottom - kennelTop;

  // kennel background
  fill('#faf6ef');
  stroke('#d4c8a8');
  strokeWeight(1);
  rect(4, kennelTop, canvasWidth - 8, kennelH, 6);

  // kennel label
  noStroke();
  fill('#8a7a5a');
  textAlign(LEFT, TOP);
  textSize(11);
  text('KENNEL', 12, kennelTop + 4);

  // draw dog cards with clipping
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(4, kennelTop + 18, canvasWidth - 8, kennelH - 22);
  drawingContext.clip();

  let cardW = min(canvasWidth - 30, 350);
  let cardH = 80;
  let cardGap = 8;
  let cardX = (canvasWidth - cardW) / 2;

  for (let i = 0; i < dogs.length; i++) {
    let cardY = kennelTop + 22 + i * (cardH + cardGap) + kennelScrollY;

    // skip if off screen
    if (cardY + cardH < kennelTop || cardY > kennelBottom) continue;

    drawDogCard(dogs[i], cardX, cardY, cardW, cardH, i);
  }

  drawingContext.restore();

  // scroll indicator
  let totalCardsH = dogs.length * (cardH + cardGap);
  if (totalCardsH > kennelH - 22) {
    let scrollBarH = max(20, (kennelH - 22) / totalCardsH * (kennelH - 22));
    let scrollBarY = kennelTop + 20 + (-kennelScrollY / totalCardsH) * (kennelH - 22);
    fill(200, 180, 140, 150);
    noStroke();
    rect(canvasWidth - 14, scrollBarY, 6, scrollBarH, 3);
  }

  // ---- Console area ----
  let consoleY = kennelBottom + 5;
  fill(CONSOLE_BG);
  stroke('#3a3a5a');
  strokeWeight(1);
  rect(4, consoleY, canvasWidth - 8, consoleH, 6);

  // console label
  noStroke();
  fill('#6a6a8a');
  textAlign(LEFT, TOP);
  textSize(11);
  text('OUTPUT CONSOLE', 12, consoleY + 4);

  // console lines
  fill(CONSOLE_TEXT);
  textSize(13);
  textAlign(LEFT, TOP);
  let lineH = 18;
  let startLine = max(0, consoleLines.length - maxConsoleLines);
  for (let i = startLine; i < consoleLines.length; i++) {
    let ly = consoleY + 20 + (i - startLine) * lineH;
    let cl = consoleLines[i];
    if (cl.color) fill(cl.color);
    else fill(CONSOLE_TEXT);
    text('>>> ' + cl.text, 12, ly);
  }
}

function drawDogCard(dog, x, y, w, h, idx) {
  let ci = idx % CARD_COLORS.length;

  // card background
  fill(CARD_COLORS[ci]);
  stroke(CARD_BORDERS[ci]);
  strokeWeight(1.5);
  rect(x, y, w, h, 8);

  // dog info
  noStroke();
  fill('#333');
  textAlign(LEFT, TOP);
  textSize(15);
  textStyle(BOLD);
  text(dog.name, x + 10, y + 8);
  textStyle(NORMAL);
  textSize(12);
  fill('#666');
  text(dog.breed + '  |  age: ' + dog.age, x + 10, y + 28);

  // method buttons
  let btnY = y + 50;
  let btnH = 22;
  let btnGap = 6;
  let bx = x + 10;

  let buttons = [
    { label: 'Bark', action: 'bark', color: '#4caf50' },
    { label: 'Birthday', action: 'birthday', color: '#ff9800' },
    { label: 'Describe', action: 'describe', color: '#2196f3' },
    { label: 'Print', action: 'str', color: '#9c27b0' },
    { label: 'Repr', action: 'repr', color: '#607d8b' }
  ];

  for (let b of buttons) {
    textSize(11);
    let bw = textWidth(b.label) + 16;
    let isHovered = mouseX > bx && mouseX < bx + bw && mouseY > btnY && mouseY < btnY + btnH;

    fill(isHovered ? lerpColor(color(b.color), color('#ffffff'), 0.3) : color(b.color));
    noStroke();
    rect(bx, btnY, bw, btnH, 4);
    fill('white');
    textAlign(CENTER, CENTER);
    text(b.label, bx + bw / 2, btnY + btnH / 2);

    if (isHovered) {
      hoveredBtn = { dogIdx: idx, action: b.action };
      cursor(HAND);
    }

    bx += bw + btnGap;
  }
}

function mousePressed() {
  if (hoveredBtn) {
    let dog = dogs[hoveredBtn.dogIdx];
    let action = hoveredBtn.action;
    let output = '';

    if (action === 'bark') {
      output = dog.name + ' says: Woof!';
    } else if (action === 'birthday') {
      dog.age++;
      output = 'Happy birthday, ' + dog.name + "! You're now " + dog.age + '.';
    } else if (action === 'describe') {
      output = dog.name + ' is a ' + dog.age + '-year-old ' + dog.breed + '.';
    } else if (action === 'str') {
      output = dog.name + ' the ' + dog.breed + ', age ' + dog.age;
    } else if (action === 'repr') {
      output = "Dog('" + dog.name + "', '" + dog.breed + "', " + dog.age + ')';
    }

    consoleLines.push({ text: output });
  }
}

function mouseWheel(event) {
  let kennelTop = 90;
  let consoleH = 160;
  let kennelBottom = drawHeight - consoleH - 5;

  if (mouseY > kennelTop && mouseY < kennelBottom) {
    kennelScrollY -= event.delta;
    let totalH = dogs.length * 88;
    let visibleH = kennelBottom - kennelTop - 22;
    kennelScrollY = constrain(kennelScrollY, -(totalH - visibleH), 0);
    if (totalH < visibleH) kennelScrollY = 0;
    return false;
  }
}

function createDog() {
  let name = nameInput.value().trim();
  let breed = breedInput.value().trim();
  let age = parseInt(ageInput.value());

  if (!name) { consoleLines.push({ text: 'Error: Name is required!', color: '#f38ba8' }); return; }
  if (!breed) { consoleLines.push({ text: 'Error: Breed is required!', color: '#f38ba8' }); return; }
  if (isNaN(age) || age < 0) { consoleLines.push({ text: 'Error: Age must be a non-negative number!', color: '#f38ba8' }); return; }
  if (age > 30) { consoleLines.push({ text: 'Error: Age seems unrealistic for a dog!', color: '#f38ba8' }); return; }

  addDog(name, breed, age);
  consoleLines.push({ text: 'Created: Dog("' + name + '", "' + breed + '", ' + age + ')' });
}

function addDog(name, breed, age) {
  dogs.push({ name: name, breed: breed, age: age });
  dogCount++;
}

function positionInputs() {
  let y = 48;
  nameInput.position(55, y);
  breedInput.position(55 + 88, y);
  ageInput.position(55 + 88 + 118, y);
  createBtn.position(55 + 88 + 118 + 42, y);
}

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
