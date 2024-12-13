import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, platform, username, followers } = body;

    // Validate the input
    if (!email || !platform || !username || !followers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the invite request in the database
    const inviteRequest = await prisma.inviteRequest.create({
      data: {
        email,
        platform,
        username,
        followers: parseInt(followers),
        status: 'pending'
      },
    });

    return NextResponse.json(
      { message: 'Invite request submitted successfully' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating invite request:', error);
    return NextResponse.json(
      { error: 'Failed to submit invite request' },
      { status: 500 }
    );
  }
} 