import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        // According to the design document, the leaderboard shows the top 20 most efficient founders
        const topEntries = await prisma.leaderboardEntry.findMany({
            where: { isFailed: false },
            orderBy: { efficiencyScore: 'desc' },
            take: 20,
        })
        return NextResponse.json({ success: true, data: topEntries })
    } catch (e) {
        console.error('Failed to fetch leaderboard:', e)
        return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
    }
}
