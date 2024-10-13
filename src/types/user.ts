import { Document, Types } from 'mongoose';

export interface IUser extends Document {
    _id: string;
    firstname: string;
    lastname: string;
    phoneNumber: string;
    email: string;
    password: string;
    role?: Types.ObjectId;
    isStaff: boolean;
    isSuperAdmin: boolean;
    isVerified: boolean;
    accountDisabled: boolean;
    lastActive: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
