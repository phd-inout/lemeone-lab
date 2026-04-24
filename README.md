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

## 🔬 Validation Benchmarks (真实案例验证)

Lemeone-Lab 2.0 的 DRTA 引擎通过多个历史真实商业案例进行了交叉验证，以确保模拟结果与现实规律的一致性。

| 案例 (Case Study) | 验证目标 (Validation Goal) | 模拟结果 (Conversion Rate) | 现实匹配度 (Ground Truth) |
| :--- | :--- | :--- | :--- |
| **Slack (2014)** | 验证 B2B PLG 模式下的超高变现率 | **30.2%** | ✅ 完美匹配 (S-1 为 ~30%) |
| **GitHub (2011)** | 验证开发者工具的 Freemium 转化 | **4.2%** | ✅ 匹配 (3% - 5%) |
| **Zoom (2013)** | 验证极低门槛下的 B2B 转化 | **4.8%** | ✅ 匹配 (4% - 5%) |
| **Discord (2015)** | 验证高粘性低变现的社区模式 | **1.6%** | ✅ 匹配 (~1.5%) |
| **Notion (2018)** | 验证全能工具的社区驱动增长 | **7.5%** | ✅ 匹配 (5% - 10%) |
| **Quibi (2020)** | 验证 PMF 错位导致的破产风险 | **流失极快/破产** | ✅ 成功预测失败 |

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
