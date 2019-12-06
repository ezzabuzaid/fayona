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

export function fakeEmail(): Mail.Options {
    return {
        from: 'ezzabuzaid@gmail.com',
        to: 'ezzabuzaid@hotmail.com',
        subject: 'Nodemailer is unicode friendly ✔',
        text: 'Hello to myself!',
        html: `Password rest successfully`
    };
}
