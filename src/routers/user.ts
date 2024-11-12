import express from 'express';
import UserController from '@/controller/user.controller';
import auth from '@/middleware/auth.middleware';
import { UserRoles } from '@/enums/user-roles';


export default (router: express.Router) => {
    router.get('/user/', auth([UserRoles.STUDENT]), UserController.getUserSession);
};
