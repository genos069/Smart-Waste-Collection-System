import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { HttpError } from "../utils/validation.js";
export function resetDeliveryAvailable() {
  if (env.nodeEnv !== "production" && env.exposeResetToken) return true;
  return Boolean(env.smtpHost && env.mailFrom);
}
export async function sendPasswordReset(email, token) {
  if (env.nodeEnv !== "production" && env.exposeResetToken) return;
  if (!resetDeliveryAvailable()) throw new HttpError(503, "Password reset email is not configured");
  const transport = nodemailer.createTransport({
    host: env.smtpHost, port: env.smtpPort, secure: env.smtpSecure,
    ...(env.smtpUser ? { auth: { user: env.smtpUser, pass: env.smtpPass } } : {}),
    connectionTimeout: 10000, socketTimeout: 10000,
  });
  await transport.sendMail({ from: env.mailFrom, to: email, subject: "Reset your Smart Waste password",
    text: `Your password reset token is:
${token}

It expires in 10 minutes. Enter it with your new password at ${env.clientUrl}/reset-password. If you did not request this, ignore this email.`,
  });
}
