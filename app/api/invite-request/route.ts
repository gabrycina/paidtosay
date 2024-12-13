import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, platform, followerCount, category } = body;

    if (!email || !platform || !followerCount || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await prisma.inviteRequest.create({
      data: {
        email,
        platform,
        category,
        followerCount: parseInt(followerCount)
      }
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to submit invite request' },
      { status: 500 }
    );
  }
} 