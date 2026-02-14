let canvasWidth = 400;
let drawHeight = 470;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;

let presets = {
  student: '{\n  "name": "Ava",\n  "grade": 10,\n  "active": true\n}',
  game: '{\n  "player": "Rex",\n  "level": 5,\n  "inventory": ["key", "map"]\n}',
  settings: '{\n  "theme": "dark",\n  "notifications": false,\n  "volume": 80\n}',
  nested: '{\n  "course": "CS",\n  "student": {"name": "Mia", "id": 42},\n  "scores": [88, 92, 95]\n}'
};

let jsonInput;
let presetSelect;
let validateBtn;
let formatBtn;
let statusMsg = 'Valid JSON';
let statusColor = '#166534';
let pulse = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  presetSelect = createSelect();
  presetSelect.option('student');
  presetSelect.option('game');
  presetSelect.option('settings');
  presetSelect.option('nested');
  presetSelect.changed(() => loadPreset(presetSelect.value()));

  validateBtn = createButton('Validate');
  validateBtn.mousePressed(validateJSON);

  formatBtn = createButton('Pretty Format');
  formatBtn.mousePressed(prettyFormat);

  jsonInput = createElement('textarea', presets.student);
  jsonInput.elt.spellcheck = false;
  jsonInput.input(onJSONEdit);

  positionControls();
  describe('Dual view that maps editable JSON text to Python dictionary representation.', LABEL);
}

function draw() {
  updateCanvasSize();
  pulse += 0.06;

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawPanels();
  drawTypeLegend();
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('JSON to Dictionary Mapping', canvasWidth / 2, 10);

  fill('#334155');
  textSize(14);
  text('Edit JSON and see Python dict output update', canvasWidth / 2, 40);
}

function drawPanels() {
  const panelY = 72;
  const panelH = 310;
  const panelW = (canvasWidth - margin * 2 - 80) / 2;
  const leftX = margin;
  const rightX = canvasWidth - margin - panelW;

  fill(15, 23, 42, 245);
  stroke('#334155');
  rect(leftX, panelY, panelW, panelH, 8);

  noStroke();
  fill('#93c5fd');
  textAlign(LEFT, TOP);
  textSize(14);
  text('JSON Text', leftX + 10, panelY + 8);

  drawArrowBridge(leftX + panelW + 10, panelY + 100, 60, 70);

  fill(15, 23, 42, 245);
  stroke('#334155');
  rect(rightX, panelY, panelW, panelH, 8);

  noStroke();
  fill('#93c5fd');
  textAlign(LEFT, TOP);
  textSize(14);
  text('Python Dict View', rightX + 10, panelY + 8);

  const parsed = tryParse(jsonInput.value());

  fill(parsed.ok ? '#f8fafc' : '#fecaca');
  textAlign(LEFT, TOP);
  textSize(12);
  text(parsed.ok ? toPythonLiteral(parsed.value, 0) : parsed.error, rightX + 10, panelY + 34, panelW - 20, panelH - 50);

  noStroke();
  fill(statusColor);
  textSize(13);
  text(statusMsg, rightX + 10, panelY + panelH - 18);
}

function drawArrowBridge(x, y, w, h) {
  const a = 150 + 60 * sin(pulse);
  stroke(59, 130, 246, a);
  strokeWeight(3);
  line(x, y + h * 0.3, x + w, y + h * 0.3);
  line(x + w, y + h * 0.3, x + w - 10, y + h * 0.25);
  line(x + w, y + h * 0.3, x + w - 10, y + h * 0.35);

  line(x + w, y + h * 0.7, x, y + h * 0.7);
  line(x, y + h * 0.7, x + 10, y + h * 0.65);
  line(x, y + h * 0.7, x + 10, y + h * 0.75);

  noStroke();
  fill('#1e3a8a');
  textAlign(CENTER, CENTER);
  textSize(11);
  text('json.loads()', x + w / 2, y + h * 0.15);
  text('json.dumps()', x + w / 2, y + h * 0.87);
}

function drawTypeLegend() {
  const y = 406;
  noStroke();
  fill('#334155');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Type mapping: object -> dict, array -> list, string -> str, number -> int/float, true/false -> bool', margin, y, canvasWidth - 40, 40);
}

function onJSONEdit() {
  const parsed = tryParse(jsonInput.value());
  if (parsed.ok) {
    statusMsg = 'Valid JSON';
    statusColor = '#166534';
  } else {
    statusMsg = 'Invalid JSON: ' + parsed.error;
    statusColor = '#b91c1c';
  }
}

function validateJSON() {
  onJSONEdit();
}

function prettyFormat() {
  const parsed = tryParse(jsonInput.value());
  if (!parsed.ok) {
    statusMsg = 'Fix JSON before formatting';
    statusColor = '#b91c1c';
    return;
  }
  jsonInput.value(JSON.stringify(parsed.value, null, 2));
  statusMsg = 'Formatted JSON';
  statusColor = '#166534';
}

function loadPreset(name) {
  jsonInput.value(presets[name]);
  onJSONEdit();
}

function tryParse(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

function toPythonLiteral(value, indent) {
  const pad = '  '.repeat(indent);
  const next = '  '.repeat(indent + 1);

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    let out = '[\n';
    for (let i = 0; i < value.length; i++) {
      out += next + toPythonLiteral(value[i], indent + 1);
      if (i < value.length - 1) out += ',';
      out += '\n';
    }
    out += pad + ']';
    return out;
  }

  if (value !== null && typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) return '{}';
    let out = '{\n';
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      out += `${next}'${k}': ${toPythonLiteral(value[k], indent + 1)}`;
      if (i < keys.length - 1) out += ',';
      out += '\n';
    }
    out += pad + '}';
    return out;
  }

  if (typeof value === 'string') return `'${value}'`;
  if (typeof value === 'boolean') return value ? 'True' : 'False';
  if (value === null) return 'None';
  return String(value);
}

function positionControls() {
  presetSelect.position(10, drawHeight + 8);
  validateBtn.position(90, drawHeight + 8);
  formatBtn.position(158, drawHeight + 8);

  const panelY = 72;
  const panelW = (canvasWidth - margin * 2 - 80) / 2;
  const leftX = margin;
  jsonInput.position(leftX + 10, panelY + 34);
  jsonInput.size(panelW - 20, 260);
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
