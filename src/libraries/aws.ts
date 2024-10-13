import ms from 'ms';
import moment from 'moment';
import settings from '@/settings';
import { randomFileName } from '@/utils/helper-functions';
import { Upload } from '@aws-sdk/lib-storage';
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    CompleteMultipartUploadCommandOutput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getSignedUrl as getSignedCloudFrontUrl } from '@aws-sdk/cloudfront-signer';

interface UploadFileOptions {
    s3Bucket: string;
    file: Buffer;
    mimetype: string;

    folder?: string;
    fileName?: string;
}

interface GetFileOptions {
    s3Bucket: string;
    fileName: string;

    expiresIn?: number;
}

interface DeleteFileOptions {
    s3Bucket: string;
    fileName: string;
}

interface GetCloudFrontURLOptions {
    fileName: string;
    isSigned?: boolean;
    dateLessThan?: moment.Moment | Date;
}

// AWS S3
// =============================================================================
const s3Client = new S3Client({
    region: settings.AWS.AWS_REGION,
    credentials: {
        accessKeyId: settings.AWS.AWS_ACCESS_KEY_ID,
        secretAccessKey: settings.AWS.AWS_SECRET_ACCESS_KEY,
    },
});

export const uploadFileToS3V1 = async ({ s3Bucket, file, fileName, mimetype }: UploadFileOptions) => {
    try {
        const finalFileName = fileName ? fileName : randomFileName();

        const putObjectParams = {
            Bucket: s3Bucket,
            Key: finalFileName,
            Body: file,
            ContentType: mimetype,
        };

        const command = new PutObjectCommand(putObjectParams);

        await s3Client.send(command);

        return finalFileName;
    } catch (error) {
        // Use Sentry to capture error
        // ("From Third-Party: fn (uploadFileToS3)"), { extra: { params, response: error }, level: "error" };
        return null;
    }
};

export const uploadFileToS3V2 = async ({ s3Bucket, file, fileName, mimetype }: UploadFileOptions) => {
    try {
        const finalFileName = fileName ? fileName : randomFileName();

        const putObjectParams = {
            Bucket: s3Bucket,
            Key: finalFileName,
            Body: file,
            ContentType: mimetype,
        };

        const upload = new Upload({
            client: s3Client,
            params: putObjectParams,
        });

        // (Optional): Monitor upload progress
        upload.on('httpUploadProgress', (progress) => {
            console.log(`Uploaded: ${progress.loaded} / ${progress.total}`);
        });

        const data = (await upload.done()) as CompleteMultipartUploadCommandOutput;

        if (!data.Location) return null;

        const location = data.Location.split('amazonaws.com/')[1];
        return location;
    } catch (error) {
        // Use Sentry to capture error
        // ("From Third-Party: fn (uploadFileToS3V2)"), { extra: { params, response: error }, level: "error" };
        return null;
    }
};

export const getSignedURLFromS3 = async ({
    s3Bucket,
    fileName,
    expiresIn = ms('24h') / 1000,
}: GetFileOptions): Promise<string | null> => {
    try {
        const getObjectParams = {
            Bucket: s3Bucket,
            Key: fileName,
        };

        const command = new GetObjectCommand(getObjectParams);

        const url = await getSignedUrl(s3Client, command, { expiresIn: expiresIn });

        return url;
    } catch (error) {
        console.log(error);
        // Use Sentry to capture error
        return null;
    }
};

export const getCloudFrontURLFromS3 = async ({
    fileName,
    isSigned,
    dateLessThan = moment().add(1, 'days'),
}: GetCloudFrontURLOptions) => {
    try {
        const cloudFrontUrl = `${settings.AWS.AWS_CLOUD_FRONT.CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME}/${fileName}`;

        if (!isSigned) return cloudFrontUrl;

        // Get signed URL for CloudFront
        const signedCloudFrontUrl = getSignedCloudFrontUrl({
            url: cloudFrontUrl,
            dateLessThan: dateLessThan.toISOString(),
            keyPairId: settings.AWS.AWS_CLOUD_FRONT.CLOUDFRONT_KEY_PAIR_ID,
            privateKey: settings.AWS.AWS_CLOUD_FRONT.CLOUDFRONT_PRIVATE_KEY,
        });

        return signedCloudFrontUrl;
    } catch (error) {
        // Use Sentry to capture error
        // ("From Third-Party: fn (getCloudFrontURLFromS3)"), { extra: { params, response: error }, level: "error" };
        return null;
    }
};

export const deleteFileFromS3 = async ({ s3Bucket, fileName }: DeleteFileOptions) => {
    try {
        const deleteObjectParams = {
            Bucket: s3Bucket,
            Key: fileName,
        };

        const command = new DeleteObjectCommand(deleteObjectParams);

        await s3Client.send(command);
    } catch (error) {
        console.log(error);
        // Use Sentry to capture error
        // ("From Third-Party: fn (deleteFileFromS3)"), { extra: { params, response: error }, level: "error" };
        return false;
    }
};
