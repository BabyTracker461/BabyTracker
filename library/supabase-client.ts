import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import * as aesjs from "aes-js";
import * as SecureStore from "expo-secure-store";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";

// https://stackoverflow.com/questions/76389249/provided-value-to-securestore-is-larger-than-2048-bytes-while-trying-to-store

class LargeSecureStore {
  private async _encrypt(key: string, value: string) {
    try {
      const encryptionKey = crypto.getRandomValues(new Uint8Array(256 / 8));

      const cipher = new aesjs.ModeOfOperation.ctr(
        encryptionKey,
        new aesjs.Counter(1)
      );
      const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));

      await SecureStore.setItemAsync(
        key,
        aesjs.utils.hex.fromBytes(encryptionKey)
      );

      return aesjs.utils.hex.fromBytes(encryptedBytes);
    } catch (error) {
      console.error("Encryption error:", error);
      throw error;
    }
  }

  private async _decrypt(key: string, value: string) {
    try {
      const encryptionKeyHex = await SecureStore.getItemAsync(key);
      if (!encryptionKeyHex) {
        return encryptionKeyHex;
      }

      const cipher = new aesjs.ModeOfOperation.ctr(
        aesjs.utils.hex.toBytes(encryptionKeyHex),
        new aesjs.Counter(1)
      );
      const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(value));

      return aesjs.utils.utf8.fromBytes(decryptedBytes);
    } catch (error) {
      console.error("Encryption error:", error);
      throw error;
    }
  }

  async getItem(key: string) {
    const encrypted = await AsyncStorage.getItem(key);
    if (!encrypted) {
      return encrypted;
    }

    return await this._decrypt(key, encrypted);
  }

  async removeItem(key: string) {
    await AsyncStorage.removeItem(key);
    await SecureStore.deleteItemAsync(key);
  }

  async setItem(key: string, value: string) {
    const encrypted = await this._encrypt(key, value);

    await AsyncStorage.setItem(key, encrypted);
  }
}

// Define a constant key name
const ENCRYPTION_KEY_NAME = "ENCRYPTION_KEY";

/**
 * Retrieves the stored encryption key.
 */
export const getEncryptionKey = async (): Promise<string | null> => {
  console.log("🔍 Retrieving Encryption Key...");
  const key = await SecureStore.getItemAsync(ENCRYPTION_KEY_NAME);
  console.log("🔑 Retrieved Key:", key);
  return key;
};

const PUBLIC_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";
const SUPABASE_URL = "http://76.138.134.66:44321";

const secureStoreAdapter = {
  async getItem(key: string) {
    return await SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  },
  async removeItem(key: string) {
    await SecureStore.deleteItemAsync(key);
  },
};

const supabase = createClient(SUPABASE_URL, PUBLIC_ANON, {
  auth: {
    storage: new LargeSecureStore(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;
