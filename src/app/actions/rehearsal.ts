"use server";

import { v4 as uuidv4 } from 'uuid'
import { SandboxState } from '@/lib/engine/types'
import { prisma } from '@/lib/prisma'

/**
 * Creates a brand new Rehearsal record for the 2.0 Gravity Sandbox.
 */
export async function createRehearsal(sessionId: string, projectId: string, state: SandboxState): Promise<string> {
    try {
        const localUserId = 'local-user';
        const rehearsal = await prisma.rehearsal.create({
            data: {
                sessionId,
                userId: localUserId,
                projectId,
                productVector: JSON.stringify(state.productVector),
                assets: JSON.stringify(state.assets),
                cash: state.metrics.earningPotential,
                techDebt: state.techDebt,
                weekNumber: state.epoch,
                currentStage: state.currentStage,
                isFailed: false
            }
        });
        return rehearsal.id;
    } catch (e) {
        console.error("[DB] Failed to create rehearsal:", e);
        throw e;
    }
}

/**
 * Synchronizes the SandboxState to Supabase.
 */
export async function syncRehearsal(rehearsalId: string, state: SandboxState): Promise<void> {
    if (!rehearsalId) return;

    try {
        await prisma.rehearsal.update({
            where: { id: rehearsalId },
            data: {
                productVector: JSON.stringify(state.productVector),
                assets: JSON.stringify(state.assets),
                cash: state.metrics.earningPotential,
                techDebt: state.techDebt,
                weekNumber: state.epoch,
                currentStage: state.currentStage,
            }
        });
    } catch (e) {
        console.error("[DB] Failed to sync rehearsal:", e);
    }
}
