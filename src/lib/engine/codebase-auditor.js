const fs = require('fs');
const path = require('path');

/**
 * Lemeone Evidence Collector (Core Engine V3.0 - Physical Layer)
 * Collects project fingerprints for LLM-powered strategic auditing.
 */
function collectEvidence(rootDir) {
    const evidence = {
        dependencies: {},
        devDependencies: {},
        structure: [],
        configs: [],
        uiTokens: {}, 
        schemas: {}, // NEW: Capture DB schemas for D2
        logicSnippets: {}, // NEW: Capture core lib/utils for D7
        i18n: {}, // NEW: Capture i18n configs for D12
        readmeSnippet: "",
        techDebtLambda: 0.5,
        timestamp: new Date().toISOString()
    };

    // 1. Package Analysis
    const packageJsonPath = path.join(rootDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
        try {
            const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
            evidence.dependencies = pkg.dependencies || {};
            evidence.devDependencies = pkg.devDependencies || {};
            
            // Initial Lambda hint based on AI usage
            const deps = { ...evidence.dependencies, ...evidence.devDependencies };
            if (deps['@ai-sdk/google'] || deps['ai'] || deps['openai']) evidence.techDebtLambda = 2.0;
        } catch (e) {}
    }

    // 2. Deep Directory Sampling
    function walk(dir, depth = 0) {
        if (depth > 3) return; // Increased depth for better mapping
        if (!fs.existsSync(dir)) return;
        
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const ignoreList = ['node_modules', '.git', '.next', 'dist', 'out', 'build', '.prisma'];
            if (ignoreList.some(ignore => file.includes(ignore))) return;
            
            const fullPath = path.join(dir, file);
            const stats = fs.statSync(fullPath);
            const relPath = path.relative(rootDir, fullPath);

            if (stats.isDirectory()) {
                evidence.structure.push(`${relPath}/`);
                walk(fullPath, depth + 1);
            } else {
                evidence.structure.push(relPath);
                
                // --- CATEGORIZED SAMPLING ---
                const content = stats.size < 30000 ? fs.readFileSync(fullPath, 'utf-8') : "";
                
                // A. UI/Styling (D3)
                if (file.includes('tailwind') || file.includes('globals.css') || file.includes('theme')) {
                    evidence.uiTokens[file] = content.substring(0, 3000);
                }
                
                // B. Schemas/Data Model (D2)
                if (file.endsWith('.prisma') || file.endsWith('.sql') || (relPath.includes('models') && file.endsWith('.ts'))) {
                    evidence.schemas[file] = content.substring(0, 5000);
                }

                // C. Core Business Logic (D7/D11)
                if ((relPath.includes('lib/engine') || relPath.includes('utils/math')) && file.endsWith('.ts')) {
                    evidence.logicSnippets[file] = content.substring(0, 3000);
                }

                // D. Globalization (D12)
                if (file.includes('i18n') || file.includes('locale') || relPath.includes('locales/')) {
                    evidence.i18n[file] = content.substring(0, 1000);
                }

                // E. General Configs (D4/D5/D6/D10)
                if (file.includes('config') || file.includes('auth') || file.includes('stripe') || file.includes('api')) {
                    evidence.configs.push(relPath);
                }
            }
        });
    }
    walk(rootDir);

    // 3. Vision Snippet
    const readmePath = path.join(rootDir, 'README.md');
    if (fs.existsSync(readmePath)) {
        evidence.readmeSnippet = fs.readFileSync(readmePath, 'utf-8').substring(0, 2000);
    }

    return evidence;
}

module.exports = { collectEvidence, analyzeCodebase: collectEvidence }; // Alias for backward compatibility during transition
