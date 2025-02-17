import React, { useEffect } from 'react'
import { ExternalPathString, Link, router, Stack } from 'expo-router'
import { headerLeftTitle, headerRightTitle } from '@/components/header-titles'
import { View, Text, Platform, Pressable, TouchableOpacity } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import TrackerButton from '@/components/tracker-button'
//import { storeEncryptionKey, getEncryptionKey } from '../lib/secureStorage';

const leftHeaderText = '👶 Tracker'
const rightHeaderText = {
    icon: '👩',
    text: 'Profile',
    link: '/profile' as ExternalPathString,
}

export default function MainTab() {
    useEffect(() => {
        const testSecureStore = async () => {
            //await storeEncryptionKey(); // Ensure encryption key exists
            //const key = await getEncryptionKey(); // Retrieve it
            //console.log("🚀 SecureStore Test Key:", key);
        }

        testSecureStore()
    }, [])

    type Button = {
        label: string
        icon: string
        link: ExternalPathString
    }
    const buttons: Button[] = [
        { label: 'Sleep', icon: '🌙', link: '/sleep' as ExternalPathString },
        { label: 'Pump', icon: '🍼', link: '/pump' as ExternalPathString },
        {
            label: 'Milestone',
            icon: '🌟',
            link: '/milestone' as ExternalPathString,
        },
        {
            label: 'Feeding',
            icon: '🍽️',
            link: '/feeding' as ExternalPathString,
        },
        { label: 'Diaper', icon: '🧷', link: '/diaper' as ExternalPathString },
        { label: 'Growth', icon: '👶', link: '/growth' as ExternalPathString },
    ]

    const insets = useSafeAreaInsets()
    const topInset = insets.top
    return (
        <View className='main-container flex-col'>
            <View
                className='bg-[#fff5e4] dark:bg-[#0b2218] flex-row justify-between p-0 m-0'
                style={{ paddingTop: topInset }}
            >
                <Text className='pl-4 font-bold dark:text-white  text-black text-2xl scale-100'>
                    👶 SimpleTracker
                </Text>
                <TouchableOpacity
                    className='pr-4'
                    onPress={() => router.push('/(modals)/profile')}
                >
                    <View className='flex-row gap-2 p-2 border-2 rounded-full dark:border-[#293c25]  dark:bg-[#6fac7d] bg-[#fff2af]'>
                        <Text className='pl-2'>👩</Text>
                        <Text className='pr-2 dark:text-[#ffefa9]'>
                            Profile
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View className='flex-row justify-center gap-4 items-center flex-grow'>
                <View className='flex-col gap-4'>
                    <TrackerButton button={buttons[0]} />
                    <TrackerButton button={buttons[1]} />
                    <TrackerButton button={buttons[2]} />
                </View>
                <View className='flex-col gap-4'>
                    <TrackerButton button={buttons[3]} />
                    <TrackerButton button={buttons[4]} />
                    <TrackerButton button={buttons[5]} />
                </View>
            </View>
        </View>
    )
}
