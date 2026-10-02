---
title: Python Collections Overview
description: Interactive p5.js 2x2 matrix that organizes list, tuple, set, and frozenset by ordered vs unordered and mutable vs immutable, with hover details, code examples, and a classification quiz.
image: /sims/python-collections-overview/python-collections-overview.png
og:image: /sims/python-collections-overview/python-collections-overview.png
twitter:image: /sims/python-collections-overview/python-collections-overview.png
social:
   cards: false
quality_score: 100
---

# Python Collections Overview

<iframe src="main.html" height="522px" width="100%" scrolling="no"></iframe>

[Run the Python Collections Overview MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Python gives you four core collection types, and at first they can blur together. This MicroSim sorts them out with just two questions:

- **Does it keep its items in order?** (the columns: ordered vs unordered)
- **Can you change it after you make it?** (the rows: mutable vs immutable)

Answer those two questions and you land on exactly one card:

| | Ordered | Unordered |
|---|---|---|
| **Mutable** | List | Set |
| **Immutable** | Tuple | Frozenset |

The pictures on the cards carry the same message. Ordered types are drawn as boxes with position badges (0, 1, 2, 3), and the repeated 7 reminds you that duplicates are welcome. Unordered types are a loose handful of unique marbles with no positions at all. A lock marks the two types you can't change.

## How to Use

1. **Hover** over a card. The panel below the matrix shows its syntax, whether it allows duplicates, whether you can index it, whether it can be a dictionary key, and what it's best for.
2. **Click** a card to open it and see short code examples, including the errors you get when you try something that type doesn't allow. Click anywhere to close it.
3. Press **Quiz Me**. You'll get 12 questions in random order. Some name a pair of properties ("ordered and immutable") and some describe a real situation ("a playlist that users reorder"). Click the card that fits.
4. A wrong pick gives you a hint and lets you try again. Your score counts the questions you got right on the first try.
5. Press **Back to Explore** any time to review the cards.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/computer-science/sims/python-collections-overview/main.html"
        height="522px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
9-12 (High School Computer Science)

### Duration
10-15 minutes

### Prerequisites
- Lists: creating, indexing, and changing items
- Tuples and sets from earlier in this chapter
- The idea of mutable vs immutable objects
- Dictionary keys must be immutable (hashable)

### Learning Objective
Students will be able to classify Python's four core collection types (list, tuple, set, frozenset) by their properties and select the appropriate type for a given scenario. (Bloom's level: Analyze)

### Activities

1. **Explore** (4 min): Students hover over all four cards and fill in a quick table of their own: duplicates allowed? indexable? can be a dictionary key?
2. **Compare** (3 min): Ask, "What do the two cards in the bottom row have in common that the top row doesn't?" (Both are immutable, and both can be dictionary keys.) Then repeat for the two columns.
3. **Classify** (5 min): Students press Quiz Me and work through all 12 questions, aiming for at least 10 correct on the first try.
4. **Justify** (3 min): Each student invents one new scenario, trades with a partner, and explains which card it belongs on and why.

### Assessment
- Student places each of the four types in the correct quadrant from memory.
- Student scores at least 10 of 12 on the first try in the quiz.
- Student can explain why tuples and frozensets can be dictionary keys but lists and sets cannot.
- Student can justify a collection choice for a new scenario using the words ordered, mutable, and duplicates.

## References

1. Python Tutorial - Data Structures: https://docs.python.org/3/tutorial/datastructures.html
2. Python Built-in Types - Sequence Types (list, tuple): https://docs.python.org/3/library/stdtypes.html#sequence-types-list-tuple-range
3. Python Built-in Types - Set Types (set, frozenset): https://docs.python.org/3/library/stdtypes.html#set-types-set-frozenset
4. Python Glossary - hashable: https://docs.python.org/3/glossary.html#term-hashable
