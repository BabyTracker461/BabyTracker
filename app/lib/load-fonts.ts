import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { Figtree_400Regular, Figtree_800ExtraBold, useFonts } from '@expo-google-fonts/figtree'

export default function loadFonts() {
    SplashScreen.preventAutoHideAsync();
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
}
