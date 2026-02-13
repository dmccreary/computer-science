// Polymorphism Playground MicroSim
// Add different animal objects and call speak()/move() on all of them
// Demonstrates polymorphism and duck typing with RobotPet
// MicroSim template version 2026.02

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

// Controls
let nameInput;
let speakBtn, moveBtn, clearBtn;
let showTypeCheckbox;
let showTypes = false;

// Animal types
const ANIMAL_TYPES = [
  { type: 'Dog',      emoji: '\uD83D\uDC36', color: [65, 105, 225], speakResult: 'Woof!', moveResult: 'runs excitedly', inherits: true },
  { type: 'Cat',      emoji: '\uD83D\uDC31', color: [34, 139, 34],  speakResult: 'Meow!', moveResult: 'slinks gracefully', inherits: true },
  { type: 'Bird',     emoji: '\uD83D\uDC26', color: [220, 130, 0],  speakResult: 'Tweet!', moveResult: 'flies through the air', inherits: true },
  { type: 'Fish',     emoji: '\uD83D\uDC1F', color: [0, 160, 200],  speakResult: 'Blub!', moveResult: 'swims in circles', inherits: true },
  { type: 'RobotPet', emoji: '\uD83E\uDD16', color: [120, 120, 140], speakResult: 'Beep boop!', moveResult: 'rolls on wheels', inherits: false }
];

let animalButtons = [];
let animals = []; // { type, name, emoji, color, speakResult, moveResult, x, y, inherits, flash }
let consoleLines = [];
let maxConsoleLines = 12;
let flashTimer = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Name input
  nameInput = createInput('Rex');
  nameInput.position(10, drawHeight + 10);
  nameInput.size(60);
  nameInput.attribute('placeholder', 'Name');

  // Animal type buttons
  let btnX = 80;
  for (let at of ANIMAL_TYPES) {
    let btn = createButton(at.emoji + ' ' + at.type);
    btn.position(btnX, drawHeight + 10);
    btn.mousePressed(() => addAnimal(at));
    btn.style('font-size', '11px');
    animalButtons.push(btn);
    btnX += btn.size().width + 5;
  }

  // Action buttons row 2
  speakBtn = createButton('Call speak() on all');
  speakBtn.position(10, drawHeight + 45);
  speakBtn.mousePressed(callSpeak);

  moveBtn = createButton('Call move() on all');
  moveBtn.position(160, drawHeight + 45);
  moveBtn.mousePressed(callMove);

  clearBtn = createButton('Clear All');
  clearBtn.position(300, drawHeight + 45);
  clearBtn.mousePressed(() => { animals = []; consoleLines = []; });

  showTypeCheckbox = createCheckbox(' Show Class Type', false);
  showTypeCheckbox.position(380, drawHeight + 48);
  showTypeCheckbox.changed(() => showTypes = showTypeCheckbox.checked());

  describe('Polymorphism playground where students add animal objects and call speak() and move() on all of them to see polymorphism and duck typing in action.', LABEL);
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

  // Decrease flash timers
  for (let a of animals) {
    if (a.flash > 0) a.flash -= 2;
  }

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Polymorphism Playground', canvasWidth / 2, 6);

  // Split view: left is animal pen, right is console
  let penWidth = canvasWidth * 0.55;
  let consoleX = penWidth + 5;
  let consoleWidth = canvasWidth - consoleX - 5;

  // Pen area
  stroke(180);
  strokeWeight(1);
  fill(240, 248, 255);
  rect(5, 30, penWidth - 10, drawHeight - 40, 6);

  noStroke();
  fill(150);
  textAlign(CENTER, TOP);
  textSize(11);
  text('Animal Pen (click to add animals above)', penWidth / 2, 33);

  // Draw animals in pen
  drawAnimals(5, 48, penWidth - 10, drawHeight - 60);

  // Console area
  stroke(60);
  strokeWeight(1);
  fill(30, 30, 40);
  rect(consoleX, 30, consoleWidth, drawHeight - 40, 6);

  noStroke();
  fill(0, 255, 0);
  textAlign(LEFT, TOP);
  textSize(10);
  text('>>> Console Output', consoleX + 8, 34);

  // Console lines
  let cy = 50;
  fill(0, 255, 100);
  textSize(10);
  textAlign(LEFT, TOP);
  for (let i = Math.max(0, consoleLines.length - maxConsoleLines); i < consoleLines.length; i++) {
    let line = consoleLines[i];
    if (line.type === 'header') {
      fill(255, 255, 100);
    } else if (line.type === 'duck') {
      fill(255, 150, 255);
    } else {
      fill(0, 255, 100);
    }
    text(line.text, consoleX + 8, cy);
    cy += 14;
  }

  // Duck typing label
  if (animals.some(a => !a.inherits)) {
    noStroke();
    fill(255, 150, 255, 60);
    textAlign(CENTER, BOTTOM);
    textSize(10);
    fill(120, 80, 140);
    text('Purple = duck typing (no inheritance)', consoleX + consoleWidth / 2, drawHeight - 8);
  }

  // Instructions if empty
  if (animals.length === 0) {
    noStroke();
    fill(120);
    textAlign(CENTER, CENTER);
    textSize(14);
    text('Enter a name and click an\nanimal button to add it', penWidth / 2, drawHeight / 2);
  }
}

function drawAnimals(px, py, pw, ph) {
  let cols = Math.floor(pw / 80);
  if (cols < 1) cols = 1;

  for (let i = 0; i < animals.length; i++) {
    let a = animals[i];
    let col = i % cols;
    let row = Math.floor(i / cols);
    let ax = px + col * 80 + 40;
    let ay = py + row * 75 + 30;

    // Flash effect when method called
    if (a.flash > 0) {
      noStroke();
      fill(a.color[0], a.color[1], a.color[2], a.flash);
      ellipse(ax, ay, 65, 65);
    }

    // Robot pet gets special border
    if (!a.inherits) {
      stroke(180, 140, 200);
      strokeWeight(2);
      drawingContext.setLineDash([3, 3]);
      noFill();
      ellipse(ax, ay, 60, 60);
      drawingContext.setLineDash([]);
    }

    // Emoji
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(32);
    text(a.emoji, ax, ay - 4);

    // Name
    fill(a.color[0], a.color[1], a.color[2]);
    textSize(11);
    textStyle(BOLD);
    text(a.name, ax, ay + 24);
    textStyle(NORMAL);

    // Show type if toggled
    if (showTypes) {
      fill(100);
      textSize(9);
      text('<' + a.type + '>', ax, ay + 36);
    }
  }
}

function addAnimal(at) {
  let name = nameInput.value().trim() || 'Pet';
  animals.push({
    type: at.type,
    name: name,
    emoji: at.emoji,
    color: at.color,
    speakResult: at.speakResult,
    moveResult: at.moveResult,
    inherits: at.inherits,
    flash: 0
  });

  consoleLines.push({
    text: '>>> ' + name + ' = ' + at.type + '("' + name + '")',
    type: at.inherits ? 'normal' : 'duck'
  });

  // Cycle default names
  let names = ['Rex', 'Whiskers', 'Tweety', 'Nemo', 'Robo', 'Buddy', 'Luna', 'Max'];
  nameInput.value(names[animals.length % names.length]);
}

function callSpeak() {
  if (animals.length === 0) return;

  consoleLines.push({ text: '>>> for pet in animals:', type: 'header' });
  consoleLines.push({ text: '>>>     print(pet.speak())', type: 'header' });

  for (let a of animals) {
    a.flash = 200;
    consoleLines.push({
      text: a.name + ': ' + a.speakResult,
      type: a.inherits ? 'normal' : 'duck'
    });
  }
  consoleLines.push({ text: '', type: 'normal' });
}

function callMove() {
  if (animals.length === 0) return;

  consoleLines.push({ text: '>>> for pet in animals:', type: 'header' });
  consoleLines.push({ text: '>>>     print(pet.move())', type: 'header' });

  for (let a of animals) {
    a.flash = 200;
    consoleLines.push({
      text: a.name + ' ' + a.moveResult,
      type: a.inherits ? 'normal' : 'duck'
    });
  }
  consoleLines.push({ text: '', type: 'normal' });
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
