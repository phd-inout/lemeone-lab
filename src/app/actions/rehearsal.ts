"use server";

import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { GameState } from '@/lib/engine/types'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'

/**
 * Check if a company name already exists in the database.
 * We look through the companyJson objects of existing rehearsals.
 */
export async function checkCompanyNameUnique(name: string): Promise<boolean> {
    try {
        // Find if any rehearsal has this exact company name
        const existing = await prisma.rehearsal.findFirst({
            where: {
                companyJson: {
                    path: ['name'],
                    equals: name
                }
            }
        });
        return existing === null;
    } catch (e) {
        console.error("Failed to check company name uniqueness", e);
        return true; // fail open if DB is not reachable for some reason
    }
}

/**
 * Creates a brand new Rehearsal record after the company is initialized.
 */
export async function createRehearsal(sessionId: string, gameState: GameState): Promise<string> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const rehearsal = await prisma.rehearsal.create({
            data: {
                sessionId,
                userId: user?.id || null, // 绑定当前登录用户的 ID
                founderJson: gameState.founder as any,
                companyJson: gameState.company as any,
                currentStage: gameState.company.stage,
                weekNumber: gameState.company.weekNumber,
                isFailed: gameState.isFailed,
                failureReason: gameState.failureReason,
                ideaScore: gameState.company.ideaScore?.total,
                ideaJson: gameState.company.ideaScore as any,
                logsJson: gameState.logs as any
            }
        });
        return rehearsal.id;
    } catch (e) {
        console.error("Failed to create rehearsal", e);
        throw e;
    }
}

/**
 * Synchronizes the running GameState to the database during sprints or dividends.
 */
export async function syncRehearsal(rehearsalId: string, gameState: GameState): Promise<void> {
    if (!rehearsalId) return;

    try {
        await prisma.rehearsal.update({
            where: { id: rehearsalId },
            data: {
                founderJson: gameState.founder as any,
                companyJson: gameState.company as any,
                currentStage: gameState.company.stage,
                weekNumber: gameState.company.weekNumber,
                isFailed: gameState.isFailed,
                failureReason: gameState.failureReason,
                logsJson: gameState.logs as any
            }
        });

        // Sprint 8: Leaderboard DB Integration
        // If the run has ended (failed or reached TITAN), update the LeaderboardEntry
        if (gameState.isFailed || gameState.company.stage === 'TITAN') {
            const valuation = (gameState.company.mrr * 10) + (gameState.company.moat * 1000) + gameState.company.cash;
            // VpB = total value / bandwidth consumed (approximated by weekNumber * 80)
            const efficiencyScore = valuation / Math.max(1, gameState.company.weekNumber * 80);
            const daysSurvived = gameState.company.weekNumber * 7;

            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();

            await prisma.leaderboardEntry.upsert({
                where: { rehearsalId },
                update: {
                    valuation,
                    efficiencyScore,
                    daysSurvived,
                    isFailed: gameState.isFailed,
                    failedReason: gameState.failureReason,
                    stage: gameState.company.stage,
                    userId: user?.id || undefined, // 更新时如果是登录状态也补上
                },
                create: {
                    rehearsalId,
                    userId: user?.id || null, // 创建时绑定用户
                    founderName: gameState.founder.name,
                    archetype: gameState.founder.background,
                    stage: gameState.company.stage,
                    valuation,
                    efficiencyScore,
                    daysSurvived,
                    isFailed: gameState.isFailed,
                    failedReason: gameState.failureReason,
                    isPublic: true,
                }
            });
        }
    } catch (e) {
        console.error("Failed to sync rehearsal", e);
    }
}
