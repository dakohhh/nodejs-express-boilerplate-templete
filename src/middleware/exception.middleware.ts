import express, { Express } from 'express';
import { MulterError } from 'multer';
import response from '@/utils/response';
import * as exception from '@/utils/exceptions';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

const configureErrorMiddleware = (app: Express) => {
    app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(error);
        if (
            error instanceof exception.BadRequestException ||
            error instanceof exception.UnauthorizedException ||
            error instanceof exception.ServerErrorException ||
            error instanceof exception.NotFoundException ||
            error instanceof exception.ForbiddenException ||
            error instanceof exception.CredentialException
        ) {
            res.status(error.statusCode).json(response(error.message, error.data, false));
        } else if ((error as any).name == 'MongoServerError' && (error as any).code == 11000) {
            // Handling duplicate key error
            const field = Object.keys((error as any).keyPattern)[0];

            res.status(400).json(response(`${field} already exists`, null, false));
        } else if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
            res.status(401).json(response('invalid-token', null, false));
        } else if (error instanceof MulterError) {
            res.status(400).json(response(error.message, null, false));
        } else {
            // Handling other types of errors
            res.status(500).json(response('Internal Server Error', null, false));
        }

        next();
    });
};

export default configureErrorMiddleware;
