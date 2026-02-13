---
title: Dog Class Interactive Playground
description: Interactive p5.js MicroSim for creating Dog objects and calling methods.
image: /sims/dog-class-playground/dog-class-playground.png
og:image: /sims/dog-class-playground/dog-class-playground.png
twitter:image: /sims/dog-class-playground/dog-class-playground.png
social:
   cards: false
quality_score: 0
---

# Dog Class Interactive Playground

<iframe src="main.html" height="600px" width="100%" scrolling="no"></iframe>

[Run the Dog Class Playground MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This interactive playground lets you create Dog objects by entering a name, breed, and age. Each dog appears as a card in the "kennel" area with buttons to call methods like bark(), describe(), birthday(), print (__str__), and repr (__repr__). All output appears in the console below.

## How to Use

1. Enter a dog's name, breed, and age in the input fields at the top
2. Click "Create Dog" to add a new Dog object to the kennel
3. Click method buttons on any dog card to see the output in the console
4. Notice how "Birthday" changes the dog's age on the card

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/computer-science/sims/dog-class-playground/main.html"
        height="600px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
9-12 (High School Computer Science)

### Duration
10-15 minutes

### Prerequisites
Understanding of classes, objects, constructors, and methods from Chapter 12.

### Activities

1. **Exploration** (5 min): Create several dogs and experiment with each method button.
2. **Guided Practice** (5 min): Predict what each method will output before clicking.
3. **Assessment** (5 min): Explain the difference between __str__ and __repr__ output.

### Assessment
Students can explain how creating a Dog object calls __init__, and how each method operates on that specific object's data.

## References

1. [Python Classes - Python Documentation](https://docs.python.org/3/tutorial/classes.html)
