import { IUser } from './user';

export interface IRefreshToken {
    user: IUser;

    token: string;

    expires_at: Date;
}

export interface IVerificationToken {
    user: IUser;

    otp?: string;

    token?: string;

    type: string;

    expires_at: Date;
}
