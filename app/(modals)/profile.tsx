import { Text, Button } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router'
import { useAuth } from '@/library/auth-provider'
import { signOut } from '@/library/auth'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Profile() {
    const { session } = useAuth()

    const handleSignOut = async () => {
        const { error } = await signOut()
        if (error) {
            console.error('Error signing out:', error)
        } else {
            console.log('Signed out successfully')
            router.dismissAll()
            router.replace('/')
        }
    }

    return (
        <SafeAreaView>
            <Text>Profile</Text>
            {session && <Button title='Sign Out' onPress={handleSignOut} />}
        </SafeAreaView>
    )
}
