import { router, Stack } from 'expo-router'
import '../global.css'
import {
    configureReanimatedLogger,
    ReanimatedLogLevel,
} from 'react-native-reanimated'
import { AuthProvider } from '@/library/auth-provider'
import { StatusBar } from 'expo-status-bar'

configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
})

export default function RootLayout() {
    return (
        <AuthProvider>
            <StatusBar style='auto' />
            <Stack
                screenOptions={{
                    navigationBarTranslucent: true,
                }}
            >
                <Stack.Screen name='index' options={{ headerShown: false }} />
                <Stack.Screen
                    name='(trackers)'
                    options={{ headerShown: false }}
                />
                <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
                <Stack.Screen name='(logs)' options={{ headerShown: false }} />

                <Stack.Screen
                    name='(modals)'
                    options={{
                        headerShown: false,
                        presentation: 'modal',
                    }}
                />
                <Stack.Screen name='(auth)' options={{ headerShown: false }} />
            </Stack>
        </AuthProvider>
    )
}
