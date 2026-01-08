// src/app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import { readUsersFromYaml } from '@/lib/auth';

// In a real app, you would protect this route to ensure only admins can access it.
// For example, by checking a JWT or session cookie.

export async function GET() {
  try {
    const users = readUsersFromYaml();
    
    // Remove password from all users before sending
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userToReturn } = user;
      return userToReturn;
    });

    return NextResponse.json(usersWithoutPasswords);

  } catch (error) {
    console.error('Get all users error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
