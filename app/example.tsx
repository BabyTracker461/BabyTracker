import { useEffect } from "react";
import { View, Text } from "react-native";
import cryptoUtils from "./lib/cryptoUtils";

const CryptoExampleScreen = () => {
    useEffect(() => {
        const runExample = async () => {
            const sampleData = {
                hours: "6h",
                minutes: "30m",
                note: "Baby slept peacefully",
                time: 390,
                loggedAt: new Date().toISOString(),
            };

            console.log("📝 Original Data:", JSON.stringify(sampleData, null, 2));

            try {
                const encryptedData = await cryptoUtils.encryptData(JSON.stringify(sampleData));
                console.log("🔒 Encrypted Data:", encryptedData);

                const decryptedData = await cryptoUtils.decryptData(encryptedData);
                console.log("🔑 Decrypted Data:", decryptedData);
            } catch (error) {
                console.error("❌ Encryption/Decryption error:", error);
            }
        };

        runExample();
    }, []);

    return (
        <View>
            <Text>Check the terminal for encryption logs ✅</Text>
        </View>
    );
};

export default CryptoExampleScreen;