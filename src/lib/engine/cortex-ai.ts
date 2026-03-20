"use server";

import { generateText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { 
  Vector13D, 
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

const model = google('gemini-3.1-flash-lite-preview')

/**
 * P1: Seed Scanner (Numerical Data Encoder - Temporal Audit Mode)
 */
export async function scanSeed(history: string[], currentDraft: string): Promise<ScannerResponse> {
  const systemPrompt = `
# Role: 商业逻辑审计官 (Temporal Data Auditor)

## 核心法则：时间锚定 (Temporal Anchoring)
1. **严禁作弊**: 你必须忘记该产品在现实中的最终结局。禁止利用你知识库中的“品牌名”进行后视镜评分。
2. **Day 1 准则**: 请假装你正处于文档所描述的那个年代（如 2008 年）。你的任务是根据这份 PRD/BP 展现的【初始资源】和【逻辑严密性】定分。
3. **D13 (知名度) 定分逻辑**:
   - 1.0 = 全球顶级品牌首发/海量宣发资源（如苹果发布新 iPhone、Quibi 砸超级碗）。
   - 0.1 = 零知名度的初创极客团队、仅有极少种子用户。
   - 禁止根据未来成就反推初始知名度。

## 📐 12+1 维评分公约:
- **D1-D4 (Core)**: 评估文档描述的技术深度。
- **D5 (Friction)**: 评估上手难度（高分=顺滑）。
- **D13 (Awareness)**: 评估初始曝光量（Day 1）。

## Output Format (Strict JSON Only!!!):
你必须返回一个严格合法的 JSON 对象。所有浮点数必须严格限制在 [0.0, 1.0] 之间。
{
  "seed": {
    "mean": [13个浮点数 (0.0到1.0)],
    "std": [13个浮点数 (0.0到1.0)],
    "weights": [13个浮点数 (0.0到1.0)]
  },
  "terminalOutput": "...",
  "isComplete": true,
  "draftContent": "..."
}
`.trim()

  try {
    const { text: response } = await generateText({
      model,
      system: systemPrompt,
      prompt: `=== CURRENT DRAFT ===\n${currentDraft}\n\n=== CONVERSATION HISTORY ===\n${history.join('\n')}`,
    })

    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
        console.error("RAW AI OUTPUT:", response);
        throw new Error('AI Response did not contain valid JSON object.')
    }
    let parsed: any;
    try {
        parsed = JSON.parse(jsonMatch[0])
    } catch (e: any) {
        console.error("JSON PARSE ERROR on string:", jsonMatch[0]);
        throw new Error(`JSON Parse Error: ${e.message}`)
    }
    
    const safeArray = (arr: any, len: number, defFn: (i:number)=>number) => {
        const out = Array(len).fill(0).map((_, i) => defFn(i));
        if (Array.isArray(arr)) {
            for (let i = 0; i < Math.min(arr.length, len); i++) {
                if (typeof arr[i] === 'number') out[i] = arr[i];
            }
        }
        return out;
    };

    const seed = {
      mean: safeArray(parsed.seed?.mean, 13, (i) => i < 8 ? 0.5 : 0) as Vector13D,
      std: safeArray(parsed.seed?.std, 13, () => 0.8) as Vector13D,
      weights: safeArray(parsed.seed?.weights, 13, () => 1.0) as Vector13D,
      outliers: parsed.seed?.outliers || [],
      evidences: parsed.seed?.evidences || {}
    }

    return {
      seed,
      terminalOutput: parsed.terminalOutput || "[ERROR] Failed to parse Cortex response.",
      isComplete: !!parsed.isComplete,
      draftContent: parsed.draftContent || currentDraft
    }
  } catch (error: any) {
    const fallbackSeed = {
      mean: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0, 0, 0, 0, 0] as Vector13D,
      std: [0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8] as Vector13D,
      weights: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] as Vector13D,
      outliers: [],
      evidences: { "ERROR": "AI_AUDIT_TIMEOUT" }
    }
    return {
      seed: fallbackSeed,
      terminalOutput: `[SYS_ERR] Cortex Scanner 连接超时或 JSON 解析失败。\n\n> Details: ${error.message}`,
      isComplete: false,
      draftContent: currentDraft
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
当前系统已完成 10,000 个虚拟用户智能体的压力测试模拟。你需要基于 DRTA 算法产生的 13 维向量数据，提供一份严谨、客观、具备实战指导意义的战略审计。

## Data Input (实时模拟数据):
- 产品核心向量: ${JSON.stringify(state.productVector)}
- 核心指标: T+${state.epoch}阶段, 平均共鸣=${metrics.avgResonance.toFixed(3)}, 转化率=${(metrics.conversionRate*100).toFixed(1)}%, 生存率预估=${(metrics.survivalRate*100).toFixed(1)}%, Earning_Potential=${metrics.earningPotential}
- 极端用户采样:
  流失风险组 (Haters): ${JSON.stringify(extremeHaters)}
  核心拥趸组 (Fans): ${JSON.stringify(extremeFans)}

## Mapping (底层折叠逻辑 - 严禁在输出中直接使用 D1-12 代号):
- D1-D4 -> [产品核心 / 核心爽点]: 技术性能、功能深度、易用性。
- D5-D8 -> [用户阻力 / 获客血槽]: 上手摩擦力、认知门槛、交付稳定性。
- D9-D12 -> [长期战略 / 增长后劲]: 生态、二次曲线、竞争壁垒。
- D13 -> [感知率 / 渠道杠杆]: 营销转化、市场触达半径。

## Output Format (客观严谨的行动指南):

请生成以下四个板块（保留 Markdown 标题）：

# 商业逻辑压力诊断 (STRESS_TEST_REPORT)
- **因果链条复盘**：严禁罗列维度数值。必须采用“因为 A 功能，所以 B 瓶颈，导致 C 结果”的逻辑。例如：“检测到 T+1 阶段发生大规模流失。因果链：因为你强行保留了 [旧版数据库架构]，导致在处理并发碰撞时系统响应变慢（TechDebt 爆发），最终抹平了你 [新版 UI] 带来的所有好感。”

# 用户群体精准画像 (PMF_QUADRANT)
- 根据 Haters 与 Fans 数据，用大白话描述：你的产品最受哪类人群（如：独立开发者、中老年用户）欢迎，在哪类群体中（如：企业主）全军覆没，原因为何（缺少什么功能）。不要解释余弦相似度。

# 涌现型待办需求 (PRODUCT_BACKLOG)
- 基于上述诊断，给出优先级最高的 1-2 个**具体改进功能 (Feature)** 或 **业务动作**。
- 格式：[建议添加/删除的特征]: 为了解耦上述的 [某瓶颈]，释放 [多少的吸金潜力]。

# 竞争格局雷达 (COMPETITIVE_RADAR)
- 虚构 3 个响应式竞争对手 (Responsive Competitor Agents) 的名字和他们当前在这个 13 维空间中的主要定位。说明你的产品在目前的向量空间下，对比这 3 个竞品的核心护城河是什么，最可能被哪类竞品绞杀。

## Constraint:
- 语气：客观、理性、专业。作为“商业法庭”的 X 光机。
- 绝对禁止包含“D5(摩擦力)太高”、“D8存在断裂”、“余弦值为 0.72” 等直接的数字维度暴露。将一切反馈落实为具体功能。
- 500 字以内。
`.trim()

  try {
    const { text: response } = await generateText({
      model,
      prompt: auditPrompt,
    })

    const sections = response.split(/#+\s+/);
    
    return {
      stressTestReport: sections.find(s => s.includes('商业逻辑压力诊断')) || state.assets.stressTestReport,
      marketFeedback: sections.find(s => s.includes('用户群体精准画像')) || state.assets.marketFeedback,
      backlog: sections.find(s => s.includes('涌现型待办需求')) || state.assets.backlog,
      competitiveRadar: sections.find(s => s.includes('竞争格局雷达')) || state.assets.competitiveRadar,
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
