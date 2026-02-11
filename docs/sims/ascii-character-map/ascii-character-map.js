// ASCII Character Map MicroSim
// Bloom Level: Remember (L1) - identify, recall
// Students look up ASCII numeric values and recognize
// how letters and digits are organized in the ASCII table.

let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Grid layout: 16 columns, 6 rows for codes 32-127
let cols = 16;
let rows = 6;
let totalChars = 95; // codes 32 through 126

// Calculated cell dimensions
let cellW, cellH;

// Grid positioning
let gridX, gridY, gridW, gridH;

// Tooltip
let hoveredCode = -1;

// UI controls
let showValuesCheckbox;

// Legend info
let legendY;

// Category colors
let colorUppercase, colorLowercase, colorDigit, colorSymbol, colorSpace;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    textFont('Arial');

    // Define category colors
    colorUppercase = color(173, 216, 250); // light blue
    colorLowercase = color(173, 240, 180); // light green
    colorDigit     = color(255, 210, 140); // light orange
    colorSymbol    = color(210, 180, 240); // light purple
    colorSpace     = color(210, 210, 210); // light gray

    // Create the show-values checkbox in the control area
    showValuesCheckbox = createCheckbox(' Show Decimal Values', false);
    showValuesCheckbox.position(10, drawHeight + 12);
    showValuesCheckbox.style('font-size', '14px');
    showValuesCheckbox.style('font-family', 'Arial, Helvetica, sans-serif');
    showValuesCheckbox.parent(document.querySelector('main'));

    describe('Interactive ASCII character map showing printable characters 32 through 126, color-coded by category. Hover over cells to see details.');
}

function draw() {
    // Draw area background
    fill('aliceblue');
    stroke('silver');
    rect(0, 0, canvasWidth, drawHeight);

    // Control area background
    fill('white');
    stroke('silver');
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Calculate grid dimensions
    let titleH = 30;
    let legendH = 22;
    let topPad = margin + titleH + 4;
    gridX = margin;
    gridY = topPad + legendH + 4;
    gridW = canvasWidth - margin * 2;
    gridH = drawHeight - gridY - 10;
    cellW = gridW / cols;
    cellH = gridH / rows;

    // Title
    noStroke();
    fill(30);
    textSize(18);
    textAlign(CENTER, TOP);
    text('ASCII Character Map', canvasWidth / 2, margin - 4);

    // Draw legend
    drawLegend(margin, topPad);

    // Draw grid cells
    hoveredCode = -1;
    let showVals = showValuesCheckbox.checked();

    for (let i = 0; i < totalChars; i++) {
        let code = 32 + i;
        let col = i % cols;
        let row = Math.floor(i / cols);
        let cx = gridX + col * cellW;
        let cy = gridY + row * cellH;

        // Determine category color
        let catColor = getCategoryColor(code);

        // Check hover
        let isHovered = (mouseX >= cx && mouseX < cx + cellW &&
                         mouseY >= cy && mouseY < cy + cellH);
        if (isHovered) {
            hoveredCode = code;
        }

        // Draw cell background
        stroke(180);
        strokeWeight(0.5);
        fill(catColor);
        if (isHovered) {
            // Brighten on hover
            fill(lerpColor(catColor, color(255, 255, 255), 0.4));
            strokeWeight(2);
            stroke(80);
        }
        rect(cx, cy, cellW, cellH, 2);

        // Draw character
        noStroke();
        fill(30);
        let charLabel = (code === 32) ? 'SP' : String.fromCharCode(code);

        if (showVals) {
            // Character on top, decimal below
            textSize(constrain(cellW * 0.45, 10, 16));
            textAlign(CENTER, CENTER);
            text(charLabel, cx + cellW / 2, cy + cellH * 0.35);

            // Decimal value below
            fill(100);
            textSize(constrain(cellW * 0.32, 8, 11));
            text(code, cx + cellW / 2, cy + cellH * 0.72);
        } else {
            // Character centered
            textSize(constrain(cellW * 0.55, 11, 18));
            textAlign(CENTER, CENTER);
            text(charLabel, cx + cellW / 2, cy + cellH / 2);
        }
    }

    // Draw tooltip last (on top of everything)
    if (hoveredCode >= 0) {
        drawTooltip(hoveredCode);
    }
}

function getCategoryColor(code) {
    if (code === 32) return colorSpace;
    if (code >= 48 && code <= 57) return colorDigit;
    if (code >= 65 && code <= 90) return colorUppercase;
    if (code >= 97 && code <= 122) return colorLowercase;
    return colorSymbol;
}

function getCategoryName(code) {
    if (code === 32) return 'Space';
    if (code >= 48 && code <= 57) return 'Digit';
    if (code >= 65 && code <= 90) return 'Uppercase Letter';
    if (code >= 97 && code <= 122) return 'Lowercase Letter';
    return 'Symbol';
}

function toBinary8(n) {
    let s = n.toString(2);
    while (s.length < 8) s = '0' + s;
    return s;
}

function drawTooltip(code) {
    let charLabel = (code === 32) ? 'Space (SP)' : '"' + String.fromCharCode(code) + '"';
    let decLabel = 'Decimal: ' + code;
    let binLabel = 'Binary: ' + toBinary8(code);
    let catLabel = 'Category: ' + getCategoryName(code);

    textSize(13);
    textAlign(LEFT, TOP);

    // Measure tooltip size
    let lines = [charLabel, decLabel, binLabel, catLabel];
    let maxW = 0;
    for (let i = 0; i < lines.length; i++) {
        let w = textWidth(lines[i]);
        if (w > maxW) maxW = w;
    }
    let tipW = maxW + 20;
    let tipH = lines.length * 18 + 16;

    // Position near mouse, clamped to canvas
    let tipX = mouseX + 14;
    let tipY = mouseY - tipH - 6;

    // Clamp horizontally
    if (tipX + tipW > canvasWidth - 4) {
        tipX = mouseX - tipW - 10;
    }
    if (tipX < 4) tipX = 4;

    // Clamp vertically
    if (tipY < 4) {
        tipY = mouseY + 20;
    }
    if (tipY + tipH > drawHeight - 4) {
        tipY = drawHeight - tipH - 4;
    }

    // Draw tooltip background
    stroke(100);
    strokeWeight(1);
    fill(255, 255, 240, 245);
    rect(tipX, tipY, tipW, tipH, 6);

    // Draw tooltip text
    noStroke();
    fill(30);
    let tx = tipX + 10;
    let ty = tipY + 8;
    for (let i = 0; i < lines.length; i++) {
        // First line (character) in bold-ish larger size
        if (i === 0) {
            textSize(14);
            textStyle(BOLD);
        } else {
            textSize(13);
            textStyle(NORMAL);
        }
        text(lines[i], tx, ty);
        ty += 18;
    }
    textStyle(NORMAL);
}

function drawLegend(lx, ly) {
    let categories = [
        { label: 'A-Z',     clr: colorUppercase },
        { label: 'a-z',     clr: colorLowercase },
        { label: '0-9',     clr: colorDigit },
        { label: 'Symbols', clr: colorSymbol },
        { label: 'Space',   clr: colorSpace }
    ];

    textSize(11);
    textAlign(LEFT, CENTER);
    let swatchSize = 12;
    let gap = 6;

    // Calculate total legend width to center it
    let totalW = 0;
    for (let i = 0; i < categories.length; i++) {
        totalW += swatchSize + 3 + textWidth(categories[i].label) + gap;
    }
    totalW -= gap; // remove trailing gap

    let cx = (canvasWidth - totalW) / 2;
    let cy = ly + 6;

    for (let i = 0; i < categories.length; i++) {
        let cat = categories[i];

        // Swatch
        stroke(140);
        strokeWeight(0.5);
        fill(cat.clr);
        rect(cx, cy - swatchSize / 2, swatchSize, swatchSize, 2);

        // Label
        noStroke();
        fill(50);
        text(cat.label, cx + swatchSize + 3, cy + 1);

        cx += swatchSize + 3 + textWidth(cat.label) + gap;
    }
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);

    // Reposition checkbox
    if (showValuesCheckbox) {
        showValuesCheckbox.position(10, drawHeight + 12);
    }
}

function updateCanvasSize() {
    let mainEl = document.querySelector('main');
    if (mainEl) {
        let containerW = mainEl.getBoundingClientRect().width;
        if (containerW > 0) {
            canvasWidth = containerW;
        }
    }
    canvasHeight = drawHeight + controlHeight;
}
