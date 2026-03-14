"use server";

import { generateText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { 
  Vector12D, 
  PopulationSeed, 
  SandboxState, 
  AuditReport 
} from './types'

/**
 * Lemeone-lab 2.0: Cortex AI Auditor & Scanner
 * STRICT GEEK MODE: Optimized for size & logic.
 */

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const model = google('gemini-flash-lite-latest')

/**
 * P1: Seed Scanner (Numerical Data Encoder - Audit Mode)
 */
export async function scanSeed(text: string): Promise<PopulationSeed> {
  const systemPrompt = `
# Role: 商业向量量化审计员 (Numerical Data Encoder)

## Task: 
深度审计 [PRD]、[BP]、[调研文档]，将该商业策划编码为 12 维向量 (DRTA 标准)。

## 📐 12 维评分公约 (The Scoring Protocol):
AI 必须遵循以下 [0.0 - 1.0] 锚点定值：
- **0.0**: 完全缺失或逻辑自相矛盾。
- **0.5**: 行业平均水平 / 逻辑闭环但无亮点。
- **0.8**: 具备显著竞争优势 / 有极详尽的实现方案支撑。
- **1.0**: 理论极限 / 具备统治级护城河证据。

## 📍 维度校准锚点 (Calibration Anchors):
1. **D1-D4 (Core)**: 1.0 分需包含 API/Schema 细节；0.2 分代表仅有口号。
2. **D5 (Friction)**: 反向评分。1.0 代表零门槛；0.2 代表高单价、改习惯、复杂部署。
3. **D6 (Unique)**: 1.0 分需提供独家资源证据；0.2 分代表市场已有成熟开源替代。
4. **D8 (Consistency)**: 1.0 分需有边缘情况/扩容预案；0.2 分代表存在单点故障。
5. **D9-D12 (Strategic)**: 1.0 分需有二次增长曲线计划；0.2 分代表仅解决单一痛点。

## 审计指令 (Hard Audit Rules):
1. 禁止感性描述。每个维度的得分必须对应文档中的【具体条目/段落】作为证据。
2. 如果文档未提及某维度，该维度强制记为 0.0。
3. **决策权重 (Weights)**: 识别客群对哪些维度最敏感（如 B 端看重稳定性 D8）。
4. **黑天鹅 (Outliers)**: 提取文档中极少数极端案例的 DNA。

## Output Format (Strict JSON Only):
{
  "mean": [12 floats],
  "std": [12 floats],
  "weights": [12 floats],
  "outliers": [[12 floats]],
  "evidences": {
    "D1_D4": "证据描述...",
    "D5": "证据描述...",
    "D6": "证据描述...",
    "D8": "证据描述...",
    "D9_D12": "证据描述..."
  }
}
`.trim()

  try {
    const { text: response } = await generateText({
      model,
      system: systemPrompt,
      prompt: text,
    })

    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid JSON')
    const parsed = JSON.parse(jsonMatch[0])
    
    return {
      mean: parsed.mean || [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0, 0, 0, 0],
      std: parsed.std || [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0, 0, 0, 0],
      weights: parsed.weights || [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      outliers: parsed.outliers || [],
      evidences: parsed.evidences || {}
    }
  } catch (error: any) {
    return {
      mean: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0, 0, 0, 0],
      std: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0, 0, 0, 0],
      weights: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      outliers: [],
      evidences: { "ERROR": "AI_AUDIT_TIMEOUT" }
    }
  }
}

/**
 * P1: Strategic Auditor
 * FIX: Data compression to stay under 1MB limit.
 */
export async function runAudit(state: SandboxState): Promise<Partial<SandboxState['assets']>> {
  const { metrics, agents } = state
  
  // CRITICAL FIX: Only pass statistical summaries and a few extreme samples to the AI
  // Passing 10,000 agents raw data causes 1MB+ overflow.
  const sortedByRes = [...agents].sort((a, b) => a.resonance - b.resonance)
  const extremeHaters = sortedByRes.slice(0, 5).map(a => ({ dna: a.vector, r: a.resonance }))
  const extremeFans = sortedByRes.slice(-5).reverse().map(a => ({ dna: a.vector, r: a.resonance }))

  const auditPrompt = `
# Role: 创业战略顾问 (Objective Strategy Advisor)

## Context:
当前系统已完成 10,000 个虚拟用户智能体的压力测试模拟。你需要基于 DRTA 算法产生的 12 维向量数据，提供一份严谨、客观、具备实战指导意义的战略审计。

## Data Input (实时模拟数据):
- 产品核心向量: ${JSON.stringify(state.productVector)}
- 核心指标: 平均共鸣度=${metrics.avgResonance.toFixed(3)}, 转化率=${(metrics.conversionRate*100).toFixed(1)}%, 剩余现金=¥${state.cash.toFixed(0)}
- 极端用户采样:
  流失风险组 (Haters): ${JSON.stringify(extremeHaters)}
  核心拥趸组 (Fans): ${JSON.stringify(extremeFans)}

## Mapping (维度定义):
- D1-D4 [产品/技术核心]: 评估核心功能的完备性、技术实现的硬核程度。
- D5 [进入门槛与摩擦]: 评估用户上手成本、认知负荷、价格阻力。
- D6 [差异化优势]: 评估产品是否具备独特的市场定位与不可替代性。
- D7 [市场传播力]: 评估产品的社交属性与自传播潜能。
- D8 [交付一致性]: 评估服务表现的稳定性，尤其是高意向用户群体中的反馈方差。
- D9-D12 [长期战略潜力]: 评估生态扩展性、壁垒深度及未来的增长曲线。

## Output Format (客观严谨):

1. # 核心基本面评估
   - 客观评价当前技术/产品层面的达成度。
   - 指出该层面的表现是作为“增长引擎”还是“结构性短板”存在。

2. # 用户群体定性采样
   - 提供 2 条具有代表性的模拟用户原声。
   - 采样点 1: 因 D5 (摩擦/成本) 导致流失的潜在用户真实顾虑。
   - 采样点 2: 对 D6 (差异化) 产生高共鸣但在 D8 (一致性) 上有疑虑的资深用户反馈。

3. # 商业逻辑压力诊断
   - 深入分析 D5、D6 与 D8 之间的因果链条。
   - 解释铁粉群体中 D8 (交付一致性) 出现波动的原因：在何种业务场景或逻辑条件下，产品表现会出现不稳定性？
   - 评估当前模型在 10,000 人规模下的“收益密度”与“扩张阻力”。

4. # 战略优化优先级
   - 基于现有数据，给出唯一的最优先改进动作。
   - 必须基于“资源权衡”原则：说明为了强化目标维度，建议在哪些非核心维度上进行策略性取舍或降低投入。

## Constraint:
- 语气：客观、理性、专业。
- 拒绝过度修饰，拒绝主观情绪。
- 500 字以内。
`.trim()

  try {
    const { text: response } = await generateText({
      model,
      prompt: auditPrompt,
    })

    const sections = response.split(/#+\s+/);
    
    return {
      marketFeedback: sections.find(s => s.includes('用户群体定性采样')) || state.assets.marketFeedback,
      stressTestReport: sections.find(s => s.includes('商业逻辑压力诊断')) || state.assets.stressTestReport,
      backlog: sections.find(s => s.includes('战略优化优先级')) || state.assets.backlog,
    }
  } catch (error: any) {
    console.error("Audit failed:", error.message)
    return state.assets
  }
}

/**
 * P1: Initial Proposal Generator
 */
export async function generateProposal(seed: PopulationSeed, text: string): Promise<string> {
  const prompt = `
# Role: 创业孵化专家 (Startup Incubation Expert)

## Task:
基于用户的原始构思 "${text}" 以及初步生成的 DNA 向量 (${JSON.stringify(seed.mean)})，生成一份专业的项目商业提案 (PROPOSAL.md)。

## Content Requirements (大白话/实战导向):
1. # 愿景重构 (Vision Reframing): 用一句话说清你解决了谁的什么痛苦。
2. # 种子用户画像 (Seed Persona): 谁会是第一个为你付钱的人？
3. # 核心挑战分析 (Core Challenges): 直说目前模型中最弱的环节是什么。
4. # MVP 路径图 (MVP Scope): 第一步该做什么，不该做什么。

## Constraint:
- 严禁任何开场白或寒暄。
- 必须使用与输入相同的语言。
- 语气：冷静、专业、极简。
- 严禁黑话，直击痛点。
`.trim()

  try {
    const { text: response } = await generateText({
      model,
      prompt,
    })
    return response.trim()
  } catch (error: any) {
    return "# ERROR: AI_AUDIT_FAILED"
  }
}
