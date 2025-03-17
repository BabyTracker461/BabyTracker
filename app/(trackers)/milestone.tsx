import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
} from 'react-native'
import { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import supabase from '@/library/supabase-client'
import { router } from 'expo-router'
import { getActiveChildId } from '@/library/utils'
import FeedingCategory from '@/components/feeding-category'

export default function Feeding() {
    const insets = useSafeAreaInsets()
    const [isTyping, setIsTyping] = useState(false)
    const [category, setCategory] = useState('')
    const [itemName, setItemName] = useState('')
    const [amount, setAmount] = useState('')
    const [feedingTime, setFeedingTime] = useState(new Date())
    const [note, setNote] = useState('')

    const createFeedingLog = async (
        childId: string,
        category: string,
        itemName: string,
        amount: string,
        feedingTime: Date,
        note = '',
    ) => {
        const { data, error } = await supabase.from('feeding_logs').insert([
            {
                child_id: childId,
                category,
                item_name: itemName,
                amount,
                feeding_time: feedingTime.toISOString(),
                note,
            },
        ])

        if (error) {
            console.error('Error creating feeding log:', error)
            return { success: false, error }
        }

        return { success: true, data }
    }

    const saveFeedingLog = async () => {
        const { success, childId, error } = await getActiveChildId()

        if (!success) {
            Alert.alert(`Error: ${error}`)
            return { success: false, error }
        }

        return await createFeedingLog(
            childId,
            category,
            itemName,
            amount,
            feedingTime,
            note,
        )
    }

    const handleSaveFeedingLog = async () => {
        if (category && itemName && amount) {
            const result = await saveFeedingLog()
            if (result.success) {
                router.replace('/(tabs)')
                Alert.alert('Feeding log saved successfully!')
            } else {
                Alert.alert(`Failed to save feeding log: ${result.error}`)
            }
        } else {
            Alert.alert('Please provide category, item name, and amount')
        }
    }

    useEffect(() => {
        Alert.alert('Hey!', 'Feature coming soon', [
            { text: 'OK', onPress: () => router.replace('/(tabs)') },
        ])
    }, [])

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View
                className='main-container justify-between'
                style={{ paddingBottom: insets.bottom }}
            >
                <View
                    className={`gap-6 transition-all duration-300 ${
                        isTyping ? '-translate-y-[40%]' : 'translate-y-0'
                    }`}
                ></View>
                <View className='flex-row gap-2'>
                    <TouchableOpacity
                        className='rounded-full p-4 bg-red-100 grow'
                        onPress={handleSaveFeedingLog}
                    >
                        <Text>➕ Add to log</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className='rounded-full p-4 bg-red-100 items-center'
                        onPress={() => router.replace('./')}
                    >
                        <Text>🗑️ Reset fields</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}
