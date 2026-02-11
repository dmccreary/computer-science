---
title: Advanced Python Features
description: Generators, decorators, type hints, dataclasses, regular expressions, and standard library modules in Python.
generated_by: claude skill chapter-content-generator
date: 2026-02-11
version: 0.04
---

# Advanced Python Features

## Summary

This chapter introduces advanced Python language features for experienced students ready to deepen their skills. Students will learn about generators and the yield statement, decorators and closures, variable-length arguments (*args/**kwargs), type hints and annotations, dataclasses, enums, and regular expressions. The chapter also covers key standard library modules including collections (Counter, OrderedDict, DefaultDict, namedtuple), itertools, and functools, along with best practices for writing professional Python code.

## Concepts Covered

This chapter covers the following 24 concepts from the learning graph:

1. Generators
2. Yield Statement
3. Generator Expressions
4. Decorators
5. Closures
6. Args and Kwargs
7. Unpacking Operators
8. Walrus Operator
9. Type Hints
10. Type Annotations
11. Dataclasses
12. Enum Type
13. Regular Expressions
14. Collections Module
15. Itertools Module
16. Functools Module
17. List vs Generator Memory
18. Comprehension Patterns
19. Context Manager Protocol
20. Python Best Practices
21. Named Tuples
22. OrderedDict
23. DefaultDict
24. Counter Class

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: Python Fundamentals](../02-python-fundamentals/index.md)
- [Chapter 4: Control Flow](../04-control-flow/index.md)
- [Chapter 6: Functions and Modular Design](../06-functions-and-modular-design/index.md)
- [Chapter 7: Higher-Order Functions and Recursion](../07-higher-order-functions-and-recursion/index.md)
- [Chapter 8: Lists](../08-lists/index.md)
- [Chapter 10: Tuples and Sets](../10-tuples-and-sets/index.md)
- [Chapter 11: Dictionaries](../11-dictionaries/index.md)
- [Chapter 12: Classes and Objects](../12-classes-and-objects/index.md)
- [Chapter 13: Inheritance and Polymorphism](../13-inheritance-and-polymorphism/index.md)
- [Chapter 16: Software Engineering Practices](../16-software-engineering/index.md)

---

!!! mascot-welcome "Monty says: Let's code this!"
    ![Monty](../../img/monty-welcome.png){ align=left width="80" }
    Welcome to the final chapter, coders! You've built an incredible foundation over the last 19 chapters. Now it's time to level up and explore the advanced features that make Python one of the most beloved languages on the planet. Think of this chapter as unlocking the secret menu -- the powerful tools that experienced Python developers reach for every day. Let's do this!

## Generators: The Lazy Geniuses

Imagine you work in a warehouse full of one million packages. If someone asks for all of them, you could load every single package onto a truck at once. But that truck would be *enormous*, and it would take forever to load. Wouldn't it be smarter to put packages on a conveyor belt and deliver them one at a time? That's exactly the difference between a list and a generator.

A **generator** is a special kind of function that produces values one at a time instead of building an entire list in memory. It's like a conveyor belt that manufactures items on demand rather than a warehouse that stores everything upfront. This "lazy" approach is incredibly memory-efficient.

### The Yield Statement

Normal functions use `return` to send back a value and then they're done -- the function is finished. A generator function uses the **yield statement** instead. When a generator hits `yield`, it *pauses* execution, hands you the value, and waits. The next time you ask for a value, it picks up right where it left off.

```python
def countdown(n):
    """A generator that counts down from n to 1."""
    while n > 0:
        yield n
        n -= 1

# Using the generator
for number in countdown(5):
    print(number)
# Output: 5, 4, 3, 2, 1
```

Notice that `countdown` uses `yield` instead of `return`. Each time the `for` loop asks for the next value, the generator wakes up, runs until it hits `yield` again, and hands over the next number. It's like a storyteller who pauses after each chapter and waits for you to say "keep going."

### Generator Expressions

Just like list comprehensions give you a shortcut for building lists, **generator expressions** give you a shortcut for building generators. The syntax looks almost identical -- just swap the square brackets `[]` for parentheses `()`.

```python
# List comprehension -- builds the entire list in memory
squares_list = [x ** 2 for x in range(1_000_000)]

# Generator expression -- produces values one at a time
squares_gen = (x ** 2 for x in range(1_000_000))
```

The list version creates a million numbers right away and stores them all. The generator version creates them one at a time as you iterate over it. For large datasets, the difference in memory usage is massive.

### List vs Generator Memory

Let's make the **list vs generator memory** trade-off crystal clear.

| Feature | List | Generator |
|---------|------|-----------|
| Memory usage | Stores ALL items at once | Stores ONE item at a time |
| Speed to start | Slow (must build entire list) | Instant (produces on demand) |
| Reusable? | Yes, iterate as many times as you want | No, once exhausted it's done |
| Random access? | Yes (`my_list[42]`) | No (must iterate sequentially) |
| Best for | Small data, repeated access | Large data, single pass |

Think of it this way: a list is like a printed book you can flip to any page, while a generator is like a live podcast -- you listen in order, and once it's played, it's gone.

#### Diagram: Generator vs List Memory

<iframe src="../../sims/generator-vs-list-memory/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Generator vs List Memory MicroSim</summary>
Type: microsim
**sim-id:** generator-vs-list-memory<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Understand (L2)
**Bloom Verb:** compare, explain

**Learning Objective:** Students will be able to compare memory usage between lists and generators by observing a visual representation of how each stores data.

**Purpose:** An animated side-by-side comparison that shows a list filling up a memory block all at once versus a generator producing and releasing one item at a time.

**Layout:**
- Left panel: "List" label with a large memory block that fills with colored squares as items are created
- Right panel: "Generator" label with a single-slot conveyor belt that produces, delivers, and discards one item at a time
- Bottom: Memory usage bar chart showing the stark difference

**Interactive controls:**
- "Generate Items" button that produces 20 items and shows both approaches simultaneously
- Speed slider to control animation pace
- "Reset" button to clear and start over
- Counter showing current memory usage for each approach

**Visual style:** Clean blocks, green for active items, gray for empty slots, red warning glow when list memory gets large
**Responsive:** Canvas adjusts to window width

**Instructional Rationale:** Visual comparison of memory allocation makes the abstract concept of lazy evaluation concrete. Students see the list panel filling up while the generator panel stays lean, reinforcing why generators are preferred for large datasets.
</details>

## Comprehension Patterns

You've used list comprehensions before. Now let's look at all the **comprehension patterns** Python offers. They're one of Python's most elegant features -- compact, readable ways to transform data.

```python
# List comprehension
evens = [x for x in range(20) if x % 2 == 0]

# Dictionary comprehension
word_lengths = {word: len(word) for word in ["python", "is", "fun"]}

# Set comprehension
unique_remainders = {x % 3 for x in range(10)}

# Generator expression (not stored, iterated lazily)
total = sum(x ** 2 for x in range(100))
```

The pattern is always the same: `expression for variable in iterable if condition`. Once you master this pattern, you can express in one line what used to take four or five.

!!! mascot-thinking "Monty says: You've got this!"
    ![Monty](../../img/monty-thinking.png){ align=left width="80" }
    Here's a good rule of thumb: if a comprehension fits on one line and is easy to read, use it. If it needs two or three lines or makes your eyes cross, stick with a regular `for` loop. Readability always wins!

## Decorators: Gift-Wrapping Your Functions

Imagine you have a birthday present (your function). A **decorator** is like wrapping that present in fancy gift wrap. The present inside is the same, but now it has something extra on the outside -- maybe a bow, a tag, or sparkly paper. In Python, a decorator wraps a function with extra behavior *without changing the function itself*.

### Closures

Before we dive into decorators, we need to understand **closures**. A closure is a function that "remembers" values from the outer function that created it, even after that outer function has finished running. It's like a note tucked inside an envelope -- the envelope (outer function) may be sealed and mailed, but the note (inner function) still carries the message.

```python
def make_multiplier(factor):
    """Returns a function that multiplies by the given factor."""
    def multiplier(x):
        return x * factor  # 'factor' is remembered from the outer scope
    return multiplier

double = make_multiplier(2)
triple = make_multiplier(3)

print(double(5))   # 10
print(triple(5))   # 15
```

The inner `multiplier` function "closes over" the `factor` variable. Even though `make_multiplier` has finished, `double` remembers that `factor` is 2.

### Writing Decorators

Now for the main event. A decorator is a function that takes another function as input, wraps it with extra behavior, and returns the wrapped version.

```python
def log_calls(func):
    """A decorator that prints when a function is called."""
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}...")
        result = func(*args, **kwargs)
        print(f"{func.__name__} finished!")
        return result
    return wrapper

@log_calls
def greet(name):
    print(f"Hello, {name}!")

greet("Monty")
# Output:
# Calling greet...
# Hello, Monty!
# greet finished!
```

The `@log_calls` line is syntactic sugar. It's the same as writing `greet = log_calls(greet)`. The decorator wraps `greet` with logging behavior without touching the original function's code.

#### Diagram: How Decorators Work

<iframe src="../../sims/decorator-flow/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>How Decorators Work MicroSim</summary>
Type: microsim
**sim-id:** decorator-flow<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Understand (L2)
**Bloom Verb:** explain, trace

**Learning Objective:** Students will be able to trace how a decorator wraps a function by watching an animated flow diagram of the decoration process.

**Purpose:** Visual step-through showing how a decorator function receives an original function, creates a wrapper, and returns the wrapper as the new version.

**Layout:**
- Three boxes arranged left to right: "Original Function", "Decorator", "Wrapped Function"
- Arrows showing the flow: original enters decorator, wrapper comes out
- Below: a "Call the function" button that animates execution flowing through the wrapper, into the original, and back out

**Interactive controls:**
- "Step Through" button to advance the decoration process one stage at a time
- "Call Function" button to animate a function call flowing through the wrapper
- "Reset" button

**Visual elements:**
- Gift wrapping animation: the original function box gets visually "wrapped" with a colored border (the decorator layer)
- Code snippets appear beside each box showing the relevant Python code
- Execution trace highlights each line as it runs

**Instructional Rationale:** The gift-wrapping metaphor becomes concrete when students watch the original function get visually wrapped. Step-through execution demystifies what `@decorator` actually does under the hood.
</details>

## Args, Kwargs, and Unpacking

Sometimes you don't know in advance how many arguments a function will receive. That's where **args and kwargs** come in.

### *args: Variable Positional Arguments

The `*args` syntax lets a function accept any number of positional arguments. They arrive as a tuple.

```python
def add_all(*args):
    """Add up any number of values."""
    return sum(args)

print(add_all(1, 2, 3))        # 6
print(add_all(10, 20, 30, 40)) # 100
```

### **kwargs: Variable Keyword Arguments

The `**kwargs` syntax lets a function accept any number of keyword arguments. They arrive as a dictionary.

```python
def build_profile(**kwargs):
    """Build a user profile from keyword arguments."""
    for key, value in kwargs.items():
        print(f"{key}: {value}")

build_profile(name="Ada", age=17, language="Python")
# Output:
# name: Ada
# age: 17
# language: Python
```

### Unpacking Operators

The **unpacking operators** `*` and `**` aren't just for function definitions -- you can also use them to *unpack* collections when calling functions or building new collections.

```python
# Unpack a list into function arguments
numbers = [1, 2, 3]
print(*numbers)  # Same as print(1, 2, 3)

# Merge two dictionaries
defaults = {"color": "blue", "size": "medium"}
overrides = {"size": "large", "weight": "heavy"}
combined = {**defaults, **overrides}
# {'color': 'blue', 'size': 'large', 'weight': 'heavy'}

# Unpack into variables
first, *rest = [1, 2, 3, 4, 5]
# first = 1, rest = [2, 3, 4, 5]
```

That last trick -- `first, *rest = ...` -- is called *starred assignment*, and it's surprisingly handy.

## The Walrus Operator

The **walrus operator** (`:=`) is one of Python's newest features (added in Python 3.8). It lets you assign a value to a variable *as part of an expression*. It's called the walrus operator because `:=` looks like a walrus face turned sideways (the colon is the eyes, the equals sign is the tusks).

```python
# Without walrus operator
line = input("Enter something: ")
while line != "quit":
    print(f"You said: {line}")
    line = input("Enter something: ")

# With walrus operator -- cleaner!
while (line := input("Enter something: ")) != "quit":
    print(f"You said: {line}")
```

Here's another great use -- filtering with a computation you don't want to repeat:

```python
results = []
for text in ["hello", "hi", "hey there", "greetings fellow human"]:
    if (n := len(text)) > 3:
        results.append((text, n))
# [('hello', 5), ('hey there', 9), ('greetings fellow human', 22)]
```

Without the walrus, you'd have to call `len(text)` twice or use a separate variable line. The walrus keeps things tight.

## Type Hints and Annotations

As your programs grow, it gets harder to remember what types of values each function expects. **Type hints** are optional labels you add to your code to document what types your variables and function parameters should be.

```python
def calculate_gpa(grades: list[float], credits: list[int]) -> float:
    """Calculate weighted GPA."""
    total_points = sum(g * c for g, c in zip(grades, credits))
    total_credits = sum(credits)
    return total_points / total_credits
```

The `: list[float]` and `-> float` parts are type hints. They tell anyone reading the code: "this function takes a list of floats and a list of ints, and returns a float."

**Type annotations** are the broader term for adding type information anywhere in your code -- not just function signatures.

```python
# Variable annotations
name: str = "Monty"
age: int = 16
gpa: float = 3.85
is_enrolled: bool = True
courses: list[str] = ["CS", "Math", "English"]
```

Type hints don't change how your code *runs*. Python won't throw an error if you pass the wrong type. But they make your code self-documenting, and tools like `mypy` can check them for you before your code runs.

!!! mascot-tip "Monty says: Let's debug this together!"
    ![Monty](../../img/monty-tip.png){ align=left width="80" }
    Type hints are like road signs -- they don't force you to drive a certain way, but they sure help you avoid wrong turns! Start adding them to your function signatures, and you'll catch bugs before they happen.

## Dataclasses: Classes Without the Boilerplate

Remember writing classes in Chapter 12? You had to write `__init__`, maybe `__repr__`, maybe `__eq__` -- a lot of repetitive code just to hold some data. **Dataclasses** do all that for you automatically.

```python
from dataclasses import dataclass

@dataclass
class Student:
    name: str
    grade: int
    gpa: float
    honor_roll: bool = False  # default value

# That's it! Python auto-generates __init__, __repr__, and __eq__
ada = Student("Ada", 10, 3.9, True)
print(ada)  # Student(name='Ada', grade=10, gpa=3.9, honor_roll=True)

# Equality works automatically
ada2 = Student("Ada", 10, 3.9, True)
print(ada == ada2)  # True
```

Without `@dataclass`, you'd need to write about 15 lines of boilerplate code. With it, you need four. Dataclasses are perfect for any class whose main job is to hold data.

## The Enum Type

Sometimes you have a fixed set of choices -- like compass directions, days of the week, or game difficulty levels. The **enum type** lets you define these as a named set of constants.

```python
from enum import Enum

class Difficulty(Enum):
    EASY = 1
    MEDIUM = 2
    HARD = 3
    NIGHTMARE = 4

# Using the enum
current = Difficulty.HARD
print(current)        # Difficulty.HARD
print(current.name)   # HARD
print(current.value)  # 3

# Enums work great in if/match statements
if current == Difficulty.NIGHTMARE:
    print("Good luck!")
```

Why not just use strings like `"hard"` or numbers like `3`? Because typos happen. If you write `"hrad"` by mistake, Python won't complain -- it's a valid string. But `Difficulty.HRAD` will throw an error immediately. Enums catch mistakes early.

## Regular Expressions: Pattern Matching for Text

**Regular expressions** (often called "regex") are a powerful mini-language for searching, matching, and manipulating text patterns. They're like wildcards on steroids. Python's `re` module gives you full regex support.

```python
import re

# Find all email addresses in a text
text = "Contact ada@example.com or monty@python.org for info"
emails = re.findall(r'[\w.]+@[\w.]+\.\w+', text)
print(emails)  # ['ada@example.com', 'monty@python.org']

# Check if a string matches a pattern
phone = "555-123-4567"
if re.match(r'\d{3}-\d{3}-\d{4}', phone):
    print("Valid phone number!")
```

Here's a cheat sheet of the most common regex patterns:

| Pattern | Matches | Example |
|---------|---------|---------|
| `\d` | Any digit (0-9) | `\d{3}` matches "123" |
| `\w` | Any word character (letter, digit, underscore) | `\w+` matches "hello_42" |
| `\s` | Any whitespace (space, tab, newline) | `\s+` matches "   " |
| `.` | Any character except newline | `a.c` matches "abc", "a1c" |
| `*` | Zero or more of the previous | `ab*c` matches "ac", "abc", "abbc" |
| `+` | One or more of the previous | `ab+c` matches "abc" but not "ac" |
| `?` | Zero or one of the previous | `colou?r` matches "color" and "colour" |
| `^` | Start of string | `^Hello` matches "Hello world" |
| `$` | End of string | `world$` matches "Hello world" |
| `[abc]` | Any character in the set | `[aeiou]` matches any vowel |
| `(...)` | Capture group | `(\d{3})-(\d{4})` captures area code and number |
| `{n}` | Exactly n of the previous | `\d{4}` matches "2026" |
| `{n,m}` | Between n and m of the previous | `\w{3,5}` matches 3- to 5-character words |

Common `re` module functions:

| Function | Purpose | Example |
|----------|---------|---------|
| `re.match()` | Match at the *start* of a string | `re.match(r'\d+', '42abc')` |
| `re.search()` | Find the *first* match anywhere | `re.search(r'\d+', 'abc42def')` |
| `re.findall()` | Find *all* matches | `re.findall(r'\d+', 'a1b2c3')` returns `['1','2','3']` |
| `re.sub()` | Search and *replace* | `re.sub(r'\d', '#', 'abc123')` returns `'abc###'` |
| `re.split()` | Split on a pattern | `re.split(r'[,;]', 'a,b;c')` returns `['a','b','c']` |

#### Diagram: Regex Pattern Tester

<iframe src="../../sims/regex-pattern-tester/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Regex Pattern Tester MicroSim</summary>
Type: microsim
**sim-id:** regex-pattern-tester<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Apply (L3)
**Bloom Verb:** apply, test

**Learning Objective:** Students will be able to write and test simple regular expressions by entering patterns and seeing matches highlighted in real time.

**Purpose:** An interactive regex testing tool where students type a pattern and test text, with matches highlighted immediately.

**Layout:**
- Top: Input field for the regex pattern with common pattern buttons (\d, \w, \s, ., +, *, etc.)
- Middle: Large text area where students type or paste test text
- Bottom: Results panel showing all matches highlighted in the test text, plus a list of captured groups

**Interactive controls:**
- Pattern input field with real-time matching
- Preset pattern buttons that insert common patterns
- "Try Example" buttons with pre-loaded patterns and texts (email finder, phone number validator, etc.)
- Match counter showing number of matches found

**Visual style:** Matches highlighted in yellow within the text area; invalid patterns shown with red border and error message
**Responsive:** Full-width layout adjusting to window size

**Instructional Rationale:** Immediate visual feedback on pattern matching lets students experiment freely and build intuition for regex syntax. Pre-loaded examples scaffold learning by showing practical use cases before students construct their own patterns.
</details>

## The Collections Module

Python's built-in `dict`, `list`, and `tuple` types are great, but sometimes you need specialized data structures. The **collections module** offers souped-up versions for common patterns.

### Counter Class

The **Counter class** counts how many times each item appears in a collection. It's perfect for frequency analysis.

```python
from collections import Counter

# Count word frequencies
words = ["python", "is", "fun", "python", "is", "great", "python"]
word_counts = Counter(words)
print(word_counts)
# Counter({'python': 3, 'is': 2, 'fun': 1, 'great': 1})

# Most common items
print(word_counts.most_common(2))
# [('python', 3), ('is', 2)]

# Count characters in a string
char_counts = Counter("mississippi")
print(char_counts)
# Counter({'s': 4, 'i': 4, 'p': 2, 'm': 1})
```

### DefaultDict

A **DefaultDict** is like a regular dictionary, but it never throws a `KeyError`. When you access a key that doesn't exist, it automatically creates a default value.

```python
from collections import defaultdict

# Group students by grade level
students = [("Ada", 10), ("Bob", 11), ("Cat", 10), ("Dan", 11), ("Eve", 10)]

by_grade = defaultdict(list)
for name, grade in students:
    by_grade[grade].append(name)

print(by_grade)
# defaultdict(<class 'list'>, {10: ['Ada', 'Cat', 'Eve'], 11: ['Bob', 'Dan']})
```

Without `defaultdict`, you'd need to check if each key exists before appending. With it, the dictionary creates an empty list automatically for new keys.

### OrderedDict

An **OrderedDict** remembers the order items were inserted. In modern Python (3.7+), regular dictionaries also maintain insertion order, but `OrderedDict` still has a useful trick: it supports `move_to_end()` and order-sensitive equality comparison.

```python
from collections import OrderedDict

rankings = OrderedDict()
rankings["gold"] = "Ada"
rankings["silver"] = "Bob"
rankings["bronze"] = "Cat"

# Move an item to the end
rankings.move_to_end("gold")
print(list(rankings.keys()))  # ['silver', 'bronze', 'gold']

# Two OrderedDicts with different order are NOT equal
a = OrderedDict([("x", 1), ("y", 2)])
b = OrderedDict([("y", 2), ("x", 1)])
print(a == b)  # False (regular dicts would say True)
```

### Named Tuples

**Named tuples** are tuples where each position has a name. They're like lightweight classes for storing structured data.

```python
from collections import namedtuple

Point = namedtuple("Point", ["x", "y"])
p = Point(3, 7)

# Access by name (much clearer than p[0])
print(p.x)  # 3
print(p.y)  # 7

# They're still tuples -- immutable and iterable
print(p[0])      # 3
x, y = p         # Unpacking works
print(f"({x}, {y})")  # (3, 7)
```

Named tuples are perfect for returning multiple values from a function when you want the caller to access fields by name rather than by position.

#### Diagram: Collections Module Overview

<iframe src="../../sims/collections-overview/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Collections Module Overview MicroSim</summary>
Type: infographic
**sim-id:** collections-overview<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Remember (L1)
**Bloom Verb:** identify, describe

**Learning Objective:** Students will be able to identify the four main collections module classes (Counter, defaultdict, OrderedDict, namedtuple) and describe when to use each one.

**Purpose:** An interactive card-based overview where students can click on each collections class to see its definition, use case, and a short code example.

**Layout:**
- Four large cards arranged in a 2x2 grid: Counter, defaultdict, OrderedDict, namedtuple
- Each card shows the class name, a one-line description, and an icon
- Clicking a card expands it to show a code example and a "when to use this" tip

**Interactive controls:**
- Click any card to expand/collapse its detail view
- "Show All" button to expand all cards
- "Quiz Me" button that shows a use case description and asks the student to pick the right class

**Visual style:** Colorful cards with rounded corners; Counter is orange, defaultdict is blue, OrderedDict is green, namedtuple is purple
**Responsive:** Cards stack vertically on narrow screens

**Instructional Rationale:** Card-based exploration lets students self-pace through the four classes. The "Quiz Me" mode reinforces understanding by requiring students to match use cases to tools, building the judgment needed to select the right collection for a task.
</details>

## The Itertools Module

The **itertools module** is a toolbox of fast, memory-efficient functions for working with iterators. It's like a Swiss Army knife for looping patterns.

```python
import itertools

# chain: connect multiple iterables end-to-end
combined = list(itertools.chain([1, 2], [3, 4], [5, 6]))
# [1, 2, 3, 4, 5, 6]

# combinations: all possible pairs (order doesn't matter)
teams = list(itertools.combinations(["Ada", "Bob", "Cat"], 2))
# [('Ada', 'Bob'), ('Ada', 'Cat'), ('Bob', 'Cat')]

# permutations: all possible arrangements (order matters)
orders = list(itertools.permutations(["A", "B", "C"], 2))
# [('A', 'B'), ('A', 'C'), ('B', 'A'), ('B', 'C'), ('C', 'A'), ('C', 'B')]

# product: Cartesian product (all combos of two lists)
grid = list(itertools.product(["X", "O"], repeat=2))
# [('X', 'X'), ('X', 'O'), ('O', 'X'), ('O', 'O')]

# islice: slice an iterator without loading it all into memory
first_five = list(itertools.islice(range(1_000_000), 5))
# [0, 1, 2, 3, 4]

# groupby: group consecutive items by a key
data = [("A", 1), ("A", 2), ("B", 3), ("B", 4)]
for key, group in itertools.groupby(data, key=lambda x: x[0]):
    print(key, list(group))
# A [('A', 1), ('A', 2)]
# B [('B', 3), ('B', 4)]
```

The beauty of `itertools` is that these functions return iterators, not lists. They produce values lazily, just like generators -- perfect for handling large datasets.

## The Functools Module

The **functools module** provides tools for working with functions as first-class objects. Two of the most useful are `lru_cache` and `reduce`.

```python
from functools import lru_cache, reduce

# lru_cache: automatically cache function results
@lru_cache(maxsize=128)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(50))  # Instant! Without caching, this would take forever

# reduce: combine all items into a single value
numbers = [1, 2, 3, 4, 5]
product = reduce(lambda a, b: a * b, numbers)
print(product)  # 120 (1 * 2 * 3 * 4 * 5)
```

The `@lru_cache` decorator is pure magic for recursive functions. It remembers previous results so the same computation never runs twice. Remember how slow recursive Fibonacci was in Chapter 7? With `lru_cache`, it's instant.

!!! mascot-encourage "Monty says: You've got this!"
    ![Monty](../../img/monty-encourages.png){ align=left width="80" }
    Don't worry if some of these modules feel overwhelming right now. You don't need to memorize every function. The real skill is knowing these tools *exist* so you can look them up when you need them. Professional developers check the docs all the time!

## Context Manager Protocol

You've used `with open(...)` to read files. But have you wondered how it works under the hood? The **context manager protocol** is the mechanism that makes `with` statements work. A context manager guarantees that setup and cleanup code runs, even if an error occurs.

```python
# You've seen this pattern:
with open("data.txt", "r") as f:
    content = f.read()
# File is automatically closed, even if an error happened

# You can write your own context managers:
class Timer:
    def __enter__(self):
        import time
        self.start = time.time()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        import time
        elapsed = time.time() - self.start
        print(f"Elapsed: {elapsed:.4f} seconds")

with Timer():
    total = sum(range(1_000_000))
# Output: Elapsed: 0.0312 seconds
```

The `__enter__` method runs at the start of the `with` block, and `__exit__` runs at the end -- no matter what. There's also a simpler way to create context managers using `contextlib`:

```python
from contextlib import contextmanager

@contextmanager
def timer():
    import time
    start = time.time()
    yield  # This is where the 'with' block runs
    elapsed = time.time() - start
    print(f"Elapsed: {elapsed:.4f} seconds")

with timer():
    total = sum(range(1_000_000))
```

Notice the `yield` in the middle? The code before `yield` is the setup, and the code after `yield` is the cleanup. The `@contextmanager` decorator turns a generator function into a context manager.

#### Diagram: Context Manager Flow

<iframe src="../../sims/context-manager-flow/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Context Manager Flow MicroSim</summary>
Type: microsim
**sim-id:** context-manager-flow<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Understand (L2)
**Bloom Verb:** explain, trace

**Learning Objective:** Students will be able to trace the execution flow of a context manager, identifying when __enter__ and __exit__ are called.

**Purpose:** An animated flowchart showing how a `with` statement triggers __enter__, runs the body, and then __exit__ -- including the error path.

**Layout:**
- Vertical flowchart with three main boxes: "Enter (__enter__)", "Body (your code)", "Exit (__exit__)"
- A branching path from "Body" showing both the success path and the error path
- Both paths converge at "__exit__" to show that cleanup always runs

**Interactive controls:**
- "Normal Flow" button: animate the success path
- "Error Flow" button: animate what happens when the body raises an exception
- "Step Through" button for manual advancement
- Reset button

**Visual elements:**
- Green glow for successful execution path
- Red glow for error path
- Both paths arriving at __exit__ to emphasize guaranteed cleanup
- Code snippets alongside each step

**Instructional Rationale:** Tracing the execution flow through both success and error paths demonstrates why context managers are valuable -- they guarantee cleanup. The error path visualization is particularly important for understanding the protocol's purpose.
</details>

## Python Best Practices

Now that you've seen all these advanced features, let's talk about **Python best practices** -- the habits that separate good code from great code.

**1. Follow PEP 8.** PEP 8 is Python's official style guide. Use 4-space indentation, `snake_case` for variables and functions, `PascalCase` for classes, and `UPPER_SNAKE_CASE` for constants.

**2. Use type hints.** They make your code self-documenting and help catch bugs early.

**3. Prefer generators for large data.** If you're processing millions of items, don't load them all into memory. Use generators or generator expressions.

**4. Use dataclasses for data containers.** If a class is just holding data, use `@dataclass` instead of writing boilerplate.

**5. Use context managers for resources.** Files, database connections, network sockets -- anything that needs cleanup should use `with`.

**6. Write docstrings.** Every function, class, and module should have a docstring explaining what it does.

```python
def calculate_average(scores: list[float]) -> float:
    """Calculate the arithmetic mean of a list of scores.

    Args:
        scores: A non-empty list of numeric scores.

    Returns:
        The average score as a float.

    Raises:
        ValueError: If the scores list is empty.
    """
    if not scores:
        raise ValueError("Cannot average an empty list")
    return sum(scores) / len(scores)
```

**7. Keep functions small.** If a function doesn't fit on your screen, it's probably doing too much. Break it up.

**8. Use meaningful names.** `student_count` beats `sc`. `calculate_gpa` beats `calc`. Future-you will thank present-you.

#### Diagram: Python Best Practices Checklist

<iframe src="../../sims/python-best-practices/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Python Best Practices Checklist MicroSim</summary>
Type: infographic
**sim-id:** python-best-practices<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Evaluate (L5)
**Bloom Verb:** assess, critique

**Learning Objective:** Students will be able to evaluate Python code snippets against best practices and identify areas for improvement.

**Purpose:** An interactive checklist where students review code snippets and check off which best practices each snippet follows or violates.

**Layout:**
- Left panel: A code snippet display area showing Python code
- Right panel: A checklist of 8 best practices with checkboxes
- Bottom: "Check Answers" button and score display

**Interactive controls:**
- "Next Snippet" button to cycle through 5 different code examples
- Checkboxes for each best practice (follows/violates)
- "Check Answers" button to reveal which practices the code follows or breaks
- Score tracker across all snippets

**Code snippets include:**
1. A well-written function with type hints, docstring, and good names
2. A function with no type hints, single-letter variables, and no docstring
3. A class that should be a dataclass
4. Code that loads a huge file into a list instead of using a generator
5. Code that manually manages file closing instead of using `with`

**Instructional Rationale:** Evaluating code against a checklist builds the critical assessment skills that distinguish intermediate from advanced programmers. Seeing both good and bad examples helps students internalize the practices rather than just memorizing rules.
</details>

## Putting It All Together

Let's see how these advanced features combine in a realistic example. Here's a program that analyzes a text file and reports word frequency statistics, using generators, type hints, dataclasses, Counter, and context managers all in one place:

```python
from dataclasses import dataclass
from collections import Counter
from typing import Generator
import re

@dataclass
class TextStats:
    """Statistics for a text analysis."""
    total_words: int
    unique_words: int
    most_common: list[tuple[str, int]]
    average_word_length: float

def clean_words(text: str) -> Generator[str, None, None]:
    """Yield cleaned, lowercase words from text."""
    for word in re.findall(r'[a-zA-Z]+', text):
        yield word.lower()

def analyze_text(filename: str, top_n: int = 5) -> TextStats:
    """Analyze word frequency in a text file."""
    with open(filename, "r") as f:
        words = list(clean_words(f.read()))

    counts = Counter(words)
    avg_length = sum(len(w) for w in words) / len(words) if words else 0

    return TextStats(
        total_words=len(words),
        unique_words=len(counts),
        most_common=counts.most_common(top_n),
        average_word_length=round(avg_length, 2)
    )

stats = analyze_text("my_essay.txt")
print(stats)
```

Look at how cleanly these features work together. The `@dataclass` eliminates boilerplate. The generator `clean_words` processes text lazily. Type hints document every function. The `Counter` handles frequency counting in one line. And the `with` statement ensures the file gets closed.

!!! mascot-celebration "Monty says: You've got this!"
    ![Monty](../../img/monty-celebrates.png){ align=left width="80" }
    You did it, coder! You just conquered the most advanced chapter in the entire course. These features -- generators, decorators, type hints, dataclasses, regex, and the standard library modules -- are the tools that professional Python developers use every day. You're not just learning Python anymore. You're writing *Pythonic* code. That's something to celebrate!

## Key Takeaways

- **Generators** produce values lazily, one at a time, using the **yield statement**. **Generator expressions** use parentheses instead of brackets for a compact syntax.
- **Decorators** wrap functions with extra behavior using the `@decorator` syntax. They rely on **closures** -- inner functions that remember outer variables.
- **Args and kwargs** (`*args`, `**kwargs`) let functions accept variable numbers of arguments. The **unpacking operators** `*` and `**` can also unpack collections.
- The **walrus operator** (`:=`) assigns and evaluates in a single expression.
- **Type hints** and **type annotations** document expected types without changing runtime behavior.
- **Dataclasses** auto-generate `__init__`, `__repr__`, and `__eq__` for data-holding classes.
- The **enum type** defines named constants for fixed sets of choices.
- **Regular expressions** provide powerful pattern matching for text processing.
- The **collections module** offers **Counter**, **DefaultDict**, **OrderedDict**, and **named tuples** for specialized data handling.
- The **itertools module** provides memory-efficient looping tools; the **functools module** offers function utilities like caching.
- **List vs generator memory**: lists store everything; generators produce on demand.
- **Comprehension patterns** work for lists, dicts, sets, and generators.
- The **context manager protocol** (`__enter__`/`__exit__`) guarantees cleanup in `with` statements.
- **Python best practices** include PEP 8 style, type hints, docstrings, and choosing the right tool for the job.

??? question "Check Your Understanding: What's the difference between `yield` and `return`?"
    The `return` statement sends back a value and *terminates* the function permanently. The `yield` statement sends back a value and *pauses* the function, allowing it to resume from where it left off the next time a value is requested. Functions that use `yield` are called generators, and they produce values lazily rather than all at once.

??? question "Check Your Understanding: When would you use a `defaultdict` instead of a regular `dict`?"
    Use a `defaultdict` when you want to automatically create a default value for missing keys instead of getting a `KeyError`. For example, if you're grouping items into lists by category, `defaultdict(list)` automatically creates an empty list the first time you access a new key, so you can just `append` without checking if the key exists first.

??? question "Check Your Understanding: What does the `@lru_cache` decorator do, and why is it useful for recursive functions?"
    The `@lru_cache` decorator (from `functools`) automatically caches the results of function calls. When the function is called with arguments it has seen before, it returns the cached result instead of recomputing it. This is especially powerful for recursive functions like Fibonacci, where the same sub-problems are solved many times. Without caching, `fibonacci(50)` would take an impractical amount of time. With `@lru_cache`, each unique call is computed only once, making it nearly instant.
