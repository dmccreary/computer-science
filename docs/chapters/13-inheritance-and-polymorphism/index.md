---
title: Inheritance and Polymorphism
description: Class hierarchies, inheritance, polymorphism, duck typing, operator overloading, iterators, and UML diagrams in Python.
generated_by: claude skill chapter-content-generator
date: 2026-02-11
version: 0.04
---

# Inheritance and Polymorphism

## Summary

This chapter extends object-oriented programming with inheritance and polymorphism. Students will learn to create class hierarchies with parent and child classes, use the super() function, override methods, and understand polymorphism and duck typing. The chapter also covers abstract classes, multiple inheritance, operator overloading through dunder methods, iterable and iterator protocols, and UML class diagrams for visualizing object-oriented designs.

## Concepts Covered

This chapter covers the following 25 concepts from the learning graph:

1. Static Methods
2. Composition
3. Has-A Relationship
4. Inheritance
5. Is-A Relationship
6. Parent Class
7. Child Class
8. Super Function
9. Method Overriding
10. Polymorphism
11. Duck Typing
12. Abstract Classes
13. Multiple Inheritance
14. Method Resolution Order
15. Operator Overloading
16. Eq and Lt Methods
17. Add and Mul Methods
18. Iterable Protocol
19. Iterator Protocol
20. Dunder Methods
21. Object Identity
22. Object Comparison
23. Class Hierarchies
24. UML Class Diagrams
25. Design Patterns Intro

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: Python Fundamentals](../02-python-fundamentals/index.md)
- [Chapter 9: Advanced List Operations](../09-advanced-list-operations/index.md)
- [Chapter 12: Classes and Objects](../12-classes-and-objects/index.md)

---

!!! mascot-welcome "Monty says: Let's code this!"
    ![Monty](../../img/monty-welcome.png){ align=left width="80" }
    Welcome back, coders! In the last chapter you learned how to build classes and create objects. Now we're taking OOP to the next level. You'll learn how classes can *inherit* from other classes, how one method call can do different things depending on the object, and even how to make your classes work with `+`, `==`, and `for` loops. This chapter is packed -- let's jump in!

## Building on What You Know: Static Methods and Composition

Before we dive into inheritance, let's tie up two important ideas from the world of classes: static methods and composition.

### Static Methods

A **static method** is a method that belongs to a class but doesn't need access to any instance (`self`) or class (`cls`) data. You mark it with the `@staticmethod` decorator. Think of it as a regular function that lives inside a class because it's logically related to that class.

```python
class MathHelper:
    @staticmethod
    def is_even(number):
        return number % 2 == 0

# No need to create an instance
print(MathHelper.is_even(4))   # True
print(MathHelper.is_even(7))   # False
```

Why put `is_even` inside `MathHelper` instead of leaving it as a standalone function? Organization. When you have a bunch of related utility functions, grouping them in a class keeps your code tidy.

### Composition: The Has-A Relationship

**Composition** means building complex objects by combining simpler ones. When one object *contains* another object as an attribute, that's composition. We describe it as a **has-a relationship**.

For example, a `Car` *has an* `Engine`. A `School` *has a* list of `Student` objects. The outer object doesn't *become* the inner one -- it just *uses* it.

```python
class Engine:
    def __init__(self, horsepower):
        self.horsepower = horsepower

    def start(self):
        return "Vroom! Engine running."

class Car:
    def __init__(self, make, model, horsepower):
        self.make = make
        self.model = model
        self.engine = Engine(horsepower)  # has-a relationship

    def start(self):
        return f"{self.make} {self.model}: {self.engine.start()}"

my_car = Car("Toyota", "Camry", 203)
print(my_car.start())
# Toyota Camry: Vroom! Engine running.
```

The `Car` class doesn't inherit from `Engine`. It *contains* an `Engine`. That's the key difference between "has-a" and "is-a" -- and "is-a" is where inheritance comes in.

## Inheritance: The Is-A Relationship

**Inheritance** is one of the most powerful ideas in object-oriented programming. It lets you create a new class that *inherits* attributes and methods from an existing class. The existing class is called the **parent class** (also known as the base class or superclass), and the new class is the **child class** (also known as the derived class or subclass).

We describe inheritance as an **is-a relationship**. A `Dog` *is an* `Animal`. A `Circle` *is a* `Shape`. A `Student` *is a* `Person`.

Here's the syntax:

```python
class Animal:
    def __init__(self, name, sound):
        self.name = name
        self.sound = sound

    def speak(self):
        return f"{self.name} says {self.sound}!"

    def __str__(self):
        return f"Animal({self.name})"

# Dog inherits from Animal
class Dog(Animal):
    def __init__(self, name):
        super().__init__(name, "Woof")

    def fetch(self):
        return f"{self.name} fetches the ball!"

# Cat inherits from Animal
class Cat(Animal):
    def __init__(self, name):
        super().__init__(name, "Meow")

    def purr(self):
        return f"{self.name} purrs softly."
```

The `Dog` and `Cat` classes automatically get everything `Animal` has -- the `name` attribute, the `sound` attribute, the `speak()` method, and the `__str__()` method. But they can also add their *own* methods like `fetch()` and `purr()`.

```python
rex = Dog("Rex")
whiskers = Cat("Whiskers")

print(rex.speak())       # Rex says Woof!
print(rex.fetch())       # Rex fetches the ball!
print(whiskers.speak())  # Whiskers says Meow!
print(whiskers.purr())   # Whiskers purrs softly.
```

### The Super Function

Notice the **`super()` function** in the child class constructors? That's how a child class calls a method from its parent class. When we write `super().__init__(name, "Woof")`, we're saying "run the parent's `__init__` method and pass it these arguments."

Without `super()`, you'd have to duplicate all the parent's initialization code in every child class. That would be tedious and error-prone. `super()` keeps things DRY (Don't Repeat Yourself).

```python
class Puppy(Dog):
    def __init__(self, name, toy):
        super().__init__(name)  # Calls Dog.__init__, which calls Animal.__init__
        self.favorite_toy = toy

spot = Puppy("Spot", "rubber duck")
print(spot.speak())          # Spot says Woof!
print(spot.favorite_toy)     # rubber duck
```

!!! mascot-thinking "Monty says: You've got this!"
    ![Monty](../../img/monty-thinking.png){ align=left width="80" }
    Think of inheritance like a family tree. A `Puppy` inherits traits from `Dog`, which inherits traits from `Animal`. Each generation can add new features while keeping everything from its ancestors. The `super()` function is like calling your parent and saying, "Hey, do your setup thing first, then I'll add my own stuff."

### Class Hierarchies

When you chain inheritance across multiple levels, you create a **class hierarchy** -- a tree-like structure showing how classes relate to each other. Our `Animal` example already has one:

```
        Animal
       /      \
     Dog      Cat
      |
    Puppy
```

At the top is the most general class. As you move down, classes become more specific. Every class in Python ultimately inherits from a built-in class called `object`, even if you don't write it explicitly.

#### Diagram: Animal Class Hierarchy

<iframe src="../../sims/animal-class-hierarchy/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Animal Class Hierarchy Interactive Diagram</summary>
Type: diagram
**sim-id:** animal-class-hierarchy<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Understand (L2)
**Bloom Verb:** classify, illustrate

**Learning Objective:** Students will be able to trace inheritance relationships in a class hierarchy and identify which attributes and methods each class inherits versus defines on its own.

**Purpose:** An interactive tree diagram showing the Animal class hierarchy. Students can click on any class node to see its attributes, methods, and which ones are inherited versus locally defined.

**Layout:**
- Tree structure with `Animal` at the top
- `Dog` and `Cat` as children
- `Puppy` as a child of `Dog`
- Connecting lines with arrows pointing from child to parent

**Nodes:**
1. `Animal` — attributes: name, sound; methods: `__init__`, `speak`, `__str__`
2. `Dog` — inherited: name, sound, speak, `__str__`; own: `__init__` (overridden), `fetch`
3. `Cat` — inherited: name, sound, speak, `__str__`; own: `__init__` (overridden), `purr`
4. `Puppy` — inherited: name, sound, speak, `__str__`, fetch; own: `__init__` (overridden), favorite_toy

**Interactive elements:**
- Click any class node to highlight it and display a panel showing its attributes/methods
- Inherited items shown in blue; locally defined items shown in green; overridden items shown in orange
- Hover over a method name to see its code snippet
- "Show All" toggle to display all class details simultaneously

**Color scheme:** Animal (gold), Dog (blue), Cat (green), Puppy (purple)
**Responsive:** Tree repositions on window resize

**Instructional Rationale:** Clicking to reveal inherited vs. local members supports the Understand level by helping students trace where each attribute and method originates in the hierarchy.
</details>

## Method Overriding

**Method overriding** happens when a child class defines a method with the same name as one in its parent class. The child's version *replaces* the parent's version for objects of that child type.

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return f"{self.name} makes a sound."

class Dog(Animal):
    def speak(self):  # Overrides Animal.speak()
        return f"{self.name} says Woof!"

class Cat(Animal):
    def speak(self):  # Overrides Animal.speak()
        return f"{self.name} says Meow!"

generic = Animal("Critter")
rex = Dog("Rex")
whiskers = Cat("Whiskers")

print(generic.speak())    # Critter makes a sound.
print(rex.speak())        # Rex says Woof!
print(whiskers.speak())   # Whiskers says Meow!
```

Each class has its own version of `speak()`. When you call `rex.speak()`, Python uses the `Dog` version because `rex` is a `Dog`. This is the foundation of polymorphism.

## Polymorphism: One Interface, Many Forms

**Polymorphism** is a fancy Greek word that means "many forms." In programming, it means that different objects can respond to the *same* method call in *different* ways.

Look at this:

```python
animals = [Dog("Rex"), Cat("Whiskers"), Dog("Buddy"), Cat("Luna")]

for animal in animals:
    print(animal.speak())
```

Output:

```
Rex says Woof!
Whiskers says Meow!
Buddy says Woof!
Luna says Meow!
```

We called `speak()` on every animal in the list, but each one responded differently based on its type. That's polymorphism in action. The calling code doesn't need to know whether it's dealing with a `Dog` or a `Cat` -- it just calls `speak()` and the right thing happens.

This is incredibly powerful for writing flexible, extensible code. You can add a new `Bird` class with its own `speak()` method, drop it into the list, and everything just works -- no changes needed to the loop.

### Duck Typing

Python takes polymorphism even further with a concept called **duck typing**. The idea comes from a famous saying:

> "If it walks like a duck and quacks like a duck, then it must be a duck."

In Python, you don't need inheritance for polymorphism. If an object has the method you're trying to call, Python will happily call it -- regardless of the object's class. Python cares about *what an object can do*, not *what an object is*.

```python
class Dog:
    def speak(self):
        return "Woof!"

class Cat:
    def speak(self):
        return "Meow!"

class RobotPet:
    def speak(self):
        return "Beep boop! I am your pet."

# These classes don't share a parent, but they all have speak()
pets = [Dog(), Cat(), RobotPet()]

for pet in pets:
    print(pet.speak())
```

`RobotPet` has no inheritance relationship with `Dog` or `Cat`. But because it has a `speak()` method, it works perfectly in the loop. That's duck typing.

!!! mascot-tip "Monty says: Let's debug this together!"
    ![Monty](../../img/monty-tip.png){ align=left width="80" }
    Duck typing is one of Python's superpowers. It makes your code flexible because functions can work with *any* object that has the right methods -- not just objects of a specific type. But be careful: if you pass in an object that *doesn't* have the expected method, you'll get an `AttributeError` at runtime. Testing is your friend!

## Abstract Classes

Sometimes you want to define a parent class that *requires* child classes to implement certain methods but doesn't implement them itself. That's what **abstract classes** are for.

An abstract class is like a contract: it says "any class that inherits from me *must* provide these methods." You create abstract classes using Python's `abc` module:

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

    @abstractmethod
    def perimeter(self):
        pass

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14159 * self.radius ** 2

    def perimeter(self):
        return 2 * 3.14159 * self.radius

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)
```

You can't create an instance of `Shape` directly -- it's abstract. But you *can* create `Circle` and `Rectangle` objects because they implement all the required methods.

```python
# This would raise TypeError:
# s = Shape()

c = Circle(5)
r = Rectangle(3, 4)
print(c.area())        # 78.53975
print(r.perimeter())   # 14
```

Abstract classes are great for designing large systems where you want to guarantee that every subclass follows the same interface.

#### Diagram: Shape Hierarchy with Abstract Base Class

<iframe src="../../sims/shape-abstract-hierarchy/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Shape Hierarchy with Abstract Base Class MicroSim</summary>
Type: microsim
**sim-id:** shape-abstract-hierarchy<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Apply (L3)
**Bloom Verb:** implement, demonstrate

**Learning Objective:** Students will be able to identify abstract classes and understand why they cannot be instantiated directly, by interacting with a visual hierarchy that shows which methods are abstract vs. concrete.

**Purpose:** An interactive class hierarchy diagram showing the abstract `Shape` class and its concrete subclasses `Circle`, `Rectangle`, and `Triangle`. Students can click each class to see its methods, try to "instantiate" the abstract class (which shows an error), and calculate areas/perimeters of concrete shapes.

**Layout:**
- `Shape` (ABC) at top, marked with a dashed border to indicate it's abstract
- `Circle`, `Rectangle`, `Triangle` below as children with solid borders
- Each node shows class name and methods list

**Interactive elements:**
- Click any class to see its details panel
- "Create Instance" button on each class: shows error for Shape, creates object for concrete classes
- Input fields to enter dimensions, with live area/perimeter calculations
- Abstract methods shown in italic; concrete methods in regular font

**Color scheme:** Shape (gray, dashed), Circle (blue), Rectangle (green), Triangle (orange)
**Responsive:** Nodes reposition on resize

**Instructional Rationale:** Attempting to instantiate the abstract class and seeing the error makes the concept concrete. Live calculations reinforce method overriding with real values.
</details>

## Multiple Inheritance and Method Resolution Order

Python supports **multiple inheritance**, which means a class can inherit from *more than one* parent class. This is powerful but can get complicated quickly.

```python
class Flyer:
    def move(self):
        return "I fly through the air!"

class Swimmer:
    def move(self):
        return "I swim through the water!"

class Duck(Flyer, Swimmer):
    pass

donald = Duck()
print(donald.move())  # I fly through the air!
```

Wait -- `Duck` inherits from both `Flyer` and `Swimmer`, and both have a `move()` method. Which one wins? Python uses something called the **Method Resolution Order** (MRO) to decide. The MRO follows the order you list the parent classes: `Flyer` comes first, so `Flyer.move()` wins.

You can inspect the MRO with:

```python
print(Duck.__mro__)
# (<class 'Duck'>, <class 'Flyer'>, <class 'Swimmer'>, <class 'object'>)
```

Python searches for methods in this order: first `Duck`, then `Flyer`, then `Swimmer`, then `object`. The first match wins.

!!! mascot-warning "Monty says: Watch out!"
    ![Monty](../../img/monty-warning.png){ align=left width="80" }
    Multiple inheritance can make your code confusing if overused. When two parent classes have methods with the same name, it's not always obvious which one your child class will use. Most Python developers prefer composition (has-a) over multiple inheritance when possible. Use it sparingly and always check the MRO if you're unsure!

## Dunder Methods and Operator Overloading

Remember `__init__` and `__str__` from the last chapter? Those are **dunder methods** (short for "double underscore" methods, also called magic methods or special methods). Python has dozens of them, and they let you customize how your objects behave with built-in operations.

**Operator overloading** means defining what happens when you use operators like `+`, `==`, or `<` with your custom objects. You do this by implementing specific dunder methods.

### Object Identity vs. Object Comparison

Before we overload operators, let's clarify two important concepts.

**Object identity** asks: "Are these the *exact same* object in memory?" You test this with the `is` keyword.

**Object comparison** asks: "Do these objects have the *same value*?" You test this with `==`.

```python
a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(a == b)   # True  -- same value
print(a is b)   # False -- different objects in memory
print(a is c)   # True  -- c points to the same object as a
```

By default, `==` checks identity (same as `is`) for custom classes. But you can override that behavior with `__eq__`.

### The __eq__ and __lt__ Methods

The **`__eq__`** method defines what `==` means for your objects. The **`__lt__`** method defines what `<` means. Together, they let you compare objects in meaningful ways.

```python
class Student:
    def __init__(self, name, gpa):
        self.name = name
        self.gpa = gpa

    def __eq__(self, other):
        return self.name == other.name and self.gpa == other.gpa

    def __lt__(self, other):
        return self.gpa < other.gpa

    def __str__(self):
        return f"{self.name} (GPA: {self.gpa})"

alice = Student("Alice", 3.8)
bob = Student("Bob", 3.5)
alice2 = Student("Alice", 3.8)

print(alice == alice2)  # True  -- same name and GPA
print(alice == bob)     # False
print(bob < alice)      # True  -- Bob's GPA is lower
```

With `__lt__` defined, you can even sort a list of students:

```python
students = [alice, bob, Student("Carol", 3.9)]
students.sort()
for s in students:
    print(s)
# Bob (GPA: 3.5)
# Alice (GPA: 3.8)
# Carol (GPA: 3.9)
```

### The __add__ and __mul__ Methods

The **`__add__`** method defines what `+` does with your objects. The **`__mul__`** method defines `*`. This is **operator overloading** at its finest.

Let's create a `Vector` class that supports math operations:

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __mul__(self, scalar):
        return Vector(self.x * scalar, self.y * scalar)

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __str__(self):
        return f"Vector({self.x}, {self.y})"

v1 = Vector(1, 2)
v2 = Vector(3, 4)

print(v1 + v2)      # Vector(4, 6)
print(v1 * 3)       # Vector(3, 6)
print(v1 == v2)     # False
```

Now `Vector` objects work with `+`, `*`, and `==` just like built-in numbers do. That's the magic of dunder methods.

#### Diagram: Dunder Methods Cheat Sheet

<iframe src="../../sims/dunder-methods-cheatsheet/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Dunder Methods Cheat Sheet Interactive Reference</summary>
Type: infographic
**sim-id:** dunder-methods-cheatsheet<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Remember (L1)
**Bloom Verb:** identify, recall

**Learning Objective:** Students will be able to identify common dunder methods, the operators they map to, and the purpose of each.

**Purpose:** An interactive reference card that maps Python operators and built-in functions to their corresponding dunder methods. Students can hover over an operator to see the dunder method, a code example, and a plain-English explanation.

**Layout:**
- Grid of operator cards arranged in rows
- Categories: Comparison (`==`, `!=`, `<`, `>`, `<=`, `>=`), Arithmetic (`+`, `-`, `*`, `/`, `//`, `%`, `**`), String/Display (`str()`, `repr()`, `len()`), Iteration (`iter()`, `next()`)

**Interactive elements:**
- Hover over any operator card to see: dunder method name, example code, description
- Click a card to "pin" it so students can compare multiple methods side by side
- Search/filter bar at top to find a specific operator or method name

**Color scheme:** Comparison (blue), Arithmetic (green), String/Display (orange), Iteration (purple)
**Responsive:** Grid adjusts columns based on window width

**Instructional Rationale:** A visual quick-reference supports the Remember level and gives students a resource to consult while writing their own dunder methods.
</details>

## The Iterable and Iterator Protocols

Have you ever wondered how `for` loops work in Python? When you write `for item in something`, Python uses two special protocols behind the scenes.

The **iterable protocol** requires an object to have an `__iter__()` method that returns an iterator. Any object you can loop over -- lists, strings, dictionaries, ranges -- is iterable.

The **iterator protocol** requires an object to have a `__next__()` method that returns the next item, and raises `StopIteration` when there are no more items.

Let's build a custom iterable -- a countdown:

```python
class Countdown:
    def __init__(self, start):
        self.start = start

    def __iter__(self):
        self.current = self.start
        return self

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        value = self.current
        self.current -= 1
        return value

for number in Countdown(5):
    print(number, end=" ")
# 5 4 3 2 1
```

Here's what happens step by step:

1. The `for` loop calls `__iter__()` on the `Countdown` object to get an iterator
2. Then it repeatedly calls `__next__()` on the iterator
3. Each call to `__next__()` returns the next number
4. When `__next__()` raises `StopIteration`, the loop ends

This is powerful because it means you can make *any* object work with `for` loops. Your custom classes become first-class citizens of Python.

## UML Class Diagrams

When your class hierarchies start to get complex, you need a way to visualize them. That's where **UML class diagrams** come in. UML stands for Unified Modeling Language, and class diagrams are one of the most common UML diagram types.

A UML class diagram shows:

- **Classes** as rectangles divided into three sections: name, attributes, methods
- **Inheritance** as a solid line with a hollow triangle arrow pointing from child to parent
- **Composition** as a solid line with a filled diamond on the container's end

Here's what our `Animal` hierarchy looks like in UML notation:

```
+------------------+
|     Animal       |
+------------------+
| - name: str      |
| - sound: str     |
+------------------+
| + speak(): str   |
| + __str__(): str |
+------------------+
       /\
      /  \
     /    \
+--------+  +--------+
|  Dog   |  |  Cat   |
+--------+  +--------+
|        |  |        |
+--------+  +--------+
| +fetch |  | +purr  |
+--------+  +--------+
```

In UML notation, a `-` before an attribute means it's private, and a `+` means it's public. Arrows flow from child to parent.

#### Diagram: UML Class Diagram Builder

<iframe src="../../sims/uml-class-diagram-builder/main.html" width="100%" height="600px" scrolling="no"></iframe>

<details markdown="1">
<summary>UML Class Diagram Builder MicroSim</summary>
Type: microsim
**sim-id:** uml-class-diagram-builder<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Apply (L3)
**Bloom Verb:** construct, diagram

**Learning Objective:** Students will be able to read and construct UML class diagrams that show inheritance and composition relationships between classes.

**Purpose:** An interactive UML class diagram viewer and builder. Students can view pre-built diagrams for the chapter's examples (Animal hierarchy, Shape hierarchy, Vector class) and drag-and-drop to build their own simple diagrams.

**Layout:**
- Left panel: Toolbox with draggable class box templates, relationship arrows (inheritance, composition)
- Center: Canvas area where the diagram is built
- Right panel: Properties panel showing details of the selected class
- Top: Dropdown to load pre-built example diagrams

**Pre-built examples:**
1. Animal hierarchy (Animal -> Dog, Cat -> Puppy)
2. Shape hierarchy (Shape ABC -> Circle, Rectangle, Triangle)
3. Car composition (Car has-a Engine)
4. Student comparison (Student with __eq__, __lt__)

**Interactive elements:**
- Drag class boxes from toolbox to canvas
- Click a class box to edit its name, attributes, and methods
- Draw inheritance arrows by clicking from child to parent
- Draw composition arrows by clicking from container to part
- "Load Example" dropdown to see pre-built diagrams
- "Clear Canvas" button to start fresh

**Visual style:**
- UML standard notation: 3-section boxes, hollow triangle for inheritance, filled diamond for composition
- Clean lines, modern font
- Selected elements highlighted with blue border

**Color scheme:** Class boxes (white with light gray header), inheritance arrows (blue), composition arrows (green)
**Responsive:** Canvas and panels adjust to window width

**Instructional Rationale:** Building diagrams by hand (drag-and-drop) supports the Apply level by requiring students to actively construct relationships rather than passively viewing them. Pre-built examples provide scaffolding for learners who need to see correct diagrams first.
</details>

!!! mascot-thinking "Monty says: Let's debug this together!"
    ![Monty](../../img/monty-thinking.png){ align=left width="80" }
    UML diagrams are like blueprints for your code. Professional software developers sketch them out *before* they start coding to plan how classes will connect. Try drawing a UML diagram for a project of your own -- maybe a game with `Player`, `Enemy`, and `Item` classes. It's a great way to organize your thoughts!

## A Complete Example: Putting It All Together

Let's build a mini project that uses almost everything from this chapter. We'll create a music library with songs, playlists, and the ability to sort and iterate.

```python
from abc import ABC, abstractmethod

class MediaItem(ABC):
    """Abstract base class for all media items."""
    @abstractmethod
    def play(self):
        pass

    @abstractmethod
    def duration_str(self):
        pass

class Song(MediaItem):
    def __init__(self, title, artist, duration):
        self.title = title
        self.artist = artist
        self.duration = duration  # in seconds

    def play(self):
        return f"Now playing: {self.title} by {self.artist}"

    def duration_str(self):
        mins = self.duration // 60
        secs = self.duration % 60
        return f"{mins}:{secs:02d}"

    # Operator overloading
    def __eq__(self, other):
        return self.title == other.title and self.artist == other.artist

    def __lt__(self, other):
        return self.title < other.title

    def __add__(self, other):
        """Adding two songs creates a playlist."""
        return Playlist("New Playlist", [self, other])

    def __str__(self):
        return f"{self.title} - {self.artist} ({self.duration_str()})"

class Playlist:
    """A playlist has-a list of songs (composition)."""
    def __init__(self, name, songs=None):
        self.name = name
        self.songs = songs if songs else []

    def add_song(self, song):
        self.songs.append(song)

    # Iterable protocol
    def __iter__(self):
        self._index = 0
        return self

    def __next__(self):
        if self._index >= len(self.songs):
            raise StopIteration
        song = self.songs[self._index]
        self._index += 1
        return song

    def __len__(self):
        return len(self.songs)

    def __str__(self):
        header = f"Playlist: {self.name} ({len(self)} songs)"
        tracks = "\n".join(f"  {i+1}. {s}" for i, s in enumerate(self.songs))
        return f"{header}\n{tracks}"

    @staticmethod
    def merge(playlist1, playlist2, name="Merged"):
        """Static method to merge two playlists."""
        combined = playlist1.songs + playlist2.songs
        return Playlist(name, combined)
```

Now let's use it:

```python
s1 = Song("Bohemian Rhapsody", "Queen", 355)
s2 = Song("Imagine", "John Lennon", 183)
s3 = Song("Billie Jean", "Michael Jackson", 294)

# Operator overloading: + creates a playlist
my_playlist = s1 + s2
my_playlist.add_song(s3)
my_playlist.name = "Classic Hits"

# Iteration protocol: use in a for loop
for song in my_playlist:
    print(song.play())

# Comparison: sort songs alphabetically
my_playlist.songs.sort()
print(my_playlist)
```

Output:

```
Now playing: Bohemian Rhapsody by Queen
Now playing: Imagine by John Lennon
Now playing: Billie Jean by Michael Jackson
Playlist: Classic Hits (3 songs)
  1. Billie Jean - Michael Jackson (4:54)
  2. Bohemian Rhapsody - Queen (5:55)
  3. Imagine - John Lennon (3:03)
```

This example uses inheritance (`Song` extends `MediaItem`), composition (`Playlist` has-a list of `Song` objects), operator overloading (`__eq__`, `__lt__`, `__add__`), the iterator protocol (`__iter__`, `__next__`), a static method (`merge`), and abstract classes (`MediaItem`).

#### Diagram: Music Library Class Diagram

<iframe src="../../sims/music-library-diagram/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Music Library UML Class Diagram MicroSim</summary>
Type: diagram
**sim-id:** music-library-diagram<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Analyze (L4)
**Bloom Verb:** differentiate, organize

**Learning Objective:** Students will be able to analyze a multi-class system and identify inheritance, composition, abstract methods, operator overloading, and the iterator protocol in a UML diagram.

**Purpose:** A UML class diagram showing the complete music library example. Students can click on relationships and methods to see explanations of each OOP concept being used.

**Layout:**
- `MediaItem` (ABC) at top with dashed border
- `Song` below, connected with inheritance arrow
- `Playlist` to the right of `Song`, connected with composition diamond (Playlist has Songs)
- Each class box shows attributes and methods

**Interactive elements:**
- Click any class to highlight it and show a description
- Click an inheritance arrow to see explanation: "Song IS-A MediaItem"
- Click a composition arrow to see explanation: "Playlist HAS-A list of Songs"
- Click any dunder method to see which operator it overloads
- Legend showing arrow types and what they mean

**Color scheme:** MediaItem (gray, dashed), Song (blue), Playlist (green)
**Responsive:** Diagram repositions on window resize

**Instructional Rationale:** Analyzing a realistic multi-class system supports the Analyze level. Clickable annotations help students connect UML notation to the Python concepts they've learned.
</details>

## Design Patterns: A Preview

Now that you understand inheritance, polymorphism, composition, and dunder methods, you're ready for a sneak peek at **design patterns**. A design pattern is a reusable solution to a common problem in software design. Think of them as "recipes" that experienced programmers have tested and perfected over decades.

Here are three patterns you'll encounter as you grow as a programmer:

| Pattern | Idea | Example |
|---------|------|---------|
| **Strategy** | Swap out algorithms at runtime | A game character that can switch between walking, running, and flying movement strategies |
| **Observer** | When one object changes, notify all interested objects | A weather station that updates all display screens when the temperature changes |
| **Factory** | Use a method to create objects instead of calling the constructor directly | A `create_shape("circle", 5)` function that returns the right `Shape` subclass |

You don't need to memorize these now. Just know that the OOP concepts you've learned in this chapter -- inheritance, polymorphism, composition, and abstract classes -- are the building blocks that design patterns are made from.

#### Diagram: Polymorphism Playground

<iframe src="../../sims/polymorphism-playground/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Polymorphism Playground MicroSim</summary>
Type: microsim
**sim-id:** polymorphism-playground<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Bloom Level:** Apply (L3)
**Bloom Verb:** demonstrate, experiment

**Learning Objective:** Students will be able to demonstrate polymorphism by selecting different animal types, calling the same method on each, and observing different behaviors.

**Purpose:** An interactive sandbox where students can create different animal objects (Dog, Cat, Bird, Fish), add them to a list, and call `speak()` and `move()` on all of them to see polymorphism in action. Includes a duck typing section where a `RobotPet` (no inheritance) also responds to the same methods.

**Layout:**
- Left panel: Animal selector with buttons for Dog, Cat, Bird, Fish, RobotPet
- Center: Visual pen/aquarium showing animal icons
- Right panel: Console output showing method call results
- Bottom: "Call speak() on all" and "Call move() on all" buttons

**Interactive elements:**
- Click an animal button to add it to the scene with a name input
- "Call speak() on all" iterates through all animals and displays output
- "Call move() on all" shows each animal's movement style
- "Clear All" button to reset
- Toggle "Show Class Type" to display/hide each animal's class name
- Highlight the RobotPet differently to emphasize duck typing

**Visual style:** Cartoon animal icons that animate when their method is called
**Color scheme:** Each animal type has a distinct color; RobotPet is metallic gray
**Responsive:** Panels stack vertically on narrow screens

**Instructional Rationale:** Creating objects and calling methods on them supports the Apply level. Mixing inheritance-based and duck-typed objects in the same collection makes polymorphism tangible and visual.
</details>

!!! mascot-celebration "Monty says: You've got this!"
    ![Monty](../../img/monty-celebrates.png){ align=left width="80" }
    Wow, you just powered through one of the biggest chapters in this course! You've learned inheritance, polymorphism, duck typing, abstract classes, operator overloading, iterators, and UML diagrams. These are skills that professional developers use every single day. Take a moment to celebrate -- you've earned it!

## Key Takeaways

- **Static methods** belong to a class but don't access instance or class data. Use `@staticmethod`.
- **Composition** (has-a) means one object contains another. **Inheritance** (is-a) means one class extends another.
- A **parent class** provides shared attributes and methods. A **child class** inherits them and can add or change behavior.
- The **`super()` function** calls a method from the parent class, avoiding code duplication.
- **Method overriding** lets a child class replace a parent's method with its own version.
- **Polymorphism** means the same method call produces different behavior depending on the object's type.
- **Duck typing** means Python cares about what methods an object *has*, not what class it *is*.
- **Abstract classes** (using `ABC`) define a contract that child classes must follow.
- **Multiple inheritance** lets a class have multiple parents. The **Method Resolution Order** (MRO) determines which parent's method is used.
- **Dunder methods** like `__eq__`, `__lt__`, `__add__`, and `__mul__` enable **operator overloading** so your objects work with `==`, `<`, `+`, and `*`.
- **Object identity** (`is`) checks if two variables point to the same object. **Object comparison** (`==`) checks if they have the same value.
- The **iterable protocol** (`__iter__`) and **iterator protocol** (`__next__`) let your objects work with `for` loops.
- **UML class diagrams** visualize class relationships: inheritance (hollow triangle), composition (filled diamond).
- **Design patterns** are reusable solutions built on the OOP concepts from this chapter.
- **Class hierarchies** organize classes from general (parent) to specific (child), forming tree-like structures.

??? question "Check Your Understanding: What's the difference between composition and inheritance?"
    **Composition** is a has-a relationship -- one object *contains* another (like a `Car` has an `Engine`). **Inheritance** is an is-a relationship -- one class *extends* another (like a `Dog` is an `Animal`). Use composition when the relationship is about ownership or containment. Use inheritance when the child truly *is a type of* the parent.

??? question "Check Your Understanding: What does duck typing mean in Python?"
    Duck typing means Python doesn't check an object's class to decide if a method call is valid -- it just checks whether the object *has* that method. "If it walks like a duck and quacks like a duck, then it must be a duck." This means objects from completely unrelated classes can be used interchangeably, as long as they have the same methods.

??? question "Check Your Understanding: Why can't you create an instance of an abstract class?"
    An abstract class contains one or more **abstract methods** -- methods that are declared but not implemented. Since the abstract class doesn't provide working code for those methods, creating an instance of it wouldn't make sense (what would happen if you called an unimplemented method?). Python raises a `TypeError` if you try. You must create a *child class* that implements all the abstract methods first.
