// src/app/api/send-reset-email/route.ts
import { NextResponse } from 'next/server';
import * as nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, resetLink } = await request.json();

    if (!email || !resetLink) {
      return NextResponse.json({ error: 'Email and reset link are required' }, { status: 400 });
    }

    // IMPORTANT: Use environment variables for credentials
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
      console.error('Missing GMAIL_USER or GMAIL_APP_PASSWORD environment variables');
      // Do not expose this error to the client
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user,
        pass: pass,
      },
    });

    // Email options
    const mailOptions = {
      from: `"LumaCraft Network" <${user}>`,
      to: email,
      subject: 'Restablecimiento de Contraseña para LumaCraft Network',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Restablecimiento de Contraseña</h2>
          <p>Hola,</p>
          <p>Recibimos una solicitud para restablecer tu contraseña en LumaCraft Network. Por favor, haz clic en el siguiente enlace para continuar:</p>
          <a href="${resetLink}" style="background-color: #FFD500; color: #1A1829; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Restablecer Contraseña
          </a>
          <p>Si no solicitaste esto, puedes ignorar este correo de forma segura.</p>
          <br/>
          <p>Gracias,</p>
          <p>El equipo de LumaCraft</p>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });

  } catch (error) {
    console.error('Failed to send email:', error);
    // Generic error message to the client
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
