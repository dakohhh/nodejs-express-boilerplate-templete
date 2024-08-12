import mongoose, { Schema } from 'mongoose';
import settings from '@/settings';
import { IRefreshToken } from '@/types';

const baseOptions = {
    timestamps: false,
};

const RefreshTokenSchema: Schema<IRefreshToken> = new mongoose.Schema<IRefreshToken>(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        token: {
            type: String,
            required: false,
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

const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);

export default RefreshToken;
