import React from 'react'
import {
    View,
    KeyboardAvoidingView,
    TextInput,
    StyleSheet,
    Text,
    Platform,
    TouchableWithoutFeedback,
    Button,
    Keyboard,
} from 'react-native'

const KeyboardAvoidingComponent = () => {
    return (
        <View className='flex-1'>
            <KeyboardAvoidingView
                behavior='padding'
                className='flex-1'
                keyboardVerticalOffset={40}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        <Text>Header</Text>
                        <TextInput
                            placeholder='Username'
                            placeholderTextColor={'#000'}
                        />
                        <View>
                            <Button title='Submit' onPress={() => null} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inner: {
        flex: 1,
        justifyContent: 'flex-end',
    },
})

export default KeyboardAvoidingComponent
