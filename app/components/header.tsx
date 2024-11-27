import { View, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Platform } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'

export default function Header() {
    const insets = useSafeAreaInsets()
    const defaultTitle = '👶 Tracker'
    return (
        <>
            <StatusBar style='dark' />
            <View
                style={{
                    paddingTop: insets.top,
                    paddingLeft: insets.left + 24,
                    paddingRight: insets.right + 24,
                    paddingBottom: 12,
                }}
                className='flex-row items-center justify-between bg-white'
            >
                <Text
                    style={{
                        fontFamily: Platform.select({
                            android: 'Figtree_700ExtraBold',
                            ios: 'Figtree-ExtraBold',
                        }),
                        fontSize: 24,
                    }}
                >
                    {defaultTitle}
                </Text>
                <View className='flex-row border-black border-2 gap-1 rounded-full items-center pr-2'>
                    <Text className='aspect-square p-2'>👩</Text>
                    <Text>Profile</Text>
                </View>
            </View>
        </>
    )
}
