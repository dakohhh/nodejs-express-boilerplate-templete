import mongoose, { Schema } from 'mongoose';
import { IPermission } from '@/types';
import { Action } from '@/enums/actions.enum';

const permissionSchema: Schema<IPermission> = new Schema<IPermission>({
    resource: { type: String, required: true, unique: false }, // e.g., 'users', 'transactions', 'tickets'
    actions: [{ type: String, enum: Object.values(Action), required: true }], // CRUD actions
});

export default mongoose.model('Permission', permissionSchema);
