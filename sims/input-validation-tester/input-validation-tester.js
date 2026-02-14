let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;

let scenarioSelect;
let inputField;
let validateBtn;
let challengeBtn;
let clearBtn;

let logItems = [];
let challengeMode = false;
let challengeValue = '';

const scenarios = {
  Age: {
    rules: ['Must be whole number', 'Range: 0 to 150'],
    validate: (v) => {
      if (!/^\d+$/.test(v)) return 'Age must be a whole number';
      const n = Number(v);
      if (n < 0 || n > 150) return 'Age out of range';
      return null;
    },
    samples: ['17', '-1', '200', 'abc']
  },
  Email: {
    rules: ['Must include @', 'Must include domain after dot'],
    validate: (v) => {
      if (!v.includes('@')) return 'Missing @';
      const parts = v.split('@');
      if (parts.length !== 2 || parts[0].length === 0) return 'Invalid local part';
      if (!parts[1].includes('.')) return 'Missing domain dot';
      return null;
    },
    samples: ['a@b.com', 'user@local', '@mail.com', 'name.com']
  },
  Password: {
    rules: ['8+ chars', 'Contains uppercase', 'Contains lowercase', 'Contains number'],
    validate: (v) => {
      if (v.length < 8) return 'Too short';
      if (!/[A-Z]/.test(v)) return 'Missing uppercase';
      if (!/[a-z]/.test(v)) return 'Missing lowercase';
      if (!/\d/.test(v)) return 'Missing number';
      return null;
    },
    samples: ['abc', 'Password', 'password1', 'Passw0rd']
  },
  Grade: {
    rules: ['Numeric value', 'Range: 0 to 100'],
    validate: (v) => {
      if (!/^[-+]?\d+(\.\d+)?$/.test(v)) return 'Grade must be numeric';
      const n = Number(v);
      if (n < 0 || n > 100) return 'Grade out of range';
      return null;
    },
    samples: ['85', '101', '-5', 'A+']
  }
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  scenarioSelect = createSelect();
  Object.keys(scenarios).forEach((k) => scenarioSelect.option(k));
  scenarioSelect.changed(() => {
    challengeMode = false;
    challengeValue = '';
  });

  inputField = createInput('');
  inputField.attribute('placeholder', 'Enter value to validate');

  validateBtn = createButton('Validate');
  validateBtn.mousePressed(validateCurrent);

  challengeBtn = createButton('Challenge Mode');
  challengeBtn.mousePressed(startChallenge);

  clearBtn = createButton('Clear Log');
  clearBtn.mousePressed(() => {
    logItems = [];
  });

  positionControls();
  describe('Input validation tester for age email password and grade with pass fail feedback.', LABEL);
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
  drawRulesPanel();
  drawChallengePanel();
  drawLogPanel();
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Input Validation Tester', canvasWidth / 2, 10);
}

function selectedScenario() {
  return scenarioSelect.value() || 'Age';
}

function drawRulesPanel() {
  const key = selectedScenario();
  const cfg = scenarios[key];

  const x = margin;
  const y = 68;
  const w = canvasWidth * 0.42;
  const h = 190;

  fill('#f8fafc');
  stroke('#94a3b8');
  rect(x, y, w, h, 8);

  noStroke();
  fill('#111827');
  textAlign(LEFT, TOP);
  textSize(14);
  text('Rules: ' + key, x + 10, y + 10);

  textSize(12);
  fill('#334155');
  for (let i = 0; i < cfg.rules.length; i++) {
    text('- ' + cfg.rules[i], x + 12, y + 38 + i * 22, w - 24, 20);
  }
}

function drawChallengePanel() {
  const x = margin + canvasWidth * 0.42 + 14;
  const y = 68;
  const w = canvasWidth - x - margin;
  const h = 190;

  fill('#ecfeff');
  stroke('#7dd3fc');
  rect(x, y, w, h, 8);

  noStroke();
  fill('#0c4a6e');
  textAlign(LEFT, TOP);
  textSize(14);
  text('Challenge', x + 10, y + 10);

  fill('#334155');
  textSize(12);
  if (challengeMode) {
    text('Predict pass/fail then click Validate:', x + 10, y + 36, w - 20, 30);
    fill('#0f172a');
    textSize(15);
    text(challengeValue, x + 10, y + 72);
  } else {
    text('Press Challenge Mode to load tricky input.', x + 10, y + 36, w - 20, 40);
  }
}

function drawLogPanel() {
  const x = margin;
  const y = 272;
  const w = canvasWidth - margin * 2;
  const h = 214;

  fill(15, 23, 42, 245);
  stroke('#334155');
  rect(x, y, w, h, 8);

  noStroke();
  fill('#93c5fd');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Validation Log', x + 10, y + 8);

  let yy = y + 30;
  for (const item of logItems.slice(-9)) {
    fill(item.pass ? '#22c55e' : '#ef4444');
    textSize(12);
    text(`${item.pass ? 'PASS' : 'FAIL'} | ${item.scenario} | ${item.value} | ${item.msg}`, x + 10, yy, w - 20, 20);
    yy += 20;
  }
}

function validateCurrent() {
  const scenario = selectedScenario();
  const cfg = scenarios[scenario];
  const value = inputField.value().trim();
  const err = cfg.validate(value);

  logItems.push({
    scenario,
    value,
    pass: err === null,
    msg: err || 'Valid'
  });

  if (challengeMode) {
    challengeMode = false;
    challengeValue = '';
  }
}

function startChallenge() {
  const scenario = selectedScenario();
  const cfg = scenarios[scenario];
  challengeValue = random(cfg.samples);
  inputField.value(challengeValue);
  challengeMode = true;
}

function positionControls() {
  scenarioSelect.position(10, drawHeight + 10);
  inputField.position(85, drawHeight + 10);
  inputField.size(max(170, canvasWidth - 390), 24);
  validateBtn.position(canvasWidth - 213, drawHeight + 10);
  challengeBtn.position(canvasWidth - 146, drawHeight + 10);
  clearBtn.position(canvasWidth - 48, drawHeight + 10);
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
    if (inputField) inputField.size(max(170, canvasWidth - 390), 24);
  }
}
