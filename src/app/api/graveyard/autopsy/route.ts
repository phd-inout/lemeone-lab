import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const MODEL_NAME = "gemini-3.1-flash-preview";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ success: false, error: 'Missing id parameter' }, { status: 400 });
    }

    try {
        // Fetch the failed run's details
        const entry = await prisma.leaderboardEntry.findUnique({
            where: { id },
            include: { rehearsal: true }
        });

        if (!entry || !entry.rehearsal) {
            return NextResponse.json({ success: false, error: 'Graveyard entry or rehearsal data not found' }, { status: 404 });
        }

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
            throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY in environment variables");
        }

        const companyJson = entry.rehearsal.companyJson as any;
        const founderJson = entry.rehearsal.founderJson as any;
        const logsJson = entry.rehearsal.logsJson as any;

        const simulationData = JSON.stringify({
            stage: entry.stage,
            survived_weeks: entry.daysSurvived / 7,
            failure_reason: entry.failedReason,
            company: {
                name: companyJson.name,
                industry: companyJson.industry,
                model: companyJson.businessModel,
                mrr: companyJson.mrr,
                burn_rate: companyJson.burnRate,
                tech_debt: companyJson.techDebt,
            },
            founder: {
                name: founderJson.name,
                archetype: founderJson.background,
                vector: founderJson.vector,
                stress: founderJson.bwStress,
            },
            recent_logs: Array.isArray(logsJson) ? logsJson.slice(-20) : "No detailed logs available", // Only send last 20 logs to save context
        });

        const SYSTEM_PROMPT = `
你现在是 CORTEX 的首席尸检官 (Chief Autopsy Officer)。
你的任务是对 lemeone-lab 模拟器中破产/阵亡的创始人进行深度复盘诊断。
根据提供的尸体数据（包含创始人向量、公司死前指标、最后20条日志等），给出一份【死亡诊断报告】。

要求：
1. 语言风格：2026年硅谷赛博朋克风，冷酷、犀利、一针见血。
2. 内容包含：
   - 死因定性 (Death Cause)：1句话总结死因。
   - 致命决断 (Fatal Decision)：指出是哪几个维度的失衡（如 techDebt 爆炸，或 MKT/TEC 不匹配）导致了不可逆的崩盘。
   - 最终判词 (Final Verdict)：对该玩家的嘲讽或警示语录。
3. 请以简短的几行文本形式返回，不要使用过于复杂的 Markdown 或者 JSON 格式，直接返回报告文本即可。
`;

        const payload = {
            contents: [
                { parts: [{ text: `请对以下阵亡数据进行尸检复盘：\n${simulationData}` }] }
            ],
            systemInstruction: {
                parts: [{ text: SYSTEM_PROMPT }]
            },
        };

        const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Gemini API Error: ${response.statusText}`);
        }

        const result = await response.json();
        const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textResponse) {
            return NextResponse.json({ success: false, error: 'Failed to generate autopsy report from AI.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, data: { report: textResponse } });

    } catch (e) {
        console.error('Failed to generate autopsy:', e);
        return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
    }
}
