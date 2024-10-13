import mongoose, { Schema } from 'mongoose';
import { IUser } from '@/types';
import { UserRoles } from '@/enums/user-roles';

const baseOptions = {
    discriminatorKey: 'userType',
    collection: 'users',
    timestamps: true,
};

const UserSchema: Schema<IUser> = new mongoose.Schema<IUser>(
    {
        firstname: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 30,
        },
        lastname: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 50,
        },

        phoneNumber: {
            type: String,
            required: true,
            minLength: 10,
            maxLength: 10,
            unique: true,
        },

        email: {
            type: String,
            required: true,
            maxLength: 255,
            unique: true,
        },

        password: {
            type: String,
            required: true,
            minLength: 8,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        accountDisabled: {
            type: Boolean,
            default: false,
        },

        isStaff: {
            type: Boolean,
            default: false,
        },

        isSuperAdmin: {
            type: Boolean,
            default: false,
        },

        lastActive: {
            type: Date,
            default: () => Date.now(),
        },

        role: {
            type: Schema.Types.ObjectId,
            ref: 'Role',
            default: null,
        },
    },
    baseOptions
);

// Implement this when you go to disable account

// BaseUserSchema.pre('findOneAndDelete', async function (this: IUser, next) {
//     console.log(this.walletId);
// });

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
