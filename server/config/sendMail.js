// Temporarily disable real email sending so the server can run locally
// This file previously used nodemailer and attempted to read Gmail credentials
// from environment variables. During local development the environment may
// not be configured or Gmail app passwords may cause errors. To avoid
// crashes, we export a stubbed sendMail function that logs the request
// and resolves successfully. Restore real implementation later.

/* eslint-disable no-unused-vars */
const sendMail = async (to, otp) => {
  console.warn('[sendMail] Email sending is currently disabled (stub).');
  console.warn(`[sendMail] Would send OTP ${otp} to: ${to}`);
  // Simulate an async send and return a fake info object
  return Promise.resolve({
    messageId: 'stubbed-message-id',
    accepted: [to],
    otp,
  });
};

export default sendMail;
