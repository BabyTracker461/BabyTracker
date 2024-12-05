import { Tabs } from 'expo-router'
import { Text, Platform } from 'react-native'

const Icon = (color: string, text: string) => {
    return <Text style={{ color }}>{text}</Text>
}

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#349bee',
                tabBarLabelStyle: {
                    fontSize: 14,
                    fontFamily: Platform.select({
                        android: 'Figtree_700ExtraBold',
                        ios: 'Figtree-ExtraBold',
                    }),
                },
                headerShadowVisible: false,
            }}
        >
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Trackers',
                    tabBarIcon: ({ color }) => Icon(color, '👶'),
                }}
            />
            <Tabs.Screen
                name='trends'
                options={{
                    title: 'Logs',
                    tabBarIcon: ({ color }) => Icon(color, '📈'),
                }}
            />
        </Tabs>
    )
}
