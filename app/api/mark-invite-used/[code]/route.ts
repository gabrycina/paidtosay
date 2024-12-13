import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(
  request: Request,
  context: { params: Promise<{ code: string }> }
): Promise<NextResponse> {
  try {
    const { code } = (await context.params)
    
    await prisma.inviteCode.update({
      where: { code },
      data: { 
        used: true,
        usedAt: new Date()
      }
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to mark invite as used' }, { status: 500 })
  }
} 