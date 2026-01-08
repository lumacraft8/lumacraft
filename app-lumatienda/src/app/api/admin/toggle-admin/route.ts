// src/app/api/admin/toggle-admin/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';

// Define the User type
interface User {
  email: string;
  nickname: string;
  discordName: string | null;
  coins: number;
  isAdmin?: boolean;
  bannedUntil?: number;
  password?: string;
  isEmailVerified?: boolean;
  emailVerificationCode?: string | null;
  passwordResetToken?: string | null;
  passwordResetExpires?: number | null;
}

const authsFilePath = path.join(process.cwd(), 'auths.yml');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email: userEmailToToggle } = body;

    if (!userEmailToToggle) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Read and parse the YAML file
    const fileContents = await fs.readFile(authsFilePath, 'utf8');
    const users: User[] = yaml.load(fileContents) as User[];

    let userFound = false;
    const updatedUsers = users.map(user => {
      if (user.email === userEmailToToggle) {
        userFound = true;
        // Toggle the isAdmin status
        user.isAdmin = !user.isAdmin;
      }
      return user;
    });

    if (!userFound) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Write the updated data back to the YAML file
    const newYamlContent = yaml.dump(updatedUsers);
    await fs.writeFile(authsFilePath, newYamlContent, 'utf8');

    return NextResponse.json({ message: 'Admin status updated successfully.' });
  } catch (error) {
    console.error('Error toggling admin status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
