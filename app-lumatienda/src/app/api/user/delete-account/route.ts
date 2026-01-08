// src/app/api/user/delete-account/route.ts
import { NextResponse } from 'next/server';
import { readUsersFromYaml, writeUsersToYaml } from '@/lib/auth';

// We use POST here because DELETE requests in browsers often don't carry a body easily.
// A more RESTful approach might use DELETE /api/user with credentials in headers.
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required for deletion' }, { status: 400 });
    }

    const users = readUsersFromYaml();
    const user = users.find(u => u.email === email);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify password before deleting
    if (user.password !== password) {
      return NextResponse.json({ error: 'Contraseña incorrecta.' }, { status: 401 });
    }
    
    const updatedUsers = users.filter(u => u.email !== email);
    writeUsersToYaml(updatedUsers);

    return NextResponse.json({ message: 'Account deleted successfully' });

  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
