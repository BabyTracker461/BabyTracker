import {
    Text,
    Platform,
    View,
    Pressable,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native'
import React, { useRef, useState } from 'react'
import { Stack } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import supabase from '@/app/lib/supabase-client'

interface SleepLog {
    id: number // Unique identifier
    hours: string // Hours slept, e.g., "4h"
    minutes: string // Minutes slept, e.g., "0m"
    note?: string // Optional notes about sleep
    time: number // Total time in minutes or seconds
    logged_at: string // Timestamp when the log was created
}

export default function Sleep() {
    const insets = useSafeAreaInsets()
    const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([])

    const fetchLatestLogs = async () => {
        try {
            const { data, error } = await supabase
                .from('sleep_log') // Table name
                .select('*') // Select all columns
                .order('logged_at', { ascending: false }) // Sort by loggedAt in descending order
                .limit(10) // Limit the results to the latest 10 rows

            if (error) {
                console.error('Error fetching sleep logs:', error.message)
            } else {
                setSleepLogs(data as SleepLog[]) // Typecast to SleepLog array
                console.log('Fetched sleep logs:', data)
            }
        } catch (error) {
            console.error('Unexpected error:', error)
        }
    }

    const globalFeedbackUpdate = () => {
        if (Keyboard.isVisible()) Keyboard.dismiss()
    }

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Sleep Logs 🌙',
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
                <View className='flex-col justify-between h-full'>
                    <View className='pt-4 pr-8 pl-8 flex-col gap-4'>
                        {sleepLogs.map((log) => (
                            <View key={log.id}>
                                <Text className='text-xl'>{`ID: ${log.id}, Sleep time: ${log.hours} ${log.minutes}, Stopwatch time: ${log.time} Notes: ${log.note || 'none'}, Logged at: ${log.logged_at}`}</Text>
                            </View>
                        ))}
                        <Text>
                            Note: the reason there is both stopwatch time and
                            sleep time separately is because we needed to check
                            if the stopwatch worked for testing purposes.
                            Production code will unify the times.
                        </Text>
                    </View>
                    <View
                        className='justify-end pt-4 pr-8 pl-8'
                        style={{ paddingBottom: insets.bottom }}
                    >
                        <View className='flex-row justify-between'>
                            <Pressable
                                onPress={fetchLatestLogs}
                                className='button'
                            >
                                <Text className='text-xl figtree'>Fetch</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    setSleepLogs([])
                                }}
                                className='button bg-orange-100'
                            >
                                <Text className='text-xl figtree'>Clear</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </>
    )
}
