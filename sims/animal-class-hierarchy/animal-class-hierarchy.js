// Animal Class Hierarchy Interactive Diagram
// Shows inheritance relationships between Animal, Dog, Cat, and Puppy
// Click class nodes to see inherited vs locally defined attributes/methods
// MicroSim template version 2026.02

let canvasWidth = 400;
let drawHeight = 430;
let controlHeight = 40;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Class node data
let classes = [];
let selectedClass = null;
let showAllCheckbox;
let showAll = false;
let mouseOverCanvas = false;
let pulsePhase = 0;

// Colors for each class
const CLASS_COLORS = {
  'Animal': [218, 165, 32],   // gold
  'Dog':    [65, 105, 225],   // royal blue
  'Cat':    [34, 139, 34],    // forest green
  'Puppy':  [138, 43, 226]    // purple
};

// Lighter versions for fills
const CLASS_FILLS = {
  'Animal': [255, 223, 120],
  'Dog':    [173, 198, 255],
  'Cat':    [144, 238, 144],
  'Puppy':  [216, 180, 254]
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  canvas.mouseOver(() => mouseOverCanvas = true);
  canvas.mouseOut(() => mouseOverCanvas = false);

  // Define class hierarchy data
  classes = [
    {
      name: 'Animal',
      x: 0, y: 0, // calculated dynamically
      parent: null,
      attributes: [
        { name: 'name', type: 'str', origin: 'own' },
        { name: 'sound', type: 'str', origin: 'own' }
      ],
      methods: [
        { name: '__init__(self, name, sound)', origin: 'own' },
        { name: 'speak(self)', origin: 'own' },
        { name: '__str__(self)', origin: 'own' }
      ]
    },
    {
      name: 'Dog',
      x: 0, y: 0,
      parent: 'Animal',
      attributes: [
        { name: 'name', type: 'str', origin: 'inherited' },
        { name: 'sound', type: 'str', origin: 'inherited' }
      ],
      methods: [
        { name: '__init__(self, name)', origin: 'overridden' },
        { name: 'speak(self)', origin: 'inherited' },
        { name: '__str__(self)', origin: 'inherited' },
        { name: 'fetch(self)', origin: 'own' }
      ]
    },
    {
      name: 'Cat',
      x: 0, y: 0,
      parent: 'Animal',
      attributes: [
        { name: 'name', type: 'str', origin: 'inherited' },
        { name: 'sound', type: 'str', origin: 'inherited' }
      ],
      methods: [
        { name: '__init__(self, name)', origin: 'overridden' },
        { name: 'speak(self)', origin: 'inherited' },
        { name: '__str__(self)', origin: 'inherited' },
        { name: 'purr(self)', origin: 'own' }
      ]
    },
    {
      name: 'Puppy',
      x: 0, y: 0,
      parent: 'Dog',
      attributes: [
        { name: 'name', type: 'str', origin: 'inherited' },
        { name: 'sound', type: 'str', origin: 'inherited' },
        { name: 'favorite_toy', type: 'str', origin: 'own' }
      ],
      methods: [
        { name: '__init__(self, name, toy)', origin: 'overridden' },
        { name: 'speak(self)', origin: 'inherited' },
        { name: '__str__(self)', origin: 'inherited' },
        { name: 'fetch(self)', origin: 'inherited' }
      ]
    }
  ];

  // Create Show All checkbox
  showAllCheckbox = createCheckbox(' Show All Details', false);
  showAllCheckbox.position(10, drawHeight + 8);
  showAllCheckbox.changed(() => {
    showAll = showAllCheckbox.checked();
    if (showAll) selectedClass = null;
  });

  describe('Interactive animal class hierarchy diagram showing inheritance relationships. Click class nodes to see attributes and methods.', LABEL);
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

  // Update pulse for hover effect
  if (mouseOverCanvas) {
    pulsePhase += 0.05;
  }

  // Calculate node positions dynamically based on canvas width
  let centerX = canvasWidth * 0.35;
  let treeTopY = 55;
  let levelSpacing = 100;
  let siblingSpacing = canvasWidth * 0.22;

  classes[0].x = centerX;                          // Animal
  classes[0].y = treeTopY;
  classes[1].x = centerX - siblingSpacing * 0.5;   // Dog
  classes[1].y = treeTopY + levelSpacing;
  classes[2].x = centerX + siblingSpacing * 0.5;   // Cat
  classes[2].y = treeTopY + levelSpacing;
  classes[3].x = classes[1].x;                     // Puppy
  classes[3].y = treeTopY + levelSpacing * 2;

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('Animal Class Hierarchy', canvasWidth * 0.35, 10);

  // Draw legend
  drawLegend();

  // Draw inheritance arrows (child to parent)
  drawArrows();

  // Draw class nodes
  for (let cls of classes) {
    drawClassNode(cls);
  }

  // Draw detail panel for selected or all
  if (showAll) {
    drawAllDetails();
  } else if (selectedClass) {
    drawDetailPanel(selectedClass);
  } else {
    // Draw instruction text
    fill(120);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(14);
    text('Click a class node to see its details', canvasWidth * 0.35, drawHeight - 25);
  }
}

function drawLegend() {
  let legendX = canvasWidth - 155;
  let legendY = 10;
  let boxW = 145;
  let boxH = 78;

  fill(255, 255, 255, 230);
  stroke(200);
  strokeWeight(1);
  rect(legendX, legendY, boxW, boxH, 8);

  noStroke();
  textSize(12);
  textAlign(LEFT, CENTER);

  // Own
  fill(34, 139, 34);
  rect(legendX + 10, legendY + 14, 12, 12, 2);
  fill(0);
  text('Locally defined', legendX + 28, legendY + 20);

  // Inherited
  fill(65, 105, 225);
  rect(legendX + 10, legendY + 34, 12, 12, 2);
  fill(0);
  text('Inherited', legendX + 28, legendY + 40);

  // Overridden
  fill(230, 130, 0);
  rect(legendX + 10, legendY + 54, 12, 12, 2);
  fill(0);
  text('Overridden', legendX + 28, legendY + 60);
}

function drawArrows() {
  stroke(100);
  strokeWeight(2);

  for (let cls of classes) {
    if (cls.parent) {
      let parentCls = classes.find(c => c.name === cls.parent);
      if (parentCls) {
        let nodeH = 40;
        let startY = cls.y - nodeH / 2;
        let endY = parentCls.y + nodeH / 2;

        line(cls.x, startY, parentCls.x, endY);

        // Draw hollow triangle arrowhead at parent end
        let angle = atan2(endY - startY, parentCls.x - cls.x);
        let arrowSize = 12;
        push();
        translate(parentCls.x, endY);
        rotate(angle);
        fill('white');
        stroke(100);
        strokeWeight(2);
        triangle(0, 0, -arrowSize, -arrowSize / 2, -arrowSize, arrowSize / 2);
        pop();
      }
    }
  }
}

function drawClassNode(cls) {
  let nodeW = 100;
  let nodeH = 40;
  let x = cls.x;
  let y = cls.y;

  // Check hover
  let isHovered = mouseX > x - nodeW / 2 && mouseX < x + nodeW / 2 &&
                  mouseY > y - nodeH / 2 && mouseY < y + nodeH / 2;
  let isSelected = selectedClass && selectedClass.name === cls.name;

  // Node background
  let col = CLASS_FILLS[cls.name];
  let borderCol = CLASS_COLORS[cls.name];

  if (isHovered) {
    let pulse = sin(pulsePhase) * 15;
    fill(col[0] + pulse, col[1] + pulse, col[2] + pulse);
    stroke(borderCol[0], borderCol[1], borderCol[2]);
    strokeWeight(3);
    cursor(HAND);
  } else if (isSelected) {
    fill(col[0], col[1], col[2]);
    stroke(borderCol[0], borderCol[1], borderCol[2]);
    strokeWeight(3);
  } else {
    fill(col[0], col[1], col[2]);
    stroke(borderCol[0], borderCol[1], borderCol[2]);
    strokeWeight(2);
  }

  rect(x - nodeW / 2, y - nodeH / 2, nodeW, nodeH, 8);

  // Class name
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(18);
  textStyle(BOLD);
  text(cls.name, x, y);
  textStyle(NORMAL);
}

function drawDetailPanel(cls) {
  let panelX = canvasWidth * 0.6;
  let panelY = 95;
  let panelW = canvasWidth * 0.38;
  let panelH = 300;

  // Panel background
  fill(255, 255, 255, 240);
  stroke(CLASS_COLORS[cls.name][0], CLASS_COLORS[cls.name][1], CLASS_COLORS[cls.name][2]);
  strokeWeight(2);
  rect(panelX, panelY, panelW, panelH, 10);

  // Panel title
  noStroke();
  fill(CLASS_COLORS[cls.name][0], CLASS_COLORS[cls.name][1], CLASS_COLORS[cls.name][2]);
  textAlign(CENTER, TOP);
  textSize(18);
  textStyle(BOLD);
  text(cls.name, panelX + panelW / 2, panelY + 10);

  // Separator line
  stroke(200);
  strokeWeight(1);
  line(panelX + 10, panelY + 35, panelX + panelW - 10, panelY + 35);

  // Attributes section
  noStroke();
  fill(80);
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  text('Attributes:', panelX + 10, panelY + 42);
  textStyle(NORMAL);

  let yOff = panelY + 60;
  textSize(13);
  for (let attr of cls.attributes) {
    fill(getOriginColor(attr.origin));
    let marker = getOriginMarker(attr.origin);
    text(marker + attr.name + ': ' + attr.type, panelX + 15, yOff);
    yOff += 18;
  }

  // Methods section
  yOff += 8;
  fill(80);
  textSize(14);
  textStyle(BOLD);
  text('Methods:', panelX + 10, yOff);
  textStyle(NORMAL);
  yOff += 20;

  textSize(13);
  for (let meth of cls.methods) {
    fill(getOriginColor(meth.origin));
    let marker = getOriginMarker(meth.origin);
    text(marker + meth.name, panelX + 15, yOff);
    yOff += 18;
  }
}

function drawAllDetails() {
  // Draw compact details below each node
  textSize(11);
  for (let cls of classes) {
    let x = cls.x - 55;
    let y = cls.y + 25;
    let lineH = 14;

    // Attributes
    noStroke();
    for (let attr of cls.attributes) {
      fill(getOriginColor(attr.origin));
      textAlign(LEFT, TOP);
      text(getOriginMarker(attr.origin) + attr.name, x, y);
      y += lineH;
    }
    // Methods
    for (let meth of cls.methods) {
      fill(getOriginColor(meth.origin));
      textAlign(LEFT, TOP);
      // Shorten method display for compact view
      let shortName = meth.name.split('(')[0] + '()';
      text(getOriginMarker(meth.origin) + shortName, x, y);
      y += lineH;
    }
  }
}

function getOriginColor(origin) {
  if (origin === 'own') return color(34, 139, 34);       // green
  if (origin === 'inherited') return color(65, 105, 225); // blue
  if (origin === 'overridden') return color(230, 130, 0); // orange
  return color(0);
}

function getOriginMarker(origin) {
  if (origin === 'own') return '+ ';
  if (origin === 'inherited') return '\u2191 ';  // up arrow
  if (origin === 'overridden') return '\u21BB ';  // clockwise arrow
  return '';
}

function mousePressed() {
  if (showAll) return;

  for (let cls of classes) {
    let nodeW = 100;
    let nodeH = 40;
    if (mouseX > cls.x - nodeW / 2 && mouseX < cls.x + nodeW / 2 &&
        mouseY > cls.y - nodeH / 2 && mouseY < cls.y + nodeH / 2) {
      if (selectedClass && selectedClass.name === cls.name) {
        selectedClass = null; // deselect
      } else {
        selectedClass = cls;
      }
      return;
    }
  }
  // Click outside nodes deselects
  if (mouseY < drawHeight) {
    selectedClass = null;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
