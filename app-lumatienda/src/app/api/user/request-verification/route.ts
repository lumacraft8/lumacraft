// src/app/api/user/request-verification/route.ts
import { NextResponse } from 'next/server';
import { readUsersFromYaml, writeUsersToYaml } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const users = readUsersFromYaml();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    if (users[userIndex].isEmailVerified) {
      return NextResponse.json({ error: 'Email is already verified' }, { status: 400 });
    }

    // Generate code and update user
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    users[userIndex].emailVerificationCode = verificationCode;
    writeUsersToYaml(users);

    // In a real app, you'd send this code via email. Here, we log it for testing.
    console.log(`CÓDIGO DE VERIFICACIÓN PARA ${email}: ${verificationCode}`);

    return NextResponse.json({ message: 'Verification code generated.', verificationCode });

  } catch (error) {
    console.error('Request verification error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
