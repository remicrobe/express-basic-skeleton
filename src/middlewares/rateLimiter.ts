import rateLimit from "express-rate-limit";

export function rateLimiterMiddleware(periodS: number, maxTry: number) {
    return rateLimit({
        windowMs: periodS * 1000,
        limit: maxTry,
        standardHeaders: 'draft-7',
        legacyHeaders: false
    })
}