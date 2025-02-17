import { TouchableOpacity, Text } from 'react-native'

export default function Button({
    text,
    action,
    buttonClass,
    textClass,
}: {
    text: string
    action: () => void
    buttonClass?: string | undefined
    textClass?: string | undefined
}) {
    return (
        <TouchableOpacity onPress={action} className={`button ${buttonClass}`}>
            <Text className={`button-text ${textClass}`}>{text}</Text>
        </TouchableOpacity>
    )
}
