# Lemeone-Lab 2.0: Business Gravity Sandbox (Scientific Edition)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NPM Version](https://img.shields.io/badge/npm-lemeone--lab-blue)](https://www.npmjs.com/package/lemeone-lab)

**Lemeone-Lab 2.0** is a local-first commercial decision support system based on emergent swarm intelligence and 14D vector collisions. It simulates 100,000 logically consistent virtual agents in high-fidelity market steps to perform deterministic risk audits on business logic.

Optimized for professional product managers and strategic researchers.

## 🚀 Core Features

- **Scientific TechDebt Model**: Dynamic debt accumulation based on industry-specific entropy ($\lambda$), product core complexity, and team coordination tax.
- **14-Dimensional DNA Model**: Comprehensive modeling of products across 14 dimensions (Core Architecture, Monetization, Market Dynamics, Strategy, and GTM Awareness).
- **Monthly Simulation Cycle**: The `dev` command now defaults to a 1-month market progression (4 Epochs), providing higher-fidelity growth and churn visualization.
- **HUD-Style HUD Interface**: A redesigned, cyberpunk-inspired laboratory dashboard with real-time telemetry (MRR, Tech Debt, Survival Rate) and a 14D DNA side-radar.
- **Protocol Documentation**: A fully integrated Knowledge Base (Reference Repository) explaining the underlying physics and mathematical constants of the simulation.
- **Gravity vs. Weather**: Structural industry DNA (Gravity) interacts with real-time news perturbations (Weather) via Gemini Search.

## 🛠 Tech Stack

- **Framework**: Next.js 16 (Turbopack)
- **AI Engine**: Google AI SDK (Gemini 3.1 Flash)
- **Mathematical Core**: @lemeone/drta-engine (Dual-Track Resonance Transformation Algorithm)
- **Database**: SQLite (Local-first persistence)
- **UI**: Xterm.js (Terminal), Lucide Icons, Cyberpunk CRT Effects

---

## 🏁 Getting Started

### 1. Prerequisites
- **Node.js**: v20 or higher.
- **Gemini API Key**: Essential for Cortex AI features. [Get it for free here](https://aistudio.google.com/).

### 2. Local Setup (Recommended)
Clone the repository and initialize the sandbox environment locally:

```bash
# 1. Clone & Enter
git clone https://github.com/phd-inout/lemeone-lab.git
cd lemeone-lab

# 2. Install dependencies
npm install

# 3. Set Environment Variable
export GOOGLE_GENERATIVE_AI_API_KEY="your_api_key_here"
# OR: create a .env file in the root:
# GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here

# 4. Initialize local database
npx prisma db push

# 5. Launch Simulation
npm run dev
```

### 3. Quick Run (via npx)
If you just want to take a quick peek (requires the package to be published to npm):
```bash
export GOOGLE_GENERATIVE_AI_API_KEY="your_key"
npx lemeone-lab
```

---

## 🔬 Validation Benchmarks

Lemeone-Lab's DRTA engine has been cross-validated against historical market data to ensure mathematical consistency.

| Case Study | Validation Goal | Simulation (Conv. Rate) | Ground Truth |
| :--- | :--- | :--- | :--- |
| **Slack (2014)** | High Monetization in B2B PLG | **30.2%** | ✅ Exact Match (~30%) |
| **GitHub (2011)** | Freemium Conversion for DevTools | **4.2%** | ✅ Match (3% - 5%) |
| **Zoom (2013)** | Zero-Friction B2B Conversion | **4.8%** | ✅ Match (4% - 5%) |
| **Discord (2015)** | High-Engagement / Low-Revenue | **1.6%** | ✅ Match (~1.5%) |
| **Notion (2018)** | Community-Driven Vertical Growth | **7.5%** | ✅ Match (5% - 10%) |
| **Quibi (2020)** | PMF Misalignment Risk | **Fast Churn / Bankruptcy** | ✅ Predicted Failure |

---

## 📜 Terminal Command Reference

| Command | Action | Impact |
| :--- | :--- | :--- |
| `project new "Name"` | Create a new case file | Locks industry baseline |
| `scan "PRD text"` | Cortex 14D DNA Mapping | Defines the product vector |
| `dev` | **Advance 1 Month** (4 Epochs) | Massive vector collision step |
| `dev [num]` | Advance specific weeks | Granular simulation control |
| `stat` | View 14D Radar & Metrics | Real-time state diagnosis |
| `feature "desc"` | Natural Language Injection | Adds feature + dynamic TechDebt |
| `price [val]` | Set ARPU / Hardware price | Influences MRR & conversion |
| `audit` | Generate Strategic Report | AI Deep-dive analysis |
| `reset` | System wipe | Clears all simulation memory |

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Lemeone-Lab** is designed to stress-test business logic before writing a single line of code. Built for the era of AI-native software engineering.
