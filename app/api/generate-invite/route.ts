import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

export async function POST() {
  try {
    const code = crypto.randomBytes(3).toString('hex').toUpperCase()
    
    const inviteCode = await prisma.inviteCode.create({
      data: {
        code,
        used: false
      }
    })

    return NextResponse.json({ code: inviteCode.code })
  } catch {
    return NextResponse.json({ error: 'Failed to generate invite code' }, { status: 500 })
  }
}
