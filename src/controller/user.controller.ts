import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import response from '@/utils/response';
import { AuthRequest } from '@/types/auth';
import UserService from '@/services/user.service';

class UserController {
    static async getUserSession(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await UserService.getUserSession(req);

            res.status(StatusCodes.OK).json(response('user session info', result));
        } catch (error) {
            next(error);
        }
    }
}

export default UserController;
