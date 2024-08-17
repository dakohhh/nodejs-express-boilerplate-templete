import settings from '@/settings';
import mongoose, { Schema } from 'mongoose';
import { IVerificationToken } from '@/types';
import { VERIFICATION_TOKEN_TYPE } from '@/enums/token-types';

const baseOptions = {
    timestamps: false,
};

const VerificationTokenSchema: Schema<IVerificationToken> = new mongoose.Schema<IVerificationToken>(
    {
        user: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'User',
        },

        otp: {
            type: String,
            required: false,
            default: null,
        },

        token: {
            type: String,
            required: false,
            default: null,
        },

        type: {
            type: String,
            required: true,
            enum: Object.values(VERIFICATION_TOKEN_TYPE),
        },

        expires_at: {
            type: Date,
            required: true,
            default: Date.now,
            expires: settings.DEFAULT_DB_TOKEN_EXPIRY_DURATION,
        },
    },
    baseOptions
);

const VerificationToken = mongoose.model<IVerificationToken>('Token', VerificationTokenSchema);

export default VerificationToken;
