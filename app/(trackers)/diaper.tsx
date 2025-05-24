import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
} from 'react-native'
import { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import supabase from '@/library/supabase-client'
import { router } from 'expo-router'
import { getActiveChildId } from '@/library/utils'
import DiaperModule from '@/components/diaper-module'
import { encryptData } from '@/library/crypto'

export default function Diaper() {
    const insets = useSafeAreaInsets()
    const [isTyping, setIsTyping] = useState(false)
    const [consistency, setConsistency] = useState('')
    const [amount, setAmount] = useState('')
    const [changeTime, setChangeTime] = useState(new Date())
    const [note, setNote] = useState('')

    const createDiaperLog = async (
        childId: string,
        consistency: string,
        amount: string,
        changeTime: Date,
        note = '',
    ) => {
        try {
            const encryptedConsistency = await encryptData(consistency)
            const encryptedAmount = await encryptData(amount)
            const encryptedNote = note ? await encryptData(note) : null

            const { data, error } = await supabase.from('diaper_logs').insert([
                {
                    child_id: childId,
                    consistency: encryptedConsistency,
                    amount: encryptedAmount,
                    change_time: changeTime.toISOString(),
                    note: encryptedNote,
                },
            ])

            if (error) {
                console.error('Error creating diaper log:', error)
                return { success: false, error }
            }

            return { success: true, data }
        } catch (err) {
            console.error('❌ Encryption or insert failed:', err)
            return { success: false, error: 'Encryption or database error' }
        }
    }

    const saveDiaperLog = async () => {
        const { success, childId, error } = await getActiveChildId()

        if (!success) {
            Alert.alert(`Error: ${error}`)
            return { success: false, error }
        }

        return await createDiaperLog(
            childId,
            consistency,
            amount,
            changeTime,
            note,
        )
    }

    const handleSaveDiaperLog = async () => {
        if (consistency && amount) {
            const result = await saveDiaperLog()
            if (result.success) {
                router.replace('/(tabs)')
                Alert.alert('Diaper log saved successfully!')
            } else {
                Alert.alert(`Failed to save diaper log: ${result.error}`)
            }
        } else {
            Alert.alert('Please provide consistency and amount')
        }
    }

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
                >
                    <DiaperModule
                        onConsistencyUpdate={setConsistency}
                        onAmountUpdate={setAmount}
                        onTimeUpdate={setChangeTime}
                    />
                    <View className='bottom-5'>
                        <View className='items-start top-5 left-3 z-10'>
                            <Text className='bg-gray-200 p-3 rounded-xl font'>
                                Add a note
                            </Text>
                        </View>
                        <View className='p-4 pt-9 bg-white rounded-xl z-0'>
                            <TextInput
                                className=''
                                placeholderTextColor={'#aaa'}
                                placeholder='i.e. really messy'
                                multiline={true}
                                maxLength={200}
                                onFocus={() => setIsTyping(true)}
                                onBlur={() => setIsTyping(false)}
                                value={note}
                                onChangeText={setNote}
                            />
                        </View>
                    </View>
                </View>
                <View className='flex-row gap-2'>
                    <TouchableOpacity
                        className='rounded-full p-4 bg-red-100 grow'
                        onPress={handleSaveDiaperLog}
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