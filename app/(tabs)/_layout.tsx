import { Tabs } from 'expo-router'
import HomeHeader from '../components/home-header'
import TrendsHeader from '../components/trends-header'

export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name='index'
                options={{ title: 'Home', header: () => <HomeHeader /> }}
            />
            <Tabs.Screen
                name='trends'
                options={{ title: 'Trends', header: () => <TrendsHeader /> }}
            />
        </Tabs>
    )
}
