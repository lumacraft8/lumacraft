// src/app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server';
import { readUsersFromYaml, writeUsersToYaml, User } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, token, newPassword } = await request.json();

    if (!email || !token || !newPassword) {
      return NextResponse.json({ error: 'Email, token, and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
        return NextResponse.json({ error: 'La nueva contraseña debe tener al menos 6 caracteres.' }, { status: 400 });
    }

    const users = readUsersFromYaml();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'Usuario no encontrado.' }, { status: 404 });
    }

    const user = users[userIndex];

    if (!user.passwordResetToken || !user.passwordResetExpires || user.passwordResetToken !== token) {
      return NextResponse.json({ error: 'El token de restablecimiento es inválido.' }, { status: 400 });
    }

    if (user.passwordResetExpires < Date.now()) {
      return NextResponse.json({ error: 'El token de restablecimiento ha expirado.' }, { status: 400 });
    }

    // All checks passed, update password and clear token fields
    users[userIndex].password = newPassword;
    users[userIndex].passwordResetToken = null;
    users[userIndex].passwordResetExpires = null;

    writeUsersToYaml(users);

    return NextResponse.json({ message: 'Contraseña restablecida con éxito.' }, { status: 200 });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
