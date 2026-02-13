// Music Library UML Class Diagram MicroSim
// Interactive UML diagram showing MediaItem, Song, and Playlist
// Click classes, arrows, and methods to see OOP concept explanations
// MicroSim template version 2026.02

let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 40;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

let mouseOverCanvas = false;
let selectedElement = null; // { type: 'class'|'arrow'|'method', data: ... }
let showAllCheckbox;
let showAll = false;

// Class positions (calculated dynamically)
let classPos = {};

// Class definitions
const CLASSES = {
  'MediaItem': {
    color: [140, 140, 140],
    fill: [230, 230, 230],
    abstract: true,
    attrs: [],
    methods: [
      { name: '+ play() [abstract]', dunder: false, concept: 'Abstract method - must be implemented by subclasses' },
      { name: '+ duration_str() [abstract]', dunder: false, concept: 'Abstract method - defines the interface contract' }
    ],
    description: 'Abstract base class for all media items. Cannot be instantiated directly. Defines the interface that all media types must implement.'
  },
  'Song': {
    color: [65, 105, 225],
    fill: [190, 210, 255],
    abstract: false,
    attrs: ['- title: str', '- artist: str', '- duration: int'],
    methods: [
      { name: '+ play()', dunder: false, concept: 'Overrides MediaItem.play() - returns "Now playing: title by artist"' },
      { name: '+ duration_str()', dunder: false, concept: 'Overrides MediaItem.duration_str() - formats seconds as mm:ss' },
      { name: '+ __eq__()', dunder: true, concept: 'Operator overloading: == compares title and artist' },
      { name: '+ __lt__()', dunder: true, concept: 'Operator overloading: < compares by title alphabetically. Enables sorting!' },
      { name: '+ __add__()', dunder: true, concept: 'Operator overloading: song1 + song2 creates a new Playlist' },
      { name: '+ __str__()', dunder: true, concept: 'String representation: returns "title - artist (duration)"' }
    ],
    description: 'Concrete class representing a song. Inherits from MediaItem (IS-A). Implements operator overloading for ==, <, +, and str().'
  },
  'Playlist': {
    color: [34, 139, 34],
    fill: [190, 240, 190],
    abstract: false,
    attrs: ['- name: str', '- songs: list'],
    methods: [
      { name: '+ add_song()', dunder: false, concept: 'Adds a Song to the playlist (uses composition)' },
      { name: '+ __iter__()', dunder: true, concept: 'Iterator protocol: makes Playlist work with for loops' },
      { name: '+ __next__()', dunder: true, concept: 'Iterator protocol: returns next song, raises StopIteration when done' },
      { name: '+ __len__()', dunder: true, concept: 'Operator overloading: len(playlist) returns number of songs' },
      { name: '+ __str__()', dunder: true, concept: 'String representation: shows playlist name and all tracks' },
      { name: '+ merge() [static]', dunder: false, concept: 'Static method: merges two playlists without needing an instance' }
    ],
    description: 'Playlist HAS-A list of Songs (composition). Implements the iterator protocol so you can use "for song in playlist:". Also uses a static method.'
  }
};

// Arrow definitions
const ARROWS = [
  {
    from: 'Song', to: 'MediaItem', type: 'inherit',
    explanation: 'Song IS-A MediaItem (inheritance). Song inherits the interface from MediaItem and must implement play() and duration_str().'
  },
  {
    from: 'Playlist', to: 'Song', type: 'compose',
    explanation: 'Playlist HAS-A list of Songs (composition). The Playlist contains Song objects but does not inherit from Song.'
  }
];

const classOrder = ['MediaItem', 'Song', 'Playlist'];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  canvas.mouseOver(() => mouseOverCanvas = true);
  canvas.mouseOut(() => mouseOverCanvas = false);

  showAllCheckbox = createCheckbox(' Highlight Dunder Methods', false);
  showAllCheckbox.position(10, drawHeight + 8);
  showAllCheckbox.changed(() => showAll = showAllCheckbox.checked());

  describe('Interactive UML class diagram of a music library showing MediaItem, Song, and Playlist classes with inheritance and composition relationships. Click elements to learn about OOP concepts.', LABEL);
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

  // Calculate positions
  let centerX = canvasWidth * 0.33;
  classPos['MediaItem'] = { x: centerX, y: 50 };
  classPos['Song'] = { x: centerX - 30, y: 220 };
  classPos['Playlist'] = { x: canvasWidth * 0.7, y: 220 };

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Music Library UML Diagram', canvasWidth / 2, 8);

  // Draw arrows first (behind boxes)
  for (let arrow of ARROWS) {
    drawArrow(arrow);
  }

  // Draw class boxes
  for (let name of classOrder) {
    drawClassBox(name);
  }

  // Draw legend
  drawLegend();

  // Draw info panel
  if (selectedElement) {
    drawInfoPanel();
  } else {
    fill(120);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(13);
    text('Click a class, arrow, or method to learn about the OOP concept', canvasWidth / 2, drawHeight - 18);
  }
}

function drawClassBox(name) {
  let cls = CLASSES[name];
  let pos = classPos[name];
  let boxW = 160;
  let headerH = 26;
  let attrH = Math.max(cls.attrs.length * 15 + 6, 20);
  let methodH = cls.methods.length * 15 + 6;
  let boxH = headerH + attrH + methodH;

  let x = pos.x - boxW / 2;
  let y = pos.y;
  let isSelected = selectedElement && selectedElement.type === 'class' && selectedElement.data === name;

  // Dashed border for abstract
  if (cls.abstract) {
    drawingContext.setLineDash([5, 3]);
  }

  // Shadow
  noStroke();
  fill(0, 0, 0, 20);
  rect(x + 2, y + 2, boxW, boxH, 4);

  // Header
  stroke(cls.color[0], cls.color[1], cls.color[2]);
  strokeWeight(isSelected ? 3 : 1.5);
  fill(cls.fill[0], cls.fill[1], cls.fill[2]);
  rect(x, y, boxW, headerH, 4, 4, 0, 0);

  // Body
  fill(255);
  rect(x, y + headerH, boxW, boxH - headerH, 0, 0, 4, 4);
  drawingContext.setLineDash([]);

  // Attr/method divider
  stroke(200);
  strokeWeight(1);
  line(x, y + headerH + attrH, x + boxW, y + headerH + attrH);

  // Class name
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(13);
  textStyle(BOLD);
  text(name, pos.x, y + headerH / 2);
  textStyle(NORMAL);

  // Attributes
  textAlign(LEFT, TOP);
  textSize(10);
  let ty = y + headerH + 3;
  if (cls.attrs.length === 0) {
    fill(180);
    text('(no attributes)', x + 5, ty);
  } else {
    fill(60);
    for (let attr of cls.attrs) {
      text(attr, x + 5, ty);
      ty += 15;
    }
  }

  // Methods
  ty = y + headerH + attrH + 3;
  for (let m of cls.methods) {
    let isHighlightedDunder = showAll && m.dunder;
    let isMethodSelected = selectedElement && selectedElement.type === 'method' &&
                           selectedElement.data.class === name && selectedElement.data.name === m.name;

    if (isHighlightedDunder) {
      // Highlight background
      noStroke();
      fill(255, 255, 150, 150);
      rect(x + 2, ty - 1, boxW - 4, 14, 2);
    }

    if (isMethodSelected) {
      noStroke();
      fill(200, 230, 255, 200);
      rect(x + 2, ty - 1, boxW - 4, 14, 2);
    }

    noStroke();
    if (m.dunder) {
      fill(140, 0, 140);
    } else {
      fill(60);
    }
    textAlign(LEFT, TOP);
    textSize(10);
    text(m.name, x + 5, ty);
    ty += 15;
  }

  // Store box dimensions for hit testing
  cls._boxX = x;
  cls._boxY = y;
  cls._boxW = boxW;
  cls._boxH = boxH;
  cls._headerH = headerH;
  cls._attrH = attrH;
}

function drawArrow(arrow) {
  let fromPos = classPos[arrow.from];
  let toPos = classPos[arrow.to];
  let fromCls = CLASSES[arrow.from];
  let toCls = CLASSES[arrow.to];

  let isSelected = selectedElement && selectedElement.type === 'arrow' && selectedElement.data === arrow;

  if (arrow.type === 'inherit') {
    // Inheritance: vertical arrow from child top to parent bottom
    let fromY = fromCls._boxY || fromPos.y;
    let toH = toCls._boxH || 80;
    let toY = (toCls._boxY || toPos.y) + toH;

    stroke(isSelected ? color(0, 0, 255) : color(0, 0, 180));
    strokeWeight(isSelected ? 3 : 2);
    line(fromPos.x, fromY, toPos.x, toY);

    // Hollow triangle
    let angle = atan2(toY - fromY, toPos.x - fromPos.x);
    push();
    translate(toPos.x, toY);
    rotate(angle);
    fill(255);
    stroke(isSelected ? color(0, 0, 255) : color(0, 0, 180));
    strokeWeight(isSelected ? 3 : 2);
    triangle(0, 0, -14, -7, -14, 7);
    pop();

    // Arrow label
    if (isSelected) {
      noStroke();
      fill(0, 0, 180);
      textAlign(CENTER, CENTER);
      textSize(11);
      textStyle(ITALIC);
      let midX = (fromPos.x + toPos.x) / 2 - 20;
      let midY = (fromY + toY) / 2;
      text('IS-A', midX, midY);
      textStyle(NORMAL);
    }
  } else {
    // Composition: horizontal arrow
    let fromW = fromCls._boxW || 160;
    let fromX = (fromCls._boxX || fromPos.x - 80);
    let fromMidY = (fromCls._boxY || fromPos.y) + (fromCls._boxH || 80) / 2;
    let toW = toCls._boxW || 160;
    let toRightX = (toCls._boxX || toPos.x - 80) + toW;
    let toMidY = (toCls._boxY || toPos.y) + (toCls._boxH || 80) / 2;

    stroke(isSelected ? color(0, 180, 0) : color(0, 130, 0));
    strokeWeight(isSelected ? 3 : 2);
    line(fromX, fromMidY, toRightX, toMidY);

    // Filled diamond at Playlist side
    let angle = atan2(toMidY - fromMidY, toRightX - fromX);
    push();
    translate(fromX, fromMidY);
    rotate(angle);
    fill(isSelected ? color(0, 180, 0) : color(0, 130, 0));
    stroke(isSelected ? color(0, 180, 0) : color(0, 130, 0));
    quad(0, 0, 10, -6, 20, 0, 10, 6);
    pop();

    // Label
    if (isSelected) {
      noStroke();
      fill(0, 130, 0);
      textAlign(CENTER, CENTER);
      textSize(11);
      textStyle(ITALIC);
      text('HAS-A', (fromX + toRightX) / 2, Math.min(fromMidY, toMidY) - 12);
      textStyle(NORMAL);
    }

    // Multiplicity labels
    noStroke();
    fill(80);
    textSize(10);
    textAlign(LEFT, CENTER);
    text('1', fromX + 22, fromMidY - 10);
    textAlign(RIGHT, CENTER);
    text('*', toRightX - 5, toMidY - 10);
  }
}

function drawLegend() {
  let lx = canvasWidth - 195;
  let ly = 32;
  let lw = 185;
  let lh = 72;

  fill(255, 255, 255, 235);
  stroke(180);
  strokeWeight(1);
  rect(lx, ly, lw, lh, 6);

  noStroke();
  textSize(10);
  textStyle(BOLD);
  fill(0);
  textAlign(LEFT, CENTER);
  text('Legend:', lx + 8, ly + 12);
  textStyle(NORMAL);

  // Inheritance
  stroke(0, 0, 180);
  strokeWeight(2);
  line(lx + 8, ly + 30, lx + 35, ly + 30);
  fill(255);
  stroke(0, 0, 180);
  triangle(lx + 35, ly + 30, lx + 28, ly + 27, lx + 28, ly + 33);
  noStroke();
  fill(0);
  textSize(10);
  text('Inheritance (is-a)', lx + 42, ly + 30);

  // Composition
  stroke(0, 130, 0);
  strokeWeight(2);
  line(lx + 8, ly + 48, lx + 35, ly + 48);
  fill(0, 130, 0);
  quad(lx + 8, ly + 48, lx + 14, ly + 44, lx + 20, ly + 48, lx + 14, ly + 52);
  noStroke();
  fill(0);
  text('Composition (has-a)', lx + 42, ly + 48);

  // Dunder
  fill(140, 0, 140);
  textSize(10);
  text('Purple = dunder method', lx + 8, ly + 64);
}

function drawInfoPanel() {
  let panelX = 10;
  let panelY = drawHeight - 55;
  let panelW = canvasWidth - 20;
  let panelH = 48;

  fill(255, 255, 255, 245);
  stroke(100);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 8);

  noStroke();
  textAlign(LEFT, TOP);

  if (selectedElement.type === 'class') {
    let cls = CLASSES[selectedElement.data];
    fill(cls.color[0], cls.color[1], cls.color[2]);
    textSize(13);
    textStyle(BOLD);
    text(selectedElement.data, panelX + 10, panelY + 6);
    textStyle(NORMAL);
    fill(60);
    textSize(11);
    drawWrappedText(cls.description, panelX + 10, panelY + 24, panelW - 20);
  } else if (selectedElement.type === 'arrow') {
    let arrow = selectedElement.data;
    fill(arrow.type === 'inherit' ? color(0, 0, 180) : color(0, 130, 0));
    textSize(13);
    textStyle(BOLD);
    text(arrow.from + (arrow.type === 'inherit' ? ' IS-A ' : ' HAS-A ') + arrow.to, panelX + 10, panelY + 6);
    textStyle(NORMAL);
    fill(60);
    textSize(11);
    drawWrappedText(arrow.explanation, panelX + 10, panelY + 24, panelW - 20);
  } else if (selectedElement.type === 'method') {
    let m = selectedElement.data;
    fill(m.dunder ? color(140, 0, 140) : color(60));
    textSize(13);
    textStyle(BOLD);
    text(m.class + '.' + m.name, panelX + 10, panelY + 6);
    textStyle(NORMAL);
    fill(60);
    textSize(11);
    drawWrappedText(m.concept, panelX + 10, panelY + 24, panelW - 20);
  }
}

function drawWrappedText(txt, x, y, maxW) {
  let words = txt.split(' ');
  let line = '';
  for (let w of words) {
    let test = line + (line ? ' ' : '') + w;
    if (textWidth(test) > maxW && line) {
      text(line, x, y);
      line = w;
      y += 14;
    } else {
      line = test;
    }
  }
  if (line) text(line, x, y);
}

function mousePressed() {
  if (mouseY >= drawHeight) return;

  // Check class box clicks
  for (let name of classOrder) {
    let cls = CLASSES[name];
    if (!cls._boxX) continue;

    if (mouseX > cls._boxX && mouseX < cls._boxX + cls._boxW &&
        mouseY > cls._boxY && mouseY < cls._boxY + cls._boxH) {

      // Check if clicking on a specific method
      let methodStartY = cls._boxY + cls._headerH + cls._attrH + 3;
      for (let m of cls.methods) {
        if (mouseY > methodStartY - 1 && mouseY < methodStartY + 14) {
          selectedElement = { type: 'method', data: { ...m, class: name } };
          return;
        }
        methodStartY += 15;
      }

      // Clicked on class header/attrs
      selectedElement = { type: 'class', data: name };
      return;
    }
  }

  // Check arrow clicks (proximity-based)
  for (let arrow of ARROWS) {
    let fromPos = classPos[arrow.from];
    let toPos = classPos[arrow.to];
    let fromCls = CLASSES[arrow.from];
    let toCls = CLASSES[arrow.to];

    if (arrow.type === 'inherit') {
      let fromY = fromCls._boxY || fromPos.y;
      let toY = (toCls._boxY || toPos.y) + (toCls._boxH || 80);
      if (distToSegment(mouseX, mouseY, fromPos.x, fromY, toPos.x, toY) < 12) {
        selectedElement = { type: 'arrow', data: arrow };
        return;
      }
    } else {
      let fromX = fromCls._boxX || fromPos.x;
      let fromMidY = (fromCls._boxY || fromPos.y) + (fromCls._boxH || 80) / 2;
      let toRightX = (toCls._boxX || toPos.x) + (toCls._boxW || 160);
      let toMidY = (toCls._boxY || toPos.y) + (toCls._boxH || 80) / 2;
      if (distToSegment(mouseX, mouseY, fromX, fromMidY, toRightX, toMidY) < 12) {
        selectedElement = { type: 'arrow', data: arrow };
        return;
      }
    }
  }

  selectedElement = null;
}

function distToSegment(px, py, x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return dist(px, py, x1, y1);
  let t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
  let projX = x1 + t * dx;
  let projY = y1 + t * dy;
  return dist(px, py, projX, projY);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
