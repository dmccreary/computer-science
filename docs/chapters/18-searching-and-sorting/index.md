---
title: Searching and Sorting
description: Linear and binary search, selection sort, insertion sort, merge sort, Big-O notation, and algorithm complexity analysis.
generated_by: claude skill chapter-content-generator
date: 2026-02-11
version: 0.04
---

# Searching and Sorting

## Summary

This chapter introduces fundamental algorithms for searching and sorting data. Students will learn linear and binary search, then study selection sort, insertion sort, and merge sort (including its recursive implementation). The chapter covers algorithm correctness through loop invariants, Big-O notation for analyzing time and space complexity, and introduces the key complexity classes. Comparing algorithms by their efficiency is a core computer science skill.

## Concepts Covered

This chapter covers the following 20 concepts from the learning graph:

1. Algorithm Design
2. Pseudocode
3. Flowcharts
4. Linear Search
5. Binary Search
6. Search Comparison
7. Selection Sort
8. Insertion Sort
9. Merge Sort
10. Merge Sort Recursion
11. Sorting Comparison
12. Stable vs Unstable Sort
13. Algorithm Correctness
14. Loop Invariants
15. Big-O Notation
16. Time Complexity
17. Space Complexity
18. Constant Time O(1)
19. Linear Time O(n)
20. Quadratic Time O(n^2)

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Computer Science](../01-intro-to-computer-science/index.md)
- [Chapter 3: Boolean Logic and Comparisons](../03-boolean-logic/index.md)
- [Chapter 4: Control Flow](../04-control-flow/index.md)
- [Chapter 7: Higher-Order Functions and Recursion](../07-higher-order-functions-and-recursion/index.md)
- [Chapter 8: Lists](../08-lists/index.md)
- [Chapter 9: Advanced List Operations](../09-advanced-list-operations/index.md)

---

!!! mascot-welcome "Monty says: Let's code this!"
    ![Monty](../../img/monty-welcome.png){ align=left width="80" }
    Welcome back, coders! Imagine you've got a huge pile of homework papers and you need to find one specific sheet. Do you flip through every single page, or do you use a smarter strategy? That's exactly the kind of question we'll answer in this chapter. We're going to learn how computers search through data and sort it into order — and we'll figure out which approaches are fast, which are slow, and *why*. Let's do this!

## Algorithm Design: Thinking Before Coding

Before you write a single line of Python, you need a plan. **Algorithm design** is the process of figuring out the step-by-step strategy you'll use to solve a problem. A well-designed algorithm is clear, correct, and efficient. A poorly designed one might work... eventually... but it could take your computer hours instead of milliseconds.

Good algorithm design starts with asking yourself three questions:

1. **What is the input?** (What data am I starting with?)
2. **What is the desired output?** (What do I want the answer to look like?)
3. **What steps transform the input into the output?**

For example, if the problem is "find the largest number in a list," the input is the list, the output is the largest value, and the steps involve checking each number and keeping track of the biggest one you've seen so far.

### Pseudocode: Planning in Plain English

**Pseudocode** is a way to write out your algorithm in plain, human-readable language before translating it into Python (or any programming language). It looks like code, but it doesn't follow any strict syntax rules. The goal is to capture the *logic* without worrying about commas, colons, or indentation.

Here's pseudocode for finding the largest number:

```
SET max_value TO first element of the list
FOR each element in the list:
    IF element > max_value:
        SET max_value TO element
RETURN max_value
```

Notice how you can read it almost like English? That's the point. Pseudocode helps you focus on *what* to do before getting bogged down in *how* to say it in Python.

### Flowcharts: Seeing the Logic

A **flowchart** is a diagram that shows the steps of an algorithm visually. Different shapes have different meanings:

- **Oval** = Start or End
- **Rectangle** = A process or action step
- **Diamond** = A decision (yes/no question)
- **Arrow** = The flow from one step to the next

Flowcharts are especially helpful when your algorithm has branches (if/else) or loops, because you can literally *see* where the path splits and where it loops back.

#### Diagram: Linear Search Flowchart

<iframe src="../../sims/linear-search-flowchart/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Linear Search Flowchart</summary>

Type: diagram
**sim-id:** linear-search-flowchart<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Understand (L2)
**Bloom Verb:** trace, explain

**Learning Objective:** Students will be able to trace the steps of a linear search algorithm through a flowchart and explain the decision logic at each step.

**Purpose:** An interactive flowchart that animates the steps of linear search. Students can enter a target value and watch the algorithm walk through an array one element at a time, highlighting the current node in the flowchart.

**Layout:**

- Top: "Start" oval
- Process box: "Set index = 0"
- Diamond: "Is index < length?"
  - No branch: Process box "Return -1 (not found)" then End oval
  - Yes branch: Diamond "Is list[index] == target?"
    - Yes: Process box "Return index" then End oval
    - No: Process box "index = index + 1" then loop back to first diamond
- Right panel: the array being searched, with the current element highlighted

**Interactive controls:**

- Input field for target value
- "Step" button to advance one flowchart node at a time
- "Auto Run" button to animate the full search
- "Reset" button to start over
- Array is editable: students can type comma-separated values

**Visual style:** Rounded rectangles for processes, diamonds for decisions, ovals for start/end. Active node glows yellow. Completed nodes turn green (found) or gray (passed).

**Instructional Rationale:** Tracing through a flowchart step by step builds understanding of control flow in algorithms. Connecting the flowchart nodes to the actual array state gives students a dual representation — abstract logic and concrete data — which strengthens comprehension.
</details>

## Searching: Finding the Needle

Searching is one of the most common operations in computer science. Think about all the searching you do every day: looking up a contact on your phone, finding a song on a streaming app, or searching the web. Under the hood, computers use search algorithms to find what you're looking for.

We'll explore two fundamental search algorithms: linear search and binary search.

### Linear Search: One at a Time

**Linear search** (also called sequential search) is the simplest search strategy: start at the beginning of the list and check each element one by one until you find what you're looking for — or reach the end.

It's like looking for a specific card in an unsorted deck. You flip through each card from top to bottom. Not fancy, but it always works.

Let's walk through an example. Suppose we have this list and we're searching for the value `7`:

```
[3, 8, 1, 7, 5, 2]
```

| Step | Index | Element | Match? |
|------|-------|---------|--------|
| 1 | 0 | 3 | No |
| 2 | 1 | 8 | No |
| 3 | 2 | 1 | No |
| 4 | 3 | 7 | Yes! Return index 3 |

We found `7` at index 3 after checking 4 elements. Here's the Python code:

```python
def linear_search(data, target):
    """Search for target in data using linear search.
    Returns the index if found, or -1 if not found."""
    for i in range(len(data)):
        if data[i] == target:
            return i
    return -1

# Example usage
numbers = [3, 8, 1, 7, 5, 2]
result = linear_search(numbers, 7)
print(f"Found at index: {result}")  # Output: Found at index: 3
```

Linear search works on *any* list — sorted or unsorted. But here's the downside: if the list has a million elements and your target is the very last one (or not in the list at all), you'll have to check all million elements. That's a lot of flipping.

#### Diagram: Linear Search Step-by-Step

<iframe src="../../sims/linear-search-visualization/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Linear Search Visualization MicroSim</summary>

Type: microsim
**sim-id:** linear-search-visualization<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Apply (L3)
**Bloom Verb:** execute, demonstrate

**Learning Objective:** Students will be able to execute a linear search on a given array by stepping through the algorithm and predicting whether each element matches the target.

**Purpose:** An interactive MicroSim that displays an array of colored bars (heights represent values). The student picks a target, and the simulation highlights each bar one at a time as the linear search scans from left to right.

**Layout:**

- Top: Title "Linear Search" and a target value input field
- Center: Array displayed as vertical bars. Each bar labeled with its value. The currently inspected bar glows yellow. Bars that have been checked but didn't match turn gray. A matching bar turns green.
- Bottom: Step counter and status message ("Checking index 3... Not a match" or "Found at index 3!")

**Interactive controls:**

- Input field for the target value (or dropdown with preset values)
- "Step" button: advance one comparison
- "Auto Search" button: animate the full search
- "Shuffle" button: randomize the array
- "Reset" button: clear and start over
- Speed slider for auto search

**Visual style:** Colorful vertical bars with smooth transitions. Active bar bounces slightly. Found bar pulses green.

**Instructional Rationale:** Step-by-step visualization connects the abstract loop of linear search to a concrete visual. Students can predict the next comparison before pressing "Step," reinforcing active learning.
</details>

### Binary Search: Divide and Conquer

What if the list is already sorted? Then we can do something *much* smarter. **Binary search** works by repeatedly cutting the list in half. At each step, you compare the target to the middle element:

- If the target equals the middle element, you're done!
- If the target is smaller, search the left half.
- If the target is larger, search the right half.

It's like the classic "guess the number" game. Someone picks a number between 1 and 100, and you guess the middle: "Is it 50?" "Too high." "Is it 25?" "Too low." "Is it 37?" Each guess eliminates half the remaining possibilities.

Let's walk through an example. Our sorted list is:

```
[2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
```

We're searching for `23`.

| Step | Low | High | Mid | list[mid] | Action |
|------|-----|------|-----|-----------|--------|
| 1 | 0 | 9 | 4 | 16 | 23 > 16, search right half |
| 2 | 5 | 9 | 7 | 56 | 23 < 56, search left half |
| 3 | 5 | 6 | 5 | 23 | 23 == 23, found it! |

Only 3 comparisons to search a list of 10 elements! With linear search, we might have needed up to 10. Here's the Python code:

```python
def binary_search(data, target):
    """Search for target in a sorted list using binary search.
    Returns the index if found, or -1 if not found."""
    low = 0
    high = len(data) - 1

    while low <= high:
        mid = (low + high) // 2
        if data[mid] == target:
            return mid
        elif data[mid] < target:
            low = mid + 1
        else:
            high = mid - 1

    return -1

# Example usage
sorted_numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
result = binary_search(sorted_numbers, 23)
print(f"Found at index: {result}")  # Output: Found at index: 5
```

!!! mascot-thinking "Monty says: You've got this!"
    ![Monty](../../img/monty-thinking.png){ align=left width="80" }
    Here's a wild fact: binary search on a *sorted* list of one billion items finds any element in at most 30 comparisons. That's because \( \log_2(1{,}000{,}000{,}000) \approx 30 \). Linear search might need all one billion checks. That's the power of cutting things in half!

**Important caveat:** Binary search only works on sorted data. If your list isn't sorted, you have to sort it first (or use linear search instead).

#### Diagram: Binary Search Step-by-Step

<iframe src="../../sims/binary-search-visualization/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Binary Search Visualization MicroSim</summary>


Type: microsim
**sim-id:** binary-search-visualization<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Apply (L3)
**Bloom Verb:** execute, trace

**Learning Objective:** Students will be able to trace through a binary search algorithm on a sorted array, identifying the low, high, and mid pointers at each step.

**Purpose:** An interactive MicroSim showing a sorted array of bars. At each step, the algorithm highlights the mid element and eliminates half the array (graying out the discarded half). Pointer markers for `low`, `high`, and `mid` move along the array.

**Layout:**

- Top: Title "Binary Search" and target value input
- Center: Sorted array displayed as vertical bars. Three labeled pointer arrows (low = blue, mid = yellow, high = red) sit below the bars. The active search range is bright; eliminated portions fade to gray.
- Bottom: Step log showing each comparison ("Step 2: mid=7, list[7]=56, 23 < 56, search left")

**Interactive controls:**

- Input field for target value
- "Step" button: advance one comparison
- "Auto Search" button: animate the full search
- "Reset" button
- Speed slider

**Visual style:** Sorted bars in gradient from short to tall. Active range stays colorful; eliminated range fades. Mid element bounces on inspection.

**Instructional Rationale:** Visualizing the shrinking search range makes the "divide and conquer" strategy tangible. Pointer labels reinforce the roles of low, high, and mid variables.
</details>

### Search Comparison

Now let's put these two algorithms side by side. This **search comparison** reveals when to use each one:

| Feature | Linear Search | Binary Search |
|---------|--------------|---------------|
| Requires sorted data? | No | Yes |
| Best case | \( O(1) \) — first element | \( O(1) \) — middle element |
| Worst case | \( O(n) \) — last element or not found | \( O(\log n) \) — not found |
| Average case | \( O(n) \) | \( O(\log n) \) |
| Easy to implement? | Very easy | Slightly trickier |

**When to use linear search:** Your data is unsorted, your list is small, or you only need to search once (not worth sorting first).

**When to use binary search:** Your data is already sorted and you'll be searching many times. The upfront cost of sorting pays off with much faster searches.

## Sorting: Putting Things in Order

Now that we've seen how powerful binary search is on sorted data, the natural question is: *how do we sort data in the first place?* Sorting is one of the most studied problems in all of computer science. There are dozens of sorting algorithms, each with different strengths.

We'll focus on three: selection sort, insertion sort, and merge sort. For each one, we'll walk through a concrete example with a small array.

### Selection Sort: Find the Smallest, Repeat

**Selection sort** works by repeatedly finding the smallest element in the unsorted portion of the list and swapping it into its correct position.

Here's the idea: scan the entire list to find the minimum value, then swap it with the first element. Now the first element is sorted. Next, scan the *rest* of the list (everything after index 0) to find the new minimum, and swap it with the second element. Keep going until the whole list is sorted.

Let's sort `[29, 10, 14, 37, 13]`:

| Pass | Action | List State |
|------|--------|------------|
| Start | | [**29**, 10, 14, 37, 13] |
| 1 | Min of [29,10,14,37,13] is 10. Swap with index 0. | [**10**, 29, 14, 37, 13] |
| 2 | Min of [29,14,37,13] is 13. Swap with index 1. | [10, **13**, 14, 37, 29] |
| 3 | Min of [14,37,29] is 14. Already at index 2. | [10, 13, **14**, 37, 29] |
| 4 | Min of [37,29] is 29. Swap with index 3. | [10, 13, 14, **29**, 37] |
| Done | | [10, 13, 14, 29, 37] |

```python
def selection_sort(data):
    """Sort a list in place using selection sort."""
    n = len(data)
    for i in range(n):
        # Find the index of the minimum element in data[i:]
        min_index = i
        for j in range(i + 1, n):
            if data[j] < data[min_index]:
                min_index = j
        # Swap the found minimum with the element at index i
        data[i], data[min_index] = data[min_index], data[i]
    return data

numbers = [29, 10, 14, 37, 13]
print(selection_sort(numbers))  # Output: [10, 13, 14, 29, 37]
```

Selection sort always makes the same number of comparisons regardless of the input, so its time complexity is \( O(n^2) \) in all cases. On the upside, it makes very few swaps — at most \( n - 1 \).

### Insertion Sort: Build a Sorted Hand

**Insertion sort** works the way most people sort playing cards. You pick up cards one at a time and insert each new card into its correct position among the cards you're already holding.

Start with the second element. Compare it to the first — if it's smaller, shift the first element right and insert. Then take the third element and insert it in the right spot among the first two. Continue until every element has been inserted into the sorted portion.

Let's sort `[29, 10, 14, 37, 13]`:

| Pass | Key | Action | List State |
|------|-----|--------|------------|
| Start | | | [29, 10, 14, 37, 13] |
| 1 | 10 | 10 < 29, shift 29 right, insert 10 | [**10, 29**, 14, 37, 13] |
| 2 | 14 | 14 < 29, shift 29 right; 14 > 10, insert | [**10, 14, 29**, 37, 13] |
| 3 | 37 | 37 > 29, already in place | [**10, 14, 29, 37**, 13] |
| 4 | 13 | 13 < 37, shift; 13 < 29, shift; 13 < 14, shift; 13 > 10, insert | [**10, 13, 14, 29, 37**] |

```python
def insertion_sort(data):
    """Sort a list in place using insertion sort."""
    for i in range(1, len(data)):
        key = data[i]
        j = i - 1
        # Shift elements that are greater than key to the right
        while j >= 0 and data[j] > key:
            data[j + 1] = data[j]
            j -= 1
        data[j + 1] = key
    return data

numbers = [29, 10, 14, 37, 13]
print(insertion_sort(numbers))  # Output: [10, 13, 14, 29, 37]
```

Insertion sort is \( O(n^2) \) in the worst case (a reverse-sorted list), but it shines on *nearly sorted* data — in that case, it approaches \( O(n) \). It's also great for small lists.

!!! mascot-tip "Monty says: Let's debug this together!"
    ![Monty](../../img/monty-tip.png){ align=left width="80" }
    Here's a handy trick: Python's built-in `sorted()` function actually uses Timsort, which is a hybrid algorithm based on insertion sort and merge sort. So the ideas in this chapter power the sorting you use every day in Python!

### Merge Sort: Divide, Sort, Merge

**Merge sort** takes a completely different approach. Instead of scanning through the list repeatedly, it uses a strategy called **divide and conquer**: split the list in half, recursively sort each half, then merge the two sorted halves back together.

The merging step is the clever part. When you merge two already-sorted lists, you just compare the first element of each list and take the smaller one. Repeat until both lists are empty. This merging process is very efficient.

Let's sort `[38, 27, 43, 3, 9, 82, 10]`:

**Step 1 — Divide:**

```
[38, 27, 43, 3, 9, 82, 10]
         /              \
  [38, 27, 43, 3]    [9, 82, 10]
     /       \          /      \
 [38, 27]  [43, 3]   [9, 82]  [10]
  /   \     /   \     /   \      |
[38] [27] [43]  [3] [9]  [82]  [10]
```

**Step 2 — Merge back together (sorted):**

```
[27, 38] [3, 43]   [9, 82]  [10]
     \     /          \      /
  [3, 27, 38, 43]    [9, 10, 82]
         \              /
  [3, 9, 10, 27, 38, 43, 82]
```

Here's the Python implementation. **Merge sort recursion** is a textbook example of how recursion naturally solves divide-and-conquer problems:

```python
def merge_sort(data):
    """Sort a list using merge sort (returns a new sorted list)."""
    # Base case: a list of 0 or 1 elements is already sorted
    if len(data) <= 1:
        return data

    # Divide: split the list in half
    mid = len(data) // 2
    left_half = merge_sort(data[:mid])
    right_half = merge_sort(data[mid:])

    # Conquer: merge the two sorted halves
    return merge(left_half, right_half)

def merge(left, right):
    """Merge two sorted lists into one sorted list."""
    result = []
    i = 0  # pointer for left
    j = 0  # pointer for right

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    # Append any remaining elements
    result.extend(left[i:])
    result.extend(right[j:])
    return result

numbers = [38, 27, 43, 3, 9, 82, 10]
print(merge_sort(numbers))  # Output: [3, 9, 10, 27, 38, 43, 82]
```

Notice the base case: a list with zero or one elements is already sorted. That's what stops the recursion. Each recursive call splits the list in half, and the `merge` function combines them back in sorted order.

Merge sort's time complexity is \( O(n \log n) \) in *all* cases — best, average, and worst. That's significantly faster than \( O(n^2) \) for large lists. The tradeoff? It uses extra memory to store the temporary merged lists.

#### Diagram: Sorting Algorithm Race

<iframe src="../../sims/sorting-algorithm-race/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Sorting Algorithm Comparison MicroSim</summary>


Type: microsim
**sim-id:** sorting-algorithm-race<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Analyze (L4)
**Bloom Verb:** compare, differentiate

**Learning Objective:** Students will be able to compare the performance of selection sort, insertion sort, and merge sort by watching them sort identical arrays side by side and observing the number of comparisons and swaps each algorithm makes.

**Purpose:** A side-by-side animated race between three sorting algorithms. All three operate on identical copies of the same random array simultaneously, allowing students to visually see the speed differences.

**Layout:**

- Three columns, one per algorithm: "Selection Sort," "Insertion Sort," "Merge Sort"
- Each column shows an array as vertical bars
- Below each column: comparison counter, swap/move counter, and elapsed step counter
- Bottom: shared controls

**Interactive controls:**

- "Generate Array" button: creates a new random array (shared across all three)
- Array size slider (10 to 100 elements)
- "Start Race" button: begins all three sorts simultaneously
- Speed slider (slow for studying, fast for comparison)
- "Reset" button
- Dropdown for initial arrangement: Random, Nearly Sorted, Reverse Sorted, Few Unique Values

**Visual elements:**

- Bars being compared glow yellow
- Bars being swapped flash red
- Sorted portions turn green
- Step counters update in real-time

**Instructional Rationale:** Side-by-side comparison directly supports the Analyze level by asking students to observe differences in algorithm behavior. Different initial arrangements (nearly sorted, reversed) reveal best-case and worst-case scenarios for each algorithm.
</details>

### Sorting Comparison

Let's put all three algorithms into a **sorting comparison** table:

| Algorithm | Best Case | Average Case | Worst Case | Space | Stable? |
|-----------|-----------|-------------|------------|-------|---------|
| Selection Sort | \( O(n^2) \) | \( O(n^2) \) | \( O(n^2) \) | \( O(1) \) | No |
| Insertion Sort | \( O(n) \) | \( O(n^2) \) | \( O(n^2) \) | \( O(1) \) | Yes |
| Merge Sort | \( O(n \log n) \) | \( O(n \log n) \) | \( O(n \log n) \) | \( O(n) \) | Yes |

Selection sort is consistent but always slow. Insertion sort is great for small or nearly sorted data. Merge sort is the champ for large datasets but uses more memory. There's no single "best" sorting algorithm — the right choice depends on your situation.

### Stable vs. Unstable Sort

Have you noticed the "Stable?" column in the table above? A **stable sort** preserves the relative order of elements that have equal values. An **unstable sort** might rearrange equal elements.

Why does this matter? Imagine you have a list of students sorted by name, and you want to re-sort by grade. With a stable sort, students who have the same grade will remain in alphabetical order. With an unstable sort, their name order might get scrambled.

- **Stable:** Insertion sort, merge sort
- **Unstable:** Selection sort (a swap might jump equal elements past each other)

When you're sorting simple numbers, stability doesn't matter. But when you're sorting complex records (like database rows), stability can be very important.

## How Good Is Your Algorithm? Analyzing Efficiency

You've now seen several algorithms. Some are fast, some are slow. But how do we *measure* that difference precisely? This is where we enter the world of algorithm analysis.

### Algorithm Correctness

Before worrying about speed, we should ask: "Does this algorithm actually work?" **Algorithm correctness** means proving that an algorithm produces the right answer for *every* valid input, not just the ones you tested.

Testing helps, but it can't cover every possible input. For important algorithms, computer scientists use mathematical reasoning to *prove* correctness.

### Loop Invariants: Proof by Repetition

A **loop invariant** is a condition that's true before the loop starts, stays true after each iteration, and is still true when the loop ends. It's like a promise the loop keeps at every step.

Let's look at the loop invariant for insertion sort:

> *At the start of each pass \( i \), the subarray `data[0..i-1]` is sorted and contains the same elements it originally had.*

- **Before the loop (i = 1):** `data[0..0]` is a single element — trivially sorted. True!
- **During each pass:** We insert `data[i]` into its correct position in the sorted subarray. After inserting, `data[0..i]` is sorted. True!
- **After the loop (i = n):** `data[0..n-1]` is the entire array, and it's sorted. That's our answer!

This three-step reasoning (initialization, maintenance, termination) is a powerful technique for verifying that loops do what they claim.

!!! mascot-warning "Monty says: Watch out!"
    ![Monty](../../img/monty-warning.png){ align=left width="80" }
    A common mistake when writing binary search is using `low + high` instead of `low + (high - low) // 2` for the midpoint calculation. In languages with fixed-size integers, `low + high` can overflow! Python handles big numbers gracefully, but it's a good habit to use the safer formula — and it shows interviewers you know your stuff.

## Big-O Notation: The Language of Efficiency

**Big-O notation** is a mathematical shorthand that describes how an algorithm's running time (or memory usage) grows as the input size increases. It doesn't tell you the exact time in seconds — instead, it tells you the *growth rate*.

Think of it this way: if you're mailing letters, the cost grows with the number of letters. Big-O tells you whether that growth is steady (one extra stamp per letter) or explosive (doubling with each letter).

We use Big-O to answer the question: "If I double the size of my input, what happens to the running time?"

### Time Complexity

**Time complexity** measures how the number of operations an algorithm performs grows with input size \( n \). It's what we usually mean when we say an algorithm is "fast" or "slow."

We focus on the *worst case* because it gives us a guarantee: "No matter what input you throw at me, I'll never be slower than this." You can also analyze best-case and average-case, but worst-case is the standard.

### Space Complexity

**Space complexity** measures how much extra memory an algorithm needs beyond the input itself. An algorithm that sorts a list in place (like selection sort or insertion sort) uses \( O(1) \) extra space — just a few temporary variables. Merge sort creates new lists during merging, so it uses \( O(n) \) extra space.

Both time and space matter. A blazing-fast algorithm that requires more memory than your computer has is no good. There's often a tradeoff between the two.

### The Key Complexity Classes

Let's break down the three most important complexity classes you'll encounter in this course.

#### Constant Time: \( O(1) \)

**Constant time** means the operation takes the same amount of time regardless of how big the input is. Accessing an element by index in a list is \( O(1) \) — whether the list has 10 elements or 10 million, `data[5]` takes the same time.

```python
def get_first(data):
    """Return the first element — O(1) time."""
    return data[0]
```

Double the list size? The time stays the same. That's constant time.

#### Linear Time: \( O(n) \)

**Linear time** means the running time grows proportionally with the input size. If the input doubles, the time roughly doubles. Linear search is \( O(n) \) — in the worst case, you check every element once.

```python
def sum_all(data):
    """Sum all elements — O(n) time."""
    total = 0
    for value in data:
        total += value
    return total
```

A list with 1,000 elements takes about 1,000 steps. A list with 2,000 takes about 2,000. Nice and predictable.

#### Quadratic Time: \( O(n^2) \)

**Quadratic time** means the running time grows with the *square* of the input size. If the input doubles, the time roughly *quadruples*. Selection sort and insertion sort (worst case) are both \( O(n^2) \) because they use nested loops — one loop inside another.

```python
def all_pairs(data):
    """Print all pairs — O(n^2) time."""
    for i in range(len(data)):
        for j in range(len(data)):
            print(data[i], data[j])
```

A list of 100 elements produces 10,000 pairs. A list of 200 produces 40,000. Things get ugly fast.

### Big-O Growth Rate Comparison

Here's a table that shows how these growth rates compare as the input size \( n \) increases:

| \( n \) | \( O(1) \) | \( O(\log n) \) | \( O(n) \) | \( O(n \log n) \) | \( O(n^2) \) |
|---------|-----------|----------------|-----------|------------------|-------------|
| 10 | 1 | 3 | 10 | 33 | 100 |
| 100 | 1 | 7 | 100 | 664 | 10,000 |
| 1,000 | 1 | 10 | 1,000 | 9,966 | 1,000,000 |
| 10,000 | 1 | 13 | 10,000 | 132,877 | 100,000,000 |
| 100,000 | 1 | 17 | 100,000 | 1,660,964 | 10,000,000,000 |

Look at that last row. At \( n = 100{,}000 \), an \( O(n^2) \) algorithm performs *ten billion* operations while an \( O(n \log n) \) algorithm does about 1.7 million. That's the difference between a few seconds and several hours.

#### Diagram: Big-O Growth Rate Chart

<iframe src="../../sims/big-o-growth-chart/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Big-O Growth Rate Chart MicroSim</summary>


Type: microsim
**sim-id:** big-o-growth-chart<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Analyze (L4)
**Bloom Verb:** compare, classify

**Learning Objective:** Students will be able to classify common Big-O complexity classes by their growth rate and predict how doubling the input size affects running time for each class.

**Purpose:** An interactive chart plotting the growth curves for \( O(1) \), \( O(\log n) \), \( O(n) \), \( O(n \log n) \), and \( O(n^2) \) on the same axes. Students can adjust the input size and see how dramatically the curves diverge.

**Layout:**

- X-axis: Input size \( n \) (from 0 to adjustable maximum)
- Y-axis: Number of operations
- Five labeled curves, each in a distinct color:
  - \( O(1) \) — flat green line
  - \( O(\log n) \) — gentle blue curve
  - \( O(n) \) — diagonal orange line
  - \( O(n \log n) \) — steeper purple curve
  - \( O(n^2) \) — steeply rising red curve
- Right panel: legend with checkboxes to show/hide individual curves

**Interactive controls:**

- Slider to set the maximum \( n \) value on the x-axis (10 to 100,000)
- Checkboxes to toggle each curve on/off
- Hover over any point on a curve to see the exact \( (n, \text{operations}) \) values
- "Zoom In" button to focus on the range where \( O(n) \) and \( O(n \log n) \) curves are close together (showing they diverge at scale)

**Visual elements:**

- Curves drawn as smooth lines with distinct colors
- Grid lines for reference
- Annotation arrows pointing out key observations (e.g., "At n=1000, O(n^2) is 1000x larger than O(n)")

**Instructional Rationale:** Seeing all growth curves on the same chart makes the dramatic differences between complexity classes visceral. The interactive slider lets students discover for themselves that \( O(n^2) \) "explodes" at large \( n \), which is far more impactful than reading about it.
</details>

Here's a visual summary of how each complexity class feels:

| Complexity | Nickname | How It Feels |
|-----------|----------|--------------|
| \( O(1) \) | Constant | Instant, no matter what |
| \( O(\log n) \) | Logarithmic | Barely noticeable growth |
| \( O(n) \) | Linear | Scales proportionally — fair and square |
| \( O(n \log n) \) | Linearithmic | A little worse than linear, but manageable |
| \( O(n^2) \) | Quadratic | Slows down fast — avoid for large data |

!!! mascot-encourage "Monty says: You've got this!"
    ![Monty](../../img/monty-encourages.png){ align=left width="80" }
    Big-O notation can feel abstract at first, but here's the thing: once you understand these five growth rates, you can quickly evaluate almost any algorithm you encounter. It's one of the most useful tools in a programmer's toolkit. You're building real computer science intuition right now!

## Putting It All Together: Choosing the Right Algorithm

Algorithm design is all about tradeoffs. Here's a decision guide for searching and sorting:

**For searching:**

- Small list or unsorted data? Use linear search. Simple and reliable.
- Large sorted data with many searches? Use binary search. Dramatically faster.

**For sorting:**

- Tiny list (under ~20 elements)? Insertion sort is fast and simple.
- Nearly sorted data? Insertion sort shines — close to \( O(n) \).
- Large dataset? Merge sort guarantees \( O(n \log n) \) every time.
- Memory is tight? Selection sort or insertion sort use \( O(1) \) extra space.

In practice, Python's built-in `sorted()` and `.sort()` use Timsort, which intelligently combines insertion sort for small runs with merge sort for combining them. So when you write `sorted(my_list)` in Python, you're getting the best of both worlds.

#### Diagram: Choosing a Search or Sort Algorithm

<iframe src="../../sims/algorithm-decision-flowchart/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Algorithm Decision Flowchart</summary>


Type: diagram
**sim-id:** algorithm-decision-flowchart<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Evaluate (L5)
**Bloom Verb:** select, justify

**Learning Objective:** Students will be able to select an appropriate search or sort algorithm for a given scenario and justify their choice based on input characteristics and complexity requirements.

**Purpose:** An interactive decision tree that asks the student a series of yes/no questions about their data and requirements, then recommends an algorithm and explains why.

**Layout:**

- Decision tree starting with "Are you searching or sorting?"
- Search branch: "Is the data sorted?" leads to binary search (yes) or linear search (no)
- Sort branch: "How large is the dataset?" -> "Is it nearly sorted?" -> "Is memory limited?" Each branch leads to a recommended algorithm with a brief justification.
- Clicking any leaf node shows the algorithm's Big-O complexity and a one-sentence explanation.

**Interactive elements:**

- Click yes/no at each diamond node to navigate the tree
- Leaf nodes are color-coded by algorithm
- "Start Over" button at any point
- Optional "Quiz Mode" that presents a scenario and asks the student to navigate to the correct algorithm

**Visual style:** Tree flows top to bottom with branching arrows. Active path is highlighted. Inactive branches are dimmed.

**Instructional Rationale:** A decision tree supports the Evaluate level by requiring students to consider multiple criteria and justify algorithm selection. Quiz mode provides practice applying the decision framework to novel scenarios.
</details>

!!! mascot-celebration "Monty says: Nice work, coder!"
    ![Monty](../../img/monty-celebrates.png){ align=left width="80" }
    You just tackled one of the most important chapters in computer science! You can now search through data, sort it into order, prove your algorithms are correct, and analyze how fast they run. These skills will serve you in every programming challenge ahead. High five!

## Key Takeaways

- **Algorithm design** means planning your step-by-step strategy before coding. Use **pseudocode** and **flowcharts** to sketch out your logic first.
- **Linear search** checks each element one by one — simple but \( O(n) \). **Binary search** cuts a sorted list in half each time — powerful at \( O(\log n) \).
- **Selection sort** repeatedly finds the minimum and swaps it into place — always \( O(n^2) \).
- **Insertion sort** builds a sorted portion by inserting each element where it belongs — \( O(n^2) \) worst case but \( O(n) \) on nearly sorted data.
- **Merge sort** divides the list in half, recursively sorts both halves, and merges them — guaranteed \( O(n \log n) \) but uses \( O(n) \) extra space.
- A **stable sort** preserves the order of equal elements; an **unstable sort** does not.
- **Algorithm correctness** can be verified using **loop invariants** — conditions that remain true before, during, and after each loop iteration.
- **Big-O notation** describes growth rate: \( O(1) \) is constant, \( O(n) \) is linear, \( O(n^2) \) is quadratic. **Time complexity** measures operations; **space complexity** measures memory.
- There's no single "best" algorithm — the right choice depends on your data size, whether it's sorted, and your memory constraints.

??? question "Check Your Understanding: Why can't you use binary search on an unsorted list?"
    Binary search relies on the list being **sorted** so it can eliminate half the remaining elements at each step. When it compares the target to the middle element, it assumes everything to the left is smaller and everything to the right is larger. If the list isn't sorted, that assumption breaks down, and the algorithm might skip right past the target value. You'd need to use **linear search** on unsorted data, or sort the list first.

??? question "Check Your Understanding: You have a list of 10,000 student records sorted by ID number. Which search algorithm should you use to find a specific student, and how many comparisons will it take at most?"
    You should use **binary search** because the data is already sorted. The maximum number of comparisons is \( \lceil \log_2(10{,}000) \rceil = 14 \). That means you can find any student among ten thousand records in at most **14 comparisons**. Linear search could take up to 10,000 comparisons in the worst case — that's over 700 times more!

??? question "Check Your Understanding: Insertion sort has a worst-case time complexity of O(n^2), but it can perform much better. When does insertion sort approach O(n) performance, and why?"
    Insertion sort approaches \( O(n) \) when the list is **already sorted or nearly sorted**. In that case, each new element is already in (or very close to) its correct position. The inner `while` loop barely executes because there are few or no elements to shift. Each of the \( n \) passes does roughly \( O(1) \) work, so the total is close to \( O(n) \). This is why insertion sort is excellent for data that's "almost sorted" — like a list where only a few elements are out of place.
