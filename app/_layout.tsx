import { Stack } from 'expo-router'
import { AuthProvider } from '@/library/auth-provider'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'

import '../global.css'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'

export default function RootLayout() {
    return (
        <AuthProvider>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaProvider>
                    <StatusBar style='auto' />
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            navigationBarTranslucent: true,
                        }}
                    >
                        {/* Important for modals to properly render from (main) screens */}
                        <Stack.Screen
                            name='(modals)'
                            options={{ presentation: 'modal' }}
                        />
                    </Stack>
                </SafeAreaProvider>
            </TouchableWithoutFeedback>
        </AuthProvider>
    )
}
