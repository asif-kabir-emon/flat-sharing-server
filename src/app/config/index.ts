import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,

    database_url: process.env.DATABASE_URL,

    salt_rounds: Number(process.env.SALT_ROUNDS),

    jwt: {
        access_secret: process.env.JWT_ACCESS_SECRET as string,
        refresh_secret: process.env.JWT_REFRESH_SECRET as string,
        access_token_expires_in: process.env
            .JWT_ACCESS_TOKEN_EXPIRES_IN as string,
        refresh_token_expires_in: process.env
            .JWT_REFRESH_TOKEN_EXPIRES_IN as string,
    },

    smtp: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    },
};
