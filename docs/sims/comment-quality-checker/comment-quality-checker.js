let canvasWidth = 400;
let drawHeight = 470;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;

let qIndex = 0;
let score = 0;
let answered = false;
let feedback = 'Rate the comment quality for this snippet.';
let feedbackColor = '#334155';

let helpfulBtn;
let unhelpfulBtn;
let missingBtn;
let nextBtn;
let resetBtn;

const questions = [
  {
    code: 'total = sum(scores)\n# Calculate sum of list\navg = total / len(scores)',
    ask: '"# Calculate sum of list"',
    answer: 'unhelpful',
    why: 'It repeats what the code already states.'
  },
  {
    code: '# Use median because outliers skew mean\nscore = median(values)',
    ask: '"# Use median because outliers skew mean"',
    answer: 'helpful',
    why: 'It explains why this choice was made.'
  },
  {
    code: 'config = load_json("settings.json")\nif not config:\n    use_defaults()',
    ask: '(missing comment near fallback behavior)',
    answer: 'missing',
    why: 'A comment should explain when fallback defaults are required.'
  },
  {
    code: '# Retry to handle temporary network errors\nfor i in range(3):\n    if send_request(): break',
    ask: '"# Retry to handle temporary network errors"',
    answer: 'helpful',
    why: 'It explains intent and reasoning.'
  },
  {
    code: 'i = i + 1\n# increment i',
    ask: '"# increment i"',
    answer: 'unhelpful',
    why: 'This states the obvious and adds no insight.'
  },
  {
    code: 'with open(path) as f:\n    data = f.read()\n# ?? why only first line is used later',
    ask: '(missing rationale comment)',
    answer: 'missing',
    why: 'Code behavior needs explanation for maintainers.'
  },
  {
    code: '# Normalize to lowercase to avoid duplicate keys\nkey = key.lower()',
    ask: '"# Normalize to lowercase to avoid duplicate keys"',
    answer: 'helpful',
    why: 'This explains a domain-specific reason.'
  },
  {
    code: 'print(result)\n# print result',
    ask: '"# print result"',
    answer: 'unhelpful',
    why: 'The comment duplicates the exact action.'
  }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  helpfulBtn = createButton('Helpful (explains why)');
  helpfulBtn.mousePressed(() => submit('helpful'));

  unhelpfulBtn = createButton('Unhelpful (states obvious)');
  unhelpfulBtn.mousePressed(() => submit('unhelpful'));

  missingBtn = createButton('Missing (needs comment)');
  missingBtn.mousePressed(() => submit('missing'));

  nextBtn = createButton('Next');
  nextBtn.mousePressed(nextQuestion);

  resetBtn = createButton('Reset Quiz');
  resetBtn.mousePressed(resetQuiz);

  positionControls();
  describe('Interactive quiz for evaluating comment quality as helpful, unhelpful, or missing.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawQuestionPanel();
  drawScorePanel();
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Comment Quality Checker', canvasWidth / 2, 10);
}

function drawQuestionPanel() {
  const q = questions[qIndex];
  const x = margin;
  const y = 72;
  const w = canvasWidth - margin * 2;
  const h = 300;

  fill('#f8fafc');
  stroke('#94a3b8');
  rect(x, y, w, h, 8);

  noStroke();
  fill('#111827');
  textAlign(LEFT, TOP);
  textSize(14);
  text(`Question ${qIndex + 1} of ${questions.length}`, x + 12, y + 10);

  fill(15, 23, 42, 245);
  stroke('#334155');
  rect(x + 12, y + 38, w - 24, 155, 8);

  noStroke();
  fill('#e2e8f0');
  textFont('monospace');
  textSize(13);
  text(q.code, x + 20, y + 50, w - 40, 140);
  textFont('Arial, Helvetica, sans-serif');

  fill('#334155');
  textSize(13);
  text('Comment Under Review: ' + q.ask, x + 12, y + 205, w - 24, 34);

  fill(feedbackColor);
  textSize(13);
  text('Feedback: ' + feedback, x + 12, y + 244, w - 24, 40);
}

function drawScorePanel() {
  const x = margin;
  const y = 386;
  const w = canvasWidth - margin * 2;
  const h = 56;

  fill('#ecfeff');
  stroke('#94a3b8');
  rect(x, y, w, h, 8);

  noStroke();
  fill('#0f172a');
  textAlign(LEFT, CENTER);
  textSize(14);
  text(`Score: ${score} / ${questions.length}`, x + 12, y + 18);
  text(`Progress: ${qIndex + 1} / ${questions.length}`, x + 12, y + 38);
}

function submit(choice) {
  if (answered) return;

  const q = questions[qIndex];
  answered = true;
  if (choice === q.answer) {
    score += 1;
    feedback = 'Correct. ' + q.why;
    feedbackColor = '#166534';
  } else {
    feedback = 'Not quite. ' + q.why;
    feedbackColor = '#b91c1c';
  }
}

function nextQuestion() {
  if (!answered && qIndex < questions.length - 1) return;

  if (qIndex < questions.length - 1) {
    qIndex += 1;
    answered = false;
    feedback = 'Rate the comment quality for this snippet.';
    feedbackColor = '#334155';
  } else {
    feedback = 'Quiz complete. Press Reset Quiz to try again.';
    feedbackColor = '#1d4ed8';
  }
}

function resetQuiz() {
  qIndex = 0;
  score = 0;
  answered = false;
  feedback = 'Rate the comment quality for this snippet.';
  feedbackColor = '#334155';
}

function positionControls() {
  helpfulBtn.position(10, drawHeight + 8);
  unhelpfulBtn.position(170, drawHeight + 8);
  missingBtn.position(362, drawHeight + 8);
  nextBtn.position(515, drawHeight + 8);
  resetBtn.position(560, drawHeight + 8);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = max(760, container.offsetWidth);
  }
}
