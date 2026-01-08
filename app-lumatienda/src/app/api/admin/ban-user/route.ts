// src/app/api/admin/ban-user/route.ts
import { NextResponse } from 'next/server';
import { readUsersFromYaml, writeUsersToYaml } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, hours } = await request.json();

    if (!email || !hours) {
      return NextResponse.json({ error: 'Email and ban duration (hours) are required' }, { status: 400 });
    }

    const users = readUsersFromYaml();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Prevent banning an admin
    if (users[userIndex].isAdmin) {
      return NextResponse.json({ error: 'Cannot ban an administrator.' }, { status: 403 });
    }

    const banDurationMs = parseInt(hours) * 60 * 60 * 1000;
    users[userIndex].bannedUntil = Date.now() + banDurationMs;

    writeUsersToYaml(users);

    const { password, ...updatedUser } = users[userIndex];
    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error('Ban user error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
