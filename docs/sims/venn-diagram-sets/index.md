---
title: Set Operations with Venn Diagrams
description: Interactive p5.js MicroSim for set operations with venn diagrams.
image: /sims/venn-diagram-sets/venn-diagram-sets.png
og:image: /sims/venn-diagram-sets/venn-diagram-sets.png
twitter:image: /sims/venn-diagram-sets/venn-diagram-sets.png
social:
   cards: false
quality_score: 0
---

# Set Operations with Venn Diagrams

<iframe src="main.html" height="590px" width="100%" scrolling="no"></iframe>

[Run the Set Operations with Venn Diagrams MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim connects visual Venn diagram regions to Python set operations. Students can:
- Edit Set A and Set B values
- Select an operation (`Union`, `Intersection`, `Difference (A-B)`, `Symmetric Difference`)
- See the matching region highlighted
- Read the exact Python-style result expression

## How to Use

1. Start with the default sets:
   `A = {'apple', 'banana', 'cherry', 'date'}`
   `B = {'cherry', 'date', 'elderberry', 'fig'}`
2. Click an operation button to highlight the corresponding Venn region.
3. Observe bold items in highlighted regions and dimmed items outside the result.
4. Add or remove values using the Set A / Set B input controls.
5. Click `Swap A and B` and compare how `A - B` changes.
6. Use the code panel to verify the Python operator and computed result.

## Iframe Embed Code

```html
<iframe src="main.html"
        height="592px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
9-12 (High School Computer Science / Discrete Math)

### Duration
10-15 minutes

### Prerequisites
- Basic understanding of sets and membership
- Familiarity with Python literals and operators
- Difference between ordered sequences and mathematical sets

### Activities

1. **Predict** (3 min): Students predict which region each operation should select.
2. **Demonstrate** (6 min): Students run all four operations and compare visual highlights with code output.
3. **Compute** (4 min): Students modify set contents and recompute results.
4. **Reflect** (2 min): Students explain why swapping sets changes `A - B`.

### Assessment
- Student correctly computes all four operations from the displayed sets.
- Student can explain visual region mapping to `|`, `&`, `-`, and `^`.
- Student can justify the effect of swapping A and B on difference.

## References

1. Python set types and operations: https://docs.python.org/3/library/stdtypes.html#set-types-set-frozenset
2. Python tutorial - sets: https://docs.python.org/3/tutorial/datastructures.html#sets
3. Set theory basics (union/intersection/difference): https://en.wikipedia.org/wiki/Set_(mathematics)
