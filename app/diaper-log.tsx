import {
    Text,
    Platform,
    View,
    Pressable,
    Keyboard,
    TouchableWithoutFeedback,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity
} from 'react-native';
import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import supabase from '@/app/lib/supabase-client';
import { decryptData, encryptData } from '@/app/lib/cryptoUtils';

interface DiaperLog {
    id: string;
    type: string;
    rash: string;  // Changed to string ('true'/'false')
    note?: string;
    logged_at: string;
}

export default function DiaperLogs() {
    const insets = useSafeAreaInsets();
    const [diaperLogs, setDiaperLogs] = useState<DiaperLog[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Editing Log State
    const [editingLog, setEditingLog] = useState<DiaperLog | null>(null);
    const [editedType, setEditedType] = useState<string>('');
    const [editedRash, setEditedRash] = useState<string>('');  // Changed to string ('true'/'false')
    const [editedNote, setEditedNote] = useState<string>('');

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
                            rash: await decryptData(log.rash), // Decrypt as text
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
                        (!filterRash || log.rash === filterRash) &&
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

    // Updated handleUpdate function to encrypt fields before saving
    const handleUpdate = async (logId: string) => {
        try {
            // Encrypt the updated values before saving them
            const encryptedType = await encryptData(editedType);
            const encryptedRash = await encryptData(editedRash);  // Store 'true'/'false' as string
            const encryptedNote = await encryptData(editedNote);

            const { error } = await supabase
                .from('diaper_log')
                .update({
                    type: encryptedType,
                    rash: encryptedRash, // Save as string ('true'/'false')
                    note: encryptedNote,
                })
                .eq('id', logId);

            if (error) {
                console.error('❌ Error updating log:', error.message);
                return;
            }

            // Update the log locally with unencrypted data for display
            const updatedLogs = diaperLogs.map((log) =>
                log.id === logId
                    ? { ...log, type: editedType, rash: editedRash, note: editedNote }
                    : log
            );
            setDiaperLogs(updatedLogs);
            setEditingLog(null);
        } catch (error) {
            console.error('❌ Unexpected error in handleUpdate:', error);
        }
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
                                    <Text className="text-md">{`Rash: ${log.rash === 'true' ? 'Yes' : 'No'}`}</Text>
                                    <Text className="text-md">{`Notes: ${log.note}`}</Text>
                                    <Text className="text-sm text-gray-600">{`Logged At: ${new Date(log.logged_at).toLocaleString()}`}</Text>

                                    {/* Update Button */}
                                    <Pressable
                                        onPress={() => {
                                            setEditingLog(log);
                                            setEditedType(log.type);
                                            setEditedRash(log.rash); // Set as string ('true'/'false')
                                            setEditedNote(log.note || '');
                                        }}
                                        className="bg-yellow-500 p-2 rounded-lg mt-4"
                                    >
                                        <Text className="text-white text-md font-bold">Update</Text>
                                    </Pressable>
                                    
                                    {/* Delete Button */}
                                    <Pressable
                                        onPress={async () => {
                                            try {
                                                const { error } = await supabase
                                                    .from('diaper_log')
                                                    .delete()
                                                    .eq('id', log.id);

                                                if (error) {
                                                    console.error('❌ Error deleting log:', error.message);
                                                    return;
                                                }

                                                setDiaperLogs(diaperLogs.filter((l) => l.id !== log.id));
                                            } catch (error) {
                                                console.error('❌ Unexpected error in handleDelete:', error);
                                            }
                                        }}
                                        className="bg-red-500 p-2 rounded-lg mt-2"
                                    >
                                        <Text className="text-white text-md font-bold">Delete</Text>
                                    </Pressable>
                                </View>
                            ))
                        )}
                    </ScrollView>

                    {/* Update Log Modal */}
                    {editingLog && (
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            }}
                        >
                            <ScrollView
                                contentContainerStyle={{
                                    backgroundColor: '#fff',
                                    padding: 20,
                                    borderRadius: 10,
                                    width: '80%',
                                }}
                            >
                                <Text className="text-lg font-bold mb-4">Edit Log</Text>

                                <TextInput
                                    className="border border-gray-300 rounded-lg p-4 mb-6"
                                    placeholder="Type"
                                    value={editedType}
                                    onChangeText={setEditedType}
                                    style={{
                                        fontSize: 16,
                                    }}
                                />
                                
                                <TextInput
                                    className="border border-gray-300 rounded-lg p-4 mb-6"
                                    placeholder="Rash (true/false)"
                                    value={editedRash}
                                    onChangeText={setEditedRash}
                                    style={{
                                        fontSize: 16,
                                    }}
                                />
                                <TextInput
                                    className="border border-gray-300 rounded-lg p-4 mb-6"
                                    placeholder="Notes"
                                    value={editedNote}
                                    onChangeText={setEditedNote}
                                    style={{
                                        fontSize: 16,
                                    }}
                                />

                                <View className="flex-row justify-between">
                                    <TouchableOpacity
                                        onPress={() => setEditingLog(null)}
                                        style={{
                                            backgroundColor: 'gray',
                                            paddingVertical: 12,
                                            paddingHorizontal: 40,
                                            borderRadius: 5,
                                        }}
                                    >
                                        <Text className="text-white text-lg font-semibold">Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleUpdate(editingLog.id)}
                                        style={{
                                            backgroundColor: '#4CAF50',
                                            paddingVertical: 12,
                                            paddingHorizontal: 40,
                                            borderRadius: 5,
                                        }}
                                    >
                                        <Text className="text-white text-lg font-semibold">Save Changes</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </>
    );
}
