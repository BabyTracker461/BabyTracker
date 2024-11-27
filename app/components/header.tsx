import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";

export default function Header() {
    const insets = useSafeAreaInsets();
    return (
        <View
            style={{ paddingTop: insets.top }}
        >
            <Text
                style={{
                    fontFamily: Platform.select({
                        android: 'Figtree_700ExtraBold',
                        ios: 'Figtree-ExtraBold',
                    }),
                }}
            >
                👶 Baby Tracker
            </Text>
        </View>
    );
}
