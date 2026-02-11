---
title: Control Flow
description: Conditional statements, loops, break and continue, and common iteration patterns in Python.
generated_by: claude skill chapter-content-generator
date: 2026-02-11
version: 0.04
---

# Control Flow

## Summary

This chapter covers the mechanisms that control the order of program execution. Students will learn conditional statements (if, elif, else), for and while loops, break and continue statements, and nested control structures. The chapter introduces common iteration patterns including the accumulator, counter, sentinel value, and flag variable patterns that are essential for solving real programming problems.

## Concepts Covered

This chapter covers the following 25 concepts from the learning graph:

1. Control Flow
2. Sequential Execution
3. Conditional Statements
4. If Statement
5. If-Else Statement
6. Elif Statement
7. Nested Conditionals
8. Ternary Expression
9. Match Statement
10. Loops
11. For Loop
12. While Loop
13. Range Function
14. Loop Variable
15. Loop Body
16. Infinite Loops
17. Break Statement
18. Continue Statement
19. Nested Loops
20. Loop Patterns
21. Accumulator Pattern
22. Counter Pattern
23. Sentinel Value Pattern
24. Flag Variable Pattern
25. Loop Else Clause

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: Python Fundamentals](../02-python-fundamentals/index.md)
- [Chapter 3: Boolean Logic and Comparisons](../03-boolean-logic/index.md)

---

!!! mascot-welcome "Monty says: Let's code this!"
    ![Monty](../../img/monty-welcome.png){ align=left width="80" }
    Welcome back, coders! So far you've learned how to store data in variables, do math, and compare values with Boolean expressions. But all of our programs have been *straight-line* — they just run one instruction after another from top to bottom. That's about to change. In this chapter, you'll learn how to make your programs *think*, *choose*, and *repeat*. Get ready — this is where programming gets really fun!

## What Is Control Flow?

**Control flow** is the order in which a computer executes statements in a program. Think about it like a GPS giving you driving directions. Sometimes you drive straight ahead. Sometimes you turn left or right. Sometimes you loop around a roundabout. Control flow is the GPS of your program — it decides which instructions to run and in what order.

There are three fundamental patterns of control flow:

| Pattern | What It Does | Real-Life Analogy |
|---------|-------------|-------------------|
| **Sequential** | Run statements one after another, top to bottom | Reading a book page by page |
| **Selection** | Choose which statements to run based on a condition | A "Choose Your Own Adventure" book |
| **Iteration** | Repeat statements multiple times | Listening to your favorite song on repeat |

Every program you'll ever write — from a simple calculator to a massive video game — uses some combination of these three patterns. Let's explore each one.

### Sequential Execution

**Sequential execution** is the simplest form of control flow. The computer runs your statements in order, one after another, from the first line to the last. This is Python's default behavior.

```python
name = "Alex"
age = 16
print("Hello, " + name)
print("You are " + str(age) + " years old")
```

Python runs line 1, then line 2, then line 3, then line 4. No surprises, no detours. It's like following a recipe step by step — first crack the eggs, then add the flour, then mix. You wouldn't frost a cake before baking it (well, you could try, but it wouldn't go well).

Sequential execution is fine for simple tasks, but real programs need to make decisions and repeat actions. That's where conditionals and loops come in.

#### Diagram: Control Flow Patterns

<iframe src="../../sims/control-flow-patterns/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Control Flow Patterns Flowchart</summary>
Type: diagram
**sim-id:** control-flow-patterns<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Understand (L2)
**Bloom Verb:** compare, classify

**Learning Objective:** Students will be able to identify and distinguish the three fundamental control flow patterns (sequential, selection, iteration) and trace the path of execution through each.

**Purpose:** An interactive flowchart showing the three patterns of control flow side by side. Students can click on each pattern to see an animated trace of how execution flows through it.

**Layout:**
- Three columns, each showing one control flow pattern
- Left column: Sequential (straight arrow down through 3 boxes)
- Middle column: Selection (diamond decision node branching left/right to different boxes, then merging)
- Right column: Iteration (box with arrow looping back to a diamond decision node)
- Each pattern has a label and a brief description below

**Interactive elements:**
- Click any pattern to animate a glowing dot tracing the execution path
- Hover over nodes (rectangles for statements, diamonds for decisions) to see descriptions
- A "Show All" button animates all three simultaneously for comparison
- Toggle to show/hide Python code snippets that correspond to each pattern

**Visual style:** Clean flowchart with rounded rectangles for statements, diamond shapes for conditions, directional arrows
**Color scheme:** Sequential (blue), Selection (green), Iteration (orange), animated dot in bright yellow
**Responsive:** Three columns stack vertically on narrow screens

**Instructional Rationale:** Side-by-side comparison supports the Understand/compare objective. Animated execution traces make the abstract concept of "flow" concrete and visible. Toggle between flowchart and code helps students connect visual models to Python syntax.
</details>

## Conditional Statements: Making Decisions

Imagine you're at a vending machine. You put in your money, and then you have to make a *choice*: which snack do you want? Press A1 for chips, B2 for a candy bar, C3 for a granola bar. Your selection determines what comes out. That's exactly what **conditional statements** do in Python — they let your program choose different paths based on a condition.

Conditional statements check whether something is `True` or `False` (remember Boolean values from Chapter 3?) and then decide which code to run.

### The If Statement

The **if statement** is the simplest conditional. It checks a condition, and if that condition is `True`, it runs a block of code. If the condition is `False`, it skips that block entirely.

```python
temperature = 95

if temperature > 90:
    print("It's really hot outside!")
    print("Don't forget your water bottle!")
```

Here's what happens:

1. Python evaluates `temperature > 90` — that's `95 > 90`, which is `True`
2. Since the condition is `True`, Python runs the indented code block
3. Both `print` statements execute

If `temperature` were `75`, the condition would be `False`, and Python would skip right past those two lines. Nothing would print.

Notice the structure:

- The `if` keyword, followed by a condition, followed by a colon `:`
- The code that runs when the condition is `True` is **indented** (usually 4 spaces)
- Everything at the same indentation level belongs to the if block

### The If-Else Statement

What if you want your program to do one thing when a condition is `True` and a *different* thing when it's `False`? That's where the **if-else statement** comes in.

```python
age = 15

if age >= 16:
    print("You can get your driver's license!")
else:
    print("Not old enough to drive yet.")
    print("But you'll get there soon!")
```

The `else` clause acts as a safety net — it catches everything that doesn't match the `if` condition. It's like a fork in the road: you *must* go one way or the other. There's no standing in the middle.

### The Elif Statement

But what if you have more than two options? You don't just want "hot" or "not hot" — you want "hot," "warm," "cool," and "cold." That's what the **elif statement** (short for "else if") handles.

```python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print("Your grade is: " + grade)
```

Python checks each condition from top to bottom. The *first* one that's `True` wins, and the rest are skipped. With a score of 85:

1. Is `85 >= 90`? No. Move on.
2. Is `85 >= 80`? Yes! Set `grade = "B"` and skip everything else.

This is important: **order matters** with elif chains. Python takes the first match and ignores the rest. Put your most restrictive conditions first.

!!! mascot-thinking "Monty says: You've got this!"
    ![Monty](../../img/monty-thinking.png){ align=left width="80" }
    Think of an if-elif-else chain like a bouncer at a club checking IDs. The bouncer checks one condition at a time: "Are you on the VIP list? No? Are you 21 or older? No? Are you with someone who is? No? Sorry, you're not getting in." The first condition that matches determines what happens.

#### Diagram: If-Elif-Else Flowchart

<iframe src="../../sims/if-elif-else-flowchart/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>If-Elif-Else Flowchart MicroSim</summary>
Type: microsim
**sim-id:** if-elif-else-flowchart<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Apply (L3)
**Bloom Verb:** trace, predict

**Learning Objective:** Students will be able to trace the execution path through an if-elif-else chain by entering a test value and observing which branch is taken.

**Purpose:** An interactive flowchart of the grading example above. Students enter a numeric score, and the flowchart animates the path through the decision nodes, highlighting which branch is taken and what grade is assigned.

**Layout:**
- Top: Input field for score (0-100) with a "Trace" button
- Below: Vertical flowchart with diamond decision nodes for each condition
- First diamond: "score >= 90?" with Yes branch going to "A" box, No branch going down
- Second diamond: "score >= 80?" with Yes to "B", No down
- Third diamond: "score >= 70?" with Yes to "C", No down
- Fourth diamond: "score >= 60?" with Yes to "D", No to "F"
- All grade boxes connect to a final "Print grade" box at the bottom

**Interactive elements:**
- Type a score and click "Trace" to animate a dot flowing through the flowchart
- Each diamond glows green (True) or red (False) as the dot passes through
- The winning grade box pulses and displays the result
- A "Step" button lets students advance one decision at a time
- The corresponding Python code is shown on the right, with the current line highlighted

**Visual style:** Standard flowchart shapes — diamonds for decisions, rectangles for actions
**Color scheme:** True paths in green, False paths in red, active node in yellow
**Responsive:** Flowchart scales to fit; code panel collapses below on narrow screens

**Instructional Rationale:** Tracing with a concrete input value supports the Apply level. Students predict which branch will be taken and then verify by watching the animation. Pairing the flowchart with highlighted source code builds the connection between visual logic and Python syntax.
</details>

### Nested Conditionals

Sometimes one decision depends on another. You might first check if it's a weekday, and *then* check if you have homework. Placing an if statement inside another if statement is called using **nested conditionals**.

```python
is_weekend = False
has_homework = True

if is_weekend:
    print("It's the weekend!")
    if has_homework:
        print("But you should probably do your homework first...")
    else:
        print("Enjoy your free time!")
else:
    print("It's a school day.")
    if has_homework:
        print("Time to hit the books!")
```

Nesting works, but be careful — too many levels of nesting make your code hard to read. As a rule of thumb, if you're more than 3 levels deep, there's probably a cleaner way to write it (often using `and`/`or` to combine conditions).

### Ternary Expression

Sometimes you just need a quick one-liner to pick between two values. Python's **ternary expression** (also called a conditional expression) lets you do an if-else in a single line:

```python
age = 15
status = "can drive" if age >= 16 else "too young"
print(status)  # Output: too young
```

The pattern is: `value_if_true if condition else value_if_false`

It reads almost like English: "status is 'can drive' *if* age is at least 16, *else* 'too young'." Use ternary expressions for simple choices. For anything complicated, stick with regular if-else blocks — readability always wins.

### Match Statement

Python 3.10 introduced the **match statement**, which is great for checking a single value against multiple specific options. It's similar to a "switch" statement in other languages.

```python
day = "Monday"

match day:
    case "Monday":
        print("Start of the school week!")
    case "Friday":
        print("Almost the weekend!")
    case "Saturday" | "Sunday":
        print("Weekend vibes!")
    case _:
        print("Just another school day.")
```

The `_` at the end is a **wildcard** — it matches anything that didn't match the earlier cases, like the `else` in an if-elif chain. The `|` symbol means "or," so `"Saturday" | "Sunday"` matches either one.

Match statements are cleanest when you're comparing one value against a list of known options — like menu choices, days of the week, or game commands.

## Loops: Doing Things Over and Over

Imagine you had to write a program that prints "Hello!" one hundred times. Without loops, you'd need 100 `print` statements. That's not programming — that's punishment. **Loops** let you repeat a block of code multiple times without copying and pasting it.

There are two main types of loops in Python:

- **For loops** — when you know how many times to repeat (or you're iterating over a collection)
- **While loops** — when you want to keep going until a condition changes

### The For Loop

A **for loop** repeats a block of code once for each item in a sequence (like a list, a string, or a range of numbers).

```python
fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print("I like " + fruit)
```

Output:

```
I like apple
I like banana
I like cherry
```

Here's how it works:

1. Python picks the first item from the list (`"apple"`) and stores it in the variable `fruit`
2. It runs the indented code block (the **loop body**)
3. It goes back to the top, picks the next item (`"banana"`), and runs the loop body again
4. This continues until every item has been processed

The variable `fruit` in this example is called the **loop variable** — it takes on a different value each time through the loop. The indented code below the `for` line is the **loop body** — the code that gets repeated.

### The Range Function

What if you want to repeat something a specific number of times? The **range function** generates a sequence of numbers that you can loop over.

```python
for i in range(5):
    print("Count: " + str(i))
```

Output:

```
Count: 0
Count: 1
Count: 2
Count: 3
Count: 4
```

Notice that `range(5)` gives you numbers 0 through 4 — that's 5 numbers total, but it starts at 0, not 1. This is one of Python's quirks that trips up beginners. (Why start at 0? It's a long tradition in computer science that has to do with memory addresses. You'll get used to it!)

The `range` function has three forms:

| Form | Meaning | Example | Numbers Generated |
|------|---------|---------|-------------------|
| `range(stop)` | 0 to stop-1 | `range(5)` | 0, 1, 2, 3, 4 |
| `range(start, stop)` | start to stop-1 | `range(2, 7)` | 2, 3, 4, 5, 6 |
| `range(start, stop, step)` | start to stop-1, skipping by step | `range(0, 10, 2)` | 0, 2, 4, 6, 8 |

You can even count backward:

```python
for i in range(5, 0, -1):
    print(i)
# Output: 5, 4, 3, 2, 1 (like a rocket countdown!)
```

!!! mascot-tip "Monty says: Let's debug this together!"
    ![Monty](../../img/monty-tip.png){ align=left width="80" }
    A common mistake is writing `range(1, 5)` and expecting to get 1, 2, 3, 4, 5. But remember: the stop value is *exclusive* — it's not included. If you want 1 through 5, use `range(1, 6)`. The rule is: range goes *up to but not including* the stop value.

#### Diagram: Range Function Explorer

<iframe src="../../sims/range-function-explorer/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Range Function Explorer MicroSim</summary>
Type: microsim
**sim-id:** range-function-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Apply (L3)
**Bloom Verb:** experiment, predict

**Learning Objective:** Students will be able to predict the output of the range() function with various start, stop, and step arguments by adjusting sliders and observing the generated sequence.

**Purpose:** An interactive tool where students adjust the start, stop, and step parameters of range() and immediately see the resulting sequence of numbers displayed visually.

**Layout:**
- Top: Three labeled sliders — Start (range -10 to 20, default 0), Stop (range -10 to 20, default 5), Step (range -5 to 5, default 1, excluding 0)
- Middle: A number line from -10 to 20 with dots/circles at each integer
- Below the number line: The generated numbers highlighted with colored dots and labeled
- Bottom: The Python code shown dynamically, e.g., `range(0, 5, 1)` and the resulting list `[0, 1, 2, 3, 4]`

**Interactive elements:**
- Drag any slider to change the parameter in real time
- The number line updates instantly, highlighting the generated values
- The Python code and list output update automatically
- A "Challenge" button gives the student a target sequence (e.g., "Generate: 2, 5, 8, 11") and they adjust sliders to match
- Show a warning message if step is 0 (infinite loop) or if the range produces no values

**Visual style:** Clean number line with colored highlight dots, sliders below each label
**Color scheme:** Active numbers in green, inactive in light gray, slider handles in blue
**Responsive:** Canvas width adjusts; sliders stack if too narrow

**Instructional Rationale:** Direct manipulation of parameters supports the Apply level. Immediate visual feedback on a number line builds intuition for how start, stop, and step interact. The challenge mode adds goal-directed practice.
</details>

### The While Loop

A **while loop** keeps running as long as a condition is `True`. Unlike a for loop, you don't necessarily know in advance how many times it will repeat.

```python
password = ""

while password != "python123":
    password = input("Enter the password: ")

print("Access granted!")
```

This loop keeps asking for a password until the user types the correct one. It could run once (if they get it right the first time) or a hundred times (if they keep guessing wrong).

The while loop structure:

1. Check the condition — is it `True`?
2. If `True`, run the loop body
3. Go back to step 1
4. If `False`, skip the loop body and continue with the rest of the program

### Infinite Loops

Here's something to watch out for: if the condition in a while loop *never* becomes `False`, the loop runs forever. This is called an **infinite loop**, and it's one of the most common bugs in programming.

```python
# WARNING: This loop never ends!
x = 1
while x > 0:
    print(x)
    x = x + 1
```

Since `x` starts at 1 and keeps increasing, `x > 0` is *always* `True`. Your program will print numbers forever (or until you force it to stop with Ctrl+C).

Sometimes infinite loops are *intentional* — for example, a game's main loop that keeps running until the player quits. But accidental infinite loops are a headache. Always make sure your while loop condition will eventually become `False`.

!!! mascot-warning "Monty says: Watch out!"
    ![Monty](../../img/monty-warning.png){ align=left width="80" }
    If your program seems "frozen" or stuck, you might have an infinite loop! Press **Ctrl+C** (or **Cmd+C** on Mac) to stop the program. Then check your while loop: is the condition *ever* becoming False? Make sure something inside the loop is changing a variable that affects the condition.

### Break Statement

The **break statement** is like an emergency exit. When Python hits `break` inside a loop, it immediately jumps out of the loop — no questions asked.

```python
for num in range(1, 100):
    if num == 7:
        print("Found it!")
        break
    print("Checking " + str(num))
```

Output:

```
Checking 1
Checking 2
Checking 3
Checking 4
Checking 5
Checking 6
Found it!
```

Without `break`, this loop would check all 99 numbers. With `break`, it stops as soon as it finds 7. Efficient!

### Continue Statement

The **continue statement** is the opposite of `break`. Instead of exiting the loop, it skips the *rest of the current iteration* and jumps to the next one.

```python
for i in range(1, 6):
    if i == 3:
        continue
    print(i)
```

Output:

```
1
2
4
5
```

When `i` is 3, `continue` tells Python "skip the print and go to the next number." It's useful for filtering — running the loop body only for items that meet certain criteria.

Here's a comparison to keep them straight:

| Statement | What It Does | Analogy |
|-----------|-------------|---------|
| `break` | Exit the loop entirely | Walking out of the movie theater |
| `continue` | Skip to the next iteration | Fast-forwarding past a boring scene |

#### Diagram: Break vs Continue Visualizer

<iframe src="../../sims/break-vs-continue/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Break vs Continue Visualizer MicroSim</summary>
Type: microsim
**sim-id:** break-vs-continue<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Understand (L2)
**Bloom Verb:** compare, trace

**Learning Objective:** Students will be able to distinguish between break and continue by tracing the execution of loops that use each statement and predicting the output.

**Purpose:** A side-by-side animation showing two identical loops — one using break and one using continue — so students can visually compare how each statement affects the loop's execution.

**Layout:**
- Split screen: left side "Loop with break", right side "Loop with continue"
- Each side shows a for loop iterating through numbers 1-5 with a condition check at number 3
- Animated execution dot traces through each loop
- An output console at the bottom of each side shows what gets printed

**Interactive elements:**
- "Step" button advances both loops one step simultaneously
- "Auto Play" button animates with adjustable speed
- "Reset" button restarts both loops
- Students can change the "trigger number" (the number that activates break/continue) via a dropdown

**Visual elements:**
- Loop iterations shown as boxes in a row (1, 2, 3, 4, 5)
- Current iteration highlighted in yellow
- Break side: when trigger is reached, remaining boxes turn gray (skipped)
- Continue side: only the trigger box turns gray, rest continue normally
- Output consoles show printed values accumulating

**Color scheme:** Active iteration in yellow, completed in green, skipped/break in red, continue-skipped in orange
**Responsive:** Side-by-side on wide screens, stacked vertically on narrow

**Instructional Rationale:** Side-by-side comparison with identical input makes the behavioral difference immediately obvious. Step-by-step execution supports careful tracing. Changing the trigger number lets students verify their understanding with different scenarios.
</details>

### Nested Loops

A **nested loop** is a loop inside another loop. The inner loop runs completely for *each iteration* of the outer loop. This is like a clock: the minute hand goes around 60 times for every single revolution of the hour hand.

```python
for row in range(1, 4):
    for col in range(1, 4):
        print(f"({row},{col})", end=" ")
    print()  # New line after each row
```

Output:

```
(1,1) (1,2) (1,3)
(2,1) (2,2) (2,3)
(3,1) (3,2) (3,3)
```

The outer loop runs 3 times (rows 1, 2, 3). For *each* row, the inner loop runs 3 times (columns 1, 2, 3). That's 3 x 3 = 9 total iterations. Nested loops are commonly used for working with grids, tables, and two-dimensional data.

Here's a classic example — printing a multiplication table:

```python
for i in range(1, 6):
    for j in range(1, 6):
        print(f"{i*j:4}", end="")
    print()
```

Output:

```
   1   2   3   4   5
   2   4   6   8  10
   3   6   9  12  15
   4   8  12  16  20
   5  10  15  20  25
```

#### Diagram: Nested Loop Grid Visualizer

<iframe src="../../sims/nested-loop-grid/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Nested Loop Grid Visualizer MicroSim</summary>
Type: microsim
**sim-id:** nested-loop-grid<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Apply (L3)
**Bloom Verb:** trace, predict

**Learning Objective:** Students will be able to trace the execution order of nested loops by watching a cell-by-cell animation across a grid and predicting which cell is filled next.

**Purpose:** An animated grid that fills in cell by cell to show the execution order of a nested for loop. Students see the outer loop variable (row) and inner loop variable (column) update in real time.

**Layout:**
- Top: Current values display — "row = ?, col = ?, iteration = ?"
- Center: An N x N grid (default 4x4) with row and column labels
- Right side: The Python code with the current line highlighted
- Bottom: Controls

**Interactive elements:**
- Grid size slider (2x2 to 6x6)
- "Step" button to advance one cell at a time
- "Auto Play" button with speed control
- "Reset" button
- Click any cell to see its (row, col) coordinates and iteration number

**Visual elements:**
- Cells fill in order: left to right across each row, then down to the next row
- Current cell glows brightly
- Already-filled cells show their iteration number
- Row label highlights on the left when that row is active
- Column label highlights on top when that column is active
- Python code on the right highlights the inner or outer loop line as appropriate

**Color scheme:** Current cell in bright yellow, filled cells in gradient from light to dark blue (showing order), unfilled in white
**Responsive:** Grid scales proportionally; code panel collapses below on narrow screens

**Instructional Rationale:** Step-by-step cell filling makes the nested execution order concrete. Seeing the loop variables update alongside the grid builds understanding of which variable changes "fast" (inner) and which changes "slow" (outer). Adjustable grid size lets students verify their mental model at different scales.
</details>

### Loop Else Clause

Here's a Python feature that surprises even experienced programmers: you can put an `else` block on a loop. The **loop else clause** runs when the loop finishes *normally* (without hitting a `break`).

```python
numbers = [2, 4, 6, 8]

for num in numbers:
    if num % 2 != 0:
        print(f"Found an odd number: {num}")
        break
else:
    print("All numbers are even!")
```

Output: `All numbers are even!`

Since no odd number was found, the loop never hit `break`, so the `else` block ran. If the list contained a 5, the `break` would trigger and the `else` would be skipped.

A helpful way to read this: "for each item... do this... *else* (if we got through everything without breaking)... do that." Some people find it easier to think of it as "for...no-break."

## Common Loop Patterns

Now that you know the mechanics of loops, let's look at some **loop patterns** — tried-and-true templates that show up over and over in real programs. Learning these patterns is like learning chess openings: once you recognize them, you can solve problems much faster.

### The Accumulator Pattern

The **accumulator pattern** is used when you want to build up a result (a total, a string, a list) as you loop through data. You start with an initial value, and each time through the loop, you add to it.

```python
# Sum all numbers from 1 to 100
total = 0  # accumulator variable, initialized to 0

for num in range(1, 101):
    total = total + num

print("The sum is:", total)  # Output: The sum is: 5050
```

The formula is:

1. **Initialize** the accumulator before the loop (`total = 0`)
2. **Update** the accumulator inside the loop (`total = total + num`)
3. **Use** the accumulator after the loop (`print(total)`)

The accumulator doesn't have to be a number. You can accumulate a string:

```python
# Build a string of initials
names = ["Alice", "Bob", "Charlie"]
initials = ""

for name in names:
    initials = initials + name[0]

print(initials)  # Output: ABC
```

### The Counter Pattern

The **counter pattern** is a special case of the accumulator where you're counting how many items meet a certain condition.

```python
# Count how many scores are above 80
scores = [72, 95, 88, 61, 79, 93, 85]
high_scores = 0  # counter variable

for score in scores:
    if score > 80:
        high_scores = high_scores + 1

print("Number of high scores:", high_scores)  # Output: 3
```

The key difference from a plain accumulator: you add 1 only when a condition is met. This is incredibly useful — counting vowels in a string, counting even numbers in a list, counting how many students passed a test.

### The Sentinel Value Pattern

The **sentinel value pattern** uses a special value (the "sentinel") to signal that the loop should stop. Instead of knowing the number of iterations in advance, you keep looping until you see the magic stop value.

```python
# Keep reading scores until the user enters -1
total = 0
count = 0

score = int(input("Enter a score (-1 to stop): "))

while score != -1:  # -1 is the sentinel value
    total = total + score
    count = count + 1
    score = int(input("Enter a score (-1 to stop): "))

if count > 0:
    average = total / count
    print(f"Average score: {average}")
else:
    print("No scores entered.")
```

The sentinel value (-1 in this case) is chosen because it's not a valid score. Sentinels must be values that would never appear as legitimate data.

Common sentinel values include:

- `-1` for positive-only data
- `""` (empty string) for text input
- `"quit"` or `"exit"` as a command
- `0` when zero isn't valid data

### The Flag Variable Pattern

The **flag variable pattern** uses a Boolean variable (the "flag") to track whether a certain condition has been encountered. Think of it like raising a flag on a mailbox — once it's up, you know something happened.

```python
# Check if a list contains any negative numbers
numbers = [4, 7, -2, 9, 1]
has_negative = False  # flag variable

for num in numbers:
    if num < 0:
        has_negative = True
        break  # no need to keep looking

if has_negative:
    print("The list contains negative numbers.")
else:
    print("All numbers are positive.")
```

The flag starts as `False` and gets flipped to `True` when the condition is found. After the loop, you check the flag to decide what to do. This pattern is great when you're searching for something — you don't care *how many* items match, just whether *at least one* does.

!!! mascot-thinking "Monty says: Let's debug this together!"
    ![Monty](../../img/monty-thinking.png){ align=left width="80" }
    Here's a quick cheat sheet for loop patterns: **Accumulator** = "build up a total." **Counter** = "count how many." **Sentinel** = "stop when you see the signal." **Flag** = "did this thing ever happen?" Once you recognize which pattern a problem calls for, writing the code becomes much easier!

#### Diagram: Loop Patterns Comparison

<iframe src="../../sims/loop-patterns-comparison/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Loop Patterns Comparison MicroSim</summary>
Type: microsim
**sim-id:** loop-patterns-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Analyze (L4)
**Bloom Verb:** classify, differentiate

**Learning Objective:** Students will be able to identify which loop pattern (accumulator, counter, sentinel, flag) is being used in a given code example and explain why that pattern was chosen.

**Purpose:** An interactive quiz/explorer that presents code snippets and asks students to identify the loop pattern being used, with visual feedback and explanations.

**Layout:**
- Top: Four pattern cards arranged horizontally, each with a name, icon, and one-sentence description
  - Accumulator (sum icon): "Build up a result"
  - Counter (tally icon): "Count matches"
  - Sentinel (stop sign icon): "Stop on signal"
  - Flag (flag icon): "Track if something happened"
- Middle: A code snippet display area showing a Python loop example
- Bottom: "Which pattern is this?" prompt with four clickable buttons matching the pattern cards

**Interactive elements:**
- "Next Example" button cycles through 8-10 different code snippets
- Click a pattern button to guess — correct answers highlight green with explanation, incorrect flash red with a hint
- Score tracker in the corner (e.g., "5/8 correct")
- "Show Answer" button reveals the correct pattern with explanation
- Each pattern card is clickable to show a reference example of that pattern

**Visual elements:**
- Code snippets displayed with syntax highlighting
- Correct guess: confetti animation and green glow
- Incorrect guess: gentle red flash and hint text
- Pattern cards pulse when they're the correct answer after reveal

**Color scheme:** Accumulator (blue), Counter (green), Sentinel (orange), Flag (purple)
**Responsive:** Pattern cards stack in 2x2 grid on narrow screens; code area adjusts width

**Instructional Rationale:** Classification tasks support the Analyze level by requiring students to look at code structure and match it to an abstract pattern. Multiple examples build pattern recognition fluency. Immediate feedback with explanations corrects misconceptions on the spot.
</details>

## Putting It All Together

Let's see how these concepts combine in a more realistic example. Here's a number-guessing game that uses a while loop, conditionals, a counter, and a flag:

```python
import random

secret = random.randint(1, 100)
guesses = 0  # counter pattern
found = False  # flag variable pattern

print("I'm thinking of a number between 1 and 100!")

while not found:
    guess = int(input("Your guess: "))
    guesses = guesses + 1

    if guess < secret:
        print("Too low! Try again.")
    elif guess > secret:
        print("Too high! Try again.")
    else:
        found = True
        print(f"You got it in {guesses} guesses!")
```

This little program uses almost everything we covered: control flow, conditionals (if-elif-else), a while loop, a counter pattern, and a flag variable pattern. That's the beauty of these building blocks — individually they're simple, but together they can create something genuinely interactive and fun.

!!! mascot-celebration "Monty says: You've got this!"
    ![Monty](../../img/monty-celebrates.png){ align=left width="80" }
    Awesome work making it through this monster chapter! You now know how to make programs that *think* (conditionals), *repeat* (loops), and *decide when to stop* (break, continue, sentinels, flags). These tools are the backbone of every program you'll ever write. From here on out, your code is going to get a *lot* more interesting!

## Key Takeaways

- **Control flow** determines the order in which statements execute. The three patterns are sequential, selection (conditionals), and iteration (loops).
- **If, elif, and else** let your program choose different paths. Python checks conditions top-to-bottom and takes the first match.
- **Ternary expressions** provide a compact one-line if-else for simple choices.
- **Match statements** (Python 3.10+) cleanly handle checking one value against multiple options.
- **Nested conditionals** place if statements inside other if statements — use sparingly for readability.
- **For loops** iterate over sequences (lists, strings, ranges). **While loops** repeat as long as a condition is True.
- The **range function** generates sequences of numbers. Remember: the stop value is *exclusive*.
- **Loop variables** take a new value each iteration; the **loop body** is the indented code that repeats.
- **Break** exits a loop immediately. **Continue** skips to the next iteration.
- **Infinite loops** occur when a while condition never becomes False — always ensure your loop can terminate.
- **Nested loops** run the inner loop completely for each iteration of the outer loop.
- The **loop else clause** runs only if the loop finishes without hitting break.
- **Accumulator pattern**: initialize, update inside loop, use after loop — for building totals or results.
- **Counter pattern**: accumulate +1 each time a condition is met.
- **Sentinel value pattern**: loop until a special "stop" value is entered.
- **Flag variable pattern**: use a Boolean to track whether something was found.

??? question "Check Your Understanding: What does this code print?"
    ```python
    for i in range(3):
        for j in range(2):
            print(f"{i}-{j}", end=" ")
        print()
    ```

    **Answer:**
    ```
    0-0 0-1
    1-0 1-1
    2-0 2-1
    ```
    The outer loop runs 3 times (i = 0, 1, 2). For each value of i, the inner loop runs 2 times (j = 0, 1). That's 3 x 2 = 6 total iterations, printed in a 3-row, 2-column grid.

??? question "Check Your Understanding: Which loop pattern would you use to find out whether a list contains any prime numbers?"
    The **flag variable pattern**! You'd set a Boolean variable like `has_prime = False` before the loop, check each number, and set it to `True` if you find a prime. After the loop, check the flag. You could also use `break` to stop early once you find one.

??? question "Check Your Understanding: What's the difference between `break` and `continue`?"
    **Break** exits the loop completely — no more iterations happen. **Continue** skips the rest of the *current* iteration and jumps to the next one. Think of break as walking out of a movie theater, and continue as fast-forwarding past a boring scene.
