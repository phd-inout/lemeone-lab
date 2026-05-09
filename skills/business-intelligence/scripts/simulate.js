const { generatePopulation, runCollision, calculateMetrics } = require('drta-gravity-engine');
const { v4: uuidv4 } = require('uuid');

const args = process.argv.slice(2);
const vectorArg = args.find(a => a.startsWith('--vector'))?.split('=')[1] || args[args.indexOf('--vector') + 1];
const lambdaArg = args.find(a => a.startsWith('--lambda'))?.split('=')[1] || args[args.indexOf('--lambda') + 1];

if (!vectorArg) {
    console.error('Usage: node simulate.js --vector "[0.5,0.2,...]" --lambda 1.8');
    process.exit(1);
}

try {
    const vector = JSON.parse(vectorArg);
    const lambda = parseFloat(lambdaArg) || 0.5;

    console.log('\n\x1b[36m[DRTA ENGINE] Running 14D Strategic Simulation (100k Agents)...\x1b[0m');
    
    const seed = {
        mean: vector,
        std: vector.map(v => Math.max(0.05, 0.1 * (1 - v))),
        weights: [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        outliers: []
    };

    let agents = generatePopulation(seed, 100000, () => uuidv4());
    let techDebt = 0;
    let activeUsers = 0;

    // Simulate 4 epochs
    for (let i = 0; i < 4; i++) {
        agents = runCollision(vector, null, agents, null, seed.weights);
        const metrics = calculateMetrics(agents, vector, techDebt, 10, activeUsers, { model: 'SUBSCRIPTION', monthlyFee: 45 });
        
        activeUsers = metrics.activePaidUserCount;
        const coreComplexity = (vector[0] + vector[1] + vector[2] + vector[3]) / 4;
        const techDebtBump = 0.5 * lambda * (0.5 + coreComplexity) * 1.2; // STARTUP
        techDebt += techDebtBump;
    }

    const finalMetrics = calculateMetrics(agents, vector, techDebt, 10, activeUsers, { model: 'SUBSCRIPTION', monthlyFee: 45 });

    console.log('\n\x1b[32m╔══ SIMULATION RESULTS (T+1 Month) ══╗\x1b[0m');
    console.log(`║ 🚀 Active Users: ${finalMetrics.activePaidUserCount.toLocaleString().padEnd(20)} ║`);
    console.log(`║ 🛡️  Survival Rate: ${(finalMetrics.survivalRate * 100).toFixed(1)}%`.padEnd(38) + '║');
    console.log(`║ ⚙️  Final TechDebt: ${techDebt.toFixed(2).padEnd(18)} ║`);
    console.log(`║ 💰 Est. MRR: $${finalMetrics.mrr.toLocaleString().padEnd(21)} ║`);
    console.log('\x1b[32m╚══════════════════════════════════════╝\x1b[0m');

} catch (e) {
    console.error('Simulation failed:', e.message);
    console.error(e.stack);
}
