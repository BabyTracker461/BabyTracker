import { Tabs } from 'expo-router'
import { Text } from 'react-native'

const Icon = ({ color }: { color: string }) => {
    return <Text style={{ color }}>i</Text>
}

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Trackers',
                    tabBarIcon: ({ color }) => <Icon color={color} />,
                }}
            />
            <Tabs.Screen
                name='trends'
                options={{
                    title: 'Trends',
                    tabBarIcon: ({ color }) => <Icon color={color} />,
                }}
            />
        </Tabs>
    )
}
