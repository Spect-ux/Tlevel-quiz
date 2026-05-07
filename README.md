# T Level Digital — Exam Quiz v2.0 🎓

AI-powered exam practice for **T Level Digital Software Development (Level 3)** — full spec coverage, Core Papers 1 & 2.

Built by **Spect** with **Claude** (Anthropic).

---

## 🆓 Free Mode (no cost, no sign-up)

1. Pick your topics and question count
2. Click **Start Quiz** — a prompt is generated
3. Copy the prompt → paste into [claude.ai](https://claude.ai) (free account)
4. Copy the JSON Claude returns → paste back into the site
5. Quiz loads instantly

For marking: after you answer, a marking prompt is shown. Paste it into Claude.ai to get feedback on your answer.

---

## ⚡ API Mode (optional)

If you have an Anthropic API key, enable API mode for automatic question generation and instant AI marking. Each session costs ~£0.01–0.05.

Your key is stored in **your browser's localStorage only** — it is never in the source code and will never end up on GitHub.

---

## Topics Covered

### Core Paper 1
- Computational Thinking (1.1)
- Algorithmic Design (1.2)
- Problem Solving Strategies (1.3)
- Data Types, Variables & Structures (2.1–2.3)
- Operators & Expressions (2.4)
- Input, Output, Actions & Functions (2.5–2.6)
- Validation & Robust Code (2.8 & 2.10)
- Common Algorithms — search & sort (2.11)
- Testing (2.12)
- Emerging Technologies & Impact (3.1–3.2)
- Legislation & Regulatory Requirements (4.1)
- Codes of Conduct & Standards (4.2)

### Core Paper 2
- Business Context (5.1)
- Risk & Change Management (5.3–5.4)
- Data, Information & Knowledge (6.1–6.3)
- Data Formats & Structures (6.5–6.6)
- Data Systems & Databases (6.8 & 6.10)
- Data Visualisation & APIs (6.9 & 6.11)
- Hardware & Digital Environments (7.1)
- Software & Operating Systems (7.2)
- Networks (7.3)
- Cloud & Virtualisation (7.4–7.5)
- Security (8.1 & 8.4)

---

## Setup & Deployment

### Run locally
```bash
# Clone and serve (ES modules need a server — not file://)
git clone https://github.com/YOUR-USERNAME/tlevel-quiz.git
cd tlevel-quiz
python -m http.server 8080
# Then open http://localhost:8080
```

### GitHub Pages
1. Push to GitHub
2. Settings → Pages → Source: `main` branch, root `/`
3. Live at `https://YOUR-USERNAME.github.io/tlevel-quiz`

No build step. No dependencies. Just HTML, CSS and vanilla JS modules.

---

## Project Structure
```
tlevel-quiz/
├── index.html        # Landing page
├── quiz.html         # Quiz interface
├── css/style.css     # All styles
├── js/
│   ├── app.js        # Quiz logic
│   ├── topics.js     # Full spec topic list
│   └── config.js     # API key (localStorage only)
├── .gitignore
└── README.md
```

---

## Credits
- Pearson T Level Digital Software Development Specification v1.0 (May 2025)
- AI by [Claude](https://anthropic.com) (Anthropic) — `claude-sonnet-4-20250514`
- Built by **Spect** & **Claude**

## Disclaimer
Unofficial revision tool. Always refer to the official Pearson specification and your teacher's guidance.
