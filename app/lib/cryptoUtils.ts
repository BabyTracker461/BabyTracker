import CryptoJS from 'crypto-js';
import { getEncryptionKey } from './secureStorage';

/**
 * Converts a string key to a CryptoJS WordArray.
 */
const getHashedKey = async (): Promise<CryptoJS.lib.WordArray> => {
    const key = await getEncryptionKey();
    if (!key) throw new Error('❌ Encryption key not found');

    return CryptoJS.enc.Hex.parse(CryptoJS.SHA256(key).toString());
};

/**
 * Encrypts data using AES encryption.
 */
export const encryptData = async (data: object): Promise<string> => {
    const hashedKey = await getHashedKey();
    console.log("🔐 Using Hashed Key for Encryption:", hashedKey.toString());

    // Use a static IV to avoid native randomness
    const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");

    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), hashedKey, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    }).toString();

    console.log("🔒 Encrypted Data:", encrypted);
    return encrypted;
};

/**
 * Decrypts AES-encrypted data.
 */
export const decryptData = async (ciphertext: string): Promise<object> => {
    const hashedKey = await getHashedKey();
    console.log("🔓 Using Hashed Key for Decryption:", hashedKey.toString());

    // Use the same static IV for decryption
    const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");

    const bytes = CryptoJS.AES.decrypt(ciphertext, hashedKey, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    console.log("🔑 Decrypted Data:", decrypted);

    if (!decrypted) throw new Error('❌ Decryption failed. Invalid key or data.');
    return JSON.parse(decrypted);
};

export default {
    encryptData,
    decryptData,
};
