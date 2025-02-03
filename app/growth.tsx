import {
    Text,
    Platform,
    View,
    Pressable,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback,
    Modal,
    Button
} from 'react-native'
import React, { useRef, useState } from 'react'
import { Stack, useNavigation } from 'expo-router'
import { Calendar, DateData } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import supabase from './lib/supabase-client'

export interface GrowthLog{
    id: number;
    height: number;
    weight: number;
    headC:number;
    note?:string;
    logged_at:Date;
}



export default function Growth() {
    const navigation = useNavigation();
    const [height, setHeight] = useState('')
    const [weight, setWeight] = useState('')
    const [headC, setHeadC] = useState('')
    const [note, setNotes] = useState<string>('')
    const [selectedDate, setSelectedDate] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    const clear = () => {
        setSelectedDate('')
        setHeight('')
        setWeight('')
        setHeadC('')
        setNotes('')
    }

    const handleAddEntry = async () => {
        console.log("attempting to add")
        if (!height || !weight || !headC || !selectedDate) {
            alert('Please fill all fields and select a date.');
            return;
        }
        const newLog = {
            height: parseFloat(height),
            weight: parseFloat(weight),
            headC:parseFloat(headC),
            note,
            logged_at: selectedDate,
        }
        console.log("Attempting to add:", newLog);
        try {
            const { error } = await supabase.from('growth_log').insert([newLog]);

            if (error) {
                console.error('Error adding growth log:', error.message);
            } else {
                alert('Diaper log added');
                clear();
                navigation.goBack();
            }
        } catch (error) {
            console.error('Unknown error:', error);
        }   
    }

    



    return(
        <>
        <Stack.Screen
            options={{
                headerTitle: 'Growth Tracker 👶',
                headerTitleStyle: {
                    fontFamily: Platform.select({
                        android: 'Figtree-700ExtraBold',
                        ios: 'Figtree-ExtraBold',
                    }),
                },
                contentStyle: {
                    backgroundColor: 'white',
                },
            }}
        />
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
            <View className='flex-col justify-between h-full'>
                <View className='pt-4 pr-4 pl-4'>
                    {/* Top Box */}
                    <View className='box-container'>
                        <View className='flex-col gap-5'>
                            <View className="flex-row justify-between"> 
                                <Text className="text-5xl">
                                    Growth
                                </Text>
                                {/* Date Button on the Right */}
                                <Pressable
                                    onPress={()=> setIsModalVisible(!isModalVisible)}
                                    className='button bg-green-200'
                                >
                                    <Text className='text-xl figtree'>
                                        {selectedDate || 'Date'}
                                    </Text>
                                </Pressable>
                                <Modal
                                    visible={isModalVisible}
                                    animationType="slide"
                                    transparent={true}
                                    //onRequestClose={setIsModalVisible(false)}
                                >
                                    <View className="flex-1 justify-start items-center">
                                        <View className="bg-white p-6 rounded-lg w-4/5 mt-24">
                                            <Calendar
                                            current={new Date().toISOString().split('T')[0]} // Defaults to today's date
                                            onDayPress={(day : DateData) => setSelectedDate(day.dateString)} // Trigger when a date is selected
                                            markedDates={{
                                                [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
                                            }}
                                            monthFormat={'yyyy MM'} // Month header format
                                            />
                                            <Pressable
                                                onPress={()=> setIsModalVisible(false)}
                                                className='button bg-red-200'
                                            >
                                                <Text className='text-xl figtree'>
                                                    Close
                                                </Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </Modal>

                            </View>
                            <View className='flex-row gap-4 border-gray-200 border-2 p-2 pr-4 pl-4 rounded-3xl justify-between items-center'>
                                <Text className='input-label mt-6 mb-6'>
                                    Height
                                </Text>
                                <View className='flex-row gap-2'>
                                    <TextInput
                                        placeholder='0.0'
                                        value={height}
                                        onChangeText={setHeight}
                                        className='input'
                                        keyboardType='decimal-pad'
                                        placeholderTextColor={'#888'}
                                    />
                                    <Text>
                                        in
                                    </Text>
                                </View>
                            </View>
                            <View className='flex-row gap-4 border-gray-200 border-2 p-2 pr-4 pl-4 rounded-3xl justify-between items-center'>
                                <Text className='input-label mt-6 mb-6'>
                                    Weight
                                </Text>
                                <View className='flex-row gap-2'>
                                    <TextInput
                                        placeholder='0.0'
                                        value={weight}
                                        onChangeText={setWeight}
                                        className='input'
                                        keyboardType='decimal-pad'
                                        placeholderTextColor={'#888'}
                                    />
                                    <Text>
                                        in
                                    </Text>
                                </View>
                            </View>
                            <View className='flex-row gap-4 border-gray-200 border-2 p-2 pr-4 pl-4 rounded-3xl justify-between items-center'>
                                <Text className='input-label mt-6 mb-6'>
                                    Head Circumfrence
                                </Text>
                                <View className='flex-row gap-2'>
                                    <TextInput
                                        placeholder='0.0'
                                        value={headC}
                                        onChangeText={setHeadC}
                                        className='input'
                                        keyboardType='decimal-pad'
                                        placeholderTextColor={'#888'}
                                    />
                                    <Text>
                                        in
                                    </Text>
                                </View>
                            </View>
                            <View className='note'>
                                <TextInput
                                    placeholder='+ Add a note'
                                    className='text-xl p-1 figtree w-full'
                                    keyboardType='default'
                                    value={note}
                                    onChangeText={setNotes}
                                    placeholderTextColor={'#000'}
                                    multiline={true}
                                    maxLength={200}
                                />
                            </View>
                            

                            <View
                                className='justify-end pt-4 pr-8 pl-8'
                            >
                                <View className='flex-row justify-between'>
                                    <Pressable
                                        onPress={handleAddEntry}
                                        className='button'
                                    >
                                        <Text className='text-xl figtree'>Add</Text>
                                    </Pressable>
                                    <Pressable
                                        onPress={clear}
                                        className='button bg-orange-100'
                                    >
                                        <Text className='text-xl figtree'>Clear</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    </>
    )
}
