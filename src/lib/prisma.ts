// Prisma 7 client using builtin adapter
import { PrismaClient } from '@prisma/client'

function createPrismaClient() {
    // For Prisma 7 without adapter, we can set DATABASE_URL in environment
    process.env.DATABASE_URL = "file:./lemeone.db"
    return new PrismaClient()
}

const globalForPrisma = global as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma || createPrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
