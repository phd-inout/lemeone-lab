#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function analyzeCodebase() {
    const results = {
        techDebtLambda: 0.5,
        dims: {
            D1_PERF: 0.5,
            D3_INTERACT: 0.5,
            D4_STABLE: 0.5,
            D5_ENTRY: 0.5,
            D6_MONETIZE: 0.5,
            D11_ECOSYSTEM: 0.5,
            D13_CURVE: 0.5
        },
        evidence: []
    };

    // 1. Vision Audit
    const readmePath = path.join(rootDir, 'README.md');
    if (fs.existsSync(readmePath)) {
        const readme = fs.readFileSync(readmePath, 'utf-8').toLowerCase();
        if (readme.includes('high performance') || readme.includes('real-time')) {
            results.dims.D1_PERF = 0.8;
            results.evidence.push("Vision: High performance focus detected.");
        }
        if (readme.includes('scientific') || readme.includes('deterministic')) {
            results.dims.D13_CURVE = 0.8;
            results.evidence.push("Vision: Scientific positioning detected.");
        }
    }

    // 2. Package Fingerprinting
    const packageJsonPath = path.join(rootDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
        
        if (deps['framer-motion'] || deps['tailwindcss']) results.dims.D3_INTERACT = 0.8;
        if (deps['jest'] || deps['eslint']) results.dims.D4_STABLE = 0.7;

        const depCount = Object.keys(deps).length;
        if (depCount > 40) {
            results.techDebtLambda = 1.4;
            results.evidence.push(`Dependency bloat (${depCount} packages).`);
        }
    }

    // 3. Documentation (D11)
    const docsDir = path.join(rootDir, 'src/content/docs');
    if (fs.existsSync(docsDir)) {
        const docs = fs.readdirSync(docsDir).filter(f => f.endsWith('.md'));
        if (docs.length > 5) results.dims.D11_ECOSYSTEM = 0.9;
    }

    return results;
}

const { execSync } = require('child_process');

// 1. WISDOM ENGINE (Programmer-Centric Insights)
const WISDOM_LIBRARY = [
    {
        pattern: /auth|login|signup|password/i,
        quote: "Jeff Bezos once said: 'If you make a customer unhappy in the physical world, they might tell 6 friends. If you make them unhappy on the Internet, they can tell 6,000 friends.'",
        lesson: "Each extra step in your auth flow is a silent killer of conversion."
    },
    {
        pattern: /api|router|endpoint|mcp/i,
        quote: "The Bezos API Mandate: 'All teams will henceforth expose their data and functionality through service interfaces... anyone who doesn't do this will be fired.'",
        lesson: "You're not just writing code; you're building a node in the future AI neural network."
    },
    {
        pattern: /test|spec|jest|vitest/i,
        quote: "Code without tests is broken by design.",
        lesson: "Tests are the only way to sleep at night when D4 (STABLE) is your primary moat."
    },
    {
        pattern: /package\.json|yarn\.lock|npm-shrinkwrap/i,
        quote: "Dependency is a liability. Quibi spent $1.75B but failed due to lack of core agility.",
        lesson: "Be careful. Every package you add is a debt you'll pay in λ (Velocity) later."
    },
    {
        pattern: /performance|worker|calculate|math/i,
        quote: "Premature optimization is the root of all evil.",
        lesson: "Align D1 (PERF) with your vision. Don't polish the cabinet's back if no one sees it."
    }
];

const commitMsgFile = process.argv[2];
if (!commitMsgFile) process.exit(0);

try {
    const analysis = analyzeCodebase(rootDir);
    
    // 2. DIFF SNIFFING (What did we change JUST NOW?)
    const stagedDiff = execSync('git diff --cached', { cwd: rootDir }).toString();
    let personalReflection = "Success is not final, failure is not fatal: it is the courage to continue that counts.";
    let historicalContext = "Early Unix philosophy: Do one thing and do it well.";

    for (const item of WISDOM_LIBRARY) {
        if (item.pattern.test(stagedDiff)) {
            personalReflection = item.lesson;
            historicalContext = item.quote;
            break;
        }
    }

    // ASCII Visual Bar Helper
    const bar = (val) => {
        const full = Math.round(val * 10);
        return "[" + "■".repeat(full) + "□".repeat(10 - full) + "] " + (val * 100).toFixed(0) + "%";
    };

    const brief = `
# ------------------------------------------------------------------
# LEMEONE STRATEGIC BRIEF | V2.6 (Pro)
# ------------------------------------------------------------------
# [MARKET POSITIONING]
# Archetype: ${analysis.archetype.toUpperCase()}
#
# [📊 14D GRAVITY RADAR]
# Velocity (λ) : ${analysis.techDebtLambda.toFixed(1)}x
# Performance  : ${bar(analysis.dims.D1_PERF)}
# UX/Interact  : ${bar(analysis.dims.D3_INTERACT)}
# Stability    : ${bar(analysis.dims.D4_STABLE)}
# Ecosystem    : ${bar(analysis.dims.D11_ECOSYSTEM)}
# Growth Curve : ${bar(analysis.dims.D13_CURVE)}
#
# [🔮 PROGRAMMER REFLECTION]
# > ${personalReflection}
#
# [🏛️ HISTORICAL INSIGHT]
# "${historicalContext}"
#
# [🎯 EXECUTIVE DIRECTIVE]
# > ${analysis.directive}
#
# ------------------------------------------------------------------
# Please verify if this commit aligns with the project's gravity.
`;

    const currentMsg = fs.readFileSync(commitMsgFile, 'utf-8');
    fs.writeFileSync(commitMsgFile, brief + currentMsg);
} catch (e) {
    // Fail silently
}
