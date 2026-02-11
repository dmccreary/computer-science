---
title: File Input and Output
description: Reading and writing files, context managers, CSV and JSON processing, and file path handling in Python.
generated_by: claude skill chapter-content-generator
date: 2026-02-11
version: 0.04
---

# File Input and Output

## Summary

This chapter covers reading from and writing to files in Python. Students will learn to open files in different modes, use read and write methods, and work with the with statement and context managers for safe file handling. The chapter includes working with file paths, processing CSV files, reading and writing JSON data, and handling file-related exceptions. File I/O skills enable students to build programs that persist and exchange data.

## Concepts Covered

This chapter covers the following 16 concepts from the learning graph:

1. File Input Output
2. Opening Files
3. File Modes
4. Read Method
5. Readline Method
6. Readlines Method
7. Write Method
8. Writelines Method
9. With Statement
10. Context Managers
11. File Paths
12. CSV Files
13. JSON Files
14. File Exceptions
15. Text vs Binary Files
16. JSON and Dictionaries

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Computer Science](../01-intro-to-computer-science/index.md)
- [Chapter 5: Working with Strings](../05-working-with-strings/index.md)
- [Chapter 8: Lists](../08-lists/index.md)
- [Chapter 11: Dictionaries](../11-dictionaries/index.md)
- [Chapter 14: Errors and Exceptions](../14-errors-and-exceptions/index.md)

---

!!! mascot-welcome "Monty says: Let's code this!"
    ![Monty](../../img/monty-welcome.png){ align=left width="80" }
    Welcome back, coders! Up until now, every program you've written has had a short memory. The moment your program ends, all your data vanishes -- poof! -- like a Snapchat message. In this chapter, you'll learn to read and write *files*, which means your programs can finally remember things between runs. This is where your code starts feeling *real*. Let's do this!

## Why Files Matter

Think about the apps you use every day. Your music player remembers your playlists. Your notes app keeps your homework lists. Video games save your progress so you don't have to start over. All of these depend on **file input output** -- the ability for a program to read data *from* a file and write data *to* a file.

Without file I/O, your programs would be like a whiteboard that gets erased every time the lights turn off. With file I/O, your programs get a notebook they can keep forever.

Here's what file I/O unlocks for you:

- **Save user data** between program runs (high scores, preferences, to-do lists)
- **Load configuration** files that control how your program behaves
- **Process large datasets** that are too big to type in by hand
- **Exchange data** with other programs and services (CSV spreadsheets, JSON APIs)
- **Create logs** that record what your program did and when

By the end of this chapter, you'll be able to build programs that remember, share, and process real-world data. That's a *huge* level-up.

## Opening Files

The very first step in any file operation is **opening files**. In Python, you use the built-in `open()` function. It takes a filename (and optionally a mode) and returns a *file object* that you can use to read or write data.

Here's the simplest example:

```python
file = open("greeting.txt")
content = file.read()
print(content)
file.close()
```

This program opens a file called `greeting.txt`, reads its entire contents into a string, prints that string, and then closes the file. Simple, right?

But there's an important rule: **always close files when you're done with them.** If you forget to call `close()`, your program might lock the file, lose data, or run into memory problems. We'll learn a much better way to handle this soon (spoiler: it's the `with` statement), but for now, just remember: open it, use it, close it.

#### Diagram: File I/O Flow

<iframe src="../../sims/file-io-flow/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>File I/O Flow Interactive Diagram</summary>
Type: diagram
**sim-id:** file-io-flow<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Understand (L2)
**Bloom Verb:** describe, explain

**Learning Objective:** Students will be able to describe the sequence of operations in a file I/O workflow: open, read/write, and close.

**Purpose:** An animated flowchart that shows how data moves between a Python program and a file on disk during read and write operations.

**Layout:**
- Left side: A box representing the Python program (with a code snippet inside)
- Center: Animated arrows showing data flow
- Right side: A box representing a file on disk (styled like a document icon)
- Below: A three-step progress indicator: Open -> Read/Write -> Close

**Interactive elements:**
- "Read Mode" button: Animates data flowing from the file into the program, with the code snippet updating to show read operations
- "Write Mode" button: Animates data flowing from the program into the file, with the code snippet updating to show write operations
- "Step" button: Advance through open, read/write, close stages one at a time
- "Auto Play" button: Animate all three stages automatically

**Visual elements:**
- Data particles flow along arrows between program and file
- The file icon "opens" (lid lifts) when the open stage is active
- Code in the program box highlights the currently executing line
- The progress indicator highlights the current stage
- The file icon "closes" (lid drops) when the close stage completes

**Color scheme:**
- Program box: blue
- File icon: green
- Read arrows: blue particles flowing left to right (file to program)
- Write arrows: orange particles flowing right to left (program to file)

**Responsive:** Canvas resizes with window; elements reposition proportionally

**Instructional Rationale:** Animating the data flow between program and file makes the abstract concept of I/O concrete. The step-through controls let students observe each phase (open, read/write, close) individually, reinforcing the correct sequence of file operations.
</details>

## File Modes

When you open a file, you can tell Python *how* you want to use it by specifying a **file mode**. The mode is the second argument to `open()`:

```python
file = open("data.txt", "r")   # Open for reading
file = open("data.txt", "w")   # Open for writing (creates or overwrites!)
file = open("data.txt", "a")   # Open for appending (adds to the end)
```

Here's a complete reference table of the most common file modes:

| Mode | Name | What It Does | Creates File? | Overwrites? |
|------|------|-------------|--------------|------------|
| `"r"` | Read | Opens for reading only (default) | No -- error if file doesn't exist | No |
| `"w"` | Write | Opens for writing | Yes | **Yes** -- erases existing content! |
| `"a"` | Append | Opens for writing at the end | Yes | No -- adds to existing content |
| `"r+"` | Read/Write | Opens for both reading and writing | No -- error if file doesn't exist | Can overwrite existing content |
| `"w+"` | Write/Read | Opens for writing and reading | Yes | **Yes** -- erases existing content! |
| `"rb"` | Read Binary | Opens for reading binary data | No | No |
| `"wb"` | Write Binary | Opens for writing binary data | Yes | **Yes** |

!!! mascot-warning "Monty says: Watch out!"
    ![Monty](../../img/monty-warning.png){ align=left width="80" }
    Be very careful with `"w"` mode! It **erases everything** in the file the moment you open it. If you accidentally open your important data file with `"w"` instead of `"a"`, all that data is gone. Double-check your mode before running your code!

The default mode is `"r"` (read), so `open("data.txt")` and `open("data.txt", "r")` do exactly the same thing.

## Reading Files

Python gives you three different methods for reading data from a file. Each one is useful in different situations.

### The Read Method

The **read method** reads the *entire* contents of a file into a single string:

```python
file = open("poem.txt", "r")
content = file.read()
print(content)
file.close()
```

If `poem.txt` contains:

```
Roses are red,
Violets are blue,
Python is awesome,
And so are you!
```

Then `content` would be one big string with newline characters (`\n`) between each line. The `read()` method is great when you want the whole file at once and the file isn't too large.

You can also pass a number to `read()` to read only that many characters:

```python
file = open("poem.txt", "r")
first_ten = file.read(10)  # Reads the first 10 characters
print(first_ten)            # Output: "Roses are "
file.close()
```

### The Readline Method

The **readline method** reads one line at a time. Each call to `readline()` returns the next line (including the newline character at the end):

```python
file = open("poem.txt", "r")
line1 = file.readline()   # "Roses are red,\n"
line2 = file.readline()   # "Violets are blue,\n"
print(line1.strip())       # "Roses are red,"
print(line2.strip())       # "Violets are blue,"
file.close()
```

The `strip()` method removes the trailing `\n` so your output looks clean. `readline()` is handy when you want to process a file one line at a time, especially if the file is very large and you don't want to load the whole thing into memory.

### The Readlines Method

The **readlines method** reads *all* lines at once and returns them as a *list* of strings:

```python
file = open("poem.txt", "r")
lines = file.readlines()
print(lines)
# ['Roses are red,\n', 'Violets are blue,\n', 'Python is awesome,\n', 'And so are you!\n']
file.close()
```

Each element in the list is one line from the file (newline characters included). This is perfect when you want to loop through lines:

```python
file = open("poem.txt", "r")
lines = file.readlines()
for i, line in enumerate(lines, 1):
    print(f"Line {i}: {line.strip()}")
file.close()
```

Output:

```
Line 1: Roses are red,
Line 2: Violets are blue,
Line 3: Python is awesome,
Line 4: And so are you!
```

Here's a quick comparison of all three reading methods:

| Method | Returns | Best For |
|--------|---------|----------|
| `read()` | One big string | Small files you want as a single chunk |
| `readline()` | One line (string) | Processing line-by-line, especially large files |
| `readlines()` | List of strings | When you need all lines as a list |

#### Diagram: Read Methods Comparison

<iframe src="../../sims/read-methods-comparison/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Read Methods Comparison MicroSim</summary>
Type: microsim
**sim-id:** read-methods-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Understand (L2)
**Bloom Verb:** compare, demonstrate

**Learning Objective:** Students will be able to compare the behavior of `read()`, `readline()`, and `readlines()` and predict the output of each method for a given file.

**Purpose:** An interactive side-by-side demonstration showing how the same file content is processed differently by each of Python's three read methods.

**Layout:**
- Top: A "file" display showing a sample text file with 4 lines of text
- Below: Three columns, one for each method: read(), readline(), readlines()
- Each column shows: the method call, the return type, and the resulting output

**Interactive elements:**
- "Run All" button: Animates all three methods processing the file simultaneously
- "Step" buttons in each column: Step through the method's behavior one operation at a time
- For readline(): Each click of "Step" reads the next line, showing how the file cursor advances
- For readlines(): Shows lines being collected into a list one by one
- "Reset" button: Return to initial state

**Visual elements:**
- The file display highlights which portion of text is being read at each step
- read() column: Shows the entire file content appearing as one string, with \n characters visible
- readline() column: Shows one line appearing at a time, cursor position indicator advancing
- readlines() column: Shows a list growing as each line is appended
- Return type labels: "str", "str", "list[str]" displayed prominently

**Color scheme:**
- File display: light gray background, dark text
- read(): blue highlights
- readline(): green highlights
- readlines(): orange highlights

**Responsive:** Canvas adjusts; columns stack vertically on narrow screens

**Instructional Rationale:** Side-by-side comparison with step-through controls makes the differences between the three methods immediately visible. Highlighting the file content as it is consumed builds a mental model of the file cursor. Showing return types prominently helps students predict how to work with the output.
</details>

## Writing Files

Reading is only half the story. Let's talk about saving data.

### The Write Method

The **write method** takes a string and writes it to a file:

```python
file = open("journal.txt", "w")
file.write("Day 1: Started learning file I/O.\n")
file.write("Day 2: This is actually pretty cool!\n")
file.close()
```

After running this, `journal.txt` will contain:

```
Day 1: Started learning file I/O.
Day 2: This is actually pretty cool!
```

Notice that `write()` does *not* automatically add a newline at the end. You need to include `\n` yourself. This is different from `print()`, which adds a newline by default.

If you open with `"w"` mode, the file gets **completely erased** before writing. If you want to *add* to an existing file instead of replacing it, use `"a"` (append) mode:

```python
file = open("journal.txt", "a")
file.write("Day 3: I can append to files now!\n")
file.close()
```

Now `journal.txt` has three lines instead of being overwritten.

### The Writelines Method

The **writelines method** writes a list of strings to a file -- all at once, no newlines added automatically:

```python
lines = ["Line 1\n", "Line 2\n", "Line 3\n"]
file = open("output.txt", "w")
file.writelines(lines)
file.close()
```

Think of `writelines()` as the mirror image of `readlines()`. One reads a list of lines from a file; the other writes a list of lines to a file. Just remember: you need to include the `\n` characters yourself.

!!! mascot-tip "Monty says: Let's debug this together!"
    ![Monty](../../img/monty-tip.png){ align=left width="80" }
    Here's a common gotcha: forgetting the `\n` in your `write()` and `writelines()` calls. Without it, all your text runs together on one giant line. Always add `\n` at the end of each line when writing to text files!

## The With Statement and Context Managers

Remember how we said you should always close files when you're done? Here's the problem: what if your code crashes *before* it reaches the `close()` call? The file stays open, which can cause all sorts of trouble.

Enter the **with statement** -- Python's elegant solution to this problem:

```python
with open("greeting.txt", "r") as file:
    content = file.read()
    print(content)
# No need to call file.close() -- it happens automatically!
```

The `with` statement creates a block of code where the file is open. The moment the block ends -- whether your code finished normally or crashed with an error -- Python automatically closes the file for you. It's like a safety net that never fails.

The `with` statement works because `open()` returns a **context manager**. A **context manager** is any Python object that knows how to set something up at the start of a `with` block and clean it up at the end. For files, "set up" means opening the file and "clean up" means closing it.

Here's why the `with` statement is *always* better than manual open/close:

| Approach | What Happens on Error | Extra Code Needed |
|----------|----------------------|-------------------|
| Manual `open()` / `close()` | File stays open if error occurs before `close()` | You must remember to call `close()` |
| `with` statement | File is automatically closed, even on errors | None -- Python handles it |

From this point forward, **always use the `with` statement for file operations.** It's shorter, safer, and considered best practice by every Python developer on the planet. Here's the pattern you should memorize:

```python
# Reading a file
with open("input.txt", "r") as file:
    data = file.read()

# Writing a file
with open("output.txt", "w") as file:
    file.write("Hello, files!\n")

# Appending to a file
with open("log.txt", "a") as file:
    file.write("New entry added.\n")
```

#### Diagram: With Statement vs Manual Close

<iframe src="../../sims/with-vs-manual/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>With Statement vs Manual Close MicroSim</summary>
Type: microsim
**sim-id:** with-vs-manual<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Understand (L2)
**Bloom Verb:** compare, explain

**Learning Objective:** Students will be able to explain why the `with` statement is safer than manual `open()`/`close()` by observing what happens when an error occurs during file operations.

**Purpose:** A side-by-side simulation showing two approaches to file handling: manual open/close vs the `with` statement. Students trigger an error scenario and see how each approach responds.

**Layout:**
- Split screen: left side "Manual Open/Close", right side "With Statement"
- Each side shows: Python code (3-5 lines), a file status indicator (open/closed), and an execution log
- Bottom: Control buttons

**Interactive elements:**
- "Run Normal" button: Both sides execute without error, both files close successfully
- "Run With Error" button: An error occurs mid-execution. Left side: file stays open (red warning). Right side: file still closes (green success).
- "Reset" button: Clear the log and reset state
- Hover over code lines to see tooltips explaining what each line does

**Visual elements:**
- File status: A lock/unlock icon that shows whether the file is open (unlocked, yellow) or closed (locked, green) or stuck open (unlocked, red pulsing)
- Code lines highlight as they "execute"
- Error shown as a red flash on the line where it occurs
- Execution log shows timestamped entries: "Opened file", "Reading data...", "ERROR!", "File closed" or "File still open!"

**Color scheme:**
- Normal execution: green highlights
- Error: red highlights
- File open: yellow
- File closed: green
- File stuck open: red pulsing

**Responsive:** Canvas resizes; panels stack vertically on narrow screens

**Instructional Rationale:** Showing the error scenario side-by-side makes the safety advantage of `with` immediately visible. Students can see concretely that manual close fails on errors while the context manager always succeeds. This builds a strong case for always using `with` statements.
</details>

## File Paths

So far, we've been using simple filenames like `"greeting.txt"`. But where does Python actually look for that file? Understanding **file paths** is essential for working with files in real projects.

There are two types of paths:

**Relative paths** are relative to your program's current working directory (usually the folder where your script lives):

```python
# These look in the same folder as your script
with open("data.txt", "r") as file:
    content = file.read()

# This looks in a subfolder called "data"
with open("data/scores.txt", "r") as file:
    content = file.read()
```

**Absolute paths** specify the exact location from the root of your file system:

```python
# Windows absolute path
with open("C:/Users/student/Documents/data.txt", "r") as file:
    content = file.read()

# Mac/Linux absolute path
with open("/home/student/Documents/data.txt", "r") as file:
    content = file.read()
```

Here's a practical tip: use Python's `os.path` module to build paths that work on *any* operating system:

```python
import os

# Build a path that works on Windows, Mac, and Linux
folder = "data"
filename = "scores.txt"
full_path = os.path.join(folder, filename)
# On Windows: "data\\scores.txt"
# On Mac/Linux: "data/scores.txt"

with open(full_path, "r") as file:
    content = file.read()
```

You can also check if a file exists before trying to open it:

```python
import os

if os.path.exists("data.txt"):
    with open("data.txt", "r") as file:
        content = file.read()
else:
    print("File not found!")
```

## Text vs Binary Files

Every file on your computer is either a **text file** or a **binary file**. Understanding the difference is important for choosing the right mode when opening files.

**Text files** contain human-readable characters -- letters, numbers, punctuation, and whitespace. When you open a text file in a text editor, you can read it. Examples include `.txt`, `.py`, `.csv`, `.json`, and `.html` files.

**Binary files** contain raw bytes that don't necessarily represent readable text. They use special formats that only specific programs know how to interpret. Examples include images (`.png`, `.jpg`), audio (`.mp3`), video (`.mp4`), and compiled programs (`.exe`).

| Feature | Text Files | Binary Files |
|---------|-----------|-------------|
| Content | Human-readable characters | Raw bytes |
| Open mode | `"r"`, `"w"`, `"a"` | `"rb"`, `"wb"`, `"ab"` |
| Line endings | Handled automatically | Not processed |
| Examples | `.txt`, `.csv`, `.json`, `.py` | `.png`, `.mp3`, `.pdf`, `.exe` |

When you open a file in text mode (the default), Python automatically handles line ending differences between operating systems. Windows uses `\r\n` for new lines, while Mac and Linux use `\n`. Python smooths this over for you in text mode.

When working with binary files, you add `"b"` to the mode string:

```python
# Reading a binary file (like an image)
with open("photo.png", "rb") as file:
    image_data = file.read()
    print(f"File size: {len(image_data)} bytes")

# Copying a binary file
with open("photo.png", "rb") as source:
    data = source.read()

with open("photo_copy.png", "wb") as destination:
    destination.write(data)
```

For this course, you'll mostly work with text files. But it's good to know that binary mode exists for when you need it.

## Working with CSV Files

A **CSV file** (Comma-Separated Values) is one of the most common file formats for storing tabular data -- think spreadsheets, but as plain text. Each line is a row, and values within each row are separated by commas:

```
name,grade,score
Alice,10,92
Bob,11,87
Charlie,10,95
Diana,12,88
```

You *could* read a CSV file with basic string methods, but Python has a built-in `csv` module that handles tricky edge cases (like commas inside quoted fields) for you:

```python
import csv

with open("students.csv", "r") as file:
    reader = csv.reader(file)
    header = next(reader)  # Read the header row
    print(f"Columns: {header}")

    for row in reader:
        name = row[0]
        grade = row[1]
        score = row[2]
        print(f"{name} (Grade {grade}): {score}")
```

Output:

```
Columns: ['name', 'grade', 'score']
Alice (Grade 10): 92
Bob (Grade 11): 87
Charlie (Grade 10): 95
Diana (Grade 12): 88
```

Writing CSV files is just as easy:

```python
import csv

students = [
    ["name", "grade", "score"],
    ["Alice", "10", "92"],
    ["Bob", "11", "87"],
    ["Charlie", "10", "95"],
]

with open("students.csv", "w", newline="") as file:
    writer = csv.writer(file)
    writer.writerows(students)
```

Notice the `newline=""` argument when writing CSV files. This prevents Python from adding extra blank lines between rows on some operating systems. It's a small detail, but it saves you from a confusing bug.

!!! mascot-thinking "Monty says: You've got this!"
    ![Monty](../../img/monty-thinking.png){ align=left width="80" }
    CSV files are everywhere in the real world -- from school grade exports to scientific datasets to stock market data. If you can read and write CSV files, you can work with data from almost any source. That's a seriously useful skill!

#### Diagram: CSV File Structure

<iframe src="../../sims/csv-file-structure/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>CSV File Structure Interactive Explorer</summary>
Type: infographic
**sim-id:** csv-file-structure<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Understand (L2)
**Bloom Verb:** interpret, explain

**Learning Objective:** Students will be able to interpret the structure of a CSV file by mapping raw comma-separated text to a table representation and back.

**Purpose:** An interactive dual-view display that shows a CSV file's raw text alongside its table representation, with highlighting to show how rows and columns map between the two views.

**Layout:**
- Left panel: Raw CSV text display (monospace font, showing commas and newlines)
- Right panel: Table view (grid with rows and columns, styled like a spreadsheet)
- A sample dataset with 5-6 rows and 3-4 columns

**Interactive elements:**
- Hover over any cell in the table: Highlights the corresponding text in the raw CSV view
- Hover over text in the raw CSV view: Highlights the corresponding cell in the table
- "Add Row" button: Adds a new row to both views simultaneously
- "Toggle Quotes" button: Shows what happens when a field contains a comma (wrapping it in quotes in the raw view)
- "Edit" mode: Click a cell in the table to change its value and see the raw CSV update

**Visual elements:**
- Matching colors: When a cell is highlighted, the same color appears in both the raw and table views
- Header row styled distinctly (bold, different background)
- Commas in the raw view are colored differently (gray) to distinguish them from data
- Newlines shown as visible line breaks with a faint return arrow symbol

**Color scheme:**
- Header: blue background
- Data rows: alternating white and light gray
- Highlighted mapping: yellow background
- Commas: gray text

**Responsive:** Panels stack vertically on narrow screens

**Instructional Rationale:** The dual-view design supports the Understand level by making the mapping between raw text and tabular structure explicit. Hover-to-highlight interaction lets students trace exactly how commas create columns and newlines create rows.
</details>

## Working with JSON Files

If CSV is great for tables, **JSON files** are great for structured, nested data. **JSON** stands for *JavaScript Object Notation*, but don't let the name fool you -- Python loves JSON too.

Here's what JSON looks like:

```json
{
    "name": "Alice",
    "grade": 10,
    "courses": ["Math", "English", "Computer Science"],
    "gpa": 3.8
}
```

Look familiar? It should! JSON looks almost *exactly* like Python dictionaries and lists. That's not a coincidence -- JSON and Python data structures map to each other naturally.

### JSON and Dictionaries

The connection between **JSON and dictionaries** is one of the most useful things you'll learn in this chapter. Here's how JSON types map to Python types:

| JSON Type | Python Type | Example |
|-----------|------------|---------|
| Object `{}` | Dictionary `dict` | `{"name": "Alice"}` |
| Array `[]` | List `list` | `[1, 2, 3]` |
| String `""` | String `str` | `"hello"` |
| Number (int) | Integer `int` | `42` |
| Number (float) | Float `float` | `3.14` |
| `true` / `false` | `True` / `False` | `true` -> `True` |
| `null` | `None` | `null` -> `None` |

Python's built-in `json` module makes converting between JSON files and Python objects effortless:

```python
import json

# Reading JSON from a file
with open("student.json", "r") as file:
    student = json.load(file)

# Now 'student' is a regular Python dictionary!
print(student["name"])      # "Alice"
print(student["grade"])     # 10
print(student["courses"])   # ["Math", "English", "Computer Science"]
```

Writing Python data to a JSON file is just as smooth:

```python
import json

student = {
    "name": "Bob",
    "grade": 11,
    "courses": ["History", "Physics", "Art"],
    "gpa": 3.5
}

with open("student.json", "w") as file:
    json.dump(student, file, indent=4)
```

The `indent=4` argument makes the JSON file nicely formatted with 4 spaces of indentation. Without it, everything gets crammed onto one line -- technically valid, but hard to read.

Here's a more complete example -- a program that loads a list of students, adds a new one, and saves it back:

```python
import json

# Load existing data
with open("class_roster.json", "r") as file:
    roster = json.load(file)

# Add a new student
new_student = {
    "name": "Eve",
    "grade": 10,
    "gpa": 3.9
}
roster.append(new_student)

# Save updated data
with open("class_roster.json", "w") as file:
    json.dump(roster, file, indent=4)

print(f"Roster now has {len(roster)} students.")
```

You can also convert between JSON strings and Python objects without involving files:

```python
import json

# Python dict -> JSON string
data = {"score": 100, "level": 5}
json_string = json.dumps(data)
print(json_string)  # '{"score": 100, "level": 5}'

# JSON string -> Python dict
text = '{"name": "Charlie", "age": 16}'
parsed = json.loads(text)
print(parsed["name"])  # "Charlie"
```

Notice the difference: `json.load()` / `json.dump()` work with *files*, while `json.loads()` / `json.dumps()` work with *strings*. The `s` stands for "string."

#### Diagram: JSON to Dictionary Mapping

<iframe src="../../sims/json-dict-mapping/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>JSON to Dictionary Mapping MicroSim</summary>
Type: microsim
**sim-id:** json-dict-mapping<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Apply (L3)
**Bloom Verb:** convert, demonstrate

**Learning Objective:** Students will be able to convert between JSON text and Python dictionary representations by editing one view and seeing the other update automatically.

**Purpose:** A live dual-editor that shows JSON text on one side and the equivalent Python dictionary on the other, with changes in either view instantly reflected in the other.

**Layout:**
- Left panel: JSON text editor (syntax-highlighted, editable)
- Center: Bidirectional arrow with "json.load()" and "json.dump()" labels
- Right panel: Python dictionary display (syntax-highlighted)
- Bottom: A set of example presets to load

**Interactive elements:**
- Edit JSON text on the left: Python dictionary on the right updates in real-time
- Click any key or value in the Python view: Corresponding element highlights in the JSON view
- "Load Example" dropdown: Presets for student data, game save, settings config, and nested data
- "Validate" button: Checks if the JSON is valid and shows error messages for common mistakes (missing quotes, trailing commas)
- Type mapping legend: Shows JSON type -> Python type mapping

**Visual elements:**
- JSON keys highlighted in blue, strings in green, numbers in orange, booleans in purple
- Python dict uses the same color scheme for easy visual matching
- Invalid JSON: Red underline with error tooltip
- Conversion arrows animate briefly when a change is made

**Color scheme:** Standard code editor colors (dark background, colored syntax)

**Responsive:** Panels stack vertically on narrow screens

**Instructional Rationale:** The dual-editor with live synchronization supports the Apply level by letting students experiment with JSON/dictionary conversions interactively. The validation feature helps students debug common JSON syntax mistakes. Presets provide graduated examples from simple to nested structures.
</details>

## Handling File Exceptions

Files live outside your program -- on a hard drive, a USB stick, maybe even a network server. Lots of things can go wrong: the file might not exist, you might not have permission to open it, or the disk might be full. That's why **file exceptions** are so important.

The most common file-related exception is `FileNotFoundError`:

```python
try:
    with open("missing_file.txt", "r") as file:
        content = file.read()
except FileNotFoundError:
    print("Oops! That file doesn't exist.")
```

Here's a table of common file exceptions and when they occur:

| Exception | When It Happens |
|-----------|----------------|
| `FileNotFoundError` | Trying to read a file that doesn't exist |
| `PermissionError` | No permission to read or write the file |
| `IsADirectoryError` | Trying to open a directory as a file |
| `IOError` | General input/output problem (disk full, etc.) |
| `UnicodeDecodeError` | File contains characters that can't be decoded as text |

A robust file-reading function handles multiple error types:

```python
def safe_read(filename):
    """Read a file safely, handling common errors."""
    try:
        with open(filename, "r") as file:
            return file.read()
    except FileNotFoundError:
        print(f"Error: '{filename}' not found.")
    except PermissionError:
        print(f"Error: No permission to read '{filename}'.")
    except UnicodeDecodeError:
        print(f"Error: '{filename}' contains unreadable characters.")
    return None

content = safe_read("mydata.txt")
if content is not None:
    print(f"Read {len(content)} characters.")
```

Here's a practical example -- a program that keeps a simple log file, creating it if it doesn't exist:

```python
import datetime

def write_log(message):
    """Append a timestamped message to the log file."""
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    try:
        with open("app_log.txt", "a") as log_file:
            log_file.write(f"[{timestamp}] {message}\n")
    except PermissionError:
        print("Warning: Could not write to log file.")

# Using the logger
write_log("Program started")
write_log("Loaded 42 records from database")
write_log("User logged in: Alice")
```

The log file would look like:

```
[2026-02-11 14:30:15] Program started
[2026-02-11 14:30:15] Loaded 42 records from database
[2026-02-11 14:30:15] User logged in: Alice
```

!!! mascot-encourage "Monty says: You've got this!"
    ![Monty](../../img/monty-encourages.png){ align=left width="80" }
    Error handling might feel like extra work, but it's what separates a hobby script from a real program. Professional developers *always* wrap file operations in try-except blocks. You're learning the habits of a pro!

## Putting It All Together: A Complete Example

Let's build something real -- a simple grade tracker that loads student data from a JSON file, lets you add new grades, and saves everything back. This example uses almost everything we've covered in this chapter:

```python
import json
import os
import csv

GRADES_FILE = "grades.json"

def load_grades():
    """Load grades from JSON file, or create empty data if file doesn't exist."""
    if os.path.exists(GRADES_FILE):
        try:
            with open(GRADES_FILE, "r") as file:
                return json.load(file)
        except json.JSONDecodeError:
            print("Warning: Grades file is corrupted. Starting fresh.")
    return {}

def save_grades(grades):
    """Save grades to JSON file."""
    with open(GRADES_FILE, "w") as file:
        json.dump(grades, file, indent=4)
    print("Grades saved!")

def add_grade(grades, student, assignment, score):
    """Add a grade for a student."""
    if student not in grades:
        grades[student] = {}
    grades[student][assignment] = score

def export_to_csv(grades, csv_filename):
    """Export grades to a CSV file."""
    with open(csv_filename, "w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["Student", "Assignment", "Score"])
        for student, assignments in grades.items():
            for assignment, score in assignments.items():
                writer.writerow([student, assignment, score])
    print(f"Exported to {csv_filename}")

# Main program
grades = load_grades()

add_grade(grades, "Alice", "Homework 1", 95)
add_grade(grades, "Alice", "Quiz 1", 88)
add_grade(grades, "Bob", "Homework 1", 92)
add_grade(grades, "Bob", "Quiz 1", 79)

save_grades(grades)
export_to_csv(grades, "grades_report.csv")
```

This little program demonstrates:

- **JSON loading and saving** for persistent data storage
- **CSV export** for sharing data with spreadsheet programs
- **File paths** with `os.path.exists()`
- **Error handling** for corrupted files
- **The `with` statement** for safe file management
- **Dictionaries** mapped to JSON structure

#### Diagram: File Format Decision Tree

<iframe src="../../sims/file-format-decision/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>File Format Decision Tree MicroSim</summary>
Type: microsim
**sim-id:** file-format-decision<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Evaluate (L5)
**Bloom Verb:** choose, justify

**Learning Objective:** Students will be able to choose the appropriate file format (plain text, CSV, or JSON) for a given data storage scenario and justify their choice.

**Purpose:** An interactive decision tree that guides students through questions about their data to recommend the best file format, with explanations for why each format fits certain use cases.

**Layout:**
- Top: A question node with two or three branching answers
- Each answer leads to another question or a recommendation
- Final nodes show the recommended file format with a brief explanation

**Decision tree questions:**
1. "Is your data structured in rows and columns?" -> Yes: go to Q2 / No: go to Q3
2. "Does your data have nested or hierarchical structure?" -> Yes: JSON / No: CSV
3. "Is your data just plain text (like a log or notes)?" -> Yes: Plain text (.txt) / No: go to Q4
4. "Is your data key-value pairs or nested objects?" -> Yes: JSON / No: Plain text

**Interactive elements:**
- Click answers to navigate through the tree
- "Try a Scenario" button: Presents a real-world scenario (game save data, student roster, error log, configuration settings) and lets the student work through the tree
- "Start Over" button: Reset to the first question
- At each final recommendation: A code example showing how to read/write that format

**Visual elements:**
- Tree nodes connected by curved lines
- Current node highlighted with a glow effect
- Previously visited path shown in a lighter color
- Recommendation nodes styled as large cards with the file format name, icon, and explanation

**Color scheme:**
- Question nodes: blue
- Answer branches: gray lines
- CSV recommendation: green
- JSON recommendation: orange
- Plain text recommendation: purple

**Responsive:** Tree reflows for different screen sizes

**Instructional Rationale:** The decision tree approach supports the Evaluate level by requiring students to assess their data characteristics and make a justified choice. Real-world scenarios make the decision process practical rather than theoretical. Showing code examples at the recommendation nodes connects the decision to implementation.
</details>

## Key Takeaways

- **File input output** lets your programs save data that persists between runs -- this is where programs start feeling "real."
- **Opening files** with `open()` gives you a file object for reading or writing. Always close files when done.
- **File modes** control whether you read (`"r"`), write (`"w"`), or append (`"a"`). Be careful with `"w"` -- it erases the file!
- **`read()`** returns the whole file as a string, **`readline()`** returns one line at a time, and **`readlines()`** returns all lines as a list.
- **`write()`** sends a string to the file (no automatic newline), and **`writelines()`** writes a list of strings.
- The **`with` statement** and **context managers** automatically close files for you, even if an error occurs. Always use `with` for file operations.
- **File paths** can be relative (from your script's folder) or absolute (from the root). Use `os.path.join()` for cross-platform compatibility.
- **CSV files** store tabular data with commas between values. Use Python's `csv` module to read and write them.
- **JSON files** store structured, nested data that maps directly to Python dictionaries and lists. Use the `json` module.
- **JSON and dictionaries** are natural partners: `json.load()` reads a file into a dict, and `json.dump()` writes a dict to a file.
- **Text files** contain readable characters; **binary files** contain raw bytes. Add `"b"` to the mode for binary files.
- Always handle **file exceptions** (`FileNotFoundError`, `PermissionError`) with try-except blocks for robust programs.

!!! mascot-celebration "Monty says: You've got this!"
    ![Monty](../../img/monty-celebrates.png){ align=left width="80" }
    You just unlocked a superpower, coder! Your programs can now remember things, share data with other programs, and process real-world files. That's a massive milestone. From simple text files to CSV spreadsheets to JSON data -- you've got the tools to build programs that interact with the real world. Awesome work!

??? question "Check Your Understanding: What's the difference between `'w'` and `'a'` file modes?"
    Opening a file with `"w"` (write) mode **erases all existing content** and starts fresh. Opening with `"a"` (append) mode **keeps the existing content** and adds new data to the end. If you want to add to a log file without destroying previous entries, use `"a"`. If you want to completely replace the file's contents, use `"w"`.

??? question "Check Your Understanding: Why should you use the `with` statement instead of calling `open()` and `close()` manually?"
    The `with` statement **automatically closes the file** when the block ends -- even if an error occurs during your code. With manual `open()`/`close()`, if an error happens before you reach `close()`, the file stays open, which can lead to data loss or locked files. The `with` statement is shorter, safer, and the recommended practice.

??? question "Check Your Understanding: How would you read a JSON file into a Python dictionary?"
    Use the `json` module's `load()` function with a `with` statement:
    ```python
    import json

    with open("data.json", "r") as file:
        my_dict = json.load(file)
    ```
    The `json.load()` function reads the JSON text from the file and converts it into a Python dictionary (or list, depending on the JSON structure). You can then work with `my_dict` just like any other Python dictionary.
