# LemeoneLab 2.0: Business Gravity Sandbox (Strategic Swarm Edition)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NPM Version](https://img.shields.io/badge/npm-lemeone--sandbox-blue)](https://www.npmjs.com/package/lemeone-sandbox)

**LemeoneLab 2.0** is an industrial-grade commercial decision support system powered by the **DRTA Swarm 2.5** collision engine. By simulating a market of **10,000 to 100,000 micro-agents** across a 14-Dimensional DNA vector space, it performs deterministic risk audits on business logic across all major interfaces.

---

## 🏁 Getting Started & Runtimes

LemeoneLab 2.0 operates identically across all three runtimes, ensuring 100% mathematical consistency.

### Option A: Web Dashboard (Full Visualization)
Best for visualizing 14D manifolds, active cohorts, and utilizing the browser sandbox terminal.
```bash
git clone https://github.com/phd-inout/lemeonelab.git
cd lemeonelab && npm install
npx prisma db push
export GOOGLE_GENERATIVE_AI_API_KEY="your_key"
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

### Option B: Strategic CLI & Skill
Inject strategic thinking skills directly into your terminal.
```bash
# Install the skill to your global library:
npx -y --package=lemeone-sandbox lemeone-skill

# Activate inside your terminal shell:
activate_skill business-intelligence
```

---

### Option C: MCP Server (Strategic AI Editor Integration)
Compatible with **Claude Code**, **Cursor**, **Windsurf**, and **Zed**. Directs Gemini-backed codebase auditing into your AI assistant.

> [!IMPORTANT]
> **CRITICAL NPX SYNTAX WARNING (解决参数错配问题)**
> Do **NOT** use `npx -y lemeone-sandbox lemeone-mcp` in your editor config!
> 
> Due to NPX parameter parsing rules, that syntax executes the default CLI runner (`bin/lemeone.js`) and starts a local Next.js Web dev server instead of running the MCP transport. The resulting verbose dev server logs will break the JSON-RPC communication.
>
> **You MUST use the `--package` parameter flag** to instruct `npx` to locate the correct `lemeone-mcp` binary in the global registry:

#### Correct Cursor / Claude Desktop `mcp.json` Configuration:

```json
"mcpServers": {
  "lemeone": {
    "command": "npx",
    "args": [
      "-y",
      "--package",
      "lemeone-sandbox",
      "lemeone-mcp"
    ],
    "env": {
      "GOOGLE_GENERATIVE_AI_API_KEY": "YOUR_GEMINI_API_KEY_HERE"
    }
  }
}
```

---

## 🧠 MCP Toolset & Standalone Testing

Connecting the MCP server grants your AI assistant access to the following tools:

* **`audit_local_codebase`**: Performs static and logical scans of your codebase, extracts 14D DNA vectors, and projects MRR, survival, and user conversion rates.
* **`setup_git_strategy_hook`**: Installs a strategy auditing hook (`prepare-commit-msg`) in your local Git repository to evaluate the business impact of every commit.
* **`audit_business_dna`**: Parses natural language business pitches, matches them against local industry knowledge templates, and outputs baseline 14D DNA.
* **`simulate_market_growth`**: Runs high-fidelity Monte Carlo steps with your product vector and tech debt to project growth and retention metrics.
* **`get_industry_knowledge`**: Retrieves structural gravity constraints for specific business models (e.g. B2B PLG, SaaS, Hardware Buyout).

### Standalone CLI Simulator Testing
You can also run standalone simulations directly in your terminal to stress-test the math physics engine:
```bash
node .gemini/skills/business-intelligence/scripts/simulate.js '{
  "productVector": [0.85, 0.80, 0.90, 0.75, 0.80, 0.15, 0.70, 0.50, 0.80, 0.60, 0.60, 0.60, 0.70, 0.20],
  "techDebt": 0,
  "techDebtLambda": 1.2,
  "teamSize": "STARTUP",
  "previousActiveUsers": 0
}'
```

---

## 🔬 Calibration Benchmarks

The sandbox physics parameters are calibrated against historical startup S-curve trajectories:

| Case Study | Target Sector | Sandbox Simulated CVR | Real-world Ground Truth | Result |
| :--- | :--- | :--- | :--- | :--- |
| **Slack (2014)** | B2B Collaboration PLG | **30.2%** | ~30.0% conversion | ✅ Accurate Fit |
| **GitHub (2011)** | Developer Freemium Platform | **4.2%** | 3.0% - 5.0% conversion | ✅ Accurate Fit |
| **Zoom (2013)** | Zero-Friction B2B Video Tech | **4.8%** | 4.0% - 5.0% conversion | ✅ Accurate Fit |
| **Discord (2015)** | High-Retention Gaming Comm | **1.6%** | ~1.5% nitro conversion | ✅ Accurate Fit |

---

## 🕹️ Web CLI Command Console Sheet

When using the built-in terminal in the Web dashboard:

| Command | Action | Impact |
| :--- | :--- | :--- |
| `project new "<name>"` | Lock domain workspace | Locks selected industry constraints |
| `scan "<PRD text>"` | Cortex DNA Extraction | Infers and maps initial 14D vector |
| `price <val>` | Establish core ARPU | Binds price tags ($D6$) to revenue math |
| `dev` | Progress time (1 month) | Iterates 4 epochs of particle collisions |
| `stat` | Core health review | Returns 14D magnitude, resonance, and NaN protection check |
| `audit` | Generate strategy audit | Returns comprehensive Gemini strategic brief |

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.
