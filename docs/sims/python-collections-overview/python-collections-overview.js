// Python Collections Overview MicroSim
// CANVAS_HEIGHT: 520
// A 2x2 matrix of Python's four core collection types, organized by
// ordered vs unordered (columns) and mutable vs immutable (rows).
// Hover a card to compare properties, click it for code examples, or press
// "Quiz Me" to classify a property set or a scenario by clicking a card.
// Bloom level: Analyze (compare, classify).

let canvasWidth = 400;
let drawHeight = 470;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

// layout of the matrix inside the drawing region
const gridTop = 66;
const cellHeight = 128;
const cellGap = 10;
const axisGutter = 40;        // room on the left for the Mutable / Immutable labels
const panelTop = gridTop + 2 * cellHeight + cellGap + 10;

// colors
const GOOD_GREEN = '#15803d';
const BAD_RED = '#b91c1c';
const INK = '#1f2937';
const MUTED = '#4b5563';

// The four collection types. Position in the matrix follows from the
// ordered and mutable flags, so the data and the picture cannot disagree.
const TYPES = [
  {
    key: 'list', name: 'List', syntax: '[1, 2, 3]',
    ordered: true, mutable: true,
    duplicates: true, indexable: true, dictKey: false,
    fill: '#dcfce7', edge: '#16a34a', dark: '#166534',
    bestFor: 'Data that stays in order and keeps changing, like a playlist or a to-do list.',
    code: [
      'scores = [90, 85, 90]',
      'scores.append(77)     # it can grow',
      'scores[0] = 95        # change an item',
      'scores[1]             # 85 (indexable)'
    ],
    useWhen: 'Use a list when order matters and the data will change.'
  },
  {
    key: 'set', name: 'Set', syntax: '{1, 2, 3}',
    ordered: false, mutable: true,
    duplicates: false, indexable: false, dictKey: false,
    fill: '#dbeafe', edge: '#2563eb', dark: '#1e40af',
    bestFor: 'Unique items you add and remove, like the visitors seen so far today.',
    code: [
      'tags = {"py", "cs", "py"}  # {"py", "cs"}',
      'tags.add("ai")             # it can grow',
      '"cs" in tags               # True, and fast',
      'tags[0]                    # TypeError!'
    ],
    useWhen: 'Use a set when you only care whether something is in the group, and the group changes.'
  },
  {
    key: 'tuple', name: 'Tuple', syntax: '(1, 2, 3)',
    ordered: true, mutable: false,
    duplicates: true, indexable: true, dictKey: true,
    fill: '#fef3c7', edge: '#d97706', dark: '#92400e',
    bestFor: 'A fixed record that should never change, like a coordinate or an RGB color.',
    code: [
      'point = (3, 7)',
      'x, y = point             # unpack it',
      'point[0]                 # 3 (indexable)',
      'point[0] = 5             # TypeError!',
      'grid = {(0, 0): "start"} # dict key: OK'
    ],
    useWhen: 'Use a tuple when the values belong together in a fixed order and must not change.'
  },
  {
    key: 'frozenset', name: 'Frozenset', syntax: 'frozenset({1, 2, 3})',
    ordered: false, mutable: false,
    duplicates: false, indexable: false, dictKey: true,
    fill: '#ede9fe', edge: '#7c3aed', dark: '#5b21b6',
    bestFor: 'A locked group of unique items, like a fixed set of vowels used as a dictionary key.',
    code: [
      'vowels = frozenset("aeiou")',
      '"e" in vowels              # True',
      'vowels.add("y")            # AttributeError!',
      'kinds = {vowels: "vowel"}  # dict key: OK'
    ],
    useWhen: 'Use a frozenset when you need a set that can never change, or a set as a dictionary key.'
  }
];

// Quiz questions: property combinations first, then real scenarios.
const QUESTIONS = [
  { prompt: 'Which type is ordered and mutable?', answer: 'list',
    why: 'A list keeps its order and lets you change it.',
    hint: 'Find the column for ordered and the row for mutable.' },
  { prompt: 'Which type is ordered and immutable?', answer: 'tuple',
    why: 'A tuple keeps its order but is locked once created.',
    hint: 'Find the column for ordered and the row for immutable.' },
  { prompt: 'Which type is unordered and mutable?', answer: 'set',
    why: 'A set has no positions, but you can add and remove items.',
    hint: 'Find the column for unordered and the row for mutable.' },
  { prompt: 'Which type is unordered and immutable?', answer: 'frozenset',
    why: 'A frozenset is a set that is locked once created.',
    hint: 'Find the column for unordered and the row for immutable.' },
  { prompt: 'Which type allows duplicates AND can be a dictionary key?', answer: 'tuple',
    why: 'Tuples allow repeats, and because they never change they can be dictionary keys.',
    hint: 'Dictionary keys must be immutable. Which immutable type allows repeats?' },
  { prompt: 'Which type rejects duplicates AND can be a dictionary key?', answer: 'frozenset',
    why: 'A frozenset holds unique items and never changes, so it works as a key.',
    hint: 'Dictionary keys must be immutable. Which immutable type keeps only unique items?' },
  { prompt: 'You are building a playlist that users reorder and add songs to. Which type?', answer: 'list',
    why: 'Order matters and the data changes, so a list fits.',
    hint: 'The song order matters, and the playlist keeps changing.' },
  { prompt: 'You want to store a GPS point (lat, lon) that must never change. Which type?', answer: 'tuple',
    why: 'Two values in a fixed order that should stay put: a tuple.',
    hint: 'The two values have a fixed order, and nothing should change them.' },
  { prompt: 'You are tracking which unique visitors have logged in today. Which type?', answer: 'set',
    why: 'You need unique items and you keep adding more, so a set fits.',
    hint: 'Each visitor counts once, and new visitors keep arriving.' },
  { prompt: 'You need the line scores[0] = 95 to work. Which type?', answer: 'list',
    why: 'Only a list supports both indexing and changing an item in place.',
    hint: 'You need a position (index) and you need to change the value there.' },
  { prompt: 'You need a fixed group of admin names to use as a dictionary key. Which type?', answer: 'frozenset',
    why: 'A group of unique names that never changes and can be a key: a frozenset.',
    hint: 'It is a group of unique names, and a dictionary key has to be immutable.' },
  { prompt: 'You want to remove repeats from a list of words and keep adding new words. Which type?', answer: 'set',
    why: 'A set drops duplicates automatically and still lets you add items.',
    hint: 'Repeats should disappear on their own, and the collection still changes.' }
];

// controls
let quizButton;
let exploreButton;

// state
let mode = 'explore';         // 'explore' or 'quiz'
let expandedKey = null;       // card opened for code examples (explore mode)
let cellBoxes = [];           // hit boxes, rebuilt each frame

let quizOrder = [];
let quizPosition = 0;
let quizSolved = false;
let quizWrong = [];           // keys guessed wrong on the current question
let quizFeedback = '';
let quizFirstTryCorrect = 0;
let quizAnswered = 0;
let quizFinished = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  quizButton = createButton('Quiz Me');
  quizButton.parent(document.querySelector('main'));
  quizButton.position(10, drawHeight + 12);
  quizButton.mousePressed(handleQuizButton);

  exploreButton = createButton('Back to Explore');
  exploreButton.parent(document.querySelector('main'));
  exploreButton.position(135, drawHeight + 12);
  exploreButton.mousePressed(backToExplore);
  exploreButton.hide();

  describe('A two by two matrix of Python collection types. Columns are ordered ' +
    'and unordered, rows are mutable and immutable. List is ordered and mutable, ' +
    'set is unordered and mutable, tuple is ordered and immutable, and frozenset ' +
    'is unordered and immutable. A panel below shows the properties of the type ' +
    'under the pointer, and a quiz asks which type fits a property or scenario.', LABEL);
}

// ---------- quiz ----------

function handleQuizButton() {
  if (mode === 'explore' || quizFinished) {
    startQuiz();
  } else {
    nextQuestion();
  }
}

function startQuiz() {
  mode = 'quiz';
  expandedKey = null;
  quizOrder = shuffle(QUESTIONS.map((q, i) => i));
  quizPosition = 0;
  quizFirstTryCorrect = 0;
  quizAnswered = 0;
  quizFinished = false;
  beginQuestion();
  quizButton.html('Next Question');
  exploreButton.show();
}

function beginQuestion() {
  quizSolved = false;
  quizWrong = [];
  quizFeedback = 'Click the card that fits.';
}

function nextQuestion() {
  if (!quizSolved) quizAnswered += 1;   // skipping counts as not correct
  if (quizPosition >= quizOrder.length - 1) {
    quizFinished = true;
    quizButton.html('Restart Quiz');
    return;
  }
  quizPosition += 1;
  beginQuestion();
}

function backToExplore() {
  mode = 'explore';
  quizFinished = false;
  quizButton.html('Quiz Me');
  exploreButton.hide();
}

function answerQuiz(type) {
  if (quizSolved || quizFinished || quizWrong.includes(type.key)) return;
  const question = QUESTIONS[quizOrder[quizPosition]];
  if (type.key === question.answer) {
    quizSolved = true;
    quizAnswered += 1;
    if (quizWrong.length === 0) quizFirstTryCorrect += 1;
    quizFeedback = 'Correct! ' + question.why;
  } else {
    quizWrong.push(type.key);
    quizFeedback = 'Not quite. ' + question.hint;
  }
}

// ---------- pointer ----------

function cellUnderPointer() {
  return cellBoxes.findIndex(b => mouseX >= b.x && mouseX <= b.x + b.w &&
    mouseY >= b.y && mouseY <= b.y + b.h);
}

function mousePressed() {
  if (mouseY > drawHeight || mouseY < 0 || mouseX < 0 || mouseX > canvasWidth) return;
  if (mode === 'explore') {
    if (expandedKey) {
      expandedKey = null;                 // any click closes the open card
    } else {
      const hit = cellUnderPointer();
      if (hit >= 0) expandedKey = TYPES[hit].key;
    }
  } else {
    const hit = cellUnderPointer();
    if (hit >= 0) answerQuiz(TYPES[hit]);
  }
}

// ---------- text helpers ----------

function fitSize(str, maxWidth, startSize, minSize) {
  let size = startSize;
  textSize(size);
  while (textWidth(str) > maxWidth && size > minSize) {
    size -= 1;
    textSize(size);
  }
  return size;
}

function wrapLines(str, maxWidth) {
  const words = str.split(' ');
  const lines = [];
  let current = '';
  words.forEach(word => {
    const candidate = current ? current + ' ' + word : word;
    if (textWidth(candidate) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  });
  if (current) lines.push(current);
  return lines;
}

// Draw str wrapped to width w, shrinking the font until it fits in maxLines.
function drawWrapped(str, x, y, w, maxLines, startSize) {
  let size = startSize;
  textSize(size);
  let lines = wrapLines(str, w);
  while (lines.length > maxLines && size > 11) {
    size -= 1;
    textSize(size);
    lines = wrapLines(str, w);
  }
  const leading = size + 4;
  textAlign(LEFT, TOP);
  lines.forEach((part, i) => text(part, x, y + i * leading));
  return lines.length * leading;
}

// ---------- icons ----------

function drawLock(cx, cy, size, lockColor) {
  noFill();
  stroke(lockColor);
  strokeWeight(size * 0.14);
  arc(cx, cy - size * 0.12, size * 0.5, size * 0.62, PI, TWO_PI);
  noStroke();
  fill(lockColor);
  rect(cx - size * 0.4, cy - size * 0.12, size * 0.8, size * 0.58, size * 0.12);
  fill('white');
  circle(cx, cy + size * 0.16, size * 0.17);
  strokeWeight(1);
}

// Ordered types: a row of boxes, each with a position badge (0, 1, 2, 3).
// The repeated 7 shows that duplicates are allowed.
function drawNumberedBoxes(type, x, y, boxSize) {
  const values = [3, 7, 7, 9];
  values.forEach((value, i) => {
    const bx = x + i * (boxSize + 6);
    stroke(type.edge);
    strokeWeight(2);
    fill('white');
    rect(bx, y, boxSize, boxSize, 5);
    noStroke();
    fill(INK);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(boxSize * 0.5);
    text(value, bx + boxSize / 2, y + boxSize / 2 + 1);
    // position badge
    fill(type.dark);
    circle(bx + 2, y + 2, 17);
    fill('white');
    textSize(11);
    text(i, bx + 2, y + 3);
    textStyle(NORMAL);
  });
  strokeWeight(1);
  return values.length * (boxSize + 6) - 6;
}

// Unordered types: a loose handful of unique marbles, no positions.
function drawMarbles(type, x, y, marble) {
  const values = [7, 3, 9, 5];
  const offsets = [[0, 0.25], [1.05, -0.05], [2.0, 0.3], [3.0, 0.02]];
  const shades = ['#93c5fd', '#fca5a5', '#86efac', '#fde68a'];
  values.forEach((value, i) => {
    const mx = x + marble / 2 + offsets[i][0] * (marble + 4);
    const my = y + marble / 2 + offsets[i][1] * marble * 0.45;
    stroke(type.edge);
    strokeWeight(2);
    fill(shades[i]);
    circle(mx, my, marble);
    noStroke();
    fill(INK);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(marble * 0.5);
    text(value, mx, my + 1);
    textStyle(NORMAL);
  });
  strokeWeight(1);
  return 3.0 * (marble + 4) + marble;
}

// A small chip under the picture: duplicates allowed, or not.
function drawDuplicateChip(type, x, y) {
  const label = type.duplicates ? 'duplicates OK' : 'no duplicates';
  textSize(13);
  textStyle(NORMAL);
  const chipW = textWidth(label) + 34;
  stroke(type.edge);
  strokeWeight(1);
  fill('white');
  rect(x, y, chipW, 22, 11);
  if (type.duplicates) {
    // two matching marbles
    noStroke();
    fill(type.edge);
    circle(x + 11, y + 11, 9);
    circle(x + 20, y + 11, 9);
  } else {
    // prohibition sign
    noFill();
    stroke(BAD_RED);
    strokeWeight(2);
    circle(x + 15, y + 11, 14);
    line(x + 10, y + 16, x + 20, y + 6);
    strokeWeight(1);
  }
  noStroke();
  fill(INK);
  textAlign(LEFT, CENTER);
  text(label, x + 28, y + 12);
}

// ---------- drawing ----------

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // title
  noStroke();
  fill('black');
  textStyle(NORMAL);
  textAlign(CENTER, TOP);
  textSize(fitSize('Python Collections Overview', canvasWidth - 20, 24, 14));
  text('Python Collections Overview', canvasWidth / 2, 8);

  // matrix geometry
  const gridLeft = axisGutter;
  const gridRight = canvasWidth - margin;
  const cellWidth = (gridRight - gridLeft - cellGap) / 2;
  cellBoxes = TYPES.map(type => ({
    x: gridLeft + (type.ordered ? 0 : cellWidth + cellGap),
    y: gridTop + (type.mutable ? 0 : cellHeight + cellGap),
    w: cellWidth,
    h: cellHeight
  }));

  drawAxes(gridLeft, cellWidth);

  const hovered = expandedKey ? -1 : cellUnderPointer();
  TYPES.forEach((type, i) => drawCell(type, cellBoxes[i], i === hovered));

  if (mode === 'explore' && expandedKey) {
    drawExpanded(TYPES.find(t => t.key === expandedKey), gridLeft, gridTop,
      gridRight - gridLeft, 2 * cellHeight + cellGap);
  }

  drawPanel(hovered);
  drawControlText();

  cursor(hovered >= 0 || (expandedKey && mouseY < drawHeight) ? HAND : ARROW);
}

function drawAxes(gridLeft, cellWidth) {
  // column headings: Ordered <---> Unordered
  const headingY = 52;
  const leftCenter = gridLeft + cellWidth / 2;
  const rightCenter = gridLeft + cellWidth + cellGap + cellWidth / 2;
  noStroke();
  fill(INK);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  textSize(16);
  text('Ordered', leftCenter, headingY);
  text('Unordered', rightCenter, headingY);
  const leftEnd = leftCenter + textWidth('Ordered') / 2 + 10;
  const rightEnd = rightCenter - textWidth('Unordered') / 2 - 10;
  drawDoubleArrow(leftEnd, headingY, rightEnd, headingY);

  // row headings: Mutable <---> Immutable (rotated)
  const topCenter = gridTop + cellHeight / 2;
  const bottomCenter = gridTop + cellHeight + cellGap + cellHeight / 2;
  noStroke();
  fill(INK);
  push();
  translate(20, topCenter);
  rotate(-HALF_PI);
  text('Mutable', 0, 0);
  pop();
  push();
  translate(20, bottomCenter);
  rotate(-HALF_PI);
  text('Immutable', 0, 0);
  pop();
  const upperEnd = topCenter + textWidth('Mutable') / 2 + 8;
  const lowerEnd = bottomCenter - textWidth('Immutable') / 2 - 8;
  drawDoubleArrow(20, upperEnd, 20, lowerEnd);
  textStyle(NORMAL);
}

function drawDoubleArrow(x1, y1, x2, y2) {
  if (dist(x1, y1, x2, y2) < 16) return;
  stroke(MUTED);
  strokeWeight(2);
  line(x1, y1, x2, y2);
  const angle = atan2(y2 - y1, x2 - x1);
  [[x1, y1, angle + PI], [x2, y2, angle]].forEach(([x, y, a]) => {
    line(x, y, x - 7 * cos(a - 0.5), y - 7 * sin(a - 0.5));
    line(x, y, x - 7 * cos(a + 0.5), y - 7 * sin(a + 0.5));
  });
  strokeWeight(1);
}

function drawCell(type, box, isHovered) {
  // quiz states
  const solvedHere = mode === 'quiz' && quizSolved && !quizFinished &&
    QUESTIONS[quizOrder[quizPosition]].answer === type.key;
  const wrongHere = mode === 'quiz' && !quizFinished && quizWrong.includes(type.key);

  stroke(solvedHere ? GOOD_GREEN : wrongHere ? BAD_RED : type.edge);
  strokeWeight(solvedHere || wrongHere ? 5 : isHovered ? 4 : 2);
  fill(type.fill);
  rect(box.x, box.y, box.w, box.h, 12);
  strokeWeight(1);

  const padX = box.x + 12;
  const roomW = box.w - 24;

  // name
  noStroke();
  fill(type.dark);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  textSize(fitSize(type.name, roomW - 30, 22, 14));
  text(type.name, padX, box.y + 9);
  const nameW = textWidth(type.name);
  textStyle(NORMAL);

  // syntax, in a monospace font because it is code
  push();
  textFont('monospace');
  fill(INK);
  const syntaxRoom = roomW - nameW - 12 - (type.mutable ? 0 : 30);
  textSize(15);
  if (textWidth(type.syntax) <= syntaxRoom) {
    textAlign(LEFT, TOP);
    text(type.syntax, padX + nameW + 12, box.y + 14);
  }
  pop();

  // lock on the immutable types
  if (!type.mutable) {
    drawLock(box.x + box.w - 22, box.y + 22, 24, type.dark);
  }

  // picture: numbered boxes for ordered types, marbles for unordered types
  const pictureY = box.y + 46;
  const unit = Math.min(36, (roomW - 18) / 4);
  if (type.ordered) {
    drawNumberedBoxes(type, padX + 4, pictureY, unit);
  } else {
    drawMarbles(type, padX, pictureY, Math.min(34, (roomW - 12) / 4));
  }

  drawDuplicateChip(type, padX, box.y + box.h - 30);

  // quiz mark
  if (solvedHere || wrongHere) {
    noStroke();
    fill(solvedHere ? GOOD_GREEN : BAD_RED);
    textStyle(BOLD);
    textAlign(RIGHT, BOTTOM);
    textSize(15);
    text(solvedHere ? 'Correct' : 'Not this one', box.x + box.w - 12, box.y + box.h - 10);
    textStyle(NORMAL);
  }
}

// The open card: code examples for one type, drawn over the whole matrix.
function drawExpanded(type, x, y, w, h) {
  stroke(type.edge);
  strokeWeight(3);
  fill(type.fill);
  rect(x, y, w, h, 12);
  strokeWeight(1);

  const padX = x + 14;
  const roomW = w - 28;

  noStroke();
  fill(type.dark);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  textSize(22);
  text(type.name, padX, y + 10);
  const nameW = textWidth(type.name);
  textStyle(NORMAL);
  fill(MUTED);
  textSize(15);
  const traits = (type.ordered ? 'ordered' : 'unordered') + ', ' + (type.mutable ? 'mutable' : 'immutable');
  if (nameW + 14 + textWidth(traits) < roomW - 30) {
    text(traits, padX + nameW + 14, y + 16);
  }
  if (!type.mutable) drawLock(x + w - 24, y + 24, 24, type.dark);

  // code block
  const codeTop = y + 44;
  const lineH = 21;
  const codeH = type.code.length * lineH + 14;
  stroke(type.edge);
  fill('white');
  rect(padX, codeTop, roomW, codeH, 8);
  noStroke();
  push();
  textFont('monospace');
  const longest = type.code.reduce((a, b) => (a.length >= b.length ? a : b));
  const codeSize = fitSize(longest, roomW - 20, 15, 8);
  textSize(codeSize);
  textAlign(LEFT, TOP);
  type.code.forEach((codeLine, i) => {
    const commentAt = codeLine.indexOf('#');
    const codePart = commentAt >= 0 ? codeLine.slice(0, commentAt) : codeLine;
    fill(INK);
    text(codePart, padX + 10, codeTop + 8 + i * lineH);
    if (commentAt >= 0) {
      fill(codeLine.includes('Error') ? BAD_RED : GOOD_GREEN);
      text(codeLine.slice(commentAt), padX + 10 + textWidth(codePart), codeTop + 8 + i * lineH);
    }
  });
  pop();

  // when to use it
  noStroke();
  fill(INK);
  const adviceTop = codeTop + codeH + 10;
  const adviceLines = Math.max(1, Math.floor((y + h - 30 - adviceTop) / 21));
  drawWrapped(type.useWhen, padX, adviceTop, roomW, adviceLines, 16);

  fill(MUTED);
  textAlign(RIGHT, BOTTOM);
  textSize(13);
  text('Click anywhere to close', x + w - 12, y + h - 8);
}

function drawPropertyChip(label, value, isGood, x, y) {
  textSize(14);
  textStyle(NORMAL);
  const labelW = textWidth(label + ': ');
  textStyle(BOLD);
  const valueW = textWidth(value);
  const chipW = labelW + valueW + 20;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, chipW, 24, 12);
  noStroke();
  textAlign(LEFT, CENTER);
  textStyle(NORMAL);
  fill(INK);
  text(label + ': ', x + 10, y + 13);
  textStyle(BOLD);
  fill(isGood ? GOOD_GREEN : BAD_RED);
  text(value, x + 10 + labelW, y + 13);
  textStyle(NORMAL);
  return chipW;
}

// The panel under the matrix: properties in explore mode, the question in quiz mode.
function drawPanel(hovered) {
  const x = margin;
  const y = panelTop;
  const w = canvasWidth - 2 * margin;
  const h = drawHeight - panelTop - 8;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();

  const padX = x + 12;
  const roomW = w - 24;

  if (mode === 'quiz') {
    drawQuizPanel(padX, y, roomW, h);
    return;
  }

  const shown = expandedKey ? TYPES.findIndex(t => t.key === expandedKey) : hovered;
  if (shown < 0) {
    fill(MUTED);
    drawWrapped('Hover over a card to compare its properties. Click a card to see code examples. ' +
      'Ready to test yourself? Press Quiz Me.', padX, y + 12, roomW, 4, 16);
    return;
  }

  const type = TYPES[shown];
  // heading: name and where it sits in the matrix
  fill(type.dark);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  textSize(18);
  text(type.name, padX, y + 9);
  const nameW = textWidth(type.name);
  textStyle(NORMAL);
  fill(MUTED);
  textSize(15);
  const traits = (type.ordered ? 'ordered' : 'unordered') + ', ' + (type.mutable ? 'mutable' : 'immutable');
  text(traits, padX + nameW + 10, y + 12);
  const traitsW = textWidth(traits);
  push();
  textFont('monospace');
  fill(INK);
  textSize(15);
  if (nameW + traitsW + 34 + textWidth(type.syntax) <= roomW) {
    textAlign(RIGHT, TOP);
    text(type.syntax, padX + roomW, y + 12);
  }
  pop();

  // property chips, wrapping to a second row on narrow canvases
  const chips = [
    ['Duplicates', type.duplicates ? 'allowed' : 'not allowed', type.duplicates],
    ['Indexable', type.indexable ? 'yes' : 'no', type.indexable],
    ['Dict key', type.dictKey ? 'yes' : 'no', type.dictKey]
  ];
  let chipX = padX;
  let chipY = y + 36;
  chips.forEach(([label, value, isGood]) => {
    textSize(14);
    const estimate = textWidth(label + ': ' + value) + 26;
    if (chipX + estimate > padX + roomW && chipX > padX) {
      chipX = padX;
      chipY += 28;
    }
    chipX += drawPropertyChip(label, value, isGood, chipX, chipY) + 8;
  });

  fill(INK);
  const bestTop = chipY + 31;
  const bestLines = Math.max(1, Math.floor((y + h - 4 - bestTop) / 19));
  drawWrapped('Best for: ' + type.bestFor, padX, bestTop, roomW, bestLines, 15);
}

function drawQuizPanel(padX, y, roomW, h) {
  noStroke();
  textAlign(LEFT, TOP);
  if (quizFinished) {
    fill(INK);
    textStyle(BOLD);
    textSize(18);
    text('Quiz complete!', padX, y + 10);
    textStyle(NORMAL);
    drawWrapped('You got ' + quizFirstTryCorrect + ' of ' + QUESTIONS.length +
      ' on the first try. Press Restart Quiz to go again, or Back to Explore to review the cards.',
      padX, y + 38, roomW, 3, 16);
    return;
  }
  const question = QUESTIONS[quizOrder[quizPosition]];
  fill(MUTED);
  textSize(14);
  text('Question ' + (quizPosition + 1) + ' of ' + QUESTIONS.length, padX, y + 8);
  fill(INK);
  textStyle(BOLD);
  const used = drawWrapped(question.prompt, padX, y + 28, roomW, 2, 17);
  textStyle(NORMAL);
  fill(quizSolved ? GOOD_GREEN : quizWrong.length > 0 ? BAD_RED : MUTED);
  const feedbackTop = y + 32 + used;
  const feedbackLines = Math.max(1, Math.floor((y + h - 4 - feedbackTop) / 19));
  drawWrapped(quizFeedback, padX, feedbackTop, roomW, feedbackLines, 15);
}

function drawControlText() {
  if (mode !== 'quiz') return;
  noStroke();
  fill('black');
  textStyle(NORMAL);
  textAlign(RIGHT, CENTER);
  textSize(defaultTextSize);
  const score = 'Score: ' + quizFirstTryCorrect + ' / ' + quizAnswered;
  if (canvasWidth - 270 > textWidth(score)) {
    text(score, canvasWidth - margin, drawHeight + 25);
  }
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
