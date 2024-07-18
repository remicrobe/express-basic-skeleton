import {Index} from "../index";
import internal = require("node:stream");
import {promisify} from "util";
import * as path from "path";
import * as fs from 'fs'


const writeFileAsync = promisify(fs.writeFile);

export async function uploadImage(imageData: Buffer, imageName: string) {
    const storageFolder = process.env.STORAGE_FOLDER;

    if (!storageFolder) {
        throw new Error("Storage folder path is not provided.");
    }

    // Chemin vers le répertoire de destination en local
    const localPath = path.join(storageFolder, imageName);

    // Écrire l'image localement
    await writeFileAsync(localPath, imageData);

    return true
}
