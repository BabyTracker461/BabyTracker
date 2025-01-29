import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useFeeding } from './context/FeedingContext';
import { Link } from 'expo-router';

const FeedingHistory = () => {
    const { feedings, deleteFeeding } = useFeeding();

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleString();
    };

    const getFeedingDetails = (feeding: any) => {
        switch (feeding.type) {
            case 'breast':
                return `${feeding.side} side - ${feeding.duration} minutes`;
            case 'bottle':
                return `${feeding.volume}${feeding.volumeUnit} of ${feeding.milkType}`;
            case 'solid':
                return `${feeding.foodName} - ${feeding.quantity}${feeding.quantityUnit}`;
            default:
                return '';
        }
    };

    return (
        <View className="flex-1 bg-white">
            <ScrollView className="flex-1 p-4">
                <Link href="/feeding" className="mb-4">
                    <Text className="text-blue-500">← Back to Feeding</Text>
                </Link>

                <Text className="text-xl font-bold mb-4">Feeding History</Text>

                {feedings.length === 0 ? (
                    <Text className="text-gray-500 text-center">No feedings recorded yet</Text>
                ) : (
                    feedings
                        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                        .map((feeding) => (
                            <View
                                key={feeding.id}
                                className="border border-gray-200 rounded-lg p-4 mb-4"
                            >
                                <View className="flex-row justify-between items-center mb-2">
                                    <Text className="font-bold capitalize">{feeding.type}</Text>
                                    <TouchableOpacity
                                        onPress={() => deleteFeeding(feeding.id)}
                                        className="bg-red-100 py-1 px-2 rounded"
                                    >
                                        <Text className="text-red-500">Delete</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text className="text-gray-600">
                                    {formatDate(feeding.startTime)}
                                </Text>
                                <Text className="text-gray-800 mt-1">
                                    {getFeedingDetails(feeding)}
                                </Text>
                                {feeding.notes && (
                                    <Text className="text-gray-600 mt-2">{feeding.notes}</Text>
                                )}
                            </View>
                        ))
                )}
            </ScrollView>
        </View>
    );
};

export default FeedingHistory;
