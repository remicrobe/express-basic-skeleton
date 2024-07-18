export async function statsMiddlewware(req, res, next) {
    // Vérifier si un JWT est passé dans l'en-tête
    const token = req.headers['authorization'];

    if (!token || token !== process.env.API_STATS_KEY) {
        return res.sendStatus(401);
    }

    next();
}