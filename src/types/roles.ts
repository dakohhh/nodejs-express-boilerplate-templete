import { Document, Types } from 'mongoose';
import { IPermission } from './permissions';

export interface IRole extends Document {
    _id?: Types.ObjectId;
    name: string;
    permissions: IPermission[];
}
