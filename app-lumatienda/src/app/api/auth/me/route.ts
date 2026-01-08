// src/app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { readUsersFromYaml, User } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const users = readUsersFromYaml();
    const userByEmail = users.find(u => u.email === email);

    if (!userByEmail) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return the user, but without the password for security
    const { password: _, ...userToReturn } = userByEmail;

    return NextResponse.json(userToReturn, { status: 200 });

  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
