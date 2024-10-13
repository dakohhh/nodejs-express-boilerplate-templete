import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import response from '@/utils/response';
import RolesService from '@/services/roles.service';

class RolesController {
    static async createRoles(req: Request, res: Response, next: NextFunction) {
        try {
            const results = await RolesService.createRole(req);

            res.status(StatusCodes.OK).json(response('Role Created Successfully', results));
        } catch (error) {
            next(error);
        }
    }

    static async getRoles(req: Request, res: Response, next: NextFunction) {
        try {
            const results = await RolesService.getRoles(req);

            res.status(StatusCodes.OK).json(response('Roles fetched successfully', results));
        } catch (error) {
            next(error);
        }
    }

    static async assignRole(req: Request, res: Response, next: NextFunction) {
        try {
            const results = await RolesService.assignRole(req);

            res.status(StatusCodes.OK).json(response('Roles assigned to user successfully', results));
        } catch (error) {
            next(error);
        }
    }

    static async roleTest(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(StatusCodes.OK).json(response('Role Test Successful'));
        } catch (error) {
            next(error);
        }
    }

    static async getRole(req: Request, res: Response, next: NextFunction) {
        try {
            const results = await RolesService.getRole(req);

            res.status(StatusCodes.OK).json(response('Role fetched successfully', results));
        } catch (error) {
            next(error);
        }
    }

    static async deleteRole(req: Request, res: Response, next: NextFunction) {
        try {
            const results = await RolesService.deleteRole(req);

            res.status(StatusCodes.OK).json(response('Role deleted successfully', results));
        } catch (error) {
            next(error);
        }
    }
}

export default RolesController;
