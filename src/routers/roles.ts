import express from 'express';
import auth from '@/middleware/auth.middleware';
import { checkSuperAdminPermission, checkPermission } from '@/middleware/permission.middleware';
import RolesController from '@/controller/roles.controller';
import { UserRoles } from '@/enums/user-roles';

export default (router: express.Router) => {
    router.post('/auth/roles/', auth([UserRoles.ADMIN]), checkSuperAdminPermission, RolesController.createRoles);
    router.get('/auth/roles/', auth([UserRoles.ADMIN]), checkSuperAdminPermission, RolesController.getRoles);
    router.get('/auth/roles/:roleId/', auth([UserRoles.ADMIN]), checkSuperAdminPermission, RolesController.getRole);
    router.delete(
        '/auth/roles/:roleId',
        auth([UserRoles.ADMIN]),
        checkSuperAdminPermission,
        RolesController.deleteRole
    );

    router.post('/auth/assign-role/', auth([UserRoles.ADMIN]), checkSuperAdminPermission, RolesController.assignRole);
    router.post(
        '/auth/role-test/',
        auth([UserRoles.ADMIN]),
        checkPermission('transaction', ['delete']),
        RolesController.roleTest
    );
};
