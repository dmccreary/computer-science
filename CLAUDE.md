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
| `monty-180.png` | 180px | Admonitions, inline usage |

When using Monty in admonitions, reference the 180px image:

```markdown
!!! mascot-welcome "Monty says: Let's code this!"
    ![Monty](../img/monty-180.png){ align=left width="80" }
    Welcome, coders! In this chapter...
```

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
