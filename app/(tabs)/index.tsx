import React, { useEffect, useState } from 'react'
import { ExternalPathString, router } from 'expo-router'
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
} from 'react-native'
import TrackerButton from '@/components/tracker-button'
import { useAuth } from '@/library/auth-provider'
import { BlurView } from 'expo-blur'
import Button from '@/components/button'
import supabase from '@/library/supabase-client'

export default function MainTab() {
    type Button = {
        label: string
        icon: string
        link: ExternalPathString
    }

    const buttons: Button[] = [
        {
            label: 'Sleep',
            icon: '🌙',
            link: '/sleep' as ExternalPathString,
        },
        {
            label: 'Nursing',
            icon: '🍼',
            link: '/nursing' as ExternalPathString,
        },
        {
            label: 'Milestone',
            icon: '🌟',
            link: '/milestone' as ExternalPathString,
        },
        {
            label: 'Feeding',
            icon: '🍽️',
            link: '/feeding' as ExternalPathString,
        },
        { label: 'Diaper', icon: '🧷', link: '/diaper' as ExternalPathString },
        { label: 'Health', icon: '💚', link: '/health' as ExternalPathString },
    ]

    const { session } = useAuth()
    const [newChildState, setChildState] = useState(false)
    const [childName, setChildName] = useState('')

    const handleSaveChild = async () => {
        if (!childName) {
            Alert.alert('Please enter a name!')
            return
        }

        try {
            const user = await supabase.auth.getUser()
            const userId = user.data?.user?.id

            if (!userId) {
                throw new Error('User not found.')
            }

            let child = childName.charAt(0).toUpperCase() + childName.slice(1)

            // Insert child into the database
            const { data, error } = await supabase
                .from('children')
                .insert([{ user_id: userId, name: child }])
                .select('id')
                .single()

            if (error) {
                throw error
            }

            // Update user session metadata with the active child
            await supabase.auth.updateUser({
                data: { activeChild: child },
            })

            setChildState(false) // Close modal
        } catch (error: any) {
            Alert.alert(
                'Error',
                error.message || 'An error occurred while saving child data.',
            )
        }
    }

    useEffect(() => {
        if (session) {
            // Check if activeChild exists in user_metadata
            const activeChild = session.user.user_metadata?.activeChild
            if (!activeChild) {
                // If no active child, prompt the user to add a child
                setChildState(true)
            }
        }
    }, [session])

    return (
        <View className='main-container flex-col'>
            <View className='flex-row justify-center gap-4 items-center flex-grow'>
                <View className='flex-col gap-4'>
                    <TrackerButton button={buttons[0]} />
                    <TrackerButton button={buttons[1]} />
                    <TrackerButton button={buttons[2]} />
                </View>
                <View className='flex-col gap-4'>
                    <TrackerButton button={buttons[3]} />
                    <TrackerButton button={buttons[4]} />
                    <TrackerButton button={buttons[5]} />
                </View>
                <Modal visible={newChildState} transparent>
                    <TouchableWithoutFeedback
                        onPress={Keyboard.dismiss}
                        accessible={false}
                    >
                        <BlurView
                            intensity={10}
                            className='grow items-center justify-center'
                        >
                            <View className='p-8 h-[50%] w-[80%] bg-white dark:bg-black rounded-3xl border-[1px] border-gray-300 dark:border-gray-600'>
                                <View className='mb-5'>
                                    <Text className='subheading font-bold mb-6'>
                                        Welcome to SimpleBaby
                                    </Text>
                                    <Text className='subtitle'>
                                        Please add your first child's name
                                        below:
                                    </Text>
                                </View>
                                <View className='grow justify-between'>
                                    <View>
                                        <Text className='text font-bold mb-1'>
                                            Child Name
                                        </Text>
                                        <TextInput
                                            className='text-input'
                                            placeholder='Enter a name to start tracking'
                                            value={childName}
                                            onChangeText={setChildName}
                                            autoCapitalize='none'
                                            keyboardType='default'
                                        />
                                    </View>
                                    <View>
                                        <Button
                                            text='Save & Start Tracking'
                                            action={handleSaveChild}
                                            textClass='font-bold'
                                            buttonClass='button-normal'
                                        />
                                    </View>
                                </View>
                            </View>
                        </BlurView>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        </View>
    )
}
