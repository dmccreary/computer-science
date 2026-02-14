let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;

let current = 'root';
let history = ['root'];
let quizMode = false;
let quiz = null;
let quizFeedback = '';

let yesBtn;
let noBtn;
let startOverBtn;
let quizBtn;

const tree = {
  root: { q: 'Are you searching or sorting?', yesLabel: 'Searching', noLabel: 'Sorting', yes: 'search_sorted', no: 'sort_size' },
  search_sorted: { q: 'Is the data sorted?', yesLabel: 'Yes', noLabel: 'No', yes: 'binary', no: 'linear' },
  sort_size: { q: 'Is dataset large (>1000)?', yesLabel: 'Yes', noLabel: 'No', yes: 'sort_nearly', no: 'insertion' },
  sort_nearly: { q: 'Is data nearly sorted?', yesLabel: 'Yes', noLabel: 'No', yes: 'insertion', no: 'sort_memory' },
  sort_memory: { q: 'Is memory limited?', yesLabel: 'Yes', noLabel: 'No', yes: 'selection', no: 'merge' }
};

const leaves = {
  linear: { name: 'Linear Search', bigO: 'O(n)', why: 'Works on unsorted data; simple scan.' },
  binary: { name: 'Binary Search', bigO: 'O(log n)', why: 'Fast divide-and-conquer on sorted data.' },
  insertion: { name: 'Insertion Sort', bigO: 'O(n^2)', why: 'Good for small or nearly sorted arrays.' },
  selection: { name: 'Selection Sort', bigO: 'O(n^2)', why: 'Uses minimal extra memory.' },
  merge: { name: 'Merge Sort', bigO: 'O(n log n)', why: 'Consistent performance on larger data.' }
};

const quizCases = [
  { prompt: 'Unsorted phone contacts search', ans: 'linear' },
  { prompt: 'Large sorted ID list search', ans: 'binary' },
  { prompt: 'Large random array sort', ans: 'merge' },
  { prompt: 'Small nearly sorted array', ans: 'insertion' },
  { prompt: 'Need simple in-place sort with low memory', ans: 'selection' }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  yesBtn = createButton('Yes');
  yesBtn.mousePressed(() => choose('yes'));
  noBtn = createButton('No');
  noBtn.mousePressed(() => choose('no'));
  startOverBtn = createButton('Start Over');
  startOverBtn.mousePressed(resetFlow);
  quizBtn = createButton('Quiz Mode');
  quizBtn.mousePressed(toggleQuiz);

  positionControls();
  describe('Algorithm decision flowchart for selecting search or sorting approach based on constraints.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawFlowCard();
  drawPath();
  if (quizMode) drawQuiz();

  quizBtn.html(quizMode ? 'Exit Quiz' : 'Quiz Mode');
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Algorithm Decision Flowchart', canvasWidth / 2, 10);
}

function drawFlowCard() {
  const x = 70, y = 80, w = canvasWidth - 140, h = 280;
  fill('#f8fafc');
  stroke('#94a3b8');
  rect(x, y, w, h, 12);

  if (isLeaf(current)) {
    const l = leaves[current];
    noStroke();
    fill('#111827');
    textAlign(CENTER, TOP);
    textSize(22);
    text(l.name, x + w / 2, y + 18);

    textSize(15);
    fill('#1e3a8a');
    text(`Complexity: ${l.bigO}`, x + w / 2, y + 58);

    fill('#334155');
    textSize(14);
    text(l.why, x + 20, y + 98, w - 40, 90);
    return;
  }

  const n = tree[current];
  noStroke();
  fill('#111827');
  textAlign(CENTER, TOP);
  textSize(20);
  text(n.q, x + 20, y + 22, w - 40, 90);

  yesBtn.html(n.yesLabel || 'Yes');
  noBtn.html(n.noLabel || 'No');
}

function drawPath() {
  noStroke();
  fill('#334155');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Path: ' + history.join(' -> '), 20, 390, canvasWidth - 40, 40);
}

function drawQuiz() {
  if (!quiz) return;
  const x = 20, y = 430, w = canvasWidth - 40, h = 58;
  fill('#ecfeff');
  stroke('#06b6d4');
  rect(x, y, w, h, 8);
  noStroke();
  fill('#0c4a6e');
  textAlign(LEFT, TOP);
  textSize(12);
  text('Quiz: ' + quiz.prompt, x + 8, y + 8, w - 16, 24);
  fill('#1e3a8a');
  text(quizFeedback, x + 8, y + 34, w - 16, 18);
}

function choose(which) {
  if (quizMode && isLeaf(current)) checkQuiz(current);
  if (isLeaf(current)) return;
  const n = tree[current];
  current = which === 'yes' ? n.yes : n.no;
  history.push(current);
}

function isLeaf(id) {
  return Object.prototype.hasOwnProperty.call(leaves, id);
}

function resetFlow() {
  current = 'root';
  history = ['root'];
}

function toggleQuiz() {
  quizMode = !quizMode;
  quizFeedback = '';
  if (quizMode) quiz = random(quizCases);
}

function checkQuiz(leafId) {
  if (!quiz) return;
  if (leafId === quiz.ans) {
    quizFeedback = 'Correct.';
    setTimeout(() => { quiz = random(quizCases); quizFeedback = ''; resetFlow(); }, 400);
  } else {
    quizFeedback = `Not this time. Expected: ${leaves[quiz.ans].name}`;
  }
}

function positionControls() {
  yesBtn.position(90, drawHeight + 10);
  noBtn.position(150, drawHeight + 10);
  startOverBtn.position(200, drawHeight + 10);
  quizBtn.position(282, drawHeight + 10);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = max(760, container.offsetWidth);
}
