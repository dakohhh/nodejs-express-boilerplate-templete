import EmailVerification from '@/email-templates/email-verifcation';
import { IVerificationToken } from '@/types';
import { IUser } from '@/types';
import { render } from '@react-email/components';
import settings from '@/settings';
import nodemailer from 'nodemailer';
import { mailerInstance } from '@/libraries/nodemailer';
class MailService {
    static async sendWelcomeMail(user: Pick<IUser, '_id' | 'email'>) {}

    static async sendVerificationEmail(
        user: Pick<IUser, 'email' | 'firstname' | 'lastname'>,
        token: Pick<IVerificationToken, 'token'>
    ) {
        const emailProp = {
            name: `${user.firstname} ${user.lastname}`,
            verificationLink: `${settings.BASE_URL}/auth/verify?token=${token.token}?email=${user.email}`,
        };

        const mailOptions: nodemailer.SendMailOptions = {
            to: user.email,
            subject: 'Verification for User',
            text: render(EmailVerification(emailProp), { plainText: true }),
            html: render(EmailVerification(emailProp)),
        };

        return await mailerInstance.sendMail(mailOptions);
    }
}

export default MailService;
