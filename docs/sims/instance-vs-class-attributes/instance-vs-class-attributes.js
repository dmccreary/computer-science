/*
 * Instance vs. Class Attributes - Memory Diagram
 * Shows a Dog class with a shared class attribute (species) at the top,
 * and multiple Dog instances below, each with unique instance attributes.
 * Dashed orange arrows connect instances to the shared class attribute.
 *
 * Interactions:
 *   - Hover over "species" in the class box to highlight all dashed arrows
 *   - Hover over any instance attribute to highlight just that attribute
 *   - Click "Add Dog" to create a new instance with random attributes
 *   - Toggle "Show Memory Addresses" to reveal that all instances share one location
 */

// === Canvas layout ===
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// === UI controls ===
let addDogButton;
let showAddressCheckbox;

// === Data ===
let dogs = [];
let showAddresses = false;

// Class attribute - shared by all instances
const CLASS_SPECIES = 'Canis familiaris';
const CLASS_MEM_ADDR = '0x7FA200';

// Random names, breeds, ages for spawning new dogs
const NAMES = ['Bailey', 'Coco', 'Rex', 'Bella', 'Milo', 'Charlie',
               'Nova', 'Shadow', 'Penny', 'Ziggy', 'Mocha', 'Hazel',
               'Rosie', 'Bear', 'Daisy', 'Tucker', 'Sadie', 'Duke'];
const BREEDS = ['Poodle', 'Beagle', 'Corgi', 'Husky', 'Lab Mix',
                'Dalmatian', 'Boxer', 'Terrier', 'Shepherd Mix',
                'Chihuahua', 'Bulldog', 'Dachshund'];

// Memory addresses for instances (pre-generated for display)
const INSTANCE_ADDRS = [
  '0x7FB100', '0x7FB200', '0x7FB300', '0x7FB400',
  '0x7FB500', '0x7FB600', '0x7FB700', '0x7FB800'
];

// === Colors ===
const CLASS_BG = '#dce8fc';       // light blue for class box
const CLASS_BORDER = '#3c73d6';   // blue border
const INST_BG = '#d9f2d9';        // light green for instance boxes
const INST_BORDER = '#2d8a2d';    // green border
const ARROW_COLOR = '#e67e22';    // orange dashed arrows
const HIGHLIGHT_ARROW = '#d35400'; // darker orange on hover
const HIGHLIGHT_ATTR = '#ffffb0'; // yellow highlight for hovered attribute

// === Hover state ===
let hoverClassSpecies = false;     // true when mouse is over species in class box
let hoveredInstanceIdx = -1;       // index of instance with a hovered attribute
let hoveredAttrName = '';          // which attribute name is hovered

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Create controls
  addDogButton = createButton('Add Dog');
  addDogButton.position(10, drawHeight + 10);
  addDogButton.mousePressed(addNewDog);

  showAddressCheckbox = createCheckbox('Show Memory Addresses', false);
  showAddressCheckbox.position(110, drawHeight + 10);
  showAddressCheckbox.changed(() => {
    showAddresses = showAddressCheckbox.checked();
  });

  // Initial dogs
  dogs.push({ name: 'Buddy', breed: 'Golden Retriever', age: 3 });
  dogs.push({ name: 'Luna', breed: 'Poodle', age: 5 });
  dogs.push({ name: 'Max', breed: 'Beagle', age: 1 });

  describe('Interactive memory diagram showing a Dog class with a shared species attribute and multiple Dog instances with unique name, breed, and age attributes. Dashed arrows show how instances reference the class attribute.', LABEL);
}

function draw() {
  updateCanvasSize();

  // === Draw background regions ===
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // === Title ===
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(20);
  text('Instance vs. Class Attributes', canvasWidth / 2, 8);

  // Reset text defaults
  textAlign(LEFT, TOP);
  textSize(defaultTextSize);

  // === Layout calculations ===
  let classBoxW = Math.min(320, canvasWidth - 40);
  let classBoxH = showAddresses ? 90 : 70;
  let classBoxX = (canvasWidth - classBoxW) / 2;
  let classBoxY = 40;

  // Instance boxes layout
  let instBoxW = Math.min(200, (canvasWidth - 40) / Math.min(dogs.length, 3) - 10);
  let instBoxH = showAddresses ? 120 : 100;

  // Calculate top of instance row
  let instTopY = classBoxY + classBoxH + 80;

  // Determine how many columns and rows
  let maxCols = Math.max(1, Math.floor((canvasWidth - 20) / (instBoxW + 10)));
  let cols = Math.min(dogs.length, maxCols);
  let rows = Math.ceil(dogs.length / cols);

  // Recompute instBoxW to fill available space nicely
  instBoxW = Math.min(200, (canvasWidth - 20 - (cols - 1) * 10) / cols);

  let totalInstWidth = cols * instBoxW + (cols - 1) * 10;
  let instStartX = (canvasWidth - totalInstWidth) / 2;

  // === Detect hover states ===
  hoverClassSpecies = false;
  hoveredInstanceIdx = -1;
  hoveredAttrName = '';

  // Check hover on class box species attribute area
  let speciesTextX = classBoxX + 15;
  let speciesTextY = classBoxY + 38;
  let speciesTextW = textWidth('species = "' + CLASS_SPECIES + '"') + 10;
  let speciesTextH = 22;
  if (mouseX >= speciesTextX && mouseX <= speciesTextX + speciesTextW &&
      mouseY >= speciesTextY && mouseY <= speciesTextY + speciesTextH) {
    hoverClassSpecies = true;
  }

  // Check hover on instance attributes
  for (let i = 0; i < dogs.length; i++) {
    let col = i % cols;
    let row = Math.floor(i / cols);
    let bx = instStartX + col * (instBoxW + 10);
    let by = instTopY + row * (instBoxH + 50);
    let attrStartY = by + 26;
    let attrs = ['name', 'breed', 'age'];
    for (let a = 0; a < attrs.length; a++) {
      let ay = attrStartY + a * 20;
      if (mouseX >= bx + 5 && mouseX <= bx + instBoxW - 5 &&
          mouseY >= ay && mouseY <= ay + 18) {
        hoveredInstanceIdx = i;
        hoveredAttrName = attrs[a];
      }
    }
  }

  // === Draw the class box ===
  drawClassBox(classBoxX, classBoxY, classBoxW, classBoxH);

  // === Draw instance boxes and arrows ===
  for (let i = 0; i < dogs.length; i++) {
    let col = i % cols;
    let row = Math.floor(i / cols);
    let bx = instStartX + col * (instBoxW + 10);
    let by = instTopY + row * (instBoxH + 50);

    // Draw dashed arrow from instance to class species
    let arrowStartX = bx + instBoxW / 2;
    let arrowStartY = by;
    let arrowEndX = classBoxX + classBoxW / 2;
    let arrowEndY = classBoxY + classBoxH;

    let isArrowHighlighted = hoverClassSpecies;
    drawDashedArrow(arrowStartX, arrowStartY, arrowEndX, arrowEndY, isArrowHighlighted);

    // Draw instance box
    drawInstanceBox(bx, by, instBoxW, instBoxH, dogs[i], i);
  }

  // === Draw legend at bottom of drawing area ===
  let legendY = drawHeight - 28;
  noStroke();
  fill('#666');
  textSize(12);
  textAlign(CENTER, TOP);
  text('Hover over "species" to see how all instances share it  |  Hover over instance attributes to highlight them', canvasWidth / 2, legendY);
}

function drawClassBox(x, y, w, h) {
  // Box background
  stroke(CLASS_BORDER);
  strokeWeight(2);
  fill(CLASS_BG);
  rect(x, y, w, h, 8);

  // Header
  noStroke();
  fill(CLASS_BORDER);
  textSize(16);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Dog (class)', x + 15, y + 8);
  textStyle(NORMAL);

  // Separator line
  stroke(CLASS_BORDER);
  strokeWeight(1);
  line(x + 10, y + 30, x + w - 10, y + 30);

  // Species attribute - highlight if hovered
  let attrY = y + 38;
  if (hoverClassSpecies) {
    noStroke();
    fill(HIGHLIGHT_ATTR);
    rect(x + 10, attrY - 2, w - 20, 22, 4);
  }

  noStroke();
  fill('#333');
  textSize(14);
  textAlign(LEFT, TOP);
  text('species = "' + CLASS_SPECIES + '"', x + 15, attrY);

  // Memory address
  if (showAddresses) {
    fill('#888');
    textSize(11);
    text('addr: ' + CLASS_MEM_ADDR, x + 15, attrY + 24);
  }
}

function drawInstanceBox(x, y, w, h, dog, idx) {
  let isThisHovered = (hoveredInstanceIdx === idx);

  // Box background
  stroke(INST_BORDER);
  strokeWeight(isThisHovered ? 3 : 2);
  fill(INST_BG);
  rect(x, y, w, h, 8);

  // Variable name header
  noStroke();
  fill(INST_BORDER);
  textSize(14);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  let varName = dog.name.toLowerCase();
  text(varName + ' (Dog instance)', x + 8, y + 6);
  textStyle(NORMAL);

  // Separator
  stroke(INST_BORDER);
  strokeWeight(1);
  line(x + 5, y + 24, x + w - 5, y + 24);

  // Instance attributes with solid borders
  let attrY = y + 26;
  let attrs = [
    { key: 'name', val: '"' + dog.name + '"' },
    { key: 'breed', val: '"' + dog.breed + '"' },
    { key: 'age', val: '' + dog.age }
  ];

  for (let a = 0; a < attrs.length; a++) {
    let ay = attrY + a * 20;

    // Highlight if this specific attribute is hovered
    if (isThisHovered && hoveredAttrName === attrs[a].key) {
      noStroke();
      fill(HIGHLIGHT_ATTR);
      rect(x + 5, ay - 1, w - 10, 19, 3);
    }

    // Solid border around each attribute to show ownership
    stroke('#5a5a5a');
    strokeWeight(1);
    noFill();
    rect(x + 5, ay - 1, w - 10, 19, 3);

    // Attribute text
    noStroke();
    fill('#333');
    textSize(13);
    textAlign(LEFT, TOP);
    text(attrs[a].key + ' = ' + attrs[a].val, x + 10, ay + 1);
  }

  // Species reference (italic, to show it comes from class)
  let refY = attrY + attrs.length * 20 + 2;
  noStroke();
  fill(ARROW_COLOR);
  textSize(11);
  textStyle(ITALIC);
  text('species -> Dog.species', x + 10, refY);
  textStyle(NORMAL);

  // Memory address
  if (showAddresses) {
    fill('#888');
    textSize(11);
    let addr = idx < INSTANCE_ADDRS.length ? INSTANCE_ADDRS[idx] : '0x7FB' + (900 + idx * 100);
    text('addr: ' + addr, x + 10, refY + 16);
    // Show that species points to same address
    fill(ARROW_COLOR);
    textSize(10);
    text('species -> ' + CLASS_MEM_ADDR, x + 10, refY + 30);
  }
}

function drawDashedArrow(x1, y1, x2, y2, highlighted) {
  let col = highlighted ? HIGHLIGHT_ARROW : ARROW_COLOR;
  let weight = highlighted ? 3 : 2;

  push();
  stroke(col);
  strokeWeight(weight);

  // Draw dashed line
  let d = dist(x1, y1, x2, y2);
  let dashLen = 8;
  let gapLen = 6;
  let angle = atan2(y2 - y1, x2 - x1);

  let drawn = 0;
  let drawing = true;
  while (drawn < d - 10) {
    let segLen = drawing ? dashLen : gapLen;
    if (drawn + segLen > d - 10) segLen = d - 10 - drawn;
    if (drawing) {
      let sx = x1 + cos(angle) * drawn;
      let sy = y1 + sin(angle) * drawn;
      let ex = x1 + cos(angle) * (drawn + segLen);
      let ey = y1 + sin(angle) * (drawn + segLen);
      line(sx, sy, ex, ey);
    }
    drawn += segLen;
    drawing = !drawing;
  }

  // Arrowhead at the end (pointing to class box)
  let headX = x2;
  let headY = y2;
  let headAngle = atan2(y2 - y1, x2 - x1);
  fill(col);
  noStroke();
  push();
  translate(headX, headY);
  rotate(headAngle);
  triangle(0, 0, -12, -5, -12, 5);
  pop();

  pop();
}

function addNewDog() {
  // Limit to 8 dogs to keep diagram readable
  if (dogs.length >= 8) return;

  let name = NAMES[Math.floor(Math.random() * NAMES.length)];
  let breed = BREEDS[Math.floor(Math.random() * BREEDS.length)];
  let age = Math.floor(Math.random() * 12) + 1;
  dogs.push({ name: name, breed: breed, age: age });
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
