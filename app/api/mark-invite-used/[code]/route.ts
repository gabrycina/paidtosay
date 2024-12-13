import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const code = (await params).code
    
    await prisma.inviteCode.update({
      where: { code: code },
      data: { 
        used: true,
        usedAt: new Date()
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to mark invite as used' }, { status: 500 })
  }
} 