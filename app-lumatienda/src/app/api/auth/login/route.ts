// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { readUsersFromYaml, User } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const users = readUsersFromYaml();
    const userByEmail = users.find(u => u.email === email);

    if (!userByEmail) {
      return NextResponse.json({ error: 'Esta cuenta no está registrada.' }, { status: 404 });
    }

    if (userByEmail.password !== password) {
      return NextResponse.json({ error: 'Contraseña incorrecta.' }, { status: 401 });
    }

    // At this point, user is authenticated
    const user = userByEmail;

    // Check if user is banned
    if (user.bannedUntil && user.bannedUntil > Date.now()) {
      const banExpires = new Date(user.bannedUntil).toLocaleString();
      return NextResponse.json({ error: `Tu cuenta está suspendida hasta: ${banExpires}.` }, { status: 403 });
    }

    // Return the user, but without the password for security
    const { password: _, ...userToReturn } = user;

    return NextResponse.json(userToReturn, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred during login.' }, { status: 500 });
  }
}
