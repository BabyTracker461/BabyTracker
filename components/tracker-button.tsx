import { ExternalPathString, router } from 'expo-router'
import { TouchableOpacity, Text } from 'react-native'

type Button = {
    label: string
    icon: string
    link: ExternalPathString
}

export default function TrackerButton({ button }: { button: Button }) {
    return (
        <TouchableOpacity
            className='tracker-button'
            onPress={() => router.push(button.link)}
        >
            <Text className='tracker-icon'>{button.icon}</Text>
            <Text className='tracker-label'>{button.label}</Text>
        </TouchableOpacity>
    )
}
