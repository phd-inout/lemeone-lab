import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    try {
        if (id) {
            // Fetch specific ghost run for autopsy
            const entry = await prisma.leaderboardEntry.findUnique({
                where: { id },
                include: { rehearsal: true }
            })
            if (!entry) {
                return NextResponse.json({ success: false, error: 'Graveyard entry not found for this ID' }, { status: 404 })
            }
            return NextResponse.json({ success: true, data: entry })
        } else {
            // Fetch list of graveyard entries (top 50 recent deaths)
            const entries = await prisma.leaderboardEntry.findMany({
                where: { isFailed: true },
                orderBy: { createdAt: 'desc' },
                take: 50,
            })
            return NextResponse.json({ success: true, data: entries })
        }
    } catch (e) {
        console.error('Failed to fetch graveyard data:', e)
        return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
    }
}
