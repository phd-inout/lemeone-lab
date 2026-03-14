import {
  Vector12D,
  AgentDNA,
  SandboxState,
  PopulationSeed,
} from './types'
import { v4 as uuidv4 } from 'uuid'

/**
 * System 1: DRTA Gravity Engine
 * Optimized DRTA 2.1: Weighted Resonance & Black Swan Logic
 */

// Cosine Similarity with Weights
export function calculateCosineSimilarity(v1: Vector12D, v2: Vector12D, weights?: Vector12D): number {
  let dotProduct = 0
  let mag1 = 0
  let mag2 = 0
  for (let i = 0; i < 12; i++) {
    const w = weights ? weights[i] : 1
    dotProduct += (v1[i] * v2[i] * w)
    mag1 += v1[i] * v1[i]
    mag2 += v2[i] * v2[i]
  }
  const denominator = Math.sqrt(mag1) * Math.sqrt(mag2)
  return denominator === 0 ? 0 : dotProduct / denominator
}

/**
 * The Collision Loop: 10,000 agents x Product Vector
 * Formula: R_i = SharpenedCosSim(V_p, V_u, W) * DistancePenalty * TechDebtPenalty
 */
export function runCollision(
  productVector: Vector12D,
  techDebt: number,
  population: AgentDNA[],
  userWeights: Vector12D = [1,1,1,1,1,1,1,1,1,1,1,1]
): AgentDNA[] {
  const lambda = 0.08
  const baseTechPenalty = Math.exp(-lambda * (techDebt / 100))

  return population.map(agent => {
    // 1. Weighted Similarity
    const cosSim = calculateCosineSimilarity(productVector, agent.vector, userWeights)
    const sharpenedSim = Math.pow(Math.max(0, cosSim), 3)

    // 2. Normalized Distance Penalty (Sensitive to Outliers)
    let magDiff = 0
    for(let i=0; i<12; i++) magDiff += Math.pow(productVector[i] - agent.vector[i], 2)
    
    // Outliers are 2x more sensitive to distance mismatches
    const sensitivityK = agent.isOutlier ? 0.3 : 0.15
    const distancePenalty = Math.exp(-Math.sqrt(magDiff) * sensitivityK)

    // 3. Dynamic Tech Debt Impact
    const userSensitivity = 0.5 + (sharpenedSim * 0.5) 
    const effectiveTechPenalty = Math.pow(baseTechPenalty, userSensitivity)

    return {
      ...agent,
      resonance: sharpenedSim * distancePenalty * effectiveTechPenalty
    }
  })
}

/**
 * Population Generation (Monte Carlo + Black Swan Injection)
 */
export function generatePopulation(seed: PopulationSeed, count: number = 10000): AgentDNA[] {
  const agents: AgentDNA[] = []
  const { mean, std, outliers } = seed

  // 1. Inject Black Swans (Outliers) from Research Docs (approx 2%)
  if (outliers && outliers.length > 0) {
    const outlierCount = Math.min(Math.floor(count * 0.02), outliers.length * 20)
    for (let i = 0; i < outlierCount; i++) {
        const source = outliers[i % outliers.length]
        agents.push({
            id: `outlier-${uuidv4()}`,
            vector: source,
            resonance: 0,
            isOutlier: true
        })
    }
  }

  // 2. Generate Regular Population
  const remainingCount = count - agents.length
  for (let i = 0; i < remainingCount; i++) {
    const vector: Vector12D = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    for (let d = 0; d < 12; d++) {
      const u1 = Math.random()
      const u2 = Math.random()
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)
      
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

/**
 * Calculate macro metrics
 */
export function calculateMetrics(population: AgentDNA[], cash: number) {
  const totalResonance = population.reduce((sum, a) => sum + a.resonance, 0)
  const avgResonance = totalResonance / population.length

  // Sigmoid Conversion Logic
  const payingUsers = population.filter(a => {
    const k = 25 
    const x0 = 0.75 
    const probability = 1 / (1 + Math.exp(-k * (a.resonance - x0)))
    return Math.random() < probability
  }).length

  const conversionRate = payingUsers / population.length
  const arpu = 45 
  const mrr = payingUsers * arpu 

  return {
    avgResonance,
    conversionRate,
    mrr,
    churnRate: Math.max(0, 0.6 - avgResonance) * 0.25
  }
}

/**
 * Core step function
 */
export function stepSimulation(state: SandboxState): SandboxState {
  // Use current population for collision
  const updatedAgents = runCollision(state.productVector, state.techDebt, state.agents)
  const metrics = calculateMetrics(updatedAgents, state.cash)

  const monthlyBurn = state.burnRate || 20000 
  const infraCost = metrics.mrr ? (metrics.mrr * 0.05) : 0 
  const weeklyBurn = (monthlyBurn + infraCost) / 4
  
  const cashDelta = (metrics.mrr / 4) - weeklyBurn

  return {
    ...state,
    weekNumber: state.weekNumber + 1,
    cash: Math.max(-10000000, state.cash + cashDelta),
    agents: updatedAgents,
    metrics: {
        ...metrics,
        mrr: metrics.mrr
    },
  }
}
