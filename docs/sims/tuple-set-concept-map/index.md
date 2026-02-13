---
title: Tuple and Set Concept Map
description: Interactive p5.js concept map that helps students relate tuples, sets, frozensets, and lists through shared and distinct properties.
image: /sims/tuple-set-concept-map/tuple-set-concept-map.png
og:image: /sims/tuple-set-concept-map/tuple-set-concept-map.png
twitter:image: /sims/tuple-set-concept-map/tuple-set-concept-map.png
social:
   cards: false
quality_score: 92
---

# Tuple and Set Concept Map

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Tuple and Set Concept Map MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This concept map shows how **List**, **Tuple**, **Set**, and **Frozenset** relate through core properties:

- ordered vs unordered
- mutable vs immutable
- duplicates allowed vs unique elements
- can be used as dictionary keys

Set operation nodes (union, intersection, difference, symmetric difference) connect to set-based types.

## How to Use

1. Hover over any collection node to highlight all connected properties.
2. Hover over a property node to highlight all collection types that share it.
3. Hover over set operation nodes to highlight set-based connections.
4. Click a collection node to open a code example tooltip.
5. Click outside collection nodes to close the tooltip.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/computer-science/sims/tuple-set-concept-map/main.html"
        height="552px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
9-12 (High School Computer Science)

### Duration
10-15 minutes

### Prerequisites
- Basic Python collection literals (`[]`, `()`, `{}`)
- Introductory understanding of mutability and ordering

### Activities

1. **Observe** (3 min): Students hover nodes and describe highlighted patterns.
2. **Relate** (6 min): Students compare two collection types and summarize similarities/differences.
3. **Summarize** (4 min): Students explain why immutable types can be dictionary keys.

### Assessment

- Student correctly identifies which types are mutable/immutable.
- Student summarizes why sets remove duplicates.
- Student relates set operations to set-based collection types.

## References

1. Python Standard Library docs for list, tuple, set, and frozenset.
2. Intro CS materials on mutable vs immutable data structures.
