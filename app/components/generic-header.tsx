import { View, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Platform } from 'react-native'

export default function TrendsHeader({ back }: { back?: any }) {
    const insets = useSafeAreaInsets()

    return (
        <View
            style={{
                paddingTop: insets.top,
                paddingLeft: insets.left + 24,
                paddingRight: insets.right + 24,
            }}
            className='flex-row items-center justify-between'
        >
            <Text
                style={{
                    fontFamily: Platform.select({
                        android: 'Figtree_700ExtraBold',
                        ios: 'Figtree-ExtraBold',
                    }),
                    fontSize: 24,
                }}
            >
                {!back ? '👶 Tracker' : back.title}
            </Text>

            {!back?.title && (
                <View className='flex-row border-black border-2 gap-1 rounded-full items-center pr-2'>
                    <Text className='aspect-square p-2'>👩</Text>
                    <Text>Profile</Text>
                </View>
            )}
        </View>
    )
}
