---
title: Errors and Exceptions
description: Error types, exception handling with try-except, raising exceptions, custom exceptions, and assertions in Python.
generated_by: claude skill chapter-content-generator
date: 2026-02-11
version: 0.04
---

# Errors and Exceptions

## Summary

This chapter teaches students to handle errors gracefully in Python programs. Students will learn to distinguish between syntax, runtime, and logic errors, understand common exception types (TypeError, ValueError, IndexError, KeyError), and use try-except blocks to catch and handle exceptions. The chapter covers raising exceptions, creating custom exception classes, and using assertions for debugging. Proper error handling is essential for writing robust, production-quality software.

## Concepts Covered

This chapter covers the following 15 concepts from the learning graph:

1. Errors and Exceptions
2. Syntax Errors
3. Runtime Errors
4. Logic Errors
5. Exception Types
6. TypeError
7. ValueError
8. IndexError
9. KeyError
10. Try-Except Block
11. Multiple Except Blocks
12. Finally Block
13. Raising Exceptions
14. Custom Exceptions
15. Assertions

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: Python Fundamentals](../02-python-fundamentals/index.md)
- [Chapter 3: Boolean Logic and Comparisons](../03-boolean-logic/index.md)
- [Chapter 5: Working with Strings](../05-working-with-strings/index.md)
- [Chapter 8: Lists](../08-lists/index.md)
- [Chapter 11: Dictionaries](../11-dictionaries/index.md)
- [Chapter 12: Classes and Objects](../12-classes-and-objects/index.md)

---

!!! mascot-welcome "Monty says: Let's debug this together!"
    ![Monty](../../img/monty-welcome.png){ align=left width="80" }
    Hey coders! Let me let you in on a secret: *every* programmer makes mistakes. Even the pros who build apps used by millions of people. The difference between a beginner and an expert isn't that experts never get errors -- it's that experts know how to read them, understand them, and fix them. In this chapter, you'll learn to do exactly that. Let's turn those scary red error messages into helpful clues!

## What Are Errors and Exceptions?

When you write Python code, things don't always go as planned. Maybe you misspell a keyword, try to divide by zero, or look for an item that doesn't exist in a list. When something goes wrong, Python doesn't just silently give up -- it tells you about the problem by raising an **error** or **exception**.

**Errors and exceptions** are Python's way of saying, "Hey, something went wrong, and here's what happened." They're not punishments -- they're *messages*. Think of them like a dashboard warning light in a car. The light doesn't mean your car is ruined. It means your car is *telling you something needs attention*.

Here's the good news: Python's error messages are actually quite helpful once you learn to read them. They tell you:

- **What** went wrong (the error type)
- **Where** it happened (the file and line number)
- **Why** it happened (a description of the problem)

Let's look at a quick example. Say you write this code:

```python
print("Hello World"
```

Python responds with:

```
  File "example.py", line 1
    print("Hello World"
                       ^
SyntaxError: '(' was never closed
```

See that? Python is pointing right at the problem -- you forgot the closing parenthesis. That's not scary; that's *helpful*.

## The Three Types of Errors

Not all errors are created equal. Python errors fall into three main categories, and understanding the difference between them is one of the most important skills you'll develop as a programmer.

| Error Type | When It Happens | Can Python Catch It? | Example |
|------------|----------------|---------------------|---------|
| **Syntax Error** | Before the program runs | Yes -- won't even start | `print("hi"` (missing `)`) |
| **Runtime Error** | While the program is running | Yes -- raises an exception | `10 / 0` (division by zero) |
| **Logic Error** | Program runs fine, but gives wrong results | No -- Python can't detect it | Using `+` when you meant `-` |

Let's explore each one in detail.

### Syntax Errors

A **syntax error** happens when you break Python's grammar rules. Just like English has rules about where to put commas and periods, Python has rules about parentheses, colons, indentation, and keywords. If you break one of those rules, Python can't even *begin* to run your code.

Syntax errors are the easiest to find because Python catches them *before* your program starts running and points right at the problem.

Here are some common syntax errors:

```python
# Missing colon after if statement
if x > 5
    print("Big number")
```

```
  File "example.py", line 1
    if x > 5
            ^
SyntaxError: expected ':'
```

```python
# Misspelled keyword
fro i in range(10):
    print(i)
```

```
  File "example.py", line 1
    fro i in range(10):
        ^
SyntaxError: invalid syntax
```

```python
# Mismatched quotes
message = "Hello world'
```

```
  File "example.py", line 1
    message = "Hello world'
                           ^
SyntaxError: EOL while scanning string literal
```

The fix for syntax errors is straightforward: read the error message, look at the line it points to, and fix the typo or missing character. Think of it like a spell-checker for code.

<details markdown="1">
<summary>MicroSim: Error Type Identifier</summary>

#### Diagram: Error Type Identifier

Type: microsim
**sim-id:** error-type-identifier<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Understand (L2)
**Bloom Verb:** classify, distinguish

**Learning Objective:** Students will be able to classify code snippets as containing syntax errors, runtime errors, or logic errors by analyzing the code and predicting the outcome.

**Purpose:** An interactive quiz where students are shown code snippets one at a time and must classify each as a syntax error, runtime error, or logic error. Immediate feedback explains why each classification is correct.

**Layout:**
- Top section: Title "Error Type Identifier"
- Middle: A code snippet displayed in a monospaced font box
- Below the code: Three large clickable buttons labeled "Syntax Error", "Runtime Error", and "Logic Error"
- Bottom: Feedback area showing whether the answer was correct, with an explanation
- Score tracker in the top-right corner: "Correct: X / Total: Y"

**Code snippets bank (10+ examples):**
1. `print("hello"` -- Syntax Error (missing closing parenthesis)
2. `x = 10 / 0` -- Runtime Error (ZeroDivisionError)
3. `average = (a + b + c) / 2` -- Logic Error (should divide by 3, not 2)
4. `for i in range(10)` -- Syntax Error (missing colon)
5. `names = ["Alice"]; print(names[5])` -- Runtime Error (IndexError)
6. `area = length + width` -- Logic Error (should be multiplication)
7. `x = int("hello")` -- Runtime Error (ValueError)
8. `if x = 5:` -- Syntax Error (should be ==)
9. `celsius = (fahrenheit - 32) * 9/5` -- Logic Error (should be * 5/9)
10. `scores = {}; print(scores["math"])` -- Runtime Error (KeyError)

**Interactive elements:**
- Click a category button to submit answer
- Correct answers flash green; incorrect flash red
- After answering, a 2-3 sentence explanation appears
- "Next" button loads the next code snippet
- Snippets are shuffled randomly each session

**Visual style:** Clean, dark code box with syntax highlighting, large accessible buttons
**Responsive:** Canvas adjusts to window width; code font scales proportionally

**Instructional Rationale:** Classification tasks at the Understand level help students build a mental model for distinguishing error types. Immediate feedback with explanations reinforces why each error belongs to its category, building diagnostic skills students need for debugging.
</details>

### Runtime Errors

A **runtime error** happens while your program is running. The code is grammatically correct (Python can read it just fine), but something goes wrong during execution. These errors are called **exceptions** because they represent *exceptional* situations that Python doesn't know how to handle on its own.

**Runtime errors** are trickier than syntax errors because they might not happen every time you run the program. A program might work perfectly with one set of inputs and crash with another.

```python
# This works fine
numerator = 10
denominator = 2
result = numerator / denominator  # 5.0, no problem

# But what if the user enters 0?
denominator = 0
result = numerator / denominator  # BOOM!
```

```
Traceback (most recent call last):
  File "example.py", line 6, in <module>
    result = numerator / denominator
             ~~~~~~~~~~^~~~~~~~~~~~~
ZeroDivisionError: division by zero
```

Notice that Python gives you a **traceback** -- a trail of breadcrumbs that shows you exactly where the error occurred. Learning to read tracebacks is like learning to read a map. The last line tells you *what* went wrong (`ZeroDivisionError: division by zero`), and the lines above tell you *where* it happened.

### Logic Errors

**Logic errors** are the sneakiest of the three. Your code runs without crashing, Python doesn't complain at all, but the *answer is wrong*. The program does exactly what you told it to do -- it's just that what you *told it* isn't what you *meant*.

```python
# Calculate the average of three test scores
score1 = 85
score2 = 90
score3 = 78

# Oops! Dividing by 2 instead of 3
average = (score1 + score2 + score3) / 2
print(f"Your average is: {average}")
```

```
Your average is: 126.5
```

Python doesn't crash. There's no error message. But an average test score of 126.5? That's clearly wrong. The bug is dividing by 2 instead of 3, but Python has no way to know that -- it just does the math you asked for.

Logic errors are the hardest to find because you don't get a helpful error message. You have to test your program carefully, check your results against what you *expect*, and trace through your code step by step to find where your logic went astray.

!!! mascot-thinking "Monty says: You've got this!"
    ![Monty](../../img/monty-thinking.png){ align=left width="80" }
    Here's how I remember the three error types: **Syntax errors** = you spoke bad grammar and Python couldn't understand you. **Runtime errors** = Python understood you but ran into a problem while doing what you asked. **Logic errors** = Python did exactly what you asked, but what you asked was wrong. The first two give you error messages. The third one? You're on your own, detective!

<details markdown="1">
<summary>Diagram: Three Types of Errors Comparison</summary>

#### Diagram: Three Types of Errors

Type: infographic
**sim-id:** error-types-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Understand (L2)
**Bloom Verb:** compare, contrast

**Learning Objective:** Students will be able to compare and contrast syntax errors, runtime errors, and logic errors by identifying when each occurs, how Python reports them, and strategies for fixing them.

**Purpose:** A visual three-column comparison chart that students can hover over to see examples and explanations for each error type.

**Layout:**
- Three vertical columns, evenly spaced
- Column headers: "Syntax Error", "Runtime Error", "Logic Error"
- Each column contains four rows: When It Happens, Python's Response, Example, How to Fix
- Color-coded: Syntax = red, Runtime = orange, Logic = yellow

**Column content:**

**Syntax Error (Red):**
- When: Before the program runs
- Python's Response: Points to the line with the problem, won't run at all
- Example: `if x > 5` (missing colon)
- How to Fix: Read the error message, check the indicated line

**Runtime Error (Orange):**
- When: While the program is running
- Python's Response: Crashes with a traceback and exception name
- Example: `10 / 0` (ZeroDivisionError)
- How to Fix: Read the traceback, use try-except to handle it

**Logic Error (Yellow):**
- When: Program runs successfully but gives wrong output
- Python's Response: Nothing -- no error message at all
- Example: Using `/ 2` instead of `/ 3` for an average
- How to Fix: Test with known inputs, trace through code manually

**Interactive elements:**
- Hover over any cell to see a larger tooltip with additional details and a second example
- Click a column header to highlight that entire column
- A "Quiz Me" button at the bottom shows a random code snippet and asks which error type it represents

**Visual style:** Clean grid with rounded borders, subtle gradients, clear typography
**Responsive:** Columns stack vertically on narrow screens

**Instructional Rationale:** Side-by-side comparison at the Understand level helps students distinguish between the three error types by directly contrasting their properties. The hover-to-reveal interaction supports deeper exploration without cluttering the initial view.
</details>

## Common Exception Types

When a runtime error occurs, Python raises a specific type of exception that tells you exactly what kind of problem happened. Learning the common **exception types** is like learning to recognize different dashboard warning lights -- each one means something specific.

Here are the most common exceptions you'll encounter:

| Exception | What It Means | Common Cause |
|-----------|--------------|--------------|
| `TypeError` | Wrong data type for an operation | Adding a string to a number |
| `ValueError` | Right type but wrong value | Converting `"hello"` to an integer |
| `IndexError` | List index out of range | Accessing element 10 in a 5-element list |
| `KeyError` | Dictionary key doesn't exist | Looking up a key that was never added |
| `ZeroDivisionError` | Division by zero | Dividing by a variable that happens to be 0 |
| `NameError` | Variable name not found | Using a variable before defining it |
| `FileNotFoundError` | File doesn't exist | Trying to open a file with a wrong path |
| `AttributeError` | Object doesn't have that attribute | Calling `.append()` on a string |

Let's look at the four most important ones in detail.

### TypeError

A **TypeError** happens when you try to perform an operation on the wrong data type. It's like trying to use a key to unlock a combination lock -- the tool doesn't match the task.

```python
# Can't add a string and an integer
age = "25"
new_age = age + 1
```

```
Traceback (most recent call last):
  File "example.py", line 2, in <module>
    new_age = age + 1
              ~~~~^~~
TypeError: can only concatenate str (not "int") to str
```

Python is telling you: "You tried to add an integer to a string, and I don't know what you mean by that." The fix? Convert the string to an integer first: `new_age = int(age) + 1`.

```python
# Can't multiply a string by a string
result = "hello" * "world"
```

```
Traceback (most recent call last):
  File "example.py", line 1, in <module>
    result = "hello" * "world"
             ~~~~~~~~^~~~~~~~~
TypeError: can't multiply sequence by non-int of type 'str'
```

### ValueError

A **ValueError** happens when a function receives a value of the right *type* but the wrong *content*. The shape is correct, but the contents don't make sense.

```python
# "hello" is a string, but it can't be converted to an integer
number = int("hello")
```

```
Traceback (most recent call last):
  File "example.py", line 1, in <module>
    number = int("hello")
             ^^^^^^^^^^^^
ValueError: invalid literal for int() with base 10: 'hello'
```

This happens a lot when you're getting input from users. A user might type "abc" when you're expecting a number. Later in this chapter, you'll learn exactly how to handle that gracefully.

```python
# The string "3.14" can't be directly converted to int
number = int("3.14")
```

```
Traceback (most recent call last):
  File "example.py", line 1, in <module>
    number = int("3.14")
             ^^^^^^^^^^^
ValueError: invalid literal for int() with base 10: '3.14'
```

### IndexError

An **IndexError** happens when you try to access a list element using an index that doesn't exist. Remember, a list with 5 elements has indices 0 through 4. If you try to access index 5 (or higher), Python raises an IndexError.

```python
fruits = ["apple", "banana", "cherry"]
print(fruits[5])
```

```
Traceback (most recent call last):
  File "example.py", line 2, in <module>
    print(fruits[5])
          ~~~~~~^^^
IndexError: list index out of range
```

This is one of the most common errors in programming. It often shows up in loops where the loop counter goes one step too far. The classic mistake is called an **off-by-one error**.

```python
colors = ["red", "green", "blue"]

# Bug: range(3) gives 0, 1, 2 -- but range(4) would give 0, 1, 2, 3
# Index 3 doesn't exist in a 3-element list!
for i in range(4):
    print(colors[i])
```

```
red
green
blue
Traceback (most recent call last):
  File "example.py", line 4, in <module>
    print(colors[i])
          ~~~~~~^^^
IndexError: list index out of range
```

### KeyError

A **KeyError** happens when you try to look up a key in a dictionary that doesn't exist. It's like looking in the phone book for someone who isn't listed.

```python
student = {"name": "Alice", "grade": 10}
print(student["email"])
```

```
Traceback (most recent call last):
  File "example.py", line 2, in <module>
    print(student["email"])
          ~~~~~~~^^^^^^^^^
KeyError: 'email'
```

The dictionary has "name" and "grade" but no "email". To avoid this, you can use the `.get()` method, which returns `None` (or a default value you specify) instead of crashing:

```python
student = {"name": "Alice", "grade": 10}

# Using .get() to safely access a key
email = student.get("email", "No email on file")
print(email)  # "No email on file"
```

<details markdown="1">
<summary>Diagram: Python Exception Hierarchy</summary>

#### Diagram: Python Exception Hierarchy

Type: infographic
**sim-id:** exception-hierarchy<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Remember (L1)
**Bloom Verb:** identify, list

**Learning Objective:** Students will be able to identify the hierarchy of Python's built-in exceptions and understand that all exceptions inherit from the BaseException class.

**Purpose:** An interactive tree diagram showing Python's exception class hierarchy, letting students explore how specific exceptions relate to more general exception categories.

**Layout:**
- Tree structure flowing top to bottom
- Root node: `BaseException`
- Second level: `Exception`, `KeyboardInterrupt`, `SystemExit`
- Third level (under `Exception`): `ArithmeticError`, `LookupError`, `TypeError`, `ValueError`, `OSError`
- Fourth level: `ZeroDivisionError` (under `ArithmeticError`), `IndexError` and `KeyError` (under `LookupError`), `FileNotFoundError` (under `OSError`)

**Tree nodes:**

```
BaseException
├── Exception
│   ├── ArithmeticError
│   │   ├── ZeroDivisionError
│   │   └── OverflowError
│   ├── LookupError
│   │   ├── IndexError
│   │   └── KeyError
│   ├── TypeError
│   ├── ValueError
│   ├── OSError
│   │   └── FileNotFoundError
│   ├── NameError
│   └── AttributeError
├── KeyboardInterrupt
└── SystemExit
```

**Interactive elements:**
- Hover over any node to see a brief description and an example that triggers that exception
- Click a node to highlight it and all its parent nodes up to `BaseException`, showing the inheritance chain
- A "Why does this matter?" tooltip explains that catching a parent exception also catches all its children

**Color scheme:**
- `BaseException`: gray
- `Exception`: blue
- `ArithmeticError` branch: red
- `LookupError` branch: orange
- `TypeError`, `ValueError`: purple
- `OSError` branch: green

**Visual style:** Rounded rectangle nodes with connecting lines, subtle animations on hover
**Responsive:** Tree adjusts layout for narrow screens; nodes may reflow vertically

**Instructional Rationale:** A tree visualization makes the inheritance relationship between exceptions concrete and visible. Understanding that `IndexError` is a type of `LookupError` which is a type of `Exception` helps students write more targeted except blocks and understand why catching `Exception` catches almost everything.
</details>

## Handling Exceptions with Try-Except

So far, when an error happens, your program crashes. That's fine when you're learning, but in real software, you don't want your app to crash every time something unexpected happens. Imagine if your music player crashed every time it couldn't find a song file!

The **try-except block** is Python's way of saying: "Try to run this code. If something goes wrong, don't crash -- run this *other* code instead." It's like having a backup plan.

Here's the basic structure:

```python
try:
    # Code that might cause an error
    risky_code_here()
except SomeException:
    # Code that runs if the error happens
    handle_the_problem()
```

Let's see it in action with a real example -- getting a number from the user:

```python
try:
    user_input = input("Enter a number: ")
    number = int(user_input)
    print(f"You entered: {number}")
except ValueError:
    print("That's not a valid number! Please try again.")
```

If the user types `42`, the program works normally. But if the user types `"pizza"`, instead of crashing with a ValueError, the program prints a friendly message: "That's not a valid number! Please try again."

Here's another example -- safe division:

```python
def safe_divide(a, b):
    try:
        result = a / b
        return result
    except ZeroDivisionError:
        print("Oops! You can't divide by zero.")
        return None

print(safe_divide(10, 3))   # 3.333...
print(safe_divide(10, 0))   # Prints message, returns None
```

The `try` block contains the code that *might* fail. The `except` block catches the specific exception and handles it. Your program keeps running instead of crashing.

!!! mascot-tip "Monty says: Let's code this!"
    ![Monty](../../img/monty-tip.png){ align=left width="80" }
    Always catch *specific* exceptions, not just any exception. Writing `except:` with no exception type is like telling a doctor "something hurts" without saying where. Specific except blocks help you handle each problem in the right way. For example, `except ValueError` handles bad input differently from `except FileNotFoundError` which handles a missing file.

### Multiple Except Blocks

What if your code could raise *different* types of exceptions? You can use **multiple except blocks** to handle each one differently. It's like having multiple backup plans -- one for each type of problem.

```python
def process_student_data(data, index):
    try:
        student = data[index]
        name = student["name"]
        grade = int(student["grade"])
        print(f"{name} is in grade {grade}")
    except IndexError:
        print(f"Error: No student at position {index}.")
    except KeyError as e:
        print(f"Error: Missing field {e} in student record.")
    except ValueError:
        print("Error: Grade must be a number.")
```

```python
students = [
    {"name": "Alice", "grade": "10"},
    {"name": "Bob"},  # missing "grade"
]

process_student_data(students, 0)  # Works: Alice is in grade 10
process_student_data(students, 1)  # KeyError: Missing field 'grade'
process_student_data(students, 5)  # IndexError: No student at position 5
```

Notice the `as e` in `except KeyError as e`. This captures the exception object in the variable `e` so you can include details about what went wrong in your error message. Very handy!

You can also catch multiple exception types in a single except block using a tuple:

```python
try:
    # some code
    value = int(input("Enter a number: "))
    result = 100 / value
except (ValueError, ZeroDivisionError):
    print("Please enter a valid non-zero number.")
```

<details markdown="1">
<summary>MicroSim: Try-Except Block Builder</summary>

#### Diagram: Try-Except Block Builder

Type: microsim
**sim-id:** try-except-builder<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Apply (L3)
**Bloom Verb:** construct, implement

**Learning Objective:** Students will be able to construct try-except blocks by dragging code statements into the correct positions within a try-except structure.

**Purpose:** A drag-and-drop interactive where students build try-except blocks by placing code statements into the correct sections (try block, except block, or outside the block).

**Layout:**
- Left side: A "Code Bank" panel containing draggable code statement cards
- Right side: A try-except template with labeled drop zones: "try:", "except [Type]:", and "after try-except"
- Bottom: A "Run" button that simulates execution and shows output
- Top-right: Score display

**Scenarios (3-5 rounds):**

Round 1 - Safe Input:
- Code bank: `user_input = input("Enter age: ")`, `age = int(user_input)`, `print("Invalid input")`, `print(f"Age: {age}")`
- Expected: `user_input` and `int()` in try, `print("Invalid")` in except ValueError, `print(f"Age")` in try after conversion

Round 2 - Safe List Access:
- Code bank: `items = [1, 2, 3]`, `print(items[index])`, `print("Index out of range")`, `index = int(input("Index: "))`
- Expected: list access in try, error message in except IndexError

Round 3 - Safe File Read:
- Code bank: `file = open("data.txt")`, `content = file.read()`, `print("File not found")`, `print(content)`
- Expected: open and read in try, error message in except FileNotFoundError

**Interactive elements:**
- Drag code cards from the bank into drop zones
- Drop zones highlight when a card is dragged over them
- "Run" button simulates execution with sample inputs (both valid and invalid)
- Shows simulated output for both success and error cases
- "Check" button validates the arrangement and provides feedback
- "Next Round" advances to the next scenario

**Visual style:** Card-based UI with color-coded sections (try=blue tint, except=red tint)
**Responsive:** Stacks vertically on narrow screens

**Instructional Rationale:** Construction tasks at the Apply level require students to actively decide which code goes where in a try-except structure. The drag-and-drop interface makes the spatial structure of exception handling visible. Running the simulation with both valid and invalid inputs shows students how try-except alters program flow.
</details>

### The Finally Block

Sometimes you have code that needs to run *no matter what* -- whether the try block succeeds or an exception is raised. That's what the **finally block** is for.

```python
def read_file_safely(filename):
    file = None
    try:
        file = open(filename, "r")
        content = file.read()
        print(content)
    except FileNotFoundError:
        print(f"Sorry, '{filename}' doesn't exist.")
    finally:
        if file:
            file.close()
            print("File closed.")
        print("Done!")
```

The `finally` block runs whether the file was opened successfully or not. This is especially important for **cleanup tasks** like closing files, shutting down network connections, or releasing resources. You don't want to leave files open just because an error happened somewhere.

Here's the execution flow:

1. Python runs the `try` block
2. If an exception occurs, Python jumps to the matching `except` block
3. Whether or not an exception occurred, Python *always* runs the `finally` block

```python
# Example showing finally always runs
def demonstrate_finally():
    try:
        print("Step 1: Trying something risky...")
        result = 10 / 0  # This will crash
        print("Step 2: This never runs")
    except ZeroDivisionError:
        print("Step 3: Caught the error!")
    finally:
        print("Step 4: Finally block ALWAYS runs!")

demonstrate_finally()
```

```
Step 1: Trying something risky...
Step 3: Caught the error!
Step 4: Finally block ALWAYS runs!
```

Notice that "Step 2" never printed because the exception happened before it. But "Step 4" printed because `finally` always runs.

You can also combine `try`, `except`, `else`, and `finally` together:

```python
try:
    number = int(input("Enter a number: "))
except ValueError:
    print("That's not a number!")
else:
    # This only runs if NO exception occurred
    print(f"Great! You entered {number}")
finally:
    # This ALWAYS runs
    print("Thanks for playing!")
```

<details markdown="1">
<summary>Diagram: Try-Except-Finally Flow Chart</summary>

#### Diagram: Try-Except-Finally Flow Chart

Type: infographic
**sim-id:** try-except-flow<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Understand (L2)
**Bloom Verb:** trace, explain

**Learning Objective:** Students will be able to trace the execution flow through try-except-else-finally blocks, predicting which blocks execute under different conditions.

**Purpose:** An animated flowchart that shows how Python decides which blocks to execute in a try-except-else-finally structure, with the ability to simulate both success and failure paths.

**Layout:**
- Flowchart from top to bottom
- Nodes: "Start" -> "try block" -> Diamond decision "Exception?" -> Yes branch to "except block" / No branch to "else block" -> Both converge at "finally block" -> "End"
- Each node is a rounded rectangle; the decision is a diamond

**Flowchart paths:**

Path A (No exception):
Start -> try block (completes) -> Exception? NO -> else block -> finally block -> End

Path B (Exception caught):
Start -> try block (exception!) -> Exception? YES -> Matching except? YES -> except block -> finally block -> End

Path C (Exception not caught):
Start -> try block (exception!) -> Exception? YES -> Matching except? NO -> finally block -> Error propagates up

**Interactive elements:**
- Two buttons: "Simulate Success" and "Simulate Error"
- Clicking either button animates a colored dot traveling through the flowchart along the appropriate path
- Each node highlights as the dot reaches it, with a brief pause and a text bubble showing what happens at that step
- "Step Through" mode lets students advance one node at a time
- A code panel on the side shows corresponding Python code with the current line highlighted

**Color scheme:**
- try block: blue
- except block: red
- else block: green
- finally block: purple
- Connecting arrows: gray
- Animated dot: gold

**Visual style:** Clean flowchart with rounded nodes, animated connecting arrows
**Responsive:** Flowchart scales to fit window; nodes reposition proportionally

**Instructional Rationale:** Flowcharts make abstract control flow visible and concrete. Animating the execution path helps students build a mental model of how Python navigates through try-except-else-finally structures. The ability to compare success and failure paths side-by-side reinforces the understanding that `finally` always executes.
</details>

## Raising Exceptions

So far, you've been *catching* exceptions that Python raises. But you can also *raise* your own exceptions on purpose. Why would you do that? Because sometimes *you* know something is wrong even though Python doesn't.

**Raising exceptions** lets you enforce rules in your code. It's like a bouncer at a club -- even if someone has a valid ID (correct data type), the bouncer can still turn them away if they're not on the guest list (invalid value for your specific purpose).

You raise an exception using the `raise` keyword:

```python
def set_age(age):
    if age < 0:
        raise ValueError("Age cannot be negative!")
    if age > 150:
        raise ValueError("Age seems unrealistic!")
    return age

# This works fine
my_age = set_age(16)  # 16

# This raises an exception
my_age = set_age(-5)
```

```
Traceback (most recent call last):
  File "example.py", line 8, in <module>
    my_age = set_age(-5)
  File "example.py", line 3, in set_age
    raise ValueError("Age cannot be negative!")
ValueError: Age cannot be negative!
```

Here's a more practical example -- a function that validates a student's grade:

```python
def record_grade(student_name, grade):
    if not isinstance(grade, (int, float)):
        raise TypeError(f"Grade must be a number, got {type(grade).__name__}")
    if grade < 0 or grade > 100:
        raise ValueError(f"Grade must be between 0 and 100, got {grade}")

    print(f"Recorded grade {grade} for {student_name}")

# These work
record_grade("Alice", 95)    # Recorded grade 95 for Alice
record_grade("Bob", 87.5)    # Recorded grade 87.5 for Bob

# These raise exceptions
record_grade("Charlie", "A+")   # TypeError
record_grade("Diana", 150)      # ValueError
```

!!! mascot-warning "Monty says: Watch out!"
    ![Monty](../../img/monty-warning.png){ align=left width="80" }
    A common mistake is catching an exception and then silently ignoring it. **Don't do this:** `except: pass`. It's like putting tape over the engine warning light in your car instead of fixing the engine. At minimum, log the error or print a message so you know something went wrong. Silent failures are much harder to debug than loud ones!

## Custom Exceptions

Python's built-in exceptions cover most common cases, but sometimes you need an exception that's specific to your program. **Custom exceptions** let you create your own exception types that describe problems unique to your application.

Creating a custom exception is surprisingly simple. You just create a new class that inherits from `Exception`:

```python
class InvalidGradeError(Exception):
    """Raised when a grade is outside the valid range."""
    pass

class StudentNotFoundError(Exception):
    """Raised when a student doesn't exist in the system."""
    pass
```

Now you can raise and catch your custom exceptions just like built-in ones:

```python
class InvalidGradeError(Exception):
    """Raised when a grade is outside the valid range."""
    pass

class StudentNotFoundError(Exception):
    """Raised when a student doesn't exist in the system."""
    pass

# A simple gradebook
gradebook = {"Alice": 92, "Bob": 85}

def update_grade(name, grade):
    if name not in gradebook:
        raise StudentNotFoundError(f"No student named '{name}' in the gradebook")
    if grade < 0 or grade > 100:
        raise InvalidGradeError(f"Grade {grade} is not between 0 and 100")
    gradebook[name] = grade
    print(f"Updated {name}'s grade to {grade}")

# Using it with try-except
try:
    update_grade("Alice", 95)     # Works fine
    update_grade("Charlie", 88)   # StudentNotFoundError!
except StudentNotFoundError as e:
    print(f"Student error: {e}")
except InvalidGradeError as e:
    print(f"Grade error: {e}")
```

```
Updated Alice's grade to 95
Student error: No student named 'Charlie' in the gradebook
```

Custom exceptions make your code more *readable* and more *precise*. Instead of raising a generic `ValueError` for every kind of problem, you can create specific exception types that tell other developers (and your future self) exactly what went wrong.

Here's a good naming convention: always end your custom exception names with `Error` (e.g., `InvalidGradeError`, `InsufficientFundsError`, `PasswordTooWeakError`). This makes it clear that the class is an exception.

You can also add custom attributes to your exceptions:

```python
class InsufficientFundsError(Exception):
    def __init__(self, balance, amount):
        self.balance = balance
        self.amount = amount
        self.deficit = amount - balance
        super().__init__(
            f"Cannot withdraw ${amount}. "
            f"Balance: ${balance}. "
            f"Short by: ${self.deficit}"
        )

# Using the custom exception
def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFundsError(balance, amount)
    return balance - amount

try:
    new_balance = withdraw(50, 75)
except InsufficientFundsError as e:
    print(e)
    print(f"You need ${e.deficit} more")
```

```
Cannot withdraw $75. Balance: $50. Short by: $25
You need $25 more
```

<details markdown="1">
<summary>MicroSim: Exception Handling Simulator</summary>

#### Diagram: Exception Handling Simulator

Type: microsim
**sim-id:** exception-handling-sim<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Analyze (L4)
**Bloom Verb:** predict, trace

**Learning Objective:** Students will be able to predict the output of Python code containing try-except-else-finally blocks with various exception scenarios by tracing through the code execution flow.

**Purpose:** An interactive code execution simulator where students trace through exception handling code step-by-step, predicting what each line will do and whether exceptions will be raised.

**Layout:**
- Left panel: Python code with line numbers, current line highlighted
- Right panel: Output console showing printed output
- Bottom panel: "What happens next?" question with multiple choice options
- Top bar: Scenario selector dropdown and progress indicator

**Scenarios (5+):**

Scenario 1 - Basic try-except:
```
try:
    x = int("hello")
    print("Success")
except ValueError:
    print("Bad value")
finally:
    print("Done")
```
Expected output: "Bad value" then "Done"

Scenario 2 - No exception:
```
try:
    x = int("42")
    print(f"Got {x}")
except ValueError:
    print("Bad value")
else:
    print("No errors!")
finally:
    print("Done")
```
Expected output: "Got 42" then "No errors!" then "Done"

Scenario 3 - Multiple except blocks:
```
data = {"name": "Alice"}
try:
    age = data["age"]
    result = 100 / age
except KeyError:
    print("Key missing")
except ZeroDivisionError:
    print("Can't divide by zero")
```
Expected output: "Key missing"

Scenario 4 - Raising exceptions:
```
def check_age(age):
    if age < 0:
        raise ValueError("Negative age")
    return age

try:
    check_age(-5)
except ValueError as e:
    print(f"Error: {e}")
```
Expected output: "Error: Negative age"

**Interactive elements:**
- "Step" button advances execution one line at a time
- Current line highlighted in yellow; executed lines in green; skipped lines in gray
- Before each step, a "What happens next?" popup asks the student to predict
- Options: "This line executes normally", "This line raises an exception", "This line is skipped"
- Immediate feedback on predictions
- Output console updates in real-time as lines execute
- "Reset" button restarts the current scenario

**Visual style:** IDE-like appearance with dark code panel and light output panel
**Responsive:** Panels stack vertically on narrow screens

**Instructional Rationale:** Step-by-step execution tracing at the Analyze level requires students to predict program behavior rather than just observe it. The prediction-before-reveal pattern activates metacognition and helps students build accurate mental models of exception handling flow. Multiple scenarios cover the major patterns (exception raised, no exception, multiple except blocks, raise keyword).
</details>

## Assertions

The last tool in your error-handling toolkit is the **assertion**. An assertion is a sanity check -- a statement that *should* be true at a specific point in your code. If the assertion is true, nothing happens and your program continues. If it's false, Python raises an `AssertionError`.

Think of assertions as little notes you leave for yourself: "At this point, I'm *certain* this should be true. If it's not, something has gone terribly wrong."

```python
def calculate_average(scores):
    assert len(scores) > 0, "Cannot average an empty list!"
    return sum(scores) / len(scores)

# This works
print(calculate_average([85, 90, 78]))  # 84.33...

# This triggers the assertion
print(calculate_average([]))
```

```
Traceback (most recent call last):
  File "example.py", line 6, in <module>
    print(calculate_average([]))
  File "example.py", line 2, in calculate_average
    assert len(scores) > 0, "Cannot average an empty list!"
AssertionError: Cannot average an empty list!
```

The syntax for `assert` is:

```python
assert condition, "Optional error message"
```

Here's when to use assertions vs. exceptions:

| Use Case | Use Assert | Use Try-Except |
|----------|-----------|----------------|
| Checking your own code's logic | Yes | No |
| Handling user input | No | Yes |
| Catching unexpected states during development | Yes | No |
| Handling network or file errors | No | Yes |
| Validating function arguments in your own code | Yes | Sometimes |

Assertions are primarily a **debugging tool**. They help you catch bugs during development by verifying assumptions. They're *not* meant to handle user input or expected runtime problems -- that's what try-except is for.

Here's a practical example:

```python
def apply_discount(price, discount_percent):
    # These should ALWAYS be true if our code is correct
    assert price >= 0, f"Price can't be negative: {price}"
    assert 0 <= discount_percent <= 100, f"Discount must be 0-100: {discount_percent}"

    discounted_price = price * (1 - discount_percent / 100)

    # The result should never be negative
    assert discounted_price >= 0, "Bug: discounted price is negative!"

    return discounted_price

print(apply_discount(100, 20))  # 80.0
print(apply_discount(50, 10))   # 45.0
```

!!! mascot-celebration "Monty says: You've got this!"
    ![Monty](../../img/monty-celebrates.png){ align=left width="80" }
    Congrats, coder! You now know how to handle every kind of error Python can throw at you. Syntax errors? Read the message and fix the typo. Runtime errors? Catch them with try-except. Logic errors? Test carefully and trace your code. You've leveled up your debugging skills big time. Go forth and write fearless code!

## Real-World Example: Building a Robust Input System

Let's put everything together by building a function that safely gets a number from the user. This is something you'll use in nearly every interactive program:

```python
class InputRangeError(Exception):
    """Raised when input is outside the acceptable range."""
    def __init__(self, value, min_val, max_val):
        self.value = value
        self.min_val = min_val
        self.max_val = max_val
        super().__init__(
            f"{value} is not between {min_val} and {max_val}"
        )

def get_number(prompt, min_val=None, max_val=None, max_attempts=3):
    """Safely get a number from the user with validation."""
    attempts = 0

    while attempts < max_attempts:
        try:
            user_input = input(prompt)
            number = float(user_input)

            # Check range if specified
            if min_val is not None and max_val is not None:
                if number < min_val or number > max_val:
                    raise InputRangeError(number, min_val, max_val)

            return number

        except ValueError:
            print(f"'{user_input}' is not a valid number. Try again.")
        except InputRangeError as e:
            print(f"Out of range: {e}. Try again.")
        finally:
            attempts += 1

    print(f"Too many failed attempts ({max_attempts}).")
    return None

# Using the function
score = get_number("Enter your test score (0-100): ", 0, 100)
if score is not None:
    print(f"Score recorded: {score}")
else:
    print("No score recorded.")
```

This example uses:

- A **custom exception** (`InputRangeError`) for out-of-range values
- A **try-except block** to catch invalid input
- **Multiple except blocks** for different error types
- A **finally block** to count attempts no matter what happens
- The **raise** keyword to enforce business rules

## Key Takeaways

- **Errors and exceptions** are Python's way of telling you something went wrong -- they're helpful messages, not punishments.
- **Syntax errors** happen before your program runs (bad grammar), **runtime errors** happen during execution (unexpected situations), and **logic errors** produce wrong results without any error message.
- Common **exception types** include **TypeError** (wrong data type), **ValueError** (wrong value), **IndexError** (list index out of range), and **KeyError** (dictionary key not found).
- The **try-except block** catches exceptions and lets your program handle them gracefully instead of crashing.
- Use **multiple except blocks** to handle different exception types differently.
- The **finally block** always runs, making it perfect for cleanup tasks like closing files.
- **Raising exceptions** with `raise` lets you enforce rules and signal problems in your own code.
- **Custom exceptions** are classes that inherit from `Exception` and describe problems specific to your program.
- **Assertions** are debugging sanity checks that verify your assumptions about your code's state.
- Even the best programmers make errors -- the skill is knowing how to read the error messages and handle them.

??? question "Check Your Understanding: What's the difference between a syntax error and a runtime error?"
    A **syntax error** happens *before* your program runs. Python can't even start executing the code because the grammar is wrong (like a missing colon or unmatched parenthesis). A **runtime error** happens *while* the program is running. The code is grammatically correct, but something goes wrong during execution (like dividing by zero or accessing an index that doesn't exist). Syntax errors are caught immediately; runtime errors only show up when the problematic line actually executes.

??? question "Check Your Understanding: What does the `finally` block do, and when does it run?"
    The `finally` block contains code that runs **no matter what** -- whether the `try` block succeeds, whether an exception is raised and caught, or even whether an exception is raised and *not* caught. It's used for cleanup tasks like closing files, releasing resources, or printing a final message. In a `try-except-finally` structure, `finally` always runs last.

??? question "Check Your Understanding: Write a custom exception called `NegativeNumberError` and a function that raises it."
    Here's one way to do it:

    ```python
    class NegativeNumberError(Exception):
        """Raised when a negative number is provided."""
        pass

    def square_root(number):
        if number < 0:
            raise NegativeNumberError(
                f"Cannot take square root of {number}"
            )
        return number ** 0.5

    # Test it:
    try:
        result = square_root(-9)
    except NegativeNumberError as e:
        print(f"Error: {e}")
    # Output: Error: Cannot take square root of -9
    ```

    The custom exception class inherits from `Exception` and ends with `Error` by convention. The function checks for invalid input and raises the custom exception with a descriptive message.
