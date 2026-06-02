"use server";

import { prisma } from '@/lib/prisma';
import { ProjectData, SandboxState } from '@/lib/engine/types';

/**
 * Creates a new Project for the user.
 */
export async function createProjectAction(name: string, description?: string): Promise<string> {
    try {
        // Automatically ensure a local user exists
        const localUserId = 'local-user';
        await prisma.user.upsert({
            where: { id: localUserId },
            update: {},
            create: {
                id: localUserId,
                email: 'local@lemeone.com',
                username: 'Local Admin',
            }
        });

        const project = await prisma.project.create({
            data: {
                name,
                description,
                userId: localUserId,
            }
        });
        return project.id;
    } catch (e) {
        console.error("[DB] Failed to create project:", e);
        throw e;
    }
}

/**
 * Lists all Projects for the current user.
 */
export async function listProjectsAction(): Promise<ProjectData[]> {
    try {
        const localUserId = 'local-user';
        const projects = await prisma.project.findMany({
            where: { userId: localUserId },
            orderBy: { createdAt: 'desc' }
        });

        return projects.map((p: any) => ({
            id: p.id,
            name: p.name,
            description: p.description || undefined,
            createdAt: p.createdAt.toISOString()
        }));
    } catch (e) {
        console.error("[DB] Failed to list projects:", e);
        return [];
    }
}

/**
 * Load the latest Rehearsal (SandboxState) for a project.
 */
export async function loadLatestRehearsalAction(projectId: string): Promise<any | null> {
    try {
        const rehearsal = await prisma.rehearsal.findFirst({
            where: { projectId },
            orderBy: { createdAt: 'desc' }
        });

        if (!rehearsal) return null;

        const parsedAssets = rehearsal.assets ? JSON.parse(rehearsal.assets as string) : {};
        const metadata = parsedAssets.__metadata || {};
        delete parsedAssets.__metadata; // Keep the standard assets clean

        // Note: agents are not persisted, frontend handles re-hydration
        return {
            id: rehearsal.id,
            projectId: rehearsal.projectId,
            epoch: rehearsal.weekNumber,
            techDebt: rehearsal.techDebt,
            currentStage: rehearsal.currentStage,
            metrics: {
                earningPotential: rehearsal.cash,
            },
            productVector: rehearsal.productVector ? JSON.parse(rehearsal.productVector as string) : [],
            assets: parsedAssets,
            history: rehearsal.historyJson ? JSON.parse(rehearsal.historyJson as string) : [],
            
            // Metadata unpacked from JSON storage
            teamSize: metadata.teamSize || 'STARTUP',
            userARPU: metadata.userARPU || 45,
            industryId: metadata.industryId || null,
            industryName: metadata.industryName || null,
            industryBaselineARPU: metadata.industryBaselineARPU || 45,
            monetization: metadata.monetization || {
                model: 'SUBSCRIPTION',
                hardwarePrice: 0,
                monthlyFee: metadata.userARPU || 45
            },
            seedText: metadata.seedText || 'Restored Project',
            techDebtLambda: metadata.techDebtLambda || 0.5,
        };
    } catch (e) {
        console.error("[DB] Failed to load rehearsal:", e);
        return null;
    }
}
