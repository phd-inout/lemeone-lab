import {
  Vector13D,
  AgentDNA,
  SandboxState,
  PopulationSeed,
} from './types'
import { v4 as uuidv4 } from 'uuid'

/**
 * System 1: DRTA Gravity Engine
 * Optimized DRTA 2.5: Acquisition Funnel, Market Shaping & Network Effects
 */

// Cosine Similarity with Weights (Normalized)
export function calculateCosineSimilarity(v1: Vector13D, v2: Vector13D, weights?: Vector13D): number {
  let dotProduct = 0
  let mag1 = 0
  let mag2 = 0
  for (let i = 0; i < 12; i++) {
    const w = weights ? weights[i] : 1
    dotProduct += (v1[i] * v2[i] * w)
    mag1 += (v1[i] * v1[i] * w)
    mag2 += (v2[i] * v2[i] * w)
  }
  const denominator = Math.sqrt(mag1) * Math.sqrt(mag2)
  return denominator === 0 ? 0 : Math.min(1, dotProduct / denominator)
}

/**
 * The Collision Loop: Now calculates Raw Resonance
 */
export function runCollision(
  productVector: Vector13D,
  techDebt: number,
  population: AgentDNA[],
  previousPaidUsers: number,
  weights: Vector13D = [1,1,1,1,1,1,1,1,1,1,1,1,1]
): AgentDNA[] {
  return population.map(agent => {
    const cosSim = calculateCosineSimilarity(productVector, agent.vector, weights)
    const rCos = Math.pow(Math.max(0, cosSim), 3)

    let magDiff = 0
    for(let i=0; i<12; i++) magDiff += Math.pow(productVector[i] - agent.vector[i], 2)
    const alpha = agent.isOutlier ? 1.5 : 0.8 
    const pDist = Math.exp(-alpha * magDiff)

    return {
      ...agent,
      resonance: rCos * pDist
    }
  })
}

/**
 * Async wrapper for runCollision
 */
export async function runCollisionAsync(
  productVector: Vector13D,
  techDebt: number,
  population: AgentDNA[],
  previousPaidUsers: number,
  weights: Vector13D = [1,1,1,1,1,1,1,1,1,1,1,1,1]
): Promise<AgentDNA[]> {
  return runCollision(productVector, techDebt, population, previousPaidUsers, weights)
}

/**
 * 13D Stochastic Conversion Engine (Decoupled Active & Paid Funnel)
 */
export function calculateMetrics(
    population: AgentDNA[], 
    productVector: Vector13D, 
    techDebt: number, 
    teamSize: string,
    previousActiveUsers: number = 0,
    cash: number = 0
) {
  const R0 = 0.35; // Calibrated for 13D space
  const k = 12;   
  const lambda = 0.5; 

  let totalResonance = 0;
  population.forEach(agent => totalResonance += agent.resonance);
  const avgResonance = totalResonance / population.length;

  // 1. Retention (Active Users)
  const retentionRate = Math.min(0.99, 1 / (1 + Math.exp(-15 * (avgResonance - 0.25))));
  const retainedActiveUsers = Math.floor(previousActiveUsers * retentionRate);

  // 2. Acquisition Pipeline (Aware -> Active/Trial)
  // Awareness determines how many NEW agents notice the product each week.
  const newAwareAgentsCount = Math.floor((population.length - previousActiveUsers) * productVector[12] * 0.2);
  let newActiveUsers = 0;

  for (let i = 0; i < newAwareAgentsCount; i++) {
      const sample = population[Math.floor(Math.random() * population.length)];
      const pConv = 1 / (1 + Math.exp(-k * (sample.resonance - R0)));
      
      // D5 (Friction) acts as adoption gateway. 1.0 means zero friction (easy to become ACTIVE).
      const adoptionRate = productVector[4];
      const techPenalty = Math.exp(-lambda * (techDebt / 100));
      
      if (Math.random() < (pConv * adoptionRate * techPenalty)) {
          newActiveUsers++;
      }
  }

  const totalActiveUsers = retainedActiveUsers + newActiveUsers;
  
  // 3. Monetization Logic (The Freemium vs Enterprise Trade-off)
  // High D5 (Free/Easy) -> Low Monetization %. Low D5 (Expensive) -> High Monetization %.
  const monetizationRate = Math.max(0.02, Math.min(0.98, 1.0 - productVector[4] + 0.05));
  const paidUsers = Math.floor(totalActiveUsers * monetizationRate);
  
  // 4. Survival Rate: Adjusted for Financial Runway
  const mrr = paidUsers * 45;
  const monthlyBurn = 20000;
  const runwayMonths = cash > 0 ? (cash / monthlyBurn) : 0;
  
  let survivalRate = 1.0;
  if (mrr < monthlyBurn) {
      const financialHealth = Math.min(1, runwayMonths / 12); 
      survivalRate = Math.max(0.1, financialHealth * 0.8 + (avgResonance * 0.2));
  } else {
      survivalRate = Math.min(1.0, 0.8 + (mrr / monthlyBurn) * 0.1);
  }

  return {
    avgResonance,
    conversionRate: paidUsers / population.length, // Only count PAID as converted
    earningPotential: paidUsers,
    activePaidUserCount: totalActiveUsers, // Re-purposed to track TOTAL ACTIVE users across epochs
    survivalRate: Math.min(1, survivalRate)
  }
}

/**
 * Core Epoch-based step function
 * Optimized DRTA 2.5: Market Gravity & Network Effects
 */
export async function stepSimulation(state: SandboxState): Promise<SandboxState> {
  const nextEpoch = state.epoch + 1;
  const weights: Vector13D = [1,1,1,1,1,1,1,1,1,1,1,1,1];
  const previousPaidUsers = state.metrics.activePaidUserCount || 0;
  const userDensity = previousPaidUsers / state.agents.length;

  // 1. Product Auto-Iteration & Network Effects
  const nextProductVector = [...state.productVector] as Vector13D;
  const performanceBonus = Math.max(0, state.metrics.avgResonance - 0.3) * 0.01;
  // D5 (Friction) should be a strategic choice, not automatically 'smoothed' by UX performance
  // nextProductVector[4] = Math.min(1.0, nextProductVector[4] + performanceBonus); 
  nextProductVector[7] = Math.min(1.0, nextProductVector[7] + performanceBonus); 
  
  // Metcalfe's Law: Unique Value (D6) increases with user density
  nextProductVector[5] = Math.min(1.0, nextProductVector[5] + (userDensity * 0.5));

  // 2. Market Shaping (Gravity): Population DNA moves toward product vector
  if (userDensity > 0.01) { 
      state.agents.forEach(agent => {
          if (Math.random() < 0.05) { 
              for(let d=0; d<12; d++) {
                  agent.vector[d] = agent.vector[d] * 0.98 + nextProductVector[d] * 0.02;
              }
          }
      });
  }

  // 3. Awareness Momentum (Viral K-Factor)
  const viralGrowth = state.productVector[6] * userDensity * 0.8;
  nextProductVector[12] = Math.min(1.0, nextProductVector[12] + viralGrowth + 0.002);

  const techDebtBump = state.teamSize === 'SOLO' ? 1 : state.teamSize === 'STARTUP' ? 3 : 8;
  const nextTechDebt = state.techDebt + techDebtBump;

  const updatedAgents = await runCollisionAsync(nextProductVector, nextTechDebt, state.agents, previousPaidUsers, weights);

  const metrics = calculateMetrics(updatedAgents, nextProductVector, nextTechDebt, state.teamSize, previousPaidUsers, state.cash);

  const mrr = metrics.earningPotential * 45;
  const weeklyBurn = (state.burnRate || 20000) / 4;
  const nextCash = Math.max(-10000000, state.cash + (mrr / 4) - weeklyBurn);

  return {
    ...state,
    epoch: nextEpoch,
    cash: nextCash,
    techDebt: nextTechDebt,
    productVector: nextProductVector,
    agents: updatedAgents,
    metrics,
    history: [...(state.history || []), {
        epoch: nextEpoch,
        users: metrics.earningPotential,
        resonance: metrics.avgResonance,
        survival: metrics.survivalRate,
        cash: nextCash
    }]
  }
}

/**
 * Population Generation (Monte Carlo + Black Swan Injection)
 */
export function generatePopulation(seed: PopulationSeed, count: number = 10000): AgentDNA[] {
  const agents: AgentDNA[] = []
  const { mean, std, outliers } = seed

  if (outliers && outliers.length > 0) {
    const outlierCount = Math.min(Math.floor(count * 0.02), outliers.length * 20)
    for (let i = 0; i < outlierCount; i++) {
        const source = outliers[i % outliers.length]
        agents.push({
            id: `outlier-${uuidv4()}`,
            vector: (source as any).dna || source,
            resonance: 0,
            isOutlier: true
        })
    }
  }

  const remainingCount = count - agents.length
  for (let i = 0; i < remainingCount; i++) {
    const vector: Vector13D = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    for (let d = 0; d < 13; d++) {
      const u1 = Math.random()
      const u2 = Math.random()
      const z0 = Math.sqrt(-2.0 * Math.log(u1 + 1e-9)) * Math.cos(2.0 * Math.PI * u2)
      const val = mean[d] + z0 * std[d]
      vector[d] = Math.max(0, Math.min(1, val))
    }
    agents.push({
      id: uuidv4(),
      vector,
      resonance: 0
    })
  }
  return agents
}
