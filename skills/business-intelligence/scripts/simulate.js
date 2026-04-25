/**
 * Lemeone Business Intelligence - CLI Simulation Script (Pro Version)
 * Contains the full DRTA v2.5 engine logic for massive agent collisions.
 */

const crypto = require('crypto');

// 14D Dimension Constants
const DIM = {
    PERF: 0, DEPTH: 1, INTERACT: 2, STABLE: 3,
    ENTRY: 4, MONETIZE: 5,
    UNIQUE: 6, SOCIAL: 7, CONSISTENCY: 8,
    BARRIERS: 9, ECOSYSTEM: 10, NETWORK: 11, CURVE: 12,
    AWARENESS: 13
};

function uuidv4() {
    return crypto.randomUUID();
}

/**
 * Core Physics: Cosine Similarity with Weights
 */
function calculateCosineSimilarity(v1, v2, weights) {
    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;
    for (let i = 0; i < 14; i++) {
        const w = weights ? weights[i] : 1;
        dotProduct += (v1[i] * v2[i] * w);
        mag1 += (v1[i] * v1[i] * w);
        mag2 += (v2[i] * v2[i] * w);
    }
    const denominator = Math.sqrt(mag1) * Math.sqrt(mag2);
    return denominator === 0 ? 0 : Math.min(1, dotProduct / denominator);
}

/**
 * Vector Collision: Update Agent Resonance
 */
function runCollision(productVector, techDebt, population, previousActiveUsers, weights = [1,1,1,1,1,1,1,1,1,1,1,1,1,1]) {
    return population.map(agent => {
        const cosSim = calculateCosineSimilarity(productVector, agent.vector, weights);
        const rCos = Math.pow(Math.max(0, cosSim), 2);

        let magDiff = 0;
        for(let i = 0; i < 13; i++) magDiff += Math.pow(productVector[i] - agent.vector[i], 2);
        const alpha = agent.isOutlier ? 1.5 : 0.8;
        const pDist = Math.exp(-alpha * magDiff);

        return {
            ...agent,
            resonance: rCos * pDist
        };
    });
}

/**
 * Emergent Metrics Calculation (Pro Unified Model)
 * 100,000 Agents default. No explicit Free/Paid split in the primary pool.
 */
function calculateMetrics(population, productVector, techDebt, teamSize, previousActiveUsers = 0, monetization = { model: 'SUBSCRIPTION', hardwarePrice: 0, monthlyFee: 45 }) {
    const R0 = 0.35; 
    const k = 12;   
    const lambda = 0.5; 

    let totalResonance = 0;
    population.forEach(agent => totalResonance += agent.resonance);
    const avgResonance = population.length > 0 ? totalResonance / population.length : 0;

    // Sigmoid Retention
    const retentionRate = Math.min(0.99, 1 / (1 + Math.exp(-8 * (avgResonance - 0.15))));
    const retainedUsers = Math.floor(previousActiveUsers * retentionRate);

    // GTM Awareness Logic
    const totalAwareLimit = population.length * productVector[DIM.AWARENESS];
    const remainingPotential = Math.max(0, totalAwareLimit - previousActiveUsers);
    const newAwareCount = Math.floor(remainingPotential * 0.25);
    let newUsers = 0;

    for (let i = 0; i < newAwareCount; i++) {
        const sample = population[Math.floor(Math.random() * population.length)];
        const pConv = 1 / (1 + Math.exp(-k * (sample.resonance - R0)));
        const entryEase = productVector[DIM.ENTRY];
        const techPenalty = Math.exp(-lambda * (techDebt / 100));
        if (Math.random() < (pConv * entryEase * techPenalty)) {
            newUsers++;
        }
    }

    const totalActiveUsers = retainedUsers + newUsers;
    
    // Revenue Logic (Unified)
    const pressure = productVector[DIM.MONETIZE]; 
    const activeAgents = population.filter(a => a.resonance > R0); 
    const sampleSize = Math.min(activeAgents.length, 2000);
    let samplePayCount = 0;
    
    for (let i = 0; i < sampleSize; i++) {
        const agent = activeAgents[Math.floor(Math.random() * activeAgents.length)];
        const resonance = agent.resonance;
        const barrier = 1.0 - pressure;
        const energyGap = (barrier - resonance * 0.8) * 10.0;
        const pRational = 1.0 / (1.0 + Math.exp(energyGap));
        const pEntropy = 0.015 * resonance;
        const pPay = (pRational * pressure * 0.38) + pEntropy;
        
        if (Math.random() < Math.min(0.98, pPay)) {
            samplePayCount++;
        }
    }
    
    const monetizationRate = sampleSize > 0 ? (samplePayCount / sampleSize) : 0;
    // In Lemeone 2.0, we prioritize the concept of "Paying Active Users" as the primary metric
    const activeCustomers = Math.floor(totalActiveUsers * monetizationRate);
    
    let mrr = 0;
    if (monetization.model === 'ONE_TIME') {
        const newlyAdded = Math.max(0, activeCustomers - Math.floor(retainedUsers * monetizationRate));
        mrr = newlyAdded * (monetization.hardwarePrice || 0);
    } else {
        mrr = activeCustomers * (monetization.monthlyFee || 45);
    }
    
    const survivalRate = Math.min(1.0, Math.max(0.05,
        (avgResonance / 0.5) * 0.4 +
        Math.exp(-0.02 * techDebt) * 0.25 +
        (monetizationRate / 0.05) * 0.2 +
        productVector[DIM.BARRIERS] * 0.3
    ));

    return {
        avgResonance,
        activeUsers: activeCustomers, // Simplified: Active Users IS the Paying Pool in this context
        mrr,
        survivalRate: Math.min(1, survivalRate),
        monetizationRate
    };
}

/**
 * Generate Initial Agent Population
 */
function generatePopulation(seed, count = 100000) {
    const agents = [];
    const { mean, std, outliers } = seed;
    const dimCount = mean.length;

    if (outliers && outliers.length > 0) {
        const outlierCount = Math.min(Math.floor(count * 0.02), outliers.length * 20);
        for (let i = 0; i < outlierCount; i++) {
            const source = outliers[i % outliers.length];
            agents.push({
                id: `outlier-${uuidv4()}`,
                vector: source.dna || source,
                resonance: 0,
                isOutlier: true
            });
        }
    }

    const remainingCount = count - agents.length;
    for (let i = 0; i < remainingCount; i++) {
        const vector = new Array(dimCount);
        for (let d = 0; d < dimCount; d++) {
            const u1 = Math.random();
            const u2 = Math.random();
            const z0 = Math.sqrt(-2.0 * Math.log(u1 + 1e-9)) * Math.cos(2.0 * Math.PI * u2);
            const val = mean[d] + z0 * std[d];
            vector[d] = Math.max(0, Math.min(1, val));
        }
        agents.push({
            id: uuidv4(),
            vector: vector,
            resonance: 0
        });
    }
    return agents;
}

// Main Simulation Pipeline
function simulateStep(state) {
    const { productVector, techDebt, techDebtLambda, teamSize, previousActiveUsers, seedData, monetization } = state;
    
    // 1. Generate Population (ENTERPRISE Default: 100,000 Agents)
    const agents = generatePopulation(seedData || {
        mean: productVector,
        std: new Array(14).fill(0.8),
        outliers: []
    }, 100000);

    // 2. Tech Debt Accumulation
    const lambda = techDebtLambda || 0.5;
    const coreComplexity = (productVector[0] + productVector[1] + productVector[2] + productVector[3]) / 4;
    const teamCoordinationTax = teamSize === 'SOLO' ? 0.8 : teamSize === 'STARTUP' ? 1.2 : teamSize === 'GROWTH' ? 2.5 : 5.0;
    const techDebtBump = 0.5 * lambda * (0.5 + coreComplexity) * teamCoordinationTax;
    const nextTechDebt = (techDebt || 0) + techDebtBump;

    // 3. Run DRTA Collisions
    const updatedAgents = runCollision(productVector, nextTechDebt, agents, previousActiveUsers || 0);

    // 4. Extrapolate Metrics
    const metrics = calculateMetrics(updatedAgents, productVector, nextTechDebt, teamSize, previousActiveUsers || 0, monetization);

    return {
        techDebt: nextTechDebt,
        activeUsers: metrics.activeUsers,
        avgResonance: metrics.avgResonance,
        survivalRate: metrics.survivalRate,
        mrr: metrics.mrr,
        productVector: productVector
    };
}

// CLI Interface
const input = JSON.parse(process.argv[2] || '{}');
const result = simulateStep(input);
console.log(JSON.stringify(result, null, 2));
