import {
    Text,
    Platform,
    View,
    Pressable,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native'
import React, { useRef, useState } from 'react'
import { Stack } from 'expo-router'

export default function Sleep() {
    const [hours, setHours] = useState<string>('')
    const [minutes, setMinutes] = useState<string>('')
    const [note, setNotes] = useState<string>('')
    const formatInput = (value: string, type: 'h' | 'm'): string => {
        const numericValue = value.replace(/[^0-9]/g, '')
        return numericValue ? `${numericValue}${type}` : ''
    }

    const handleHoursChange = (text: string) => {
        setHours(formatInput(text, 'h'))
    }

    const handleMinutesChange = (text: string) => {
        setMinutes(formatInput(text, 'm'))
    }

    const [time, setTime] = useState<number>(0) // Time in seconds
    const [isRunning, setIsRunning] = useState<boolean>(false)
    const intervalRef = useRef<NodeJS.Timer | null>(null)

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

    const globalFeedbackUpdate = () => {
        if (Keyboard.isVisible()) Keyboard.dismiss()
        handleMinutesChange(minutes)
        handleHoursChange(hours)
    }

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Sleep Tracker 🌙',
                    headerTitleStyle: {
                        fontFamily: Platform.select({
                            android: 'Figtree-700ExtraBold',
                            ios: 'Figtree-ExtraBold',
                        }),
                    },
                    contentStyle: {
                        backgroundColor: 'white',
                        justifyContent: 'flex-end',
                        flex: 1,
                        overflow: 'hidden',
                    },
                }}
            />
            <TouchableWithoutFeedback
                onPress={globalFeedbackUpdate}
                accessible={false}
            >
                <View className='pt-4 pr-8 pl-8 flex-1'>
                    <View className='box-container'>
                        <Text className='text-7xl figtree'>
                            {formatTime(time)}
                        </Text>
                        <View className='flex-row'>
                            <Pressable
                                onPress={handleStart}
                                className='button bg-green-200'
                            >
                                <Text className='text-xl figtree'>Start</Text>
                            </Pressable>
                            <Pressable
                                onPress={handleStop}
                                className='button bg-red-200'
                            >
                                <Text className='text-xl figtree'>Stop</Text>
                            </Pressable>
                        </View>
                    </View>
                    <Text className='subheading'>Manual Entry</Text>
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
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </>
    )
}
