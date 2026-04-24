# Lemeone-Lab 2.0: Business Gravity Sandbox (Local Edition)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NPM Version](https://img.shields.io/badge/npm-lemeone--lab-blue)](https://www.npmjs.com/package/lemeone-lab)

**Lemeone-Lab 2.0** is a local-first commercial decision support system based on emergent swarm intelligence and 14D vector collisions. It simulates 100,000 logically consistent virtual agents in instantaneous market steps (Epochs) to perform deterministic risk audits on product requirements.

Now optimized for open-source and local execution—no complex cloud setup required.

## 🚀 Core Features

- **14D DNA Model**: Comprehensive modeling of products across 14 dimensions (Core, Monetization, Market Dynamics, Strategy, and Awareness).
- **Zero-Config Execution**: Run instantly via `npx` with local SQLite persistence.
- **Bilingual Interface**: Support for both English and Chinese terminal prompts (toggle via `lang zh`).
- **Gravity vs. Weather**: Structural industry DNA (Gravity) interacts with real-time news perturbations (Weather) via Gemini Search.
- **Interactive Terminal UI**: A high-speed command-line interface for business modeling and audit generation.

## 🛠 Tech Stack

- **Framework**: Next.js 16 (Turbopack)
- **AI**: Google AI SDK (Gemini 3.1 Flash)
- **Database**: SQLite (Local-first)
- **UI**: Xterm.js (Terminal), Vanilla CSS

---

## 🏁 Getting Started

The easiest way to use Lemeone-Lab is via `npx`.

### 1. Prerequisites
- **Node.js** (v20 or higher)
- **Gemini API Key**: Get it from [Google AI Studio](https://aistudio.google.com/).

### 2. Quick Start (via npx)
Simply run:
```bash
export GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
npx lemeone-lab
```
The command will automatically:
1. Initialize a local SQLite database (`lemeone.db`).
2. Start the local server.
3. Open your browser to the lab environment.

### 3. Local Development Setup
If you want to contribute or customize the code:
```bash
git clone https://github.com/phd-inout/lemeone-lab.git
cd lemeone-lab
npm install
npm run dev
```

---

## 📜 Core Commands (In Terminal UI)

- `project new "<name>"`: Create a new project case.
- `scan "<description>"`: Map a requirement to the 14D vector space.
- `lang <en|zh>`: Switch between English and Chinese interface.
- `price <amount>`: Set product pricing.
- `dev`: Advance the simulation by one week (Vector Collision).
- `audit`: Generate a deep strategic audit report.

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Lemeone-Lab** is designed for solopreneurs and product managers to stress-test their business logic before writing a single line of code.
