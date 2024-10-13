import express from 'express';
import auth from '@/middleware/auth.middleware';
import { checkSuperAdminPermission } from '@/middleware/permission.middleware';
import PermissionController from '@/controller/permissions.controller';
import { UserRoles } from '@/enums/user-roles';

export default (router: express.Router) => {
    router.post(
        '/auth/permission/',
        auth([UserRoles.ADMIN]),
        checkSuperAdminPermission,
        PermissionController.createPermissions
    );
};
