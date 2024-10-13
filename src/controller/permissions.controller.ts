import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import response from '@/utils/response';
import PermissionsService from '@/services/permissions.service';

class PermissionController {
    static async createPermissions(req: Request, res: Response, next: NextFunction) {
        try {
            const results = await PermissionsService.createPermissions(req);

            res.status(StatusCodes.OK).json(response('Permission Created Successfully', results));
        } catch (error) {
            next(error);
        }
    }

    static async getPermissions(req: Request, res: Response, next: NextFunction) {}
}

export default PermissionController;
