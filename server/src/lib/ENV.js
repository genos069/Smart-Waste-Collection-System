import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const ENV = {
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV,
  DB_URL: process.env.DB_URL,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};
