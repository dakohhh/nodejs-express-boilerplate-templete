import { BaseUser, Token } from '@/models';
import { Request } from 'express';
import { BadRequestException } from '@/utils/exceptions';
import { hashPassword, comparePassword } from '@/authentication/hash';
import { UserRoles } from '@/enums/user-roles';
import { TokenService } from './token.service';
import Joi from 'joi';
import { VERIFICATION_TOKEN_TYPE } from '@/enums/token-types';

import MailService from './mail.service';
import VerificationToken from '@/models/verification.model';
import EmailVerification from '@/email-templates/email-verifcation';

// import { transporter } from '@/libraries/nodemailer';

class AuthService {
    static async registerUser({ protocol, hostname, body }: Partial<Request>) {
        const { error, value } = Joi.object({
            firstname: Joi.string().trim().min(3).max(30).required(),
            lastname: Joi.string().trim().min(3).max(30).required(),
            phoneNumber: Joi.string().trim().min(10).max(10).required(),
            email: Joi.string().trim().email().required(),
            password: Joi.string().min(8).required(),
        })
            .options({ stripUnknown: true })
            .validate(body);

        if (error) throw new BadRequestException(error.message);

        const hashedPassword = await hashPassword(value.password);

        const context = {
            firstname: value.firstname,
            lastname: value.lastname,
            phoneNumber: value.phoneNumber,
            email: value.email,
            password: hashedPassword,
            role: UserRoles.STUDENT,
        };

        const new_user = await new BaseUser(context).save();

        await new_user.save();

        const { password, ...student } = new_user.toObject();

        // Generate toke for verification
        const token = await TokenService.generateEmailVerificationToken({
            userId: new_user._id,
            token_type: VERIFICATION_TOKEN_TYPE.EMAIL_VERIFICATION,
        });

        await MailService.sendVerificationEmail(new_user, token);

        return student;
    }

    static async requestEmailVerification({ body }: Partial<Request>) {
        const { error, value } = Joi.object({
            email: Joi.string().email().required(),
        })
            .options({ stripUnknown: true })
            .validate(body);

        if (error) throw new BadRequestException(error.message);

        const user = await BaseUser.findOne({ email: value.email });

        if (!user) throw new BadRequestException('user not found');

        if (user.isVerified) throw new BadRequestException('user is already verified');

        const token = await TokenService.generateEmailVerificationToken({
            userId: user._id,
            token_type: VERIFICATION_TOKEN_TYPE.EMAIL_VERIFICATION,
        });

        await MailService.sendVerificationEmail(user, token);
    }

    static async verifyEmail({ query }: Partial<Request>) {
        const { error, value: data } = Joi.object({
            token: Joi.string().required(),
            email: Joi.string().trim().email().lowercase().required(),
        })
            .options({ stripUnknown: true })
            .validate(query);

        if (error) throw new BadRequestException(error.message);

        const user = await BaseUser.findOne({ email: data.email }).lean().exec();

        if (!user) throw new BadRequestException('email does not exists');

        if (user.isVerified) throw new BadRequestException('email already verified');

        const isValid = await TokenService.verifyEmailToken({
            userId: user._id,
            _token: data.token,
            token_type: VERIFICATION_TOKEN_TYPE.EMAIL_VERIFICATION,
        });

        if (!isValid) throw new BadRequestException('invalid or expired token. Kindly request a new verification link');

        // Update Verification Status of user
        await BaseUser.updateOne({ _id: user._id }, { isVerified: true });
    }



    static async login({ body }: Partial<Request>) {
        const { error, value } = Joi.object({
            email: Joi.string().email().min(3).max(30).required(),
            password: Joi.string().min(3).max(30).required(),
        })
            .options({ stripUnknown: true })
            .validate(body);

        if (error) throw new BadRequestException(error.message);

        // Check if user exists
        const user = await BaseUser.findOne({ email: value.email });

        if (!user) throw new BadRequestException('Invalid email or password');

        // Check if password is correct
        const validPassword = await comparePassword(value.password, user.password);

        if (!validPassword) throw new BadRequestException('Invalid email or password');

        // Check if the user's account is disabled
        if (user.accountDisabled) throw new BadRequestException('Your account is disabled, please contact support');

        //Check if the user's account is verified
        if (!user.isVerified) throw new BadRequestException('Account is not verified, please verify your account');

        // Generate JWT Token
        const token = await TokenService.generateAuthToken(user);

        return { role: user.role, token: token };
    }
}

export default AuthService;
