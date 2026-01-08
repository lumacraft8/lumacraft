// src/app/api/admin/delete-user/route.ts
import { NextResponse } from 'next/server';
import { readUsersFromYaml, writeUsersToYaml } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const users = readUsersFromYaml();
    const userToDelete = users.find(u => u.email === email);

    if (!userToDelete) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent deleting an admin
    if (userToDelete.isAdmin) {
      return NextResponse.json({ error: 'Cannot delete an administrator.' }, { status: 403 });
    }
    
    const updatedUsers = users.filter(u => u.email !== email);
    writeUsersToYaml(updatedUsers);

    return NextResponse.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Admin delete user error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
