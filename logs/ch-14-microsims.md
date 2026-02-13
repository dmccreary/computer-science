# Chapter 14 MicroSim Generation Log

**Skill:** microsim-generator (batch mode, sequential)
**Model:** Claude Opus 4.6
**Date:** 2026-02-13
**Chapter:** 14-errors-and-exceptions

## Timing

| Metric | Value |
|--------|-------|
| Session Start | 2026-02-13 ~15:04 |
| Session End | 2026-02-13 16:16 |
| Total Elapsed Time | ~72 minutes |
| Execution Mode | Sequential (as requested) |
| Sims Generated | 6 |
| Avg Time Per Sim | ~5 minutes (JS write + screenshot) |

Note: Session included a context window compaction between sims 3 and 4
(~15:10 to ~16:08). Actual generation time excluding compaction was ~24 minutes.

### Per-MicroSim Timing (from file timestamps)

| # | sim-id | JS Written | Screenshot | Elapsed |
|---|--------|-----------|------------|---------|
| 1 | error-type-identifier | 15:07:08 | 15:07:17 | ~3 min (includes setup/scaffold) |
| 2 | error-types-comparison | 15:08:16 | 16:07:11 | ~1 min write (screenshot after compaction) |
| 3 | exception-hierarchy | 16:08:07 | 16:08:17 | ~1 min (post-compaction) |
| 4 | try-except-builder | 16:11:13 | 16:11:22 | ~3 min |
| 5 | try-except-flow | 16:12:40 | 16:12:47 | ~1.5 min |
| 6 | exception-handling-sim | 16:13:53 | 16:14:00 | ~1 min |
| — | Post-generation steps | — | 16:16 | ~2 min |

## Token Estimates

Output volume estimated from JS file sizes (1 token ~ 4 characters of code):

| # | sim-id | JS Bytes | JS Lines | Est. Output Tokens (JS only) |
|---|--------|----------|----------|------------------------------|
| 1 | error-type-identifier | 9,505 | 376 | ~2,376 |
| 2 | error-types-comparison | 9,723 | 325 | ~2,431 |
| 3 | exception-hierarchy | 10,134 | 303 | ~2,534 |
| 4 | try-except-builder | 12,152 | 478 | ~3,038 |
| 5 | try-except-flow | 15,457 | 582 | ~3,864 |
| 6 | exception-handling-sim | 13,298 | 464 | ~3,325 |
| **Total** | | **70,269** | **2,528** | **~17,567** |

### Session-Level Token Estimate

| Category | Est. Tokens |
|----------|-------------|
| Input (chapter content, skill docs, p5 guide, templates, compaction summary) | ~15,000 |
| Output (JS files, tool calls, planning text, messages) | ~28,000 |
| Total session (input + output) | ~43,000 |

Note: This session included reading the chapter (1,013+ lines), the p5-guide,
three previously-generated sims (for pattern reference after compaction),
plus scaffolding/validation/iframe-insertion tool calls. The JS output alone
accounts for 2,528 lines across 6 files.

## Workflow Steps Completed

| Step | Tool/Script | Result |
|------|-------------|--------|
| 0 | Set UTILS and PROJECT paths | Found utils at `~/Documents/ws/claude-skills/src/microsim-utils/` |
| 0 | `git pull` on claude-skills | Already up to date |
| 1 | `extract-sim-specs.py` | Sim-ids mismatched heading text; manually wrote corrected `/tmp/ch14-specs.json` |
| 2 | `generate-sim-scaffold.py` | Scaffolded 6 directories (main.html, index.md, metadata.json) |
| 3-4 | Sequential .js file generation | All 6 implemented with instructional design checkpoint per sim |
| 8 | `bk-capture-screenshot` | All 6 screenshots captured (24K–48K each) |
| 5 | `add-iframes-to-chapter.py` | Script found no changes (headings inside `<details>`) — iframes added manually |
| 6 | `validate-sims.py` | All 6 scored 98–100, grade A |
| 7 | `update-mkdocs-nav.py` | Updated mkdocs.yml with 78 total MicroSim entries |

## MicroSims Generated

| # | sim-id | Type | Bloom Level | Lines | Bytes | Score | Grade |
|---|--------|------|-------------|-------|-------|-------|-------|
| 1 | error-type-identifier | MicroSim | Apply (L3) | 376 | 9,505 | 98 | A |
| 2 | error-types-comparison | Infographic | Understand (L2) | 325 | 9,723 | 100 | A |
| 3 | exception-hierarchy | Infographic | Remember (L1) | 303 | 10,134 | 100 | A |
| 4 | try-except-builder | MicroSim | Apply (L3) | 478 | 12,152 | 98 | A |
| 5 | try-except-flow | Infographic | Understand (L2) | 582 | 15,457 | 98 | A |
| 6 | exception-handling-sim | MicroSim | Analyze (L4) | 464 | 13,298 | 98 | A |

## Files Created

```
docs/sims/error-type-identifier/
├── main.html (scaffolded)
├── index.md (scaffolded)
├── metadata.json (scaffolded)
├── error-type-identifier.js (376 lines)
└── error-type-identifier.png (24K screenshot)

docs/sims/error-types-comparison/
├── main.html (scaffolded)
├── index.md (scaffolded)
├── metadata.json (scaffolded)
├── error-types-comparison.js (325 lines)
└── error-types-comparison.png (48K screenshot)

docs/sims/exception-hierarchy/
├── main.html (scaffolded)
├── index.md (scaffolded)
├── metadata.json (scaffolded)
├── exception-hierarchy.js (303 lines)
└── exception-hierarchy.png (45K screenshot)

docs/sims/try-except-builder/
├── main.html (scaffolded)
├── index.md (scaffolded)
├── metadata.json (scaffolded)
├── try-except-builder.js (478 lines)
└── try-except-builder.png (29K screenshot)

docs/sims/try-except-flow/
├── main.html (scaffolded)
├── index.md (scaffolded)
├── metadata.json (scaffolded)
├── try-except-flow.js (582 lines)
└── try-except-flow.png (43K screenshot)

docs/sims/exception-handling-sim/
├── main.html (scaffolded)
├── index.md (scaffolded)
├── metadata.json (scaffolded)
├── exception-handling-sim.js (464 lines)
└── exception-handling-sim.png (31K screenshot)
```

**Total:** 30 files created (6 x 5 files per sim)

## MicroSim Descriptions

### 1. Error Type Identifier (Apply L3)
Classification quiz with 10 shuffled code snippets. Students read code displayed in a dark code box with syntax highlighting (comments in green) and classify each as Syntax Error (red button), Runtime Error (orange button), or Logic Error (yellow button). Immediate feedback with explanation of why each snippet is that error type. Score tracker at top right. End screen with percentage and performance message. "Next Question" and "Restart Quiz" buttons.

### 2. Three Types of Errors Comparison (Understand L2)
Three-column comparison chart: Syntax Error (red), Runtime Error (orange), Logic Error (yellow). Four rows per column: When (timing), Python Says (feedback), Example (code snippet), How to Fix (strategy). Hover any cell for a tooltip with additional detail text and a second example. Click column headers to highlight/select entire column. Rounded corners on headers and bottom cells for polished appearance.

### 3. Python Exception Hierarchy (Remember L1)
Interactive tree diagram of Python's built-in exception classes. Root: BaseException. Level 1: Exception, KeyboardInterrupt, SystemExit. Level 2: ArithmeticError, LookupError, TypeError, ValueError, OSError, NameError, AttributeError. Level 3: ZeroDivisionError, OverflowError, IndexError, KeyError, FileNotFoundError. Color-coded branches (arithmetic=red, lookup=orange, type=purple, os=green). Hover any node for description/example tooltip. Click to highlight the full inheritance chain up to BaseException with colored edges.

### 4. Try-Except Block Builder (Apply L3)
Drag-and-drop code builder with 3 rounds (Safe Input, Safe List Access, Safe File Read). Code bank at bottom contains shuffled code cards. Two drop zones above: blue-tinted "try:" zone and red-tinted "except [Type]:" zone. Drag cards from bank into the correct zone. Drop zones highlight when a card hovers over them. "Check" button validates placement. Correct answer unlocks "Run Code" which shows simulated success/error output in a dark console. "Next Round" advances. Score tracker.

### 5. Try-Except-Finally Flow Chart (Understand L2)
Animated flowchart: Start → try block → Exception? (diamond) → Yes: except block / No: else block → finally block → End. Two buttons: "Simulate Success" and "Simulate Error". Clicking either starts step-through mode with "Next Step" button. Gold animated dot travels node-to-node along the active path. Active nodes fill with their color (try=blue, except=red, else=green, finally=purple). Code panel on the right shows Python code with current lines highlighted in yellow. Output panel accumulates printed output. Step description box at bottom explains what happens at each node. Progress dots show advancement.

### 6. Exception Handling Simulator (Analyze L4)
Step-by-step code execution simulator with prediction questions. Left panel: dark code editor with line numbers and color-coded status (green=executed, red=exception raised, gray=skipped). Right panel: output console. Scenario selector dropdown with 4 scenarios: Basic try-except, No exception (with else), Multiple except blocks, Raising exceptions. "Step" button advances one line. Before each step, students must predict: "Executes normally" (green), "Raises exception" (red), or "Skipped" (gray). Immediate feedback. Score tracker. Status icons next to completed lines. Legend at bottom.

## Instructional Design Decisions

| sim-id | Bloom | Decision |
|--------|-------|----------|
| error-type-identifier | Apply (L3) | Quiz with classification — students apply error type knowledge to code snippets |
| error-types-comparison | Understand (L2) | Hover-to-reveal comparison chart — supports explanation and comparison |
| exception-hierarchy | Remember (L1) | Reference diagram with hover tooltips — supports identification and recall |
| try-except-builder | Apply (L3) | Drag-and-drop construction — students build try-except blocks from components |
| try-except-flow | Understand (L2) | Step-through flowchart — traces execution path, no continuous animation |
| exception-handling-sim | Analyze (L4) | Prediction-before-reveal execution — metacognitive tracing and prediction |

## Issues Encountered

### 1. Sim-ID Mismatch in extract-sim-specs.py
The `extract-sim-specs.py` script generated sim-ids from heading text (e.g., `three-types-of-errors`) instead of the `**sim-id:**` fields in the chapter spec (e.g., `error-types-comparison`). This happened because chapter 14 puts `#### Diagram:` headings INSIDE `<details>` blocks, unlike chapter 13 where they are outside.

**Fix:** Manually wrote a corrected `/tmp/ch14-specs.json` with the proper sim-ids.

### 2. Missing Iframes in Chapter
Chapter 14 had NO `<iframe>` tags — the `#### Diagram:` headings were nested inside `<details>` blocks with no iframe embeds. The `add-iframes-to-chapter.py` script reported "no changes needed" because it couldn't find the expected pattern.

**Fix:** Manually added 6 `<iframe>` tags before each `<details>` block with correct relative paths (`../../sims/<sim-id>/main.html`) and heights matching canvas dimensions + 2px.

### 3. Context Window Compaction
The session hit context limits between sim 3 (exception-hierarchy) and sim 4 (try-except-builder). The compaction summary preserved all necessary state, and generation resumed seamlessly. Three completed JS files were re-read after compaction to verify patterns.

## Validation Notes

- All 6 MicroSims scored 98-100/100 (Grade A)
- 2-point deductions on 4 sims for using p5.js DOM functions (createButton, createSelect) — informational only, these are standard p5.js controls per CLAUDE.md
- error-types-comparison and exception-hierarchy scored 100 (no DOM controls used)
- All screenshots captured successfully via `bk-capture-screenshot`
- All 6 iframes manually inserted into chapter index.md with correct relative paths
- Navigation updated to 78 total MicroSims across the textbook
- No runtime errors observed in any screenshots

## Notes

- This was the first chapter 14 MicroSim batch run
- Sequential execution was used as requested (no parallel agents)
- The largest sim by code volume was try-except-flow (582 lines, 15.5KB) — most complex due to animated flowchart with code panel, output panel, and step descriptions
- The smallest sim was exception-hierarchy (303 lines, 10.1KB) — tree diagram with hover tooltips
- All sims use standard p5.js builtin controls (no manual drawing of UI elements)
- All sims are width-responsive with `updateCanvasSize()` pattern
- Chapter 14's `<details>` structure differs from chapter 13, requiring manual iframe insertion
