// UML Class Diagram Builder MicroSim
// View pre-built UML diagrams and drag classes to build your own
// Supports inheritance (hollow triangle) and composition (filled diamond) arrows
// MicroSim template version 2026.02

let canvasWidth = 400;
let drawHeight = 540;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

// Controls
let exampleSelect;
let clearBtn;
let modeSelect;

// State
let classBoxes = [];
let connections = [];
let selectedBox = null;
let draggingBox = null;
let dragOffsetX = 0, dragOffsetY = 0;
let connectFromBox = null;
let mode = 'select'; // 'select', 'inherit', 'compose'

// Pre-built examples
const EXAMPLES = {
  'Animal Hierarchy': {
    boxes: [
      { name: 'Animal', attrs: ['- name: str', '- sound: str'], methods: ['+ __init__()', '+ speak()', '+ __str__()'], x: 250, y: 40 },
      { name: 'Dog', attrs: [], methods: ['+ __init__()', '+ fetch()'], x: 150, y: 220 },
      { name: 'Cat', attrs: [], methods: ['+ __init__()', '+ purr()'], x: 350, y: 220 },
      { name: 'Puppy', attrs: ['- favorite_toy'], methods: ['+ __init__()'], x: 150, y: 400 }
    ],
    connections: [
      { from: 1, to: 0, type: 'inherit' },
      { from: 2, to: 0, type: 'inherit' },
      { from: 3, to: 1, type: 'inherit' }
    ]
  },
  'Shape Hierarchy': {
    boxes: [
      { name: 'Shape (ABC)', attrs: [], methods: ['+ area() [abstract]', '+ perimeter() [abstract]'], x: 250, y: 40, abstract: true },
      { name: 'Circle', attrs: ['- radius: float'], methods: ['+ __init__()', '+ area()', '+ perimeter()'], x: 100, y: 230 },
      { name: 'Rectangle', attrs: ['- width: float', '- height: float'], methods: ['+ __init__()', '+ area()', '+ perimeter()'], x: 280, y: 230 },
      { name: 'Triangle', attrs: ['- base: float', '- height: float'], methods: ['+ __init__()', '+ area()', '+ perimeter()'], x: 460, y: 230 }
    ],
    connections: [
      { from: 1, to: 0, type: 'inherit' },
      { from: 2, to: 0, type: 'inherit' },
      { from: 3, to: 0, type: 'inherit' }
    ]
  },
  'Car Composition': {
    boxes: [
      { name: 'Car', attrs: ['- make: str', '- model: str'], methods: ['+ __init__()', '+ start()'], x: 150, y: 80 },
      { name: 'Engine', attrs: ['- horsepower: int'], methods: ['+ __init__()', '+ start()'], x: 400, y: 80 }
    ],
    connections: [
      { from: 0, to: 1, type: 'compose' }
    ]
  },
  'Student Comparison': {
    boxes: [
      { name: 'Student', attrs: ['- name: str', '- gpa: float'], methods: ['+ __init__()', '+ __eq__()', '+ __lt__()', '+ __str__()'], x: 250, y: 120 }
    ],
    connections: []
  }
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Example dropdown
  exampleSelect = createSelect();
  exampleSelect.position(10, drawHeight + 12);
  exampleSelect.option('-- Load Example --');
  exampleSelect.option('Animal Hierarchy');
  exampleSelect.option('Shape Hierarchy');
  exampleSelect.option('Car Composition');
  exampleSelect.option('Student Comparison');
  exampleSelect.changed(loadExample);

  // Mode selector
  modeSelect = createSelect();
  modeSelect.position(180, drawHeight + 12);
  modeSelect.option('Select/Drag');
  modeSelect.option('Add Inheritance');
  modeSelect.option('Add Composition');
  modeSelect.changed(() => {
    let v = modeSelect.value();
    if (v === 'Select/Drag') mode = 'select';
    else if (v === 'Add Inheritance') mode = 'inherit';
    else mode = 'compose';
    connectFromBox = null;
  });

  // Clear button
  clearBtn = createButton('Clear');
  clearBtn.position(310, drawHeight + 12);
  clearBtn.mousePressed(() => {
    classBoxes = [];
    connections = [];
    selectedBox = null;
    connectFromBox = null;
    exampleSelect.selected('-- Load Example --');
  });

  // Load first example
  loadExample();

  describe('Interactive UML class diagram builder. Load pre-built examples or drag class boxes to build diagrams with inheritance and composition relationships.', LABEL);
}

function loadExample() {
  let name = exampleSelect.value();
  if (name === '-- Load Example --') {
    // Load Animal Hierarchy by default
    name = 'Animal Hierarchy';
    exampleSelect.selected(name);
  }

  let ex = EXAMPLES[name];
  if (!ex) return;

  classBoxes = [];
  connections = [];
  selectedBox = null;
  connectFromBox = null;

  // Scale positions to canvas width
  let scale = canvasWidth / 600;
  for (let b of ex.boxes) {
    classBoxes.push({
      name: b.name,
      attrs: [...b.attrs],
      methods: [...b.methods],
      x: b.x * scale,
      y: b.y,
      abstract: b.abstract || false
    });
  }
  connections = ex.connections.map(c => ({ ...c }));
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

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('UML Class Diagram Builder', canvasWidth / 2, 6);

  // Mode indicator
  textSize(12);
  textAlign(RIGHT, TOP);
  fill(100);
  if (mode === 'inherit') {
    fill(0, 0, 200);
    text('Mode: Click child then parent to add inheritance', canvasWidth - 10, 28);
  } else if (mode === 'compose') {
    fill(0, 150, 0);
    text('Mode: Click container then part to add composition', canvasWidth - 10, 28);
  }

  // Draw connections
  for (let conn of connections) {
    let fromBox = classBoxes[conn.from];
    let toBox = classBoxes[conn.to];
    if (!fromBox || !toBox) continue;

    let fromDims = getBoxDimensions(fromBox);
    let toDims = getBoxDimensions(toBox);

    if (conn.type === 'inherit') {
      drawInheritanceArrow(fromBox, fromDims, toBox, toDims);
    } else {
      drawCompositionArrow(fromBox, fromDims, toBox, toDims);
    }
  }

  // Draw pending connection line
  if (connectFromBox !== null && (mode === 'inherit' || mode === 'compose')) {
    stroke(mode === 'inherit' ? color(0, 0, 200) : color(0, 150, 0));
    strokeWeight(2);
    drawingContext.setLineDash([5, 5]);
    let fb = classBoxes[connectFromBox];
    line(fb.x, fb.y, mouseX, mouseY);
    drawingContext.setLineDash([]);
  }

  // Draw class boxes
  for (let i = 0; i < classBoxes.length; i++) {
    drawClassBox(classBoxes[i], i === selectedBox);
  }

  // Legend
  drawLegend();
}

function getBoxDimensions(box) {
  let w = 140;
  let headerH = 26;
  let attrH = Math.max(box.attrs.length * 16, 16);
  let methodH = Math.max(box.methods.length * 16, 16);
  let h = headerH + attrH + methodH + 12;
  return { w, h, headerH, attrH, methodH };
}

function drawClassBox(box, isSelected) {
  let dims = getBoxDimensions(box);
  let x = box.x - dims.w / 2;
  let y = box.y;

  // Shadow
  noStroke();
  fill(0, 0, 0, 20);
  rect(x + 2, y + 2, dims.w, dims.h, 4);

  // Box outline
  if (isSelected) {
    stroke(0, 100, 255);
    strokeWeight(3);
  } else {
    stroke(80);
    strokeWeight(1);
  }

  if (box.abstract) {
    drawingContext.setLineDash([4, 3]);
  }

  // Header
  fill(230, 230, 240);
  rect(x, y, dims.w, dims.headerH, 4, 4, 0, 0);

  // Body
  fill(255);
  stroke(isSelected ? color(0, 100, 255) : color(80));
  strokeWeight(isSelected ? 3 : 1);
  rect(x, y + dims.headerH, dims.w, dims.h - dims.headerH, 0, 0, 4, 4);
  drawingContext.setLineDash([]);

  // Divider between attrs and methods
  stroke(180);
  strokeWeight(1);
  line(x, y + dims.headerH + dims.attrH + 4, x + dims.w, y + dims.headerH + dims.attrH + 4);

  // Class name
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(14);
  textStyle(BOLD);
  text(box.name, box.x, y + dims.headerH / 2);
  textStyle(NORMAL);

  // Attributes
  textAlign(LEFT, TOP);
  textSize(11);
  fill(60);
  let ty = y + dims.headerH + 3;
  for (let attr of box.attrs) {
    text(attr, x + 6, ty);
    ty += 16;
  }
  if (box.attrs.length === 0) {
    fill(180);
    text('(none)', x + 6, ty);
  }

  // Methods
  ty = y + dims.headerH + dims.attrH + 7;
  fill(60);
  for (let m of box.methods) {
    text(m, x + 6, ty);
    ty += 16;
  }
  if (box.methods.length === 0) {
    fill(180);
    text('(none)', x + 6, ty);
  }
}

function drawInheritanceArrow(fromBox, fromDims, toBox, toDims) {
  // Blue arrow from child to parent with hollow triangle
  stroke(0, 0, 200);
  strokeWeight(2);
  fill(0, 0, 200);

  let fromY = fromBox.y; // top of child
  let toY = toBox.y + toDims.h; // bottom of parent

  line(fromBox.x, fromY, toBox.x, toY);

  // Hollow triangle at parent end
  let angle = atan2(toY - fromY, toBox.x - fromBox.x);
  push();
  translate(toBox.x, toY);
  rotate(angle);
  fill(255);
  stroke(0, 0, 200);
  strokeWeight(2);
  triangle(0, 0, -14, -7, -14, 7);
  pop();
}

function drawCompositionArrow(fromBox, fromDims, toBox, toDims) {
  // Green arrow with filled diamond on container side
  stroke(0, 150, 0);
  strokeWeight(2);

  let fromRight = fromBox.x + fromDims.w / 2;
  let fromCenterY = fromBox.y + fromDims.h / 2;
  let toLeft = toBox.x - toDims.w / 2;
  let toCenterY = toBox.y + toDims.h / 2;

  line(fromRight, fromCenterY, toLeft, toCenterY);

  // Filled diamond at container end
  let angle = atan2(toCenterY - fromCenterY, toLeft - fromRight);
  push();
  translate(fromRight, fromCenterY);
  rotate(angle);
  fill(0, 150, 0);
  stroke(0, 150, 0);
  quad(0, 0, 10, -6, 20, 0, 10, 6);
  pop();
}

function drawLegend() {
  let lx = 10;
  let ly = drawHeight - 50;
  let lw = 200;
  let lh = 44;

  fill(255, 255, 255, 230);
  stroke(180);
  strokeWeight(1);
  rect(lx, ly, lw, lh, 6);

  // Inheritance
  stroke(0, 0, 200);
  strokeWeight(2);
  line(lx + 10, ly + 14, lx + 40, ly + 14);
  fill(255);
  stroke(0, 0, 200);
  triangle(lx + 40, ly + 14, lx + 32, ly + 10, lx + 32, ly + 18);

  noStroke();
  fill(0);
  textAlign(LEFT, CENTER);
  textSize(11);
  text('Inheritance (is-a)', lx + 48, ly + 14);

  // Composition
  stroke(0, 150, 0);
  strokeWeight(2);
  line(lx + 10, ly + 32, lx + 40, ly + 32);
  fill(0, 150, 0);
  quad(lx + 10, ly + 32, lx + 17, ly + 28, lx + 24, ly + 32, lx + 17, ly + 36);

  noStroke();
  fill(0);
  text('Composition (has-a)', lx + 48, ly + 32);
}

function mousePressed() {
  if (mouseY >= drawHeight) return;

  if (mode === 'select') {
    // Check if clicking on a box
    for (let i = classBoxes.length - 1; i >= 0; i--) {
      let box = classBoxes[i];
      let dims = getBoxDimensions(box);
      let bx = box.x - dims.w / 2;
      let by = box.y;

      if (mouseX > bx && mouseX < bx + dims.w &&
          mouseY > by && mouseY < by + dims.h) {
        selectedBox = i;
        draggingBox = i;
        dragOffsetX = mouseX - box.x;
        dragOffsetY = mouseY - box.y;
        return;
      }
    }
    selectedBox = null;
  } else {
    // Connection mode
    for (let i = classBoxes.length - 1; i >= 0; i--) {
      let box = classBoxes[i];
      let dims = getBoxDimensions(box);
      let bx = box.x - dims.w / 2;
      let by = box.y;

      if (mouseX > bx && mouseX < bx + dims.w &&
          mouseY > by && mouseY < by + dims.h) {
        if (connectFromBox === null) {
          connectFromBox = i;
        } else if (connectFromBox !== i) {
          // Add connection
          connections.push({
            from: connectFromBox,
            to: i,
            type: mode
          });
          connectFromBox = null;
        }
        return;
      }
    }
    connectFromBox = null;
  }
}

function mouseDragged() {
  if (draggingBox !== null && mode === 'select') {
    classBoxes[draggingBox].x = mouseX - dragOffsetX;
    classBoxes[draggingBox].y = mouseY - dragOffsetY;
  }
}

function mouseReleased() {
  draggingBox = null;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
