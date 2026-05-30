import { authChallenge, authChallengeForPayload, authPublicKey } from "./authChallenge";
import axios from 'axios';
import { encodeBase64 } from "../encryption/base64";
import { getServerUrl } from "@/sync/serverConfig";
import { getHappyClientId } from "@/sync/apiSocket";

const AUTH_NONCE_PURPOSE = "account-auth-token";

function isLegacyNonceFallbackError(error: unknown) {
    return axios.isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 405);
}

export async function authGetToken(secret: Uint8Array) {
    const API_ENDPOINT = getServerUrl();
    const clientId = getHappyClientId();
    const publicKey = authPublicKey(secret);
    const publicKeyBase64 = encodeBase64(publicKey);

    try {
        const nonceResponse = await axios.post(`${API_ENDPOINT}/v1/auth/nonce`, {
            publicKey: publicKeyBase64,
            purpose: AUTH_NONCE_PURPOSE
        }, {
            headers: {
                'X-Happy-Client': clientId,
            }
        });

        const { challenge, signature } = authChallengeForPayload(secret, nonceResponse.data.signedPayload);
        const response = await axios.post(`${API_ENDPOINT}/v1/auth`, {
            challenge: encodeBase64(challenge),
            signature: encodeBase64(signature),
            publicKey: publicKeyBase64,
            nonceId: nonceResponse.data.nonceId,
            nonce: nonceResponse.data.nonce,
            purpose: nonceResponse.data.purpose,
            serverOrigin: nonceResponse.data.serverOrigin,
            clientId: nonceResponse.data.clientId
        }, {
            headers: {
                'X-Happy-Client': clientId,
            }
        });
        const data = response.data;
        return data.token;
    } catch (error) {
        if (!isLegacyNonceFallbackError(error)) {
            throw error;
        }
    }

    const { challenge, signature } = authChallenge(secret);
    const response = await axios.post(`${API_ENDPOINT}/v1/auth`, { challenge: encodeBase64(challenge), signature: encodeBase64(signature), publicKey: publicKeyBase64 }, {
        headers: {
            'X-Happy-Client': clientId,
        }
    });
    const data = response.data;
    return data.token;
}
