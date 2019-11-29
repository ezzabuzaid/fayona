import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export class EmailService {
    public static async sendEmail(message: Mail.Options) {
        const account = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: account.user,
                pass: account.pass
            }
        });
        const info = await transporter.sendMail(message);
        return nodemailer.getTestMessageUrl(info);
    }
}
