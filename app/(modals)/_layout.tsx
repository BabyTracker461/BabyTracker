import { Stack } from 'expo-router'

export default function ModalsLayout() {
    return (
        <Stack>
            <Stack.Screen
                name='calendar'
                options={{
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name='profile'
                options={{
                    headerTitle: 'Profile',
                }}
            />
        </Stack>
    )
}
