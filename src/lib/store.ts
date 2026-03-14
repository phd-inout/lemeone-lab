import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import {
    SandboxState,
    Vector12D,
    AgentDNA,
    PopulationSeed,
    DIM,
    UserTier,
    TIER_LIMITS
} from './engine/types'
import { 
    generatePopulation, 
    stepSimulation, 
    runCollision 
} from './engine/simulator'
import { 
    scanSeed, 
    generateProposal, 
    runAudit 
} from './engine/cortex-ai'

interface LemeoneStore {
    sandboxState: SandboxState | null
    userTier: UserTier
    isRunning: boolean
    terminalLines: string[]
    
    // Core Actions
    initSimulation: (seedText: string, requestedTier?: UserTier) => Promise<void>
    step: (weeks: number) => Promise<void>
    updateVector: (dim: keyof typeof DIM, value: number) => void
    addFeature: (description: string) => Promise<void>
    fund: (amount: number) => void
    setBurn: (amount: number) => void
    audit: () => Promise<void>
    upgradeTier: (newTier: UserTier) => void
    
    // UI
    pushLine: (line: string) => void
    reset: () => void
}

export const useLemeoneStore = create<LemeoneStore>()(
    persist(
        (set, get) => ({
            sandboxState: null,
            userTier: 'FREE',
            isRunning: false,
            terminalLines: [],

            pushLine: (line: string) =>
                set(s => ({ terminalLines: [...s.terminalLines.slice(-500), line] })),

            initSimulation: async (seedText: string, requestedTier?: UserTier) => {
                const tier = requestedTier || get().userTier
                const limits = TIER_LIMITS[tier]
                
                get().pushLine(`[SYSTEM] Initializing simulation with ${tier} resolution (${limits.maxAgents} agents)...`)
                get().pushLine(`[SYSTEM] Scanning seed text: "${seedText.substring(0, 40)}..."`)
                
                const seed = await scanSeed(seedText)
                const proposal = await generateProposal(seed, seedText)
                
                const initialPopulation = generatePopulation(seed, limits.maxAgents)
                const agents = runCollision(seed.mean, 0, initialPopulation)
                
                const initialState: SandboxState = {
                    id: uuidv4(),
                    tier,
                    weekNumber: 0,
                    cash: 100000,
                    burnRate: 20000, // Default base
                    techDebt: 0,
                    currentStage: 'SEED',
                    productVector: seed.mean,
                    agents,
                    metrics: {
                        avgResonance: 0,
                        conversionRate: 0,
                        mrr: 0,
                        churnRate: 0
                    },
                    assets: {
                        proposal,
                        backlog: '# PRODUCT_BACKLOG\nRun audit to generate...',
                        marketFeedback: '',
                        stressTestReport: ''
                    }
                }

                set({ sandboxState: initialState, isRunning: true })
                get().pushLine(`[SYSTEM] Gravity Sandbox Initialized.`)
            },

            step: async (weeks: number) => {
                const s = get().sandboxState
                if (!s) return

                let nextState = { ...s }
                for (let i = 0; i < weeks; i++) {
                    nextState = stepSimulation(nextState)
                }

                set({ sandboxState: nextState })
                get().pushLine(`[SIM] Stepped forward ${weeks} weeks. Cash: ¥${nextState.cash.toLocaleString()}`)
            },

            updateVector: (dim: keyof typeof DIM, value: number) => {
                const s = get().sandboxState
                if (!s) return

                const nextVector = [...s.productVector] as Vector12D
                nextVector[DIM[dim]] = Math.max(0, Math.min(1, value))
                const updatedAgents = runCollision(nextVector, s.techDebt, s.agents)

                set({
                    sandboxState: {
                        ...s,
                        productVector: nextVector,
                        agents: updatedAgents
                    }
                })
                get().pushLine(`[CMD] Parameter ${dim} adjusted to ${value.toFixed(2)}`)
            },

            addFeature: async (description: string) => {
                const s = get().sandboxState
                if (!s) return

                get().pushLine(`[SYSTEM] Analyzing feature logic: "${description}"`)
                const perturbation = await scanSeed(`Feature impact: ${description}`)
                
                const nextVector = s.productVector.map((v, i) => 
                    Math.max(0, Math.min(1, v * 0.8 + perturbation.mean[i] * 0.2))
                ) as Vector12D

                const updatedAgents = runCollision(nextVector, s.techDebt + 5, s.agents)

                set({
                    sandboxState: {
                        ...s,
                        productVector: nextVector,
                        agents: updatedAgents,
                        techDebt: s.techDebt + 5,
                        cash: s.cash - 10000
                    }
                })
                get().pushLine(`[CMD] Feature "${description}" integrated. TechDebt +5.`)
            },

            fund: (amount: number) => {
                const s = get().sandboxState
                if (!s) return

                set({
                    sandboxState: {
                        ...s,
                        cash: s.cash + amount
                    }
                })
                get().pushLine(`[CAPITAL] Series Injection: +¥${amount.toLocaleString()}`)
            },

            setBurn: (amount: number) => {
                const s = get().sandboxState
                if (!s) return

                set({
                    sandboxState: {
                        ...s,
                        burnRate: amount
                    }
                })
                get().pushLine(`[CMD] Base monthly burn-rate adjusted to ¥${amount.toLocaleString()}`)
            },

            upgradeTier: (newTier: UserTier) => {
                set({ userTier: newTier })
                get().pushLine(`[LICENSE] System upgraded to ${newTier} resolution.`)
            },

            audit: async () => {
                const s = get().sandboxState
                if (!s) return

                get().pushLine("[SYSTEM] Triggering Deep AI Audit...")
                const auditResults = await runAudit(s)

                set({ 
                    sandboxState: {
                        ...s,
                        assets: {
                            ...s.assets,
                            ...auditResults
                        }
                    }
                })
                get().pushLine("[SYSTEM] Strategic Assets updated.")
            },

            reset: () => set({ sandboxState: null, terminalLines: [], isRunning: false })
        }),
        {
            name: 'lemeone-2.0-storage',
            partialize: (state) => ({ 
                userTier: state.userTier,
                sandboxState: state.sandboxState ? { ...state.sandboxState, agents: [] } : null
            }),
        }
    )
)
