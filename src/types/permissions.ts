import { Document } from 'mongoose';

export interface IPermission extends Document {
    resource: string;
    actions: string[];
}
