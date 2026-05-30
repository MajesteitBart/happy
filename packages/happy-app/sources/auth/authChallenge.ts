import { getRandomBytes } from 'expo-crypto';
import sodium from '@/encryption/libsodium.lib';

function signingKeypair(secret: Uint8Array) {
    return sodium.crypto_sign_seed_keypair(secret);
}

export function authPublicKey(secret: Uint8Array) {
    return signingKeypair(secret).publicKey;
}

export function authChallenge(secret: Uint8Array) {
    const keypair = signingKeypair(secret);
    const challenge = getRandomBytes(32);
    const signature = sodium.crypto_sign_detached(challenge, keypair.privateKey);
    return { challenge, signature, publicKey: keypair.publicKey };
}

export function authChallengeForPayload(secret: Uint8Array, payload: string) {
    const keypair = signingKeypair(secret);
    const challenge = new TextEncoder().encode(payload);
    const signature = sodium.crypto_sign_detached(challenge, keypair.privateKey);
    return { challenge, signature, publicKey: keypair.publicKey };
}
