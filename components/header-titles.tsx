import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { ExternalPathString, Link, router } from 'expo-router'

import '@/global.css'
import { SafeAreaView } from 'react-native-safe-area-context'

export function headerLeftTitle(text: string) {
    return (
        <Text className='pl-4 font-bold dark:text-white text-2xl scale-100'>
            {text}
        </Text>
    )
}

export function headerRightTitle(
    text: string,
    icon: string,
    link: ExternalPathString,
) {
    return (
        <TouchableOpacity className='pr-4' onPress={() => router.push(link)}>
            <View className='flex-row gap-2 p-2 border-2 rounded-full bg-white'>
                <Text className='pl-2'>{icon}</Text>
                <Text className='pr-2'>{text}</Text>
            </View>
        </TouchableOpacity>
    )
}

export function Header() {
    return (
        <SafeAreaView className='bg-[#fff5e4] dark:bg-[#0b2218] flex-row justify-between p-0 m-0'>
            <Text className='pl-4 font-bold dark:text-white text-black text-2xl scale-100'>
                👶 SimpleTracker
            </Text>
            <TouchableOpacity
                className='pr-4'
                onPress={() => router.push('/(modals)/profile')}
            >
                <View className='flex-row gap-2 p-2 border-2 rounded-full bg-white dark:border-white'>
                    <Text className='pl-2'>👩</Text>
                    <Text className='pr-2'>Profile</Text>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    )
}
