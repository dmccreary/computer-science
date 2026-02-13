---
title: Tuple vs List Mutability
description: Interactive p5.js MicroSim for tuple vs list mutability.
image: /sims/tuple-vs-list-mutability/tuple-vs-list-mutability.png
og:image: /sims/tuple-vs-list-mutability/tuple-vs-list-mutability.png
twitter:image: /sims/tuple-vs-list-mutability/tuple-vs-list-mutability.png
social:
   cards: false
quality_score: 0
---

# Tuple vs List Mutability

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Tuple vs List Mutability MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This MicroSim compares the same operation on two Python data structures that start with identical values:
- Mutable `list`: `[1, 2, 3]`
- Immutable `tuple`: `(1, 2, 3)`

Students click operation buttons and immediately see the contrast:
- The list updates successfully.
- The tuple remains unchanged and displays the Python error type.

## How to Use

1. Click `Change Item` to attempt index assignment on both structures.
2. Click `Add Item` to attempt append on both structures.
3. Click `Remove Item` to attempt removing the last item on both structures.
4. Observe green success feedback on the list and red error feedback on the tuple.
5. Click `Reset` to restore both to their original state.

## Iframe Embed Code

```html
<iframe src="main.html"
        height="482px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
9-12 (High School Computer Science)

### Duration
10-15 minutes

### Prerequisites
- Basic Python syntax
- Understanding of variables and sequence indexing

### Activities

1. **Prediction** (3 min): Students predict which operations work on list and tuple.
2. **Exploration** (6 min): Students run each operation and record observed outcomes.
3. **Explain** (4 min): Students explain why tuple operations fail using the term "immutable."
4. **Extension** (2 min): Students propose when tuples are preferable to lists.

### Assessment
- Student can explain mutability vs immutability in plain language.
- Student correctly identifies list operations that mutate values.
- Student recognizes tuple operation failures and names the error category.

## References

1. Python Tutorial: Data Structures (lists): https://docs.python.org/3/tutorial/datastructures.html
2. Python Standard Types (tuples): https://docs.python.org/3/library/stdtypes.html#tuple
