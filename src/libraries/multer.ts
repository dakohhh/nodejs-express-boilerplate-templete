import multer, { Multer, StorageEngine } from 'multer';
import { BadRequestException } from '@/utils/exceptions';

export const ALLOWED_VIDEO_MIME_TYPES = [
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-ms-wmv',
    // TODO: Add more video mime types, if the need arises
];

export const ALLOWED_IMAGE_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/gif',
    // TODO: Add more image mime types, if the need arises
];

export class MulterConfig {
    private storage: StorageEngine;
    constructor(storage: StorageEngine = multer.memoryStorage()) {
        this.storage = storage;
    }

    // Method to create a multer instance with custom config
    createMulterInstance(options: { maxSize: number; allowedMimeTypes: string[] }): Multer {
        return multer({
            storage: this.storage,
            limits: {
                fileSize: 1024 * 1024 * options.maxSize, // Maximum file size in bytes
            },
            fileFilter: (_req, file, cb) => {
                // Check if file type is accepted
                if (!options.allowedMimeTypes.includes(file.mimetype)) {
                    return cb(
                        new BadRequestException(
                            `Invalid file type. Allowed types: ${options.allowedMimeTypes.join(', ')}`
                        )
                    );
                }
                cb(null, true);
            },
        });
    }
}

// Created a multer instance for uploading images, 5mb max size
export const uploadImageInstance = new MulterConfig().createMulterInstance({
    maxSize: 5,
    allowedMimeTypes: ALLOWED_IMAGE_MIME_TYPES,
});

// Created a multer instance for uploading images, 100mb max size
export const uploadVideoInstance = new MulterConfig().createMulterInstance({
    maxSize: 100,
    allowedMimeTypes: ALLOWED_VIDEO_MIME_TYPES,
});
