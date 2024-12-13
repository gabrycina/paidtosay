import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { brandName, amount, currency, platform, category, followerCount, inviteCode, description } = body

    // Find the invite code first
    const invite = await prisma.inviteCode.findUnique({
      where: { code: inviteCode }
    })

    if (!invite) {
      return NextResponse.json({ error: 'Invalid invite code' }, { status: 404 })
    }

    if (invite.used) {
      return NextResponse.json({ error: 'Invite code already used' }, { status: 400 })
    }

    // Create the submission
    const submission = await prisma.submission.create({
      data: {
        brandName,
        amount,
        currency,
        platform,
        category,
        followerCount,
        description,
        inviteId: invite.id
      },
    })

    return NextResponse.json(submission)
  } catch {
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    )
  }
} 