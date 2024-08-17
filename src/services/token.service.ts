import { Payload } from '@/types';
import settings from '@/settings';
import JWT from 'jsonwebtoken';
import { IUser } from '@/types';
import { generateRandomOtp } from '@/utils/generate';
import { comparePassword, hashPassword } from '@/authentication/hash';
import { VERIFICATION_TOKEN_TYPE } from '@/enums/token-types';

import VerificationToken from '@/models/verification_token.model';
import crypto from 'crypto';
import { BadRequestException } from '@/utils/exceptions';
import { BaseUser } from '@/models';

export class TokenService {
    static async generateAuthToken(user: Pick<IUser, '_id' | 'role'>) {
        // Construct JWT payload
        const tokenData: Payload = {
            userId: user._id,
            role: user.role,
        };

        // Generate access token and refresh-token JWT
        const accessToken = JWT.sign(tokenData, settings.JWT_SECRET, {
            expiresIn: settings.ACCESS_TOKEN_JWT_EXPIRES_IN / 1000,
        });

        const refreshToken = JWT.sign(tokenData, settings.JWT_SECRET, {
            expiresIn: settings.REFRESH_TOKEN_JWT_EXPIRES_IN / 1000,
        });

        return { access_token: accessToken };
    }

    static async generateVerificationAndResetToken({
        userId,
        token_type,
    }: {
        userId: string;
        token_type: VERIFICATION_TOKEN_TYPE;
    }) {
        // Find the previous token if its exists and delete it
        await VerificationToken.findOneAndDelete({ user: userId, type: token_type });

        const randomToken = crypto.randomBytes(32).toString('hex');

        const hashedToken = await hashPassword(randomToken);

        const expiry = new Date(Date.now() + settings.DEFAULT_DB_TOKEN_EXPIRY_DURATION);

        const token = await VerificationToken.create({
            user: userId,
            token: hashedToken,
            type: token_type,
            expires_at: expiry,
        });

        // Return the generated token not the hashed token
        token.token = randomToken;

        return token;
    }

    // to generate otp
    static async generateOtpVerificationToken({
        userId,
        token_type,
    }: {
        userId: string;
        token_type: VERIFICATION_TOKEN_TYPE;
    }) {
        // Find the previous token if its exists and delete it
        await VerificationToken.findOneAndDelete({ user: userId, type: token_type });

        const randomCode = generateRandomOtp();

        const hashedCode = await hashPassword(randomCode);

        const expiry = new Date(Date.now() + settings.DEFAULT_DB_TOKEN_EXPIRY_DURATION);

        const token = await VerificationToken.create({
            user: userId,
            code: hashedCode,
            type: VERIFICATION_TOKEN_TYPE.EMAIL_VERIFICATION,
            expires_at: expiry,
        });

        return token;
    }

    static async verifyEmailToken({
        userId,
        _token,
        token_type,
    }: {
        userId: string;
        _token?: string;
        token_type: VERIFICATION_TOKEN_TYPE;
    }): Promise<boolean> {
        const token = await VerificationToken.findOne({ user: userId, type: token_type }).lean().exec();

        if (!token) return false;

        // Validated the token
        const isTokenValid = await comparePassword(String(_token), String(token.token));

        if (!isTokenValid || token.expires_at < new Date()) return false;

        // Delete the verification from the database
        await VerificationToken.deleteOne({ _id: token._id });

        return true;
    }

    static async verifyOtpToken(): Promise<void> {}
}

export default TokenService;
