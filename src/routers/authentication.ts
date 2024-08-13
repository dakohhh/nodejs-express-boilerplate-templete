import express from 'express';
import AuthController from '@/controller/auth.controller';

export default (router: express.Router) => {
    router.post('/auth/user/login', AuthController.login);
    router.post('/auth/user/signup', AuthController.signupUser);
    router.post('/auth/verify', AuthController.verifyEmail);
    router.post('/auth/reset-password', AuthController.resetPassword);
    router.post('/auth/request-verification-mail', AuthController.requestVerificationEmail);
    router.post('/auth/request-reset-password', AuthController.requestPasswordReset);
};
