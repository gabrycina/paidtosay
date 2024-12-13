import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { brandName, amount, currency, platform, category, followerCount, inviteId, description } = body

    if (!inviteId) {
      return NextResponse.json({ error: 'Invalid invite code' }, { status: 400 })
    }

    const submission = await prisma.submission.create({
      data: {
        brandName,
        amount: parseFloat(amount),
        currency,
        platform,
        category,
        followerCount: parseInt(followerCount),
        inviteId,
        description: description || undefined,
      },
    })

    return NextResponse.json(submission, { status: 201 })
  } catch (error) {
    console.error('Error creating submission:', error)
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    )
  }
} 