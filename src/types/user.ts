import { Document } from 'mongoose';

export interface IUser extends Document {
    _id: string;
    firstname: string;
    lastname: string;
    phoneNumber: string;
    email: string;
    password: string;
    role: 'student' | 'vendor' | 'admin';
    isVerified: boolean;
    accountDisabled: boolean;
    lastActive: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
