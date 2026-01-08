// src/app/api/send-generic-email/route.ts
import { NextResponse } from 'next/server';
import * as nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json();

    if (!to || !subject || !html) {
      return NextResponse.json({ error: 'To, Subject, and HTML content are required' }, { status: 400 });
    }

    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
      console.error('Missing GMAIL_USER or GMAIL_APP_PASSWORD environment variables');
      return NextResponse.json({ error: 'Server configuration error: Email credentials missing.' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user,
        pass: pass,
      },
    });

    const mailOptions = {
      from: `"LumaCraft Network" <${user}>`, // Use the new app name
      to: to,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });

  } catch (error) {
    console.error('Failed to send generic email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
