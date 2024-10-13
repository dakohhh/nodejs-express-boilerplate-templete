import { Request } from 'express';
import Roles from '@/models/roles.model';
import Permissions from '@/models/permissions.model';
import User from '@/models/user.model';
import { BadRequestException, NotFoundException } from '@/utils/exceptions';
import { IRole } from '@/types';
import Joi from 'joi';

class RoleService {
    async createRole({ body }: Partial<Request>) {
        // Create roles for your application

        const { error, value: data } = Joi.object({
            name: Joi.string().trim().required(),
            permissions: Joi.array().items(Joi.string()).min(1).required(),
        })
            .options({ stripUnknown: true })
            .validate(body);

        if (error) throw new BadRequestException(error?.message.replace(/"/g, ''));

        const permissions = await Permissions.find({ _id: { $in: data.permissions } });

        const reqPermissions: string[] = data.permissions;

        const existingPermissionIds = new Set(permissions.map((permission) => (permission._id as Object).toString()));

        // Find missing permissions
        const missingPermissions = reqPermissions.filter((permissionId) => !existingPermissionIds.has(permissionId));

        // Check if there are any missing permissions
        if (missingPermissions.length > 0) {
            throw new NotFoundException(
                `${missingPermissions.length} permission(s) do not exist: ${missingPermissions.join(', ')}`
            );
        }

        const role = await Roles.create(data);

        return { role };
    }

    async getRoles({ body }: Partial<Request>) {
        const roles = await Roles.find().populate('permissions').lean().exec();

        return roles;
    }

    async assignRole({ body }: Partial<Request>) {
        const { error, value: data } = Joi.object({
            userId: Joi.string().trim().required(),
            roleId: Joi.string().trim().required(),
        })
            .options({ stripUnknown: true })
            .validate(body);

        if (error) throw new BadRequestException(error?.message.replace(/"/g, ''));

        const [user, role] = await Promise.all([
            User.findById(data.userId).select(['_id', 'role', 'isStaff']).lean().exec(),
            Roles.findById(data.roleId).select(['_id']).lean().exec(),
        ]);

        if (!user) throw new NotFoundException('User not found');

        if (!role) throw new NotFoundException('Role not found');

        console.log(user, role);

        // Check if the user already has the role
        if (user.role) throw new BadRequestException('User already has a role');

        // TODO: Research on if we should check if the user is a staff before assigning a role
        // Check if the user is a staff
        if (!user.isStaff) throw new BadRequestException('User is not a staff, cannot assign role');

        // Assign the role to the user
        const assignedRoleUser = await User.findOneAndUpdate(
            { _id: user._id },
            { role: role._id },
            { new: true, lean: true, select: '_id email role isVerified accountDisabled isStaff' }
        );

        return assignedRoleUser;
    }

    async getRole({ params }: Partial<Request>) {
        const { error, value: data } = Joi.object({
            roleId: Joi.string().trim().required(),
        })
            .options({ stripUnknown: true })
            .validate(params);

        if (error) throw new BadRequestException(error?.message.replace(/"/g, ''));

        const role = await Roles.findById(data.roleId).populate('permissions').lean().exec();

        if (!role) throw new NotFoundException('Role not found');

        return { role };
    }

    async updateRole({ body, params }: Partial<Request>) {
        const { error, value: data } = Joi.object({
            roleId: Joi.string().trim().required(),
            name: Joi.string().trim(),
            permissions: Joi.array().items(Joi.string()).min(1),
        })
            .options({ stripUnknown: true })
            .validate({ ...body, ...params });

        if (error) throw new BadRequestException(error?.message.replace(/"/g, ''));

        const role = await Roles.findById(data.roleId).populate('permissions').exec();

        if (!role) throw new NotFoundException('Role not found');

        if (data.name) role.name = data.name;
    }

    async deleteRole({ params }: Partial<Request>) {
        const { error, value: data } = Joi.object({
            roleId: Joi.string().trim().required(),
        })
            .options({ stripUnknown: true })
            .validate(params);

        if (error) throw new BadRequestException(error?.message.replace(/"/g, ''));

        const role = await Roles.findById(data.roleId).exec();

        if (!role) throw new NotFoundException('Role not found');

        await Roles.findByIdAndDelete(data.roleId);

        // Update all users with the role to null
        await User.updateMany({ role: role }, { $set: { role: null } });
    }
}

export default new RoleService();
