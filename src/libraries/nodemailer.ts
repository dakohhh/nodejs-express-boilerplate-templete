import settings from '@/settings';
import nodemailer from 'nodemailer';
class Mailer {
    private transporter: nodemailer.Transporter;
    private static instance: Mailer;

    constructor() {
        if (settings.MAILER.USE_AWS_SES) {
            //...

            this.transporter = nodemailer.createTransport({});
        } else {
            if (!settings.MAILER.SMTP_HOST) throw new Error('SMTP HOST not defined');
            if (!settings.MAILER.SMTP_PORT) throw new Error('SMTP PORT not defined');
            if (!settings.MAILER.SMTP_USER) throw new Error('SMTP USER not defined');
            if (!settings.MAILER.SMTP_PASSWORD) throw new Error('SMTP PASSWORD not defined');

            this.transporter = nodemailer.createTransport({
                host: settings.MAILER.SMTP_HOST,
                port: settings.MAILER.SMTP_PORT,
                secure: true, // True for port 465 , false for other ports,
                auth: {
                    user: settings.MAILER.SMTP_USER,
                    pass: settings.MAILER.SMTP_PASSWORD,
                },
            });
        }
    }

    async verifyMailConnection() {
        try {
            await this.transporter.verify();
        } catch (error) {
            console.error('Error configuring mail transporter:', error);
            throw new Error('MAIL VERIFICATION ERROR');
        }
    }

    async sendMail(mailOptions: nodemailer.SendMailOptions) {
        mailOptions = {
            ...mailOptions,
            from: mailOptions.from || settings.DEFAULT_EMAIL_FROM,
        };

        this.transporter
            .sendMail(mailOptions)
            .then((info) => {
                // preview only available when sending through an Ethereal account
                if (settings.MAILER.SMTP_HOST === 'smtp.ethereal.email') {
                    console.log(`:::> Mail sent: ${info.messageId}`);
                    console.log(`:::> Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
                }

                return info;
            })

            .catch((error) => {
                console.log(error);
            });
    }

    static getMailInstance() {
        if (!Mailer.instance) {
            Mailer.instance = new Mailer();
        }

        return Mailer.instance;
    }
}

const mailerInstance = Mailer.getMailInstance();

export { mailerInstance };
