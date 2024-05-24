import nodemailer from "nodemailer";
import config from "../config";

type SendEmailProps = {
    to: string;
    subject: string;
    text?: string;
    html: string;
};

const sendEmail = async ({ to, subject, text, html }: SendEmailProps) => {
    const transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: false,
        auth: {
            user: config.smtp.auth.user,
            pass: config.smtp.auth.pass,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: '"Flat Sharing App" <maddison53@ethereal.email>',
            to: to,
            subject: subject,
            text: text,
            html: html,
        });

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error occurred: ", error);
    }
};

export default sendEmail;
