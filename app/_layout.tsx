import { Stack } from "expo-router";
import Header from "./components/header";
import "@/global.css";

export default function RootLayout() {
    return (
        <Stack screenOptions={{ header: () => <Header /> }} />
    )
}
