import { Dimensions, View, Text, ActivityIndicator } from 'react-native'
import { Image } from 'expo-image'
import Button from '@/components/button'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useAuth } from '@/library/auth-provider'
import { useEffect } from 'react'

export default function RootIndex() {
    const { session, loading } = useAuth()

    useEffect(() => {
        // Once loading is done, if session exists, redirect to (tabs)
        if (!loading && session) {
            router.replace('/(tabs)')
        }
    }, [session, loading, router])

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ActivityIndicator size='large' />
            </View>
        )
    }

    const { width } = Dimensions.get('window')
    const handleSignIn = () => {
        return router.replace('/(auth)/signin')
    }
    const handleSignUp = () => {
        return router.replace('/(auth)/signup')
    }
    const handleGuest = () => {
        return
    }
    const buttonTextClass = ''

    return (
        <SafeAreaProvider>
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
        </SafeAreaProvider>
    )
}
