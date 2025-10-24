import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_EMAIL_USER,
        pass: process.env.SMTP_EMAIL_PASSWORD,
    },
});

export const sendInvitationEmail = async (
    to: string,
    subject: string,
    text?: string,
    html?: string
) => {
    const mailOptions = {
        from: `"Event System" <${process.env.SMTP_EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    } catch (error) {
        console.error(`❌ Failed to send email to ${to}:`, error);
    }
};
