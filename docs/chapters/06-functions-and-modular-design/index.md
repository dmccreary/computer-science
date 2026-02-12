---
title: Functions and Modular Design
description: Defining functions with parameters and return values, variable scope, default arguments, and docstrings in Python.
generated_by: claude skill chapter-content-generator
date: 2026-02-11
version: 0.04
---

# Functions and Modular Design

## Summary

This chapter introduces functions as the primary tool for organizing and reusing code. Students will learn to define functions with parameters and return values, understand variable scope (local vs global), use default and keyword arguments, and write documentation with docstrings. The chapter emphasizes modular design principles that lead to well-structured, maintainable programs.

## Concepts Covered

This chapter covers the following 17 concepts from the learning graph:

1. Functions
2. Function Definition
3. Function Call
4. Parameters
5. Arguments
6. Return Statement
7. Return Values
8. None Type
9. Default Parameters
10. Keyword Arguments
11. Positional Arguments
12. Multiple Return Values
13. Variable Scope
14. Local Variables
15. Global Variables
16. Global Keyword
17. Docstrings

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Computer Science](../01-intro-to-computer-science/index.md)
- [Chapter 2: Python Fundamentals](../02-python-fundamentals/index.md)
- [Chapter 4: Control Flow](../04-control-flow/index.md)
- [Chapter 5: Working with Strings](../05-working-with-strings/index.md)

---

!!! mascot-welcome "Monty says: Let's code this!"
    ![Monty](../../img/monty-welcome.png){ align=left width="80" }
    Welcome back, coders! This chapter is a *huge* milestone. You're about to learn about functions — the single most important tool for writing clean, organized, reusable code. Once you master functions, you'll never look at programming the same way again. Let's do this!

## What Are Functions?

Imagine you're baking cookies. Every time you want cookies, you don't reinvent the recipe from scratch. You follow the same set of steps: preheat the oven, mix the ingredients, scoop the dough, bake for 12 minutes. That recipe is a set of reusable instructions you can follow again and again.

A **function** in Python works the same way. It's a named block of code that performs a specific task. You write it once, and then you can use it as many times as you want — no copy-pasting needed. Functions are the recipe cards of programming.

You've actually been using functions since Chapter 2 without realizing it. Every time you wrote `print("Hello!")` or `len("Python")` or `input("What's your name? ")`, you were *calling* a function that someone else already wrote for you. Now it's time to write your own.

Why do functions matter? Here are the big reasons:

- **Reusability** — Write code once, use it everywhere
- **Organization** — Break big programs into smaller, manageable pieces
- **Readability** — Give chunks of code meaningful names so others (and future you) can understand them
- **Debugging** — When something breaks, you only need to fix it in one place
- **Collaboration** — Different team members can work on different functions

In short, functions turn spaghetti code into a well-organized recipe book.

#### Diagram: Function Anatomy

<iframe src="../../sims/function-anatomy/main.html" width="100%" height="502px" scrolling="no"></iframe>

<details markdown="1">
<summary>Function Anatomy Interactive Diagram</summary>
Type: diagram
**sim-id:** function-anatomy<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Remember (L1)
**Bloom Verb:** identify, label

**Learning Objective:** Students will be able to identify the parts of a Python function definition — the `def` keyword, function name, parameters, colon, body, and return statement — and describe the purpose of each.

**Purpose:** An interactive labeled diagram of a Python function that highlights each part when the student hovers over it, showing the name and purpose of each syntactic element.

**Layout:**
- Center of canvas: A large, syntax-highlighted Python function displayed as styled text:
```python
def greet(name):
    """Say hello to someone."""
    message = "Hello, " + name + "!"
    return message
```
- Each part of the function has an invisible hover zone
- A tooltip panel on the right side shows descriptions

**Hover zones and descriptions:**

1. `def` keyword — "The def keyword tells Python you're defining a new function."
2. `greet` (function name) — "The function's name. You'll use this name to call the function later."
3. `(name)` (parameter) — "Parameters are placeholders for data the function will receive. They go inside parentheses."
4. `:` (colon) — "The colon marks the beginning of the function body. Everything indented below is part of the function."
5. `"""Say hello to someone."""` (docstring) — "A docstring describes what the function does. It's the first line inside the function, wrapped in triple quotes."
6. `message = "Hello, " + name + "!"` (body) — "The body is where the function does its work. All body lines must be indented."
7. `return message` (return statement) — "The return statement sends a value back to whoever called the function."

**Interactive elements:**
- Hover over any part to highlight it with a colored background and show its description in the tooltip panel
- Click any part to "lock" the tooltip so it stays visible while you read it
- A "Show All Labels" button draws arrows from each part to a labeled list

**Color scheme:**
- `def` keyword: blue
- Function name: green
- Parameters: orange
- Colon: gray
- Docstring: purple
- Body: default/white
- Return statement: red

**Visual style:** Monospaced font for code, clean modern tooltip panel
**Responsive:** Font size scales with canvas width; tooltip repositions on smaller screens

**Instructional Rationale:** Hover-to-reveal supports the Remember level by letting students explore each syntactic element at their own pace. The visual mapping between syntax and purpose builds a mental model of function structure before students write their own.
</details>

## Defining Your First Function

Let's write our first function. A **function definition** is the code that creates a new function. It starts with the `def` keyword, followed by the function's name, parentheses, and a colon. The function's code goes on the next lines, indented by four spaces.

```python
def say_hello():
    print("Hello, world!")
```

That's it! You just defined a function called `say_hello`. But here's the important part: **defining a function doesn't run it.** It's like writing a recipe in your recipe book — the cookies don't magically appear until you actually follow the recipe.

To run the function, you need to make a **function call**:

```python
say_hello()
```

When Python sees this line, it jumps up to where you defined `say_hello`, runs the code inside it, then comes back to where it left off. You can call the same function as many times as you want:

```python
say_hello()  # prints "Hello, world!"
say_hello()  # prints "Hello, world!" again
say_hello()  # and again!
```

Here's the basic pattern for defining and calling a function:

| Step | What You Write | What It Does |
|------|---------------|--------------|
| 1. Define | `def function_name():` | Creates the function (stores the recipe) |
| 2. Write body | Indented code below `def` | Describes what the function does |
| 3. Call | `function_name()` | Runs the function (follows the recipe) |

### Naming Your Functions

Function names follow the same rules as variable names:

- Use lowercase letters and underscores (snake_case): `calculate_area`, `get_user_input`
- Start with a letter or underscore, not a number
- Make names descriptive — `calculate_tax` is better than `ct`
- Use verbs since functions *do* things: `greet_user`, `find_maximum`, `print_report`

## Parameters and Arguments

A function that does the exact same thing every time is useful, but limited. What if you want to customize what it does? That's where **parameters** come in.

**Parameters** are variables listed inside the parentheses of a function definition. They act as placeholders for data that will be provided when the function is called. Think of them like blank lines on a form — the function says "I need a name here," and you fill it in when you use the function.

```python
def greet(name):
    print(f"Hello, {name}!")
```

In this example, `name` is a parameter. When you call the function, you provide a value for that parameter — and that value is called an **argument**:

```python
greet("Alice")    # "Alice" is the argument
greet("Bob")      # "Bob" is the argument
greet("Monty")    # "Monty" is the argument
```

Output:

```
Hello, Alice!
Hello, Bob!
Hello, Monty!
```

Here's a quick way to remember the difference:

| Term | Where It Appears | What It Is |
|------|-----------------|------------|
| **Parameter** | In the function *definition* | The placeholder (the blank line on the form) |
| **Argument** | In the function *call* | The actual value you fill in |

You can have multiple parameters — just separate them with commas:

```python
def add(a, b):
    result = a + b
    print(f"{a} + {b} = {result}")

add(3, 5)     # prints "3 + 5 = 8"
add(10, 20)   # prints "10 + 20 = 30"
```

!!! mascot-thinking "Monty says: You've got this!"
    ![Monty](../../img/monty-thinking.png){ align=left width="80" }
    Think of a function like a vending machine. The parameters are the slots where you insert your selections (like choosing a snack and a drink). The arguments are the actual buttons you press. The function's body is all the machinery inside, and the output is the snack that drops out. Same machine, different snacks depending on what you press!

## Return Values: Getting Results Back

So far, our functions have *printed* things. But what if you want a function to calculate a result and give it back to you so you can use it later? That's what the **return statement** does.

The `return` keyword sends a value — called a **return value** — back to the code that called the function. It's like asking a friend to go check the temperature outside. You don't want them to just *shout* the temperature into the void — you want them to come back and *tell you* so you can decide whether to wear a jacket.

```python
def add(a, b):
    return a + b

result = add(3, 5)
print(result)       # prints 8
```

Notice the difference from before: instead of `print` inside the function, we use `return`. The function sends the value back, and we can store it in a variable, use it in another calculation, or do whatever we want with it.

```python
def square(n):
    return n * n

area = square(7)           # area is now 49
double_area = square(7) * 2  # double_area is 98
print(f"Area: {area}")
print(f"Double: {double_area}")
```

Here are some key facts about `return`:

- A function can have multiple `return` statements (often inside `if/else` blocks), but only one will execute
- Once `return` runs, the function immediately stops — any code after the `return` line won't execute
- A function without a `return` statement automatically returns a special value called `None`

### The None Type

What happens when a function doesn't explicitly return anything? Python gives it a return value of `None`. **None** is a special Python value — it represents "nothing" or "no value." Its type is the **None type** (technically `NoneType`).

```python
def say_hello():
    print("Hello!")

result = say_hello()
print(result)       # prints: None
print(type(result)) # prints: <class 'NoneType'>
```

`None` isn't the same as zero, an empty string, or `False`. It's its own thing — it means "this variable doesn't hold any meaningful value." You'll see `None` come up often when debugging, so it's good to know what it means.

#### Diagram: Function Call Flow

<iframe src="../../sims/function-call-flow/main.html" width="100%" height="532px" scrolling="no"></iframe>

<details markdown="1">
<summary>Function Call Flow MicroSim</summary>
Type: microsim
**sim-id:** function-call-flow<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Understand (L2)
**Bloom Verb:** trace, explain

**Learning Objective:** Students will be able to trace the flow of execution when a function is called, including how arguments are passed, how the function body runs, and how the return value flows back to the caller.

**Purpose:** An animated step-through showing a function call, visualizing the jump from caller code to the function definition and back, with arguments flowing in and the return value flowing out.

**Canvas layout:**
- Left side: "Caller Code" panel showing:
```python
x = add(3, 5)
print(x)
```
- Right side: "Function Definition" panel showing:
```python
def add(a, b):
    return a + b
```
- Between the panels: animated arrows and value "bubbles" showing data flow
- Bottom: A step-by-step narration bar explaining what's happening

**Animation steps:**

1. Highlight `add(3, 5)` in the caller — Narration: "Python sees a function call: add(3, 5)"
2. Animate "3" bubble flowing from caller to parameter `a` — Narration: "Argument 3 is assigned to parameter a"
3. Animate "5" bubble flowing from caller to parameter `b` — Narration: "Argument 5 is assigned to parameter b"
4. Highlight `return a + b` in the function — Narration: "Python evaluates a + b = 3 + 5 = 8"
5. Animate "8" bubble flowing back from function to `x = ` — Narration: "The return value 8 is sent back and stored in x"
6. Highlight `print(x)` — Narration: "Python prints x, which is 8"

**Interactive controls:**
- "Step" button: Advance one step at a time
- "Auto Play" button: Animate all steps with a 1.5-second delay
- "Reset" button: Return to starting state
- Speed slider to adjust animation pace

**Visual style:**
- Code panels use monospaced font with syntax highlighting
- Value "bubbles" are colored circles with the value displayed inside
- Active lines have a yellow highlight
- Arrows animate smoothly with easing

**Responsive:** Panels stack vertically on narrow screens

**Instructional Rationale:** Step-through animation supports the Understand level by making the invisible execution flow visible. Students often struggle with the concept of "jumping" to a function and back — this animation makes the jump explicit. Value bubbles show how arguments become parameters and how return values flow back.
</details>

## Positional and Keyword Arguments

When you call a function with multiple parameters, there are two ways to pass the arguments.

**Positional arguments** are the default. The first argument goes to the first parameter, the second argument goes to the second parameter, and so on. Order matters!

```python
def describe_pet(animal, name):
    print(f"I have a {animal} named {name}.")

describe_pet("cat", "Whiskers")   # I have a cat named Whiskers.
describe_pet("Whiskers", "cat")   # I have a Whiskers named cat. (Oops!)
```

See what happened in the second call? We swapped the order, so the arguments got matched to the wrong parameters. With positional arguments, you have to remember which order to use.

**Keyword arguments** let you specify exactly which parameter gets which value by using the parameter's name:

```python
describe_pet(animal="cat", name="Whiskers")   # Correct!
describe_pet(name="Whiskers", animal="cat")   # Also correct!
```

With keyword arguments, order doesn't matter — Python matches each argument to the right parameter by name. This makes your code clearer, especially when a function has many parameters.

You can even mix positional and keyword arguments, but there's one rule: **positional arguments must come first**.

```python
describe_pet("cat", name="Whiskers")  # OK! positional first, keyword second
describe_pet(animal="cat", "Whiskers")  # ERROR! keyword before positional
```

| Argument Type | How It Works | Order Matters? | Example |
|--------------|--------------|----------------|---------|
| **Positional** | Matched by position (1st, 2nd, 3rd...) | Yes | `greet("Alice", 16)` |
| **Keyword** | Matched by parameter name | No | `greet(name="Alice", age=16)` |
| **Mixed** | Positional first, then keyword | Partially | `greet("Alice", age=16)` |

!!! mascot-warning "Monty says: Watch out!"
    ![Monty](../../img/monty-warning.png){ align=left width="80" }
    A common mistake is putting keyword arguments before positional ones. Python will throw a `SyntaxError` if you try this. Always put positional arguments first, keyword arguments second!

## Default Parameters

Sometimes you want a parameter to have a fallback value in case the caller doesn't provide one. That's what **default parameters** do. You set a default value in the function definition using `=`:

```python
def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")

greet("Alice")              # prints "Hello, Alice!" (uses default)
greet("Bob", "Hey there")   # prints "Hey there, Bob!" (overrides default)
```

The parameter `greeting` has a default value of `"Hello"`. If you call `greet` with only one argument, `greeting` automatically becomes `"Hello"`. If you provide a second argument, it replaces the default.

Default parameters are incredibly handy:

```python
def calculate_tip(bill, tip_rate=0.18):
    """Calculate the tip amount for a restaurant bill."""
    return bill * tip_rate

print(calculate_tip(50))          # $9.00 (18% default)
print(calculate_tip(50, 0.20))    # $10.00 (20% custom)
print(calculate_tip(50, 0.15))    # $7.50 (15% custom)
```

There's one important rule: **parameters with default values must come after parameters without defaults.** Otherwise Python gets confused about which argument matches which parameter.

```python
def greet(greeting="Hello", name):  # ERROR! Default before non-default
    print(f"{greeting}, {name}!")

def greet(name, greeting="Hello"):  # Correct! Non-default first
    print(f"{greeting}, {name}!")
```

## Multiple Return Values

Here's a Python superpower: a single function can return **multiple return values** at once. You do this by separating the values with commas after `return`. Under the hood, Python packs them into a *tuple* (which you'll learn more about in Chapter 10).

```python
def get_min_max(numbers):
    return min(numbers), max(numbers)

lowest, highest = get_min_max([4, 7, 2, 9, 1])
print(f"Lowest: {lowest}")    # Lowest: 1
print(f"Highest: {highest}")  # Highest: 9
```

This is really useful when a function needs to compute several related pieces of information:

```python
def analyze_scores(scores):
    total = sum(scores)
    average = total / len(scores)
    highest = max(scores)
    lowest = min(scores)
    return average, highest, lowest

avg, high, low = analyze_scores([85, 92, 78, 95, 88])
print(f"Average: {avg}")    # Average: 87.6
print(f"Highest: {high}")   # Highest: 95
print(f"Lowest: {low}")     # Lowest: 78
```

The left side of the assignment uses **unpacking** — each variable on the left matches up with one returned value on the right. If you use the wrong number of variables, Python will raise an error.

#### Diagram: Arguments vs Parameters

<iframe src="../../sims/args-vs-params/main.html" width="100%" height="502px" scrolling="no"></iframe>

<details markdown="1">
<summary>Arguments vs Parameters Interactive Comparison</summary>
Type: diagram
**sim-id:** args-vs-params<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Understand (L2)
**Bloom Verb:** differentiate, classify

**Learning Objective:** Students will be able to distinguish between parameters (in the definition) and arguments (in the call), and between positional, keyword, and default argument types.

**Purpose:** An interactive side-by-side display that shows a function definition and multiple function calls, with color-coded connections between arguments and their corresponding parameters.

**Canvas layout:**
- Top half: Function definition displayed prominently:
```python
def make_profile(name, age, city="Unknown"):
    return f"{name}, age {age}, from {city}"
```
- Each parameter is color-coded: `name` (blue), `age` (green), `city` (orange)
- Bottom half: Three function call examples the student can switch between using tabs:
  - Tab 1 "Positional": `make_profile("Alice", 16, "Austin")`
  - Tab 2 "Keyword": `make_profile(age=16, name="Alice", city="Austin")`
  - Tab 3 "Default Used": `make_profile("Alice", 16)`

**Interactive elements:**
- Click a tab to show a different function call style
- Animated lines connect each argument to its matched parameter, using the parameter's color
- Hover over any argument to highlight both the argument and the parameter it maps to
- For Tab 3, the default value for `city` glows to show it's being used automatically
- Below each call: text showing the return value output

**Visual style:**
- Monospaced font for code
- Smooth curved connecting lines between arguments and parameters
- Subtle animation when switching tabs

**Color scheme:**
- `name` parameter/argument: blue
- `age` parameter/argument: green
- `city` parameter/argument: orange
- Default value indicator: dashed orange border

**Responsive:** Layout stacks vertically on narrow screens

**Instructional Rationale:** Color-coded matching lines make the abstract mapping between arguments and parameters concrete and visible. Showing three different calling styles in tabs lets students compare positional, keyword, and default behaviors side by side. This supports the Understand level by helping students differentiate between these closely related concepts.
</details>

## Variable Scope: Who Can See What?

Here's a concept that trips up a lot of new programmers, so pay close attention. **Variable scope** determines *where* in your code a variable can be accessed. Not every variable is available everywhere.

### Local Variables

A **local variable** is a variable created *inside* a function. It only exists while the function is running, and it can only be used inside that function. Once the function finishes, the local variable vanishes like a Snapchat message.

```python
def calculate_area(length, width):
    area = length * width   # 'area' is a local variable
    return area

calculate_area(5, 3)
print(area)   # ERROR! 'area' doesn't exist outside the function
```

The variable `area` was born inside `calculate_area` and dies when the function ends. The rest of your program has no idea it ever existed.

Parameters are also local variables. In the example above, `length` and `width` only exist inside `calculate_area`.

### Global Variables

A **global variable** is a variable created *outside* of any function, in the main body of your program. It can be read from anywhere — inside functions, outside functions, everywhere.

```python
school_name = "Westside High"   # global variable

def print_welcome():
    print(f"Welcome to {school_name}!")  # can READ the global variable

print_welcome()   # prints "Welcome to Westside High!"
```

But here's the catch: you can *read* a global variable from inside a function, but you **cannot change it** without special permission. If you try to assign a new value to it inside a function, Python creates a *new local variable* with the same name instead:

```python
count = 0   # global variable

def increment():
    count = count + 1   # ERROR! Python thinks 'count' is local
                         # but it hasn't been assigned yet

increment()
```

This error happens because Python sees `count = ` on the left side and assumes you're trying to create a local variable called `count`. But you're also trying to use `count` on the right side before it's been created locally. Confusing? It's one of Python's quirks.

### The Global Keyword

If you truly need to modify a global variable from inside a function, you must use the **global keyword** to tell Python "I mean the global one, not a new local one":

```python
count = 0   # global variable

def increment():
    global count         # "I want the GLOBAL count"
    count = count + 1    # Now this works!

increment()
increment()
increment()
print(count)   # prints 3
```

However, using `global` is generally considered a bad habit. It makes your code harder to understand and debug because any function could change any variable at any time. It's like giving everyone in school the keys to the janitor's closet — technically possible, but things get messy fast.

**Best practice:** Instead of using global variables, pass values into functions as parameters and get results back using `return`. This keeps your functions self-contained and predictable.

Here's a summary of scope rules:

| Variable Type | Created Where? | Accessible Where? | Lifespan |
|--------------|---------------|-------------------|----------|
| **Local** | Inside a function | Only inside that function | While the function runs |
| **Global** | Outside all functions | Readable everywhere; writable only with `global` keyword | Entire program |
| **Parameter** | In the function definition | Only inside that function (acts like a local variable) | While the function runs |

!!! mascot-thinking "Monty says: Let's debug this together!"
    ![Monty](../../img/monty-thinking.png){ align=left width="80" }
    Think of scope like rooms in a house. A local variable is like a note pinned to the fridge in the kitchen — only people in the kitchen can see it. A global variable is like a message on the mailbox outside — everyone can read it. The `global` keyword is like giving someone the key to the mailbox so they can change the message.

#### Diagram: Variable Scope Visualizer

<iframe src="../../sims/variable-scope-visualizer/main.html" width="100%" height="552px" scrolling="no"></iframe>

<details markdown="1">
<summary>Variable Scope Visualizer MicroSim</summary>
Type: microsim
**sim-id:** variable-scope-visualizer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Apply (L3)
**Bloom Verb:** demonstrate, predict

**Learning Objective:** Students will be able to predict the value of variables at different points in a program by understanding the rules of local and global variable scope.

**Purpose:** An interactive code execution visualizer that shows which variables exist (and their values) at each step of a program containing both global variables and function calls with local variables.

**Canvas layout:**
- Left panel: A short Python program displayed with line numbers:
```python
x = 10              # Line 1
y = 20              # Line 2

def double(n):       # Line 4
    result = n * 2   # Line 5
    return result    # Line 6

z = double(x)        # Line 8
print(x, y, z)       # Line 9
```
- Right panel: "Variable Scope" display with two sections:
  - "Global Scope" box (blue border) showing global variables and their current values
  - "Local Scope: double()" box (orange border) that appears/disappears when the function is active

**Animation steps:**

1. Line 1 executes — Global scope shows: `x = 10`
2. Line 2 executes — Global scope shows: `x = 10, y = 20`
3. Line 8 calls `double(x)` — Local scope box appears: `n = 10`
4. Line 5 executes — Local scope shows: `n = 10, result = 20`
5. Line 6 returns — Local scope box disappears (variables gone!), Global scope adds: `z = 20`
6. Line 9 prints — Output shown: `10 20 20`

**Interactive controls:**
- "Step Forward" and "Step Back" buttons
- "Auto Play" button with speed slider
- "Reset" button
- Dropdown to choose from 3 different code examples:
  - Example 1: Basic scope (shown above)
  - Example 2: Name collision (global and local variable with the same name)
  - Example 3: Using `global` keyword

**Visual elements:**
- Current executing line highlighted in yellow
- Global scope box always visible
- Local scope box fades in when function is entered, fades out when function exits
- Variables appear with a brief "pop" animation when created
- Variables fade out and "disappear" when their scope ends

**Color scheme:**
- Global scope border: blue
- Local scope border: orange
- Current line highlight: yellow
- New variable animation: green flash

**Responsive:** Panels stack vertically on narrow screens

**Instructional Rationale:** Step-by-step execution with a visible scope display directly addresses the Apply level by requiring students to predict outcomes before stepping forward. The appearing/disappearing local scope box vividly demonstrates that local variables have a limited lifespan. Multiple code examples let students explore edge cases like name collisions and the global keyword.
</details>

## Docstrings: Documenting Your Functions

As your programs grow, you'll write dozens (or hundreds) of functions. A month from now, will you remember what each one does? What about your teammates? That's why good programmers document their functions with **docstrings**.

A **docstring** (short for "documentation string") is a string that appears as the very first line inside a function. It describes what the function does, what parameters it expects, and what it returns. Docstrings are wrapped in triple quotes (`"""..."""`).

```python
def calculate_bmi(weight_kg, height_m):
    """Calculate Body Mass Index (BMI).

    Parameters:
        weight_kg: Weight in kilograms
        height_m: Height in meters

    Returns:
        The BMI value as a float
    """
    return weight_kg / (height_m ** 2)
```

Docstrings aren't just comments — Python actually stores them and makes them available through the built-in `help()` function:

```python
help(calculate_bmi)
```

Output:

```
Help on function calculate_bmi:

calculate_bmi(weight_kg, height_m)
    Calculate Body Mass Index (BMI).

    Parameters:
        weight_kg: Weight in kilograms
        height_m: Height in meters

    Returns:
        The BMI value as a float
```

Here are some docstring best practices:

- **First line:** A brief, one-sentence summary of what the function does
- **Parameters section:** List each parameter and what it represents
- **Returns section:** Describe what the function returns
- **Keep it honest:** If the function changes, update the docstring too!

Even a simple one-liner helps:

```python
def square(n):
    """Return the square of n."""
    return n * n
```

!!! mascot-tip "Monty says: Let's debug this together!"
    ![Monty](../../img/monty-tip.png){ align=left width="80" }
    Here's a tip from the pros: write your docstring *before* you write the function body. It forces you to think about what the function should do before you get lost in the details of *how* it does it. Future you will thank present you!

## Modular Design: Putting It All Together

Now that you know how to write functions, let's talk about *when* and *why* to use them. The philosophy of breaking a program into small, focused functions is called **modular design**.

Imagine you're building a calculator app. You could write the entire thing as one giant block of code — but that would be messy, hard to read, and a nightmare to debug. Instead, you break it into modules (functions), each handling one task:

```python
def get_numbers():
    """Get two numbers from the user."""
    a = float(input("Enter first number: "))
    b = float(input("Enter second number: "))
    return a, b

def add(a, b):
    """Return the sum of a and b."""
    return a + b

def subtract(a, b):
    """Return the difference of a and b."""
    return a - b

def display_result(operation, result):
    """Display the result of a calculation."""
    print(f"The result of {operation} is: {result}")

# Main program
x, y = get_numbers()
total = add(x, y)
display_result("addition", total)
```

Each function does *one thing* and does it well. If the `add` function has a bug, you know exactly where to look. If you want to add multiplication, you just write a new function — you don't have to touch the existing code.

Here are the principles of good modular design:

- **Single responsibility:** Each function should do one thing
- **Descriptive names:** A function's name should tell you what it does
- **Short and sweet:** If a function is longer than 20-30 lines, consider breaking it up
- **Documented:** Every function should have a docstring
- **Self-contained:** Functions should rely on their parameters, not global variables

#### Diagram: Modular Design Builder

<iframe src="../../sims/modular-design-builder/main.html" width="100%" height="602px" scrolling="no"></iframe>

<details markdown="1">
<summary>Modular Design Builder MicroSim</summary>
Type: microsim
**sim-id:** modular-design-builder<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Analyze (L4)
**Bloom Verb:** organize, deconstruct

**Learning Objective:** Students will be able to break a monolithic program into modular functions by identifying logical units of work and creating appropriate function boundaries.

**Purpose:** An interactive exercise where students are given a block of sequential code and must drag-and-drop code lines into function groups, naming each function and connecting them with a call graph.

**Canvas layout:**
- Left panel: "Original Code" — a 12-line sequential program displayed as movable code blocks:
```
1. name = input("Name: ")
2. age = int(input("Age: "))
3. greeting = "Hello, " + name
4. print(greeting)
5. birth_year = 2026 - age
6. print("Born in: " + str(birth_year))
7. if age >= 16:
8.     print("You can drive!")
9. else:
10.    print("Not old enough to drive.")
11. print("Thanks for using our app!")
12. print("Goodbye, " + name)
```
- Right panel: "Modular Version" — empty function containers (rounded rectangles) that students can drag code lines into
- Bottom: Three pre-labeled empty function boxes: `get_info()`, `check_driving()`, `show_farewell()`
- A "Check My Answer" button that evaluates the student's grouping

**Interactive elements:**
- Drag code lines from the left panel into the function boxes on the right
- Each function box shows a header where the student types a function name (pre-populated with suggestions)
- Lines snap into place inside a function box
- A "Show Solution" button reveals one good way to modularize the code
- "Check My Answer" provides feedback: "Lines 1-2 make sense in get_info()" etc.
- A "Run Both" button that shows both versions produce the same output

**Feedback:**
- Green check for correctly grouped lines
- Orange suggestion for lines that could reasonably go in multiple functions
- Red X for clearly misplaced lines (e.g., putting the farewell message in get_info)

**Visual style:** Code blocks are rounded rectangles with monospaced text; function containers have colored borders (blue, green, orange)
**Responsive:** Panels stack vertically on small screens

**Instructional Rationale:** Drag-and-drop grouping supports the Analyze level by requiring students to examine relationships between code lines and decide which belong together based on their purpose. This active reorganization task builds intuition for modular design principles that passive reading cannot achieve.
</details>

## Common Patterns and Best Practices

Let's look at some patterns you'll see again and again in well-written Python functions.

### Pattern 1: Input Validation

Functions can check that their arguments make sense before doing any work:

```python
def calculate_average(scores):
    """Calculate the average of a list of scores."""
    if len(scores) == 0:
        return None   # Can't average an empty list!
    return sum(scores) / len(scores)
```

### Pattern 2: Multiple Return Paths

Use `if/else` to return different values depending on conditions:

```python
def letter_grade(score):
    """Convert a numeric score to a letter grade."""
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    else:
        return "F"
```

### Pattern 3: Building Results

Use a local variable to accumulate a result, then return it:

```python
def count_vowels(text):
    """Count the number of vowels in a string."""
    count = 0
    for char in text.lower():
        if char in "aeiou":
            count += 1
    return count

print(count_vowels("Hello World"))  # prints 3
```

### Pattern 4: Functions Calling Functions

Functions can call other functions — this is where modular design really shines:

```python
def is_passing(score):
    """Check if a score earns a passing grade."""
    grade = letter_grade(score)   # Calls the function we wrote earlier
    return grade != "F"

print(is_passing(75))   # True
print(is_passing(55))   # False
```

#### Diagram: Function Pattern Gallery

<iframe src="../../sims/function-pattern-gallery/main.html" width="100%" height="552px" scrolling="no"></iframe>

<details markdown="1">
<summary>Function Pattern Gallery Interactive Reference</summary>
Type: infographic
**sim-id:** function-pattern-gallery<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Apply (L3)
**Bloom Verb:** implement, use

**Learning Objective:** Students will be able to recognize and apply common function patterns (input validation, multiple returns, result accumulation, function composition) when writing their own programs.

**Purpose:** A clickable gallery of four common function design patterns, each showing a code example with annotations explaining the pattern and when to use it.

**Canvas layout:**
- Grid of 4 cards (2x2), each representing a pattern:
  - Card 1: "Input Validation" — check before compute
  - Card 2: "Multiple Return Paths" — different results for different conditions
  - Card 3: "Result Accumulation" — build up a value in a loop
  - Card 4: "Function Composition" — functions calling functions

**Each card shows:**
- Pattern name (bold header)
- A 4-6 line code example with syntax highlighting
- A one-sentence description of when to use this pattern
- An icon representing the pattern (shield for validation, fork for multiple paths, stack for accumulation, chain for composition)

**Interactive elements:**
- Click a card to expand it to full width, showing:
  - The complete code example
  - Line-by-line annotations
  - A "When to Use" section with bullet points
  - A "Try It" section with a small editable code area
- Click again or click another card to collapse/switch

**Color scheme:**
- Validation: blue
- Multiple returns: green
- Accumulation: orange
- Composition: purple

**Visual style:** Card-based layout with rounded corners and subtle shadows
**Responsive:** Cards stack into a single column on narrow screens

**Instructional Rationale:** A gallery format supports the Apply level by presenting patterns as reusable templates. Students can browse, compare, and practice each pattern independently. The card-based format mirrors how developers use reference documentation in the real world.
</details>

## Putting It All Together: A Complete Example

Let's combine everything from this chapter into a complete program. We'll build a simple grade report generator:

```python
def get_student_name():
    """Get the student's name from user input."""
    return input("Enter student name: ")

def get_scores():
    """Get a list of test scores from user input."""
    scores = []
    while True:
        entry = input("Enter a score (or 'done'): ")
        if entry.lower() == "done":
            break
        scores.append(float(entry))
    return scores

def calculate_stats(scores):
    """Calculate and return average, highest, and lowest scores."""
    if len(scores) == 0:
        return 0, 0, 0
    average = sum(scores) / len(scores)
    highest = max(scores)
    lowest = min(scores)
    return average, highest, lowest

def letter_grade(score):
    """Convert a numeric score to a letter grade."""
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    else:
        return "F"

def print_report(name, scores):
    """Print a formatted grade report for a student."""
    avg, high, low = calculate_stats(scores)
    grade = letter_grade(avg)
    print(f"\n--- Grade Report for {name} ---")
    print(f"Scores: {scores}")
    print(f"Average: {avg:.1f}")
    print(f"Highest: {high}")
    print(f"Lowest: {low}")
    print(f"Letter Grade: {grade}")

# Main program
student = get_student_name()
student_scores = get_scores()
print_report(student, student_scores)
```

Notice how each function has a single job, a descriptive name, and a docstring. The main program at the bottom reads almost like plain English: get the name, get the scores, print the report. That's the beauty of modular design.

!!! mascot-celebration "Monty says: You've got this!"
    ![Monty](../../img/monty-celebrates.png){ align=left width="80" }
    Look at you, writing clean, modular, well-documented code with functions! You've leveled up from writing simple scripts to designing organized programs. That's a massive step forward. The skills you learned in this chapter — parameters, return values, scope, docstrings — will be the foundation for everything else in this course. Great work, coder!

## Key Takeaways

- A **function** is a reusable block of code that performs a specific task. Define it with `def`, call it by name.
- **Parameters** are placeholders in the function definition; **arguments** are the actual values passed in the call.
- The **return statement** sends a value back to the caller. Without one, the function returns **None**.
- **Positional arguments** are matched by order; **keyword arguments** are matched by parameter name.
- **Default parameters** provide fallback values when arguments are omitted.
- A function can return **multiple values** separated by commas (packed as a tuple).
- **Variable scope** determines where a variable can be accessed: **local variables** live inside functions; **global variables** live outside.
- The **global keyword** lets a function modify a global variable — but avoid it when possible.
- **Docstrings** document what a function does, its parameters, and its return value.
- Good **modular design** means each function does one thing, has a clear name, and is self-contained.

??? question "Check Your Understanding: What is the difference between a parameter and an argument?"
    A **parameter** is a variable in the function *definition* — it's the placeholder. An **argument** is the actual value you pass when you *call* the function. For example, in `def greet(name):`, `name` is the parameter. In `greet("Alice")`, `"Alice"` is the argument. Think of the parameter as a blank on a form, and the argument as what you write in that blank.

??? question "Check Your Understanding: What does a function return if it has no return statement?"
    It returns **None**. `None` is Python's special value meaning "nothing" or "no value." Its type is `NoneType`. For example:
    ```python
    def say_hi():
        print("Hi!")

    result = say_hi()
    print(result)  # Output: None
    ```

??? question "Check Your Understanding: Why is using the `global` keyword generally discouraged?"
    Using `global` lets any function change variables that live outside of it, which makes your program harder to understand and debug. If multiple functions can modify the same global variable, it becomes difficult to track where changes happen. **Best practice** is to pass values into functions as parameters and use `return` to send results back. This keeps each function self-contained and predictable.
