import React from 'react'
import { Link, Stack } from 'expo-router'
import {
    headerLeftTitle,
    headerRightTitle,
} from '@/app/components/header-titles'
import { View, Text, Platform } from 'react-native'

const leftHeaderText = '👶 Tracker'
const rightHeaderText = { icon: '👩', text: 'Profile' }

export default function Tab() {
    type Button = {
        label: string
        icon: string
        link: any
    }
    const buttons: Button[] = [
        { label: 'Sleep', icon: '🌙', link: '/sleep' },
        { label: 'Pump', icon: '🍼', link: '/pump' },
        { label: 'Milestone', icon: '🌟', link: '/milestone' },
        { label: 'Feeding', icon: '🍽️', link: '/feeding' },
        { label: 'Diaper', icon: '🧷', link: '/diaper' },
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
                        ),
                    headerTitle: '',
                    headerShadowVisible: false,
                }}
            />
            <View className='flex-row flex-wrap h-full justify-center align-center pt-20 gap-4 bg-white'>
                {buttons.map((button, key) => (
                    <Link href={button.link} className='group' key={key}>
                        <View
                            className='group-active:bg-blue-50 group-active:border-gray-300 border-4 w-52 h-52 rounded-[40] items-center justify-center bg-white' // items-center is x, justify-center is y
                        >
                            <Text className='text-7xl p-4'>{button.icon}</Text>
                            <Text
                                className='text-black group-active:text-gray-400'
                                style={{
                                    fontFamily: Platform.select({
                                        android: 'Figtree_700ExtraBold',
                                        ios: 'Figtree-ExtraBold',
                                    }),
                                    fontSize: 18,
                                }}
                            >
                                {button.label}
                            </Text>
                        </View>
                    </Link>
                ))}
            </View>
        </>
    )
}
