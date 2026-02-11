---
title: Boolean Logic and Comparisons
description: Boolean expressions, comparison and logical operators, truth tables, De Morgan's Laws, and truthiness in Python.
generated_by: claude skill chapter-content-generator
date: 2026-02-11
version: 0.04
---

# Boolean Logic and Comparisons

## Summary

This chapter explores Boolean logic, the foundation of all decision-making in programming. Students will learn about Boolean expressions, comparison operators, logical operators (and, or, not), short-circuit evaluation, and truthiness in Python. The chapter also covers De Morgan's Laws and truth tables, providing the logical reasoning skills needed for control flow programming.

## Concepts Covered

This chapter covers the following 15 concepts from the learning graph:

1. Boolean Expressions
2. Comparison Operators
3. Equal and Not Equal
4. Greater and Less Than
5. Logical Operators
6. And Operator
7. Or Operator
8. Not Operator
9. Short-Circuit Evaluation
10. Truthiness and Falsiness
11. Boolean Conversion
12. Chained Comparisons
13. Order of Operations
14. De Morgan's Laws
15. Truth Tables

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: Python Fundamentals](../02-python-fundamentals/index.md)

---

!!! mascot-welcome "Monty says: Let's code this!"
    ![Monty](../../img/monty-welcome.png){ align=left width="80" }
    Welcome back, coders! Get ready for a chapter that's all about *decisions*. Every time a computer checks your password, filters your search results, or decides whether an enemy in a video game should attack — it's using Boolean logic. By the end of this chapter, you'll be thinking in `True` and `False` like a pro. Let's do this!

## True or False: The World of Boolean Expressions

Every day, you make decisions based on yes-or-no questions. "Is it raining?" "Did I finish my homework?" "Is it past midnight?" Each of these questions has exactly two possible answers: **yes** or **no**. In programming, we call these answers `True` and `False`, and the questions that produce them are called **Boolean expressions**.

A **Boolean expression** is any expression that evaluates to either `True` or `False`. That's it — no "maybe," no "sort of," no "I'll think about it." Just two options. Computers love this simplicity because, as you learned in Chapter 1, they're built on binary — ones and zeros, on and off, true and false.

The name "Boolean" comes from **George Boole**, a 19th-century mathematician who figured out that logic could be treated as algebra. Thanks, George! Your work powers every `if` statement, every search engine, and every spam filter on the planet.

In Python, the Boolean data type is called `bool`, and it has exactly two values:

```python
>>> type(True)
<class 'bool'>
>>> type(False)
<class 'bool'>
```

Notice that `True` and `False` are capitalized in Python. Writing `true` or `FALSE` will give you an error. Python is picky about this.

## Comparison Operators: Asking Questions

So how do you create Boolean expressions? The most common way is with **comparison operators**. These are symbols that compare two values and return `True` or `False`.

Think of comparison operators like a judge at a talent show. You hand the judge two contestants, and the judge answers a specific question: "Is this one better than that one?" "Are they tied?" The answer is always yes or no.

Here are Python's six comparison operators:

| Operator | Meaning | Example | Result |
|----------|---------|---------|--------|
| `==` | Equal to | `5 == 5` | `True` |
| `!=` | Not equal to | `5 != 3` | `True` |
| `>` | Greater than | `7 > 4` | `True` |
| `<` | Less than | `3 < 8` | `True` |
| `>=` | Greater than or equal to | `5 >= 5` | `True` |
| `<=` | Less than or equal to | `4 <= 3` | `False` |

Let's try them out in Python:

```python
>>> 10 == 10
True
>>> 10 == 7
False
>>> "hello" == "hello"
True
>>> 3.14 > 2.71
True
```

### Equal and Not Equal

The **equal** operator (`==`) checks whether two values are the same. The **not equal** operator (`!=`) checks whether they're different. These are probably the two operators you'll use most often.

```python
>>> password = "secret123"
>>> password == "secret123"
True
>>> password != "wrong_guess"
True
>>> 42 == 42.0
True
```

Wait — did you catch that last one? `42 == 42.0` is `True` because Python compares the *values*, and the integer 42 and the float 42.0 represent the same number.

!!! mascot-warning "Monty says: Let's debug this together!"
    ![Monty](../../img/monty-warning.png){ align=left width="80" }
    The **number one beginner mistake** with Booleans: using a single `=` when you mean `==`. Remember, a single `=` is the *assignment* operator (it stores a value in a variable). A double `==` is the *comparison* operator (it checks if two values are equal). Mixing them up is like confusing "put this in the box" with "is this in the box?"

### Greater and Less Than

The **greater than** (`>`) and **less than** (`<`) operators work exactly like they do in math class. The **greater than or equal to** (`>=`) and **less than or equal to** (`<=`) operators add the "or equal" condition.

```python
>>> age = 16
>>> age > 13
True
>>> age < 18
True
>>> age >= 16
True
>>> age <= 15
False
```

These operators aren't limited to numbers. You can compare strings too! Python compares strings alphabetically (technically, it uses Unicode values, but the effect is the same for English letters):

```python
>>> "apple" < "banana"
True
>>> "cat" > "car"
True
>>> "A" < "a"
True
```

That last one might surprise you. Capital letters come before lowercase letters in Unicode, so `"A"` is "less than" `"a"`. Keep that in mind when comparing strings.

#### Diagram: Comparison Operator Explorer

<iframe src="../../sims/comparison-operator-explorer/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Comparison Operator Explorer MicroSim</summary>
Type: microsim
**sim-id:** comparison-operator-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Apply (L3)
**Bloom Verb:** experiment, predict

**Learning Objective:** Students will be able to predict and verify the result of comparison expressions by selecting operators and values, then checking the Boolean output.

**Purpose:** An interactive sandbox where students can choose two values and a comparison operator, predict the result (True or False), and then reveal the answer.

**Layout:**
- Top section: Title "Comparison Operator Explorer"
- Middle section: Two input fields (left value and right value) with a dropdown menu between them showing all six comparison operators (==, !=, >, <, >=, <=)
- Below: A "Predict" section with True/False buttons for the student to guess
- Bottom: A "Reveal" button that shows the actual result, with green (correct) or red (incorrect) feedback

**Interactive controls:**
- Left value input: text field accepting numbers or quoted strings
- Operator dropdown: ==, !=, >, <, >=, <=
- Right value input: text field accepting numbers or quoted strings
- "True" and "False" prediction buttons
- "Reveal Answer" button
- "New Challenge" button: generates a random comparison for the student to evaluate
- Score tracker: shows correct/total in the corner

**Visual elements:**
- The expression is displayed in a large, code-styled font (e.g., `5 > 3`)
- True result glows green; False result glows red
- Correct predictions trigger a brief celebration animation
- Incorrect predictions show the correct answer with an explanation

**Behavior:**
- Student selects or enters values and operator
- Student predicts True or False
- Clicking Reveal shows the actual result and updates the score
- New Challenge mode generates random integer pairs and random operators

**Responsive:** Canvas resizes with window; input fields and buttons scale proportionally

**Instructional Rationale:** Predict-then-reveal interaction supports the Apply level by requiring students to mentally evaluate expressions before checking answers. The score tracker adds a gamification element that encourages repeated practice, building fluency with comparison operators.
</details>

## Logical Operators: Combining Conditions

Comparison operators are great for asking one question at a time. But real-world decisions often involve *multiple* conditions. "Can I go to the movies?" might depend on: "Do I have enough money?" *and* "Is it before 10 PM?" *and* "Did I finish my homework?"

That's where **logical operators** come in. Python has three logical operators that let you combine Boolean expressions:

| Operator | Meaning | Example |
|----------|---------|---------|
| `and` | Both must be True | `True and True` returns `True` |
| `or` | At least one must be True | `False or True` returns `True` |
| `not` | Flips True to False (and vice versa) | `not False` returns `True` |

Let's look at each one.

### The And Operator

The **`and` operator** returns `True` only when *both* conditions are `True`. If either one is `False`, the whole expression is `False`.

Think of it like a bouncer at a club with two rules: you must be on the guest list *and* you must be wearing shoes. If you fail *either* rule, you don't get in.

```python
>>> age = 16
>>> has_permit = True
>>> age >= 16 and has_permit
True
>>> age >= 18 and has_permit
False
```

Here's the **truth table** for `and`:

| A | B | A and B |
|---|---|---------|
| `True` | `True` | `True` |
| `True` | `False` | `False` |
| `False` | `True` | `False` |
| `False` | `False` | `False` |

Notice the pattern: `and` is strict. Only one combination out of four gives you `True`.

### The Or Operator

The **`or` operator** returns `True` when *at least one* condition is `True`. It only returns `False` when *both* conditions are `False`.

Think of it like choosing a movie: "I'll watch it if it has good reviews *or* if my friend recommends it." You only skip it if *neither* is true.

```python
>>> is_weekend = True
>>> is_holiday = False
>>> is_weekend or is_holiday
True
>>> is_weekend = False
>>> is_weekend or is_holiday
False
```

Here's the truth table for `or`:

| A | B | A or B |
|---|---|--------|
| `True` | `True` | `True` |
| `True` | `False` | `True` |
| `False` | `True` | `True` |
| `False` | `False` | `False` |

The `or` operator is generous — three out of four combinations give you `True`.

### The Not Operator

The **`not` operator** is the simplest of the three. It takes a single Boolean value and flips it. `True` becomes `False`, and `False` becomes `True`. It's the Boolean equivalent of saying "opposite day!"

```python
>>> is_raining = False
>>> not is_raining
True
>>> not True
False
>>> not (5 > 10)
True
```

Here's the truth table for `not`:

| A | not A |
|---|-------|
| `True` | `False` |
| `False` | `True` |

!!! mascot-thinking "Monty says: You've got this!"
    ![Monty](../../img/monty-thinking.png){ align=left width="80" }
    Here's a brain teaser: what does `not not True` evaluate to? If you guessed `True`, you're right! `not True` gives `False`, and `not False` gives `True` again. Two negatives cancel out, just like in English when you say "I'm not *un*happy" (meaning you *are* happy).

#### Diagram: Logical Operator Venn Diagrams

<iframe src="../../sims/logical-operator-venn/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Logical Operator Venn Diagrams MicroSim</summary>
Type: microsim
**sim-id:** logical-operator-venn<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Understand (L2)
**Bloom Verb:** illustrate, interpret

**Learning Objective:** Students will be able to visualize the behavior of `and`, `or`, and `not` operators using Venn diagrams and predict the result of combined Boolean expressions.

**Purpose:** An interactive Venn diagram visualization that shows how `and`, `or`, and `not` work by highlighting different regions of overlapping circles.

**Layout:**
- Top: Title "Logical Operators as Venn Diagrams"
- Center: Two overlapping circles labeled "A" (left, blue) and "B" (right, orange)
- Below circles: Three buttons labeled "A and B", "A or B", "not A"
- Bottom: Text display showing the Boolean expression and which region is highlighted

**Interactive elements:**
- Click "A and B": Highlight only the overlapping (intersection) region in green
- Click "A or B": Highlight the entire area covered by either circle (union) in green
- Click "not A": Highlight everything *outside* circle A in green
- Hover over any region to see its Boolean description (e.g., "A is True, B is False")
- Toggle switches for A (True/False) and B (True/False) that update a results panel showing the value of `A and B`, `A or B`, `not A`, and `not B`

**Visual elements:**
- Circle A: semi-transparent blue
- Circle B: semi-transparent orange
- Highlighted region: bright green overlay
- Non-highlighted regions: dimmed gray
- Smooth transitions when switching between operators

**Color scheme:** Blue for A, orange for B, green for result region, gray for inactive
**Responsive:** Circles scale and reposition with window size

**Instructional Rationale:** Venn diagrams provide a familiar visual metaphor for set operations that maps directly to Boolean logic. The interactive highlighting makes abstract operator behavior concrete and spatial, supporting the Understand level. Toggle switches bridge the gap between the visual representation and actual True/False evaluation.
</details>

## Truth Tables: The Complete Picture

A **truth table** is a chart that shows every possible combination of inputs and the resulting output for a logical expression. You've already seen individual truth tables for `and`, `or`, and `not`. Truth tables are like cheat sheets for logic — they lay out all possibilities so nothing is left to guesswork.

Why do truth tables matter? Because when you write programs with complex conditions, you need to be *absolutely sure* about what happens in every scenario. A truth table guarantees you've thought through every case.

Here's a combined truth table showing all three operators at once:

| A | B | A and B | A or B | not A | not B |
|---|---|---------|--------|-------|-------|
| `True` | `True` | `True` | `True` | `False` | `False` |
| `True` | `False` | `False` | `True` | `False` | `True` |
| `False` | `True` | `False` | `True` | `True` | `False` |
| `False` | `False` | `False` | `False` | `True` | `True` |

When you have two variables, there are \(2^2 = 4\) rows. Three variables? \(2^3 = 8\) rows. Four variables? \(2^4 = 16\) rows. The number of rows doubles with every new variable. That's exponential growth!

Let's build a truth table for a slightly more complex expression: `(A and B) or C`.

| A | B | C | A and B | (A and B) or C |
|---|---|---|---------|----------------|
| T | T | T | T | T |
| T | T | F | T | T |
| T | F | T | F | T |
| T | F | F | F | F |
| F | T | T | F | T |
| F | T | F | F | F |
| F | F | T | F | T |
| F | F | F | F | F |

With three variables we need 8 rows to cover every combination. This might seem like a lot of work, but it's the *only* way to be 100% sure your logic is correct.

#### Diagram: Interactive Truth Table Builder

<iframe src="../../sims/truth-table-builder/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Interactive Truth Table Builder MicroSim</summary>
Type: microsim
**sim-id:** truth-table-builder<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Analyze (L4)
**Bloom Verb:** construct, evaluate

**Learning Objective:** Students will be able to construct truth tables for compound Boolean expressions and evaluate whether two expressions are logically equivalent.

**Purpose:** An interactive tool where students can type a Boolean expression and see the automatically generated truth table, or build a truth table row by row to verify their understanding.

**Layout:**
- Top: Title "Truth Table Builder"
- Input area: Text field where students type a Boolean expression using variables A, B, C and operators `and`, `or`, `not`
- Below: Auto-generated truth table showing all input combinations and the result for each row
- Right panel: A "Practice Mode" where students fill in the result column themselves before revealing answers

**Interactive controls:**
- Expression input field: accepts expressions like `A and B`, `not A or B`, `(A and B) or (not C)`
- "Generate Table" button: creates the truth table for the expression
- "Practice Mode" toggle: hides the result column and lets students click True/False for each row
- "Check Answers" button: in Practice Mode, reveals correct answers and highlights errors in red
- "Compare" button: enter two expressions to see if they produce identical truth tables (useful for De Morgan's Laws)
- Variable count selector: 2 variables (A, B) or 3 variables (A, B, C)

**Visual elements:**
- Truth table rendered as a clean grid with alternating row colors
- True values shown in green text; False values in red text
- Correct answers in Practice Mode glow green; incorrect answers flash red
- When comparing two equivalent expressions, both tables highlight in gold

**Behavior:**
- Parsing engine recognizes: `and`, `or`, `not`, parentheses, and variables A, B, C
- Automatically generates all 2^n rows for n variables
- Practice Mode allows students to test their understanding before seeing the answer
- Compare mode shows two truth tables side by side

**Responsive:** Table columns adjust width based on canvas size; scrollable if needed
**Default state:** Expression field shows `A and B` with its truth table displayed

**Instructional Rationale:** Building truth tables supports the Analyze level by requiring students to decompose complex expressions into constituent parts and systematically evaluate each combination. Practice Mode adds an active recall dimension. The Compare feature directly supports learning De Morgan's Laws by letting students verify equivalences experimentally.
</details>

## Short-Circuit Evaluation

Python is clever about evaluating Boolean expressions. It doesn't always need to check *every* part of an expression to know the answer. This behavior is called **short-circuit evaluation**.

Here's the key insight:

- With `and`: If the first condition is `False`, Python **stops immediately** and returns `False`. Why bother checking the second condition? If the first one already failed, the whole `and` expression can't possibly be `True`.
- With `or`: If the first condition is `True`, Python **stops immediately** and returns `True`. Why check the second condition? One `True` is all `or` needs.

```python
>>> False and (1 / 0 > 0)  # Never evaluates 1/0 -- no error!
False
>>> True or (1 / 0 > 0)    # Never evaluates 1/0 -- no error!
True
```

Whoa! `1 / 0` would normally cause a `ZeroDivisionError`, but Python never even gets to it. The first operand already determined the result, so Python short-circuits and skips the rest.

This isn't just a fun trick — it's genuinely useful. You can write "guard" conditions to prevent errors:

```python
>>> x = 0
>>> x != 0 and 100 / x > 10  # Safe! Short-circuits when x is 0
False
```

Without short-circuit evaluation, `100 / x` would crash when `x` is zero. But because `x != 0` is `False`, Python never reaches the division. Smart!

Here's a summary of when short-circuiting happens:

| Expression | First value | Short-circuits? | Result |
|-----------|-------------|-----------------|--------|
| `False and ???` | `False` | Yes | `False` |
| `True and ???` | `True` | No (must check `???`) | Depends on `???` |
| `True or ???` | `True` | Yes | `True` |
| `False or ???` | `False` | No (must check `???`) | Depends on `???` |

## Truthiness and Falsiness

Here's where Python gets a little philosophical. You know that `True` and `False` are Boolean values. But did you know that Python treats *many* non-Boolean values as if they were `True` or `False`?

This concept is called **truthiness and falsiness**. In Python, every value has an inherent "truthiness" — it's either considered truthy (acts like `True`) or falsy (acts like `False`) when used in a Boolean context.

The **falsy** values in Python are:

- `False` (obviously)
- `0` (zero, the integer)
- `0.0` (zero, the float)
- `""` (empty string)
- `[]` (empty list)
- `()` (empty tuple)
- `{}` (empty dictionary)
- `None` (Python's "nothing" value)

**Everything else is truthy.** Non-zero numbers, non-empty strings, non-empty lists — all truthy.

```python
>>> bool(42)
True
>>> bool(0)
False
>>> bool("hello")
True
>>> bool("")
False
>>> bool([1, 2, 3])
True
>>> bool([])
False
```

Here's a handy way to remember it: **empty and zero are falsy; everything else is truthy**.

!!! mascot-tip "Monty says: Let's debug this together!"
    ![Monty](../../img/monty-tip.png){ align=left width="80" }
    A super common Python pattern is checking if a list has items: `if my_list:` is the same as `if len(my_list) > 0:`, but shorter and more "Pythonic." Experienced Python programmers use truthiness all the time to write cleaner code!

### Boolean Conversion

You can explicitly convert any value to a Boolean using the `bool()` function. This is called **Boolean conversion** (sometimes called "casting to bool").

```python
>>> bool(1)
True
>>> bool(0)
False
>>> bool("Python")
True
>>> bool("")
False
>>> bool(None)
False
>>> bool(-5)
True
```

Notice that `-5` is truthy. Any non-zero number is truthy, even negative numbers. Only zero itself is falsy.

Here's a reference table for Boolean conversion:

| Value | `bool()` result | Why? |
|-------|-----------------|------|
| `1` | `True` | Non-zero integer |
| `0` | `False` | Zero |
| `-3.14` | `True` | Non-zero float |
| `0.0` | `False` | Zero float |
| `"hi"` | `True` | Non-empty string |
| `""` | `False` | Empty string |
| `[1,2]` | `True` | Non-empty list |
| `[]` | `False` | Empty list |
| `None` | `False` | Python's "nothing" |

#### Diagram: Truthiness Tester

<iframe src="../../sims/truthiness-tester/main.html" width="100%" height="450px" scrolling="no"></iframe>

<details markdown="1">
<summary>Truthiness Tester MicroSim</summary>
Type: microsim
**sim-id:** truthiness-tester<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Apply (L3)
**Bloom Verb:** classify, predict

**Learning Objective:** Students will be able to classify Python values as truthy or falsy and predict the result of `bool()` conversion.

**Purpose:** A sorting game where students drag Python values into "Truthy" and "Falsy" bins, reinforcing their understanding of which values Python treats as True and which as False.

**Layout:**
- Top: Title "Truthiness Tester: Truthy or Falsy?"
- Center: A row of draggable cards, each showing a Python value (e.g., `0`, `""`, `42`, `"hello"`, `None`, `[]`, `[1]`, `-7`, `0.0`, `"False"`)
- Bottom: Two labeled bins — "Truthy" (green, left) and "Falsy" (red, right)
- Score area: Shows correct/total after each submission

**Interactive controls:**
- Drag any value card into the Truthy or Falsy bin
- "Check" button: evaluates all placed cards and shows correct/incorrect
- "New Round" button: generates a new set of 8-10 random values
- "Hint" button: highlights one incorrectly placed card without revealing the answer

**Value pool (randomly selected per round):**
- Falsy: `0`, `0.0`, `""`, `False`, `None`, `[]`, `()`, `{}`
- Truthy: `1`, `-1`, `42`, `3.14`, `"hello"`, `"0"`, `" "`, `[0]`, `True`, `"False"`, `"None"`

**Tricky values (intentional learning moments):**
- `"0"` is truthy (it's a non-empty string, even though the content is "0")
- `"False"` is truthy (it's a non-empty string, not the Boolean False)
- `" "` (space) is truthy (it's a non-empty string)
- `[0]` is truthy (it's a non-empty list, even though it contains zero)

**Visual elements:**
- Cards have a code-style font
- Correct placements glow green; incorrect placements glow red and bounce back
- Running score displayed prominently
- Brief explanation appears for each card on Check ("'0' is truthy because it's a non-empty string")

**Responsive:** Cards and bins resize with window; cards wrap to multiple rows on narrow screens

**Instructional Rationale:** A sorting/classification game supports the Apply level by requiring students to actively categorize values rather than passively reading a list. The "tricky" values (like `"0"` and `"False"`) directly address common misconceptions. Immediate feedback with explanations turns mistakes into learning moments.
</details>

## Chained Comparisons

Python has a neat feature that most programming languages don't: **chained comparisons**. Instead of writing two separate comparisons joined by `and`, you can chain them together naturally — just like you would in math.

In math, you write: \(0 \leq x \leq 100\)

In Python, you can write:

```python
>>> x = 50
>>> 0 <= x <= 100
True
>>> x = 150
>>> 0 <= x <= 100
False
```

This is equivalent to writing `0 <= x and x <= 100`, but the chained version is cleaner and easier to read. Python evaluates it left to right, checking each comparison in order.

You can chain as many comparisons as you want:

```python
>>> a, b, c = 1, 2, 3
>>> a < b < c
True
>>> 1 < 2 < 3 < 4 < 5
True
>>> 1 < 2 > 0 < 5
True
```

That last example is technically valid, but mixing directions like `<` and `>` in the same chain can be confusing. Stick to one direction for readability.

## Order of Operations for Booleans

Just like arithmetic has an order of operations (PEMDAS, anyone?), Boolean logic has its own **order of operations**. When Python evaluates an expression with multiple operators, it follows this priority:

| Priority | Operator | Description |
|----------|----------|-------------|
| 1 (highest) | `()` | Parentheses — always evaluated first |
| 2 | `not` | Boolean NOT |
| 3 | `and` | Boolean AND |
| 4 (lowest) | `or` | Boolean OR |

This means `not` binds tighter than `and`, which binds tighter than `or`. Consider this expression:

```python
>>> True or False and False
True
```

Without knowing the order of operations, you might read this left to right and get `False`. But Python evaluates `and` before `or`, so it's actually:

```python
>>> True or (False and False)  # and is evaluated first
True
```

Here's another example:

```python
>>> not False or True
True
>>> not (False or True)  # Parentheses change the result!
False
```

In the first line, `not False` is evaluated first (giving `True`), then `True or True` gives `True`. In the second line, the parentheses force `False or True` to evaluate first (giving `True`), then `not True` gives `False`.

**Pro tip:** When in doubt, use parentheses! Even if they're technically unnecessary, parentheses make your code easier to read. Writing `(A and B) or C` is much clearer than `A and B or C`, even though they mean the same thing. Your future self (and your classmates) will thank you.

Here's a complete example showing how Python evaluates a complex expression step by step:

```python
# Expression: not True or False and True

# Step 1: Evaluate 'not True'
# not True → False

# Step 2: Evaluate 'False and True'
# False and True → False

# Step 3: Evaluate 'False or False'
# False or False → False

>>> not True or False and True
False
```

The full priority order, including comparison and arithmetic operators, is:

| Priority | Category | Operators |
|----------|----------|-----------|
| 1 (highest) | Parentheses | `()` |
| 2 | Arithmetic | `**`, `*`, `/`, `//`, `%`, `+`, `-` |
| 3 | Comparison | `==`, `!=`, `>`, `<`, `>=`, `<=` |
| 4 | Boolean NOT | `not` |
| 5 | Boolean AND | `and` |
| 6 (lowest) | Boolean OR | `or` |

This means you can write expressions like `x + 1 > 5 and y * 2 < 10` and Python will handle the arithmetic first, then the comparisons, then the `and`.

#### Diagram: Order of Operations Visualizer

<iframe src="../../sims/boolean-order-of-ops/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Boolean Order of Operations Visualizer MicroSim</summary>
Type: microsim
**sim-id:** boolean-order-of-ops<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Analyze (L4)
**Bloom Verb:** trace, differentiate

**Learning Objective:** Students will be able to trace the step-by-step evaluation of complex Boolean expressions by applying the correct order of operations.

**Purpose:** A step-through visualizer that takes a compound Boolean expression and shows each evaluation step in order, highlighting which sub-expression is being evaluated at each stage.

**Layout:**
- Top: Title "Boolean Order of Operations"
- Expression display: Large code-styled text showing the full expression
- Step area: Below the expression, each step is shown as the expression is progressively simplified
- Bottom: Controls for stepping through

**Interactive controls:**
- Dropdown to select from preset expressions:
  - `not True or False and True`
  - `True and False or not False`
  - `not (True and False) or True`
  - `(True or False) and (not True or False)`
- "Step" button: advances one evaluation step
- "Auto Play" button: animates all steps with 1.5s delay
- "Reset" button: returns to the original expression
- Custom expression input field for student-entered expressions

**Visual elements:**
- The sub-expression being evaluated at each step is highlighted with a colored box
- After evaluation, the sub-expression is replaced by its result (True/False) with an animation
- Color coding: `not` operations in purple, `and` operations in blue, `or` operations in orange
- A sidebar shows the priority rules as a reminder
- Step counter: "Step N of M"

**Evaluation example for `not True or False and True`:**
1. Highlight `not True` → replace with `False` → display: `False or False and True`
2. Highlight `False and True` → replace with `False` → display: `False or False`
3. Highlight `False or False` → replace with `False` → Final result: `False`

**Responsive:** Expression text scales with window width; steps stack vertically
**Default state:** Shows `not True or False and True` ready to step through

**Instructional Rationale:** Step-through tracing is ideal for the Analyze level because students must decompose complex expressions into sub-expressions and track the order in which they're evaluated. The visual replacement animation makes the abstract evaluation process concrete and sequential. Color-coding by operator type reinforces the priority hierarchy.
</details>

## De Morgan's Laws: The Logic Flip

Now for one of the coolest (and most useful) rules in Boolean logic: **De Morgan's Laws**. Named after mathematician Augustus De Morgan, these laws tell you how to "flip" an expression involving `and`, `or`, and `not`.

De Morgan's Laws state:

- **Law 1:** `not (A and B)` is the same as `(not A) or (not B)`
- **Law 2:** `not (A or B)` is the same as `(not A) and (not B)`

In plain English:

- "It's NOT the case that both A and B are true" = "Either A is false, or B is false (or both)"
- "It's NOT the case that A or B is true" = "Both A and B are false"

Here's a real-world example. Say you're checking if someone is *not* eligible for a discount. The discount requires being a student *and* being under 25:

```python
# These two expressions are equivalent:
not (is_student and age < 25)
(not is_student) or (age >= 25)
```

Let's prove De Morgan's Laws with truth tables:

**Law 1:** `not (A and B)` vs. `(not A) or (not B)`

| A | B | A and B | not (A and B) | not A | not B | (not A) or (not B) |
|---|---|---------|---------------|-------|-------|---------------------|
| T | T | T | **F** | F | F | **F** |
| T | F | F | **T** | F | T | **T** |
| F | T | F | **T** | T | F | **T** |
| F | F | F | **T** | T | T | **T** |

The `not (A and B)` column and the `(not A) or (not B)` column are identical. The law holds!

**Law 2:** `not (A or B)` vs. `(not A) and (not B)`

| A | B | A or B | not (A or B) | not A | not B | (not A) and (not B) |
|---|---|--------|--------------|-------|-------|---------------------|
| T | T | T | **F** | F | F | **F** |
| T | F | T | **F** | F | T | **F** |
| F | T | T | **F** | T | F | **F** |
| F | F | F | **T** | T | T | **T** |

Again, the columns match perfectly.

!!! mascot-encourage "Monty says: You've got this!"
    ![Monty](../../img/monty-encourages.png){ align=left width="80" }
    De Morgan's Laws might seem abstract right now, but they're incredibly practical. When you start writing `if` statements with complex conditions, you'll often need to flip the logic. De Morgan's Laws tell you exactly how to do that without making mistakes. Stick with it — this knowledge will pay off big time!

Here's a quick-reference cheat sheet for De Morgan's Laws:

| Original | Equivalent (De Morgan) |
|----------|----------------------|
| `not (A and B)` | `(not A) or (not B)` |
| `not (A or B)` | `(not A) and (not B)` |

The pattern: when you push `not` through parentheses, `and` becomes `or`, and `or` becomes `and`. Everything flips!

#### Diagram: De Morgan's Laws Visualizer

<iframe src="../../sims/demorgans-laws/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>De Morgan's Laws Interactive Visualizer</summary>
Type: microsim
**sim-id:** demorgans-laws<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Analyze (L4)
**Bloom Verb:** prove, transform

**Learning Objective:** Students will be able to apply De Morgan's Laws to transform Boolean expressions and verify equivalence using side-by-side truth tables.

**Purpose:** An interactive demonstration that lets students see De Morgan's Laws in action by toggling values of A and B and watching both the original and transformed expressions evaluate simultaneously.

**Layout:**
- Top: Title "De Morgan's Laws Visualizer"
- Left panel: Law 1 — shows `not (A and B)` and `(not A) or (not B)` side by side
- Right panel: Law 2 — shows `not (A or B)` and `(not A) and (not B)` side by side
- Center: Toggle switches for A and B values
- Bottom: Auto-generated truth tables for both laws

**Interactive controls:**
- Toggle switch for A (True/False)
- Toggle switch for B (True/False)
- As A and B change, both expressions in each law evaluate in real-time
- Matching results glow green to show equivalence
- "Show Truth Table" button reveals the full 4-row truth table for each law
- "Apply to Custom Expression" input: enter an expression like `not (X and Y)` and see its De Morgan equivalent

**Visual elements:**
- Each expression shown in a large, code-styled display
- The `not` operator shown as a bar over the expression (mathematical notation) alongside the Python notation
- Color-coded: original in blue, De Morgan equivalent in orange
- When both expressions match (always), a "EQUIVALENT" badge animates between them
- Arrows show the transformation: `and` flipping to `or` (and vice versa) with animation

**Color scheme:** Blue for original expressions, orange for transformed, green for matching results
**Responsive:** Panels stack vertically on narrow screens

**Instructional Rationale:** Real-time evaluation with toggleable inputs lets students build intuition about the laws before memorizing them. Seeing both expressions update simultaneously provides immediate proof of equivalence. The visual transformation (and/or flip animation) makes the structural change memorable. This supports the Analyze level by requiring students to both observe and apply the transformation pattern.
</details>

## Putting It All Together

Let's combine everything you've learned in a real-world example. Imagine you're building a simple password checker. The password is valid if:

1. It's at least 8 characters long
2. It's not the same as the username
3. It contains at least one digit (we'll simplify this check)

```python
username = "gamer42"
password = "Py3thon!"

# Check all conditions
long_enough = len(password) >= 8
not_same = password != username
has_digit = any(char.isdigit() for char in password)

# Combine with 'and'
is_valid = long_enough and not_same and has_digit
print(is_valid)  # True
```

This example uses comparison operators (`>=`, `!=`), the `and` operator, truthiness (the `any()` function returns a Boolean), and even short-circuit evaluation (if `long_enough` is `False`, Python won't bother checking the other conditions).

Let's trace through the logic:

- `len("Py3thon!")` is 8, and `8 >= 8` is `True`
- `"Py3thon!" != "gamer42"` is `True`
- `"Py3thon!"` contains `"3"`, so `has_digit` is `True`
- `True and True and True` evaluates to `True`

The password passes! Boolean logic in action.

!!! mascot-celebration "Monty says: You've got this!"
    ![Monty](../../img/monty-celebrates.png){ align=left width="80" }
    Outstanding work, coder! You've just mastered the foundation of all decision-making in programming. Every `if` statement, every loop condition, every search filter — they all rely on the Boolean logic you learned in this chapter. In the next chapter, we'll put these skills to work with conditional statements. Get ready to make your programs *think*!

## Key Takeaways

- A **Boolean expression** evaluates to either `True` or `False` — there's no in-between.
- Python's six **comparison operators** (`==`, `!=`, `>`, `<`, `>=`, `<=`) compare values and return Booleans.
- The **equal** operator is `==` (double equals); the **assignment** operator is `=` (single equals). Don't mix them up!
- **Logical operators** combine Boolean expressions: `and` (both must be true), `or` (at least one must be true), `not` (flips the value).
- **Truth tables** show every possible combination of inputs and outputs for a logical expression.
- **Short-circuit evaluation** means Python stops evaluating as soon as it knows the result — `False and ...` stops immediately, as does `True or ...`.
- **Truthiness and falsiness**: Zero, empty containers, empty strings, and `None` are falsy. Everything else is truthy.
- **Boolean conversion** with `bool()` explicitly converts any value to `True` or `False`.
- **Chained comparisons** like `0 <= x <= 100` are a Pythonic shortcut for `0 <= x and x <= 100`.
- **Order of operations**: `not` before `and` before `or`. When in doubt, use parentheses!
- **De Morgan's Laws**: `not (A and B)` equals `(not A) or (not B)`, and `not (A or B)` equals `(not A) and (not B)`.

??? question "Check Your Understanding: What does `not (True and False)` evaluate to?"
    Let's work through it step by step:

    1. First, evaluate the inner expression: `True and False` = `False`
    2. Then apply `not`: `not False` = `True`

    The answer is **`True`**. You can also verify this with De Morgan's Law: `not (True and False)` = `(not True) or (not False)` = `False or True` = `True`. Same answer!

??? question "Check Your Understanding: Is the string `'0'` truthy or falsy in Python?"
    It's **truthy**! Even though the string contains the character "0", it's a *non-empty string*, and all non-empty strings are truthy. Remember, `bool("0")` returns `True`. Only the empty string `""` is falsy.

??? question "Check Your Understanding: Use De Morgan's Law to rewrite `not (x > 5 or y == 0)`."
    Applying De Morgan's second law (`not (A or B)` = `(not A) and (not B)`):

    `not (x > 5 or y == 0)` becomes `(not (x > 5)) and (not (y == 0))`

    Which simplifies to: **`x <= 5 and y != 0`**

    We flipped `>` to `<=` and `==` to `!=`, and changed `or` to `and`. De Morgan's Laws in action!
