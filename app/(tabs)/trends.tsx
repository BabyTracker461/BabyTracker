import { ExternalPathString, Link, Stack } from 'expo-router'
import { View, Text, Platform } from 'react-native'
import React from 'react'
import { headerLeftTitle, headerRightTitle } from '@/components/header-titles'

const rightHeaderText = {
    icon: '📅',
    text: 'Calendar',
    link: '/calendar' as ExternalPathString,
}
const leftHeaderText = '📈 Logs'

type Button = {
    label: string
    icon: string
    link: any
}

export default function LogTab() {
    const bars: Button[] = [
        { label: 'Sleep', icon: '🌙', link: '/sleep-log' },
        { label: 'Pump', icon: '🍼', link: '/pump' },
        { label: 'Milestone', icon: '🌟', link: '/milestone' },
        { label: 'Feeding', icon: '🍽️', link: '/feeding' },
        { label: 'Diaper', icon: '🧷', link: '/diaper-log' },
        { label: 'Growth', icon: '👶', link: '/growth' },
    ]

    return (
        <>
            <Stack.Screen
                options={{
                    headerLeft: () => headerLeftTitle(leftHeaderText),
                    headerRight: () =>
                        headerRightTitle(
                            rightHeaderText.icon,
                            rightHeaderText.text,
                            rightHeaderText.link,
                        ),
                    headerTitle: '',
                }}
            />
            <View className='flex-col h-full justify-center gap-4 bg-white pr-4 pl-4'>
                {bars.map((bars, key) => (
                    <Link href={bars.link} className='group' key={key}>
                        <View className='flex-row justify-between group-active:bg-blue-50 group-active:border-gray-300 border-[3px] w-full rounded-[20] bg-white p-4'>
                            <View className='flex-col justify-center items-center'>
                                <Text className='text-2xl'>{bars.icon}</Text>
                                <Text className='text-black figtree font-bold group-active:text-gray-400 text-xl'>
                                    {bars.label}
                                </Text>
                            </View>
                            <View>
                                <Text>num logs, graph</Text>
                            </View>
                        </View>
                    </Link>
                ))}
            </View>
        </>
    )
}
