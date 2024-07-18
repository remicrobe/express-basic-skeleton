import {randomUUID} from "crypto";
import {uploadImage} from "../../storage/uploadImage";
import sharp = require("sharp");

async function getOptimizedBuffer(imageBuffer: Buffer, maxSize: number): Promise<Buffer> {
    let quality = 100;
    let optimizedBuffer = await sharp(imageBuffer)
        .jpeg({ quality })
        .toBuffer();

    while (optimizedBuffer.length > maxSize && quality > 5) {
        quality -= 5;
        optimizedBuffer = await sharp(imageBuffer)
            .jpeg({ quality })
            .toBuffer();
    }

    return optimizedBuffer;
}

export async function base64tojpeg(image: string, resize: { width: number, height: number } | null = null): Promise<string> {
    const maxSize = 750 * 1024; // 1 MB in bytes
    let decodedImageData = Buffer.from(image, 'base64');

    let imageProcessor = sharp(decodedImageData);
    if (resize) {
        imageProcessor = imageProcessor.resize(resize.width, resize.height)
    }
    
    decodedImageData = await imageProcessor.toFormat('jpeg').toBuffer();

    decodedImageData = await getOptimizedBuffer(decodedImageData, maxSize);

    let imageName = randomUUID() + '.jpg';
    await uploadImage(decodedImageData, imageName);

    return imageName;
}