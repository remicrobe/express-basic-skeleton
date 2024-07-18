import * as jwt from 'jsonwebtoken'
import {Index} from "../../index";

export function generateJwt(type: 'token' | 'refreshToken', userId: number): string {
    let expiresIn;

    if (type === 'token') {
        expiresIn = '1d';
    } else if (type === 'refreshToken') {
        expiresIn = '30d';
    } else {
        throw new Error('Invalid token type');
    }

    const payload = {
        userId: userId,
        type: type
    };

    return jwt.sign(payload, Index.jwtKey, { expiresIn: expiresIn });
}