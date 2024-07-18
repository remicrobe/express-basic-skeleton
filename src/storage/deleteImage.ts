import { Index } from "../index";
import { promisify } from "util";
import * as path from "path";
import * as fs from 'fs';

const unlinkAsync = promisify(fs.unlink);

export async function deleteImage(imageName: string) {
    const storageFolder = process.env.STORAGE_FOLDER;
    const prefix = process.env.IMAGE_URL;
    if (imageName.startsWith(prefix)) {
        imageName = imageName.slice(prefix.length).trim();
    }

    if (!storageFolder) {
        throw new Error("Storage folder path is not provided.");
    }

    // Chemin vers l'image à supprimer
    const imagePath = path.join(storageFolder, imageName);

    try {
        // Vérifier si le fichier existe
        await fs.promises.access(imagePath, fs.constants.F_OK);

        // Supprimer l'image
        await unlinkAsync(imagePath);

        return true; // Retourner vrai si l'image est supprimée avec succès
    } catch (error) {
        // Gérer l'erreur si le fichier n'existe pas ou s'il y a une autre erreur
        console.error("Error deleting image:", error);
        return false; // Retourner faux si une erreur s'est produite
    }
}
