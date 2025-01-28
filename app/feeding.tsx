import React, { useState } from 'react';
import {
    View,
    ScrollView,
    KeyboardAvoidingView,
    TextInput,
    StyleSheet,
    Text,
    Platform,
    TouchableOpacity,
    Button,
} from 'react-native';
import { useFeeding } from './context/FeedingContext';
import { FeedingType, BreastSide, MilkType } from './types/feeding';
import { Link } from 'expo-router';

const FeedingScreen = () => {
    const { addFeeding } = useFeeding();
    const [feedingType, setFeedingType] = useState<FeedingType>('breast');
    const [breastSide, setBreastSide] = useState<BreastSide>('left');
    const [duration, setDuration] = useState('');
    const [milkType, setMilkType] = useState<MilkType>('breast milk');
    const [volume, setVolume] = useState('');
    const [volumeUnit, setVolumeUnit] = useState<'oz' | 'mL'>('oz');
    const [notes, setNotes] = useState('');

    const handleSubmit = async () => {
        const now = new Date();
        await addFeeding({
            type: feedingType,
            startTime: now,
            endTime: now,
            side: feedingType === 'breast' ? breastSide : undefined,
            duration: feedingType === 'breast' ? Number(duration) : undefined,
            milkType: feedingType === 'bottle' ? milkType : undefined,
            volume: feedingType === 'bottle' ? Number(volume) : undefined,
            volumeUnit: feedingType === 'bottle' ? volumeUnit : undefined,
            notes,
            childId: '1', // TODO: Replace with actual child ID
        });

        // Reset form
        setDuration('');
        setVolume('');
        setNotes('');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
        >
            <ScrollView className="flex-1 p-4">
                <View className="mb-6">
                    <Text className="text-lg font-bold mb-4">Feeding Type</Text>
                    <View className="flex-row justify-between mb-4">
                        {(['breast', 'bottle', 'solid'] as FeedingType[]).map((type) => (
                            <TouchableOpacity
                                key={type}
                                onPress={() => setFeedingType(type)}
                                className={`py-2 px-4 rounded-full ${
                                    feedingType === type ? 'bg-blue-500' : 'bg-gray-200'
                                }`}
                            >
                                <Text
                                    className={`${
                                        feedingType === type ? 'text-white' : 'text-gray-700'
                                    } capitalize`}
                                >
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {feedingType === 'breast' && (
                    <View className="mb-6">
                        <Text className="text-lg font-bold mb-4">Breast Side</Text>
                        <View className="flex-row justify-between mb-4">
                            {(['left', 'right', 'both'] as BreastSide[]).map((side) => (
                                <TouchableOpacity
                                    key={side}
                                    onPress={() => setBreastSide(side)}
                                    className={`py-2 px-4 rounded-full ${
                                        breastSide === side ? 'bg-blue-500' : 'bg-gray-200'
                                    }`}
                                >
                                    <Text
                                        className={`${
                                            breastSide === side ? 'text-white' : 'text-gray-700'
                                        } capitalize`}
                                    >
                                        {side}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TextInput
                            className="border border-gray-300 rounded-lg p-2 mb-4"
                            placeholder="Duration (minutes)"
                            value={duration}
                            onChangeText={setDuration}
                            keyboardType="numeric"
                        />
                    </View>
                )}

                {feedingType === 'bottle' && (
                    <View className="mb-6">
                        <Text className="text-lg font-bold mb-4">Bottle Details</Text>
                        <View className="flex-row justify-between mb-4">
                            {(['breast milk', 'formula'] as MilkType[]).map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    onPress={() => setMilkType(type)}
                                    className={`py-2 px-4 rounded-full ${
                                        milkType === type ? 'bg-blue-500' : 'bg-gray-200'
                                    }`}
                                >
                                    <Text
                                        className={`${
                                            milkType === type ? 'text-white' : 'text-gray-700'
                                        } capitalize`}
                                    >
                                        {type}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View className="flex-row items-center mb-4">
                            <TextInput
                                className="flex-1 border border-gray-300 rounded-lg p-2 mr-2"
                                placeholder="Volume"
                                value={volume}
                                onChangeText={setVolume}
                                keyboardType="numeric"
                            />
                            <TouchableOpacity
                                onPress={() =>
                                    setVolumeUnit(volumeUnit === 'oz' ? 'mL' : 'oz')
                                }
                                className="py-2 px-4 bg-gray-200 rounded-lg"
                            >
                                <Text>{volumeUnit}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <TextInput
                    className="border border-gray-300 rounded-lg p-2 mb-6"
                    placeholder="Notes"
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                />

                <TouchableOpacity
                    onPress={handleSubmit}
                    className="bg-blue-500 py-3 px-4 rounded-lg"
                >
                    <Text className="text-white text-center font-bold">Log Feeding</Text>
                </TouchableOpacity>

                <Link href="/feeding-history" className="mt-4">
                    <Text className="text-blue-500 text-center">View Feeding History</Text>
                </Link>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default FeedingScreen;
