# Computer Science

[![MkDocs](https://img.shields.io/badge/Made%20with-MkDocs-526CFE?logo=materialformkdocs)](https://www.mkdocs.org/)
[![Material for MkDocs](https://img.shields.io/badge/Material%20for%20MkDocs-526CFE?logo=materialformkdocs)](https://squidfunk.github.io/mkdocs-material/)
[![GitHub Pages](https://img.shields.io/badge/View%20on-GitHub%20Pages-blue?logo=github)](https://dmccreary.github.io/computer-science/)
[![GitHub](https://img.shields.io/badge/GitHub-dmccreary%2Fcomputer--science-blue?logo=github)](https://github.com/dmccreary/computer-science)
[![Claude Code](https://img.shields.io/badge/Built%20with-Claude%20Code-DA7857?logo=anthropic)](https://claude.ai/code)
[![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![p5.js](https://img.shields.io/badge/p5.js-ED225D?logo=p5.js&logoColor=white)](https://p5js.org/)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

## View the Live Site

Visit the interactive textbook at: [https://dmccreary.github.io/computer-science/](https://dmccreary.github.io/computer-science/)

## Overview

This repository contains an interactive, AI-assisted textbook for AP Computer Science using Python. The site is built with MkDocs Material and combines chapter content, concept dependency maps, and hands-on MicroSims to support high school and early college learners.

The project follows a structured learning-graph approach with 400 mapped concepts, chapter-level progression, and visual simulations (primarily p5.js) to make abstract computing ideas concrete. It is designed for both independent learners and instructors looking for a modern Python-first alternative to Java-centric AP CS content.

## Site Status and Metrics

| Metric | Count |
|---|---:|
| Concepts in Learning Graph | 400 |
| Course Description Quality Score | 100/100 |
| Chapters | 20 |
| Markdown Files (`docs/`) | 54 |
| Total Words (`docs/*.md`) | 147,555 |
| Code Blocks | 627 |
| List Items | 3,639 |
| Table Rows | 813 |
| MicroSims | 17 |
| Quiz Files | 0 |
| Quiz Questions | 0 |
| Glossary Terms | 400 |
| FAQ Questions | 0 |
| References Listed | 0 |
| Images (`png/jpg/svg/gif/webp`) | 13 |
| Mermaid Diagrams | 0 |

**Completion Status:** Core textbook and learning graph are substantial; FAQ, references, and quiz coverage are not yet present in `docs/`.

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/dmccreary/computer-science.git
cd computer-science
```

### Install Dependencies

```bash
pip install mkdocs mkdocs-material mkdocs-glightbox
```

### Build the Site

```bash
mkdocs build
```

### Serve Locally

```bash
mkdocs serve
```

Open your browser to `http://localhost:8000`.

### Deploy to GitHub Pages

```bash
mkdocs gh-deploy
```

## Repository Structure

```text
computer-science/
├── docs/                              # MkDocs source content
│   ├── chapters/                      # 20 chapter directories
│   │   ├── 01-intro-to-computer-science/
│   │   └── ...
│   ├── sims/                          # Interactive MicroSims (p5.js-based)
│   │   ├── ascii-character-map/
│   │   ├── binary-number-explorer/
│   │   └── ...
│   ├── learning-graph/                # Concept graph data and analysis reports
│   │   ├── learning-graph.csv
│   │   ├── learning-graph.json
│   │   └── quality-metrics.md
│   ├── glossary.md                    # Course glossary
│   ├── course-description.md          # Course scope and outcomes
│   ├── license.md                     # License details
│   └── contact.md                     # Contact information
├── mkdocs.yml                         # Site configuration and navigation
├── plugins/                           # Local MkDocs plugin code
├── site/                              # Generated static site output
└── README.md                          # Repository overview
```

## Reporting Issues

Found a bug, typo, or suggestion? Please open an issue:

[GitHub Issues](https://github.com/dmccreary/computer-science/issues)

When reporting issues, include:

- A clear description of the issue
- Steps to reproduce (for bugs)
- Expected behavior vs. actual behavior
- Screenshots (if relevant)
- Browser/device details (for MicroSim issues)

## License

This work is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/).

- Attribution required
- Non-commercial use only
- Share-alike for derivative works

See [docs/license.md](docs/license.md) for full terms.

## Acknowledgements

This project builds on the open-source ecosystem, especially:

- [MkDocs](https://www.mkdocs.org/)
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)
- [p5.js](https://p5js.org/)
- [Python](https://www.python.org/)
- [GitHub Pages](https://pages.github.com/)
- [Claude Code](https://claude.ai/code)

## Contact

**Dan McCreary**

- LinkedIn: [linkedin.com/in/danmccreary](https://www.linkedin.com/in/danmccreary/)
- GitHub: [@dmccreary](https://github.com/dmccreary)

Questions or collaboration ideas are welcome via LinkedIn or GitHub Issues.

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a branch (`git checkout -b feature/your-change`).
3. Commit your changes.
4. Push your branch.
5. Open a pull request.
