import { Stack } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Header from '../components/header'

export default function Tab() {
    return (
        <>
            <Stack.Screen
                options={{
                    header: () => <Header />,
                    headerRight: () => null,
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
