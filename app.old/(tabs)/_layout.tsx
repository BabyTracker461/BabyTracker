import { Text } from 'react-native'
import HomeHeader from '../components/home-header'
import TrendsHeader from '../components/trends-header'

//export default function TabLayout() {
//    return (
//        <Tabs
//            screenOptions={{
//                tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
//                tabBarStyle: { backgroundColor: 'none' },
//            }}
//        >
//            <Tabs.Screen
//                name='index'
//                options={{
//                    title: 'Tracker',
//                    header: () => <HomeHeader />,
//                    tabBarIcon: () => null,
//                }}
//            />
//            <Tabs.Screen
//                name='trends'
//                options={{
//                    title: 'Trends',
//                    header: () => <TrendsHeader />,
//                    tabBarIcon: () => null,
//                }}
//            />
//        </Tabs>
//    )
//}

import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Defining the layout of the custom tab navigator
export default function Layout() {
    const insets = useSafeAreaInsets()

    return (
        <Tabs>
            <TabSlot />
            <TabList
                style={{
                    paddingBottom: insets.bottom,
                }}
                className='flex-row justify-center align-middle'
            >
                <TabTrigger name='home' href='/' className='p-4 bg-red-100'>
                    <Text>Home</Text>
                </TabTrigger>
                <TabTrigger
                    name='article'
                    href='/trends'
                    className='p-4 bg-red-100'
                >
                    <Text>Article</Text>
                </TabTrigger>
            </TabList>
        </Tabs>
    )
}
