import { router } from 'expo-router'
import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native'
import { signUp } from '@/library/auth'
import { SafeAreaView } from 'react-native-safe-area-context'
import Button from '@/components/button'

const SignUpScreen: React.FC = () => {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [confirmPassword, setConfirmPassword] = React.useState('')
    const [passwordHidden, setPasswordHidden] = React.useState(true)
    const [loading, setLoading] = React.useState(false)

    const passwordsMatch = password === confirmPassword

    const handleSignUp = async () => {
        console.log('signUp function called with:', email, password)
        if (!passwordsMatch) return
        setLoading(true)
        try {
            const { error } = await signUp(email, password)
            if (error) {
                alert(error.message)
            } else {
                // if successful, redirect to sign in
                router.push('/signin')
            }
        } catch (err) {
            console.error(err)
            alert('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleSignIn = () => {
        router.push('/signin')
    }

    const handleGuest = () => {
        router.push('/guest')
    }

    const getPasswordInputStyle = () => [
        !passwordsMatch && confirmPassword ? styles.errorInput : {},
    ]

    const buttonTextClass = 'font-semibold'

    return (
        <SafeAreaView className='main-container flex-col justify-end'>
            <View className='mb-5'>
                <Text className='subheading'>Welcome to SimpleBaby,</Text>
                <Text className='heading'>please sign up</Text>
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
                <View>
                    <Text className='text font-bold'>Confirm Password</Text>
                    <TextInput
                        style={getPasswordInputStyle()}
                        className='text-input'
                        placeholder='Confirm your password'
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={passwordHidden}
                    />
                    {!passwordsMatch && confirmPassword ? (
                        <Text className='text-base text-red-600'>
                            Passwords do not match
                        </Text>
                    ) : null}
                </View>
                <View className='flex-row mt-2 justify-between mb-5'>
                    <TouchableOpacity
                        onPress={() => setPasswordHidden(!passwordHidden)}
                        className=''
                    >
                        <Text className='dark:text-white'>
                            {passwordHidden
                                ? 'Show Passwords'
                                : 'Hide Passwords'}
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
                    text={loading ? 'Signing up...' : 'Sign Up'}
                    action={handleSignUp}
                    textClass={buttonTextClass}
                    buttonClass='button-normal'
                />
                <Button
                    text='Sign In Instead'
                    action={handleSignIn}
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

const styles = StyleSheet.create({
    errorInput: {
        borderColor: 'red',
    },
})

export default SignUpScreen
