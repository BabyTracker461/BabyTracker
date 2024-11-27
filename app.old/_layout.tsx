import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import Header from './components/generic-header'
import '@/global.css'
import {
    Figtree_400Regular,
    Figtree_800ExtraBold,
    useFonts,
} from '@expo-google-fonts/figtree'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    const [loaded, error] = useFonts({
        Figtree_400Regular,
        Figtree_800ExtraBold,
    })

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync()
        }
    }, [loaded, error])

    if (!loaded && !error) {
        return null
    }

    return (
        <Stack>
            <Stack.Screen
                name='(tabs)'
                options={{ header: (props) => <Header {...props} /> }}
            />
        </Stack>
    )
}
