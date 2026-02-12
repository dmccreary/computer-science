// Loop Patterns Comparison MicroSim
// Interactive quiz: identify which loop pattern is used in code snippets
// Patterns: Accumulator, Counter, Sentinel, Flag
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 400;
let drawHeight = 460;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// Controls
let nextButton, showAnswerButton;

// Quiz state
let examples = [];
let currentExample = 0;
let score = 0;
let totalAttempts = 0;
let selectedAnswer = -1;
let showingAnswer = false;
let feedbackMessage = '';
let feedbackCorrect = false;
let answeredThisQuestion = false;

// Pattern definitions
const patterns = [
  { name: 'Accumulator', icon: '+=', color: [70, 130, 220], desc: 'Build up a result' },
  { name: 'Counter', icon: '#', color: [46, 160, 67], desc: 'Count matches' },
  { name: 'Sentinel', icon: 'STOP', color: [230, 150, 50], desc: 'Stop on signal' },
  { name: 'Flag', icon: '?', color: [160, 80, 200], desc: 'Track if something happened' },
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  nextButton = createButton('Next Example');
  nextButton.position(10, drawHeight + 10);
  nextButton.mousePressed(nextExample);

  showAnswerButton = createButton('Show Answer');
  showAnswerButton.position(120, drawHeight + 10);
  showAnswerButton.mousePressed(revealAnswer);

  buildExamples();

  describe('Interactive quiz to identify loop patterns: accumulator, counter, sentinel, and flag. Read code snippets and classify them.', LABEL);
}

function buildExamples() {
  examples = [
    {
      code: 'total = 0\nfor num in range(1, 11):\n    total = total + num\nprint(total)',
      answer: 0, // Accumulator
      hint: 'Look at what happens to total in each iteration.',
      explanation: 'total starts at 0 and adds each number — classic accumulator.'
    },
    {
      code: 'count = 0\nfor ch in "hello world":\n    if ch == "l":\n        count = count + 1\nprint(count)',
      answer: 1, // Counter
      hint: 'What gets added and when?',
      explanation: 'Adds 1 only when a condition is met — counting matches.'
    },
    {
      code: 'text = ""\nword = input("Enter word: ")\nwhile word != "quit":\n    text = text + word + " "\n    word = input("Enter word: ")\nprint(text)',
      answer: 2, // Sentinel
      hint: 'What stops the loop?',
      explanation: '"quit" is the sentinel value that signals the loop to stop.'
    },
    {
      code: 'found = False\nfor item in shopping_list:\n    if item == "milk":\n        found = True\n        break\nif found:\n    print("Milk is on the list!")',
      answer: 3, // Flag
      hint: 'What type is the tracking variable?',
      explanation: 'A Boolean flag tracks whether "milk" was found.'
    },
    {
      code: 'product = 1\nfor n in [2, 3, 4, 5]:\n    product = product * n\nprint(product)',
      answer: 0, // Accumulator
      hint: 'The result is being built up, not counted.',
      explanation: 'product accumulates by multiplying — it builds up a result.'
    },
    {
      code: 'evens = 0\nfor x in range(1, 101):\n    if x % 2 == 0:\n        evens = evens + 1\nprint(evens)',
      answer: 1, // Counter
      hint: 'It adds 1 only for certain numbers.',
      explanation: 'Counts how many even numbers exist — counter pattern.'
    },
    {
      code: 'total = 0\nnum = int(input("Number (-1 to stop): "))\nwhile num != -1:\n    total += num\n    num = int(input("Number (-1 to stop): "))\nprint(total)',
      answer: 2, // Sentinel
      hint: 'What special value ends the input?',
      explanation: '-1 is the sentinel — a special stop signal.'
    },
    {
      code: 'has_upper = False\nfor ch in password:\n    if ch.isupper():\n        has_upper = True\nif has_upper:\n    print("Has uppercase!")',
      answer: 3, // Flag
      hint: 'The variable only needs to flip once.',
      explanation: 'Boolean flag tracks whether any uppercase letter exists.'
    },
    {
      code: 'result = ""\nfor letter in name:\n    result = result + letter.upper()\nprint(result)',
      answer: 0, // Accumulator
      hint: 'A string is being built up letter by letter.',
      explanation: 'result accumulates characters — string accumulator.'
    },
    {
      code: 'vowels = 0\nfor ch in sentence:\n    if ch.lower() in "aeiou":\n        vowels += 1\nprint(vowels, "vowels found")',
      answer: 1, // Counter
      hint: 'It only increments when a specific condition is true.',
      explanation: 'Counts vowels — adds 1 per match, classic counter.'
    },
  ];

  // Shuffle examples
  for (let i = examples.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [examples[i], examples[j]] = [examples[j], examples[i]];
  }
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
  text('Loop Patterns Quiz', canvasWidth / 2, 8);

  // Score
  textSize(13);
  textAlign(RIGHT, TOP);
  fill(100);
  text(score + '/' + totalAttempts + ' correct', canvasWidth - margin, 10);

  // Pattern cards at top
  drawPatternCards();

  // Code snippet
  drawCodeSnippet();

  // Answer buttons
  drawAnswerButtons();

  // Feedback
  drawFeedback();

  // Control labels
  noStroke();
  fill(80);
  textAlign(RIGHT, CENTER);
  textSize(12);
  text((currentExample + 1) + '/' + examples.length, canvasWidth - margin, drawHeight + 25);
}

function drawPatternCards() {
  let cardTop = 34;
  let cardH = 48;
  let gap = 8;
  let totalW = canvasWidth - margin * 2;
  let cardW = (totalW - gap * 3) / 4;

  for (let i = 0; i < 4; i++) {
    let cx = margin + i * (cardW + gap);
    let p = patterns[i];

    // Card background
    let isCorrectAnswer = showingAnswer && examples[currentExample].answer === i;
    stroke(p.color[0], p.color[1], p.color[2]);
    strokeWeight(isCorrectAnswer ? 3 : 1);
    fill(isCorrectAnswer ? [p.color[0], p.color[1], p.color[2], 40] : [255, 255, 255, 230]);
    rect(cx, cardTop, cardW, cardH, 6);

    // Icon
    noStroke();
    fill(p.color);
    textAlign(CENTER, CENTER);
    textSize(14);
    textStyle(BOLD);
    text(p.icon, cx + cardW / 2, cardTop + 15);

    // Name
    textSize(10);
    text(p.name, cx + cardW / 2, cardTop + 30);
    textStyle(NORMAL);

    // Description
    fill(120);
    textSize(9);
    text(p.desc, cx + cardW / 2, cardTop + 42);
  }
}

function drawCodeSnippet() {
  let codeTop = 92;
  let codeH = 150;

  // Code box
  fill(30, 30, 42);
  stroke(80);
  strokeWeight(1);
  rect(margin, codeTop, canvasWidth - margin * 2, codeH, 8);

  // Prompt
  noStroke();
  fill(180);
  textAlign(LEFT, TOP);
  textSize(11);
  text('Which pattern is this?', margin + 10, codeTop + 6);

  // Code text
  fill(220, 230, 255);
  textFont('monospace');
  textSize(12);
  let lines = examples[currentExample].code.split('\n');
  let ly = codeTop + 24;
  for (let line of lines) {
    // Syntax coloring
    if (line.trim().startsWith('#')) {
      fill(120, 160, 120);
    } else if (line.includes('for ') || line.includes('while ') || line.includes('if ') || line.includes('break')) {
      fill(200, 150, 255);
    } else {
      fill(220, 230, 255);
    }
    text(line, margin + 12, ly);
    ly += 16;
  }
  textFont('Arial');
}

function drawAnswerButtons() {
  let btnTop = 252;
  let gap = 8;
  let totalW = canvasWidth - margin * 2;
  let btnW = (totalW - gap * 3) / 4;
  let btnH = 40;

  for (let i = 0; i < 4; i++) {
    let bx = margin + i * (btnW + gap);
    let p = patterns[i];
    let isHovered = mouseX > bx && mouseX < bx + btnW && mouseY > btnTop && mouseY < btnTop + btnH;
    let isSelected = (selectedAnswer === i);
    let isCorrect = showingAnswer && examples[currentExample].answer === i;

    // Button style
    if (isCorrect && showingAnswer) {
      fill(180, 240, 180);
      stroke(46, 160, 67);
      strokeWeight(3);
    } else if (isSelected && !feedbackCorrect && showingAnswer) {
      fill(255, 210, 210);
      stroke(220, 80, 80);
      strokeWeight(2);
    } else if (isHovered && !answeredThisQuestion) {
      fill(240, 240, 255);
      stroke(p.color[0], p.color[1], p.color[2]);
      strokeWeight(2);
    } else {
      fill(250);
      stroke(200);
      strokeWeight(1);
    }
    rect(bx, btnTop, btnW, btnH, 8);

    // Button text
    noStroke();
    fill(isHovered && !answeredThisQuestion ? p.color : [80]);
    textAlign(CENTER, CENTER);
    textSize(12);
    textStyle(BOLD);
    text(p.name, bx + btnW / 2, btnTop + btnH / 2);
    textStyle(NORMAL);
  }
}

function drawFeedback() {
  if (feedbackMessage === '') return;

  let fbY = 305;
  let fbH = 65;

  fill(feedbackCorrect ? [230, 255, 230] : [255, 240, 230]);
  stroke(feedbackCorrect ? [46, 160, 67] : [220, 130, 50]);
  strokeWeight(1);
  rect(margin, fbY, canvasWidth - margin * 2, fbH, 8);

  noStroke();
  fill(feedbackCorrect ? [30, 100, 40] : [150, 80, 20]);
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(BOLD);
  text(feedbackCorrect ? 'Correct!' : 'Not quite...', margin + 12, fbY + 8);
  textStyle(NORMAL);

  fill(80);
  textSize(11);
  let ex = examples[currentExample];
  text(ex.explanation, margin + 12, fbY + 26, canvasWidth - margin * 2 - 24, 35);

  // Hint if wrong
  if (!feedbackCorrect && !showingAnswer) {
    fill(180, 100, 20);
    textSize(10);
    text('Hint: ' + ex.hint, margin + 12, fbY + 48);
  }
}

function mousePressed() {
  if (answeredThisQuestion && showingAnswer) return;

  // Check answer button clicks
  let btnTop = 252;
  let gap = 8;
  let totalW = canvasWidth - margin * 2;
  let btnW = (totalW - gap * 3) / 4;
  let btnH = 40;

  for (let i = 0; i < 4; i++) {
    let bx = margin + i * (btnW + gap);
    if (mouseX > bx && mouseX < bx + btnW && mouseY > btnTop && mouseY < btnTop + btnH) {
      checkAnswer(i);
      break;
    }
  }
}

function checkAnswer(idx) {
  if (answeredThisQuestion) return;

  selectedAnswer = idx;
  let correct = examples[currentExample].answer;

  if (idx === correct) {
    feedbackCorrect = true;
    feedbackMessage = 'Correct!';
    score++;
    showingAnswer = true;
    answeredThisQuestion = true;
  } else {
    feedbackCorrect = false;
    feedbackMessage = 'Try again!';
    // Don't set answeredThisQuestion so they can try again
  }
  totalAttempts++;
}

function revealAnswer() {
  showingAnswer = true;
  answeredThisQuestion = true;
  let correct = examples[currentExample].answer;
  feedbackCorrect = false;
  feedbackMessage = 'Answer: ' + patterns[correct].name;
}

function nextExample() {
  currentExample = (currentExample + 1) % examples.length;
  selectedAnswer = -1;
  showingAnswer = false;
  feedbackMessage = '';
  feedbackCorrect = false;
  answeredThisQuestion = false;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
