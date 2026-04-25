const { collectEvidence } = require('./src/lib/engine/codebase-auditor.js');
const { strategicCodeAudit } = require('./src/lib/engine/cortex-ai.ts');

async function testAudit() {
  console.log("--- Phase 1: Evidence Collection ---");
  const evidence = collectEvidence(".");
  console.log("Evidence collected (dependencies count):", Object.keys(evidence.dependencies).length);
  console.log("Config files found:", evidence.configs);

  console.log("\n--- Phase 2: AI Reasoning Audit ---");
  try {
    const analysis = await strategicCodeAudit(evidence);
    console.log("Audit complete!");
    console.log("Archetype:", analysis.archetype);
    console.log("D6 (Monetize):", analysis.dims.D6_MONETIZE);
    console.log("Directive:", analysis.directive);
    console.log("\nEvidence Chain:");
    analysis.evidence.forEach(e => console.log(" *", e));
  } catch (e) {
    console.error("Audit failed:", e);
  }
}

testAudit();
