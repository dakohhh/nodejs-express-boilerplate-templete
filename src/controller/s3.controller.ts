import settings from '@/settings';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import response from '@/utils/response';
import {
    uploadFileToS3V1,
    uploadFileToS3V2,
    getSignedURLFromS3,
    getCloudFrontURLFromS3,
    deleteFileFromS3,
} from '@/libraries/aws';
import { BadRequestException } from '@/utils/exceptions';

class S3Controller {
    static async uploadFile(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.file) {
                throw new BadRequestException('No file uploaded');
            }
            const s3Bucket = settings.AWS.AWS_S3_CONFIG.BUCKET_NAME;

            const fileKey = await uploadFileToS3V1({
                s3Bucket: s3Bucket,
                file: req.file.buffer,
                mimetype: req.file.mimetype,
            });

            // Store this key in a database
            console.log(fileKey);
            // a0a2c2ec9fa2ca5b0ef95fe03553befc
            res.status(StatusCodes.OK).json(response('Upload File successfully'));
        } catch (error) {
            next(error);
        }
    }

    static async uploadFileV2(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.file) {
                throw new BadRequestException('No file uploaded');
            }
            const s3Bucket = settings.AWS.AWS_S3_CONFIG.BUCKET_NAME;

            const fileKey = await uploadFileToS3V2({
                s3Bucket: s3Bucket,
                file: req.file.buffer,
                mimetype: req.file.mimetype,
            });

            // Store this key in a database
            console.log(fileKey);
            // a0a2c2ec9fa2ca5b0ef95fe03553befc
            res.status(StatusCodes.OK).json(response('Upload File successfully'));
        } catch (error) {
            next(error);
        }
    }

    static async getSignedUrl(req: Request, res: Response, next: NextFunction) {
        try {
            const s3Bucket = settings.AWS.AWS_S3_CONFIG.BUCKET_NAME;
            const fileName = 'a0a2c2ec9fa2ca5b0ef95fe03553befc';

            const url = await getSignedURLFromS3({
                s3Bucket: s3Bucket,
                fileName: fileName,
            });

            console.log(url);

            const result = { url };

            res.status(StatusCodes.OK).json(response('File get successfully', result));
        } catch (error) {
            next(error);
        }
    }

    static async getCloudFrontUrl(req: Request, res: Response, next: NextFunction) {
        try {
            const fileName = 'a0a2c2ec9fa2ca5b0ef95fe03553befc';

            const url = await getCloudFrontURLFromS3({
                fileName: fileName,
                isSigned: true,
            });

            const result = { url };

            res.status(StatusCodes.OK).json(response('File get successfully', result));
        } catch (error) {
            next(error);
        }
    }

    static async deleteFile(req: Request, res: Response, next: NextFunction) {
        try {
            const s3Bucket = settings.AWS.AWS_S3_CONFIG.BUCKET_NAME;

            const fileName = 'a0a2c2ec9fa2ca5b0ef95fe03553befc';

            const url = await deleteFileFromS3({
                s3Bucket,
                fileName: fileName,
            });

            const result = { url };

            res.status(StatusCodes.OK).json(response('Delete File successfully', result));
        } catch (error) {
            next(error);
        }
    }
}

export default S3Controller;
