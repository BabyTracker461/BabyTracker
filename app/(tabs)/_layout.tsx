import {
    Header,
    headerLeftTitle,
    headerRightTitle,
} from '@/components/header-titles'
import { ExternalPathString, Tabs } from 'expo-router'
import { Text, useColorScheme } from 'react-native'

const Icon = (color: string, text: string) => {
    return <Text style={{ color }}>{text}</Text>
}
export default function TabLayout() {
    const scheme = useColorScheme()
    const tabBarStyle =
        scheme === 'light'
            ? { backgroundColor: '#f0dfcf', borderColor: '#bbb' }
            : { backgroundColor: '#08150e', borderColor: '#000' }

    const tabBarActiveTintColor = scheme === 'light' ? '#bc8877' : '#118866'

    const indexLeftHeaderText = '👶 Tracker'
    const indexRightHeaderText = {
        icon: '👩',
        text: 'Profile',
        link: '/profile' as ExternalPathString,
    }

    return (
        <Tabs
            screenOptions={{
                tabBarStyle,
                tabBarActiveTintColor,
            }}
        >
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Trackers',
                    tabBarLabel: 'Trackers',
                    tabBarIcon: ({ color }) => Icon(color, '👶'),
                    // headerTitle: '',
                    // headerLeft: () => headerLeftTitle(indexLeftHeaderText),
                    // headerRight: () =>
                    //     headerRightTitle(
                    //         indexRightHeaderText.text,
                    //         indexRightHeaderText.icon,
                    //         indexRightHeaderText.link,
                    //     ),
                    // headerStyle:
                    //     scheme === 'light'
                    //         ? { backgroundColor: '#fff5e4' }
                    //         : { backgroundColor: '#0b2218' },
                    header: () => {
                        return null
                    },
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
