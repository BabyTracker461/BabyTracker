import { router, Stack } from 'expo-router'
import '@/global.css'
import {
    configureReanimatedLogger,
    ReanimatedLogLevel,
} from 'react-native-reanimated'
import { AuthProvider } from '@/library/auth-provider'
import { StatusBar } from 'expo-status-bar'
import { initLocalDb } from '@/library/sqlite'

configureReanimatedLogger({
    level: ReanimatedLogLevel.error,
    strict: false,
})

export default function RootLayout() {
    initLocalDb()

    return (
        <AuthProvider>
            <StatusBar style='auto' />
            <Stack
                screenOptions={{
                    navigationBarTranslucent: true,
                    headerShown: false,
                }}
            >
                <Stack.Screen name='index' />
                <Stack.Screen name='(trackers)' />
                <Stack.Screen name='(tabs)' />
                <Stack.Screen name='(logs)' />
                <Stack.Screen name='(auth)' />
                <Stack.Screen
                    name='(modals)'
                    options={{
                        presentation: 'modal',
                    }}
                />
            </Stack>
        </AuthProvider>
    )
}
