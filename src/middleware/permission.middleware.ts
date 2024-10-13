import { Response, NextFunction } from 'express';
import { ForbiddenException } from '@/utils/exceptions';
import { AuthRequest } from '@/types/auth';
import Roles from '@/models/roles.model';

export const checkStaffPermission = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user?.isStaff) throw new ForbiddenException('-middleware/user-not-authorized');
    next();
};

export const checkSuperAdminPermission = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user?.isSuperAdmin) throw new ForbiddenException('-middleware/user-not-authorized');
    next();
};

export function checkPermission(resource: string, actions: string[]) {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user?.role) {
                throw new ForbiddenException('-middleware/user-not-authorized/permission-denied');
            }

            const role = await Roles.findById(req.user.role).populate('permissions');

            if (!role) {
                throw new ForbiddenException('-middleware/user-not-authorized/permission-denied');
            }

            console.log(actions);
            console.log(role.permissions);

            const hasPermission = role.permissions.some(
                (permission) =>
                    permission.resource === resource && actions.some((action) => permission.actions.includes(action))
            );

            if (!hasPermission) {
                throw new ForbiddenException('-middleware/user-not-authorized/permission-denied');
            }
            next();
        } catch (error) {
            next(error);
        }
    };
}
