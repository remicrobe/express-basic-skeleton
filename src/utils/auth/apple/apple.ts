import * as jwksClient from 'jwks-rsa'

export async function getAppleSignInKey(kid) {
    const client = jwksClient({
        jwksUri: 'https://appleid.apple.com/auth/keys',
    });

    let key = await client.getSigningKey(kid);
    return key.getPublicKey();
}