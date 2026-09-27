import "dotenv/config";
export const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || "development",
  dbUrl: process.env.DB_URL,
  jwtSecret: process.env.JWT_SECRET,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  simulateBins: process.env.SIMULATE_BINS === "true",
  exposeResetToken: process.env.EXPOSE_RESET_TOKEN === "true",
  trustProxyHops: Number(process.env.TRUST_PROXY_HOPS || 0),
  smtpHost: process.env.SMTP_HOST,
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpSecure: process.env.SMTP_SECURE === "true",
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  mailFrom: process.env.MAIL_FROM,
};
export function validateEnv() {
  if (!env.dbUrl) throw new Error("DB_URL is required");
  if (!env.jwtSecret || env.jwtSecret.length < 32) throw new Error("JWT_SECRET must contain at least 32 characters");
  if (!Number.isInteger(env.port) || env.port < 1 || env.port > 65535) throw new Error("PORT is invalid");
  if (!Number.isInteger(env.trustProxyHops) || env.trustProxyHops < 0 || env.trustProxyHops > 10) throw new Error("TRUST_PROXY_HOPS must be an integer from 0 to 10");
  const client = new URL(env.clientUrl);
  if (!["http:", "https:"].includes(client.protocol) || client.origin !== env.clientUrl) throw new Error("CLIENT_URL must be an exact HTTP(S) origin without a trailing slash");
  if (env.nodeEnv === "production" && (client.protocol !== "https:" || env.exposeResetToken)) throw new Error("Production requires HTTPS and EXPOSE_RESET_TOKEN=false");
}
export const cookieOptions = () => ({ httpOnly: true, secure: env.nodeEnv === "production", sameSite: env.nodeEnv === "production" ? "none" : "lax", path: "/" });
