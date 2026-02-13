---
title: Removing Duplicates with a Set
description: Animated p5.js MicroSim that demonstrates how converting a list to a set removes duplicates, then converts back to a unique list.
image: /sims/removing-duplicates/removing-duplicates.png
og:image: /sims/removing-duplicates/removing-duplicates.png
twitter:image: /sims/removing-duplicates/removing-duplicates.png
social:
   cards: false
quality_score: 90
---

# Removing Duplicates with a Set

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the Removing Duplicates with a Set MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This simulation shows a list being processed one value at a time. Each value moves toward a set container:

- New values are accepted into the set (green glow)
- Duplicate values bounce away (red glow and message)

After all steps are complete, clicking **Convert to List** copies the set values into an output list with duplicates removed.

## How to Use

1. Click **Step** to process one element at a time.
2. Click **Auto Play** to animate the entire process automatically.
3. Click **Reset** to restart with the current input list.
4. Enter your own comma-separated values and click **Apply Input**.
5. After all items are processed, click **Convert to List**.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/computer-science/sims/removing-duplicates/main.html"
        height="602px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
9-12 (High School Computer Science)

### Duration
10-15 minutes

### Prerequisites
- Lists (arrays) and element order
- Basic understanding of sets and uniqueness

### Activities

1. **Predict** (3 min): Ask students which values they expect to remain after duplicate removal.
2. **Explore** (6 min): Students step through each value and explain why entries are accepted or rejected.
3. **Apply** (4 min): Students test custom input lists and verify output uniqueness.

### Assessment

- Student correctly explains why duplicates are rejected by a set.
- Student predicts final unique output before pressing **Convert to List**.
- Student uses custom input and interprets the resulting output list.

## References

1. Python Documentation: `set` type and uniqueness behavior.
2. Intro CS data structures texts on lists vs sets.
