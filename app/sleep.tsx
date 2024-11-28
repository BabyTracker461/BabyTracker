import { Text, Platform } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function Sleep() {
    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Sleep',
                    headerTitleStyle: {
                        fontFamily: Platform.select({
                            android: 'Figtree-700ExtraBold',
                            ios: 'Figtree-ExtraBold',
                        }),
                    },
                }}
            />
            <Text>Sleep</Text>
        </>
    )
}
