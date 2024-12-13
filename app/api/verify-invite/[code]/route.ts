import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params

    const inviteCode = await prisma.inviteCode.findUnique({
      where: { code: code }
    })

    if (!inviteCode) {
      return NextResponse.json({ error: 'Invalid invite code' }, { status: 404 })
    }

    if (inviteCode.used) {
      return NextResponse.json({ error: 'Invite code already used' }, { status: 400 })
    }

    return NextResponse.json({ valid: true })
  } catch {
    return NextResponse.json({ error: 'Failed to verify invite code' }, { status: 500 })
  }
} 