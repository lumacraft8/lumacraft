// src/app/api/auth/request-password-reset/route.ts
import { NextResponse } from 'next/server';
import { readUsersFromYaml, writeUsersToYaml, User } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const users = readUsersFromYaml();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      // Still return a success-like message to prevent user enumeration
      return NextResponse.json({ message: 'If an account with that email exists, a reset link has been sent.' });
    }

    // Generate token and expiry
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetExpires = Date.now() + 3600000; // 1 hour from now

    // Update user object in the array
    users[userIndex].passwordResetToken = resetToken;
    users[userIndex].passwordResetExpires = resetExpires;

    // Write the entire updated user list back to the YAML file
    writeUsersToYaml(users);

    // Construct the reset link to send back to the client
    const origin = new URL(request.url).origin;
    const resetLink = `${origin}/reset-password?token=${resetToken}&email=${email}`;
    
    // Return the link so the client can trigger the email sending API
    return NextResponse.json({ resetLink });

  } catch (error) {
    console.error('Request password reset error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
