# Glossary of Terms

#### Abstract Classes

Classes that define required methods without providing full implementations.

#### Abstraction

The practice of hiding unnecessary detail to focus on the essential structure of a problem or system.

See also: Decomposition, Pattern Recognition

#### Accumulator Pattern

A loop pattern that updates a running total or combined result across iterations.

**Example:** see chapter for usage

#### Add and Mul Methods

The __add__ and __mul__ methods that define + and * behavior for objects.

#### Algorithm Correctness

The property that an algorithm always produces the correct result for valid inputs.

**Example:** see chapter for usage

#### Algorithm Design

The process of creating an algorithm to solve a problem efficiently.

**Example:** see chapter for usage

#### Algorithm Tradeoffs

Balancing factors like speed, memory, and code simplicity when choosing an algorithm.

**Example:** see chapter for usage

#### Algorithm Visualization

Using visual tools or diagrams to illustrate how an algorithm works.

**Example:** see chapter for usage

#### Algorithms

Step-by-step procedures for solving a problem or performing a computation with well-defined inputs, outputs, and termination.

#### And Operator

The logical operator that returns True only when both operands are True.

**Example:** result = a + b

#### Append Method

In Python lists, the append method adds an item to the end.

**Example:** nums.append(10)

#### Args and Kwargs

Conventions for accepting variable positional and keyword arguments in functions.

**Example:** see chapter for usage

#### Arguments

Actual values passed into a function when it is called.

**Example:** see chapter for usage

#### Arithmetic Operators

Symbols that perform basic math operations like addition, subtraction, multiplication, and division.

**Example:** result = a + b

#### ASCII and Unicode

Standards for encoding characters as numbers, with Unicode covering far more symbols and languages than ASCII.

#### Assert Statements

Statements used to verify conditions during testing or debugging.

**Example:** see chapter for usage

#### Assertions

Statements that check assumptions and raise an error if the condition is false.

**Example:** see chapter for usage

#### Augmented Assignment

A core concept in this course that supports understanding and writing Python programs.

**Example:** see chapter for usage

#### Base Case

The terminating condition in a recursive function that does not make another recursive call.

**Example:** see chapter for usage

#### Best Average Worst Case

The range of performance outcomes for an algorithm under different inputs.

**Example:** see chapter for usage

#### Big-O Notation

Notation for describing how algorithm resource use grows with input size.

**Example:** see chapter for usage

See also: Time Complexity, Space Complexity

#### Binary Number System

A base-2 number system that represents values using only 0 and 1, fundamental to digital computation.

#### Binary Search

Searching a sorted list by repeatedly halving the search interval.

**Example:** index = binary_search(sorted_list, target)

Contrast with: Linear Search

#### Bits and Bytes

A bit is a single binary digit, and a byte is a group of eight bits used to represent data.

#### Boolean Conversion

A core concept in this course that supports understanding and writing Python programs.

**Example:** see chapter for usage

#### Boolean Expressions

Expressions that evaluate to True or False.

**Example:** see chapter for usage

#### Boolean Type

A data type that represents boolean values and determines valid operations on them.

**Example:** count = 3  # int

#### Boundary Testing

Testing at the edges of allowed input ranges.

**Example:** assert add(2,3) == 5

#### Break Statement

A Python statement that controls program behavior using the break keyword.

**Example:** if x > 0: ...

#### Breakpoints

Markers that pause program execution in a debugger.

**Example:** see chapter for usage

#### Brute Force Approach

Solving a problem by trying all possibilities without optimization.

**Example:** see chapter for usage

#### Chained Comparisons

A core concept in this course that supports understanding and writing Python programs.

**Example:** see chapter for usage

#### Character Encoding

A mapping from characters to numeric codes so text can be stored and processed by computers.

#### Character Methods

Built-in operations attached to objects that perform a specific task.

**Example:** see chapter for usage

#### Child Class

A class that inherits from a parent class.

#### Class Attributes

Data stored on the class itself and shared by all instances.

#### Class Definition

The code block that declares a class, its attributes, and its methods.

#### Class Hierarchies

The tree-like structure formed by inheritance relationships among classes.

#### Class Instantiation

Creating a new object from a class.

#### Class Methods

Methods that receive the class as the first argument, defined with the @classmethod decorator.

#### Classes

Blueprints for creating objects with shared structure and behavior.

#### Closures

Functions that remember and access variables from their defining scope.

**Example:** see chapter for usage

#### Code Comments

Notes in code that explain intent, reasoning, or usage.

#### Code Organization

Arranging files, functions, and classes for clarity and maintainability.

#### Code Readability

How easy it is for humans to understand code based on naming, structure, and clarity.

**Example:** see chapter for usage

#### Code Review

Systematic examination of code by peers to improve quality.

**Example:** see chapter for usage

#### Code Style

Consistent formatting and conventions that improve readability.

#### Code Tracing

Following code execution manually or with tools to understand program flow.

**Example:** see chapter for usage

#### Collections Module

A Python standard library module that provides specialized container data types.

**Example:** see chapter for usage

#### Comments in Code

Text in source code intended for human readers that the interpreter ignores.

**Example:** see chapter for usage

#### Comparison Operators

Operators that compare two values and return a boolean result.

**Example:** result = a + b

#### Compiled vs Interpreted

A contrast between languages translated ahead of time into machine code and languages executed line-by-line by an interpreter.

#### Composition

A design principle where objects are built from other objects to reuse functionality.

#### Comprehension Patterns

Reusable structures for list, set, and dictionary comprehensions.

**Example:** see chapter for usage

#### Computational Thinking

A problem-solving approach that uses decomposition, pattern recognition, abstraction, and algorithms to create solutions that a computer can execute.

#### Computer Hardware

The physical components of a computer system, such as CPU, memory, storage, and input/output devices.

#### Computer Science

The study of how to represent information, design algorithms, and build software and systems that solve problems efficiently and reliably.

#### Conditional Statements

Statements that execute different blocks of code based on a boolean condition.

**Example:** see chapter for usage

#### Constant Time O(1)

A time complexity where runtime does not grow with input size.

**Example:** see chapter for usage

#### Constants Convention

The practice of using uppercase names for values intended to remain unchanged.

**Example:** see chapter for usage

#### Constructor

A method used to initialize a new object, typically __init__ in Python.

#### Context Manager Protocol

The protocol that defines __enter__ and __exit__ for use with the with statement.

**Example:** see chapter for usage

#### Context Managers

Objects that manage setup and cleanup using the with statement.

**Example:** see chapter for usage

#### Continue Statement

A Python statement that controls program behavior using the continue keyword.

**Example:** if x > 0: ...

#### Control Flow

The order in which statements in a program are executed.

**Example:** see chapter for usage

#### Count Method

In Python lists, the count method counts occurrences of a value.

**Example:** n = nums.count(0)

#### Counter Class

A collections module class for counting hashable items.

**Example:** see chapter for usage

#### Counter Pattern

A loop pattern that increments or decrements a variable to track counts or iterations.

**Example:** see chapter for usage

#### Counting Operations

Estimating time by counting key steps an algorithm performs.

**Example:** see chapter for usage

#### Counting with Dicts

Using a dictionary to count occurrences of items.

**Example:** see chapter for usage

#### CPU and Memory

The CPU executes instructions while memory stores data and instructions needed during execution.

#### CSV Files

A core concept in this course that supports understanding and writing Python programs.

**Example:** with open('data.txt') as f: text = f.read()

#### Custom Exceptions

User-defined exception classes for domain-specific errors.

**Example:** try: x = int(s)
except ValueError: ...

#### Data Types

Classifications of values that determine how they are stored and what operations are valid.

**Example:** see chapter for usage

#### Dataclasses

A decorator-based way to create classes with auto-generated boilerplate methods.

**Example:** see chapter for usage

#### De Morgan's Laws

Logical equivalences that describe how negation distributes over and/or operations.

**Example:** see chapter for usage

#### Debugger Tools

Software tools that allow stepping through code and inspecting variables.

**Example:** see chapter for usage

#### Debugging

The process of finding and fixing defects in code.

**Example:** see chapter for usage

#### Decomposition

Breaking a complex problem into smaller, manageable parts that can be solved independently.

#### Decorators

Functions that wrap other functions to add behavior without modifying their source.

**Example:** see chapter for usage

#### Deep Copy

A copy that duplicates the container and all nested objects it contains.

**Example:** see chapter for usage

#### Default Parameters

A core concept in this course that supports understanding and writing Python programs.

**Example:** see chapter for usage

#### Default Values

Fallback values used when a key is missing in a dictionary.

**Example:** see chapter for usage

#### DefaultDict

A dictionary subclass that supplies default values for missing keys automatically.

**Example:** see chapter for usage

#### Defensive Programming

Writing code that anticipates and safely handles invalid input or conditions.

**Example:** see chapter for usage

#### Design Patterns Intro

An introduction to common reusable solutions to recurring software design problems.

#### Dict vs List Lookup

A comparison showing dictionary lookup is typically faster than searching a list.

**Example:** data = [1, 2, 3]

#### Dictionaries

Unordered collections of key-value pairs used for fast lookup.

**Example:** see chapter for usage

See also: Key-Value Pairs, Hashable Keys

#### Dictionary Access

A dictionary-related concept that describes how to store, access, or manipulate dictionary data in Python.

**Example:** data = [1, 2, 3]

#### Dictionary as Cache

Storing computed results in a dictionary to avoid repeated work.

**Example:** data = [1, 2, 3]

#### Dictionary Comprehension

A concise syntax for building dictionaries from iterables.

**Example:** sq = {x: x*x for x in nums}

#### Dictionary Creation

A dictionary-related concept that describes how to store, access, or manipulate dictionary data in Python.

**Example:** data = [1, 2, 3]

#### Dictionary Iteration

Looping over keys, values, or items in a dictionary.

**Example:** data = [1, 2, 3]

#### Dictionary Merging

Combining two or more dictionaries into one.

**Example:** data = [1, 2, 3]

#### Dictionary Methods

Built-in operations attached to objects that perform a specific task.

**Example:** data = [1, 2, 3]

#### Divide and Conquer

Solving a problem by splitting it into smaller parts, solving each, and combining results.

**Example:** see chapter for usage

#### Docstrings

String literals used to document modules, classes, and functions in Python.

**Example:** see chapter for usage

#### Documentation

Written explanations of how software works and how to use it.

#### DRY Principle

Don't Repeat Yourself, a principle that avoids duplication in code.

#### Duck Typing

A style where an object's suitability is determined by its behavior rather than its type.

#### Dunder Methods

Special methods with double underscores that define built-in behavior.

#### Edge Cases

Unusual or extreme inputs that can reveal bugs.

**Example:** see chapter for usage

#### Efficiency vs Readability

A tradeoff between optimized performance and clear, maintainable code.

**Example:** see chapter for usage

#### Elif Statement

A Python statement that controls program behavior using the elif keyword.

**Example:** if x > 0: ...

#### Empirical Analysis

Measuring performance by running experiments rather than analyzing formulas.

**Example:** see chapter for usage

#### Encapsulation

The practice of bundling data and methods together and restricting direct access to internal state.

See also: Private Attributes, Property Decorator

#### Enum Type

A class that defines a fixed set of named constant values.

**Example:** count = 3  # int

#### Enumerate Function

A built-in function that yields pairs of index and value from an iterable.

**Example:** for i, v in enumerate(items): ...

#### Eq and Lt Methods

The __eq__ and __lt__ methods that define equality and less-than comparisons for objects.

#### Equal and Not Equal

The == and != operators for testing equality or inequality.

**Example:** see chapter for usage

#### Errors and Exceptions

Problems that occur during program execution and the objects used to represent them.

**Example:** try: x = int(s)
except ValueError: ...

#### Escape Characters

A string-related concept that describes how to store, access, or manipulate string data in Python.

**Example:** see chapter for usage

#### Exception Types

Different categories of exceptions that signal specific error conditions.

**Example:** try: x = int(s)
except ValueError: ...

#### Explicit Type Casting

Manual conversion of a value from one type to another using functions like int(), float(), or str().

**Example:** see chapter for usage

#### Expressions

A combination of values, variables, and operators that produces a result when evaluated.

**Example:** see chapter for usage

#### F-String Formatting

A core concept in this course that supports understanding and writing Python programs.

**Example:** see chapter for usage

#### File Exceptions

A core concept in this course that supports understanding and writing Python programs.

**Example:** with open('data.txt') as f: text = f.read()

#### File Input Output

Reading data from files and writing data to files.

**Example:** with open('data.txt') as f: text = f.read()

#### File Modes

A core concept in this course that supports understanding and writing Python programs.

**Example:** with open('data.txt') as f: text = f.read()

#### File Paths

Strings that specify file locations in a file system.

**Example:** with open('data.txt') as f: text = f.read()

#### Filter Function

A function that keeps items from an iterable that satisfy a predicate function.

**Example:** evens = list(filter(lambda x: x%2==0, nums))

#### Finally Block

A block that runs after try/except, whether or not an exception occurred.

**Example:** see chapter for usage

#### Find and Replace Methods

Built-in operations attached to objects that perform a specific task.

**Example:** see chapter for usage

#### Flag Variable Pattern

A loop pattern that uses a boolean variable to remember whether a condition has occurred.

**Example:** see chapter for usage

#### Float Type

A data type that represents float values and determines valid operations on them.

**Example:** count = 3  # int

#### Flowcharts

Diagrams that show the steps and decision points in an algorithm or process.

**Example:** see chapter for usage

#### For Loop

A control structure that repeats a block of code, based on a condition or sequence.

**Example:** for item in items: ...

#### For Loop with Lists

A list-related concept that describes how to store, access, or manipulate list data in Python.

**Example:** data = [1, 2, 3]

#### Format Method

Built-in operations attached to objects that perform a specific task.

**Example:** s.upper()

#### Frequency Counter Pattern

An algorithm pattern that uses a dictionary to count occurrences for efficient comparison.

**Example:** see chapter for usage

#### Frozenset

An immutable version of a set that can be used as a dictionary key or set element.

**Example:** see chapter for usage

#### Function Call

The act of executing a function using its name and arguments.

**Example:** see chapter for usage

#### Function Composition

A core concept in this course that supports understanding and writing Python programs.

**Example:** see chapter for usage

#### Function Definition

The code that specifies a function's name, parameters, and body.

**Example:** see chapter for usage

#### Function Documentation

A core concept in this course that supports understanding and writing Python programs.

**Example:** see chapter for usage

#### Functions

Reusable blocks of code that perform a specific task and can return a value.

**Example:** see chapter for usage

#### Functools Module

A standard library module with higher-order functions and tools for function manipulation.

**Example:** see chapter for usage

#### Generator Expressions

Compact expressions that create generators without storing all results in memory.

**Example:** see chapter for usage

#### Generators

Functions that yield values lazily, producing items one at a time.

**Example:** see chapter for usage

#### Get Method

In Python dictionaries, the get method returns a value for a key with a default.

**Example:** age = d.get("age", 0)

#### Getter Methods

Methods used to access attribute values safely.

#### Git Basics

Core concepts and commands for using Git version control.

#### Global Keyword

A Python keyword used to assign to a global variable inside a function.

**Example:** see chapter for usage

#### Global Variables

A variable-related concept describing how names store or track values during program execution.

**Example:** see chapter for usage

#### Greater and Less Than

The <, <=, >, and >= operators used for ordering comparisons.

**Example:** see chapter for usage

#### Greedy Algorithms

Algorithms that make the locally optimal choice at each step.

**Example:** see chapter for usage

#### Grouping with Dicts

Using a dictionary to group items under shared keys.

**Example:** see chapter for usage

#### Has-A Relationship

An object-oriented relationship where one object contains or uses another.

#### Hashable Keys

Keys that have a stable hash value, required for dictionary key usage.

**Example:** see chapter for usage

#### Helper Functions

A core concept in this course that supports understanding and writing Python programs.

**Example:** see chapter for usage

#### Higher-Order Functions

Functions that take other functions as arguments or return functions as results.

**Example:** see chapter for usage

#### Identity vs Equality

A distinction between two references pointing to the same object (identity) and two objects having the same value (equality).

**Example:** see chapter for usage

#### If Statement

A Python statement that controls program behavior using the if keyword.

**Example:** if x > 0: ...

#### If-Else Statement

A Python statement that controls program behavior using the if-else keyword.

**Example:** if x > 0: ...

#### Implicit Type Conversion

Automatic conversion performed by Python when combining compatible types, such as int to float.

**Example:** see chapter for usage

#### Import Statements

Statements that load modules so their functionality can be used.

#### In Operator for Lists

The in operator used to test whether an item appears in a list.

**Example:** data = [1, 2, 3]

#### In Operator for Strings

The in operator used to test whether a substring appears in a string.

**Example:** see chapter for usage

#### Index Method

In Python lists, the index method returns the position of a value.

**Example:** i = nums.index(42)

#### IndexError

An error-handling concept describing how programs detect, represent, or respond to problems.

**Example:** try: x = int(s)
except ValueError: ...

#### Infinite Loops

Loops that never terminate because their exit condition is never met.

**Example:** for item in items: ...

#### Inheritance

An object-oriented mechanism where a class derives behavior and data from a parent class.

See also: Parent Class, Child Class, Polymorphism

#### Init Method

The special __init__ method that initializes a new object after creation.

#### Input and Output Devices

Hardware used to provide data to a computer or receive results, such as keyboards, sensors, monitors, and printers.

#### Input Function

A built-in function that reads a line of text from the user and returns it as a string.

**Example:** name = input("Name? ")

#### Input Validation

Checking that input data meets expected constraints before processing.

**Example:** see chapter for usage

#### Insert Method

In Python lists, the insert method inserts an item at a specific position.

**Example:** nums.insert(1, 42)

#### Insertion Sort

A sorting algorithm that builds a sorted list by inserting items in order.

**Example:** sorted_list = insertion_sort(data)

#### Instance Attributes

Data stored on individual objects rather than shared across all instances.

#### Instance Methods

Methods that receive the instance as the first parameter and operate on instance data.

#### Integer Division

Division that discards any fractional part, returning an integer result.

**Example:** see chapter for usage

#### Integer Type

A data type that represents integer values and determines valid operations on them.

**Example:** count = 3  # int

#### Is-A Relationship

An object-oriented relationship indicating a subclass is a specialized form of its parent.

#### Items Method

In Python dictionaries, the items method returns key-value pairs.

**Example:** for k, v in d.items(): ...

#### Iterable Protocol

The requirement that an object implement __iter__ or __getitem__ to be iterable.

#### Iterator Protocol

The requirement that an iterator implement __iter__ and __next__.

#### Itertools Module

A standard library module that provides efficient tools for iterator-based looping.

**Example:** see chapter for usage

#### Join Method

In Python strings, the join method concatenates items with a separator and returns a new string.

**Example:** ",".join(words)

#### JSON and Dictionaries

A relationship where JSON objects map naturally to Python dictionaries.

**Example:** see chapter for usage

#### JSON Files

A core concept in this course that supports understanding and writing Python programs.

**Example:** with open('data.txt') as f: text = f.read()

#### Key-Value Pairs

Paired data where a key uniquely identifies a value.

**Example:** see chapter for usage

#### KeyError

An error-handling concept describing how programs detect, represent, or respond to problems.

**Example:** try: x = int(s)
except ValueError: ...

#### Keys Method

In Python dictionaries, the keys method returns a view of keys.

**Example:** for k in d.keys(): ...

#### Keyword Arguments

A core concept in this course that supports understanding and writing Python programs.

**Example:** see chapter for usage

#### KISS Principle

Keep It Simple, a principle that favors simple, clear solutions.

#### Lambda Functions

Small anonymous functions defined with the lambda keyword, typically for short, simple operations.

**Example:** key=lambda x: x[1]

#### Len Function for Lists

A built-in function that returns the number of items in a list.

**Example:** data = [1, 2, 3]

#### Linear Search

Searching for a target by checking items one by one.

**Example:** index = linear_search(data, target)

#### Linear Time O(n)

A time complexity where runtime grows proportionally to input size.

**Example:** see chapter for usage

#### Linearithmic Time

A time complexity of O(n log n), common in efficient sorting algorithms.

**Example:** see chapter for usage

#### Linting Tools

Programs that analyze code for style issues and potential bugs.

#### List Aliasing

When two variables reference the same list object, so changes via one name affect the other.

**Example:** data = [1, 2, 3]

#### List as Queue

Using a list with pop(0) or collections.deque to model first-in, first-out behavior.

**Example:** data = [1, 2, 3]

#### List as Stack

Using a list with append and pop to model last-in, first-out behavior.

**Example:** data = [1, 2, 3]

#### List Comprehension

A concise syntax for creating lists by transforming or filtering items from an iterable.

**Example:** squares = [x*x for x in nums]

#### List Concatenation

A list-related concept that describes how to store, access, or manipulate list data in Python.

**Example:** data = [1, 2, 3]

#### List Copying

A list-related concept that describes how to store, access, or manipulate list data in Python.

**Example:** data = [1, 2, 3]

#### List Creation

A list-related concept that describes how to store, access, or manipulate list data in Python.

**Example:** data = [1, 2, 3]

#### List Indexing

A list-related concept that describes how to store, access, or manipulate list data in Python.

**Example:** data = [1, 2, 3]

#### List Methods

Built-in operations attached to objects that perform a specific task.

**Example:** data = [1, 2, 3]

#### List Mutability

The ability to change list contents in place after creation.

**Example:** data = [1, 2, 3]

#### List of Lists

A list-related concept that describes how to store, access, or manipulate list data in Python.

**Example:** data = [1, 2, 3]

#### List Repetition

A list-related concept that describes how to store, access, or manipulate list data in Python.

**Example:** data = [1, 2, 3]

#### List Slicing

A list-related concept that describes how to store, access, or manipulate list data in Python.

**Example:** data = [1, 2, 3]

#### List Traversal

A list-related concept that describes how to store, access, or manipulate list data in Python.

**Example:** data = [1, 2, 3]

#### List Unpacking

A list-related concept that describes how to store, access, or manipulate list data in Python.

**Example:** data = [1, 2, 3]

#### List vs Generator Memory

A comparison of memory use when building full lists versus generating values lazily.

**Example:** data = [1, 2, 3]

#### Lists

Ordered, mutable collections of items in Python.

**Example:** data = [1, 2, 3]

See also: Tuples, Sets, Dictionaries

#### Local Variables

A variable-related concept describing how names store or track values during program execution.

**Example:** see chapter for usage

#### Logarithmic Time O(log n)

A time complexity where runtime grows slowly as input size increases by factors.

**Example:** see chapter for usage

#### Logic Errors

Bugs where the program runs but produces incorrect results.

**Example:** try: x = int(s)
except ValueError: ...

#### Logical Operators

Operators that combine or negate boolean expressions to form more complex logic.

**Example:** result = a + b

#### Loop Body

A core concept in this course that supports understanding and writing Python programs.

**Example:** see chapter for usage

#### Loop Else Clause

A core concept in this course that supports understanding and writing Python programs.

**Example:** see chapter for usage

#### Loop Invariants

Statements that remain true before and after each loop iteration, used in correctness proofs.

**Example:** see chapter for usage

#### Loop Patterns

Common ways of structuring loops to solve tasks such as counting, searching, or accumulating results.

**Example:** see chapter for usage

#### Loop Variable

A variable-related concept describing how names store or track values during program execution.

**Example:** see chapter for usage

#### Loops

Control structures that repeat a block of code while a condition holds or for a sequence.

**Example:** for item in items: ...

#### Main Function Pattern

A reusable structure for solving a common programming problem in a consistent way.

**Example:** see chapter for usage

#### Manual Testing

Testing by running a program and checking outputs by hand.

**Example:** assert add(2,3) == 5

#### Map Function

A function that applies another function to each item in an iterable.

**Example:** squares = list(map(lambda x: x*x, nums))

#### Match Statement

A Python 3.10+ control structure for pattern-based branching.

**Example:** if x > 0: ...

#### Membership Testing

A set-related concept that describes how to store, access, or manipulate set data in Python.

**Example:** assert add(2,3) == 5

#### Memoization

A technique that caches function results to avoid repeated computation.

**Example:** see chapter for usage

#### Merge Sort

A divide-and-conquer sorting algorithm that merges sorted halves.

**Example:** sorted_list = merge_sort(data)

See also: Divide and Conquer

#### Merge Sort Recursion

An algorithm concept describing a method, comparison, or analysis technique for solving problems.

**Example:** sorted_list = insertion_sort(data)

#### Method Overriding

Replacing a parent class method with a new implementation in a child class.

#### Method Resolution Order

The rule Python uses to decide which parent method to call in multiple inheritance.

#### Methods

Functions defined inside a class that operate on objects or class state.

#### Min Max Sum Functions

Built-in functions that compute the minimum, maximum, and sum of numeric values.

**Example:** see chapter for usage

#### Modular Design

Structuring software as independent, reusable components.

#### Modulo Operator

The % operator that returns the remainder of integer division.

**Example:** result = a + b

#### Multiline Strings

A string-related concept that describes how to store, access, or manipulate string data in Python.

**Example:** see chapter for usage

#### Multiple Assignment

A core concept in this course that supports understanding and writing Python programs.

**Example:** see chapter for usage

#### Multiple Except Blocks

An error-handling concept describing how programs detect, represent, or respond to problems.

**Example:** see chapter for usage

#### Multiple Inheritance

A feature where a class inherits from more than one parent class.

#### Multiple Return Values

A core concept in this course that supports understanding and writing Python programs.

**Example:** see chapter for usage

#### Name Equals Main

The Python pattern if __name__ == '__main__': used to run code only when a file is executed directly.

**Example:** see chapter for usage

#### Named Tuples

Tuple-like objects with named fields for clearer access.

**Example:** see chapter for usage

#### Negative Indexing

A string-related concept that describes how to store, access, or manipulate string data in Python.

**Example:** see chapter for usage

#### Nested Conditionals

A core concept in this course that supports understanding and writing Python programs.

**Example:** see chapter for usage

#### Nested Dictionaries

Dictionaries that store other dictionaries as values.

**Example:** see chapter for usage

#### Nested Lists

Lists that contain other lists as elements.

**Example:** data = [1, 2, 3]

#### Nested Loops

A control structure that repeats a block of code, based on a condition or sequence.

**Example:** for item in items: ...

#### None Type

The special type of the value None, used to represent the absence of a value.

**Example:** count = 3  # int

#### Not Operator

The logical operator that negates a boolean value.

**Example:** result = a + b

#### Object Comparison

Comparing objects for equality or ordering using defined methods or operators.

#### Object Identity

The unique identity of an object in memory, accessible via id().

#### Object-Oriented Programming

A programming paradigm that organizes software around objects that combine data and behavior.

#### Objects

Instances of classes that store state and provide behavior through methods.

#### Opening Files

A core concept in this course that supports understanding and writing Python programs.

**Example:** with open('data.txt') as f: text = f.read()

#### Operating Systems

System software that manages hardware resources and provides services to applications.

#### Operator Overloading

Defining how built-in operators behave for user-defined classes.

#### Operator Precedence

The rules that determine the order in which operations are evaluated in an expression.

**Example:** see chapter for usage

#### Or Operator

The logical operator that returns True when at least one operand is True.

**Example:** result = a + b

#### Order of Operations

A core concept in this course that supports understanding and writing Python programs.

**Example:** see chapter for usage

#### OrderedDict

A dictionary type that remembers insertion order (now the default behavior in modern Python dicts).

**Example:** see chapter for usage

#### Parameters

Named variables in a function definition that receive input values.

**Example:** see chapter for usage

#### Parent Class

A class that provides attributes and methods to a subclass.

#### Pattern Recognition

Identifying similarities or repeated structures in problems to reuse solutions or simplify reasoning.

#### PEP 8 Guidelines

The official Python style guide that recommends formatting and naming conventions.

#### Pip Package Manager

The tool used to install and manage third-party Python packages.

#### Polymorphism

The ability to use different object types through a common interface.

#### Pop Method

In Python lists, the pop method removes and returns an item by index.

**Example:** last = nums.pop()

#### Pop Method for Dicts

A dictionary-related concept that describes how to store, access, or manipulate dictionary data in Python.

**Example:** see chapter for usage

#### Positional Arguments

A core concept in this course that supports understanding and writing Python programs.

**Example:** see chapter for usage

#### Print Debugging

Using print statements to inspect program state.

**Example:** see chapter for usage

#### Print Function

A built-in function that outputs text or values to the console.

**Example:** print("Hello, world!")

#### Private Attributes

Attributes intended for internal use, typically marked with a leading underscore.

#### Problem Solving

The process of analyzing a task, designing a solution, implementing it, and evaluating the results.

#### Program Planning

Identifying requirements and designing a solution before coding.

#### Programming Languages

Formal languages with rules for writing instructions that computers can interpret or compile into machine code.

#### Property Decorator

The @property decorator that turns a method into a managed attribute.

#### Pseudocode

A structured, language-agnostic description of an algorithm.

**Example:** see chapter for usage

#### Python Best Practices

Guidelines for writing clean, reliable, and maintainable Python code.

**Example:** see chapter for usage

#### Python Interpreter

The program that executes Python code by translating it into actions the computer can perform.

#### Python Language

A high-level, interpreted programming language known for readability and a large standard library.

#### Python Modules

Files containing Python code that can be imported.

#### Python Packages

Collections of modules organized in a directory with an __init__.py file.

#### Python REPL

An interactive Python prompt that lets you enter and execute code one line at a time.

**Example:** see chapter for usage

#### Python Scripts

Python programs saved in files and executed by the interpreter.

**Example:** see chapter for usage

#### Quadratic Time O(n^2)

A time complexity where runtime grows with the square of input size.

**Example:** see chapter for usage

#### Raising Exceptions

Using the raise statement to signal an error condition intentionally.

**Example:** try: x = int(s)
except ValueError: ...

#### Range Function

A built-in function that produces a sequence of integers, commonly used in loops.

**Example:** for i in range(5): ...

#### Raw Strings

A string-related concept that describes how to store, access, or manipulate string data in Python.

**Example:** see chapter for usage

#### Read Method

Built-in operations attached to objects that perform a specific task.

**Example:** see chapter for usage

#### Readline Method

Built-in operations attached to objects that perform a specific task.

**Example:** see chapter for usage

#### Readlines Method

Built-in operations attached to objects that perform a specific task.

**Example:** see chapter for usage

#### Recursion

A technique where a function solves a problem by calling itself with a smaller input until a base case is reached.

**Example:** def fact(n): return 1 if n==0 else n*fact(n-1)

See also: Base Case, Recursive Case, Recursive Call Stack

#### Recursion in Algorithms

Using recursion as part of algorithm design, often in divide-and-conquer solutions.

**Example:** def fact(n): return 1 if n==0 else n*fact(n-1)

#### Recursion vs Iteration

A comparison between solving problems with self-calling functions and with loops.

**Example:** def fact(n): return 1 if n==0 else n*fact(n-1)

#### Recursive Call Stack

The sequence of nested function calls created during recursion.

**Example:** see chapter for usage

#### Recursive Case

The part of a recursive function that reduces the problem and calls itself again.

**Example:** see chapter for usage

#### Recursive Patterns

A core concept in this course that supports understanding and writing Python programs.

**Example:** see chapter for usage

#### Reduce Function

A function that combines items into a single value using a binary function.

**Example:** total = reduce(lambda a,b: a+b, nums)

#### Refactoring

Improving code structure without changing its behavior.

#### Regular Expressions

Patterns used to match, search, or replace text.

**Example:** see chapter for usage

#### Remove Method

In Python lists, the remove method removes the first matching item.

**Example:** nums.remove(42)

#### Removing Duplicates

The process of eliminating repeated values, often by converting a list to a set and back.

**Example:** see chapter for usage

#### Repr Method

The __repr__ method that defines an unambiguous string representation for debugging.

#### Requirements Analysis

Determining what a program should do and the constraints it must satisfy.

#### Return Statement

A statement that exits a function and optionally provides a value to the caller.

**Example:** if x > 0: ...

#### Return Values

A core concept in this course that supports understanding and writing Python programs.

**Example:** see chapter for usage

#### Reverse Method

In Python lists, the reverse method reverses the order in place.

**Example:** nums.reverse()

#### Rubber Duck Debugging

Explaining code aloud to clarify logic and expose mistakes.

**Example:** see chapter for usage

#### Runtime Errors

Errors that occur while a program is running.

**Example:** try: x = int(s)
except ValueError: ...

#### Search Comparison

An algorithm concept describing a method, comparison, or analysis technique for solving problems.

**Example:** index = linear_search(data, target)

#### Selection Sort

A sorting algorithm that repeatedly selects the smallest remaining item.

**Example:** sorted_list = insertion_sort(data)

#### Sentinel Value Pattern

A loop pattern that uses a special value to signal when to stop processing input.

**Example:** see chapter for usage

#### Sequential Execution

Running statements one after another in the order they appear.

**Example:** see chapter for usage

#### Set Creation

A set-related concept that describes how to store, access, or manipulate set data in Python.

**Example:** data = [1, 2, 3]

#### Set Difference

A set-related concept that describes how to store, access, or manipulate set data in Python.

**Example:** data = [1, 2, 3]

#### Set Intersection

A set-related concept that describes how to store, access, or manipulate set data in Python.

**Example:** data = [1, 2, 3]

#### Set Methods

Built-in operations for adding, removing, and testing membership in sets.

**Example:** data = [1, 2, 3]

#### Set Operations

Mathematical set operations such as union, intersection, and difference.

**Example:** union = a | b

#### Set Symmetric Difference

A set-related concept that describes how to store, access, or manipulate set data in Python.

**Example:** data = [1, 2, 3]

#### Set Union

A set-related concept that describes how to store, access, or manipulate set data in Python.

**Example:** data = [1, 2, 3]

#### Sets

Unordered collections of unique items in Python.

**Example:** data = [1, 2, 3]

#### Setter Methods

Methods used to modify attribute values with validation.

#### Shallow Copy

A copy that duplicates the container but not the nested objects it references.

**Example:** see chapter for usage

#### Short-Circuit Evaluation

A logic evaluation strategy where the second operand is skipped if the first determines the result.

**Example:** see chapter for usage

#### Slice Notation

A string-related concept that describes how to store, access, or manipulate string data in Python.

**Example:** see chapter for usage

#### Sliding Window Pattern

An algorithm pattern that maintains a moving window over data to compute results efficiently.

**Example:** see chapter for usage

#### Software Development

The process of planning, building, testing, and maintaining software.

#### Sort Method

In Python lists, the sort method reorders items in place.

**Example:** nums.sort()

#### Sorted Function

A built-in function that returns a new sorted list from any iterable.

**Example:** ordered = sorted(scores)

#### Sorting Comparison

An algorithm concept describing a method, comparison, or analysis technique for solving problems.

**Example:** sorted_list = insertion_sort(data)

#### Space Complexity

How the memory usage of an algorithm scales with input size.

**Example:** see chapter for usage

#### Split Method

In Python strings, the split method splits text into a list of parts and returns a new string.

**Example:** parts = s.split(',')

#### Stable vs Unstable Sort

An algorithm concept describing a method, comparison, or analysis technique for solving problems.

**Example:** sorted_list = insertion_sort(data)

#### Stack Overflow

An error that occurs when too many function calls fill the call stack.

**Example:** see chapter for usage

#### Startswith and Endswith

A string-related concept that describes how to store, access, or manipulate string data in Python.

**Example:** see chapter for usage

#### Statements

A core concept in this course that supports understanding and writing Python programs.

**Example:** see chapter for usage

#### Static Methods

Methods that do not use instance or class data, defined with the @staticmethod decorator.

#### Step Through Code

Executing code line by line in a debugger to observe behavior.

**Example:** see chapter for usage

#### Stepwise Refinement

A design technique that starts with a high-level solution and progressively adds detail until it is implementable.

#### Str Method

The __str__ method that defines a readable string representation of an object.

#### String Basics

A string-related concept that describes how to store, access, or manipulate string data in Python.

**Example:** see chapter for usage

#### String Comparison

A string-related concept that describes how to store, access, or manipulate string data in Python.

**Example:** see chapter for usage

#### String Concatenation

A core concept in this course that supports understanding and writing Python programs.

**Example:** see chapter for usage

#### String Formatting

The process of inserting values into text to create readable output.

**Example:** see chapter for usage

#### String Immutability

The property that string values cannot be changed in place; operations create new strings.

**Example:** see chapter for usage

#### String Indexing

A string-related concept that describes how to store, access, or manipulate string data in Python.

**Example:** see chapter for usage

#### String Iteration

A string-related concept that describes how to store, access, or manipulate string data in Python.

**Example:** see chapter for usage

#### String Length

A string-related concept that describes how to store, access, or manipulate string data in Python.

**Example:** see chapter for usage

#### String Methods

Built-in operations attached to string objects for searching, formatting, and transforming text.

**Example:** see chapter for usage

#### String Repetition

A core concept in this course that supports understanding and writing Python programs.

**Example:** see chapter for usage

#### String Reversal

A string-related concept that describes how to store, access, or manipulate string data in Python.

**Example:** see chapter for usage

#### String Slicing

A string-related concept that describes how to store, access, or manipulate string data in Python.

**Example:** see chapter for usage

#### String Type

A data type that represents string values and determines valid operations on them.

**Example:** count = 3  # int

#### String Validation Methods

Built-in operations attached to objects that perform a specific task.

**Example:** see chapter for usage

#### Strip Method

In Python strings, the strip method removes leading and trailing whitespace and returns a new string.

**Example:** clean = s.strip()

#### Super Function

The super() function used to access methods of a parent class.

#### Syntax Errors

Errors caused by invalid Python syntax, detected before code runs.

**Example:** try: x = int(s)
except ValueError: ...

#### Ternary Expression

A combination of values, variables, and operators that produces a result when evaluated.

**Example:** see chapter for usage

#### Test Cases

Specific input and expected output pairs used to validate behavior.

**Example:** assert add(2,3) == 5

#### Test Functions

Functions that contain assertions to verify behavior.

**Example:** assert add(2,3) == 5

#### Test-Driven Development

A development process that writes tests before writing code.

**Example:** Write a failing test, then implement the feature.

#### Testing

The process of verifying that software behaves as expected.

**Example:** assert add(2,3) == 5

#### Text vs Binary Files

A distinction between human-readable text files and raw binary data files.

**Example:** with open('data.txt') as f: text = f.read()

#### The Self Parameter

The first parameter of instance methods that refers to the current object.

#### Time Complexity

How the runtime of an algorithm scales with input size.

**Example:** see chapter for usage

#### Truth Tables

Tables that show all possible input combinations and the resulting boolean output.

**Example:** see chapter for usage

#### Truthiness and Falsiness

The way Python treats non-boolean values as True or False in conditional contexts.

**Example:** see chapter for usage

#### Try-Except Block

A control structure for catching and handling exceptions.

**Example:** try: x = int(s)
except ValueError: ...

#### Tuple Creation

A tuple-related concept that describes how to store, access, or manipulate tuple data in Python.

**Example:** see chapter for usage

#### Tuple Immutability

The property that a tuple's elements cannot be changed after creation.

**Example:** see chapter for usage

#### Tuple Methods

Built-in operations attached to objects that perform a specific task.

**Example:** see chapter for usage

#### Tuple Packing

Creating a tuple by listing values separated by commas.

**Example:** see chapter for usage

#### Tuple Unpacking

Assigning elements of a tuple to multiple variables in a single statement.

**Example:** see chapter for usage

#### Tuples

Ordered, immutable collections of items in Python.

**Example:** see chapter for usage

#### Tuples as Keys

Using tuples as dictionary keys because tuples are hashable when they contain immutable items.

**Example:** see chapter for usage

#### Tuples vs Lists

A comparison between immutable tuples and mutable lists, including typical use cases.

**Example:** data = [1, 2, 3]

#### Two Pointer Technique

An algorithm pattern that uses two indices moving through data to solve problems efficiently.

**Example:** see chapter for usage

#### Type Annotations

Explicit type hints written in code to clarify expected types.

**Example:** see chapter for usage

#### Type Conversion

A core concept in this course that supports understanding and writing Python programs.

**Example:** see chapter for usage

#### Type Function

A built-in function that returns the type of a value or object.

**Example:** result = func(x)

#### Type Hints

Optional annotations that describe expected types of variables and function parameters.

**Example:** see chapter for usage

#### TypeError

An error-handling concept describing how programs detect, represent, or respond to problems.

**Example:** try: x = int(s)
except ValueError: ...

#### UML Class Diagrams

Visual diagrams that show classes, attributes, methods, and relationships.

#### Unit Testing

Testing individual functions or components in isolation.

**Example:** def test_add(): assert add(2,3)==5

#### Unittest Module

Python's built-in unit testing framework.

**Example:** see chapter for usage

#### Unpacking Operators

The * and ** operators used to unpack iterables or dictionaries into arguments or values.

**Example:** result = a + b

#### Update Method

In Python dictionaries, the update method merges in new key-value pairs.

**Example:** d.update({"x": 1})

#### Upper and Lower Methods

Built-in operations attached to objects that perform a specific task.

**Example:** see chapter for usage

#### ValueError

An error-handling concept describing how programs detect, represent, or respond to problems.

**Example:** try: x = int(s)
except ValueError: ...

#### Values Method

In Python dictionaries, the values method returns a view of values.

**Example:** total = sum(d.values())

#### Variable Assignment

The operation of binding a name to a value in memory.

**Example:** see chapter for usage

#### Variable Naming Rules

Conventions and syntactic rules for creating valid and readable variable names in Python.

**Example:** see chapter for usage

#### Variable Scope

The region of a program where a variable name is accessible.

**Example:** see chapter for usage

#### Variables

Named references to values stored in memory that can change during program execution.

**Example:** see chapter for usage

#### Version Control Intro

An introduction to systems that track changes to code over time.

#### Virtual Environments

Isolated Python environments that keep project dependencies separate.

#### Walrus Operator

The := operator that assigns and returns a value within an expression.

**Example:** if (n := len(items)) > 0: ...

#### While Loop

A control structure that repeats a block of code, based on a condition or sequence.

**Example:** for item in items: ...

#### With Statement

A statement that ensures resources are cleaned up, commonly used with files.

**Example:** with open(path) as f: data = f.read()

#### Write Method

Built-in operations attached to objects that perform a specific task.

**Example:** see chapter for usage

#### Writelines Method

Built-in operations attached to objects that perform a specific task.

**Example:** see chapter for usage

#### Yield Statement

The statement that produces a value from a generator and pauses its execution.

**Example:** if x > 0: ...

#### Zip Function

A built-in function that pairs items from multiple iterables into tuples.

**Example:** pairs = list(zip(a, b))
