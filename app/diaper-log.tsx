import {
    Text,
    Platform,
    View,
    Pressable,
    Keyboard,
    TouchableWithoutFeedback,
    ScrollView,
    TextInput,
} from 'react-native';
import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import supabase from '@/app/lib/supabase-client';
import { decryptData } from '@/app/lib/cryptoUtils';

interface DiaperLog {
    id: string;
    type: string;
    rash: boolean;
    note?: string;
    logged_at: string;
}

export default function DiaperLogs() {
    const insets = useSafeAreaInsets();
    const [diaperLogs, setDiaperLogs] = useState<DiaperLog[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Filters
    const [filterEnabled, setFilterEnabled] = useState(false);
    const [filterType, setFilterType] = useState<string>('');
    const [filterRash, setFilterRash] = useState<string>('');
    const [filterDate, setFilterDate] = useState<string>('');

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('diaper_log')
                .select('id, type, rash, note, logged_at')
                .order('logged_at', { ascending: false });

            if (error) {
                console.error("❌ Supabase Error:", error.message);
                return;
            }

            console.log("🛠 Raw Encrypted Data from Supabase:", data);

            // Decrypt each field before filtering
            let decryptedLogs = await Promise.all(
                data.map(async (log) => {
                    try {
                        return {
                            id: log.id,
                            type: await decryptData(log.type),
                            rash: (await decryptData(log.rash)) === "true",
                            note: log.note ? await decryptData(log.note) : "No Notes",
                            logged_at: new Date(await decryptData(log.logged_at)).toISOString(),
                        };
                    } catch (err) {
                        console.error("❌ Error decrypting log:", err);
                        return null;
                    }
                })
            );

            // Remove failed decryption attempts
            decryptedLogs = decryptedLogs.filter((log) => log !== null);

            console.log("✅ Decrypted Logs:", decryptedLogs);

            // Apply Filters
            if (filterEnabled) {
                decryptedLogs = decryptedLogs.filter((log) => {
                    return (
                        (!filterType || log.type === filterType) &&
                        (!filterRash || log.rash.toString() === filterRash) &&
                        (!filterDate ||
                            log.logged_at.startsWith(filterDate)) // Match YYYY-MM-DD
                    );
                });
            }

            setDiaperLogs(decryptedLogs);
        } catch (error) {
            console.error("❌ Unexpected error in fetchLogs:", error);
        }
        setIsLoading(false);
    };

    const globalFeedbackUpdate = () => {
        if (Keyboard.isVisible()) Keyboard.dismiss();
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Diaper Logs 🍼',
                    headerTitleStyle: {
                        fontFamily: Platform.select({
                            android: 'Figtree-700ExtraBold',
                            ios: 'Figtree-ExtraBold',
                        }),
                    },
                    contentStyle: { backgroundColor: 'white' },
                }}
            />
            <TouchableWithoutFeedback onPress={globalFeedbackUpdate} accessible={false}>
                <View className="flex-1 bg-white p-4">

                    {/* Filter Toggle Button */}
                    <Pressable
                        onPress={() => setFilterEnabled(!filterEnabled)}
                        className={`p-3 rounded-lg mb-4 items-center ${filterEnabled ? 'bg-red-500' : 'bg-blue-500'}`}
                    >
                        <Text className="text-white text-lg font-bold">
                            {filterEnabled ? 'Disable Filters' : 'Enable Filters'}
                        </Text>
                    </Pressable>

                    {/* Filter Inputs (Only show when enabled) */}
                    {filterEnabled && (
                        <View className="p-4 border border-gray-300 rounded-lg bg-gray-100 shadow mb-4">
                            {/* Filter by Type */}
                            <Text className="text-lg font-bold mb-2">Filter by Type:</Text>
                            <View className="flex-row justify-between mb-2">
                                {['wet', 'dry', 'both'].map((type) => (
                                    <Pressable
                                        key={type}
                                        onPress={() => setFilterType(type)}
                                        className={`py-2 px-4 rounded-lg ${filterType === type ? 'bg-blue-500' : 'bg-gray-300'}`}
                                    >
                                        <Text className={`${filterType === type ? 'text-white' : 'text-black'}`}>
                                            {type}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>

                            {/* Filter by Rash */}
                            <Text className="text-lg font-bold mb-2">Filter by Rash:</Text>
                            <View className="flex-row justify-between mb-2">
                                {['true', 'false'].map((value) => (
                                    <Pressable
                                        key={value}
                                        onPress={() => setFilterRash(value)}
                                        className={`py-2 px-4 rounded-lg ${filterRash === value ? 'bg-blue-500' : 'bg-gray-300'}`}
                                    >
                                        <Text className={`${filterRash === value ? 'text-white' : 'text-black'}`}>
                                            {value === 'true' ? 'Yes' : 'No'}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>

                            {/* Filter by Date */}
                            <Text className="text-lg font-bold mb-2">Filter by Date (YYYY-MM-DD):</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg p-2 mb-4"
                                placeholder="YYYY-MM-DD"
                                value={filterDate}
                                onChangeText={setFilterDate}
                                keyboardType="default"
                            />
                        </View>
                    )}

                    {/* Fetch Logs Button */}
                    <Pressable
                        onPress={fetchLogs}
                        className="bg-green-500 p-3 rounded-lg mb-4 items-center"
                    >
                        <Text className="text-white text-lg font-bold">Fetch Logs</Text>
                    </Pressable>

                    {/* Display Logs */}
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: insets.bottom }}
                    >
                        {isLoading ? (
                            <Text className="text-center text-lg">Loading...</Text>
                        ) : diaperLogs.length === 0 ? (
                            <Text className="text-center text-lg">No diaper logs available.</Text>
                        ) : (
                            diaperLogs.map((log) => (
                                <View
                                    key={log.id}
                                    className="mb-4 p-4 border border-gray-300 rounded-lg bg-gray-100 shadow"
                                >
                                    <Text className="text-lg font-bold">{`Type: ${log.type}`}</Text>
                                    <Text className="text-md">{`Rash: ${log.rash ? 'Yes' : 'No'}`}</Text>
                                    <Text className="text-md">{`Notes: ${log.note}`}</Text>
                                    <Text className="text-sm text-gray-600">{`Logged At: ${new Date(log.logged_at).toLocaleString()}`}</Text>
                                </View>
                            ))
                        )}
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </>
    );
}
