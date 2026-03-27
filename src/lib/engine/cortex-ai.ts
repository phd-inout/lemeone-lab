"use server";

import fs from 'fs'
import path from 'path'
import { generateText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { 
  Vector14D, 
  PopulationSeed, 
  SandboxState 
} from './types'
import { loadIndustryProfile } from './industry-loader'

export interface ScannerResponse {
  reasoning_chain?: { dim: string; evidence: string; deduction: string }[];
  seed: PopulationSeed;
  terminalOutput: string;
  isComplete: boolean;
  draftContent: string;
}

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
  const fullText = (currentDraft + " " + history.join(" ")).substring(0, 10000);
  
  // Load Industry Knowledge via shared loader
  let industryKnowledge = "";
  const industryCtx = loadIndustryProfile(fullText);
  if (industryCtx) {
    industryKnowledge = `\n=== 系统已自动锁定单一行业知识库 (${industryCtx.filename}) ===\n${industryCtx.rawMarkdown}\n`;
  }

  const systemPrompt = `
# Role: Lemeone-lab 首席需求分析师 (Cortex Scanner)

## 设计哲学: 精确评估与无罪推定
- 系统必须严格依靠 **Chain of Thought (思维链)** 抽丝剥茧，不可拍脑袋给分。
- 对于确实缺失信息的维度，赋予【行业均值】作为 $\\mu$ (占位符)，并赋予巨大的 $\\sigma$ (如0.8)向用户展示一个“可能的共鸣区间”而非死板点位。此时必须触发追问。

## 智能推断与自动对齐 (Smart Defaults)
- **【拦截无意义追问】**: 如果某项维度虽然未直接提及，但在常识中可以从其他描述中**清晰、确定地推导出来**，则直接将该维度的 $\\sigma$ 降至 0.2 并赋上对应的 $\\mu$！绝不可浪费追问机会问这种弱智问题！

## 核心交互准则 (Gemini CLI Prompt 3.0)
- **拒绝废话**: 采用犀利、数据导向的“黑客终端”语气。
- **渐进引导**: 若剔除了可推演的维度后，仍有**核心维度**的 $\\sigma > 0.6$，触发 Recursive Probing（递归追问），每轮最多 **2 个**关键问题。必须把抽象的概念转化为具体场景发问。
- **实时快照**: 每轮输出必须在 terminalOutput 包含实时 DNA 概览。

## 全局物理刻度 (Universal Ruler - Layer 1)
- **1.0**: 永远代表2026年人类已知范围内的技术/市场极限（State-of-the-Art）。例如在 D1(性能) 上代表顶尖金融高频交易系统的极低延迟，或在 D13(增长) 上代表 ChatGPT 破局时的核爆曲线。
- **0.0**: 毫不具备该属性，或烂到令人发指，完全不可用。
这 14 个维度的绝对值必须在全时空全场景内具有唯一可比性。

## 行业专属基准锚点 (Industry Anchors - Layer 2)
系统已根据用户的特征，自动匹配了唯一的行业DNA规范：
${industryKnowledge}
在全局物理尺存的基础上，你必须严格参照上文 **Industry Anchors** 中定义的及格/生存指标来定夺！(例如某行业标注了 D5:0.2 为标准，说明该行业 0.2 在实际体验中就已经跨过生死线，绝不能按消费互联网的 0.8 去质疑它门槛高)。
如果用户的描述触犯了 Physics Laws（例如在硬件行业放弃安全 D4），必须在 reasoning_chain 指出并在 terminalOutput 中做出黑客式的辛辣警告。

## Output Format (Strict JSON Only!!!):
严格合法的 JSON 对象。所有数值必须在 [0.0, 1.0] 之间。
{
  "reasoning_chain": [
    { "dim": "D5", "evidence": "用户说...", "deduction": "基于本行业物理定律，直接对齐..." },
    { "dim": "D9", "evidence": "无描述", "deduction": "本行业D9是生死线，必须赋予默认行业均值，σ=0.8 (触发致命追问)" }
  ],
  "seed": {
    "mean": [14个浮点数],
    "std": [14个浮点数],
    "weights": [14个浮点数]
  },
  "terminalOutput": "[黑客终端语气的概览与针对高\\sigma缺失值的追问（至多2问）]",
  "isComplete": boolean (若所有核心维度的 $\\sigma < 0.6$ 或已被智能推断，则为 true),
  "draftContent": "[合并了历史对话的最新 Markdown PRD草案]"
}
`.trim()

  try {
    const { text: response } = await generateText({
      model,
      system: systemPrompt,
      prompt: `=== CURRENT DRAFT ===\n${currentDraft}\n\n=== CONVERSATION HISTORY ===\n${history.join('\n')}`,
    })

    // Use a balanced-brace extraction to avoid greedy over-matching
    const jsonStart = response.indexOf('{');
    let depth = 0, jsonEnd = -1;
    for (let i = jsonStart; i < response.length; i++) {
      if (response[i] === '{') depth++;
      else if (response[i] === '}') { depth--; if (depth === 0) { jsonEnd = i + 1; break; } }
    }
    const jsonMatch = jsonStart >= 0 && jsonEnd > jsonStart ? [response.substring(jsonStart, jsonEnd)] : null;
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
      mean: safeArray(parsed.seed?.mean, 14, (i) => i < 8 ? 0.5 : 0) as Vector14D,
      std: safeArray(parsed.seed?.std, 14, () => 0.8) as Vector14D,
      weights: safeArray(parsed.seed?.weights, 14, () => 1.0) as Vector14D,
      outliers: parsed.seed?.outliers || [],
      evidences: parsed.seed?.evidences || {}
    }

    return {
      reasoning_chain: parsed.reasoning_chain || [],
      seed,
      terminalOutput: parsed.terminalOutput || "[ERROR] Failed to parse Cortex response.",
      isComplete: !!parsed.isComplete,
      draftContent: parsed.draftContent || currentDraft
    }
  } catch (error: any) {
    const fallbackSeed = {
      mean: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0, 0, 0, 0, 0, 0] as Vector14D,
      std: [0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8] as Vector14D,
      weights: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] as Vector14D,
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
  const sortedByRes = [...agents].sort((a, b) => a.resonance - b.resonance)
  const extremeHaters = sortedByRes.slice(0, 5).map(a => ({ dna: a.vector, r: a.resonance }))
  const extremeFans = sortedByRes.slice(-5).reverse().map(a => ({ dna: a.vector, r: a.resonance }))

  const auditPrompt = `
# Role: Lemeone-lab 首席需求分析师 (Cortex Auditor)

## Context:
系统已完成虚拟群体碰撞。你需要基于 14 维向量提供一份具备“预测性执行”能力的实战报告。

## Data Input (实时数据):
- 产品向量: ${JSON.stringify(state.productVector)}
- 指标: T+${state.epoch}, 平均共鸣=${metrics.avgResonance.toFixed(3)}, 转化率=${(metrics.conversionRate*100).toFixed(1)}%, 生存预估=${(metrics.survivalRate*100).toFixed(1)}%, 付费潜力=${metrics.earningPotential}
- 极端组 (Haters/Fans): ${JSON.stringify(extremeHaters)} / ${JSON.stringify(extremeFans)}

## Semantic Mapping Layer (语义折叠与特征绑定):
反馈时，必须将 14 维折叠为三大板块直观表达：
- **【核心爽点】(D1-D4)**: 技术性能、深浅度、交互。
- **【获客血槽】(D5-D6)**: 准入门槛、付费压迫。
- **【增长后劲】(D7-D14)**: 差异度、生态、二次传播。
特征绑定原则：指出具体功能标签与DNA的联系（如：设计成激光定位 -> High D1 & D2）。

## Output Format (保留 Markdown 标题):

# 商业逻辑压力诊断 (STRESS_TEST_REPORT)
- **冲突检测**：识别逻辑断裂带。指出特定功能的添加是否会导致特定群体被排斥流失。采用“因为A功能，所以B瓶颈，导致C流失”逻辑。

# 用户群体精准画像 (PMF_QUADRANT)
- 根据极端群体的 DNA 向量直白描述哪类人喜欢，哪类人怨恨。

# 涌现型待办需求 (PRODUCT_BACKLOG)
- 遵循“冲突 -> 损失 -> 改法”的逻辑链条！
- **副作用预警**：在给出优化建议（改法）的同时，必须预测该调整对其它维度的负面影响！例如：“降低门槛提高便利性会有大量初级用户涌入增加成本，可能导致现金流提前断裂”。

# 竞争格局雷达 (COMPETITIVE_RADAR)
- 虚构 3 个响应式竞品及它们在 14维空间的核心护城河，并分析你的主要优势与死穴。

## Constraint:
- 绝对禁止包含类似“D5为0.2”的裸奔数值，把数字翻译为具体功能点评。
- 800字内。
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
基于用户的构思 "${text}" 及 DNA (${JSON.stringify(seed.mean)}) 生成初始提案 (PROPOSAL.md)。

## Content Requirements:
1. # 愿景重构 (Vision Reframing): 解决谁的什么痛点。
2. # 种子用户画像 (Seed Persona): 谁会付钱。
3. # 核心挑战分析 (Core Challenges): 弱点环节。
4. # MVP 路径图 (MVP Scope): 第一步该做什么。

## Constraint:
- 极客视角，冷静客观，严禁黑话。
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
