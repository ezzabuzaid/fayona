import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export class EmailService {
    public static async sendEmail(message: Mail.Options) {
        const account = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
            // host: 'smtp.ethereal.email',
            // port: 587,
            // secure: false,
            service: 'gmail',
            auth: {
                user: 'ezzabuzaid',
                pass: 'OW99bfte'
            }
        });
        return transporter.sendMail(message);
        // return nodemailer.getTestMessageUrl(info);
    }
}

export function fakeEmail(token = ''): Mail.Options {
    return {
        from: 'ezzabuzaid@gmail.com',
        to: 'ezzabuzaid@hotmail.com',
        subject: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://website.com/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        text: 'Hello to myself!',
        html: `Password rest successfully`
    };
}
