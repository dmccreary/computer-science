---
title: Python Fundamentals
description: Essential building blocks of Python programming including the REPL, variables, data types, arithmetic, and input/output.
generated_by: claude skill chapter-content-generator
date: 2026-02-11
version: 0.04
---

# Python Fundamentals

## Summary

This chapter covers the essential building blocks of Python programming. Students will learn to use the Python REPL and write scripts, work with variables and data types (integers, floats, booleans, strings), perform arithmetic operations, handle type conversions, and use basic input/output. By the end of this chapter, students will be able to write simple Python programs that process data and produce output.

## Concepts Covered

This chapter covers the following 30 concepts from the learning graph:

1. Python REPL
2. Python Scripts
3. Comments in Code
4. Variables
5. Variable Assignment
6. Variable Naming Rules
7. Data Types
8. Integer Type
9. Float Type
10. Boolean Type
11. String Type
12. Type Function
13. Type Conversion
14. Implicit Type Conversion
15. Explicit Type Casting
16. Arithmetic Operators
17. Integer Division
18. Modulo Operator
19. Operator Precedence
20. String Concatenation
21. String Repetition
22. F-String Formatting
23. Print Function
24. Input Function
25. Multiple Assignment
26. Constants Convention
27. Augmented Assignment
28. Expressions
29. Statements
30. Code Readability

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Computer Science](../01-intro-to-computer-science/index.md)

---

!!! mascot-welcome "Monty says: Let's code this!"
    ![Monty](../../img/monty-welcome.png){ align=left width="80" }
    Welcome back, coders! Last chapter you learned how computers think. Now it's time to make them *do* things. You're about to write your very first Python code, work with variables, crunch numbers, and build small programs. By the end of this chapter, you'll be speaking Python. Let's code this!

## Two Ways to Run Python

Before we write any code, let's talk about *where* that code runs. Python gives you two ways to work: the REPL and scripts. Think of them like a calculator versus a word processor. One is great for quick answers; the other is for building something you want to keep.

### The Python REPL

The **Python REPL** stands for **R**ead, **E**valuate, **P**rint, **L**oop. It's Python's interactive mode — you type a command, Python reads it, evaluates it (figures out the answer), prints the result, and then loops back, waiting for your next command.

To start the REPL, open a terminal and type `python` (or `python3` on some systems). You'll see something like this:

```python
>>> 2 + 3
5
>>> "Hello, world!"
'Hello, world!'
```

The `>>>` is Python's prompt, telling you it's ready for input. The REPL is perfect for experimenting. Want to know what `7 * 8` is? Just type it in and hit Enter. Want to test whether a piece of code works? Try it in the REPL first. It's your coding sandbox.

### Python Scripts

The REPL is great for quick experiments, but what if you want to save your work and run it again later? That's where **Python scripts** come in. A script is just a plain text file (ending in `.py`) that contains Python code. When you run the script, Python executes every line from top to bottom.

Here's a simple script saved as `hello.py`:

```python
# My first Python script
name = "Monty"
print("Hello, " + name + "!")
print("Welcome to Python!")
```

You run it from the terminal with:

```
python hello.py
```

And the output is:

```
Hello, Monty!
Welcome to Python!
```

Scripts are how real programs are built. You write the code, save it, test it, fix any bugs, and run it again. Throughout this course, you'll write plenty of scripts.

### Comments in Code

Did you notice the line that starts with `#` in the script above? That's a **comment**. Comments are notes you write for *humans* — Python ignores them completely. They're like sticky notes on your code, explaining what's happening and why.

```python
# This is a comment — Python skips this line
print("This runs!")  # You can also put comments at the end of a line
```

Good comments explain *why* you did something, not just *what* you did. Compare these:

```python
# Bad comment — just restates the code
x = 10  # set x to 10

# Good comment — explains the purpose
x = 10  # starting score for a new player
```

Write comments for your future self. Trust us — when you look at your code two weeks from now, you'll be glad you left some notes.

#### Diagram: Python REPL vs. Scripts

<iframe src="../../sims/repl-vs-scripts/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Python REPL vs. Scripts Interactive Comparison</summary>
Type: microsim
**sim-id:** repl-vs-scripts<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Understand (L2)
**Bloom Verb:** compare, distinguish

**Learning Objective:** Students will be able to distinguish between interactive REPL mode and script mode, understanding when to use each approach.

**Layout:**
- Split screen: left half labeled "REPL (Interactive Mode)", right half labeled "Script Mode"
- Left side: simulated terminal with `>>>` prompt where students can type simple expressions and see immediate output
- Right side: a mini code editor area showing a multi-line script, with a "Run" button that executes all lines sequentially and shows output below

**Interactive elements:**
- Left (REPL): A text input field with `>>>` prompt. Students type simple expressions (e.g., `2+3`, `"hello"`) and see the result appear below, then a new prompt appears
- Right (Script): A pre-loaded 4-line script. Students click "Run" to see lines highlight one by one as they execute, with output appearing in a console panel below
- "Switch Example" button cycles through 3 different example scripts
- A comparison table at the bottom highlights key differences (immediate feedback vs. saved & reusable, experimenting vs. building programs)

**Visual style:** Terminal-like dark background with green/white text on REPL side; light editor theme with syntax highlighting on script side
**Responsive:** Both panels stack vertically on narrow screens

**Instructional Rationale:** Side-by-side interaction lets students directly experience the difference between REPL and script execution models. Typing in the simulated REPL reinforces the read-evaluate-print-loop concept, while watching sequential script execution builds understanding of top-to-bottom program flow.
</details>

## Variables: Labeled Boxes for Your Data

Now let's talk about one of the most important ideas in programming: **variables**. A variable is like a labeled box where you store a value. You give it a name — like `score` or `player_name` — and Python remembers what's inside. You can peek at the value, change it, or use it in calculations.

### Variable Assignment

Creating a variable is called **variable assignment**. You use the `=` sign (called the assignment operator) to put a value into a variable:

```python
score = 100
player_name = "Ada"
is_playing = True
```

After these lines run, Python has three labeled boxes in memory:

- `score` contains `100`
- `player_name` contains `"Ada"`
- `is_playing` contains `True`

You can change what's in a variable at any time — just assign it a new value:

```python
score = 100
print(score)   # Output: 100
score = 250
print(score)   # Output: 250
```

The old value (100) is gone, replaced by 250. Variables are *variable* — they can change. (Who would have guessed?)

### Variable Naming Rules

Not just any name will work. Python has **variable naming rules** you need to follow:

| Rule | Valid Example | Invalid Example | Why It Fails |
|------|--------------|----------------|--------------|
| Must start with a letter or underscore | `score`, `_count` | `2fast` | Starts with a digit |
| Can contain letters, digits, underscores | `player_1`, `high_score` | `my-name` | Hyphens not allowed |
| Case-sensitive | `Score` and `score` are different | — | — |
| Can't be a Python keyword | `total` | `class`, `if`, `for` | These are reserved words |

Python conventions also recommend:

- Use `snake_case` for variable names: `player_score`, not `playerScore` or `PlayerScore`
- Choose descriptive names: `temperature` is better than `t`
- Avoid single-letter names (except in short loops — we'll get to those later)

!!! mascot-warning "Monty says: Watch out!"
    ![Monty](../../img/monty-warning.png){ align=left width="80" }
    A common beginner mistake is confusing `=` (assignment) with `==` (equality check). Writing `score = 100` *stores* 100 in score. Writing `score == 100` *asks* "is score equal to 100?" They look similar but do very different things!

### Multiple Assignment

Python has a neat shortcut called **multiple assignment** that lets you assign values to several variables in one line:

```python
x, y, z = 10, 20, 30
```

This creates three variables at once: `x` is 10, `y` is 20, and `z` is 30. You can even swap two variables without a temporary variable:

```python
a, b = 5, 10
a, b = b, a    # Now a is 10 and b is 5 — Python magic!
```

In most other languages, swapping two variables requires three lines and a temporary variable. Python makes it a one-liner. Pretty slick.

### Constants Convention

Sometimes you have a value that should never change — like the speed of light or the number of lives in a game. In Python, there's no way to truly *lock* a variable, but there is a **constants convention**: name it in ALL_CAPS with underscores.

```python
MAX_LIVES = 3
PI = 3.14159
GRAVITY = 9.8
```

When other programmers (or your future self) see `MAX_LIVES`, they know: "Don't change this value." It's a social contract, not a technical enforcement. Python trusts you. Don't break that trust.

## Data Types: What Kind of Stuff Is in the Box?

Every value in Python has a **data type** that tells Python what kind of thing it is. Just like you wouldn't store soup in a paper bag, Python needs to know whether it's dealing with a number, some text, or a true/false value.

Python has several built-in data types, but we'll focus on the four most important ones for now:

| Data Type | Python Name | Example Values | What It Stores |
|-----------|-------------|---------------|----------------|
| **Integer** | `int` | `42`, `-7`, `0` | Whole numbers |
| **Float** | `float` | `3.14`, `-0.5`, `2.0` | Decimal numbers |
| **Boolean** | `bool` | `True`, `False` | Yes/no values |
| **String** | `str` | `"hello"`, `'Python'` | Text |

### Integer Type

The **integer type** (`int`) stores whole numbers — no decimal point. Integers can be positive, negative, or zero:

```python
age = 16
temperature = -5
count = 0
really_big = 1000000000    # Python handles big numbers just fine
```

Python integers have no size limit. You can store numbers with hundreds of digits if you need to. (You probably won't, but it's nice to know.)

### Float Type

The **float type** (`float`) stores numbers with a decimal point. The name "float" comes from "floating point," which is how computers represent decimal numbers internally.

```python
price = 9.99
pi = 3.14159
negative_temp = -40.0
```

One important gotcha: floating-point arithmetic isn't always perfectly precise. Try this in the REPL:

```python
>>> 0.1 + 0.2
0.30000000000000004
```

Wait, what? That's not 0.3! This happens because computers store decimals in binary, and some decimal fractions (like 0.1) can't be represented exactly in binary. It's like trying to write 1/3 in decimal — you get 0.333333... forever. For this course, you usually won't notice this, but it's good to know it exists.

### Boolean Type

The **boolean type** (`bool`) has only two possible values: `True` and `False`. (Note the capital T and F — Python is picky about that.)

```python
is_sunny = True
game_over = False
has_permission = True
```

Booleans are named after George Boole, a mathematician who developed the algebra of logic in the 1800s. We'll use booleans *a lot* in Chapter 3 when we cover Boolean logic. For now, just know they represent yes/no, on/off, true/false answers.

### String Type

The **string type** (`str`) stores text — any sequence of characters. You create a string by wrapping text in quotes (either single or double quotes):

```python
greeting = "Hello, world!"
name = 'Monty'
empty = ""                  # An empty string is still a string
long_text = "Python is fun and I'm learning a lot!"
```

Strings can contain letters, digits, spaces, punctuation — anything you can type. We'll do much more with strings later (Chapter 5 is all about them), but for now, just know they're how Python handles text.

#### Diagram: Python Data Types Overview

<iframe src="../../sims/python-data-types/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Python Data Types Interactive Overview</summary>
Type: infographic
**sim-id:** python-data-types<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Remember (L1)
**Bloom Verb:** identify, classify

**Learning Objective:** Students will be able to identify the four fundamental Python data types (int, float, bool, str) and classify example values into the correct type.

**Layout:**
- Four large colored cards arranged in a 2x2 grid, one for each data type
- Each card shows: type name, Python keyword, 3-4 example values, a real-world analogy icon
- Below the cards: a "Type Sorter" challenge area

**Cards:**
1. Integer (blue): `int` — examples: `42`, `-7`, `0`, `1000` — icon: counting blocks
2. Float (green): `float` — examples: `3.14`, `-0.5`, `2.0`, `99.99` — icon: ruler with tick marks
3. Boolean (orange): `bool` — examples: `True`, `False` — icon: light switch
4. String (purple): `str` — examples: `"hello"`, `'Python'`, `""`, `"42"` — icon: speech bubble

**Interactive elements:**
- Hover over any card to see it enlarge slightly and display a more detailed description
- "Type Sorter" challenge: 8 random values appear at the bottom. Students drag each value to the correct type card. Correct placements glow green; incorrect placements bounce back with a hint
- "New Round" button generates a new set of values for the challenge
- Score counter tracks correct placements

**Visual style:** Rounded cards with soft shadows, clean typography, color-coded borders
**Responsive:** Cards stack in a single column on narrow screens; challenge area adjusts accordingly

**Instructional Rationale:** Card-based visual categorization supports the Remember level by associating type names with concrete examples. The drag-and-drop sorting activity provides immediate feedback and active recall practice, which is more effective than passive reading.
</details>

### The Type Function

How do you check what type a value is? Use the **type function**:

```python
>>> type(42)
<class 'int'>
>>> type(3.14)
<class 'float'>
>>> type(True)
<class 'bool'>
>>> type("hello")
<class 'str'>
```

The `type()` function is like asking Python, "Hey, what kind of thing is this?" It's especially useful when debugging — if your code isn't working, checking types can help you figure out what went wrong.

You can also use `type()` on variables:

```python
score = 100
print(type(score))    # Output: <class 'int'>
```

!!! mascot-thinking "Monty says: You've got this!"
    ![Monty](../../img/monty-thinking.png){ align=left width="80" }
    Here's something sneaky: `"42"` and `42` look similar but are totally different types. `"42"` is a *string* (text that happens to contain digits), while `42` is an *integer* (an actual number you can do math with). Try `type("42")` in the REPL — you'll see it's `str`, not `int`!

## Type Conversion: Changing One Type to Another

Sometimes you need to change a value from one type to another. This is called **type conversion**, and Python handles it in two ways.

### Implicit Type Conversion

**Implicit type conversion** happens automatically when Python needs to. For example, if you add an integer and a float, Python automatically converts the integer to a float:

```python
>>> 5 + 2.0
7.0
```

Python *implicitly* converted `5` (an int) to `5.0` (a float) before doing the addition. It chose float because float can hold more information (decimal places) without losing anything. This is also called "type promotion" — the smaller type gets promoted to the bigger type.

### Explicit Type Casting

**Explicit type casting** is when *you* tell Python to convert a value. You use the type name as a function:

```python
# String to integer
age_text = "16"
age_number = int(age_text)     # Now it's the integer 16

# Integer to float
whole = 7
decimal = float(whole)          # Now it's 7.0

# Number to string
score = 100
score_text = str(score)         # Now it's the string "100"

# String to float
price_text = "9.99"
price = float(price_text)       # Now it's the float 9.99
```

Type casting is essential when working with user input (since the `input()` function always returns a string — more on that soon).

Be careful, though — not every conversion makes sense:

```python
>>> int("hello")
ValueError: invalid literal for int() with base 10: 'hello'
```

Python can't turn the word "hello" into a number. When a conversion fails, Python raises an error. We'll learn how to handle errors gracefully in Chapter 14.

## Arithmetic Operators: Python as a Calculator

One of the first things most people do with Python is math. Python supports all the standard **arithmetic operators** you'd expect, plus a couple of extras.

| Operator | Name | Example | Result |
|----------|------|---------|--------|
| `+` | Addition | `7 + 3` | `10` |
| `-` | Subtraction | `7 - 3` | `4` |
| `*` | Multiplication | `7 * 3` | `21` |
| `/` | Division | `7 / 3` | `2.3333...` |
| `//` | Integer Division | `7 // 3` | `2` |
| `%` | Modulo | `7 % 3` | `1` |
| `**` | Exponentiation | `7 ** 3` | `343` |

The first four should look familiar from math class. Let's dig into the ones that might be new.

### Integer Division

Regular division (`/`) always gives you a float result, even if it divides evenly:

```python
>>> 10 / 2
5.0
```

But **integer division** (`//`) chops off the decimal part and gives you a whole number:

```python
>>> 7 // 3
2
>>> 10 // 3
3
>>> -7 // 2
-4
```

Think of integer division as asking: "How many whole times does 3 fit into 7?" The answer is 2 (with some left over). Integer division is useful when you need whole-number results, like figuring out how many full teams of 5 you can make from 23 students.

### Modulo Operator

The **modulo operator** (`%`) gives you the *remainder* after integer division:

```python
>>> 7 % 3
1
>>> 10 % 3
1
>>> 12 % 4
0
```

Modulo is incredibly useful. Here are some common tricks:

- **Check if a number is even:** `number % 2 == 0` (if the remainder when dividing by 2 is 0, it's even)
- **Check if a number is odd:** `number % 2 == 1`
- **Wrap around:** If you have 12 hours on a clock and add 5 hours to 10 o'clock, you get `(10 + 5) % 12 = 3` o'clock

Integer division and modulo are partners. They answer: "How many full groups, and how many left over?"

```python
students = 23
team_size = 5
full_teams = students // team_size    # 4 full teams
leftover = students % team_size       # 3 students left over
```

#### Diagram: Arithmetic Operators Explorer

<iframe src="../../sims/arithmetic-operators/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Arithmetic Operators Interactive Explorer</summary>
Type: microsim
**sim-id:** arithmetic-operators<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Apply (L3)
**Bloom Verb:** calculate, use

**Learning Objective:** Students will be able to apply Python's seven arithmetic operators to compute correct results, with special attention to integer division and modulo.

**Layout:**
- Top section: Two number input fields (A and B) with a dropdown to select an operator (+, -, *, /, //, %, **)
- Middle section: A large display showing the expression and result (e.g., "7 // 3 = 2")
- Below that: A visual explanation area that changes based on the operator selected
- Bottom section: A "Challenge Mode" with random arithmetic problems for students to solve

**Operator-specific visual explanations:**
- For `//` (integer division): Show a bar divided into groups, highlighting full groups and leftover
- For `%` (modulo): Show the same bar but highlight the remainder portion
- For `**` (exponentiation): Show repeated multiplication (e.g., 2**3 = 2 x 2 x 2 = 8)
- For `/` (division): Show decimal result on a number line

**Interactive elements:**
- Adjust A and B using number inputs or up/down buttons
- Select operator from dropdown
- Result updates in real-time as inputs change
- "Challenge Mode" button: presents a random expression and asks the student to predict the result before revealing the answer
- Score counter for challenge mode

**Visual style:** Calculator-inspired layout with large, readable digits; color-coded operators
**Responsive:** Single-column layout on narrow screens

**Instructional Rationale:** Direct manipulation of operands and operators supports the Apply level by letting students experiment with different combinations and immediately observe results. The visual explanation for integer division and modulo addresses the most common confusion points. Challenge mode promotes active recall.
</details>

### Operator Precedence

When you have an expression with multiple operators, Python follows **operator precedence** rules (just like math class). Here's the order from highest to lowest:

| Priority | Operator | Description |
|----------|----------|-------------|
| 1 (highest) | `**` | Exponentiation |
| 2 | `*`, `/`, `//`, `%` | Multiplication, Division, Integer Division, Modulo |
| 3 (lowest) | `+`, `-` | Addition, Subtraction |

Operators with the same priority are evaluated left to right.

```python
>>> 2 + 3 * 4
14        # Multiplication first: 3*4=12, then 2+12=14

>>> (2 + 3) * 4
20        # Parentheses override precedence: 2+3=5, then 5*4=20

>>> 2 ** 3 ** 2
512       # Exponentiation is right-to-left: 3**2=9, then 2**9=512
```

When in doubt, use parentheses! They make your code clearer and ensure Python does the math in the order you expect. Even if they're technically unnecessary, parentheses can make your code easier to read:

```python
# Both are correct, but the second is clearer
result = a * b + c / d
result = (a * b) + (c / d)
```

### Augmented Assignment

Once you start doing math with variables, you'll often want to update a variable based on its current value. Python provides **augmented assignment** operators as a shortcut:

```python
score = 100

# The long way
score = score + 10    # score is now 110

# The shortcut (augmented assignment)
score += 10           # score is now 120

# Works with other operators too
score -= 5            # score is now 115
score *= 2            # score is now 230
score //= 10          # score is now 23
```

Here's the full list:

| Augmented | Equivalent To |
|-----------|--------------|
| `x += 5` | `x = x + 5` |
| `x -= 5` | `x = x - 5` |
| `x *= 5` | `x = x * 5` |
| `x /= 5` | `x = x / 5` |
| `x //= 5` | `x = x // 5` |
| `x %= 5` | `x = x % 5` |
| `x **= 5` | `x = x ** 5` |

Augmented assignment saves typing and makes your intentions clearer. When you see `score += 10`, you instantly know "add 10 to the score."

## Working with Strings

Numbers are great, but programs also need to work with text. Let's look at some fun things you can do with strings.

### String Concatenation

**String concatenation** means joining two strings together using the `+` operator:

```python
first = "Hello"
second = "World"
greeting = first + " " + second
print(greeting)    # Output: Hello World
```

Notice we added `" "` (a space) in the middle. Without it, we'd get `"HelloWorld"` — the strings are glued together exactly as-is.

You can't concatenate a string and a number directly — Python will complain:

```python
>>> "Score: " + 100
TypeError: can only concatenate str (not "int") to str
```

You need to convert the number to a string first using `str()`:

```python
print("Score: " + str(100))    # Output: Score: 100
```

### String Repetition

**String repetition** uses the `*` operator to repeat a string:

```python
>>> "ha" * 3
'hahaha'
>>> "-" * 40
'----------------------------------------'
```

This is surprisingly useful for creating visual separators, padding, or just making your output look nice.

### F-String Formatting

Converting types manually with `str()` gets tedious. Python's **f-string formatting** is a much cleaner way to mix variables and text. Just put an `f` before the opening quote and wrap variables in curly braces `{}`:

```python
name = "Ada"
score = 95
print(f"Player {name} scored {score} points!")
# Output: Player Ada scored 95 points!
```

F-strings automatically handle type conversion — you don't need to call `str()`. You can even put expressions inside the braces:

```python
price = 19.99
tax_rate = 0.08
print(f"Total: ${price * (1 + tax_rate):.2f}")
# Output: Total: $21.59
```

The `:.2f` part is a format specifier that rounds to 2 decimal places — handy for money! F-strings are the modern, preferred way to format strings in Python. You'll use them constantly.

#### Diagram: String Operations Playground

<iframe src="../../sims/string-operations/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>String Operations Interactive Playground</summary>
Type: microsim
**sim-id:** string-operations<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Apply (L3)
**Bloom Verb:** construct, demonstrate

**Learning Objective:** Students will be able to construct string expressions using concatenation, repetition, and f-string formatting, and predict the output of string operations.

**Layout:**
- Top section: Two text input fields labeled "String A" and "String B" with default values "Hello" and "World"
- Middle section: Three operation panels side by side:
  - Panel 1 "Concatenation": Shows `A + " " + B` and result
  - Panel 2 "Repetition": Shows `A * N` with a slider for N (1-10) and result
  - Panel 3 "F-String": Shows `f"Dear {A}, welcome to {B}!"` and result
- Bottom section: A "Build Your Own" text area where students can type string expressions and see live results

**Interactive elements:**
- Editing String A or String B immediately updates all three panels
- Repetition slider changes the repeat count in real-time
- "Build Your Own" area: students type expressions like `"ha" * 5` or `A + "!" * 3` and click "Evaluate" to see the result
- A gallery of 5 example expressions students can click to load into the "Build Your Own" area

**Visual style:** Clean panels with colored borders (green for concatenation, blue for repetition, purple for f-strings); string values displayed in monospace font
**Responsive:** Panels stack vertically on narrow screens

**Instructional Rationale:** Immediate visual feedback when editing input strings supports the Apply level by letting students experiment freely. Three operations shown simultaneously helps students compare and contrast them. The "Build Your Own" area encourages creative exploration beyond the provided examples.
</details>

## Input and Output: Talking to the User

Programs need to communicate. The **print function** sends information *out* to the user, and the **input function** brings information *in* from the user.

### The Print Function

You've already seen `print()` in action. The **print function** displays text on the screen:

```python
print("Hello!")                   # Output: Hello!
print(42)                         # Output: 42
print("Score:", 100)              # Output: Score: 100
print("A", "B", "C")             # Output: A B C
```

Notice that when you pass multiple values separated by commas, `print()` puts a space between each one. You can change the separator and the ending character:

```python
print("2025", "02", "11", sep="-")    # Output: 2025-02-11
print("Loading", end="...")            # Output: Loading...  (no newline)
```

### The Input Function

The **input function** pauses your program and waits for the user to type something. Whatever they type becomes a string:

```python
name = input("What's your name? ")
print(f"Nice to meet you, {name}!")
```

When this runs, the user sees:

```
What's your name? Ada
Nice to meet you, Ada!
```

Here's the critical thing to remember: **`input()` always returns a string**, even if the user types a number. If you want to do math with the input, you need to convert it:

```python
age_text = input("How old are you? ")    # This is a string like "16"
age = int(age_text)                       # Now it's the integer 16
next_year = age + 1
print(f"Next year you'll be {next_year}!")
```

Or you can do it in one line:

```python
age = int(input("How old are you? "))
```

!!! mascot-tip "Monty says: Let's debug this together!"
    ![Monty](../../img/monty-tip.png){ align=left width="80" }
    Here's a common debugging trick: if your math isn't working, check whether your variable is accidentally a string. Use `type()` to verify. If `type(age)` shows `<class 'str'>`, you forgot to convert!

## Expressions and Statements

Let's step back and learn two important vocabulary words that programmers use all the time.

An **expression** is any piece of code that *produces a value*. Think of it like a question that Python answers:

```python
2 + 3             # Expression that produces 5
x * 10            # Expression that produces x times 10
len("hello")      # Expression that produces 5
score > 100       # Expression that produces True or False
```

A **statement** is a complete instruction that Python *carries out*. It *does* something rather than just producing a value:

```python
x = 10                    # Assignment statement
print("Hello!")           # Print statement
name = input("Name? ")    # Statement that assigns user input
```

Here's the easy way to remember: **expressions produce values, statements perform actions.** Some statements contain expressions. For example, `x = 2 + 3` is a statement that contains the expression `2 + 3`.

#### Diagram: Expressions vs. Statements

<iframe src="../../sims/expressions-vs-statements/main.html" width="100%" height="450px" scrolling="no"></iframe>

<details markdown="1">
<summary>Expressions vs Statements Sorting Activity</summary>
Type: microsim
**sim-id:** expressions-vs-statements<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Understand (L2)
**Bloom Verb:** classify, distinguish

**Learning Objective:** Students will be able to classify Python code fragments as expressions (produce a value) or statements (perform an action) and explain the difference.

**Layout:**
- Top: Title and brief definition reminders ("Expression = produces a value" / "Statement = performs an action")
- Middle: A queue of 10 code fragments displayed as draggable cards, one at a time
- Bottom: Two labeled drop zones — "Expression" (left, blue) and "Statement" (right, green)

**Code fragment examples:**
1. `2 + 3` (expression)
2. `x = 10` (statement)
3. `print("hi")` (statement)
4. `len("hello")` (expression)
5. `score > 100` (expression)
6. `name = input("?")` (statement)
7. `7 * 8` (expression)
8. `x += 1` (statement)
9. `True` (expression)
10. `"hello" + " world"` (expression)

**Interactive elements:**
- Drag each card to the correct zone
- Correct placement: card slots in with a green checkmark and a one-line explanation
- Incorrect placement: card bounces back with a hint (e.g., "This produces a value — it's an expression!")
- Progress bar shows how many of 10 are classified
- "Reset" button to start over
- Final score and summary displayed after all 10 are classified

**Visual style:** Card-based UI with code in monospace font; blue and green drop zones with dashed borders
**Responsive:** Cards and zones stack vertically on narrow screens

**Instructional Rationale:** A sorting/classification activity directly targets the Understand level by requiring students to apply the definition to concrete examples. Immediate feedback with explanations reinforces correct mental models. Seeing many examples helps students build intuition about the expression/statement distinction.
</details>

## Code Readability: Writing Code Humans Can Read

Here's a truth that surprises many beginners: code is read far more often than it's written. You write a line of code once, but you (and others) might read it dozens of times. That's why **code readability** matters so much.

Python was designed with readability as a core value. Its creator, Guido van Rossum, famously said: "Code is read much more often than it is written." Here are some guidelines to keep your code clean and readable:

**Use meaningful variable names:**

```python
# Hard to read — what do these mean?
x = 16
y = 5.5
z = x * y

# Easy to read — names tell the story
age = 16
hourly_wage = 5.5
weekly_pay = age * hourly_wage   # Hmm, actually this formula doesn't make sense...
# See? Good names help you spot logic errors too!
```

**Add whitespace around operators:**

```python
# Cramped and hard to read
result=a*b+c/d-e

# Spacious and clear
result = a * b + c / d - e
```

**Use blank lines to separate logical sections:**

```python
# Get user information
name = input("Name: ")
age = int(input("Age: "))

# Calculate result
birth_year = 2026 - age

# Display output
print(f"{name}, you were born around {birth_year}.")
```

**Keep lines short** (under 79 characters is the Python convention) and write comments that explain *why*, not *what*.

Good readability isn't just being nice to other people — it's being nice to yourself. Future You will thank Present You for writing clear code.

#### Diagram: Code Readability Comparison

<iframe src="../../sims/code-readability/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Code Readability Before-and-After Comparison</summary>
Type: infographic
**sim-id:** code-readability<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Evaluate (L5)
**Bloom Verb:** critique, improve

**Learning Objective:** Students will be able to evaluate Python code for readability and identify specific improvements (naming, spacing, comments, structure).

**Layout:**
- Split screen: left side "Before" (poorly written code), right side "After" (improved version)
- Below: a checklist of readability improvements applied
- Navigation: "Next Example" button cycles through 4 before/after pairs

**Example pairs:**
1. Variable naming: `x = 16` vs `student_age = 16`
2. Spacing: `result=a*b+c` vs `result = a * b + c`
3. Comments: No comments vs helpful comments explaining why
4. Structure: One long block vs logically separated sections with blank lines

**Interactive elements:**
- Hover over any highlighted difference to see a tooltip explaining the improvement
- "Show Differences" toggle highlights the changes between before and after in yellow
- "Next Example" button cycles through the 4 pairs
- A "Try It Yourself" panel at the bottom shows a messy code snippet and lets students type an improved version, with a "Check" button that compares against the clean version

**Visual style:** Code editor theme with syntax highlighting; left side has a slight red tint (bad), right side has a slight green tint (good)
**Responsive:** Before/After panels stack vertically on narrow screens

**Instructional Rationale:** Side-by-side comparison directly supports the Evaluate level by asking students to identify and judge code quality differences. The "Try It Yourself" component promotes transfer from observation to practice. Multiple examples cover the main readability dimensions (naming, spacing, comments, structure).
</details>

## Putting It All Together: A Complete Program

Let's combine everything from this chapter into a complete program. This script asks the user for information, does some calculations, and displays the results using f-strings:

```python
# Temperature Converter: Fahrenheit to Celsius
# Formula: C = (F - 32) * 5/9

# Constants
FREEZING_POINT = 32
CONVERSION_FACTOR = 5 / 9

# Get input from the user
fahrenheit = float(input("Enter temperature in Fahrenheit: "))

# Calculate Celsius
celsius = (fahrenheit - FREEZING_POINT) * CONVERSION_FACTOR

# Display the result
print(f"{fahrenheit}°F is equal to {celsius:.1f}°C")

# Bonus: Tell the user if water would freeze
if celsius <= 0:
    print("Brrr! Water would freeze at this temperature!")
else:
    print("Above freezing — no ice today!")
```

Look at how many concepts from this chapter appear in just this small program:

- **Comments** explaining the purpose
- **Constants** in ALL_CAPS (`FREEZING_POINT`, `CONVERSION_FACTOR`)
- **Input function** getting data from the user
- **Explicit type casting** with `float()`
- **Variables** with descriptive names
- **Arithmetic operators** (`-`, `*`, `/`)
- **F-string formatting** with `:.1f` for one decimal place
- **Print function** for output
- **Code readability** through spacing, comments, and logical sections

That's the power of Python fundamentals — a handful of building blocks can create real, useful programs.

!!! mascot-celebration "Monty says: You've got this!"
    ![Monty](../../img/monty-celebrates.png){ align=left width="80" }
    Amazing work, coder! You just learned the essential building blocks of Python — variables, data types, operators, input, output, and more. These fundamentals are the foundation for everything we'll build in this course. Next chapter, we'll dive into Boolean logic and making decisions in code. See you there!

## Key Takeaways

- The **Python REPL** lets you experiment interactively; **scripts** let you save and run programs from files.
- **Comments** (`#`) explain your code to humans — Python ignores them.
- **Variables** store values. Use **variable assignment** (`=`) to create them, and follow **variable naming rules** (start with a letter/underscore, use `snake_case`).
- Python has four core **data types**: **integers** (`int`), **floats** (`float`), **booleans** (`bool`), and **strings** (`str`).
- Use the **type function** (`type()`) to check a value's type.
- **Type conversion** can happen implicitly (Python does it automatically) or explicitly (you use `int()`, `float()`, `str()`).
- **Arithmetic operators** include `+`, `-`, `*`, `/`, `//` (integer division), `%` (modulo), and `**` (exponentiation).
- **Operator precedence** follows math rules: exponentiation first, then multiplication/division, then addition/subtraction. Use parentheses to be clear.
- **String concatenation** (`+`) joins strings, **string repetition** (`*`) repeats them, and **f-strings** (`f"..."`) let you embed variables and expressions.
- The **print function** displays output; the **input function** reads text from the user (always returns a string!).
- **Multiple assignment** lets you set several variables in one line. **Augmented assignment** (`+=`, `-=`, etc.) updates a variable based on its current value.
- **Constants** use ALL_CAPS names by convention. **Expressions** produce values; **statements** perform actions.
- **Code readability** matters — use descriptive names, add spaces, write helpful comments, and organize your code into logical sections.

??? question "Check Your Understanding: What is the result of `17 // 5` and `17 % 5`?"
    `17 // 5` equals **3** (17 divided by 5 is 3 with a remainder). `17 % 5` equals **2** (the remainder when 17 is divided by 5). Together they tell you: 5 fits into 17 **three** full times with **2** left over.

??? question "Check Your Understanding: Why does `input()` always return a string, and what should you do about it?"
    The `input()` function returns a **string** because it captures raw text from the keyboard — it has no way to know if the user intended to type a number or actual text. If you need a number, you must **explicitly cast** it using `int()` or `float()`. For example: `age = int(input("Age: "))`.

??? question "Check Your Understanding: What's the difference between `=` and `==` in Python?"
    `=` is the **assignment operator** — it stores a value in a variable (e.g., `score = 100` puts 100 into score). `==` is the **equality operator** — it *checks* whether two values are equal and produces a boolean result (e.g., `score == 100` evaluates to `True` or `False`). Mixing them up is one of the most common beginner mistakes!
