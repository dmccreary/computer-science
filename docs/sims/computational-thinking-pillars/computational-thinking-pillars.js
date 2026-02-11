// Computational Thinking Pillars - Interactive Infographic MicroSim
// Bloom Level: Understand (L2) - classify, explain
// Students identify and explain the four pillars of computational thinking

let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 0;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;
let mouseOverCanvas = false;

// Node data
let centerNode;
let pillarNodes = [];
let hoveredNode = null;
let clickedNode = null;
let clickAnimTimer = 0;
let clickAnimDuration = 30; // frames for click animation
let pulseAngle = 0;

// Colors
const centerColor = '#2e7d32';     // green
const decompColor = '#1565c0';     // blue
const patternColor = '#e65100';    // orange
const abstractColor = '#6a1b9a';   // purple
const algoColor = '#c62828';       // red

// Pillar definitions
const pillars = [
  {
    label: 'Decomposition',
    color: decompColor,
    position: 'top',
    definition: 'Break big problems into smaller parts.',
    analogy: 'Like cutting a pizza into slices before eating it.',
    example: 'Building a game = graphics + input + scoring + sound'
  },
  {
    label: 'Pattern\nRecognition',
    color: patternColor,
    position: 'right',
    definition: 'Spot repeating similarities.',
    analogy: 'Like noticing your morning routine is the same each day.',
    example: 'Reusing "display a list" code for songs, contacts, and tasks'
  },
  {
    label: 'Abstraction',
    color: abstractColor,
    position: 'bottom',
    definition: 'Focus on what matters, ignore what doesn\'t.',
    analogy: 'Like a subway map hiding city details.',
    example: 'Using a function without knowing how it works inside'
  },
  {
    label: 'Algorithms',
    color: algoColor,
    position: 'left',
    definition: 'Step-by-step instructions to solve a problem.',
    analogy: 'Like a recipe for cookies.',
    example: 'The exact steps to sort a list of numbers from smallest to largest'
  }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  canvas.mouseOver(() => mouseOverCanvas = true);
  canvas.mouseOut(() => mouseOverCanvas = false);
  describe('Interactive infographic showing four pillars of computational thinking', LABEL);
  textFont('Arial');
  buildNodes();
}

function draw() {
  updateCanvasSize();

  // Background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Title
  noStroke();
  fill('#333');
  textAlign(CENTER, TOP);
  textSize(max(18, canvasWidth * 0.04));
  textStyle(BOLD);
  text('Computational Thinking Pillars', canvasWidth / 2, margin * 0.6);
  textStyle(NORMAL);

  // Update node positions responsively
  buildNodes();

  // Update pulse angle
  pulseAngle += 0.03;

  // Detect hover
  hoveredNode = null;
  for (let i = 0; i < pillarNodes.length; i++) {
    let n = pillarNodes[i];
    if (dist(mouseX, mouseY, n.x, n.y) < n.w * 0.55) {
      hoveredNode = i;
    }
  }

  // Update click animation timer
  if (clickAnimTimer > 0) {
    clickAnimTimer--;
  } else {
    clickedNode = null;
  }

  // Draw connecting lines
  drawConnections();

  // Draw center node
  drawCenterNode();

  // Draw pillar nodes
  for (let i = 0; i < pillarNodes.length; i++) {
    drawPillarNode(i);
  }

  // Draw tooltip if hovering
  if (hoveredNode !== null) {
    drawTooltip(hoveredNode);
  }

  // Instruction text at bottom
  noStroke();
  fill('#777');
  textAlign(CENTER, BOTTOM);
  textSize(max(13, canvasWidth * 0.028));
  textStyle(ITALIC);
  text('Hover over a pillar to learn more. Click to highlight.', canvasWidth / 2, drawHeight - 8);
  textStyle(NORMAL);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  buildNodes();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
    canvasHeight = drawHeight + controlHeight;
  }
}

function buildNodes() {
  let cx = canvasWidth / 2;
  let cy = drawHeight / 2 + 10;
  let nodeW = max(110, canvasWidth * 0.2);
  let nodeH = max(55, canvasWidth * 0.1);
  let spreadX = max(140, canvasWidth * 0.3);
  let spreadY = max(120, drawHeight * 0.28);

  centerNode = { x: cx, y: cy, w: nodeW * 1.15, h: nodeH * 1.15 };

  // Diamond arrangement: top, right, bottom, left
  let positions = [
    { x: cx, y: cy - spreadY },               // top - Decomposition
    { x: cx + spreadX, y: cy },               // right - Pattern Recognition
    { x: cx, y: cy + spreadY },               // bottom - Abstraction
    { x: cx - spreadX, y: cy }                // left - Algorithms
  ];

  pillarNodes = [];
  for (let i = 0; i < 4; i++) {
    pillarNodes.push({
      x: positions[i].x,
      y: positions[i].y,
      w: nodeW,
      h: nodeH,
      color: pillars[i].color,
      label: pillars[i].label,
      data: pillars[i]
    });
  }
}

function drawConnections() {
  for (let i = 0; i < pillarNodes.length; i++) {
    let n = pillarNodes[i];
    let isClicked = (clickedNode === i && clickAnimTimer > 0);
    let isHovered = (hoveredNode === i);

    if (isClicked) {
      // Animated glow effect on click
      let glowAlpha = map(clickAnimTimer, 0, clickAnimDuration, 50, 255);
      let glowWeight = map(clickAnimTimer, 0, clickAnimDuration, 2, 8);
      stroke(color(n.color + '80'));
      strokeWeight(glowWeight + 4);
      noFill();
      line(centerNode.x, centerNode.y, n.x, n.y);
      stroke(n.color);
      strokeWeight(glowWeight);
      line(centerNode.x, centerNode.y, n.x, n.y);
    } else if (isHovered) {
      stroke(n.color);
      strokeWeight(3);
      line(centerNode.x, centerNode.y, n.x, n.y);
    } else {
      stroke(200);
      strokeWeight(2);
      line(centerNode.x, centerNode.y, n.x, n.y);
    }
  }
}

function drawCenterNode() {
  let n = centerNode;
  let r = 14;

  // Shadow
  noStroke();
  fill(0, 0, 0, 25);
  rect(n.x - n.w / 2 + 3, n.y - n.h / 2 + 3, n.w, n.h, r);

  // Node body
  fill(centerColor);
  stroke(255, 255, 255, 120);
  strokeWeight(2);
  rect(n.x - n.w / 2, n.y - n.h / 2, n.w, n.h, r);

  // Label
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(max(14, canvasWidth * 0.03));
  textStyle(BOLD);
  text('Computational\nThinking', n.x, n.y);
  textStyle(NORMAL);
}

function drawPillarNode(i) {
  let n = pillarNodes[i];
  let r = 12;
  let isHovered = (hoveredNode === i);
  let isClicked = (clickedNode === i && clickAnimTimer > 0);

  // Gentle pulsing when mouse is over canvas
  let pulseScale = 1.0;
  if (mouseOverCanvas && !isHovered) {
    // Each node pulses at a slightly offset phase
    pulseScale = 1.0 + 0.02 * sin(pulseAngle + i * HALF_PI);
  }
  if (isHovered) {
    pulseScale = 1.08;
  }

  let w = n.w * pulseScale;
  let h = n.h * pulseScale;

  // Shadow
  noStroke();
  fill(0, 0, 0, 20);
  rect(n.x - w / 2 + 3, n.y - h / 2 + 3, w, h, r);

  // Glow on click
  if (isClicked) {
    let glowAlpha = map(clickAnimTimer, 0, clickAnimDuration, 0, 100);
    fill(red(color(n.color)), green(color(n.color)), blue(color(n.color)), glowAlpha);
    noStroke();
    rect(n.x - w / 2 - 5, n.y - h / 2 - 5, w + 10, h + 10, r + 4);
  }

  // Node body
  let nodeColor = color(n.color);
  if (isHovered) {
    fill(lerpColor(nodeColor, color(255), 0.15));
  } else {
    fill(nodeColor);
  }
  stroke(255, 255, 255, 100);
  strokeWeight(2);
  rect(n.x - w / 2, n.y - h / 2, w, h, r);

  // Label
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(max(14, canvasWidth * 0.028));
  textStyle(BOLD);
  text(n.label, n.x, n.y);
  textStyle(NORMAL);
}

function drawTooltip(nodeIndex) {
  let n = pillarNodes[nodeIndex];
  let data = n.data;

  let tooltipW = min(320, canvasWidth * 0.7);
  let padding = 12;
  let lineH = max(16, canvasWidth * 0.03);
  let smallLineH = lineH * 0.9;
  let titleSize = max(15, canvasWidth * 0.032);
  let bodySize = max(13, canvasWidth * 0.028);

  // Calculate tooltip position - keep it within canvas
  let tx = n.x;
  let ty = n.y;

  // Build text content to measure height
  let lines = [];
  lines.push({ text: data.label.replace('\n', ' '), style: 'bold', size: titleSize });
  lines.push({ text: '', style: 'spacer', size: 6 });
  lines.push({ text: data.definition, style: 'normal', size: bodySize });
  lines.push({ text: '', style: 'spacer', size: 4 });
  lines.push({ text: 'Analogy: ' + data.analogy, style: 'italic', size: bodySize });
  lines.push({ text: '', style: 'spacer', size: 4 });
  lines.push({ text: 'Example: ' + data.example, style: 'italic', size: bodySize });

  // Estimate tooltip height using word wrapping
  let tooltipH = padding * 2;
  for (let l of lines) {
    if (l.style === 'spacer') {
      tooltipH += l.size;
    } else {
      textSize(l.size);
      let wrappedCount = ceil(textWidth(l.text) / (tooltipW - padding * 2));
      wrappedCount = max(1, wrappedCount);
      tooltipH += wrappedCount * (l.size + 4);
    }
  }
  tooltipH += 4;

  // Position tooltip so it doesn't overlap the node and stays in bounds
  // Default: below and centered on node
  let tooltipX = tx - tooltipW / 2;
  let tooltipY = ty + n.h / 2 + 12;

  // If node is at bottom, show tooltip above
  if (data.position === 'bottom') {
    tooltipY = ty - n.h / 2 - tooltipH - 12;
  }

  // Keep within horizontal bounds
  tooltipX = constrain(tooltipX, margin, canvasWidth - tooltipW - margin);
  // Keep within vertical bounds
  tooltipY = constrain(tooltipY, margin + 30, drawHeight - tooltipH - margin);

  // Tooltip shadow
  noStroke();
  fill(0, 0, 0, 30);
  rect(tooltipX + 3, tooltipY + 3, tooltipW, tooltipH, 10);

  // Tooltip background
  fill(255, 255, 255, 245);
  stroke(n.color);
  strokeWeight(2);
  rect(tooltipX, tooltipY, tooltipW, tooltipH, 10);

  // Colored accent bar at top
  noStroke();
  fill(n.color);
  rect(tooltipX, tooltipY, tooltipW, 4, 10, 10, 0, 0);

  // Draw text content
  let textX = tooltipX + padding;
  let textY = tooltipY + padding + 6;
  let maxTextW = tooltipW - padding * 2;

  for (let l of lines) {
    if (l.style === 'spacer') {
      textY += l.size;
      continue;
    }

    textSize(l.size);
    noStroke();
    textAlign(LEFT, TOP);

    if (l.style === 'bold') {
      fill(n.color);
      textStyle(BOLD);
    } else if (l.style === 'italic') {
      fill('#555');
      textStyle(ITALIC);
    } else {
      fill('#333');
      textStyle(NORMAL);
    }

    // Word wrap manually
    let words = l.text.split(' ');
    let currentLine = '';
    for (let w of words) {
      let testLine = currentLine.length === 0 ? w : currentLine + ' ' + w;
      if (textWidth(testLine) > maxTextW && currentLine.length > 0) {
        text(currentLine, textX, textY);
        textY += l.size + 4;
        currentLine = w;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine.length > 0) {
      text(currentLine, textX, textY);
      textY += l.size + 4;
    }
    textStyle(NORMAL);
  }
}

function mousePressed() {
  if (!mouseOverCanvas) return;

  for (let i = 0; i < pillarNodes.length; i++) {
    let n = pillarNodes[i];
    if (dist(mouseX, mouseY, n.x, n.y) < n.w * 0.55) {
      clickedNode = i;
      clickAnimTimer = clickAnimDuration;
      break;
    }
  }
}
