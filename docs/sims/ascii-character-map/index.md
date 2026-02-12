---
title: ASCII Character Map
description: Interactive p5.js MicroSim for ascii character map.
image: /sims/ascii-character-map/ascii-character-map.png
og:image: /sims/ascii-character-map/ascii-character-map.png
twitter:image: /sims/ascii-character-map/ascii-character-map.png
social:
   cards: false
quality_score: 0
---

# ASCII Character Map

<iframe src="main.html" height="532px" width="100%" scrolling="no"></iframe>

[Run the ASCII Character Map MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/dmccreary/sketches/Kl3AQRqxQ)

## About This MicroSim

This MicroSim displays all 95 printable ASCII characters (codes 32 through 126) in a color-coded grid. Each character is colored by category — uppercase letters, lowercase letters, digits, symbols, and space — so you can see the structure of the ASCII table at a glance. Hover over any cell to see the character's decimal value, binary representation, category, and (for symbols) its common name.

## How to Use

1. **Hover** over any cell to see a tooltip with the character's decimal code, binary value, category, and name.
2. **Check "Show Decimal Values"** to display the ASCII code number below each character in the grid.
3. **Use the color legend** at the top to identify character categories: blue for uppercase, green for lowercase, orange for digits, purple for symbols, and gray for space.

## Symbol Character Names

| Char | Dec | Name |
|:----:|:---:|------|
| `!`  | 33  | Exclamation mark |
| `"`  | 34  | Double quote |
| `#`  | 35  | Hash / Number sign |
| `$`  | 36  | Dollar sign |
| `%`  | 37  | Percent sign |
| `&`  | 38  | Ampersand |
| `'`  | 39  | Single quote |
| `(`  | 40  | Left parenthesis |
| `)`  | 41  | Right parenthesis |
| `*`  | 42  | Asterisk |
| `+`  | 43  | Plus sign |
| `,`  | 44  | Comma |
| `-`  | 45  | Hyphen / Minus |
| `.`  | 46  | Period / Full stop |
| `/`  | 47  | Forward slash |
| `:`  | 58  | Colon |
| `;`  | 59  | Semicolon |
| `<`  | 60  | Less-than sign |
| `=`  | 61  | Equals sign |
| `>`  | 62  | Greater-than sign |
| `?`  | 63  | Question mark |
| `@`  | 64  | At sign |
| `[`  | 91  | Left square bracket |
| `\`  | 92  | Backslash |
| `]`  | 93  | Right square bracket |
| `^`  | 94  | Caret / Circumflex |
| `_`  | 95  | Underscore |
| `` ` ``  | 96  | Backtick / Grave accent |
| `{`  | 123 | Left curly brace |
| `\|` | 124 | Vertical bar / Pipe |
| `}`  | 125 | Right curly brace |
| `~`  | 126 | Tilde |

## Iframe Embed Code

```html
<iframe src="https://dmccreary.github.io/computer-science/sims/ascii-character-map/main.html"
        height="450px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
9-12 (High School Computer Science)

### Duration
10-15 minutes

### Prerequisites

- Basic understanding of what characters and text are in computing
- Familiarity with the idea that computers store everything as numbers

### Activities

1. **Exploration** (5 min): Have students hover over familiar characters (their initials, favorite punctuation) and note the decimal and binary values. Ask: "What patterns do you notice between uppercase and lowercase letters?"
2. **Guided Practice** (5 min): Toggle "Show Decimal Values" on. Students find the codes for `A`, `a`, `0`, and space. Discuss why uppercase letters start at 65, lowercase at 97, and digits at 48.
3. **Assessment** (5 min): Students answer: "What is the decimal difference between any uppercase letter and its lowercase version?" (Answer: 32.) "Why might the designers have chosen that number?"

### Assessment

- Can the student look up the ASCII code for a given character?
- Can the student identify which category a character belongs to by its code range?
- Can the student explain the relationship between uppercase and lowercase letter codes?

## References

1. [ASCII - Wikipedia](https://en.wikipedia.org/wiki/ASCII)
2. [ASCII Table and Description](https://www.asciitable.com/)
