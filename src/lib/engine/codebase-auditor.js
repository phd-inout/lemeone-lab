const fs = require('fs');
const path = require('path');

/**
 * Lemeone Strategic Codebase Auditor (Core Engine V2.5)
 * Shared between MCP Server and Git Hooks.
 */
function analyzeCodebase(rootDir) {
    const results = {
        techDebtLambda: 0.5,
        archetype: "Unknown Entity",
        dims: {
            D1_PERF: 0.5,
            D3_INTERACT: 0.5,
            D4_STABLE: 0.5,
            D5_ENTRY: 0.5,
            D6_MONETIZE: 0.5,
            D11_ECOSYSTEM: 0.5,
            D13_CURVE: 0.5
        },
        insights: [],
        evidence: [],
        directive: "Maintain current trajectory."
    };

    // 1. Vision & Documentation Density
    const readmePath = path.join(rootDir, 'README.md');
    let hasScientificVision = false;
    if (fs.existsSync(readmePath)) {
        const readme = fs.readFileSync(readmePath, 'utf-8').toLowerCase();
        if (readme.includes('performance') || readme.includes('real-time')) results.dims.D1_PERF = 0.8;
        if (readme.includes('scientific') || readme.includes('deterministic')) {
            results.dims.D13_CURVE = 0.8;
            hasScientificVision = true;
        }
    }

    // 2. Technical Fingerprinting
    const packageJsonPath = path.join(rootDir, 'package.json');
    let hasModernUI = false;
    let hasTesting = false;
    if (fs.existsSync(packageJsonPath)) {
        try {
            const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
            const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
            if (deps['framer-motion'] || deps['tailwindcss']) hasModernUI = true;
            if (deps['jest'] || deps['eslint']) hasTesting = true;
            if (deps['@ai-sdk/google'] || deps['ai']) results.techDebtLambda = 1.8;
        } catch (e) {}
    }

    results.dims.D3_INTERACT = hasModernUI ? 0.8 : 0.4;
    results.dims.D4_STABLE = hasTesting ? 0.7 : 0.3;

    // 3. Ecosystem Depth
    const docsDir = path.join(rootDir, 'src/content/docs');
    const docCount = fs.existsSync(docsDir) ? fs.readdirSync(docsDir).filter(f => f.endsWith('.md')).length : 0;
    results.dims.D11_ECOSYSTEM = Math.min(0.9, 0.3 + (docCount * 0.1));

    // 4. Archetype & Directive Logic
    if (results.dims.D11_ECOSYSTEM > 0.7 && results.dims.D13_CURVE > 0.7) {
        results.archetype = "Technical Fortress (High Barrier)";
        results.insights.push("You are building a high-moat ecosystem. Developer adoption is your primary currency.");
        if (results.dims.D1_PERF < 0.6) results.directive = "URGENT: Optimize PERF (D1) to match your 'Scientific' positioning.";
    } else if (results.dims.D5_ENTRY > 0.7 && results.dims.D3_INTERACT > 0.7) {
        results.archetype = "Viral Growth Engine (Product-Led)";
        results.insights.push("Low friction and high interaction detected. UX polish is your killer feature.");
        results.directive = "Action: Watch D6 (Monetize) closely to avoid becoming a 'Forever Free' tool.";
    } else {
        results.archetype = "Early Prototype (Agile Mode)";
        results.insights.push("Standard configuration detected. Focus on defining your 14D unfair advantage.");
        results.directive = "Action: Solidify vision in README.md to anchor your 14D vector.";
    }

    return results;
}

module.exports = { analyzeCodebase };
