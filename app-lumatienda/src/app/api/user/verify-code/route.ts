// src/app/api/user/verify-code/route.ts
import { NextResponse } from 'next/server';
import { readUsersFromYaml, writeUsersToYaml } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 });
    }

    const users = readUsersFromYaml();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users[userIndex];

    if (user.emailVerificationCode !== code) {
      return NextResponse.json({ error: 'El código introducido es incorrecto.' }, { status: 400 });
    }

    // Code is correct, update user
    users[userIndex].isEmailVerified = true;
    users[userIndex].emailVerificationCode = null;
    writeUsersToYaml(users);
    
    // Return updated user (without sensitive info)
    const { password, ...updatedUser } = users[userIndex];

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error('Verify code error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
