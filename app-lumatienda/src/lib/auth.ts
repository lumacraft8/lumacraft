// src/lib/auth.ts
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// Define a consistent User type for the backend
export interface User {
  email: string;
  password?: string;
  nickname: string;
  discordName?: string | null;
  coins?: number;
  isAdmin?: boolean;
  isEmailVerified?: boolean;
  emailVerificationCode?: string | null;
  passwordResetToken?: string | null;
  passwordResetExpires?: number | null;
  bannedUntil?: number;
}

const authFilePath = path.resolve(process.cwd(), 'auths.yml');

export function readUsersFromYaml(): User[] {
  try {
    if (!fs.existsSync(authFilePath)) {
      // If file doesn't exist, create it with an empty array
      fs.writeFileSync(authFilePath, '[]', 'utf8');
      return [];
    }
    const fileContents = fs.readFileSync(authFilePath, 'utf8');
    const users = yaml.load(fileContents) as User[];
    // Ensure it's always an array
    return Array.isArray(users) ? users : [];
  } catch (e) {
    console.error('Error reading or parsing auths.yml:', e);
    return []; // Return empty array on error
  }
}

export function writeUsersToYaml(users: User[]): void {
  try {
    const yamlStr = yaml.dump(users);
    fs.writeFileSync(authFilePath, yamlStr, 'utf8');
  } catch (e) {
    console.error('Error writing to auths.yml:', e);
  }
}
