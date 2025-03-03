import { Stack } from 'expo-router'
import '@/global.css'
import loadFonts from './lib/load-fonts'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { FeedingProvider } from './context/FeedingContext'

export default function Layout() {
    if (loadFonts() == 1) return null
    return (
        <FeedingProvider>
            <StatusBar
                backgroundColor='auto'
                hideTransitionAnimation='none'
                style='dark'
            />
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
                <Stack.Screen
                    name='feeding-history'
                    options={{
                        presentation: 'modal',
                        title: 'Feeding History'
                    }}
                />
            </Stack>
        </FeedingProvider>
    )
}
