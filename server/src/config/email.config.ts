import nodemailer from 'nodemailer';
import { envConfig } from './env.config';

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: 'gmail', // ✅ easier than host/port
  auth: {
    user: envConfig.EMAIL_USERNAME, // your Gmail address
    pass: envConfig.EMAIL_PASSWORD, // the 16-char App Password
  },
});

type SendEmail = {
  to: string;
  subject: string;
  html: string;
};

export const sendEmail = async (prop: SendEmail) => {
  return await transporter.sendMail({
    from: 'SnapURL ' + envConfig.EMAIL_USERNAME,
    to: prop.to,
    subject: prop.subject,
    html: prop.html,
  });
};
