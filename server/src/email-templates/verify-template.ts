import { envConfig } from '@/config/env.config';

export const verifyTemplate = `<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: auto; padding: 20px;">
      <h2 style="color: #1a73e8;">Verify Your Email with AuthHook</h2>
      
      <p>Hi {{name}},</p>

      <p>Thanks for signing up for <strong>SnapURL</strong> – **Upload images. Get URLs. Done.**</p>

      <p>Use the verification code below to complete your sign-up:</p>

      <a href="${envConfig.FRONTEND_URL}/verify-email?code={{code}}">
        Click here to verify your email
      </a>

      <p>This code will expire in 10 minutes.</p>

      <hr style="margin: 30px 0;" />

      <p style="font-size: 14px; color: #888;">
        AuthHook is a production-ready authentication service designed to help developers integrate multi-tenant, enterprise-grade user authentication and API key management quickly and securely.
      </p>

      <p style="font-size: 13px; color: #aaa;">
        If you didn’t request this code, you can safely ignore this email.
      </p>

      <p style="font-size: 13px; color: #aaa;">
        — The AuthHook Team
      </p>
    </div>
  </body>
</html>
`;
