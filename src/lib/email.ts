import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
  email: string,
  name: string,
  token: string
) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  await resend.emails.send({
    from: "Nikhil Sahni <hello@nikhilsahni.me>",
    to: email,
    subject: "Verify your email address",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Verify Your Email</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 0;
              background-color: #f4f4f5;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              padding: 32px;
              background-color: #ffffff;
              border-radius: 12px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            }
            .logo {
              margin-bottom: 24px;
              text-align: center;
            }
            h2 {
              color: #111827;
              font-size: 24px;
              margin-bottom: 16px;
              font-weight: 600;
            }
            p {
              color: #4b5563;
              font-size: 16px;
              margin: 8px 0;
            }
            .button {
              display: inline-block;
              padding: 12px 32px;
              background-color: #6366f1;
              color: white !important;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 500;
              margin: 24px 0;
              box-shadow: 0 2px 4px rgba(99, 102, 241, 0.2);
            }
            .button:hover {
              background-color: #4f46e5;
            }
            .footer {
              margin-top: 32px;
              padding-top: 16px;
              border-top: 1px solid #e5e7eb;
              font-size: 14px;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <!-- Add your logo here -->
              <h1 style="color: #4f46e5; font-weight: 700; margin: 0;">Your App</h1>
            </div>
            <h2>Welcome to Our App, ${name}! 👋</h2>
            <p>Thanks for signing up. We're excited to have you on board! To get started, please verify your email address by clicking the button below:</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            <p style="margin-top: 24px;">If the button doesn't work, you can also copy and paste this link into your browser:</p>
            <p style="font-size: 14px; color: #6b7280; word-break: break-all;">${verificationUrl}</p>
            <div class="footer">
              <p>If you didn't create an account, you can safely ignore this email.</p>
              <p>This verification link will expire in 24 hours.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  token: string
) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  await resend.emails.send({
    from: "Nikhil Sahni <hello@nikhilsahni.me>",
    to: email,
    subject: "Reset Your Password",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Your Password</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 0;
              background-color: #f4f4f5;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              padding: 32px;
              background-color: #ffffff;
              border-radius: 12px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            }
            .logo {
              margin-bottom: 24px;
              text-align: center;
            }
            h2 {
              color: #111827;
              font-size: 24px;
              margin-bottom: 16px;
              font-weight: 600;
            }
            p {
              color: #4b5563;
              font-size: 16px;
              margin: 8px 0;
            }
            .button {
              display: inline-block;
              padding: 12px 32px;
              background-color: #6366f1;
              color: white !important;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 500;
              margin: 24px 0;
              box-shadow: 0 2px 4px rgba(99, 102, 241, 0.2);
            }
            .button:hover {
              background-color: #4f46e5;
            }
            .footer {
              margin-top: 32px;
              padding-top: 16px;
              border-top: 1px solid #e5e7eb;
              font-size: 14px;
              color: #6b7280;
            }
            .security-notice {
              background-color: #f3f4f6;
              padding: 16px;
              border-radius: 8px;
              margin-top: 24px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <!-- Add your logo here -->
              <h1 style="color: #4f46e5; font-weight: 700; margin: 0;">Your App</h1>
            </div>
            <h2>Reset Your Password 🔐</h2>
            <p>Hi ${name},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p style="margin-top: 24px;">If the button doesn't work, you can also copy and paste this link into your browser:</p>
            <p style="font-size: 14px; color: #6b7280; word-break: break-all;">${resetUrl}</p>
            <div class="security-notice">
              <p style="margin: 0; font-weight: 500;">🔔 Security Notice</p>
              <p style="margin-top: 8px; font-size: 14px;">If you didn't request this password reset, please ignore this email or contact support if you have concerns about your account security.</p>
            </div>
            <div class="footer">
              <p>This password reset link will expire in 1 hour.</p>
              <p>For security reasons, please do not forward this email to anyone.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
};
