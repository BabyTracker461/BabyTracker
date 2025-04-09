import CryptoES from 'crypto-es'
import * as Crypto from 'expo-crypto'
import * as SecureStore from 'expo-secure-store'
import { Buffer } from 'buffer' // ✅ Import Buffer polyfill

const ENCRYPTION_KEY_NAME = 'encryption_key'

/**
 * Retrieves the encryption key from secure storage or generates one.
 */
const getEncryptionKey = async (): Promise<string> => {
    let key = await SecureStore.getItemAsync(ENCRYPTION_KEY_NAME)

    if (!key) {
        const randomBytes = await Crypto.getRandomBytesAsync(32)
        key = Buffer.from(randomBytes).toString('base64')
        await SecureStore.setItemAsync(ENCRYPTION_KEY_NAME, key)
        console.log('🔑 New encryption key generated and saved.')
    } else {
        console.log('🔑 Retrieved encryption key from SecureStore.')
    }

    return key
}

/**
 * Generates a 16-byte IV using Expo's Crypto API.
 */
const getIV = async (): Promise<Uint8Array> => {
    const randomBytes = await Crypto.getRandomBytesAsync(16)
    return new Uint8Array(randomBytes)
}

/**
 * Hashes the encryption key using SHA-256 (fast alternative to PBKDF2).
 */
const getHashedKey = async (): Promise<string> => {
    const key = await getEncryptionKey()
    if (!key) throw new Error('❌ Encryption key not found')

    return CryptoES.SHA256(key).toString(CryptoES.enc.Hex)
}

/**
 * Encrypts data using AES-256-CBC encryption.
 */
export const encryptData = async (data: string): Promise<string> => {
    const hashedKey = await getHashedKey()

    const ivBytes = await getIV()
    const ivHex = CryptoES.enc.Hex.parse(Buffer.from(ivBytes).toString('hex'))

    const encrypted = CryptoES.AES.encrypt(data, hashedKey, {
        iv: ivHex,
        mode: CryptoES.mode.CBC,
        padding: CryptoES.pad.Pkcs7,
    }).toString()

    const encryptedData = Buffer.from(ivBytes).toString('hex') + encrypted
    console.log('🔒 Encrypted Data:', encryptedData)
    return encryptedData
}

/**
 * Decrypts AES-256-CBC encrypted data.
 */
export const decryptData = async (ciphertext: string): Promise<string> => {
    const hashedKey = await getHashedKey()

    const ivHex = ciphertext.substring(0, 32)
    const encryptedText = ciphertext.substring(32)

    const decrypted = CryptoES.AES.decrypt(encryptedText, hashedKey, {
        iv: CryptoES.enc.Hex.parse(ivHex),
        mode: CryptoES.mode.CBC,
        padding: CryptoES.pad.Pkcs7,
    }).toString(CryptoES.enc.Utf8)

    if (!decrypted) throw new Error('❌ Decryption failed')
    console.log('🔑 Decrypted Data:', decrypted)
    return decrypted
}

export default {
    encryptData,
    decryptData,
}

