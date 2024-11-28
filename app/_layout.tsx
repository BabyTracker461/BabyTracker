import { Stack } from 'expo-router'
import '@/global.css'
import loadFonts from './lib/load-fonts'
import { StatusBar } from 'expo-status-bar'
import React from 'react'

export default function Layout() {
    if (loadFonts() == 1) return null
    return (
        <>
            <StatusBar backgroundColor='auto' style='dark' />
            <Stack
                screenOptions={{
                    headerBackButtonDisplayMode: 'minimal',
                }}
            >
                <Stack.Screen
                    name='(tabs)'
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>
        </>
    )
}
