import React, { useEffect, useState } from 'react'
import DateTimePicker, {
    DateTimePickerEvent,
    DateTimePickerAndroid,
} from '@react-native-community/datetimepicker'
import { View, Text, TouchableOpacity, Platform, TextInput } from 'react-native'

type FeedingCategory = 'Liquid' | 'Soft' | 'Solid'

export default function FeedingCategory({
    onTimeUpdate,
    onCategoryUpdate,
    onItemNameUpdate,
    onAmountUpdate,
}: {
    onTimeUpdate?: (time: Date) => void
    onCategoryUpdate?: (category: FeedingCategory) => void
    onItemNameUpdate?: (itemName: string) => void
    onAmountUpdate?: (amount: string) => void
}) {
    const [feedingTime, setFeedingTime] = useState(new Date())
    const [showIOSPicker, setShowIOSPicker] = useState(false)
    const [selectedCategory, setSelectedCategory] =
        useState<FeedingCategory>('Liquid')
    const [itemName, setItemName] = useState('')
    const [amount, setAmount] = useState('')

    useEffect(() => {
        onTimeUpdate?.(feedingTime)
    }, [feedingTime, onTimeUpdate])

    useEffect(() => {
        onCategoryUpdate?.(selectedCategory)
    }, [selectedCategory, onCategoryUpdate])

    useEffect(() => {
        onItemNameUpdate?.(itemName)
    }, [itemName, onItemNameUpdate])

    useEffect(() => {
        onAmountUpdate?.(amount)
    }, [amount, onAmountUpdate])

    const onChangeTime = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (event.type === 'set' && selectedDate) {
            setFeedingTime(selectedDate)
        }
        // setShowIOSPicker(false)
    }

    const showTimePicker = () => {
        if (showIOSPicker) {
            return setShowIOSPicker(false)
        }

        if (Platform.OS === 'android') {
            DateTimePickerAndroid.open({
                value: feedingTime,
                onChange: (event, selectedDate) => {
                    if (selectedDate) {
                        setFeedingTime(selectedDate)
                    }
                },
                mode: 'time',
                is24Hour: false,
            })
        } else {
            setShowIOSPicker(true)
        }
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const handleCategoryPress = (category: FeedingCategory) => {
        setSelectedCategory(category)
    }

    return (
        <View className='flex-col gap-6'>
            <View className='stopwatch-primary'>
                <View className='items-start bottom-5 left-3'>
                    <Text className='bg-gray-200 p-3 rounded-xl font'>
                        🍽️ Choose Category
                    </Text>
                </View>
                <View className='flex-row gap-4 justify-center mb-6'>
                    <TouchableOpacity
                        className={`feeding-category-button ${
                            selectedCategory === 'Liquid'
                                ? 'feeding-category-button-active'
                                : ''
                        }`}
                        onPress={() => handleCategoryPress('Liquid')}
                    >
                        <Text className='scale-100 text-2xl'>🍼</Text>
                        <Text className='feeding-category-text'>Liquid</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`feeding-category-button ${
                            selectedCategory === 'Soft'
                                ? 'feeding-category-button-active'
                                : ''
                        }`}
                        onPress={() => handleCategoryPress('Soft')}
                    >
                        <Text className='scale-100 text-2xl'>🥣</Text>
                        <Text className='feeding-category-text'>Soft</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`feeding-category-button ${
                            selectedCategory === 'Solid'
                                ? 'feeding-category-button-active'
                                : ''
                        }`}
                        onPress={() => handleCategoryPress('Solid')}
                    >
                        <Text className='scale-100 text-2xl'>🥕</Text>
                        <Text className='feeding-category-text'>Solid</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View className='stopwatch-primary'>
                <View className='items-start bottom-5 left-3'>
                    <Text className='bg-gray-200 p-3 rounded-xl font'>
                        ⚖️ Add Details
                    </Text>
                </View>
                <View className='flex-col gap-4 mb-6'>
                    <View className='ml-4 mr-4'>
                        <Text className='feeding-module-label'>Item Name</Text>
                        <TextInput
                            className='text-input-internal'
                            placeholder='i.e. apple sauce'
                            autoCapitalize='none'
                            keyboardType='default'
                            value={itemName}
                            onChangeText={setItemName}
                        />
                    </View>
                    <View className='ml-4 mr-4'>
                        <Text className='feeding-module-label'>Amount</Text>
                        <TextInput
                            className='text-input-internal'
                            placeholder='i.e. 12 oz'
                            autoCapitalize='none'
                            keyboardType='default'
                            value={amount}
                            onChangeText={setAmount}
                        />
                    </View>
                    <View className='ml-4 mr-4 flex-row items-center justify-between'>
                        <Text className='feeding-module-label'>Meal Time</Text>
                        <View className='flex-row items-center bg-red-100 rounded-full gap-2'>
                            <TouchableOpacity
                                className='rounded-full bg-red-50 p-4'
                                onPress={showTimePicker}
                            >
                                <Text>
                                    {showIOSPicker ? 'Close' : 'Choose'} ⏰
                                </Text>
                            </TouchableOpacity>
                            <Text className='mr-4'>
                                {formatTime(feedingTime)}
                            </Text>
                        </View>
                    </View>
                    {showIOSPicker && Platform.OS === 'ios' && (
                        <View className='items-center'>
                            <DateTimePicker
                                testID='dateTimePicker'
                                value={feedingTime}
                                mode='time'
                                is24Hour={false}
                                onChange={onChangeTime}
                                display='spinner'
                            />
                        </View>
                    )}
                </View>
            </View>
        </View>
    )
}
