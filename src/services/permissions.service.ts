import { Request } from 'express';
import Permissions from '@/models/permissions.model';
import { BadRequestException } from '@/utils/exceptions';
import { Resource } from '@/enums/resource.enum';
import { Action } from '@/enums/actions.enum';
import Joi from 'joi';

export class PermissionService {
    async createPermissions({ body }: Partial<Request>) {
        // Create roles for your application

        const { error, value: data } = Joi.object({
            resource: Joi.string()
                .valid(...Object.values(Resource))
                .required(),
            actions: Joi.array()
                .items(Joi.string().valid(...Object.values(Action)))
                .required(),
        })
            .options({ stripUnknown: true })
            .validate(body);

        if (error) throw new BadRequestException(error?.message.replace(/"/g, ''));

        const permission = await Permissions.create(data);

        return permission;
    }
}

export default new PermissionService();
