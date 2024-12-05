import { Text, Platform } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function Profile() {
    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Profile',
                    headerTitleStyle: {
                        fontFamily: Platform.select({
                            android: 'Figtree-700ExtraBold',
                            ios: 'Figtree-ExtraBold',
                        }),
                    },
                }}
            />
            <Text>Profile</Text>
        </>
    )
}
