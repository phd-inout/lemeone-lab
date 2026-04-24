
import { 
    generatePopulation, 
    stepSimulation 
} from './src/lib/engine/simulator';
import { Vector14D, SandboxState } from './src/lib/engine/types';
import { v4 as uuidv4 } from 'uuid';

async function testSimulationLeak() {
    console.log("🧪 [TEST] 启动模拟器逻辑断层测试...\n");

    const baseVector: Vector14D = [0.8, 0.8, 0.8, 0.8, 0.8, 0.1, 0.7, 0.5, 0.8, 0.5, 0.5, 0.5, 0.5, 0.2];
    
    let state: SandboxState = {
        id: uuidv4(),
        tier: 'PRO',
        epoch: 0,
        teamSize: 'STARTUP',
        techDebt: 0,
        currentStage: 'SEED',
        seedText: "Initial Test",
        userARPU: 45,
        industryId: "ind_003_iot",
        industryName: "IoT",
        industryBaselineARPU: 45,
        productVector: baseVector,
        agents: generatePopulation({
            mean: baseVector,
            std: Array(14).fill(0.1) as any,
            weights: Array(14).fill(1.0) as any,
            outliers: []
        }, 10000),
        metrics: {
            avgResonance: 0,
            conversionRate: 0,
            earningPotential: 0,
            activePaidUserCount: 0,
            mrr: 0,
            survivalRate: 1.0
        },
        assets: { proposal: '', backlog: '', marketFeedback: '', stressTestReport: '', journal: '', competitiveRadar: '' },
        history: []
    };

    console.log(`Epoch | Active Users | Paid Users | Avg Resonance | MRR`);
    console.log(`------|--------------|------------|---------------|-----`);

    for (let i = 1; i <= 5; i++) {
        state = await stepSimulation(state);
        const m = state.metrics;
        console.log(`T+${state.epoch}   | ${m.activePaidUserCount.toString().padEnd(12)} | ${m.earningPotential.toString().padEnd(10)} | ${m.avgResonance.toFixed(4)}      | $${m.mrr}`);
        
        if (state.epoch > 1 && m.activePaidUserCount < 100) {
            console.log(`\n⚠️ [DETECTION] 检测到数据坍塌！T+${state.epoch} 活跃用户仅剩 ${m.activePaidUserCount}`);
        }
    }
}

testSimulationLeak().catch(console.error);
