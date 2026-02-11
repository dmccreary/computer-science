# Mascot Style Guide Session Log

**Skill**: book-installer (learning-mascot)
**Date**: 2026-02-11
**Course**: AP Computer Science (Python Version)
**Author**: Dan McCreary

## Session Summary

Generated a complete learning mascot (pedagogical agent) setup for the Computer Science intelligent textbook using the book-installer skill's mascot guide workflow.

## Design Decisions

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| Character type | Python snake | Directly tied to the Python language; memorable and on-brand |
| Personality tone | Friendly, encouraging, curious, adventurous, playful | Blend of warmth and fun appropriate for high school students |
| Name | Monty | Nod to Monty Python, the comedy troupe Python was named after |
| Catchphrases | "Let's code this!", "Let's debug this together!", "You've got this!" | Three phrases to alternate across chapters |
| Colors | Bright green with gold accents | Classic snake colors; gold coding hoodie and headphones |
| Art style | Friendly cartoon | Rounded shapes, expressive features; approachable for teens |
| Implementation | CSS Admonitions (Option 2) | Consistent styling, easy for authors, no JavaScript required |

## Character Profile

- **Name**: Monty the Python
- **Species**: Python snake
- **Appearance**: Bright green python with gold accents, gold coding hoodie, headphones around neck
- **Personality**: Friendly, encouraging, curious, adventurous, playful
- **Catchphrases**: "Let's code this!", "Let's debug this together!", "You've got this!"
- **Voice**: Simple encouraging language, occasional coding puns, refers to students as "coders" or "programmers"

## Files Created

| File | Purpose |
|------|---------|
| `docs/css/mascot.css` | 6 custom admonition styles (welcome, thinking, tip, warning, celebration, encourage) with mascot icon slots and color theming |
| `docs/learning-graph/mascot-guide.md` | Full mascot guide with character profile, all 6 AI image generation prompts, usage examples, and placement rules |
| `docs/img/mascot/` | Empty directory ready for generated mascot images |
| `CLAUDE.md` | Project-level character guidelines for consistent AI-generated mascot content |

## Files Modified

| File | Change |
|------|--------|
| `mkdocs.yml` | Added `css/mascot.css` to `extra_css`; added `Mascot Guide: learning-graph/mascot-guide.md` to Learning Graph nav section |

## Admonition Types Created

| Type | CSS Class | Border Color | Background | Use Case |
|------|-----------|-------------|------------|----------|
| Welcome | `mascot-welcome` | `#2e7d32` (green) | `#e8f5e9` (light green) | Chapter openings |
| Thinking | `mascot-thinking` | `#f9a825` (gold) | `#fff8e1` (light gold) | Key concepts |
| Tip | `mascot-tip` | `#66bb6a` (light green) | `#e8f5e9` | Tips and hints |
| Warning | `mascot-warning` | `#ef5350` (red) | `#ffebee` (light red) | Common mistakes |
| Celebration | `mascot-celebration` | `#ab47bc` (purple) | `#f3e5f5` (light purple) | Achievements |
| Encourage | `mascot-encourage` | `#29b6f6` (blue) | `#e1f5fe` (light blue) | Difficult sections |

## AI Image Prompts

Six pose-variant prompts were generated in `docs/learning-graph/mascot-guide.md`:

1. **Welcome** (`welcome.png`) - Waving with tail tip, warm welcoming expression
2. **Thinking** (`thinking.png`) - Tail on chin, looking upward, lightbulb above head
3. **Tip** (`tip.png`) - Pointing upward with tail, star sparkle nearby
4. **Warning** (`warning.png`) - Tail in "stop" gesture, concerned expression, caution symbol
5. **Celebration** (`celebration.png`) - Joyful spiral, tail raised, confetti and stars
6. **Encouraging** (`encouraging.png`) - Tail thumbs-up, reassuring smile

All prompts share a consistent base description for visual coherence across poses.

## Placement Guidelines (from CLAUDE.md)

- Monty appears no more than 5-6 times per chapter
- No back-to-back mascot admonitions
- Catchphrases rotate across chapters
- Dialogue kept to 1-3 sentences

## Pending Steps

- [ ] Generate 6 mascot images using AI image generator (ChatGPT/DALL-E, Midjourney, etc.)
- [ ] Save images to `docs/img/mascot/` as `welcome.png`, `thinking.png`, `tip.png`, `warning.png`, `celebration.png`, `encouraging.png`
- [ ] Verify rendering with `mkdocs serve`
- [ ] Begin adding mascot admonitions to chapter content

## Prerequisites Already Met

- MkDocs Material project: yes
- `admonition` extension: yes (in mkdocs.yml)
- `attr_list` extension: yes (in mkdocs.yml)
- `pymdownx.details` extension: yes (in mkdocs.yml)
- `pymdownx.superfences` extension: yes (in mkdocs.yml)
