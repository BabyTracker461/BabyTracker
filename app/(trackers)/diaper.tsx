import {
    Text,
    View,
    Pressable,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native'
import React, { useState } from 'react'
import { Stack, useNavigation } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import supabase from '@/library/supabase-client'
//import { encryptData, decryptData } from './lib/cryptoUtils';

export interface DiaperLog {
    id: number
    type: string
    rash: boolean
    note?: string
    loggedAt: string
}

export default function Diaper() {
    const insets = useSafeAreaInsets()
    const navigation = useNavigation()
    const [diaperType, setDiaperType] = useState<string>('')
    const [rash, setRash] = useState<boolean | null>(null)
    const [note, setNotes] = useState<string>('')

    const clear = () => {
        setDiaperType('')
        setRash(null)
        setNotes('')
    }

    const handleAddEntry = async () => {
        const loggedAt = new Date().toISOString()
        const newLog = {
            type: diaperType,
            rash: rash === true,
            note: note || '',
            logged_at: loggedAt,
        }

        try {
            console.log('📝 Preparing to encrypt data:', newLog)

            // Encrypt each field separately before storing it
            // const encryptedType = await encryptData(newLog.type);
            // const encryptedRash = await encryptData(newLog.rash.toString());
            // const encryptedNote = await encryptData(newLog.note);
            // const encryptedLoggedAt = await encryptData(newLog.logged_at);

            // console.log("🔒 Encrypted Data:", {
            //     type: encryptedType,
            //     rash: encryptedRash,
            //     note: encryptedNote,
            //     logged_at: encryptedLoggedAt,
            // });

            // // Store encrypted values in the existing columns
            // const { error } = await supabase.from('diaper_log').insert([{
            //     type: encryptedType,
            //     rash: encryptedRash,
            //     note: encryptedNote,
            //     logged_at: encryptedLoggedAt,
            // }]);

            // if (error) {
            //     console.error("❌ Supabase Error:", error.message);
            // } else {
            //     console.log("✅ Diaper log added securely!");
            //     alert("Diaper log added securely");
            //     clear();
            //     navigation.goBack();
            // }
        } catch (error) {
            console.error('❌ Unknown error in handleAddEntry:', error)
        }
    }

    const globalFeedbackUpdate = () => {
        if (Keyboard.isVisible()) Keyboard.dismiss()
    }

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Diaper Tracker 🍼',
                    headerTitleStyle: { fontWeight: 'bold' },
                    contentStyle: { backgroundColor: 'white' },
                }}
            />
            <TouchableWithoutFeedback
                onPress={globalFeedbackUpdate}
                accessible={false}
            >
                <View className='flex-1 bg-white p-4'>
                    <Text className='text-lg font-bold mb-4'>
                        Select Diaper Type
                    </Text>
                    <View className='flex-row justify-between mb-4'>
                        {['wet', 'dry', 'both'].map((type) => (
                            <Pressable
                                key={type}
                                onPress={() => setDiaperType(type)}
                                className={`py-2 px-4 rounded-full ${
                                    diaperType === type
                                        ? 'bg-blue-500'
                                        : 'bg-gray-200'
                                }`}
                            >
                                <Text
                                    className={`${
                                        diaperType === type
                                            ? 'text-white'
                                            : 'text-gray-700'
                                    }`}
                                >
                                    {type}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <Text className='text-lg font-bold mb-4'>Diaper Rash?</Text>
                    <View className='flex-row justify-between mb-4'>
                        <Pressable
                            onPress={() => setRash(true)}
                            className={`py-2 px-4 rounded-full ${
                                rash === true ? 'bg-red-500' : 'bg-gray-200'
                            }`}
                        >
                            <Text
                                className={`${
                                    rash === true
                                        ? 'text-white'
                                        : 'text-gray-700'
                                }`}
                            >
                                Yes
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setRash(false)}
                            className={`py-2 px-4 rounded-full ${
                                rash === false ? 'bg-green-500' : 'bg-gray-200'
                            }`}
                        >
                            <Text
                                className={`${
                                    rash === false
                                        ? 'text-white'
                                        : 'text-gray-700'
                                }`}
                            >
                                No
                            </Text>
                        </Pressable>
                    </View>

                    <TextInput
                        placeholder='+ Add a note'
                        className='border border-gray-300 rounded-lg p-2 mb-6'
                        keyboardType='default'
                        value={note}
                        onChangeText={setNotes}
                        placeholderTextColor={'#666'}
                        multiline
                        maxLength={200}
                    />

                    <View className='flex-row justify-between'>
                        <Pressable
                            onPress={handleAddEntry}
                            className='bg-blue-500 py-3 px-4 rounded-lg'
                        >
                            <Text className='text-white text-center font-bold'>
                                Add
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={clear}
                            className='bg-gray-300 py-3 px-4 rounded-lg'
                        >
                            <Text className='text-gray-700 text-center font-bold'>
                                Clear
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </>
    )
}
