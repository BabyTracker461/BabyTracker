import React from 'react'
import { Link, Stack } from 'expo-router'
import Header from '../components/header'
import { View, Text, Platform } from 'react-native'

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
                    header: () => <Header />,
                }}
            />
            <View className='flex-row flex-wrap h-full justify-center align-center pt-20 gap-4 bg-white'>
                {buttons.map((button, key) => (
                    <Link href={button.link} key={key}>
                        <View
                            className='border-4 w-52 h-52 rounded-[40] items-center justify-center bg-white' // items-center is x, justify-center is y
                        >
                            <Text className='text-7xl p-4'>{button.icon}</Text>
                            <Text
                                className='text-black'
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
