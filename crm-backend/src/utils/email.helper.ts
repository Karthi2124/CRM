import nodemailer, { Transporter } from 'nodemailer';
import logger from './logger';

// ─── Email Options Interface ──────────────────────────────────────────────────
export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

// ─── Create Reusable Transporter ─────────────────────────────────────────────
function createTransporter(): Transporter {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  });
}

// ─── Send Email ───────────────────────────────────────────────────────────────
export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.MAIL_FROM_NAME || 'CRM System'}" <${process.env.MAIL_FROM_ADDRESS || 'noreply@crm.com'}>`,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      ...(options.cc ? { cc: options.cc } : {}),
      ...(options.bcc ? { bcc: options.bcc } : {}),
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId} → ${options.to}`);
    return true;
  } catch (error: any) {
    logger.error('Failed to send email', { error: error.message, to: options.to });
    return false;
  }
}

// ─── Email Templates ──────────────────────────────────────────────────────────
export function getForgotPasswordTemplate(params: {
  firstName: string;
  resetUrl: string;
  expiresInMinutes: number;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Password Reset Request</h1>
      </div>
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd;">
        <p style="font-size: 16px;">Hi <strong>${params.firstName}</strong>,</p>
        <p>We received a request to reset your CRM account password. Click the button below to create a new password.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${params.resetUrl}"
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px;
                    text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">
            Reset My Password
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          This link will expire in <strong>${params.expiresInMinutes} minutes</strong>.
        </p>
        <p style="color: #666; font-size: 14px;">
          If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
        </p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          If the button above doesn't work, copy and paste this URL into your browser:<br>
          <a href="${params.resetUrl}" style="color: #667eea;">${params.resetUrl}</a>
        </p>
      </div>
    </body>
    </html>
  `;
}

export function getPasswordChangedTemplate(params: { firstName: string }): string {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">Password Changed Successfully</h1>
      </div>
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd;">
        <p>Hi <strong>${params.firstName}</strong>,</p>
        <p>Your CRM account password has been successfully changed.</p>
        <p style="color: #e74c3c; font-weight: bold;">
          If you did not make this change, please contact your system administrator immediately.
        </p>
      </div>
    </body>
    </html>
  `;
}
