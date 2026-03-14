/**
 * Lemeone-lab 2.0: Core DNA & Vector Types
 * 12-Dimensional Gravity Sandbox Model
 */

// 12-D Normalized Vector (0.0 - 1.0)
export type Vector12D = [
  number, number, number, number, // Product Core: Performance, Depth, Interaction, Stability
  number, number, number, number, // Market: Friction, Unique, Social, Consistency
  number, number, number, number  // Future: Ecosystem, Barriers, Global, Curve
]

export const DIM = {
  // Product Core (D1-D4)
  PERF: 0,
  DEPTH: 1,
  INTERACT: 2,
  STABLE: 3,
  // Market (D5-D8)
  FRICTION: 4,
  UNIQUE: 5,
  SOCIAL: 6,
  CONSISTENCY: 7,
  // Future (D9-D12)
  ECO: 8,
  BARRIER: 9,
  GLOBAL: 10,
  CURVE: 11,
} as const

/**
 * Agent DNA: The atomic unit of the 10,000 population
 */
export interface AgentDNA {
  id: string
  vector: Vector12D
  resonance: number // Cached result from last collision
  isOutlier?: boolean // 黑天鹅样本标记 (从调研文档极端案例生成)
}

/**
 * Product & Competition
 */
export interface ProductVector {
  name: string
  vector: Vector12D
  price: number // Maps to index 0 (v_price)
}

export type CompanyStage = 'SEED' | 'MVP' | 'PMF' | 'SCALE' | 'IPO' | 'TITAN'

/**
 * Business Model: Market Resolution Tiers
 */
export type UserTier = 'FREE' | 'PRO' | 'ULTRA' | 'ENTERPRISE'

export const TIER_LIMITS: Record<UserTier, { maxAgents: number; maxAuditsPerWeek: number }> = {
  FREE: { maxAgents: 100, maxAuditsPerWeek: 1 },
  PRO: { maxAgents: 10000, maxAuditsPerWeek: 10 },
  ULTRA: { maxAgents: 50000, maxAuditsPerWeek: 50 },
  ENTERPRISE: { maxAgents: 200000, maxAuditsPerWeek: 999 },
}

/**
 * Rehearsal State (System 1)
 */
export interface SandboxState {
  id: string
  tier: UserTier // Current simulation resolution tier
  weekNumber: number
  cash: number
  burnRate: number // Monthly base operating cost (user defined)
  techDebt: number
  currentStage: CompanyStage
  productVector: Vector12D
  agents: AgentDNA[] // The 10,000 population
  
  // Statistical snapshots
  metrics: {
    avgResonance: number
    conversionRate: number
    mrr: number
    churnRate: number
  }

  // Strategic Assets (System 2)
  assets: {
    proposal: string
    backlog: string
    marketFeedback: string
    stressTestReport: string
  }
}

/**
 * Seed Definition for Population Generation (Dual-Track)
 */
export interface PopulationSeed {
  mean: Vector12D     // 统计学中心点 (Manual Input + AI Inference)
  std: Vector12D      // 分布方差 (细节缺失程度)
  weights: Vector12D  // 决策权重 (Decision Weight Distribution)
  outliers: Vector12D[] // 调研文档中的极端负面/正面案例
  evidences?: Record<string, string> // 审计证据追溯 (维度 -> 证据原文)
}

export interface AuditReport {
  stressPoint: string
  dominantDNA: string
  backlogDraft: string
}
