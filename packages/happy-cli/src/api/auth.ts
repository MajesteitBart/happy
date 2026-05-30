import axios from 'axios';
import { encodeBase64, encodeBase64Url, authChallenge, authChallengeForPayload, authPublicKey } from './encryption';
import { configuration } from '@/configuration';

const AUTH_NONCE_PURPOSE = "account-auth-token";

function isLegacyNonceFallbackError(error: unknown) {
  return axios.isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 405);
}

/**
 * Note: This function is deprecated. Use readPrivateKey/writePrivateKey from persistence module instead.
 * Kept for backward compatibility only.
 */
export async function getOrCreateSecretKey(): Promise<Uint8Array> {
  throw new Error('getOrCreateSecretKey is deprecated. Use readPrivateKey/writePrivateKey from persistence module.');
}

/**
 * Authenticate with the server and obtain an auth token
 * @param serverUrl - The URL of the server to authenticate with
 * @param secret - The secret key to use for authentication
 * @returns The authentication token
 */
export async function authGetToken(secret: Uint8Array): Promise<string> {
  const clientId = `cli/${configuration.currentCliVersion}`;
  const publicKey = authPublicKey(secret);
  const publicKeyBase64 = encodeBase64(publicKey);

  let response;
  try {
    const nonceResponse = await axios.post(`${configuration.serverUrl}/v1/auth/nonce`, {
      publicKey: publicKeyBase64,
      purpose: AUTH_NONCE_PURPOSE
    }, {
      headers: {
        'X-Happy-Client': clientId
      }
    });

    const { challenge, signature } = authChallengeForPayload(secret, nonceResponse.data.signedPayload);
    response = await axios.post(`${configuration.serverUrl}/v1/auth`, {
      challenge: encodeBase64(challenge),
      publicKey: publicKeyBase64,
      signature: encodeBase64(signature),
      nonceId: nonceResponse.data.nonceId,
      nonce: nonceResponse.data.nonce,
      purpose: nonceResponse.data.purpose,
      serverOrigin: nonceResponse.data.serverOrigin,
      clientId: nonceResponse.data.clientId
    }, {
      headers: {
        'X-Happy-Client': clientId
      }
    });
  } catch (error) {
    if (!isLegacyNonceFallbackError(error)) {
      throw error;
    }

    const { challenge, signature } = authChallenge(secret);
    response = await axios.post(`${configuration.serverUrl}/v1/auth`, {
      challenge: encodeBase64(challenge),
      publicKey: publicKeyBase64,
      signature: encodeBase64(signature)
    }, {
      headers: {
        'X-Happy-Client': clientId
      }
    });
  }

  if (!response.data.success || !response.data.token) {
    throw new Error('Authentication failed');
  }

  return response.data.token;
}

/**
 * Generate a URL for the mobile app to connect to the server
 * @param secret - The secret key to use for authentication
 * @returns The URL for the mobile app to connect to the server
 */
export function generateAppUrl(secret: Uint8Array): string {
  const secretBase64Url = encodeBase64Url(secret);
  return `handy://${secretBase64Url}`;
}
