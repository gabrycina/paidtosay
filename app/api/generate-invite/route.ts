import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

export async function POST() {
  try {
    // Generate a random 8-character code
    const code = crypto.randomBytes(4).toString('hex')

    const inviteCode = await prisma.inviteCode.create({
      data: {
        code,
      },
    })

    return NextResponse.json({ code: inviteCode.code })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate invite' }, { status: 500 })
  }
}
