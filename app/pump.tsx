import {
    Text,
    Platform,
    View,
    Pressable,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback,
    Modal,
    Button
} from 'react-native'
import React, { useRef, useState } from 'react'
import { Stack, useNavigation } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import supabase from './lib/supabase-client'

export interface PumpLog{
    id: number;
    left_amount: number;
    right_amount: number;
    hours: number;
    minutes: number;
    seconds: number;
    note?:string;
}



export default function Growth() {
    const navigation = useNavigation();
    const [leftAmount, setLeftAmount] = useState('')
    const [rightAmount, setRightAmount] = useState('')
    const [duration, setDuration] = useState('')
    const [note, setNotes] = useState<string>('')
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [time, setTime] = useState<number>(0)
    const [isRunning, setIsRunning] = useState<boolean>(false)
    const intervalRef = useRef<NodeJS.Timer | null>(null)
    const [hours, setHours] = useState<string>('')
    const [minutes, setMinutes] = useState<string>('')
    const [seconds, setSeconds] = useState<string>('')
    
    const clear = () => {
        setLeftAmount('')
        setRightAmount('')
        setDuration('')
        setTime(0)
        setHours('')
        setMinutes('')
        setSeconds('')
        setNotes('')
    }

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60

        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleStart = () => {
        if (isRunning) return
        setIsRunning(true)
        intervalRef.current = setInterval(() => {
            setTime((prev) => prev + 1)
        }, 1000)
    }

    const handleStop = () => {
        if (!isRunning) return
        setIsRunning(false)
        if (intervalRef.current) {
            clearInterval(intervalRef.current as any)
            intervalRef.current = null
        }
    }

    const handleReset = () => {
        handleStop()
        setTime(0)
    }

    const handleAddEntry = async () => {
        console.log("Attempting to add");
    
        if (!leftAmount || !rightAmount) {
            alert("Please fill all fields.");
            return;
        }
    
        // Parse hours, minutes, and seconds from input (default to 0 if empty)
        const parsedHours = parseInt(hours) || 0;
        const parsedMinutes = parseInt(minutes) || 0;
        const parsedSeconds = parseInt(seconds) || 0;
    
        // Use timer if manual input is empty
        let finalHours = parsedHours;
        let finalMinutes = parsedMinutes;
        let finalSeconds = parsedSeconds;
    
        if (finalHours === 0 && finalMinutes === 0 && finalSeconds === 0 && time > 0) {
            finalHours = Math.floor(time / 3600);
            finalMinutes = Math.floor((time % 3600) / 60);
            finalSeconds = time % 60;
        }
    
        const newLog = {
            left_amount: parseFloat(leftAmount),
            right_amount: parseFloat(rightAmount),
            hours: finalHours,
            minutes: finalMinutes,
            seconds: finalSeconds,
            note,
        };
    
        console.log("Attempting to add:", newLog);
    
        try {
            const { error } = await supabase.from("pump_log").insert([newLog]);
            if (error) {
                console.error("Error adding pump log:", error.message);
            } else {
                alert("Pump log added");
                clear();
                navigation.goBack();
            }
        } catch (error) {
            console.error("Unknown error:", error);
        }
    };
    
    

    return(
        <>
        <Stack.Screen
            options={{
                headerTitle: 'Pump Tracker',
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
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
            <View className='flex-col justify-between h-full'>
                <View className='pt-4 pr-4 pl-4'>
                    {/* Top Box */}
                    <View className='box-container'>
                        <View className='flex-col gap-5 '>
                             
                            <Text className='text-7xl figtree'>{formatTime(time)}</Text>
                            <View className='flex-row gap-3 mt-4'>
                                <Pressable onPress={handleStart} className='button bg-green-200'>
                                    <Text className='text-xl figtree'>Start</Text>
                                </Pressable>
                                <Pressable onPress={handleStop} className='button bg-red-200'>
                                    <Text className='text-xl figtree'>Stop</Text>
                                </Pressable>
                                <Pressable onPress={handleReset} className='button bg-gray-200'>
                                    <Text className='text-xl figtree'>Reset</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                    {/* End of Box */}
                    <View flex-col gap-5 >
                        <Text className='text-2xl font-bold '>Manual Entry</Text>
                            <View className='flex-col gap-4'>
                                <View className='flex-row gap-4 border-gray-200 border-2 p-2 pr-4 pl-4 rounded-3xl justify-between items-center'>
                                    <Text className='input-label mt-6 mb-6'>
                                        Duration
                                    </Text>
                                    <View className='flex-row gap-2'>
                                        <TextInput
                                            placeholder='0h'
                                            value={hours}
                                            onChangeText={setHours}
                                            className='input'
                                            keyboardType='number-pad'
                                            placeholderTextColor={'#888'}
                                        />
                                        <TextInput
                                            placeholder='0m'
                                            value={minutes}
                                            onChangeText={setMinutes}
                                            className='input'
                                            keyboardType='number-pad'
                                            placeholderTextColor={'#888'}
                                        />
                                        <TextInput
                                            placeholder='0s'
                                            value={seconds}
                                            onChangeText={setSeconds}
                                            className='input'
                                            keyboardType='number-pad'
                                            placeholderTextColor={'#888'}
                                        />
                                    </View>
                                </View>
                            </View>
                    </View>
                    <View flex-col gap-5 >
                        <View className='flex-row gap-5'>
                            <Text className='text-2xl font-bold '>
                                Amount Pumped
                            </Text>
                            <View className='bg-gray-200 py-2 px-6 rounded-full'>
                                <Text className='text-xl figtree'>
                                    0.0z
                                </Text>
                            </View>
                        </View >
                        <View className='flex-row gap-5'>
                            <View className='flex-row gap-4 border-gray-200 border-2 p-2 pr-4 pl-4 rounded-3xl justify-between items-center'>
                                <Text className='input-label mt-6 mb-6'>
                                    Left
                                </Text>
                                <View className='flex-row gap-2'>
                                    <TextInput
                                        placeholder='0.0'
                                        value={leftAmount}
                                        onChangeText={setLeftAmount}
                                        className='input'
                                        keyboardType='decimal-pad'
                                        placeholderTextColor={'#888'}
                                    />   
                                </View>
                            </View>
                            <View className='flex-row gap-4 border-gray-200 border-2 p-2 pr-4 pl-4 rounded-3xl justify-between items-center'>
                                <Text className='input-label mt-6 mb-6'>
                                    Right
                                </Text>
                                <View className='flex-row gap-2'>
                                    <TextInput
                                        placeholder='0.0'
                                        value={rightAmount}
                                        onChangeText={setRightAmount}
                                        className='input'
                                        keyboardType='decimal-pad'
                                        placeholderTextColor={'#888'}
                                    />   
                                </View>
                            </View>
                        </View>
                    </View>
                    <View className='note'>
                        <TextInput
                            placeholder='+ Add a note'
                            className='text-xl p-1 figtree w-full'
                            keyboardType='default'
                            value={note}
                            onChangeText={setNotes}
                            placeholderTextColor={'#000'}
                            multiline={true}
                            maxLength={200}
                        />
                    </View>
                    <View
                        className='justify-end pt-4 pr-8 pl-8'
                    >
                        <View className='flex-row justify-between'>
                            <Pressable
                                onPress={handleAddEntry}
                                className='button'
                            >
                                <Text className='text-xl figtree'>Add</Text>
                            </Pressable>
                            <Pressable
                                onPress={clear}
                                className='button bg-orange-100'
                            >
                                <Text className='text-xl figtree'>Clear</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    </>
    )
}