import {
    Text,
    Platform,
    View,
    Pressable,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { Stack, useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import supabase from './lib/supabase-client';

export interface DiaperLog {
    id: number; // Unique identifier
    type: string; // "wet", "dry", or "both"
    rash: boolean; // Diaper rash present or not
    note?: string; // Optional notes about the diaper change
    loggedAt: string; // Timestamp when the log was created
}

export default function Diaper() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const [diaperType, setDiaperType] = useState<string>('');
    const [rash, setRash] = useState<boolean | null>(null);
    const [note, setNotes] = useState<string>('');

    const clear = () => {
        setDiaperType('');
        setRash(null);
        setNotes('');
    };

    const handleAddEntry = async () => {
        const loggedAt = new Date().toISOString();
        const newLog = {
            type: diaperType,
            rash: rash === true,
            note: note,
            logged_at: loggedAt,
        };

        try {
            const { error } = await supabase.from('diaper_log').insert([newLog]);

            if (error) {
                console.error('Error adding diaper log:', error.message);
            } else {
                alert('Diaper log added');
                clear();
                navigation.goBack();
            }
        } catch (error) {
            console.error('Unknown error:', error);
        }
    };

    const globalFeedbackUpdate = () => {
        if (Keyboard.isVisible()) Keyboard.dismiss();
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Diaper Tracker 🍼',
                    headerTitleStyle: {
                        fontFamily: Platform.select({
                            android: 'Figtree-700ExtraBold',
                            ios: 'Figtree-ExtraBold',
                        }),
                    },
                    contentStyle: {
                        backgroundColor: 'white',
                    },
                }}
            />
            <TouchableWithoutFeedback
                onPress={globalFeedbackUpdate}
                accessible={false}
            >
                <View className="flex-col justify-between h-full">
                    <View className="pt-4 pr-8 pl-8">
                        {/* Diaper Type Selection */}
                        <Text className="subheading">Select Diaper Type</Text>
                        <View className="flex-row gap-4">
                            <Pressable
                                onPress={() => setDiaperType('wet')}
                                className={`button ${diaperType === 'wet' ? 'bg-blue-200' : ''}`}
                            >
                                <Text className="text-xl figtree">Wet</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => setDiaperType('dry')}
                                className={`button ${diaperType === 'dry' ? 'bg-yellow-200' : ''}`}
                            >
                                <Text className="text-xl figtree">Dry</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => setDiaperType('both')}
                                className={`button ${diaperType === 'both' ? 'bg-green-200' : ''}`}
                            >
                                <Text className="text-xl figtree">Both</Text>
                            </Pressable>
                        </View>

                        {/* Spacer to push sections further down */}
                        <View style={{ flexGrow: 1 }} />

                        {/* Rash Section */}
                        <Text className="subheading">Diaper Rash?</Text>
                        <View className="flex-row gap-4">
                            <Pressable
                                onPress={() => setRash(true)}
                                className={`button ${rash === true ? 'bg-red-200' : ''}`}
                            >
                                <Text className="text-xl figtree">Yes</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => setRash(false)}
                                className={`button ${rash === false ? 'bg-blue-200' : ''}`}
                            >
                                <Text className="text-xl figtree">No</Text>
                            </Pressable>
                        </View>

                        {/* Note Section */}
                        <View className="note" style={{ marginTop: 20 }}>
                            <TextInput
                                placeholder="+ Add a note"
                                className="text-xl p-1 figtree w-full"
                                keyboardType="default"
                                value={note}
                                onChangeText={setNotes}
                                placeholderTextColor={'#000'}
                                multiline={true}
                                maxLength={200}
                            />
                        </View>
                    </View>
                    <View
                        className="justify-end pt-4 pr-8 pl-8"
                        style={{ paddingBottom: insets.bottom }}
                    >
                        <View className="flex-row justify-between">
                            <Pressable
                                onPress={handleAddEntry}
                                className="button"
                            >
                                <Text className="text-xl figtree">Add</Text>
                            </Pressable>
                            <Pressable
                                onPress={clear}
                                className="button bg-orange-100"
                            >
                                <Text className="text-xl figtree">Clear</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </>
    );
}
