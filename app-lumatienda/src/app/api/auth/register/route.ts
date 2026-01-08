// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { readUsersFromYaml, writeUsersToYaml, User } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password, nickname } = await request.json();

    if (!email || !password || !nickname) {
      return NextResponse.json({ error: 'Email, password, and nickname are required' }, { status: 400 });
    }

    const users = readUsersFromYaml();

    // Validations
    if (users.some(u => u.email === email)) {
      return NextResponse.json({ error: 'Este correo ya está registrado.' }, { status: 409 });
    }
    if (users.some(u => u.nickname.toLowerCase() === nickname.toLowerCase())) {
      return NextResponse.json({ error: 'Este nombre de usuario (nickname) ya está en uso.' }, { status: 409 });
    }

    const isAdmin = users.length === 0; // First user is admin

    const newUser: User = {
      email,
      password, // In a real app, this should be hashed!
      nickname,
      discordName: null,
      coins: 0,
      isAdmin,
      isEmailVerified: false,
      emailVerificationCode: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      bannedUntil: undefined,
    };

    users.push(newUser);
    writeUsersToYaml(users);

    // Return the new user, but without the password
    const { password: _, ...userToReturn } = newUser;

    return NextResponse.json(userToReturn, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred during registration.' }, { status: 500 });
  }
}
