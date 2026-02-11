---
title: Dictionaries
description: Python dictionaries with key-value pairs, essential methods, comprehensions, and practical patterns for counting, grouping, and caching.
generated_by: claude skill chapter-content-generator
date: 2026-02-11
version: 0.04
---

# Dictionaries

## Summary

This chapter introduces Python dictionaries, the powerful key-value data structure. Students will learn to create dictionaries, access and modify values, use essential methods (get, keys, values, items), iterate over dictionaries, and write dictionary comprehensions. The chapter also covers practical patterns including counting, grouping, caching, and understanding hashable keys. Dictionaries are one of Python's most important and frequently used data structures.

## Concepts Covered

This chapter covers the following 21 concepts from the learning graph:

1. Dictionaries
2. Dictionary Creation
3. Key-Value Pairs
4. Dictionary Access
5. Dictionary Methods
6. Get Method
7. Keys Method
8. Values Method
9. Items Method
10. Dictionary Iteration
11. Dictionary Comprehension
12. Nested Dictionaries
13. Default Values
14. Update Method
15. Pop Method for Dicts
16. Dictionary Merging
17. Counting with Dicts
18. Grouping with Dicts
19. Dictionary as Cache
20. Hashable Keys
21. Dict vs List Lookup

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: Python Fundamentals](../02-python-fundamentals/index.md)
- [Chapter 4: Control Flow](../04-control-flow/index.md)
- [Chapter 6: Functions and Modular Design](../06-functions-and-modular-design/index.md)
- [Chapter 8: Lists](../08-lists/index.md)
- [Chapter 10: Tuples and Sets](../10-tuples-and-sets/index.md)

---

!!! mascot-welcome "Monty says: Let's code this!"
    ![Monty](../../img/monty-welcome.png){ align=left width="80" }
    Welcome back, coders! You've already mastered lists, tuples, and sets. Now it's time to unlock one of Python's most powerful data structures: the dictionary. Think of it like a real dictionary — you look up a word and get its definition. Python dictionaries work the same way, except you can look up *anything* and get *anything* back. Let's dive in!

## What Are Dictionaries?

Have you ever used a real dictionary? You look up a word (like "python") and find its definition ("a large heavy-bodied nonvenomous snake"). You don't start at page 1 and read every entry until you find the word. You jump straight to the right spot. That's incredibly fast.

**Dictionaries** in Python work the same way. Instead of storing items in a numbered sequence like a list, a dictionary stores **key-value pairs** — a *key* that you look up, paired with a *value* that you get back. The key is like the word you're looking up, and the value is like the definition you find.

Here's why dictionaries matter: they let you store relationships between pieces of data. A student's name maps to their grade. A product code maps to its price. A username maps to their profile. Anywhere you have a "this goes with that" relationship, dictionaries are your best friend.

## Creating Dictionaries

**Dictionary creation** in Python uses curly braces `{}` with keys and values separated by colons. Let's see a few ways to build one.

```python
# Method 1: Curly braces with key: value pairs
student = {"name": "Alice", "grade": 10, "gpa": 3.8}

# Method 2: The dict() constructor
student = dict(name="Alice", grade=10, gpa=3.8)

# Method 3: From a list of tuples
pairs = [("name", "Alice"), ("grade", 10), ("gpa", 3.8)]
student = dict(pairs)

# Method 4: An empty dictionary
empty = {}
also_empty = dict()
```

All three methods above create the same dictionary. Method 1 is the most common — you'll see it everywhere.

Notice that keys and values can be different types. In our `student` dictionary, the keys are all strings, but the values include a string (`"Alice"`), an integer (`10`), and a float (`3.8`). Python is flexible like that.

#### Diagram: Dictionary Structure Visualizer

<iframe src="../../sims/dictionary-structure/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Dictionary Structure Visualizer MicroSim</summary>
Type: diagram
**sim-id:** dictionary-structure<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Understand (L2)
**Bloom Verb:** describe, illustrate

**Learning Objective:** Students will be able to visualize how a Python dictionary stores key-value pairs and understand the mapping relationship between keys and values.

**Purpose:** An interactive visualization showing the internal structure of a dictionary as a set of key-value pairs, with arrows mapping each key to its corresponding value.

**Layout:**

- Left column: Keys displayed as labeled boxes (e.g., "name", "grade", "gpa")
- Right column: Values displayed as labeled boxes (e.g., "Alice", 10, 3.8)
- Arrows connecting each key to its value
- Bottom: A text input for adding new key-value pairs and a button to add them

**Interactive elements:**

- Hover over a key to highlight the arrow and its corresponding value
- Click "Add Pair" to add a new key-value pair to the visualization
- Click "Remove" on any pair to delete it
- A "Show Code" toggle that displays the Python code that would create the shown dictionary

**Color scheme:** Keys in blue boxes, values in green boxes, arrows in gray
**Responsive:** Layout adjusts to window width; boxes resize proportionally

**Instructional Rationale:** Visualizing the mapping relationship between keys and values makes the abstract concept of key-value storage concrete. Interactive add/remove operations let students see how dictionaries grow and change.
</details>

## Key-Value Pairs

Let's zoom in on **key-value pairs**, because they're the heart of every dictionary. A key-value pair is a single entry in the dictionary: the key is the label, and the value is the data associated with that label.

```python
phone_book = {
    "Alice": "555-1234",
    "Bob": "555-5678",
    "Charlie": "555-9012"
}
```

In this phone book dictionary:

- `"Alice"` is a **key**, and `"555-1234"` is its **value**
- `"Bob"` is a **key**, and `"555-5678"` is its **value**
- `"Charlie"` is a **key**, and `"555-9012"` is its **value**

A few important rules about keys:

- **Keys must be unique.** You can't have two entries for "Alice." If you assign a new value to an existing key, it overwrites the old one.
- **Keys must be immutable.** You can use strings, numbers, or tuples as keys — but not lists or other dictionaries. (We'll explain why in the Hashable Keys section.)
- **Values can be anything.** Strings, numbers, lists, other dictionaries — even functions!

## Accessing Dictionary Values

**Dictionary access** is how you retrieve a value using its key. The most straightforward way is with square brackets.

```python
student = {"name": "Alice", "grade": 10, "gpa": 3.8}

print(student["name"])    # Output: Alice
print(student["grade"])   # Output: 10
print(student["gpa"])     # Output: 3.8
```

You can also modify values or add new key-value pairs using the same bracket notation:

```python
# Change an existing value
student["gpa"] = 3.9

# Add a new key-value pair
student["school"] = "Westside High"

print(student)
# {'name': 'Alice', 'grade': 10, 'gpa': 3.9, 'school': 'Westside High'}
```

!!! mascot-warning "Monty says: Watch out!"
    ![Monty](../../img/monty-warning.png){ align=left width="80" }
    Be careful! If you try to access a key that doesn't exist using square brackets, Python will raise a `KeyError`. For example, `student["age"]` would crash your program if `"age"` isn't a key in the dictionary. Use the `get` method (covered next) for safer lookups!

```python
# This will crash with a KeyError!
print(student["age"])  # KeyError: 'age'
```

## Dictionary Methods

Python **dictionary methods** give you a toolkit for working with dictionaries without writing everything from scratch. Let's explore the most important ones.

### The Get Method

The **get method** is a safer way to access dictionary values. Instead of crashing with a `KeyError` when a key doesn't exist, `get()` returns `None` (or a **default value** you specify).

```python
student = {"name": "Alice", "grade": 10}

# Safe lookup — returns None if key not found
age = student.get("age")
print(age)  # Output: None

# Safe lookup with a default value
age = student.get("age", 16)
print(age)  # Output: 16

# Key exists — works normally
name = student.get("name")
print(name)  # Output: Alice
```

**Default values** are incredibly useful. They let you provide a fallback when a key might not exist, without any extra if/else logic. You'll see this pattern constantly in real-world Python code.

### The Keys Method

The **keys method** returns all the keys in a dictionary. It gives you a special view object that you can loop through or convert to a list.

```python
student = {"name": "Alice", "grade": 10, "gpa": 3.8}

print(student.keys())
# Output: dict_keys(['name', 'grade', 'gpa'])

# Convert to a list
key_list = list(student.keys())
print(key_list)  # Output: ['name', 'grade', 'gpa']
```

### The Values Method

The **values method** does the same thing, but for values instead of keys.

```python
print(student.values())
# Output: dict_values(['Alice', 10, 3.8])

# Convert to a list
value_list = list(student.values())
print(value_list)  # Output: ['Alice', 10, 3.8]
```

### The Items Method

The **items method** returns *both* keys and values as a collection of tuples. This is especially powerful when looping.

```python
print(student.items())
# Output: dict_items([('name', 'Alice'), ('grade', 10), ('gpa', 3.8)])

# Loop through key-value pairs
for key, value in student.items():
    print(f"{key}: {value}")
# Output:
# name: Alice
# grade: 10
# gpa: 3.8
```

### The Update Method

The **update method** merges another dictionary into the current one. If both dictionaries share a key, the value from the new dictionary wins.

```python
student = {"name": "Alice", "grade": 10}
new_info = {"gpa": 3.8, "grade": 11}

student.update(new_info)
print(student)
# Output: {'name': 'Alice', 'grade': 11, 'gpa': 3.8}
```

Notice that `"grade"` was updated from `10` to `11` because `new_info` had a different value for that key.

### The Pop Method for Dicts

The **pop method for dicts** removes a key-value pair and returns the value. It's like reaching into the dictionary and pulling out an entry.

```python
student = {"name": "Alice", "grade": 10, "gpa": 3.8}

removed_value = student.pop("gpa")
print(removed_value)  # Output: 3.8
print(student)        # Output: {'name': 'Alice', 'grade': 10}

# With a default to avoid KeyError
missing = student.pop("age", "Not found")
print(missing)  # Output: Not found
```

### Dictionary Methods Reference Table

Here's a comprehensive reference for the most common dictionary methods:

| Method | Description | Example | Returns |
|--------|-------------|---------|---------|
| `d.get(key, default)` | Safe value lookup | `d.get("age", 0)` | Value or default |
| `d.keys()` | All keys | `d.keys()` | `dict_keys` view |
| `d.values()` | All values | `d.values()` | `dict_values` view |
| `d.items()` | All key-value pairs | `d.items()` | `dict_items` view |
| `d.update(other)` | Merge another dict | `d.update({"a": 1})` | `None` (modifies `d`) |
| `d.pop(key, default)` | Remove and return | `d.pop("name")` | Removed value |
| `d.clear()` | Remove all items | `d.clear()` | `None` |
| `d.copy()` | Shallow copy | `d.copy()` | New dict |
| `d.setdefault(key, val)` | Get or set default | `d.setdefault("x", 0)` | Existing or new value |
| `key in d` | Check membership | `"name" in d` | `True` / `False` |
| `len(d)` | Number of pairs | `len(d)` | Integer |

!!! mascot-thinking "Monty says: Let's debug this together!"
    ![Monty](../../img/monty-thinking.png){ align=left width="80" }
    Here's a trick that'll save you tons of time: use `in` to check if a key exists before accessing it. `if "name" in student:` is clean, readable, and avoids `KeyError` crashes. But honestly? The `get()` method is even cleaner for most situations.

## Dictionary Iteration

**Dictionary iteration** means looping through a dictionary's contents. There are several ways to do it, depending on whether you need the keys, the values, or both.

```python
scores = {"Alice": 95, "Bob": 87, "Charlie": 92}

# Loop through keys (the default)
for name in scores:
    print(name)
# Alice, Bob, Charlie

# Loop through values
for score in scores.values():
    print(score)
# 95, 87, 92

# Loop through key-value pairs (most common)
for name, score in scores.items():
    print(f"{name} scored {score}")
# Alice scored 95
# Bob scored 87
# Charlie scored 92
```

The `items()` approach is the most versatile because you get both the key and the value in each iteration. You'll use it all the time.

#### Diagram: Dictionary Iteration Flowchart

<iframe src="../../sims/dictionary-iteration/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Dictionary Iteration Flowchart MicroSim</summary>
Type: diagram
**sim-id:** dictionary-iteration<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Understand (L2)
**Bloom Verb:** trace, explain

**Learning Objective:** Students will be able to trace through different dictionary iteration patterns (keys, values, items) and predict the output at each step.

**Purpose:** An animated flowchart that visually steps through a for loop iterating over a dictionary, showing which key-value pair is being visited at each step and what the loop variable holds.

**Layout:**

- Top: A dictionary visualized as a table with keys and values
- Middle: A for-loop code block with the current iteration highlighted
- Bottom: The output console showing what has been printed so far

**Interactive elements:**

- Dropdown to select iteration type: "keys", "values", "items"
- "Step" button to advance one iteration at a time
- "Auto Play" button with speed control
- "Reset" button to restart
- The current key-value pair highlights in the dictionary table as the loop visits it

**Color scheme:** Current item highlighted in yellow, visited items in light gray, unvisited in white
**Responsive:** Canvas adjusts to window width

**Instructional Rationale:** Stepping through iteration one element at a time with visual highlighting helps students build a mental model of how Python traverses dictionary contents. Comparing the three iteration modes side by side reveals when to use each one.
</details>

## Dictionary Comprehension

Just like list comprehensions, **dictionary comprehensions** let you build a dictionary in a single, elegant line. The syntax looks similar, but you provide both a key expression and a value expression.

```python
# Basic syntax: {key_expr: value_expr for item in iterable}

# Create a dict of numbers and their squares
squares = {n: n ** 2 for n in range(1, 6)}
print(squares)
# Output: {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# With a condition: only even numbers
even_squares = {n: n ** 2 for n in range(1, 11) if n % 2 == 0}
print(even_squares)
# Output: {2: 4, 4: 16, 6: 36, 8: 64, 10: 100}

# Transform an existing dictionary: convert scores to letter grades
scores = {"Alice": 95, "Bob": 87, "Charlie": 72}
grades = {name: ("A" if s >= 90 else "B" if s >= 80 else "C")
          for name, s in scores.items()}
print(grades)
# Output: {'Alice': 'A', 'Bob': 'B', 'Charlie': 'C'}
```

Dictionary comprehensions are perfect for transforming data. Need to flip a dictionary's keys and values? One line:

```python
original = {"a": 1, "b": 2, "c": 3}
flipped = {v: k for k, v in original.items()}
print(flipped)
# Output: {1: 'a', 2: 'b', 3: 'c'}
```

## Nested Dictionaries

**Nested dictionaries** are dictionaries that contain other dictionaries as values. They're great for representing structured, multi-level data — like a class roster where each student has multiple attributes.

```python
classroom = {
    "Alice": {"grade": 10, "gpa": 3.8, "clubs": ["Chess", "Coding"]},
    "Bob": {"grade": 10, "gpa": 3.5, "clubs": ["Soccer"]},
    "Charlie": {"grade": 11, "gpa": 3.9, "clubs": ["Coding", "Math"]}
}

# Access nested values by chaining brackets
print(classroom["Alice"]["gpa"])         # Output: 3.8
print(classroom["Charlie"]["clubs"][0])  # Output: Coding

# Add a new student
classroom["Diana"] = {"grade": 10, "gpa": 3.7, "clubs": ["Art"]}
```

Think of nested dictionaries like folders inside folders on your computer. The outer dictionary is the main folder, and each value is a subfolder containing more detailed information.

#### Diagram: Nested Dictionary Explorer

<iframe src="../../sims/nested-dictionary/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Nested Dictionary Explorer MicroSim</summary>
Type: microsim
**sim-id:** nested-dictionary<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Apply (L3)
**Bloom Verb:** navigate, construct

**Learning Objective:** Students will be able to navigate through nested dictionaries by clicking through levels of keys and constructing the bracket-chain notation needed to access deeply nested values.

**Purpose:** An interactive tree visualization of a nested dictionary where students can expand and collapse levels, and the tool generates the Python access expression for any selected value.

**Layout:**

- Left panel: A tree view of the nested dictionary, with expandable/collapsible nodes
- Right panel: The Python code showing the full access expression for the currently selected node
- Bottom: An input field where students can type an access expression and see the resulting value

**Interactive elements:**

- Click a key node to expand/collapse its children
- Click a leaf value to highlight it and display the full access path (e.g., `classroom["Alice"]["gpa"]`)
- Type an access expression in the input field and press Enter to see if it returns the correct value
- "Add Entry" button to add a new key-value pair at any level

**Visual style:** Tree layout with indented levels, color-coded by depth
**Responsive:** Panels stack vertically on narrow screens

**Instructional Rationale:** Interactive tree navigation lets students build intuition for how nested access works. Seeing the access expression update as they click through levels connects the visual structure to the Python syntax.
</details>

## Dictionary Merging

**Dictionary merging** combines two or more dictionaries into one. Python 3.9 introduced the `|` operator for this, making it clean and readable.

```python
defaults = {"color": "blue", "size": "medium", "font": "Arial"}
user_prefs = {"color": "red", "size": "large"}

# Method 1: The | operator (Python 3.9+)
merged = defaults | user_prefs
print(merged)
# Output: {'color': 'red', 'size': 'large', 'font': 'Arial'}

# Method 2: The ** unpacking operator (Python 3.5+)
merged = {**defaults, **user_prefs}
print(merged)
# Output: {'color': 'red', 'size': 'large', 'font': 'Arial'}

# Method 3: The update method (modifies in place)
combined = defaults.copy()
combined.update(user_prefs)
print(combined)
# Output: {'color': 'red', 'size': 'large', 'font': 'Arial'}
```

In all three cases, when both dictionaries have the same key, the *right-hand* dictionary's value wins. In the example above, `user_prefs` overrides `defaults` for `"color"` and `"size"`, while `"font"` carries over from `defaults` since the user didn't set one.

!!! mascot-tip "Monty says: Here's a handy trick!"
    ![Monty](../../img/monty-tip.png){ align=left width="80" }
    The `|` merge operator is my favorite way to combine dictionaries. It's clean, it's readable, and it doesn't modify either original dictionary. If you're using Python 3.9 or later (which you probably are), give it a try!

## Practical Patterns with Dictionaries

Now that you know the fundamentals, let's look at some real-world patterns where dictionaries really shine. These patterns come up constantly in programming — from homework assignments to professional software.

### Counting with Dicts

**Counting with dicts** is one of the most common dictionary patterns. The idea is simple: use keys to represent the items you're counting, and values to track how many times each item appears.

```python
# Count letter frequencies in a word
word = "mississippi"
letter_counts = {}

for letter in word:
    letter_counts[letter] = letter_counts.get(letter, 0) + 1

print(letter_counts)
# Output: {'m': 1, 'i': 4, 's': 4, 'p': 2}
```

Let's trace through how this works:

1. We start with an empty dictionary
2. For each letter, `get(letter, 0)` returns the current count (or `0` if it's the first time)
3. We add `1` and store the new count back

This pattern is so useful that Python has a built-in shortcut for it in the `collections` module called `Counter`, but understanding the manual approach teaches you a lot about how dictionaries work.

```python
# Bonus: Count word frequencies in a sentence
sentence = "the cat sat on the mat the cat"
word_counts = {}

for w in sentence.split():
    word_counts[w] = word_counts.get(w, 0) + 1

print(word_counts)
# Output: {'the': 3, 'cat': 2, 'sat': 1, 'on': 1, 'mat': 1}
```

### Grouping with Dicts

**Grouping with dicts** organizes items into categories. Each key is a category, and each value is a list of items that belong to that category.

```python
# Group students by grade level
students = [
    ("Alice", 10), ("Bob", 11), ("Charlie", 10),
    ("Diana", 11), ("Eve", 10), ("Frank", 12)
]

by_grade = {}
for name, grade in students:
    if grade not in by_grade:
        by_grade[grade] = []
    by_grade[grade].append(name)

print(by_grade)
# Output: {10: ['Alice', 'Charlie', 'Eve'], 11: ['Bob', 'Diana'], 12: ['Frank']}
```

Here's a cleaner version using `setdefault()`:

```python
by_grade = {}
for name, grade in students:
    by_grade.setdefault(grade, []).append(name)

print(by_grade)
# Same output: {10: ['Alice', 'Charlie', 'Eve'], 11: ['Bob', 'Diana'], 12: ['Frank']}
```

The `setdefault()` method checks if the key exists. If it does, it returns the existing value. If not, it sets the default value (an empty list here) and returns it. Either way, you can immediately call `.append()` on the result.

#### Diagram: Counting and Grouping Patterns

<iframe src="../../sims/dict-patterns/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Counting and Grouping Patterns MicroSim</summary>
Type: microsim
**sim-id:** dict-patterns<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Apply (L3)
**Bloom Verb:** implement, demonstrate

**Learning Objective:** Students will be able to implement counting and grouping patterns by watching how a dictionary builds up step by step as data is processed.

**Purpose:** A step-by-step animated visualization that shows how a dictionary grows as items are counted or grouped, with the dictionary state updating after each iteration.

**Layout:**

- Top: A selector to toggle between "Counting Mode" and "Grouping Mode"
- Left panel: The input data (a word for counting, or a list of student-grade tuples for grouping)
- Center: The current item being processed, highlighted
- Right panel: The dictionary, updated in real-time after each step

**Interactive elements:**

- "Step" button to process one item at a time
- "Auto Play" button with speed slider
- "Reset" button
- Toggle between counting and grouping modes
- Custom input field to type your own word or data set

**Visual style:** Dictionary displayed as a growing table with animated row additions and value updates
**Responsive:** Panels stack vertically on narrow screens

**Instructional Rationale:** Watching the dictionary build up one entry at a time demystifies the counting and grouping patterns. Students can predict what the next step will produce before clicking "Step," turning observation into active practice.
</details>

### Dictionary as Cache

A **dictionary as cache** (also called **memoization**) stores the results of expensive calculations so you don't have to repeat them. It's like keeping a cheat sheet of answers you've already figured out.

```python
# Without caching: slow recursive Fibonacci
def fib_slow(n):
    if n <= 1:
        return n
    return fib_slow(n - 1) + fib_slow(n - 2)

# With caching: fast Fibonacci
cache = {}

def fib_fast(n):
    if n in cache:
        return cache[n]
    if n <= 1:
        result = n
    else:
        result = fib_fast(n - 1) + fib_fast(n - 2)
    cache[n] = result
    return result

print(fib_fast(50))  # Instant! Output: 12586269025
```

Without caching, computing `fib_slow(50)` would take an absurdly long time because it recalculates the same values millions of times. With a dictionary cache, each value is calculated only once and then remembered. The 50th Fibonacci number comes back instantly.

This pattern works because dictionary lookups are incredibly fast — almost instant, no matter how many items are in the dictionary. Speaking of which...

## Hashable Keys

Why can strings and numbers be dictionary keys, but lists can't? The answer involves something called a **hash**.

**Hashable keys** are keys that Python can convert into a fixed-size integer called a hash code. Python uses this hash code to figure out *where* to store the key-value pair internally, making lookups blazingly fast. It's like assigning each book in a library a specific shelf number — instead of searching every shelf, you go directly to the right one.

For this to work, keys must be **immutable** (unchangeable). If a key could change after being stored, its hash code would change, and Python wouldn't be able to find it anymore. It'd be like moving a library book to a different shelf without updating the catalog.

Here's what's hashable and what's not:

| Type | Hashable? | Can Be a Key? | Why? |
|------|-----------|---------------|------|
| `str` | Yes | Yes | Strings are immutable |
| `int` | Yes | Yes | Integers are immutable |
| `float` | Yes | Yes | Floats are immutable |
| `tuple` | Yes* | Yes* | *Only if it contains only hashable items |
| `bool` | Yes | Yes | Booleans are immutable |
| `list` | No | No | Lists are mutable (can change) |
| `dict` | No | No | Dicts are mutable |
| `set` | No | No | Sets are mutable |

```python
# These work
d = {}
d["hello"] = 1        # String key
d[42] = 2             # Integer key
d[(1, 2)] = 3         # Tuple key

# These DON'T work
d[[1, 2]] = 4         # TypeError: unhashable type: 'list'
d[{"a": 1}] = 5       # TypeError: unhashable type: 'dict'
```

!!! mascot-thinking "Monty says: You've got this!"
    ![Monty](../../img/monty-thinking.png){ align=left width="80" }
    Here's an easy rule of thumb: if you can't change it, you can hash it. Strings, numbers, and tuples are locked in place once created, so they make great dictionary keys. Lists, dictionaries, and sets can be modified, so Python won't let you use them as keys.

## Dict vs List Lookup

Now for one of the most powerful reasons to use dictionaries: **dict vs list lookup** performance. Dictionaries are *dramatically* faster than lists when you need to check if something exists.

With a list, Python has to check each item one by one from the beginning. If the list has a million items, that could mean up to a million comparisons. This is called **linear search** — the time grows proportionally with the size of the list.

With a dictionary, Python uses the hash code to jump directly to the right spot. It doesn't matter if the dictionary has 10 items or 10 million — the lookup takes roughly the same amount of time. This is called **constant time** or **O(1)** lookup.

Here's a comparison:

| Operation | List | Dictionary |
|-----------|------|------------|
| Check if item exists | **O(n)** — slow for large data | **O(1)** — fast regardless of size |
| Look up by index/key | **O(1)** by index | **O(1)** by key |
| Insert at end | **O(1)** | **O(1)** |
| Search for a value | Scan every element | Instant by key |
| Best for | Ordered sequences | Key-value lookups |

```python
# List lookup: gets slower as the list grows
big_list = list(range(1_000_000))
999_999 in big_list   # Checks up to 1 million items!

# Dict lookup: always fast
big_dict = {n: True for n in range(1_000_000)}
999_999 in big_dict   # Jumps straight to it!
```

#### Diagram: Dict vs List Lookup Performance

<iframe src="../../sims/dict-vs-list/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Dict vs List Lookup Performance MicroSim</summary>
Type: microsim
**sim-id:** dict-vs-list<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Analyze (L4)
**Bloom Verb:** compare, differentiate

**Learning Objective:** Students will be able to compare the lookup performance of lists vs dictionaries and explain why dictionaries are faster for membership testing.

**Purpose:** An animated race visualization that searches for a value in both a list and a dictionary simultaneously, showing the dramatic speed difference as data sizes grow.

**Layout:**

- Top: Slider to set the collection size (100, 1000, 10000, 100000)
- Center: Two lanes labeled "List Search" and "Dict Search"
- The list lane shows an animated cursor scanning through elements one by one
- The dict lane shows the hash calculation and direct jump
- Bottom: Timer showing elapsed comparison steps for each

**Interactive elements:**

- Size slider to change the number of items (demonstrates how list search time grows while dict stays constant)
- "Race!" button to start the comparison
- "Search for:" input to choose which value to search for
- Results display showing the number of steps each method took

**Visual style:** Racing lanes with animated search cursors, bar chart of steps taken
**Responsive:** Canvas width adjusts to window

**Instructional Rationale:** A race visualization makes the abstract concept of time complexity visceral and memorable. Adjusting the data size lets students see firsthand that dictionary lookup time stays flat while list lookup time grows, building intuition for Big-O analysis.
</details>

In real programs, this performance difference matters a lot. If you're checking whether a username exists in a system with millions of users, a dictionary (or set) gives you an instant answer. A list would make your users wait.

```python
# Real-world example: checking if a username is taken
# BAD approach with a list
taken_usernames_list = ["alice", "bob", "charlie", ...]  # millions of names

if "newuser" in taken_usernames_list:  # Potentially slow!
    print("Username taken")

# GOOD approach with a dictionary (or set)
taken_usernames_dict = {"alice": True, "bob": True, "charlie": True, ...}

if "newuser" in taken_usernames_dict:  # Always fast!
    print("Username taken")
```

#### Diagram: Dictionary Use Cases Infographic

<iframe src="../../sims/dict-use-cases/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Dictionary Use Cases Infographic</summary>
Type: infographic
**sim-id:** dict-use-cases<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Understand (L2)
**Bloom Verb:** classify, summarize

**Learning Objective:** Students will be able to identify common real-world scenarios where dictionaries are the appropriate data structure and explain why.

**Purpose:** An interactive infographic showing 6 real-world dictionary use cases (phone book, word counter, grade book, shopping cart, game inventory, translation dictionary) with hover-to-reveal Python code examples.

**Layout:**

- 6 cards arranged in a 3x2 grid, each showing an icon and title for a use case
- Hovering over a card expands it to show a brief description and a Python code snippet

**Interactive elements:**

- Hover/click to expand each card
- A "Which data structure?" quiz mode where students see a scenario and choose between list, dictionary, tuple, or set

**Visual style:** Card-based layout with icons, clean typography
**Responsive:** Cards reflow to 2x3 or 1x6 on narrower screens

**Instructional Rationale:** Connecting dictionary concepts to familiar real-world scenarios (phone books, grade books, shopping carts) helps students transfer abstract knowledge to practical application. Quiz mode provides immediate self-assessment.
</details>

## Putting It All Together

Let's combine several dictionary techniques into a practical example. Imagine you're building a simple grade tracker for a class:

```python
# Grade tracker using multiple dictionary patterns
def grade_tracker():
    grades = {}

    # Add some test scores
    student_scores = [
        ("Alice", 95), ("Bob", 87), ("Alice", 91),
        ("Charlie", 78), ("Bob", 92), ("Alice", 88),
        ("Charlie", 85), ("Bob", 79)
    ]

    # Group scores by student (grouping pattern)
    for name, score in student_scores:
        grades.setdefault(name, []).append(score)

    print("All scores:", grades)
    # {'Alice': [95, 91, 88], 'Bob': [87, 92, 79], 'Charlie': [78, 85]}

    # Calculate averages (dictionary comprehension)
    averages = {name: sum(scores) / len(scores)
                for name, scores in grades.items()}

    print("Averages:", averages)
    # {'Alice': 91.33, 'Bob': 86.0, 'Charlie': 81.5}

    # Assign letter grades
    letter_grades = {}
    for name, avg in averages.items():
        if avg >= 90:
            letter_grades[name] = "A"
        elif avg >= 80:
            letter_grades[name] = "B"
        elif avg >= 70:
            letter_grades[name] = "C"
        else:
            letter_grades[name] = "F"

    print("Letter grades:", letter_grades)
    # {'Alice': 'A', 'Bob': 'B', 'Charlie': 'B'}

grade_tracker()
```

This example uses grouping with `setdefault`, dictionary comprehensions, and iteration — all in one natural, readable program. That's the power of dictionaries!

!!! mascot-celebration "Monty says: You've got this!"
    ![Monty](../../img/monty-celebrates.png){ align=left width="80" }
    Amazing work, coder! You've just learned one of the most important and versatile tools in Python. Dictionaries are everywhere — in web development, data science, game programming, and beyond. Every time you need to connect one piece of data to another, think dictionary!

## Key Takeaways

- **Dictionaries** store data as **key-value pairs** — like a real dictionary maps words to definitions.
- Create dictionaries with curly braces: `{"key": "value"}` or the `dict()` constructor.
- Access values with square brackets `d["key"]` or the safer `get()` method with a default value.
- Essential methods: `keys()`, `values()`, `items()`, `update()`, `pop()`.
- **Dictionary iteration** with `items()` gives you both keys and values in each loop.
- **Dictionary comprehensions** let you build dictionaries in a single line: `{k: v for k, v in data}`.
- **Nested dictionaries** store structured, multi-level data by putting dictionaries inside dictionaries.
- **Merge dictionaries** with the `|` operator (Python 3.9+), `**` unpacking, or `update()`.
- **Counting** and **grouping** are the two most common dictionary patterns in real-world code.
- **Caching** (memoization) uses a dictionary to store previously computed results for speed.
- **Keys must be hashable** (immutable): strings, numbers, and tuples work; lists and dicts don't.
- **Dict lookup is O(1)** (constant time) vs list lookup which is **O(n)** (linear time) — dictionaries are dramatically faster for searching.

??? question "Check Your Understanding: What happens if you try to use a list as a dictionary key?"
    Python raises a `TypeError: unhashable type: 'list'`. Lists are **mutable** (they can be changed), which means Python can't compute a reliable hash code for them. Only **immutable** types like strings, integers, floats, and tuples (containing only hashable elements) can be used as dictionary keys. If you need a list-like key, convert it to a tuple first: `d[tuple(my_list)] = value`.

??? question "Check Your Understanding: Write a dictionary comprehension that maps each number from 1 to 5 to its cube."
    ```python
    cubes = {n: n ** 3 for n in range(1, 6)}
    print(cubes)
    # Output: {1: 1, 2: 8, 3: 27, 4: 64, 5: 125}
    ```
    The expression `n ** 3` calculates the cube (n times n times n). The `range(1, 6)` generates numbers 1 through 5. The result is a dictionary where each key is a number and each value is its cube.

??? question "Check Your Understanding: Why are dictionary lookups faster than list lookups?"
    Dictionaries use **hash codes** to jump directly to where a key is stored, giving them **O(1) constant time** lookups — the speed doesn't depend on how many items are in the dictionary. Lists, on the other hand, must scan through elements one by one (**O(n) linear time**), so the more items in the list, the longer it takes. For a dictionary with a million entries, lookup is still essentially instant. For a list with a million entries, you might need to check all million items in the worst case.
