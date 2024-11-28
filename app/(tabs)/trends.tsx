import { Stack } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import {
    headerLeftTitle,
    headerRightTitle,
} from '@/app/components/header-titles'

const rightHeaderText = { icon: '📅', text: 'Calendar' }
const leftHeaderText = '📈 Trends'

export default function Tab() {
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
                }}
            />
            <View style={styles.container}>
                <Text>Tab [Home|Settings]</Text>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
