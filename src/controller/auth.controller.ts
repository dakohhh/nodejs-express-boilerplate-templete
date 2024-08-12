import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import response from '@/utils/response';
import AuthService from '@/services/auth.service';

class AuthController {
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const results = await AuthService.login(req);
            res.status(StatusCodes.OK).json(response('login successfull', results));
        } catch (error) {
            next(error);
        }
    }

    static async signupUser(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await AuthService.registerUser(req);
            const results = { user: user };

            res.status(StatusCodes.CREATED).json(response('user registered successfull', results));
        } catch (error) {
            next(error);
        }
    }

    static async verifyEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const results = await AuthService.verifyEmail(req);
            res.status(StatusCodes.OK).json(response('email verification successfull', results));
        } catch (error) {
            next(error);
        }
    }

    static async requestVerificationEmail(req: Request, res: Response, next: NextFunction){

        try {
            const results = await AuthService.requestEmailVerification(req);
            res.status(StatusCodes.OK).json(response('verificaiton link sent successfully'))
        }
        catch(error){
            next(error);
        }

    }
}

export default AuthController;
