import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Header() {
    const insets = useSafeAreaInsets();
    return (
        <View
            style={{ paddingTop: insets.top }}
            className="bg-black"
        >
            <Text>Baby Tracker 2</Text>
        </View>
    );
}
