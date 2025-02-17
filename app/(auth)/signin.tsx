import React from 'react'
import { router } from 'expo-router'
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    KeyboardAvoidingView,
} from 'react-native'
import { signIn } from '@/library/auth'
import Button from '@/components/button'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SignInScreen() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [passwordHidden, setPasswordHidden] = React.useState(true)
    const [loading, setLoading] = React.useState(false)

    const handleSignUp = () => {
        router.push('/(auth)/signup')
    }

    const handleGuest = () => {
        router.push('/(auth)/guest')
    }

    const handleSignIn = async () => {
        setLoading(true)
        const response = await signIn(email, password)
        setLoading(false)
        if (response.error) {
            Alert.alert(
                'Sign In Error',
                response.error.message || 'An error occurred while signing in.',
            )
        } else {
            Alert.alert('Success', 'You have successfully signed in.')
        }
    }

    const buttonTextClass = 'font-semibold'

    return (
        <SafeAreaView className='main-container flex-col justify-end'>
            <View className='mb-5'>
                <Text className='subheading'>Welcome back,</Text>
                <Text className='heading'>please sign in</Text>
            </View>
            <KeyboardAvoidingView
                className='flex-col gap-4 transition-all'
                behavior={'padding'}
            >
                <View className=''>
                    <Text className='text font-bold'>Email</Text>
                    <TextInput
                        className='text-input'
                        placeholder='Enter your email'
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize='none'
                        keyboardType='email-address'
                    />
                </View>
                <View className=''>
                    <Text className='text font-bold'>Password</Text>
                    <TextInput
                        className='text-input'
                        placeholder='Enter your password'
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={passwordHidden}
                    />
                </View>
                <View className='flex-row mt-2 justify-between mb-5'>
                    <TouchableOpacity
                        onPress={() => setPasswordHidden(!passwordHidden)}
                        className=''
                    >
                        <Text className='dark:text-white'>
                            {passwordHidden ? 'Show Password' : 'Hide Password'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text className='dark:text-white'>
                            Forgot your password?
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
            <View className='flex-col gap-2'>
                <Button
                    text={loading ? 'Signing in...' : 'Sign In'}
                    action={handleSignIn}
                    textClass={buttonTextClass}
                    buttonClass='button-normal'
                />
                <Button
                    text='Sign Up Instead'
                    action={handleSignUp}
                    textClass={buttonTextClass}
                    buttonClass='button-normal'
                />
                <Button
                    text='Try as Guest'
                    action={handleGuest}
                    textClass={buttonTextClass}
                    buttonClass='button-normal'
                />
            </View>
        </SafeAreaView>
    )
}
