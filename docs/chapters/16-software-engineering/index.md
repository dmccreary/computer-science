---
title: Software Engineering Practices
description: Software development lifecycle, modules, packages, Git, PEP 8, refactoring, DRY/KISS principles, and documentation in Python.
generated_by: claude skill chapter-content-generator
date: 2026-02-11
version: 0.04
---

# Software Engineering Practices

## Summary

This chapter introduces the practices and tools used in professional software development. Students will learn about the software development lifecycle, modular design principles (DRY, KISS), code organization with Python modules and packages, the pip package manager, and virtual environments. The chapter covers version control with Git, code style with PEP 8, linting tools, refactoring techniques, and writing documentation. Students will also learn the `if __name__ == "__main__"` pattern for writing reusable modules.

## Concepts Covered

This chapter covers the following 21 concepts from the learning graph:

1. Software Development
2. Program Planning
3. Requirements Analysis
4. Modular Design
5. Code Organization
6. Import Statements
7. Python Modules
8. Python Packages
9. Pip Package Manager
10. Virtual Environments
11. Version Control Intro
12. Git Basics
13. Code Style
14. PEP 8 Guidelines
15. Linting Tools
16. Refactoring
17. DRY Principle
18. KISS Principle
19. Code Comments
20. Documentation
21. Name Equals Main

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Computer Science](../01-intro-to-computer-science/index.md)
- [Chapter 2: Python Fundamentals](../02-python-fundamentals/index.md)
- [Chapter 6: Functions and Modular Design](../06-functions-and-modular-design/index.md)
- [Chapter 14: Errors and Exceptions](../14-errors-and-exceptions/index.md)
- [Chapter 15: File Input and Output](../15-file-input-and-output/index.md)

---

!!! mascot-welcome "Monty says: Let's code this!"
    ![Monty](../../img/monty-welcome.png){ align=left width="80" }
    Welcome back, coders! Up until now, you've been learning *how* to program. In this chapter, you'll learn how to program *like a professional*. We're talking about the habits, tools, and practices that real software engineers use every single day. These skills will take your code from "it works on my machine" to "it works everywhere, and anyone can read it." Let's level up!

## What Is Software Development?

Writing a program isn't just about typing code until it works. **Software development** is the entire process of creating software — from figuring out what problem you're solving, to planning your approach, writing the code, testing it, and maintaining it over time.

Think of it like building a house. You wouldn't start hammering nails without a blueprint, right? You'd figure out what kind of house you need, draw up plans, gather materials, build it step by step, and then inspect the result. Software development works the same way.

Professional developers follow a structured process called the **software development lifecycle** (SDLC). Here are the key stages:

| Stage | What Happens | House Analogy |
|-------|-------------|---------------|
| **Planning** | Define what the software should do | Decide you need a 3-bedroom house |
| **Analysis** | Gather detailed requirements | Figure out room sizes, budget, materials |
| **Design** | Plan the architecture and structure | Draw blueprints and floor plans |
| **Implementation** | Write the actual code | Build the house |
| **Testing** | Check that everything works | Home inspection |
| **Maintenance** | Fix bugs and add features over time | Repairs, renovations |

You don't need to memorize every formal methodology (there are many!), but understanding that coding is just one part of a bigger process will make you a much stronger developer.

## Program Planning and Requirements

### Program Planning

Before you write a single line of code, you should have a plan. **Program planning** means deciding what your program needs to do, how you'll structure it, and what tools or techniques you'll use.

Here's a simple planning checklist you can use for any project:

1. **What problem am I solving?** (Write it in one sentence.)
2. **What inputs will my program need?**
3. **What outputs should it produce?**
4. **What are the main steps?** (Think algorithms and decomposition.)
5. **What data structures will I use?** (Lists? Dictionaries? Classes?)
6. **How will I organize my code?** (Functions? Modules? Multiple files?)

Even for small assignments, taking five minutes to plan can save you hours of confused debugging later.

### Requirements Analysis

**Requirements analysis** is the process of figuring out *exactly* what the software needs to do — before you start building it. In a professional setting, this often means talking to the people who will actually use the software (called **stakeholders**) and writing down what they need.

For a school project, requirements analysis might look like this:

> **Project:** Grade calculator
>
> **Requirements:**
>
> - Accept a list of assignment scores from the user
> - Calculate the average score
> - Assign a letter grade (A, B, C, D, F) based on the average
> - Display the result in a friendly format
> - Handle invalid inputs without crashing

Notice how each requirement is specific and testable. "Make a cool grade thing" is *not* a good requirement. "Calculate the average of a list of scores and assign a letter grade" — that's a requirement you can actually build and verify.

<details markdown="1">
<summary>MicroSim: Software Development Lifecycle</summary>

#### Diagram: Software Development Lifecycle

Type: infographic
**sim-id:** sdlc-stages<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Understand (L2)
**Bloom Verb:** describe, sequence

**Learning Objective:** Students will be able to identify and describe the six stages of the software development lifecycle and explain how they relate to each other.

**Purpose:** An interactive circular diagram showing the six SDLC stages arranged in a cycle. Students can click each stage to reveal its description, key activities, and a real-world analogy.

**Layout:**
- Six nodes arranged in a circle: Planning, Analysis, Design, Implementation, Testing, Maintenance
- Arrows connecting each node to the next in clockwise order
- A center area that displays details when a node is clicked

**Interactive elements:**
- Click any stage node to highlight it and display its description in the center
- Hover to see a brief tooltip with the stage name and one-sentence summary
- An "Auto Tour" button cycles through all stages with a 2-second delay

**Color scheme:** Each stage gets a distinct color — blue, purple, green, orange, red, teal
**Responsive:** Circle resizes proportionally with window

**Instructional Rationale:** The circular layout reinforces that software development is an ongoing cycle, not a one-time linear process. Click-to-reveal supports the Understand level by letting students explore each stage at their own pace.
</details>

## Organizing Your Code Like a Pro

As your programs get bigger, keeping everything in one giant file becomes a nightmare. Imagine writing a 1,000-line program where all the functions, variables, and logic are jumbled together. Finding anything would be like searching for a specific grain of sand on a beach.

### Code Organization

**Code organization** is the practice of structuring your code so it's easy to read, navigate, and maintain. Good organization means:

- **Related code lives together** — All the functions for handling user input go in one place; all the functions for calculations go in another.
- **Each piece has one job** — A function should do one thing and do it well.
- **Names are descriptive** — Variable names like `student_grade` beat `x` every time.

Here's an example of poorly organized code versus well-organized code:

```python
# BAD: Everything mashed together, unclear names
def f(a):
    t = 0
    for i in a:
        t += i
    return t / len(a)

x = [85, 92, 78, 95, 88]
r = f(x)
if r >= 90: g = "A"
elif r >= 80: g = "B"
elif r >= 70: g = "C"
elif r >= 60: g = "D"
else: g = "F"
print(g)
```

```python
# GOOD: Clear names, separated concerns, readable
def calculate_average(scores):
    """Return the average of a list of numeric scores."""
    total = sum(scores)
    return total / len(scores)

def assign_letter_grade(average):
    """Return a letter grade based on the numeric average."""
    if average >= 90:
        return "A"
    elif average >= 80:
        return "B"
    elif average >= 70:
        return "C"
    elif average >= 60:
        return "D"
    else:
        return "F"

# Main program
scores = [85, 92, 78, 95, 88]
average = calculate_average(scores)
grade = assign_letter_grade(average)
print(f"Average: {average:.1f} — Grade: {grade}")
```

Both programs produce the same result, but the second one is dramatically easier to read, understand, and modify.

### Modular Design

**Modular design** means breaking your program into separate, self-contained pieces (called **modules**) that each handle one part of the problem. It's like building with LEGO bricks — each brick is a complete, independent unit, and you can snap them together in different combinations.

Modular design has huge benefits:

- **Easier to understand** — You can focus on one module at a time instead of the whole program.
- **Easier to test** — You can test each module independently.
- **Easier to reuse** — A well-designed module can be used in multiple projects.
- **Easier to maintain** — Fixing a bug in one module doesn't break the others.

!!! mascot-thinking "Monty says: You've got this!"
    ![Monty](../../img/monty-thinking.png){ align=left width="80" }
    Think of modular design like organizing a kitchen. You've got a drawer for utensils, a cabinet for plates, a pantry for food. Everything has its place. When you need a fork, you go straight to the utensil drawer — you don't rummage through a giant pile of *everything*. Your code should work the same way!

## Python Modules and Packages

### Import Statements

You've actually been using modules since early in this course. Every time you write `import random` or `from math import sqrt`, you're pulling in code from an external module. An **import statement** tells Python, "Hey, I need to use some code from another file. Please load it up for me."

There are several ways to import:

```python
# Import the entire module
import math
print(math.pi)         # 3.141592653589793
print(math.sqrt(16))   # 4.0

# Import specific items from a module
from math import pi, sqrt
print(pi)              # 3.141592653589793
print(sqrt(16))        # 4.0

# Import with a shorter alias
import matplotlib.pyplot as plt
plt.plot([1, 2, 3], [4, 5, 6])
```

### Python Modules

A **Python module** is simply a `.py` file that contains Python code — functions, classes, variables, or anything else. When you write a Python file, you've already created a module! You can import it from other files and reuse its code.

Let's create a simple module. Save this as `geometry.py`:

```python
# geometry.py — A module for geometry calculations

def area_of_circle(radius):
    """Calculate the area of a circle."""
    import math
    return math.pi * radius ** 2

def area_of_rectangle(width, height):
    """Calculate the area of a rectangle."""
    return width * height

def perimeter_of_rectangle(width, height):
    """Calculate the perimeter of a rectangle."""
    return 2 * (width + height)
```

Now, in another file, you can import and use it:

```python
# main.py — Uses the geometry module
import geometry

circle_area = geometry.area_of_circle(5)
print(f"Circle area: {circle_area:.2f}")

rect_area = geometry.area_of_rectangle(4, 7)
print(f"Rectangle area: {rect_area}")
```

Just like that, you've separated your concerns. The geometry calculations live in one file, and the main program logic lives in another.

### Python Packages

A **Python package** is a collection of related modules organized in a folder. The folder must contain a special file called `__init__.py` (which can be empty) to tell Python "this folder is a package."

Here's what a package structure looks like:

```
my_project/
├── main.py
└── shapes/
    ├── __init__.py
    ├── circles.py
    ├── rectangles.py
    └── triangles.py
```

You can then import from the package like this:

```python
from shapes.circles import area_of_circle
from shapes.rectangles import area_of_rectangle
```

Packages help you organize larger projects into logical groups. As your programs grow, you'll appreciate having this structure.

<details markdown="1">
<summary>MicroSim: Module and Package Structure Explorer</summary>

#### Diagram: Module and Package Structure

Type: diagram
**sim-id:** module-package-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Understand (L2)
**Bloom Verb:** explain, organize

**Learning Objective:** Students will be able to distinguish between Python modules and packages, and explain how import statements connect them.

**Purpose:** An interactive file-tree diagram showing the relationship between modules, packages, and import statements. Students click on import statements to see which files are loaded and how Python resolves them.

**Layout:**
- Left panel: A file tree showing a project with a main.py file and a shapes/ package containing multiple modules
- Right panel: Code editor showing the import statements and their resolved targets
- Animated arrows show the connection between an import statement and the file it loads

**Interactive elements:**
- Click any import statement to highlight the target file in the tree
- Click any file in the tree to see its contents in the code panel
- Toggle between "flat module" and "package" views to compare the two structures

**Instructional Rationale:** Visual file-tree navigation makes the abstract concept of imports concrete by showing students exactly which files Python loads when they write an import statement.
</details>

### The Pip Package Manager

Python comes with a lot of built-in modules (called the **standard library**), but thousands more are available from the Python community. The **pip package manager** is the tool you use to install these third-party packages.

Think of pip as an app store for Python. Need to make charts? Install `matplotlib`. Need to build a website? Install `flask`. Need to work with data? Install `pandas`.

Here are the most common pip commands:

```bash
# Install a package
pip install requests

# Install a specific version
pip install requests==2.31.0

# Upgrade a package to the latest version
pip install --upgrade requests

# See what's installed
pip list

# Uninstall a package
pip uninstall requests

# Save all installed packages to a file
pip freeze > requirements.txt

# Install all packages from a requirements file
pip install -r requirements.txt
```

That last pair of commands (`freeze` and `-r`) is especially useful. A `requirements.txt` file lists every package your project needs. When someone else wants to run your code, they just run `pip install -r requirements.txt` and everything gets installed automatically. No guessing required.

### Virtual Environments

Here's a problem: what if Project A needs version 1.0 of a library, but Project B needs version 2.0? If you install everything globally, one project will break.

The solution is **virtual environments**. A virtual environment is an isolated Python setup for a specific project. Each virtual environment has its own copy of Python and its own installed packages, completely separate from everything else on your computer.

```bash
# Create a virtual environment called "venv"
python -m venv venv

# Activate it (macOS/Linux)
source venv/bin/activate

# Activate it (Windows)
venv\Scripts\activate

# Now pip installs go into THIS environment only
pip install requests

# When you're done, deactivate
deactivate
```

When a virtual environment is active, you'll usually see its name in parentheses at the beginning of your terminal prompt: `(venv) $`. That's your reminder that you're working in an isolated environment.

!!! mascot-tip "Monty says: Let's debug this together!"
    ![Monty](../../img/monty-tip.png){ align=left width="80" }
    Always create a virtual environment for each project. It keeps your projects from stepping on each other's toes. Think of it like having a separate backpack for each class — your math notes don't get mixed up with your history papers!

## Version Control with Git

### Why Version Control?

Have you ever worked on an essay and saved files like `essay_v1.docx`, `essay_v2.docx`, `essay_FINAL.docx`, `essay_FINAL_REALLY_FINAL.docx`? Yeah, that gets messy fast.

**Version control** is a system that tracks every change you make to your code over time. Instead of saving multiple copies, you save **snapshots** (called **commits**) that record exactly what changed, when, and why. If something breaks, you can go back to any previous snapshot.

Version control also makes teamwork possible. Multiple people can work on the same codebase without overwriting each other's work. It's an absolutely essential tool in professional software development.

### Git Basics

**Git** is the most popular version control system in the world. It was created in 2005 by Linus Torvalds (the same person who created Linux) because he needed a fast, reliable way to track changes to the Linux kernel — a massive codebase with thousands of contributors.

Let's walk through the essential Git commands. You'll run these in your terminal (also called the command line).

**Setting up a new Git repository:**

```bash
# Navigate to your project folder
cd my_project

# Initialize a new Git repository
git init
```

That `git init` command creates a hidden `.git` folder that stores all the version history. Your project folder is now a **repository** (or "repo" for short).

**The Git workflow:**

Git has a three-stage workflow:

1. **Working directory** — Where you edit files normally
2. **Staging area** — Where you prepare changes for a commit
3. **Repository** — Where committed snapshots are stored permanently

Here's how you move changes through these stages:

```bash
# Check the status of your files
git status

# Add a specific file to the staging area
git add geometry.py

# Add all changed files to the staging area
git add .

# Commit the staged changes with a message
git commit -m "Add geometry module with circle and rectangle functions"

# View the history of commits
git log
```

Let's break down what each command does:

| Command | What It Does | Analogy |
|---------|-------------|---------|
| `git init` | Creates a new repository | Opening a new photo album |
| `git status` | Shows which files have changed | Checking which photos are on the table |
| `git add` | Stages files for the next commit | Picking which photos to put in the album |
| `git commit -m "..."` | Saves a snapshot with a message | Gluing the photos in and writing a caption |
| `git log` | Shows the history of all commits | Flipping through the album pages |

**Writing good commit messages:**

Your commit messages should explain *what* changed and *why*. Compare:

```bash
# BAD commit messages
git commit -m "stuff"
git commit -m "fixed it"
git commit -m "changes"

# GOOD commit messages
git commit -m "Add input validation to grade calculator"
git commit -m "Fix crash when user enters empty string"
git commit -m "Refactor area functions into geometry module"
```

Good commit messages are a gift to your future self. When you look back at your project six months from now, you'll be glad you wrote "Fix crash when user enters empty string" instead of "stuff."

<details markdown="1">
<summary>MicroSim: Git Workflow Visualizer</summary>

#### Diagram: Git Workflow Visualizer

Type: microsim
**sim-id:** git-workflow-visualizer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Understand (L2)
**Bloom Verb:** describe, trace

**Learning Objective:** Students will be able to trace the movement of files through Git's three-stage workflow (working directory, staging area, repository) and explain the purpose of each Git command.

**Purpose:** An interactive animation showing how files move through Git's three stages as students type simulated Git commands.

**Layout:**
- Three horizontal zones representing: Working Directory, Staging Area, Repository
- File icons that move between zones when commands are executed
- A simulated terminal at the bottom where students click pre-built Git commands

**Interactive elements:**
- Click buttons for: `git add`, `git commit`, `git status`, `git log`
- File icons animate from one zone to the next when the corresponding command runs
- `git status` highlights which files are in which zone
- `git log` shows a scrollable list of previous commits

**Color scheme:** Working directory (blue), Staging area (yellow), Repository (green)

**Instructional Rationale:** The three-zone layout directly maps to Git's conceptual model. Animating file movement makes the abstract staging process visible and concrete, helping students build an accurate mental model before using Git on the command line.
</details>

## Writing Clean Code

### Code Style

Have you ever tried to read someone else's handwriting and given up because it was too messy? Code can be the same way. **Code style** refers to the conventions you follow when formatting your code — things like indentation, spacing, naming, and line length.

Consistent code style matters because code is read far more often than it's written. If everyone on a team uses different styles, the codebase becomes a patchwork that's hard to read. That's why most programming languages have style guides.

### PEP 8 Guidelines

Python's official style guide is called **PEP 8** (Python Enhancement Proposal 8). It was written by Guido van Rossum himself, and it's the standard that almost all Python developers follow.

Here are the most important PEP 8 rules:

| Rule | Example |
|------|---------|
| Use 4 spaces for indentation (not tabs) | `    if x > 0:` |
| Limit lines to 79 characters | Keep it readable without scrolling |
| Use `snake_case` for function and variable names | `calculate_average`, `student_name` |
| Use `PascalCase` for class names | `GradeCalculator`, `Student` |
| Use `ALL_CAPS` for constants | `MAX_SCORE = 100`, `PI = 3.14159` |
| Put spaces around operators | `x = 5 + 3` not `x=5+3` |
| Put two blank lines before function/class definitions | Gives visual breathing room |
| Use docstrings for functions and classes | `"""Calculate the average score."""` |

Here's a quick before-and-after showing PEP 8 in action:

```python
# BEFORE: Violates PEP 8
def CalcGrade(s):
    t=0
    for i in s:t+=i
    avg=t/len(s)
    if avg>=90:return "A"
    elif avg>=80:return "B"
    elif avg>=70:return "C"
    elif avg>=60:return "D"
    else:return "F"
```

```python
# AFTER: Follows PEP 8
def calculate_grade(scores):
    """Calculate a letter grade from a list of scores."""
    total = 0
    for score in scores:
        total += score
    average = total / len(scores)

    if average >= 90:
        return "A"
    elif average >= 80:
        return "B"
    elif average >= 70:
        return "C"
    elif average >= 60:
        return "D"
    else:
        return "F"
```

The second version is longer but *dramatically* easier to read. In professional development, readability always wins.

### Linting Tools

Checking your code style by hand is tedious. That's where **linting tools** come in. A **linter** is a program that automatically analyzes your code and flags style violations, potential errors, and other issues.

Popular Python linters include:

- **flake8** — Checks PEP 8 compliance and catches common errors
- **pylint** — A more thorough (and sometimes opinionated) linter
- **black** — An auto-formatter that *fixes* your style automatically
- **ruff** — A blazing-fast modern linter written in Rust

Here's how to use flake8:

```bash
# Install flake8
pip install flake8

# Run it on your file
flake8 my_program.py

# Sample output:
# my_program.py:3:1: E302 expected 2 blank lines, found 1
# my_program.py:7:12: E225 missing whitespace around operator
# my_program.py:15:80: E501 line too long (95 > 79 characters)
```

Each message tells you the file, line number, column, error code, and a description. Most code editors (like VS Code) can run a linter automatically as you type, highlighting problems with a colored squiggly line — just like spell check for your code.

## Design Principles: DRY and KISS

Two of the most important principles in software engineering fit neatly into acronyms that are easy to remember.

### The DRY Principle

**DRY** stands for **Don't Repeat Yourself**. The **DRY principle** says that every piece of knowledge in your code should exist in exactly one place. If you find yourself copying and pasting the same block of code, that's a sign you should extract it into a function.

Here's an example:

```python
# VIOLATES DRY — the same calculation appears three times
math_total = 0
for score in math_scores:
    math_total += score
math_average = math_total / len(math_scores)

science_total = 0
for score in science_scores:
    science_total += score
science_average = science_total / len(science_scores)

english_total = 0
for score in english_scores:
    english_total += score
english_average = english_total / len(english_scores)
```

```python
# FOLLOWS DRY — write the logic once, use it three times
def calculate_average(scores):
    """Return the average of a list of scores."""
    total = sum(scores)
    return total / len(scores)

math_average = calculate_average(math_scores)
science_average = calculate_average(science_scores)
english_average = calculate_average(english_scores)
```

The DRY version is shorter, easier to read, and — here's the big one — if you ever need to change how averages are calculated, you only change it *in one place*. With the non-DRY version, you'd have to find and update three separate blocks, and you'd probably miss one.

### The KISS Principle

**KISS** stands for **Keep It Simple, Silly** (or sometimes "Keep It Simple, Stupid," but we'll keep it friendly). The **KISS principle** says you should always choose the simplest solution that works.

New programmers sometimes overcomplicate things because they want to seem "advanced." But experienced developers know that simple code is *better* code. Simple code has fewer bugs, is easier to understand, and is easier to change.

```python
# OVERCOMPLICATED — trying too hard
def is_even(number):
    """Check if a number is even."""
    binary_representation = bin(number)
    last_bit = binary_representation[-1]
    if last_bit == '0':
        return True
    else:
        return False
```

```python
# KISS — simple and clear
def is_even(number):
    """Check if a number is even."""
    return number % 2 == 0
```

Both functions work, but the KISS version is one line instead of six. It's immediately obvious what it does. When you're tempted to write something clever, ask yourself: "Is there a simpler way?"

!!! mascot-warning "Monty says: Watch out!"
    ![Monty](../../img/monty-warning.png){ align=left width="80" }
    Beware of "clever" code! If you have to read a line three times to understand it, it's too clever. Future-you (and your teammates) will thank you for keeping things simple. Remember: code is read ten times more than it's written.

<details markdown="1">
<summary>MicroSim: DRY vs. WET Code Comparison</summary>

#### Diagram: DRY vs. WET Code Comparison

Type: microsim
**sim-id:** dry-vs-wet-code<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Analyze (L4)
**Bloom Verb:** compare, distinguish

**Learning Objective:** Students will be able to identify code that violates the DRY principle and explain how to refactor it using functions.

**Purpose:** A side-by-side code comparison tool that shows "WET" (Write Everything Twice) code on one side and the refactored DRY version on the other. Identical repeated blocks are highlighted to make the duplication visually obvious.

**Layout:**
- Left panel labeled "WET Code (repetitive)" showing code with duplicated blocks
- Right panel labeled "DRY Code (refactored)" showing the same logic extracted into a reusable function
- Duplicated blocks on the left are highlighted in red
- The single function definition on the right is highlighted in green
- A metrics bar at the bottom showing lines of code and number of duplicate blocks for each version

**Interactive elements:**
- Click "Next Example" to cycle through 3 different WET-to-DRY transformations
- Hover over duplicated blocks to see them pulse simultaneously, showing they are copies of each other
- A "Lines of Code" counter animates to show the reduction

**Instructional Rationale:** Visual highlighting of duplicated blocks makes the DRY violation immediately obvious. The side-by-side layout lets students directly compare approaches. Multiple examples reinforce that DRY applies across many situations.
</details>

## Refactoring Your Code

**Refactoring** is the process of improving your code's structure *without changing what it does*. It's like remodeling a house — you might move walls and redesign the kitchen, but it's still the same house at the same address.

Why refactor? Because your first working version is rarely your best version. Code evolves. What seemed fine when you wrote 50 lines might become confusing at 500 lines. Refactoring keeps your codebase healthy as it grows.

Here are common refactoring techniques:

**1. Extract a function** — Pull repeated or complex code into its own function.

```python
# BEFORE: Logic mixed into main code
name = input("Enter name: ").strip()
if len(name) == 0:
    print("Error: Name cannot be empty.")
    name = input("Enter name: ").strip()

age = input("Enter age: ").strip()
if len(age) == 0:
    print("Error: Age cannot be empty.")
    age = input("Enter age: ").strip()
```

```python
# AFTER: Extracted into a reusable function
def get_required_input(prompt):
    """Keep asking until the user provides a non-empty value."""
    value = input(prompt).strip()
    while len(value) == 0:
        print("Error: This field cannot be empty.")
        value = input(prompt).strip()
    return value

name = get_required_input("Enter name: ")
age = get_required_input("Enter age: ")
```

**2. Rename for clarity** — Replace vague names with descriptive ones.

```python
# BEFORE
def proc(d):
    r = {}
    for k, v in d.items():
        if v > 50:
            r[k] = v
    return r

# AFTER
def filter_high_scores(scores_dict):
    """Return only scores above 50."""
    high_scores = {}
    for student, score in scores_dict.items():
        if score > 50:
            high_scores[student] = score
    return high_scores
```

**3. Simplify conditionals** — Flatten nested if/else blocks.

```python
# BEFORE: Deeply nested
def get_ticket_price(age, is_student):
    if age < 12:
        return 5.00
    else:
        if age >= 65:
            return 7.00
        else:
            if is_student:
                return 8.00
            else:
                return 12.00

# AFTER: Flat and clear using early returns
def get_ticket_price(age, is_student):
    """Return the ticket price based on age and student status."""
    if age < 12:
        return 5.00
    if age >= 65:
        return 7.00
    if is_student:
        return 8.00
    return 12.00
```

The refactored version reads like a checklist — easy to follow, easy to modify.

## Comments and Documentation

### Code Comments

**Code comments** are notes you write in your code to explain *why* something is done a certain way. In Python, comments start with a `#` symbol.

```python
# Calculate the average (excluding the lowest score)
scores.sort()
adjusted_scores = scores[1:]  # Drop the first (lowest) score
average = sum(adjusted_scores) / len(adjusted_scores)
```

**Rules for good comments:**

- **Comment the "why," not the "what."** Your code already shows *what* it does. Comments should explain *why* you made a particular choice.
- **Don't state the obvious.** `x = 5  # Set x to 5` — that comment adds nothing.
- **Keep comments up to date.** A comment that contradicts the code is worse than no comment at all.
- **Use comments to explain tricky logic.** If a section of code requires a moment of thought to understand, add a comment.

```python
# BAD comments (state the obvious)
x = x + 1  # Increment x by 1
names = []  # Create an empty list

# GOOD comments (explain the why)
x = x + 1  # Account for zero-based indexing in the display
names = []  # Will be populated from the CSV file in the next section
```

### Documentation

**Documentation** goes beyond individual comments. It's the big-picture explanation of what your code does, how to use it, and how it's organized. In Python, the main tool for documentation is the **docstring** — a string at the beginning of a module, class, or function that describes its purpose.

```python
def celsius_to_fahrenheit(celsius):
    """Convert a temperature from Celsius to Fahrenheit.

    Args:
        celsius: A numeric temperature in degrees Celsius.

    Returns:
        The equivalent temperature in degrees Fahrenheit.

    Example:
        >>> celsius_to_fahrenheit(100)
        212.0
        >>> celsius_to_fahrenheit(0)
        32.0
    """
    return celsius * 9 / 5 + 32
```

Docstrings are special because Python can actually read them at runtime. If someone types `help(celsius_to_fahrenheit)` in the interpreter, Python displays your docstring. It's like a built-in manual for every function you write.

For larger projects, documentation might also include:

- A **README file** explaining what the project does and how to install it
- A **requirements.txt** listing all dependencies
- **Inline comments** for tricky sections
- **Docstrings** for every public function and class

<details markdown="1">
<summary>MicroSim: Comment Quality Checker</summary>

#### Diagram: Comment Quality Checker

Type: microsim
**sim-id:** comment-quality-checker<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Evaluate (L5)
**Bloom Verb:** assess, judge

**Learning Objective:** Students will be able to evaluate the quality of code comments and distinguish between helpful comments (explaining "why") and unhelpful comments (stating "what").

**Purpose:** An interactive quiz where students are shown code snippets with comments and must rate each comment as "Helpful," "Unhelpful," or "Missing."

**Layout:**
- Top area: A code snippet with a highlighted comment
- Middle area: Three clickable buttons — "Helpful (explains why)", "Unhelpful (states the obvious)", "Missing (needs a comment)"
- Bottom area: Score tracker and feedback message

**Interactive elements:**
- Click a rating button to submit your answer
- Immediate feedback explains why the comment is good, bad, or missing
- Score tracker shows correct answers out of total questions
- 8 questions covering common comment patterns

**Instructional Rationale:** Evaluating existing comments is a higher-order skill that prepares students to write better comments themselves. Immediate feedback reinforces the "comment the why, not the what" principle.
</details>

## The `if __name__ == "__main__"` Pattern

This is one of those Python patterns that looks confusing the first time you see it, but once you understand it, you'll use it all the time.

### Name Equals Main

When Python runs a file, it sets a special variable called `__name__`. If the file is being **run directly** (like `python my_file.py`), then `__name__` is set to `"__main__"`. But if the file is being **imported** by another file, `__name__` is set to the module's name instead.

The **`if __name__ == "__main__"`** pattern (often called **name equals main**) lets you write code that *only runs when the file is executed directly* — not when it's imported.

Here's why that matters. Let's say you have a module called `geometry.py`:

```python
# geometry.py

def area_of_circle(radius):
    """Calculate the area of a circle."""
    import math
    return math.pi * radius ** 2

# Test code
print("Testing area_of_circle...")
print(f"Area with radius 5: {area_of_circle(5):.2f}")
```

If you run `python geometry.py`, you'll see the test output — great! But if another file does `import geometry`, those print statements will run too, cluttering the output. Not great.

Here's the fix:

```python
# geometry.py

def area_of_circle(radius):
    """Calculate the area of a circle."""
    import math
    return math.pi * radius ** 2

if __name__ == "__main__":
    # This code ONLY runs when you execute geometry.py directly
    print("Testing area_of_circle...")
    print(f"Area with radius 5: {area_of_circle(5):.2f}")
```

Now the test code only runs when you execute `python geometry.py` directly. When another file does `import geometry`, the test code is skipped.

Think of it like a sign on a door: "Test area — employees only." The code inside the `if __name__ == "__main__"` block is only for direct execution, not for imports.

!!! mascot-encourage "Monty says: You've got this!"
    ![Monty](../../img/monty-encourages.png){ align=left width="80" }
    The `if __name__ == "__main__"` pattern might look weird at first, but every Python developer uses it. Once you get the hang of it, you'll put it at the bottom of every module you write. It's a mark of a thoughtful programmer!

<details markdown="1">
<summary>MicroSim: Name Equals Main Simulator</summary>

#### Diagram: Name Equals Main Simulator

Type: microsim
**sim-id:** name-equals-main<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Apply (L3)
**Bloom Verb:** demonstrate, predict

**Learning Objective:** Students will be able to predict which code blocks execute when a Python file is run directly versus when it is imported as a module.

**Purpose:** An interactive simulation where students see two Python files and can toggle between "Run Directly" and "Import" modes to observe which lines of code execute in each scenario.

**Layout:**
- Left panel: The module file (e.g., `geometry.py`) with line numbers and a `if __name__ == "__main__"` block
- Right panel: An importing file (e.g., `main.py`) that does `import geometry`
- Bottom panel: Console output showing which lines ran
- Toggle switch: "Run geometry.py directly" vs. "Import from main.py"

**Interactive elements:**
- Toggle between direct execution and import mode
- Lines that execute are highlighted in green; lines that are skipped are grayed out
- Console output updates in real-time
- A "Step Through" button advances one line at a time with explanation

**Color scheme:** Executed lines in green, skipped lines in gray, `__name__` variable value shown in gold

**Instructional Rationale:** Directly comparing the two execution modes side-by-side makes the purpose of the `if __name__ == "__main__"` guard immediately clear. Stepping through one line at a time helps students build a correct mental model of Python's import and execution behavior.
</details>

## Putting It All Together: A Professional Project Structure

Let's see what a well-organized Python project looks like when you combine everything from this chapter:

```
grade_calculator/
├── README.md                 # Project documentation
├── requirements.txt          # Package dependencies
├── .gitignore                # Files Git should ignore
├── venv/                     # Virtual environment (not committed to Git)
├── calculator/
│   ├── __init__.py           # Makes this a package
│   ├── grades.py             # Grade calculation module
│   └── validation.py         # Input validation module
├── tests/
│   ├── __init__.py
│   └── test_grades.py        # Tests for the grades module
└── main.py                   # Entry point for the program
```

This project uses:

- **Modular design** — Code is split into separate modules for grades and validation
- **Packages** — The `calculator/` folder is a Python package
- **Virtual environments** — Dependencies are isolated in `venv/`
- **Pip** — Dependencies are tracked in `requirements.txt`
- **Git** — Version control with `.gitignore` to exclude `venv/`
- **Documentation** — A `README.md` explains the project
- **Good style** — All files follow PEP 8 conventions

That structure might seem like overkill for a school project, but building these habits now means you'll be ready for the real-world projects ahead.

!!! mascot-celebration "Monty says: You've got this!"
    ![Monty](../../img/monty-celebrates.png){ align=left width="80" }
    Look at you — you've just learned the tools and practices that professional software engineers use every day! Version control, modular design, clean code style, documentation... you're not just writing code anymore, you're *engineering* software. That's a huge step forward, coder!

## Key Takeaways

- **Software development** is a structured process (planning, analysis, design, implementation, testing, maintenance) — not just coding.
- **Program planning** and **requirements analysis** help you figure out *what* to build before you start building.
- **Modular design** means breaking your program into independent, reusable pieces.
- **Code organization** keeps related code together and uses descriptive names.
- **Import statements** let you use code from **Python modules** (`.py` files) and **Python packages** (folders with `__init__.py`).
- The **pip package manager** installs third-party packages, and **virtual environments** isolate project dependencies.
- **Version control** tracks changes over time. **Git** uses `init`, `add`, `commit`, `status`, and `log` to manage your code history.
- **Code style** matters. **PEP 8** is Python's official style guide, and **linting tools** like flake8 check your code automatically.
- **Refactoring** improves code structure without changing behavior.
- The **DRY principle** (Don't Repeat Yourself) says to avoid duplicated code. The **KISS principle** (Keep It Simple, Silly) says to choose the simplest solution.
- **Code comments** explain *why* (not *what*). **Documentation** (including docstrings) provides big-picture explanations.
- The **`if __name__ == "__main__"`** pattern lets your modules work both as standalone scripts and as importable libraries.

??? question "Check Your Understanding: What does the DRY principle stand for, and how would you fix a program that has the same ten lines of code copied in three different places?"
    **DRY** stands for **Don't Repeat Yourself**. To fix the program, you would extract those ten repeated lines into a single function, then call that function from all three places. This way, the logic lives in one place, and if you ever need to change it, you only update it once.

??? question "Check Your Understanding: You have a file called `helpers.py` with useful functions. When you run `python helpers.py`, it prints test output. When another file does `import helpers`, it also prints that test output. How do you fix this?"
    Wrap the test code inside an `if __name__ == "__main__":` block. Code inside this block only runs when `helpers.py` is executed directly (`python helpers.py`). When another file imports it, the block is skipped.

    ```python
    # helpers.py
    def greet(name):
        return f"Hello, {name}!"

    if __name__ == "__main__":
        # Only runs when executed directly
        print(greet("Test"))
    ```

??? question "Check Your Understanding: What is the difference between `git add` and `git commit`?"
    `git add` moves your changes to the **staging area** — it's like picking which photos to put in a photo album. `git commit` takes everything in the staging area and saves it as a permanent **snapshot** (a commit) in the repository — it's like gluing the photos in and writing a caption. You can `git add` multiple times before running a single `git commit`.
