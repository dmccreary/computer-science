// Tuples vs Lists Decision Helper MicroSim
// Scenario-based practice for choosing the right Python sequence type.

let canvasWidth = 400;
let drawHeight = 430;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

let chooseTupleBtn;
let chooseListBtn;
let nextScenarioBtn;

let currentScenarioIndex = 0;
let answered = false;
let selectedChoice = '';
let wasCorrect = false;
let feedbackText = 'Choose the best data structure for this scenario.';

let attempts = 0;
let correct = 0;

const scenarios = [
  {
    prompt: 'Store GPS coordinates (lat, lon).',
    answer: 'tuple',
    explanation: 'Tuple is better because coordinates are fixed-length values that should not change.'
  },
  {
    prompt: 'Track items in a shopping cart.',
    answer: 'list',
    explanation: 'List is better because cart items are added and removed frequently.'
  },
  {
    prompt: 'Store an RGB color value (255, 128, 0).',
    answer: 'tuple',
    explanation: 'Tuple is better because RGB has exactly three ordered components that stay fixed.'
  },
  {
    prompt: 'Manage a playlist of songs.',
    answer: 'list',
    explanation: 'List is better because songs are inserted, deleted, and reordered.'
  },
  {
    prompt: 'Use coordinates as a dictionary key.',
    answer: 'tuple',
    explanation: 'Tuple is better because immutable types can be dictionary keys; lists cannot.'
  },
  {
    prompt: 'Store daily temperatures for an ongoing week.',
    answer: 'list',
    explanation: 'List is better because the collection grows as new temperature values are recorded.'
  },
  {
    prompt: 'Represent a database row: (name, age, email).',
    answer: 'tuple',
    explanation: 'Tuple is better because the fields form a fixed record shape.'
  },
  {
    prompt: 'Build a stack of undo operations.',
    answer: 'list',
    explanation: 'List is better because push and pop operations require mutability.'
  },
  {
    prompt: 'Store a fixed weekday mapping number and label, like (1, Monday).',
    answer: 'tuple',
    explanation: 'Tuple is better because this pair is a stable, fixed-size relation.'
  },
  {
    prompt: 'Collect incoming chat messages in order.',
    answer: 'list',
    explanation: 'List is better because new messages keep appending over time.'
  }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  chooseTupleBtn = createButton('Use a Tuple');
  chooseTupleBtn.mousePressed(() => evaluateChoice('tuple'));

  chooseListBtn = createButton('Use a List');
  chooseListBtn.mousePressed(() => evaluateChoice('list'));

  nextScenarioBtn = createButton('Next Scenario');
  nextScenarioBtn.mousePressed(nextScenario);

  positionControls();
  updateButtonStyles();

  describe(
    'Interactive decision helper for choosing tuples or lists in Python scenarios. '
      + 'Students select a data structure and receive immediate feedback and explanations.',
    LABEL
  );
}

function draw() {
  updateCanvasSize();

  // Base regions.
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitleAndScore();
  drawComparisonSection();
  drawScenarioCard();
  drawButtonHints();
}

function drawTitleAndScore() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  noStroke();
  text('Tuples vs Lists: Decision Helper', canvasWidth / 2, 10);

  noStroke();
  fill('#334155');
  textAlign(LEFT, TOP);
  textSize(14);
  noStroke();
  text('Bloom Level: Analyze (compare, differentiate)', margin, 42);

  noStroke();
  fill('#0b3b2e');
  textAlign(RIGHT, TOP);
  textSize(16);
  noStroke();
  text('Score: ' + correct + ' / ' + attempts, canvasWidth - margin, 42);
}

function drawComparisonSection() {
  const topY = 74;
  const cardH = 120;
  const gap = 16;
  const cardW = (canvasWidth - margin * 2 - gap) / 2;
  const tupleX = margin;
  const listX = tupleX + cardW + gap;

  // Tuple card.
  fill(255, 247, 220);
  stroke('#d4a017');
  strokeWeight(2);
  rect(tupleX, topY, cardW, cardH, 10);

  noStroke();
  fill('#7c4a03');
  textAlign(CENTER, TOP);
  textSize(18);
  noStroke();
  text('Tuple (x, y)', tupleX + cardW / 2, topY + 8);
  drawLockIcon(tupleX + cardW - 22, topY + 20);

  noStroke();
  fill('#92400e');
  textAlign(LEFT, TOP);
  textSize(13);
  noStroke();
  text('- Immutable\n- Fixed length\n- Hashable (often key-safe)', tupleX + 10, topY + 38);

  // List card.
  fill(230, 252, 237);
  stroke('#16a34a');
  strokeWeight(2);
  rect(listX, topY, cardW, cardH, 10);

  noStroke();
  fill('#14532d');
  textAlign(CENTER, TOP);
  textSize(18);
  noStroke();
  text('List [x, y]', listX + cardW / 2, topY + 8);

  noStroke();
  fill('#166534');
  textAlign(LEFT, TOP);
  textSize(13);
  noStroke();
  text('- Mutable\n- Dynamic size\n- Great for add/remove', listX + 10, topY + 38);
}

function drawScenarioCard() {
  const cardX = margin;
  const cardY = 214;
  const cardW = canvasWidth - margin * 2;
  const cardH = 180;
  const scenario = scenarios[currentScenarioIndex];

  let borderColor = '#64748b';
  let bgColor = color(248, 250, 252);
  if (answered) {
    if (wasCorrect) {
      borderColor = '#16a34a';
      bgColor = color(220, 252, 231);
    } else {
      borderColor = '#dc2626';
      bgColor = color(254, 226, 226);
    }
  }

  fill(bgColor);
  stroke(borderColor);
  strokeWeight(3);
  rect(cardX, cardY, cardW, cardH, 12);

  noStroke();
  fill('#0f172a');
  textAlign(LEFT, TOP);
  textSize(16);
  noStroke();
  text('Scenario ' + (currentScenarioIndex + 1) + ' of ' + scenarios.length, cardX + 12, cardY + 12);

  noStroke();
  fill('#1e293b');
  textAlign(LEFT, TOP);
  textSize(18);
  noStroke();
  text(wrapText(scenario.prompt, 54), cardX + 12, cardY + 42);

  noStroke();
  fill(answered ? (wasCorrect ? '#166534' : '#991b1b') : '#334155');
  textAlign(LEFT, TOP);
  textSize(14);
  noStroke();
  text(wrapText(feedbackText, 72), cardX + 12, cardY + 112);
}

function drawButtonHints() {
  noStroke();
  fill('#475569');
  textAlign(LEFT, TOP);
  textSize(13);
  noStroke();
  text('Choose Tuple or List, then click Next Scenario.', margin, drawHeight + 62);

  textSize(defaultTextSize);
}

function evaluateChoice(choice) {
  if (answered) {
    return;
  }

  const scenario = scenarios[currentScenarioIndex];
  answered = true;
  selectedChoice = choice;
  attempts += 1;

  if (choice === scenario.answer) {
    wasCorrect = true;
    correct += 1;
    feedbackText = 'Correct. ' + scenario.explanation;
  } else {
    wasCorrect = false;
    const best = scenario.answer === 'tuple' ? 'tuple' : 'list';
    feedbackText = 'Not quite. Better choice: ' + best + '. ' + scenario.explanation;
  }

  updateButtonStyles();
}

function nextScenario() {
  currentScenarioIndex = (currentScenarioIndex + 1) % scenarios.length;
  answered = false;
  selectedChoice = '';
  wasCorrect = false;
  feedbackText = 'Choose the best data structure for this scenario.';
  updateButtonStyles();
}

function drawLockIcon(x, y) {
  stroke('#92400e');
  strokeWeight(2);
  noFill();
  arc(x, y - 4, 10, 10, PI, TWO_PI);
  fill('#f59e0b');
  rect(x - 6, y - 4, 12, 10, 2);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = max(400, container.offsetWidth);
    positionControls();
  }
}

function positionControls() {
  if (!chooseTupleBtn || !chooseListBtn || !nextScenarioBtn) {
    return;
  }

  // Row 1: Two large answer buttons.
  const gap = 14;
  const row1Y = drawHeight + 8;
  const bigW = floor((canvasWidth - margin * 2 - gap) / 2);

  chooseTupleBtn.position(margin, row1Y);
  chooseTupleBtn.size(bigW, 36);

  chooseListBtn.position(margin + bigW + gap, row1Y);
  chooseListBtn.size(bigW, 36);

  // Row 2: Next scenario button.
  const nextW = min(220, canvasWidth - margin * 2);
  const row2Y = drawHeight + 48;
  // move button to the right of center for the instruction text on the left
  nextScenarioBtn.position(((canvasWidth - nextW) / 2) + 80, row2Y);
  nextScenarioBtn.size(nextW, 30);
}

function updateButtonStyles() {
  if (!chooseTupleBtn || !chooseListBtn || !nextScenarioBtn) {
    return;
  }

  chooseTupleBtn.style('font-size', '16px');
  chooseListBtn.style('font-size', '16px');
  chooseTupleBtn.style('font-weight', '700');
  chooseListBtn.style('font-weight', '700');
  nextScenarioBtn.style('font-size', '14px');

  chooseTupleBtn.style('background-color', '#e2e8f0');
  chooseListBtn.style('background-color', '#e2e8f0');
  chooseTupleBtn.style('border', '2px solid #64748b');
  chooseListBtn.style('border', '2px solid #64748b');
  nextScenarioBtn.style('background-color', '#e2e8f0');
  nextScenarioBtn.style('border', '1px solid #64748b');

  if (!answered) {
    return;
  }

  const scenario = scenarios[currentScenarioIndex];
  const correctIsTuple = scenario.answer === 'tuple';

  // Always highlight the correct answer in green.
  if (correctIsTuple) {
    chooseTupleBtn.style('background-color', '#bbf7d0');
    chooseTupleBtn.style('border', '2px solid #16a34a');
  } else {
    chooseListBtn.style('background-color', '#bbf7d0');
    chooseListBtn.style('border', '2px solid #16a34a');
  }

  // If the student picked wrong, show chosen button in red.
  if (!wasCorrect) {
    if (selectedChoice === 'tuple') {
      chooseTupleBtn.style('background-color', '#fecaca');
      chooseTupleBtn.style('border', '2px solid #dc2626');
    } else {
      chooseListBtn.style('background-color', '#fecaca');
      chooseListBtn.style('border', '2px solid #dc2626');
    }
  }
}

function wrapText(value, maxChars) {
  if (value.length <= maxChars) {
    return value;
  }

  const words = value.split(' ');
  let line = '';
  let out = '';

  for (let i = 0; i < words.length; i += 1) {
    const next = line.length === 0 ? words[i] : line + ' ' + words[i];
    if (next.length <= maxChars) {
      line = next;
    } else {
      out += line + '\n';
      line = words[i];
    }
  }

  if (line.length > 0) {
    out += line;
  }

  return out;
}
