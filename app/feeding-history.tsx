import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Platform } from 'react-native';
import { useFeeding } from './context/FeedingContext';
import { Link } from 'expo-router';
import { FeedingEntry, FeedingType, BreastSide, MilkType, VolumeUnit, SolidFoodUnit } from './types/feeding';

const FeedingHistory = () => {
    const { feedings, deleteFeeding, updateFeeding } = useFeeding();
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [currentFeeding, setCurrentFeeding] = useState<FeedingEntry | null>(null);
    const [editedDuration, setEditedDuration] = useState('');
    const [editedVolume, setEditedVolume] = useState('');
    const [editedNotes, setEditedNotes] = useState('');
    const [editedVolumeUnit, setEditedVolumeUnit] = useState<VolumeUnit>('oz');
    const [editedFoodName, setEditedFoodName] = useState('');
    const [editedQuantity, setEditedQuantity] = useState('');
    const [editedQuantityUnit, setEditedQuantityUnit] = useState<SolidFoodUnit>('tbsp');

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
                return `${feeding.foodName || 'Food'} - ${feeding.quantity || 0}${feeding.quantityUnit || 'tbsp'}`;
            default:
                return '';
        }
    };

    const handleEdit = (feeding: FeedingEntry) => {
        setCurrentFeeding(feeding);
        setEditedDuration(feeding.duration?.toString() || '');
        setEditedVolume(feeding.volume?.toString() || '');
        setEditedVolumeUnit(feeding.volumeUnit || 'oz');
        setEditedFoodName(feeding.foodName || '');
        setEditedQuantity(feeding.quantity?.toString() || '');
        setEditedQuantityUnit(feeding.quantityUnit || 'tbsp');
        setEditedNotes(feeding.notes || '');
        setEditModalVisible(true);
    };

    const handleSaveEdit = async () => {
        if (!currentFeeding) return;

        const updatedFeeding = { ...currentFeeding };

        if (currentFeeding.type === 'breast' && editedDuration) {
            updatedFeeding.duration = Number(editedDuration);
        }

        if (currentFeeding.type === 'bottle' && editedVolume) {
            updatedFeeding.volume = Number(editedVolume);
            updatedFeeding.volumeUnit = editedVolumeUnit;
        }

        if (currentFeeding.type === 'solid') {
            updatedFeeding.foodName = editedFoodName;
            updatedFeeding.quantity = editedQuantity ? Number(editedQuantity) : undefined;
            updatedFeeding.quantityUnit = editedQuantityUnit;
        }

        updatedFeeding.notes = editedNotes;

        await updateFeeding(updatedFeeding);
        setEditModalVisible(false);
        setCurrentFeeding(null);
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
                                    <View className="flex-row">
                                        <TouchableOpacity
                                            onPress={() => handleEdit(feeding)}
                                            className="bg-blue-100 py-1 px-2 rounded mr-2"
                                        >
                                            <Text className="text-blue-500">Edit</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => deleteFeeding(feeding.id)}
                                            className="bg-red-100 py-1 px-2 rounded"
                                        >
                                            <Text className="text-red-500">Delete</Text>
                                        </TouchableOpacity>
                                    </View>
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

            {/* Edit Modal */}
            <Modal
                visible={editModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white p-6 rounded-lg w-5/6 max-w-md">
                        <Text className="text-xl font-bold mb-4">Edit Feeding</Text>
                        
                        {currentFeeding?.type === 'breast' && (
                            <View className="mb-4">
                                <Text className="font-semibold mb-2">Duration (minutes)</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg p-2"
                                    value={editedDuration}
                                    onChangeText={setEditedDuration}
                                    keyboardType="numeric"
                                />
                            </View>
                        )}

                        {currentFeeding?.type === 'bottle' && (
                            <View className="mb-4">
                                <Text className="font-semibold mb-2">Volume</Text>
                                <View className="flex-row items-center">
                                    <TextInput
                                        className="flex-1 border border-gray-300 rounded-lg p-2 mr-2"
                                        value={editedVolume}
                                        onChangeText={setEditedVolume}
                                        keyboardType="numeric"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setEditedVolumeUnit(editedVolumeUnit === 'oz' ? 'mL' : 'oz')}
                                        className="py-2 px-4 bg-gray-200 rounded-lg"
                                    >
                                        <Text>{editedVolumeUnit}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {currentFeeding?.type === 'solid' && (
                            <>
                                <View className="mb-4">
                                    <Text className="font-semibold mb-2">Food Name</Text>
                                    <TextInput
                                        className="border border-gray-300 rounded-lg p-2"
                                        value={editedFoodName}
                                        onChangeText={setEditedFoodName}
                                    />
                                </View>
                                <View className="mb-4">
                                    <Text className="font-semibold mb-2">Quantity</Text>
                                    <View className="flex-row items-center">
                                        <TextInput
                                            className="flex-1 border border-gray-300 rounded-lg p-2 mr-2"
                                            value={editedQuantity}
                                            onChangeText={setEditedQuantity}
                                            keyboardType="numeric"
                                        />
                                        <TouchableOpacity
                                            onPress={() => {
                                                const units: SolidFoodUnit[] = ['tbsp', 'tsp', 'grams', 'oz', 'cups'];
                                                const currentIndex = units.indexOf(editedQuantityUnit);
                                                const nextIndex = (currentIndex + 1) % units.length;
                                                setEditedQuantityUnit(units[nextIndex]);
                                            }}
                                            className="py-2 px-4 bg-gray-200 rounded-lg"
                                        >
                                            <Text>{editedQuantityUnit}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </>
                        )}

                        <View className="mb-4">
                            <Text className="font-semibold mb-2">Notes</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg p-2"
                                value={editedNotes}
                                onChangeText={setEditedNotes}
                                multiline
                            />
                        </View>

                        <View className="flex-row justify-end">
                            <TouchableOpacity
                                onPress={() => setEditModalVisible(false)}
                                className="bg-gray-200 py-2 px-4 rounded-lg mr-2"
                            >
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleSaveEdit}
                                className="bg-blue-500 py-2 px-4 rounded-lg"
                            >
                                <Text className="text-white">Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default FeedingHistory;
