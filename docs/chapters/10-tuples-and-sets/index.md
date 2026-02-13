---
title: Tuples and Sets
description: Tuple creation, immutability, packing/unpacking, set operations, membership testing, and frozensets in Python.
generated_by: claude skill chapter-content-generator
date: 2026-02-11
version: 0.04
---

# Tuples and Sets

## Summary

This chapter covers two important Python collection types: tuples and sets. Students will learn about tuple creation, immutability, packing and unpacking, and when to use tuples vs lists. The chapter then introduces sets and their mathematical operations (union, intersection, difference, symmetric difference), membership testing, and frozensets. These data structures complement lists and dictionaries for different use cases.

## Concepts Covered

This chapter covers the following 19 concepts from the learning graph:

1. Tuples
2. Tuple Creation
3. Tuple Immutability
4. Tuple Packing
5. Tuple Unpacking
6. Tuple Methods
7. Tuples as Keys
8. Tuples vs Lists
9. Sets
10. Set Creation
11. Set Operations
12. Set Union
13. Set Intersection
14. Set Difference
15. Set Symmetric Difference
16. Set Methods
17. Membership Testing
18. Frozenset
19. Removing Duplicates

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: Python Fundamentals](../02-python-fundamentals/index.md)
- [Chapter 3: Boolean Logic and Comparisons](../03-boolean-logic/index.md)
- [Chapter 5: Working with Strings](../05-working-with-strings/index.md)
- [Chapter 8: Lists](../08-lists/index.md)

---

!!! mascot-welcome "Monty says: Let's code this!"
    ![Monty](../../img/monty-welcome.png){ align=left width="80" }
    Welcome back, coders! You already know how to work with lists -- those flexible, ordered containers that hold just about anything. Now it's time to meet two more collection types: **tuples** and **sets**. Think of tuples as lists that can't be changed (like a GPS coordinate that's locked in place) and sets as bags of unique marbles where no two are the same. By the end of this chapter, you'll know exactly when to reach for each one. Let's do this!

## Part 1: Tuples

### What Is a Tuple?

A **tuple** is an ordered, immutable sequence of values. If you've already worked with lists, tuples will feel familiar -- they look similar, act similar, and can hold the same kinds of data. The big difference? Once you create a tuple, you *cannot change it*. No adding, no removing, no swapping elements. What you see is what you get.

Why would you want a collection that can't be changed? Great question! Sometimes you *want* data to be locked down. Think about GPS coordinates: the latitude and longitude of the Eiffel Tower are (48.8584, 2.2945). Those numbers shouldn't accidentally change in your program. A tuple is the perfect fit.

Here are some real-world examples of tuple-like data:

- **(x, y)** coordinates on a graph
- **(red, green, blue)** color values
- **(month, day, year)** date components
- **(latitude, longitude)** map positions
- **(name, student_id)** a student record

### Tuple Creation

**Tuple creation** is straightforward. You use parentheses `()` instead of the square brackets `[]` that lists use.

```python
# Creating tuples with parentheses
coordinates = (48.8584, 2.2945)
rgb_color = (255, 128, 0)
student = ("Alice", 10, 3.8)

print(coordinates)  # (48.8584, 2.2945)
print(rgb_color)    # (255, 128, 0)
print(student)      # ('Alice', 10, 3.8)
```

You can also create a tuple without parentheses -- Python figures it out from the commas:

```python
# Parentheses are optional!
fruits = "apple", "banana", "cherry"
print(fruits)       # ('apple', 'banana', 'cherry')
print(type(fruits)) # <class 'tuple'>
```

Watch out for the single-element tuple -- this one trips up a *lot* of beginners:

```python
# This is NOT a tuple -- it's just a string in parentheses
not_a_tuple = ("hello")
print(type(not_a_tuple))  # <class 'str'>

# THIS is a single-element tuple -- notice the trailing comma!
actually_a_tuple = ("hello",)
print(type(actually_a_tuple))  # <class 'tuple'>
```

That trailing comma after `"hello"` is what tells Python "this is a tuple with one item, not just a value in parentheses." It looks a little weird, but you get used to it.

You can also create tuples from other sequences using the `tuple()` function:

```python
# Convert a list to a tuple
my_list = [1, 2, 3]
my_tuple = tuple(my_list)
print(my_tuple)  # (1, 2, 3)

# Convert a string to a tuple of characters
letters = tuple("Python")
print(letters)  # ('P', 'y', 't', 'h', 'o', 'n')

# Create an empty tuple
empty = tuple()
print(empty)  # ()
```

!!! mascot-warning "Monty says: Let's debug this together!"
    ![Monty](../../img/monty-warning.png){ align=left width="80" }
    The number one tuple mistake? Forgetting the comma in a single-element tuple. `(42)` is just the number 42, but `(42,)` is a tuple containing 42. That tiny comma makes a huge difference!

### Tuple Immutability

**Tuple immutability** means that once a tuple is created, you cannot modify its contents. You can't add items, remove items, or change existing items. If you try, Python will raise a `TypeError`.

```python
colors = ("red", "green", "blue")

# Trying to change an element? Nope!
colors[0] = "yellow"  # TypeError: 'tuple' object does not support item assignment

# Trying to append? Also nope!
colors.append("purple")  # AttributeError: 'tuple' object has no attribute 'append'
```

But wait -- you *can* still do these things with tuples:

- **Access** elements by index: `colors[0]` returns `"red"`
- **Slice** tuples: `colors[1:]` returns `("green", "blue")`
- **Concatenate** tuples to make a *new* tuple: `colors + ("yellow",)` returns `("red", "green", "blue", "yellow")`
- **Repeat** tuples: `(1, 2) * 3` returns `(1, 2, 1, 2, 1, 2)`
- **Check membership**: `"red" in colors` returns `True`
- **Loop** through elements: `for color in colors:`

```python
colors = ("red", "green", "blue")

# Accessing by index
print(colors[0])    # red
print(colors[-1])   # blue

# Slicing
print(colors[1:])   # ('green', 'blue')

# Concatenation (creates a NEW tuple)
more_colors = colors + ("yellow", "purple")
print(more_colors)  # ('red', 'green', 'blue', 'yellow', 'purple')

# The original tuple is unchanged!
print(colors)       # ('red', 'green', 'blue')
```

The key idea is: you're never *modifying* the original tuple. You're always creating a new one.

#### Diagram: Tuple vs List Mutability

<iframe src="../../sims/tuple-vs-list-mutability/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Tuple vs List Mutability Visualizer</summary>
Type: microsim
**sim-id:** tuple-vs-list-mutability<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Understand (L2)
**Bloom Verb:** compare, explain

**Learning Objective:** Students will be able to explain the difference between mutable lists and immutable tuples by observing how modification operations succeed on lists but fail on tuples.

**Purpose:** A side-by-side interactive visualization showing a list and a tuple containing the same data, where students can attempt operations (append, remove, change item) and see them succeed on the list but produce error messages on the tuple.

**Layout:**
- Left panel: "List" with bracket notation `[1, 2, 3]` displayed as boxes
- Right panel: "Tuple" with parenthesis notation `(1, 2, 3)` displayed as boxes with a lock icon
- Bottom: Three operation buttons: "Change Item", "Add Item", "Remove Item"

**Interactive elements:**
- Click "Change Item" to attempt to change index 0 on both sides. List side updates successfully (green flash). Tuple side shows a red flash and a `TypeError` message.
- Click "Add Item" to attempt appending a value. List grows; tuple shows `AttributeError`.
- Click "Remove Item" to attempt removing the last item. List shrinks; tuple shows an error.
- A "Reset" button restores both to their original state.

**Visual elements:**
- List boxes are drawn with a green border (modifiable)
- Tuple boxes are drawn with a gold border and a small lock icon (immutable)
- Success operations produce a green glow animation
- Failed operations produce a red shake animation and display the error type

**Instructional Rationale:** Direct comparison with immediate feedback helps students internalize the mutability difference. Attempting the same operation on both structures makes the contrast vivid and memorable.
</details>

### Tuple Packing and Unpacking

**Tuple packing** is what happens when you assign multiple values to a single variable. Python automatically "packs" them into a tuple:

```python
# Tuple packing -- Python bundles these into a tuple
person = "Alice", 16, "10th grade"
print(person)       # ('Alice', 16, '10th grade')
print(type(person)) # <class 'tuple'>
```

**Tuple unpacking** is the reverse -- you pull individual values *out of* a tuple and assign them to separate variables:

```python
# Tuple unpacking -- pull values out into individual variables
person = ("Alice", 16, "10th grade")
name, age, grade = person

print(name)   # Alice
print(age)    # 16
print(grade)  # 10th grade
```

This is incredibly useful! You'll see tuple unpacking all over Python code. Here are some common patterns:

```python
# Swapping two variables (no temp variable needed!)
a = 10
b = 20
a, b = b, a
print(a)  # 20
print(b)  # 10

# Unpacking in a for loop with enumerate
fruits = ["apple", "banana", "cherry"]
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")
# 0: apple
# 1: banana
# 2: cherry

# Returning multiple values from a function
def get_min_max(numbers):
    return min(numbers), max(numbers)

low, high = get_min_max([4, 7, 2, 9, 1])
print(f"Min: {low}, Max: {high}")  # Min: 1, Max: 9
```

The variable swap trick (`a, b = b, a`) is one of Python's most elegant features. In many other languages, you'd need a temporary variable to pull this off. Python makes it a one-liner thanks to tuple packing and unpacking.

!!! mascot-thinking "Monty says: You've got this!"
    ![Monty](../../img/monty-thinking.png){ align=left width="80" }
    Here's something neat: when a function returns multiple values separated by commas, it's actually returning a tuple! So `return min(numbers), max(numbers)` is really `return (min(numbers), max(numbers))`. Tuple packing happens automatically.

### Tuple Methods

Since tuples are immutable, they don't have methods that modify the tuple (like `append()` or `remove()`). But they do have two useful **tuple methods**:

| Method | What It Does | Example |
|--------|-------------|---------|
| `count(value)` | Returns how many times `value` appears | `(1, 2, 2, 3).count(2)` returns `2` |
| `index(value)` | Returns the index of the first occurrence of `value` | `(1, 2, 3).index(3)` returns `2` |

```python
grades = (95, 87, 95, 92, 88, 95)

# How many times does 95 appear?
print(grades.count(95))  # 3

# Where is the first 87?
print(grades.index(87))  # 1

# What about a value that's not there?
# grades.index(100)  # ValueError: tuple.index(x): x not in tuple
```

Just two methods -- that's it! Compare that to lists, which have eleven methods. Fewer methods means there's less to memorize, and it reflects the simplicity of tuples: they hold data, they don't change, and they keep things simple.

### Tuples as Dictionary Keys

Here's a superpower that lists don't have: you can use **tuples as keys** in a dictionary. Why? Because dictionary keys must be *immutable* (unchangeable), and tuples fit that requirement perfectly. Lists are mutable, so they can't be used as keys.

```python
# Using tuples as dictionary keys -- great for coordinate grids!
chess_board = {}
chess_board[(0, 0)] = "Rook"
chess_board[(0, 1)] = "Knight"
chess_board[(0, 2)] = "Bishop"
chess_board[(0, 3)] = "Queen"
chess_board[(0, 4)] = "King"

print(chess_board[(0, 3)])  # Queen

# Storing city distances with (city1, city2) as keys
distances = {
    ("New York", "Boston"): 215,
    ("New York", "Chicago"): 790,
    ("Boston", "Chicago"): 983,
}

print(distances[("New York", "Boston")])  # 215
```

This is a common pattern in games, maps, and scientific computing. Any time you need to look something up by a pair (or group) of values, tuple keys are your friend.

```python
# This would FAIL with a list:
# bad_dict = {[0, 0]: "Rook"}  # TypeError: unhashable type: 'list'
```

### Tuples vs Lists

So when should you use a tuple, and when should you use a list? Here's a clear comparison of **tuples vs lists**:

| Feature | Tuple | List |
|---------|-------|------|
| Syntax | `(1, 2, 3)` | `[1, 2, 3]` |
| Mutable? | No (immutable) | Yes (mutable) |
| Can be a dict key? | Yes | No |
| Methods available | 2 (`count`, `index`) | 11+ (`append`, `remove`, etc.) |
| Speed | Slightly faster | Slightly slower |
| Memory | Uses less memory | Uses more memory |
| Use case | Fixed data, coordinates, records | Data that changes, collections you grow |

**Rules of thumb:**

- If the data should **never change**, use a tuple (coordinates, RGB values, database records)
- If you need to **add, remove, or modify** items, use a list (shopping lists, game inventories, user inputs)
- If you need to use the collection as a **dictionary key**, use a tuple
- When in doubt, ask yourself: "Will I need to change this later?" If yes, use a list. If no, use a tuple.

#### Diagram: Tuples vs Lists Comparison

<iframe src="../../sims/tuples-vs-lists/main.html" width="100%" height="520px" scrolling="no"></iframe>

<details markdown="1">
<summary>Tuples vs Lists Interactive Comparison</summary>
Type: infographic
**sim-id:** tuples-vs-lists<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Analyze (L4)
**Bloom Verb:** compare, differentiate

**Learning Objective:** Students will be able to choose between tuples and lists for a given scenario by comparing their properties and trade-offs.

**Purpose:** An interactive decision-helper that presents real-world scenarios and asks students to choose tuple or list, providing immediate feedback and explanations.

**Layout:**
- Top section: Side-by-side visual comparison of a tuple (locked box with parentheses) and a list (open box with brackets) showing key properties
- Middle section: A scenario card with a description like "You need to store the (x, y) coordinates of a point on a map"
- Bottom section: Two large buttons "Use a Tuple" and "Use a List" for the student's choice

**Interactive elements:**
- Click "Use a Tuple" or "Use a List" to answer
- Correct answer: green highlight with a brief explanation of why
- Wrong answer: red highlight with a gentle explanation of why the other choice is better
- "Next Scenario" button loads a new scenario
- A score counter tracks correct answers out of total attempts
- Scenarios cycle through 8-10 different real-world use cases

**Scenario examples:**
1. "Store GPS coordinates (lat, lon)" -- Tuple (fixed data)
2. "Track items in a shopping cart" -- List (items get added/removed)
3. "Store an RGB color value (255, 128, 0)" -- Tuple (fixed data)
4. "Manage a playlist of songs" -- List (songs get added/removed)
5. "Use as a dictionary key" -- Tuple (lists can't be keys)
6. "Store daily temperatures to analyze later" -- List (growing collection)
7. "Represent a database row (name, age, email)" -- Tuple (fixed record)
8. "Build a stack of undo operations" -- List (needs push/pop)

**Instructional Rationale:** Scenario-based practice at the Analyze level forces students to evaluate properties and make justified decisions, moving beyond simple recall of tuple vs list differences.
</details>

## Part 2: Sets

### What Is a Set?

A **set** is an *unordered* collection of *unique* elements. If tuples are like GPS coordinates (fixed and reliable), sets are like a bag of unique marbles -- you can toss marbles in, pull them out, and check what's inside, but there are never any duplicates. If you try to add a marble that's already in the bag, nothing happens.

If you've studied sets in math class, Python sets work the same way. They support union, intersection, difference, and more. It's like your math textbook came to life!

Key properties of sets:

- **Unordered:** Items have no position or index. You can't access `my_set[0]`.
- **Unique elements:** Every item appears at most once. Duplicates are automatically removed.
- **Mutable:** You can add and remove items (unlike tuples).
- **No duplicate values:** Adding a value that already exists has no effect.

### Set Creation

**Set creation** uses curly braces `{}` or the `set()` function:

```python
# Creating a set with curly braces
fruits = {"apple", "banana", "cherry"}
print(fruits)  # {'cherry', 'banana', 'apple'}  (order may vary!)

# Duplicates are automatically removed
numbers = {1, 2, 2, 3, 3, 3, 4}
print(numbers)  # {1, 2, 3, 4}

# Creating a set from a list
colors = set(["red", "green", "blue", "red"])
print(colors)  # {'red', 'green', 'blue'}

# Creating an empty set (careful -- {} creates an empty DICT, not a set!)
empty_set = set()
print(type(empty_set))  # <class 'set'>

# This creates a dictionary, NOT a set!
not_a_set = {}
print(type(not_a_set))  # <class 'dict'>
```

Notice that when you print a set, the elements might appear in a different order than you entered them. That's because sets are unordered -- Python stores them however it finds most efficient internally. Don't rely on set ordering!

!!! mascot-warning "Monty says: Let's debug this together!"
    ![Monty](../../img/monty-warning.png){ align=left width="80" }
    Heads up: `{}` creates an empty *dictionary*, not an empty set! To make an empty set, you must use `set()`. This trips up even experienced programmers. Remember: curly braces with key-value pairs = dictionary. Curly braces with just values = set. Empty curly braces = dictionary (because dicts came first in Python's history).

### Membership Testing

One of the most powerful features of sets is fast **membership testing** -- checking whether an element is in the set. Sets use a clever internal structure (called a hash table) that makes `in` checks almost instant, no matter how big the set is.

```python
valid_colors = {"red", "green", "blue", "yellow", "purple"}

# Checking membership
print("red" in valid_colors)     # True
print("orange" in valid_colors)  # False
print("pink" not in valid_colors) # True
```

Lists can do membership testing too, but they're slower. A list has to check every single element one by one (that's \(O(n)\) time). A set jumps straight to the answer (that's \(O(1)\) time on average). For small collections it doesn't matter, but for thousands or millions of items, sets are dramatically faster.

```python
# Practical example: checking if a username is taken
taken_usernames = {"gamer42", "pythonista", "codequeen", "hackmaster"}

new_user = "pythonista"
if new_user in taken_usernames:
    print(f"Sorry, '{new_user}' is already taken!")
else:
    print(f"'{new_user}' is available!")
# Output: Sorry, 'pythonista' is already taken!
```

### Set Operations

**Set operations** are where sets really shine. Python supports all the classic mathematical set operations. If you've seen Venn diagrams in math class, you already understand the concepts -- Python just gives you the code to compute them.

The four main set operations are:

| Operation | Symbol | Method | What It Returns |
|-----------|--------|--------|----------------|
| Union | `\|` | `.union()` | Everything in either set (or both) |
| Intersection | `&` | `.intersection()` | Only items in both sets |
| Difference | `-` | `.difference()` | Items in the first set but not the second |
| Symmetric Difference | `^` | `.symmetric_difference()` | Items in one set or the other, but not both |

Let's walk through each one with a concrete example. Imagine two friend groups:

```python
alice_friends = {"Bob", "Charlie", "Diana", "Eve"}
bob_friends = {"Alice", "Charlie", "Eve", "Frank"}
```

#### Set Union

**Set union** combines everything from both sets. If a name appears in either set (or both), it's in the union. Think of it as "everyone invited to the combined party."

```python
# Union: everyone in either group
all_friends = alice_friends | bob_friends
print(all_friends)
# {'Bob', 'Charlie', 'Diana', 'Eve', 'Alice', 'Frank'}

# Same thing using the method:
all_friends = alice_friends.union(bob_friends)
```

#### Set Intersection

**Set intersection** returns only the items that appear in *both* sets. These are the mutual friends -- people in Alice's group *and* Bob's group.

```python
# Intersection: friends they have in common
mutual_friends = alice_friends & bob_friends
print(mutual_friends)
# {'Charlie', 'Eve'}

# Same thing using the method:
mutual_friends = alice_friends.intersection(bob_friends)
```

#### Set Difference

**Set difference** returns items in the first set that are *not* in the second. It answers "who is in Alice's group but NOT in Bob's group?"

```python
# Difference: Alice's friends who are NOT Bob's friends
alice_only = alice_friends - bob_friends
print(alice_only)
# {'Bob', 'Diana'}

# The other direction gives different results:
bob_only = bob_friends - alice_friends
print(bob_only)
# {'Alice', 'Frank'}
```

Notice that difference is *not* symmetric -- `A - B` is different from `B - A`.

#### Set Symmetric Difference

**Set symmetric difference** returns items that are in *one* set or the other, but *not in both*. It's like the union minus the intersection. Think of it as "friends who are exclusive to one group."

```python
# Symmetric difference: friends in one group but not both
exclusive_friends = alice_friends ^ bob_friends
print(exclusive_friends)
# {'Bob', 'Diana', 'Alice', 'Frank'}

# Same thing using the method:
exclusive_friends = alice_friends.symmetric_difference(bob_friends)
```

#### Diagram: Venn Diagram Set Operations

<iframe src="../../sims/venn-diagram-sets/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Venn Diagram Set Operations MicroSim</summary>
Type: microsim
**sim-id:** venn-diagram-sets<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Apply (L3)
**Bloom Verb:** demonstrate, compute

**Learning Objective:** Students will be able to compute union, intersection, difference, and symmetric difference of two sets by interacting with a Venn diagram and seeing the results highlighted visually and computed in code.

**Purpose:** An interactive Venn diagram that lets students add elements to two sets, then select an operation and see the result highlighted on the diagram and displayed as Python code.

**Layout:**
- Top section: Title "Set Operations with Venn Diagrams"
- Middle section: Two overlapping circles (classic Venn diagram) labeled "Set A" and "Set B"
- Elements displayed as labels within the appropriate circle regions
- Below the diagram: Four operation buttons: "Union", "Intersection", "Difference (A-B)", "Symmetric Difference"
- Bottom section: Python code output showing the operation and result

**Default data:**
- Set A: {"apple", "banana", "cherry", "date"}
- Set B: {"cherry", "date", "elderberry", "fig"}

**Interactive elements:**
- Click an operation button to highlight the corresponding region of the Venn diagram
  - Union: both entire circles highlighted
  - Intersection: only the overlapping region highlighted
  - Difference (A-B): only the left-only region highlighted
  - Symmetric Difference: both non-overlapping regions highlighted (overlap is excluded)
- Input fields to add/remove items from Set A and Set B
- Python code output updates to show the operation symbol and result
- A "Swap A and B" button to see how it affects difference

**Visual elements:**
- Circle A: blue with semi-transparent fill
- Circle B: orange with semi-transparent fill
- Overlap region: green when intersection is selected
- Highlighted regions pulse gently
- Elements in the highlighted region appear in bold
- Elements outside the highlighted region appear dimmed

**Code output examples:**
- Union: `A | B = {'apple', 'banana', 'cherry', 'date', 'elderberry', 'fig'}`
- Intersection: `A & B = {'cherry', 'date'}`
- Difference: `A - B = {'apple', 'banana'}`
- Symmetric Difference: `A ^ B = {'apple', 'banana', 'elderberry', 'fig'}`

**Instructional Rationale:** Venn diagrams are the classic visual for set operations. Interactive highlighting connects the visual regions to the mathematical operations and Python syntax. Showing the equivalent Python code bridges the gap between the visual representation and programming.
</details>

### Set Methods

Beyond the operators, Python provides many useful **set methods** for adding, removing, and manipulating set contents:

| Method | What It Does | Example |
|--------|-------------|---------|
| `add(x)` | Add element `x` to the set | `s.add("kiwi")` |
| `remove(x)` | Remove `x`; raises `KeyError` if missing | `s.remove("apple")` |
| `discard(x)` | Remove `x`; does nothing if missing | `s.discard("mango")` |
| `pop()` | Remove and return an arbitrary element | `s.pop()` |
| `clear()` | Remove all elements | `s.clear()` |
| `copy()` | Return a shallow copy of the set | `s2 = s.copy()` |
| `update(other)` | Add all elements from `other` | `s.update({4, 5, 6})` |
| `issubset(other)` | Is every element of `s` in `other`? | `{1, 2}.issubset({1, 2, 3})` -- `True` |
| `issuperset(other)` | Does `s` contain every element of `other`? | `{1, 2, 3}.issuperset({1, 2})` -- `True` |
| `isdisjoint(other)` | Do `s` and `other` share no elements? | `{1, 2}.isdisjoint({3, 4})` -- `True` |

```python
# Using set methods
basket = {"apple", "banana", "cherry"}

# Add an item
basket.add("date")
print(basket)  # {'apple', 'banana', 'cherry', 'date'}

# Try to add a duplicate -- nothing happens
basket.add("apple")
print(basket)  # {'apple', 'banana', 'cherry', 'date'}

# Remove an item safely with discard (no error if missing)
basket.discard("mango")  # No error, even though mango isn't there
print(basket)  # {'apple', 'banana', 'cherry', 'date'}

# Check subset/superset relationships
small = {1, 2}
big = {1, 2, 3, 4, 5}
print(small.issubset(big))    # True  (every element of small is in big)
print(big.issuperset(small))  # True  (big contains all of small)
print(small.isdisjoint({6, 7}))  # True  (no elements in common)
```

!!! mascot-tip "Monty says: Let's debug this together!"
    ![Monty](../../img/monty-tip.png){ align=left width="80" }
    Use `discard()` instead of `remove()` when you're not sure if an element exists. `remove()` will crash your program with a `KeyError` if the item is missing, but `discard()` just quietly does nothing. It's the polite version!

### Removing Duplicates

One of the most common practical uses of sets is **removing duplicates** from a list. Since sets automatically discard duplicates, you can convert a list to a set and back to get a list with unique elements only:

```python
# A list with duplicates
scores = [95, 87, 95, 92, 88, 87, 95, 100, 88]

# Remove duplicates by converting to a set, then back to a list
unique_scores = list(set(scores))
print(unique_scores)  # [100, 87, 88, 92, 95]  (order may vary)
```

Notice that the order might change because sets are unordered. If you need to preserve the original order while removing duplicates, you can use a different approach:

```python
# Remove duplicates while preserving order
scores = [95, 87, 95, 92, 88, 87, 95, 100, 88]
seen = set()
unique_ordered = []
for score in scores:
    if score not in seen:
        seen.add(score)
        unique_ordered.append(score)

print(unique_ordered)  # [95, 87, 92, 88, 100]
```

This pattern uses a set (`seen`) for fast membership testing and a list (`unique_ordered`) to maintain insertion order. It's a perfect example of using the right tool for each job.

```python
# Real-world example: finding unique words in a sentence
sentence = "the cat sat on the mat and the cat slept"
words = sentence.split()
unique_words = set(words)
print(unique_words)
# {'and', 'cat', 'mat', 'on', 'sat', 'slept', 'the'}
print(f"Total words: {len(words)}, Unique words: {len(unique_words)}")
# Total words: 10, Unique words: 7
```

#### Diagram: Removing Duplicates Visualizer

<iframe src="../../sims/removing-duplicates/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Removing Duplicates Step-by-Step Visualizer</summary>
Type: microsim
**sim-id:** removing-duplicates<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Apply (L3)
**Bloom Verb:** demonstrate, apply

**Learning Objective:** Students will be able to use a set to remove duplicate values from a list by stepping through the conversion process and observing how duplicates are discarded.

**Purpose:** An animated step-by-step visualization that shows how converting a list to a set removes duplicates, and how converting back to a list produces unique values.

**Layout:**
- Top: Input list displayed as a row of colored boxes with values (some duplicated)
- Middle: A set container (shown as a circle or cloud shape) where values are added one by one
- Bottom: Output list (unique values)
- Left side: Step counter and current operation description

**Default data:** `[3, 7, 3, 1, 7, 9, 1, 3, 5]`

**Interactive elements:**
- "Step" button: Advance one element at a time. Each step shows:
  - The current element highlighted in the input list
  - An arrow animation showing the element moving toward the set
  - If the element is new, it enters the set (green flash)
  - If the element is a duplicate, it bounces off the set (red flash, "Already in set!" message)
- "Auto Play" button: Animate all steps with a pause between each
- "Reset" button: Return to the initial state
- "Custom Input" text field: Enter your own comma-separated list of numbers
- After all elements are processed, a "Convert to List" button copies set elements to the output list

**Visual elements:**
- Input boxes: color-coded so duplicates share the same color
- Set container: circular/oval shape that grows as new elements are added
- Duplicate attempts: element bounces off the set with a "poof" animation
- New elements: smooth slide into the set with a green glow

**Instructional Rationale:** Step-by-step processing reveals the mechanism behind duplicate removal. The bounce-off animation for duplicates makes the uniqueness constraint tangible and memorable. Custom input lets students experiment with their own data.
</details>

### Frozenset

We just learned that tuples are like immutable lists. Is there an immutable version of sets? Yes! It's called a **frozenset**.

A frozenset has all the same elements and supports all the same operations (union, intersection, etc.) but you cannot add or remove elements after creation. Just like tuples can be dictionary keys, frozensets can too.

```python
# Creating a frozenset
frozen = frozenset([1, 2, 3, 4])
print(frozen)       # frozenset({1, 2, 3, 4})
print(type(frozen))  # <class 'frozenset'>

# Frozensets support set operations
other = frozenset([3, 4, 5, 6])
print(frozen | other)  # frozenset({1, 2, 3, 4, 5, 6})
print(frozen & other)  # frozenset({3, 4})

# But you CAN'T modify them
# frozen.add(5)  # AttributeError: 'frozenset' object has no attribute 'add'
```

When would you use a frozenset? Here are some common scenarios:

- When you need a set that's a **dictionary key** (regular sets can't be keys because they're mutable)
- When you want to make sure a set **doesn't get accidentally modified**
- When you need a set inside another set (sets can't contain other sets, but they can contain frozensets)

```python
# Frozenset as a dictionary key
permissions = {
    frozenset({"read", "write"}): "Editor",
    frozenset({"read"}): "Viewer",
    frozenset({"read", "write", "admin"}): "Administrator",
}

user_perms = frozenset({"read", "write"})
print(permissions[user_perms])  # Editor

# A set of frozensets (set of sets!)
groups = {
    frozenset({"Alice", "Bob"}),
    frozenset({"Charlie", "Diana"}),
    frozenset({"Eve", "Frank"}),
}
print(groups)
```

Here's a quick comparison of all four collection types you've learned so far:

| Feature | List | Tuple | Set | Frozenset |
|---------|------|-------|-----|-----------|
| Syntax | `[1, 2, 3]` | `(1, 2, 3)` | `{1, 2, 3}` | `frozenset({1, 2, 3})` |
| Ordered? | Yes | Yes | No | No |
| Mutable? | Yes | No | Yes | No |
| Duplicates? | Allowed | Allowed | Not allowed | Not allowed |
| Indexable? | Yes | Yes | No | No |
| Dict key? | No | Yes | No | Yes |

#### Diagram: Python Collections Overview

<iframe src="../../sims/python-collections-overview/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Python Collections Overview Interactive Chart</summary>
Type: infographic
**sim-id:** python-collections-overview<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Analyze (L4)
**Bloom Verb:** compare, classify

**Learning Objective:** Students will be able to classify Python's four core collection types (list, tuple, set, frozenset) by their properties and select the appropriate type for a given scenario.

**Purpose:** A 2x2 matrix chart showing all four collection types organized by two axes: ordered vs unordered (horizontal) and mutable vs immutable (vertical), with hover details for each.

**Layout:**
- A 2x2 grid with:
  - Top-left (Ordered + Mutable): List
  - Top-right (Unordered + Mutable): Set
  - Bottom-left (Ordered + Immutable): Tuple
  - Bottom-right (Unordered + Immutable): Frozenset
- X-axis labeled "Ordered <---> Unordered"
- Y-axis labeled "Mutable <---> Immutable"
- Each quadrant contains a card for the collection type

**Interactive elements:**
- Hover over any quadrant card to see:
  - Syntax example
  - Key properties (duplicates allowed?, indexable?, can be dict key?)
  - Best use case
  - Icon representation (list = numbered boxes, tuple = locked numbered boxes, set = unique marbles, frozenset = locked unique marbles)
- A "Quiz Me" button presents a property (e.g., "Immutable + Ordered") and asks which type fits
- Click a quadrant to expand it with more examples and code snippets

**Visual elements:**
- Each quadrant has a distinct color: List (green), Tuple (gold), Set (blue), Frozenset (purple)
- Lock icons on immutable types
- Number badges on ordered types
- "No duplicates" icons on set types

**Instructional Rationale:** A 2x2 matrix organized by the two most important properties (ordered/unordered and mutable/immutable) gives students a clear mental model for classification. The spatial layout makes the relationships between types immediately visible, supporting the Analyze level.
</details>

## Putting It All Together

Let's see tuples and sets working together in a realistic example. Imagine you're building a simple student grade tracker:

```python
# Student records as tuples (name, grade, gpa) -- fixed data
students = [
    ("Alice", 10, 3.8),
    ("Bob", 11, 3.2),
    ("Charlie", 10, 3.5),
    ("Diana", 12, 3.9),
    ("Eve", 10, 3.1),
]

# Unpack tuples in a loop
for name, grade, gpa in students:
    if gpa >= 3.5:
        print(f"{name} (Grade {grade}) made the honor roll!")

# Use a set to find unique grade levels
grade_levels = {grade for name, grade, gpa in students}
print(f"Grade levels represented: {grade_levels}")
# Grade levels represented: {10, 11, 12}

# Use tuple as dictionary key: (grade_level,) -> list of students
by_grade = {}
for name, grade, gpa in students:
    if grade not in by_grade:
        by_grade[grade] = []
    by_grade[grade].append(name)

print(by_grade)
# {10: ['Alice', 'Charlie', 'Eve'], 11: ['Bob'], 12: ['Diana']}

# Find students in BOTH the math club and science club
math_club = {"Alice", "Bob", "Charlie"}
science_club = {"Bob", "Diana", "Charlie", "Eve"}

both_clubs = math_club & science_club
print(f"In both clubs: {both_clubs}")      # {'Bob', 'Charlie'}

either_club = math_club | science_club
print(f"In at least one club: {either_club}")  # All five students
```

This example uses tuples for fixed student records, unpacking to access individual fields, sets for finding unique values and computing overlaps, and dictionaries with integer keys. Each data structure plays to its strengths.

#### Diagram: Tuple and Set Concept Map

<iframe src="../../sims/tuple-set-concept-map/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Tuple and Set Concept Map</summary>
Type: diagram
**sim-id:** tuple-set-concept-map<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Understand (L2)
**Bloom Verb:** summarize, relate

**Learning Objective:** Students will be able to summarize the relationships between tuples, sets, frozensets, and lists by exploring a concept map that connects their shared and distinct properties.

**Purpose:** An interactive concept map showing how tuples and sets relate to each other and to lists and frozensets, with nodes for key properties and operations.

**Layout:**
- Central column: Four nodes vertically for List, Tuple, Set, Frozenset
- Connected property nodes branching out:
  - "Ordered" connects to List and Tuple
  - "Unordered" connects to Set and Frozenset
  - "Mutable" connects to List and Set
  - "Immutable" connects to Tuple and Frozenset
  - "Allows Duplicates" connects to List and Tuple
  - "Unique Elements" connects to Set and Frozenset
  - "Can Be Dict Key" connects to Tuple and Frozenset
- Operation nodes for sets: Union, Intersection, Difference, Symmetric Difference

**Interactive elements:**
- Hover over any collection type node to highlight all its connected properties
- Hover over a property node to highlight all collection types that share it
- Click a collection type to see a code example in a tooltip
- Animated connection lines that pulse when highlighted

**Visual elements:**
- Collection type nodes: large rounded rectangles with distinct colors
- Property nodes: smaller ovals
- Connection lines: color-coded to match the property
- Pulse animation on hover for connected nodes

**Instructional Rationale:** A concept map supports the Understand level by making relationships explicit and visual. Highlighting connections on hover helps students see patterns (e.g., "immutable types can be dict keys") that might not be obvious from reading text alone.
</details>

!!! mascot-celebration "Monty says: You've got this!"
    ![Monty](../../img/monty-celebrates.png){ align=left width="80" }
    Awesome work, coder! You've just added two powerful tools to your Python toolkit. Tuples keep your data safe and unchangeable, and sets make finding unique values and comparing groups a breeze. In the next chapter, we'll tackle dictionaries -- the ultimate key-value data structure. Get ready for even more collection power!

## Key Takeaways

- A **tuple** is an ordered, immutable sequence created with parentheses `()`. Once created, it can't be changed.
- **Tuple packing** bundles values into a tuple; **tuple unpacking** extracts them into separate variables. The swap trick `a, b = b, a` uses both.
- Tuples have only two methods: `count()` and `index()`. Their simplicity is a feature, not a limitation.
- **Tuples can be dictionary keys** because they're immutable. Lists cannot.
- Use tuples for fixed data (coordinates, records) and lists for data that changes.
- A **set** is an unordered collection of unique elements created with `{}` or `set()`.
- Sets support **union** (`|`), **intersection** (`&`), **difference** (`-`), and **symmetric difference** (`^`).
- **Membership testing** (`in`) is much faster with sets than with lists -- \(O(1)\) vs \(O(n)\).
- Convert a list to a set and back to **remove duplicates** quickly.
- A **frozenset** is an immutable set -- it can be used as a dictionary key or stored inside another set.
- Use `discard()` instead of `remove()` when you're unsure if an element exists in a set.

??? question "Check Your Understanding: What's the difference between `(42)` and `(42,)` in Python?"
    `(42)` is just the integer `42` -- the parentheses are treated as grouping, like in a math expression. `(42,)` is a **tuple** containing one element. The trailing comma is what tells Python it's a tuple. You can verify with `type((42))` which returns `<class 'int'>` and `type((42,))` which returns `<class 'tuple'>`.

??? question "Check Your Understanding: Given `A = {1, 2, 3, 4}` and `B = {3, 4, 5, 6}`, what is `A & B` and `A ^ B`?"
    `A & B` is the **intersection** -- elements in both sets: `{3, 4}`. `A ^ B` is the **symmetric difference** -- elements in one set but not both: `{1, 2, 5, 6}`. Think of symmetric difference as the union minus the intersection.

??? question "Check Your Understanding: Why can tuples be used as dictionary keys but lists cannot?"
    Dictionary keys must be **immutable** (unchangeable). Tuples are immutable, so Python can compute a stable hash value for them. Lists are mutable -- if you changed a list after using it as a key, the hash would become invalid and the dictionary wouldn't work correctly. For the same reason, regular sets can't be dict keys, but frozensets can.
