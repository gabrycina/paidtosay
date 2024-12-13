import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const code = (await params).code
    const inviteCode = await prisma.inviteCode.findUnique({
      where: { code },
    })

    if (!inviteCode) {
      return NextResponse.json({ valid: false, error: 'Invalid invite code' }, { status: 404 })
    }

    if (inviteCode.used) {
      return NextResponse.json({ valid: false, error: 'Invite code already used' }, { status: 400 })
    }

    return NextResponse.json({ valid: true, inviteId: inviteCode.id })
  } catch (error) {
    return NextResponse.json({ valid: false, error: 'Server error' }, { status: 500 })
  }
} 