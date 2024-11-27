import { Stack } from "expo-router";
import Header from "./components/header";
import "@/global.css";
import { Figtree_400Regular, Figtree_700Bold, Figtree_800ExtraBold, useFonts } from '@expo-google-fonts/figtree'
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

    const [loaded, error] = useFonts({
        Figtree_400Regular,
        Figtree_800ExtraBold,
        Figtree_700Bold
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <Stack screenOptions={{ header: () => <Header /> }} />
    )
}
