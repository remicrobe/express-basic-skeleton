import * as jwt from 'jsonwebtoken'
import {Index} from "../../index";

export function verifyJwt(type: 'token' | 'refreshToken', token) : number | false {
    try {
        const decoded = jwt.verify(token, Index.jwtKey);

        if ((decoded as any).type === type) {
            return Number((decoded as any).userId);
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}