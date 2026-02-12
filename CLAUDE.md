## MicroSim Canvas Rules

- **Never clamp canvasWidth.** In `updateCanvasSize()`, always use `canvasWidth = mainEl.clientWidth;` with no `min()` or `max()` wrappers. The canvas must match the container width exactly.

---

## Tone and Writing Style

### Target Audience

- **Primary reader:** High school sophomores (10th grade, ~15-16 years old)
- **Assumed background:** Comfortable with basic algebra; no prior programming experience required
- **Reading level:** Write at a 10th-grade level; avoid dense academic prose

### Tone

- **Informal** — Write like a friendly, knowledgeable tutor, not a textbook committee. Use "you" and "we" freely. Contractions are fine.
- **Positive and encouraging** — Assume the student can succeed. Frame challenges as exciting rather than intimidating. ("This is where it gets fun" not "This is a difficult topic.")
- **Playful** — A well-placed pun, joke, or pop-culture reference keeps readers engaged. Coding humor is welcome. ("Why do programmers prefer dark mode? Because light attracts bugs!")
- **Conversational** — Short sentences and short paragraphs. Ask rhetorical questions to keep the reader thinking. ("So what happens when we call the function again? Let's find out.")

### Writing Guidelines

**Do:**

- Use short paragraphs (2-4 sentences)
- Use concrete examples before abstract definitions
- Explain *why* something matters before showing *how* it works
- Use analogies from everyday life (lockers for variables, recipes for algorithms, etc.)
- Include occasional puns or light humor to break up dense material
- Use bold for key terms on first introduction
- Use "you" to address the student directly

**Don't:**

- Use jargon without defining it first
- Write long, complex sentences with multiple clauses
- Assume the reader has seen a concept before unless it was covered in an earlier chapter
- Talk down to the reader — be approachable, not condescending
- Overdo the humor — one or two jokes per section is plenty; the learning comes first

### Example: Good vs. Bad

**Bad (too formal):**
> "A variable is a named storage location in memory that holds a value which may be modified during program execution."

**Good (conversational, concrete):**
> "A **variable** is like a labeled box where you can store a value. You give it a name — like `score` or `player_name` — and Python remembers what's inside. You can change what's in the box whenever you want."

---

## Learning Mascot: Monty the Python

### Character Overview

- **Name**: Monty
- **Species**: Python snake
- **Personality**: Friendly, encouraging, curious, adventurous, playful
- **Catchphrases**: "Let's code this!", "Let's debug this together!", "You've got this!"
- **Visual**: Bright green python with gold/yellow spot accents, wearing a gold coding hoodie, holding a camera

### Mascot Image Assets

Located in `docs/img/`:

| File | Size | Usage |
|------|------|-------|
| `monty.png` | Full size | Source image, documentation |
| `monty-512.png` | 512px | Large displays, hero sections |
| `monty-192.png` | 192px | Medium displays, chapter headers |
| `monty-180.png` | 180px | Default/fallback admonitions |
| `monty-welcome.png` | 180px | `mascot-welcome` admonitions |
| `monty-thinking.png` | 180px | `mascot-thinking` admonitions |
| `monty-tip.png` | 180px | `mascot-tip` admonitions |
| `monty-warning.png` | 180px | `mascot-warning` admonitions |
| `monty-celebrates.png` | 180px | `mascot-celebration` admonitions |
| `monty-encourages.png` | 180px | `mascot-encourage` admonitions |

**Use the matching image for each admonition type.** Each image shows Monty in a pose that matches the admonition context (thinking, giving a tip, warning, celebrating, encouraging).

| Admonition Type | Image File |
|----------------|------------|
| `mascot-welcome` | `monty-welcome.png` |
| `mascot-thinking` | `monty-thinking.png` |
| `mascot-tip` | `monty-tip.png` |
| `mascot-warning` | `monty-warning.png` |
| `mascot-celebration` | `monty-celebrates.png` |
| `mascot-encourage` | `monty-encourages.png` |

Example:

```markdown
!!! mascot-welcome "Monty says: Let's code this!"
    ![Monty](../img/monty-welcome.png){ align=left width="80" }
    Welcome, coders! In this chapter...

!!! mascot-thinking "Monty says: You've got this!"
    ![Monty](../img/monty-thinking.png){ align=left width="80" }
    Here's something interesting to consider...

!!! mascot-tip "Monty says: Let's debug this together!"
    ![Monty](../img/monty-tip.png){ align=left width="80" }
    Here's a handy trick...

!!! mascot-celebration "Monty says: You've got this!"
    ![Monty](../img/monty-celebrates.png){ align=left width="80" }
    Great job finishing this section!
```

### CSS Styling (`docs/css/mascot.css`)

The mascot admonitions are styled in `docs/css/mascot.css`, which is loaded via `mkdocs.yml`.

**Title bar styling:** MkDocs Material admonition titles have large default `padding-left` to reserve space for a built-in SVG icon. Since the mascot admonitions use custom types (e.g. `mascot-welcome`) that don't map to Material's icon set, the CSS includes a global override that:

1. Hides the default `::before` pseudo-element icon (`display: none`)
2. Reduces `padding-left` to `0.8rem` for left-aligned title text
3. Sets `text-align: left`

```css
/* Applied to all mascot-* admonition titles */
.md-typeset [class*="mascot-"] > .admonition-title,
.md-typeset [class*="mascot-"] > summary {
  text-align: left;
  padding-left: 0.8rem;
}
.md-typeset [class*="mascot-"] > .admonition-title::before,
.md-typeset [class*="mascot-"] > summary::before {
  display: none;
}
```

**Per-type colors:** Each mascot admonition type has its own border, background, and title bar color (e.g. green for `mascot-welcome`, gold for `mascot-thinking`, red for `mascot-warning`).

### Voice Characteristics

- Uses simple, encouraging language appropriate for high school students
- Occasionally uses coding puns and Python references
- Refers to students as "coders" or "programmers"
- Signature phrases: "Let's code this!", "Let's debug this together!", "You've got this!"

### Placement Rules

| Context | Admonition Type | Frequency |
|---------|----------------|-----------|
| Chapter opening | mascot-welcome | Every chapter |
| Key concept | mascot-thinking | 2-3 per chapter |
| Helpful tip | mascot-tip | As needed |
| Common mistake | mascot-warning | As needed |
| Section completion | mascot-celebration | End of major sections |
| Difficult content | mascot-encourage | Where students struggle |

### Do's and Don'ts

**Do:**

- Use Monty to introduce new topics warmly
- Rotate catchphrases across chapters (alternate between "Let's code this!", "Let's debug this together!", "You've got this!")
- Keep dialogue brief (1-3 sentences)
- Match the admonition type to the content type

**Don't:**

- Use Monty more than 5-6 times per chapter
- Put mascot admonitions back-to-back
- Use the mascot for purely decorative purposes
- Change Monty's personality or speech patterns
