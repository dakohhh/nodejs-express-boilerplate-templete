//  The sharp library is a high-performance image processing library that allows you to resize, crop, and manipulate images.
// It is a popular choice for image processing in Node.js applications.
import sharp from 'sharp';

export const resizeImage = async (buffer: Buffer, width: number, height: number): Promise<Buffer> => {
    return sharp(buffer).resize({ width, height, fit: 'contain' }).toBuffer();
};
