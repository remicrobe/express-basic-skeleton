import {DateTime} from "luxon";
import {Equal, MoreThan} from "typeorm";
import {UserRepository} from "../database/repository/user.repository";
import {verifyJwt} from "../utils/jwt/verify";

export async function apiTokenMiddleware(req, res, next) {
    // Vérifier si un JWT est passé dans l'en-tête
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); // Retourner une erreur 401 si aucun token n'est fourni
    }

    let userId = verifyJwt("token", token)

    if (!userId) {
        return res.sendStatus(401); // Retourner une erreur 401 si aucun token valide est founi
    }

    let collab = await UserRepository.findOneBy({
        id: Equal(userId),
        isDeleted: Equal(false)
    })

    if (collab) {
        res.locals.token = token
        res.locals.connectedUser = collab;
        next();
    } else {
        res.sendStatus(401)
    }

}