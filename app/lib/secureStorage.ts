import * as SecureStore from 'expo-secure-store';

// Define a constant key name
const ENCRYPTION_KEY_NAME = 'ENCRYPTION_KEY';

/**
 * Generates a secure 256-bit AES encryption key.
 */
const generateKey = (): string => {
    return [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
};

/**
 * Stores a new encryption key if one doesn't exist.
 */
export const storeEncryptionKey = async (): Promise<void> => {
    const existingKey = await SecureStore.getItemAsync(ENCRYPTION_KEY_NAME);

    if (!existingKey) {
        const newKey = generateKey();
        console.log("🛠 Storing New Encryption Key:", newKey);
        await SecureStore.setItemAsync(ENCRYPTION_KEY_NAME, newKey, { requireAuthentication: false });
    }
};

/**
 * Retrieves the stored encryption key.
 */
export const getEncryptionKey = async (): Promise<string | null> => {
    console.log("🔍 Retrieving Encryption Key...");
    const key = await SecureStore.getItemAsync(ENCRYPTION_KEY_NAME);
    console.log("🔑 Retrieved Key:", key);
    return key;
};

export default {
    storeEncryptionKey,
    getEncryptionKey,
};
