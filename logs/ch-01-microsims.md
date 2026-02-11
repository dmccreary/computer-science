# Chapter 1 MicroSim Generation Log

**Skill:** microsim-generator (batch mode)
**Date:** 2026-02-11
**Chapter:** 01-intro-to-computer-science

## Timing

| Metric | Value |
|--------|-------|
| Start Time | ~2026-02-11 01:42 |
| End Time | ~2026-02-11 01:47 |
| Elapsed Time | ~5 minutes |
| Execution Mode | Parallel (5 agents) |

## Workflow Steps Completed

| Step | Tool/Script | Result |
|------|-------------|--------|
| 0 | Set UTILS and PROJECT paths | Found utils at `~/Documents/ws/claude-skills/src/microsim-utils/` |
| 1 | `extract-sim-specs.py` | Extracted 5 specs to `/tmp/ch01-specs.json` |
| 2 | `generate-sim-scaffold.py --force` | Scaffolded 5 directories (main.html, index.md, metadata.json) |
| 3-4 | Parallel agents wrote .js files | All 5 implemented successfully |
| 5 | `add-iframes-to-chapter.py` | No changes needed (iframes already correct) |
| 6 | `validate-sims.py` | All 5 scored grade A (avg 93.4) |
| 7 | `update-mkdocs-nav.py` | Updated mkdocs.yml with 5 entries |

## MicroSims Generated

| # | sim-id | Type | Library | Bloom Level | Lines | Score | Grade |
|---|--------|------|---------|-------------|-------|-------|-------|
| 1 | computational-thinking-pillars | Infographic | p5.js | Understand (L2) | 424 | 95 | A |
| 2 | inside-a-computer | Diagram | p5.js | Remember (L1) | 538 | 93 | A |
| 3 | binary-number-explorer | MicroSim | p5.js | Apply (L3) | 284 | 93 | A |
| 4 | ascii-character-map | Infographic | p5.js | Remember (L1) | 301 | 93 | A |
| 5 | compiled-vs-interpreted | MicroSim | p5.js | Understand (L2) | 455 | 93 | A |

## Files Created

```
docs/sims/computational-thinking-pillars/
├── main.html
├── index.md
├── metadata.json
└── computational-thinking-pillars.js (424 lines)

docs/sims/inside-a-computer/
├── main.html
├── index.md
├── metadata.json
└── inside-a-computer.js (538 lines)

docs/sims/binary-number-explorer/
├── main.html
├── index.md
├── metadata.json
└── binary-number-explorer.js (284 lines)

docs/sims/ascii-character-map/
├── main.html
├── index.md
├── metadata.json
└── ascii-character-map.js (301 lines)

docs/sims/compiled-vs-interpreted/
├── main.html
├── index.md
├── metadata.json
└── compiled-vs-interpreted.js (455 lines)
```

## MicroSim Descriptions

### 1. Computational Thinking Pillars
Interactive concept map with central "Computational Thinking" node and four pillar nodes (Decomposition, Pattern Recognition, Abstraction, Algorithms) arranged in a diamond pattern. Hover reveals tooltips with definitions, analogies, and computing examples. Click triggers glow animation on connecting lines. Nodes pulse gently on mouse hover.

### 2. Inside a Computer
Block diagram showing CPU (gold), RAM (blue), Storage (green), Input Devices (purple), and Output Devices (orange) with directional arrows. Each component has simplified icons (chip with pins, memory stick, SSD, keyboard/mouse/mic, monitor/speaker/printer). Hover shows tooltip with description and analogy. Click highlights connected arrows. "Show Data Flow" button animates red dots along arrows.

### 3. Binary Number Explorer
Eight large clickable bit circles (MSB to LSB) with place value labels (128 to 1). Toggle bits on/off to see real-time binary string, decimal equivalent, and calculation breakdown. Three buttons: Random (randomize bits), Reset (all zeros), Challenge Mode (target a decimal number and match it). Green glow on active bits, congratulations message on challenge completion.

### 4. ASCII Character Map
Color-coded 16x6 grid of printable ASCII characters (codes 32-126). Categories: uppercase (blue), lowercase (green), digits (orange), symbols (purple), space (gray). Hover tooltip shows character, decimal value, 8-bit binary, and category. "Show Decimal Values" checkbox toggles decimal codes below each character. Centered legend row.

### 5. Compiled vs. Interpreted Languages
Split-screen step-through comparison with 3-stage pipelines (Source Code → Translation → Output). Compiled side translates all lines at once (finishes at step 3), interpreted side translates one line at a time (finishes at step 7). Step/Auto Play/Reset buttons plus speed slider. Yellow highlights on active source lines, pulsing blue arrows, machine code display on compiled side.

## Validation Notes

- All 5 MicroSims missing screenshot PNGs (expected — created manually)
- DOM function warnings for `createButton()`, `createSlider()`, `createCheckbox()` are informational only (standard p5.js controls)
- All iframes in chapter index.md were already correctly configured

## Next Steps

- [ ] Take screenshots for each MicroSim (.png files)
- [ ] Test all 5 MicroSims with `mkdocs serve`
- [ ] Verify responsive behavior at different widths
- [ ] Review tooltip positioning and readability
