import { ExternalPathString, Stack } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import {
    headerLeftTitle,
    headerRightTitle,
} from '@/app/components/header-titles'

const rightHeaderText = {
    icon: '📅',
    text: 'Calendar',
    link: '/calendar' as ExternalPathString,
}
const leftHeaderText = '📈 Logs'

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
                            rightHeaderText.link,
                        ),
                    headerTitle: '',
                }}
            />
            <View style={styles.container}>
                <Text>Coming soon</Text>
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
