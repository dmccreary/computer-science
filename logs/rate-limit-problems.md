# Rate Limit Problems During Parallel MicroSim Generation

**Date:** 2026-02-13
**Session:** Chapter 12 — Classes and Objects MicroSim Generation
**Model:** Claude Opus 4.6 via Claude Code CLI

---

## Summary

Six MicroSim generation tasks were launched in parallel for Chapter 12 (Classes and Objects). API rate limits caused 3 of the 6 agents to fail completely and 1 to produce incomplete output. Manual rework was required to finish the job, effectively doubling the effort for half the deliverables.

---

## Task Inventory

The chapter contained 6 `#### Diagram` specification blocks:

| # | sim-id | Type | Bloom Level |
|---|--------|------|-------------|
| 1 | `class-vs-object-diagram` | infographic | Understand (L2) |
| 2 | `instance-vs-class-attributes` | diagram | Understand (L2) |
| 3 | `dog-class-uml-diagram` | diagram | Understand (L2) |
| 4 | `encapsulation-bank-vault` | infographic | Understand (L2) |
| 5 | `dog-class-playground` | microsim | Apply (L3) |
| 6 | `oop-benefits-concept-map` | infographic | Understand (L2) |

Each task was delegated to a separate background agent using the `Task` tool with `subagent_type=general-purpose` and `run_in_background=true`. All 6 were launched simultaneously in a single message.

---

## What Happened

### Phase 1: Parallel Launch (all 6 agents started)

All 6 agents successfully started and began invoking the `/microsim-generator` skill. Each agent:

1. Called the `Skill` tool to load the microsim-generator prompt
2. Read project files (CLAUDE.md, existing sims) for style reference
3. Began generating JS, HTML, index.md, and metadata.json files

### Phase 2: Rate Limits Hit

The Anthropic API rate limit was reached approximately 1-3 minutes into execution. Agents hit the wall at different stages depending on how far along they were:

| Agent | sim-id | Tools Used | Tokens | Duration | Outcome |
|-------|--------|-----------|--------|----------|---------|
| a5fd292 | class-vs-object-diagram | 14 | 50k+ | 159s | **Completed** — all files written before limit hit |
| ad80b44 | instance-vs-class-attributes | 15 | 49k+ | 132s | **Completed** — all files written before limit hit |
| a03f6a3 | dog-class-uml-diagram | 14 | 30k+ | 63s | **Partial** — HTML, index.md, metadata.json written; **JS file missing** |
| adb011a | encapsulation-bank-vault | 18 | 64k+ | 136s | **Completed** — all files written before limit hit |
| aed028d | dog-class-playground | 15 | 20k+ | 43s | **Failed** — no directory or files created |
| a7a4c8c | oop-benefits-concept-map | 6 | 0 | 31s | **Failed** — no directory or files created |

All 6 agents eventually returned the same error message:
```
You've hit your limit · resets Feb 18 at 7am (America/Chicago)
```

### Phase 3: Assessment

After all agents completed/failed, a manual audit revealed:

- **3 fully complete:** class-vs-object-diagram, instance-vs-class-attributes, encapsulation-bank-vault
- **1 partially complete:** dog-class-uml-diagram (missing the most critical file — the JavaScript)
- **2 completely missing:** dog-class-playground, oop-benefits-concept-map

---

## Rework Required

### Task 3: dog-class-uml-diagram — Missing JS File

**What the agent had done:** Created the HTML shell, index.md boilerplate, and metadata.json. But the agent ran out of API budget before writing the actual `dog-class-uml-diagram.js` file — the only file that matters for the visualization.

**What the boilerplate contained:** The index.md and metadata.json were filled with template placeholders like "TODO: Describe what this MicroSim demonstrates" and `"subject": "High School Geometry"` (wrong subject — should be Computer Science). The agent got far enough to scaffold but not far enough to customize.

**Rework:** The entire JavaScript file (~250 lines) had to be written from scratch by the parent agent. This included:
- UML three-section box layout (header, attributes, methods)
- Hover detection for each attribute and method row
- Tooltip system with word-wrapping
- "Show Code" toggle button with syntax-highlighted code panel
- Responsive layout logic
- Color-coded type tags (class attribute vs. instance attribute)

**Effort:** This was the equivalent of a full microsim generation — reading the spec, studying existing sims for style consistency, and writing the complete implementation.

### Task 5: dog-class-playground — Completely Missing

**What the agent had done:** Nothing. The directory didn't exist. The agent likely loaded the skill prompt and then immediately hit the rate limit.

**Rework:** All 4 files had to be created from scratch:
- `dog-class-playground.js` (~230 lines) — the most complex of all 6 sims
  - Input form with p5.js `createInput()` and `createButton()`
  - Dog card rendering system with per-card method buttons
  - 5 method simulations (bark, birthday, describe, __str__, __repr__)
  - Scrollable kennel area with clipping
  - Output console with colored messages
  - Validation logic matching the Python class
  - Dog count badge
- `main.html` — standard HTML wrapper
- `index.md` — full lesson plan with usage instructions
- `metadata.json` — educational metadata with learning objectives

**Effort:** Full microsim generation plus all supporting files. This was the most complex sim in the set due to the number of interactive elements (input fields, multiple button types per card, console output).

### Task 6: oop-benefits-concept-map — Completely Missing

**What the agent had done:** Nothing. Only 6 tool calls and 0 tokens consumed — the agent barely started before the limit hit.

**Rework:** All 4 files had to be created from scratch:
- `oop-benefits-concept-map.js` (~300 lines) — dual-layout concept map
  - Star layout for wide screens (5 nodes orbiting a center)
  - Vertical list layout for narrow screens
  - Hover tooltip system with word-wrapped explanations
  - Click-to-select with code highlighting panel
  - Syntax-colored code snippet with per-benefit line highlighting
  - Responsive layout switching at 480px breakpoint
- `main.html` — standard HTML wrapper
- `index.md` — full lesson plan
- `metadata.json` — educational metadata

**Effort:** Full microsim generation plus all supporting files.

---

## Cost Analysis

### Without Rate Limits (ideal scenario)
- 6 parallel agents, each generating 1 microsim autonomously
- Parent agent: minimal coordination (~5 tool calls)
- Total human wait time: ~2-3 minutes (parallel execution)

### With Rate Limits (actual scenario)
- 6 parallel agents launched → 3 succeeded, 1 partial, 2 failed
- Parent agent had to:
  1. Audit all 6 directories to assess damage (3 tool calls)
  2. Read existing completed sims for style reference (2 tool calls)
  3. Read the partial sim's scaffolding files (3 tool calls)
  4. Write 1 missing JS file from scratch (1 write)
  5. Create 2 complete sim directories (2 mkdir)
  6. Write 8 files from scratch (8 writes)
  7. Final verification audit (1 tool call)
- Total parent agent effort: ~20 tool calls + writing ~780 lines of JavaScript
- Total human wait time: ~10+ minutes (parallel phase + serial rework phase)

### Rework Ratio
- **50% of deliverables** required full manual rework
- **Lines of JS written by agents:** ~1,350 (3 complete sims × ~450 avg)
- **Lines of JS written manually in rework:** ~780 (3 sims)
- **Rework was ~37% of total JS output**

---

## Observations

1. **Rate limits are non-deterministic in their impact.** All 6 agents started at the same time, but they hit the wall at different completion stages. The agents that happened to write their JS files first survived; those that scaffolded metadata first lost everything meaningful.

2. **Partial completion is almost worse than total failure.** The dog-class-uml-diagram agent created boilerplate files with wrong metadata (Geometry instead of Computer Science, TODO placeholders everywhere) but missed the actual JavaScript. The parent agent had to understand what existed, decide what to keep vs. fix, and then write the JS — arguably more cognitive overhead than starting fresh.

3. **The most complex sim failed.** dog-class-playground was the hardest of the 6 (Apply-level Bloom's, multiple input types, card system, console). It required the most tokens to generate and was therefore most likely to be interrupted. This is a worst-case pattern: rate limits disproportionately affect the tasks that need the most resources.

4. **Agent token consumption was highly variable.** The successful agents used 50k-64k tokens each. The failed agents used 0-20k tokens. With 6 agents competing for the same rate limit bucket, the early finishers consumed budget that later agents needed.

5. **No graceful degradation.** When an agent hits the rate limit, it simply stops. There's no checkpoint, no partial save of in-progress file writes, and no way to resume from where it left off. The `resume` parameter on the Task tool could theoretically help, but the rate limit applies to the entire account, not per-agent.

---

## Recommendations

1. **Stagger parallel launches** instead of launching all at once. A 30-second delay between agents would spread token consumption and reduce the chance of simultaneous rate limit hits.

2. **Prioritize by complexity.** Launch the hardest sims first so they get the most runway before limits hit. In this case, dog-class-playground should have launched first.

3. **Reduce parallelism near rate limits.** If the account is approaching its limit, launch 2-3 agents instead of 6. Better to complete 3/3 than 3/6.

4. **Write JS files first.** The microsim-generator skill should prioritize writing the JavaScript file before scaffolding metadata and index.md. The JS is the irreplaceable artifact; everything else is boilerplate that's quick to regenerate.

5. **Check rate limit headroom before launching.** If there's a way to query remaining API budget, do so before spawning N parallel agents that will each consume 50k+ tokens.
