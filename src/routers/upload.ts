import express from 'express';
import { uploadImageInstance } from '@/libraries/multer';
import S3Controller from '@/controller/s3.controller';

export default (router: express.Router) => {
    router.post('/upload/s3/', uploadImageInstance.single('file'), S3Controller.uploadFile);
    router.post('/upload/s3/v2/', uploadImageInstance.single('file'), S3Controller.uploadFileV2);
    router.get('/getSignedUrl/s3/', S3Controller.getSignedUrl);
    router.get('/getCloudFrontUrl/s3/', S3Controller.getCloudFrontUrl);
    router.delete('/deleteFile/s3/', S3Controller.deleteFile);
};
