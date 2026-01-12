import { sendEmail } from '../config/email.config';
import { verifyTemplate } from './verify-template';

export const verifyEmail = (email: string, name: string, code: string) => {
  const emailContent = verifyTemplate
    .replaceAll('{{name}}', name)
    .replace('{{code}}', code);
  return sendEmail({
    to: email,
    subject: 'Verify your email',
    html: emailContent,
  });
};
