---
title: Class vs. Object Visual
description: Interactive p5.js MicroSim for class vs. object visual.
image: /sims/class-vs-object-diagram/class-vs-object-diagram.png
og:image: /sims/class-vs-object-diagram/class-vs-object-diagram.png
twitter:image: /sims/class-vs-object-diagram/class-vs-object-diagram.png
social:
   cards: false
quality_score: 0
---

# Class vs. Object Visual

<iframe src="main.html" height="450px" width="100%" scrolling="no"></iframe>

[Run the Class vs. Object Visual MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This infographic-style MicroSim shows a Dog class as a blue cookie cutter on the left and multiple Dog objects as decorated cookies on the right. The shared template lists common attributes and methods, while arrows labeled “instantiation” show how every dog object is pressed from the same blueprint. Hover and creation interactions reinforce the difference between structure and instance data.

## How to Use

1. Hover over the Dog class to highlight the shared structure every dog receives (attributes + methods).
2. Hover over any cookie to spotlight that object’s unique attribute values (name, breed, age).
3. Click **Create New Dog** to watch a new cookie animate from the class, complete with randomly generated attributes and sprinkle colors.
4. On narrow screens, scroll vertically to compare the blueprint and cookies stacked in a single column.

## Iframe Embed Code

```html
<iframe src="main.html"
        height="450px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
9-12 (Intro to Computer Science)

### Duration
10-15 minutes

### Prerequisites
- Students have seen a basic Python (or Java) class definition.
- Students understand that attributes store data and methods describe behaviors.
- Students can read simple diagrams and hover tooltips.

### Activities

1. **Exploration** (5 min): Students freely hover on the class and each cookie, capturing in their notes what is shared and what changes per object.
2. **Guided Practice** (5 min): As a class, generate two additional dogs and narrate the instantiation process, connecting the on-screen animation to Python code (`Dog(...)`).
3. **Assessment** (5 min): In pairs, students explain which pieces of information belong in the class definition versus the constructor call for one of the cookies.

### Assessment
- Students can articulate that attributes/methods live on the class and values live on each object.
- Students can describe the instantiation arrow as “calling the class to create an object”.
- Optional exit ticket: sketch their own class/object pair using a different real-world analogy.

## References

1. Runestone Academy, “Classes and Objects,” *Problem Solving with Algorithms and Data Structures*, 2024.
2. Oracle, “Defining Classes,” *Java Tutorials*, Oracle University, 2023.
