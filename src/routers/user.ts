import express from 'express';
import UserController from '@/controller/user.controller';
import auth from '@/middleware/auth.middleware';
import { UserRoles } from '@/enums/user-roles';
// import validateRequestBody from "../middleware/validation";
// import signupSchema from "../validation/student.validation";
// import loginValidation from "validation/login.validation";

// confirmVendorWallet

export default (router: express.Router) => {
    router.get('/user/', auth([UserRoles.STUDENT]), UserController.getUserSession);
};
