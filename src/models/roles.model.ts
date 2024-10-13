import mongoose, { Schema } from 'mongoose';
import { IRole } from '@/types';

const roleSchema: Schema<IRole> = new Schema<IRole>({
    name: { type: String, required: true, unique: true }, // e.g., 'super-admin', 'admin'
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
});

export default mongoose.model('Role', roleSchema);
