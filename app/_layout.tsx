import { Stack } from 'expo-router/stack'
import '@/global.css'
import loadFonts from './lib/load-fonts'

export default function Layout() {
    loadFonts()
    return (
        <Stack>
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        </Stack>
    )
}
