import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { router } from 'expo-router'
import { useAuth } from '@/library/auth-provider'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Dimensions } from 'react-native'
import { Image } from 'expo-image'
import Button from '@/components/button'

export default function Welcome() {
    const { session, loading } = useAuth()

    useEffect(() => {
        if (!loading && session) {
            router.replace('/(tabs)')
        }
    }, [session, loading])

    const handleSignIn = () => {
        router.push('/(auth)/signin')
    }

    const handleSignUp = () => {
        router.push('/(auth)/signup')
    }

    const handleGuest = () => {
        router.push('/(auth)/guest')
    }

    const buttonTextClass = 'font-semibold'
    const { width } = Dimensions.get('window')

    return (
        <SafeAreaView className='main-container flex-col justify-end'>
            <View className='w-full overflow-visible items-center'>
                <Image
                    style={{
                        width,
                        height: width,
                        position: 'relative',
                        left: width / 2,
                    }}
                    source={require('@/assets/images/bottle.png')}
                    placeholder={{}}
                    contentFit='contain'
                    transition={1000}
                />
            </View>
            <View className='mt-10'>
                <Text className='subheading'>Welcome to</Text>
                <Text className='heading'>SimpleBaby</Text>
                <Text className='subtitle'>
                    A secure baby tracker that's easy to use.
                </Text>
            </View>
            <View className='flex-col gap-2 mt-10'>
                <Button
                    text='Sign In'
                    action={handleSignIn}
                    textClass={buttonTextClass}
                    buttonClass='button-normal'
                />
                <Button
                    text='Sign Up'
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
