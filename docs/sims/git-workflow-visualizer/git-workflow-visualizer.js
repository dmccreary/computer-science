let canvasWidth = 400;
let drawHeight = 470;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;

let files = [];
let moving = null;
let logs = ['Initialized repository'];
let statusFlash = 0;

let addBtn;
let commitBtn;
let statusBtn;
let logBtn;
let resetBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  addBtn = createButton('git add');
  addBtn.mousePressed(runAdd);

  commitBtn = createButton('git commit');
  commitBtn.mousePressed(runCommit);

  statusBtn = createButton('git status');
  statusBtn.mousePressed(() => {
    statusFlash = 50;
    pushLog('status: ' + summarizeStatus());
  });

  logBtn = createButton('git log');
  logBtn.mousePressed(() => {
    pushLog('log: ' + commitCount() + ' commit(s)');
  });

  resetBtn = createButton('Reset');
  resetBtn.mousePressed(resetSim);

  positionControls();
  resetSim();
  describe('Git workflow visualizer showing movement from working directory to staging and repository.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  updateMotion();

  drawTitle();
  drawZones();
  drawFiles();
  drawTerminal();

  if (statusFlash > 0) statusFlash -= 1;
}

function drawTitle() {
  noStroke();
  fill('#0f172a');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Git Workflow Visualizer', canvasWidth / 2, 10);
}

function drawZones() {
  const zoneW = (canvasWidth - margin * 4) / 3;
  const y = 68;
  const h = 220;

  const zones = [
    { name: 'Working Directory', color: '#dbeafe', x: margin },
    { name: 'Staging Area', color: '#fef9c3', x: margin * 2 + zoneW },
    { name: 'Repository', color: '#dcfce7', x: margin * 3 + zoneW * 2 }
  ];

  for (let i = 0; i < zones.length; i++) {
    const z = zones[i];
    fill(z.color);
    if (statusFlash > 0) {
      const active = (i === 0 && hasFiles('working')) || (i === 1 && hasFiles('staging')) || (i === 2 && hasFiles('repo'));
      if (active) fill(250, 204, 21, 120 + 80 * sin(frameCount * 0.2));
    }
    stroke('#64748b');
    rect(z.x, y, zoneW, h, 10);

    noStroke();
    fill('#1f2937');
    textAlign(CENTER, TOP);
    textSize(14);
    text(z.name, z.x + zoneW / 2, y + 8);

    z._w = zoneW;
    zones[i] = z;
  }

  this.zoneLayout = zones;
}

function drawFiles() {
  for (const f of files) {
    drawFileIcon(f.x, f.y, f.name, f.zone === 'repo');
  }
}

function drawFileIcon(x, y, name, committed) {
  fill(committed ? '#22c55e' : '#3b82f6');
  stroke('#1f2937');
  rect(x, y, 64, 28, 6);

  noStroke();
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(11);
  text(name, x + 32, y + 14);
}

function drawTerminal() {
  const x = margin;
  const y = 306;
  const w = canvasWidth - margin * 2;
  const h = 148;

  fill(15, 23, 42, 245);
  stroke('#334155');
  rect(x, y, w, h, 8);

  noStroke();
  fill('#93c5fd');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Simulated Terminal', x + 10, y + 8);

  fill('#e2e8f0');
  textFont('monospace');
  textSize(12);

  const lines = logs.slice(-6);
  for (let i = 0; i < lines.length; i++) {
    text('> ' + lines[i], x + 10, y + 32 + i * 18, w - 20, 18);
  }

  textFont('Arial, Helvetica, sans-serif');
}

function runAdd() {
  if (moving) return;
  const candidate = files.find((f) => f.zone === 'working');
  if (!candidate) {
    pushLog('nothing to add');
    return;
  }
  startMove(candidate, 'staging');
  pushLog('git add ' + candidate.name);
}

function runCommit() {
  if (moving) return;
  const staged = files.filter((f) => f.zone === 'staging');
  if (staged.length === 0) {
    pushLog('nothing to commit');
    return;
  }

  for (const f of staged) {
    f.zone = 'repo';
    setFilePosition(f);
  }
  pushLog('git commit -m "Update files"');
}

function startMove(file, targetZone) {
  const from = { x: file.x, y: file.y };
  file.zone = targetZone;
  setFilePosition(file);
  const to = { x: file.x, y: file.y };
  file.x = from.x;
  file.y = from.y;

  moving = { file, from, to, t: 0 };
}

function updateMotion() {
  if (!moving) return;
  moving.t += 0.05;
  const t = min(1, moving.t);
  const s = t * t * (3 - 2 * t);
  moving.file.x = lerp(moving.from.x, moving.to.x, s);
  moving.file.y = lerp(moving.from.y, moving.to.y, s);
  if (t >= 1) moving = null;
}

function hasFiles(zone) {
  return files.some((f) => f.zone === zone);
}

function summarizeStatus() {
  const w = files.filter((f) => f.zone === 'working').length;
  const s = files.filter((f) => f.zone === 'staging').length;
  const r = files.filter((f) => f.zone === 'repo').length;
  return `working=${w}, staging=${s}, repo=${r}`;
}

function commitCount() {
  return logs.filter((l) => l.startsWith('git commit')).length;
}

function pushLog(line) {
  logs.push(line);
}

function setFilePosition(file) {
  const zones = this.zoneLayout || [];
  if (zones.length < 3) return;

  const idx = file.zone === 'working' ? 0 : file.zone === 'staging' ? 1 : 2;
  const z = zones[idx];
  const peers = files.filter((f) => f.zone === file.zone);
  const row = peers.indexOf(file);
  file.x = z.x + 14;
  file.y = 102 + row * 36;
}

function resetSim() {
  files = [
    { name: 'main.py', zone: 'working', x: 0, y: 0 },
    { name: 'utils.py', zone: 'working', x: 0, y: 0 },
    { name: 'README.md', zone: 'working', x: 0, y: 0 }
  ];
  logs = ['Initialized repository'];
  moving = null;

  setTimeout(() => {
    for (const f of files) setFilePosition(f);
  }, 10);
}

function positionControls() {
  addBtn.position(10, drawHeight + 10);
  commitBtn.position(66, drawHeight + 10);
  statusBtn.position(142, drawHeight + 10);
  logBtn.position(213, drawHeight + 10);
  resetBtn.position(266, drawHeight + 10);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
  for (const f of files) {
    if (!moving || moving.file !== f) setFilePosition(f);
  }
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = max(760, container.offsetWidth);
  }
}
