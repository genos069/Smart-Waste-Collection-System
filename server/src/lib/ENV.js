import dotenv from "dotenv"

dotenv.config({ quiet: true })

export const ENV = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    DB_URL: process.env.DB_URL,
    SuperAdmin_Email: process.env.SuperAdmin_Email,
    Password: process.env.Password,
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API_KEY: process.env.CLOUD_API_KEY,
    CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
}