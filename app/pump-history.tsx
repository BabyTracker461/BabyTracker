import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Link, useNavigation } from 'expo-router';
import supabase from './lib/supabase-client';
import { PumpLog } from './pump';

const PumpHistory = () => {
    const navigation = useNavigation();
    const [pumpLogs, setPumpLogs] = useState<PumpLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [currentLog, setCurrentLog] = useState<PumpLog | null>(null);
    const [editedLeftAmount, setEditedLeftAmount] = useState('');
    const [editedRightAmount, setEditedRightAmount] = useState('');
    const [editedHours, setEditedHours] = useState('');
    const [editedMinutes, setEditedMinutes] = useState('');
    const [editedSeconds, setEditedSeconds] = useState('');
    const [editedNote, setEditedNote] = useState('');

    useEffect(() => {
        fetchPumpLogs();
    }, []);

    const fetchPumpLogs = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('pump_log')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching pump logs:', error);
                Alert.alert('Error', 'Failed to load pump history');
            } else {
                setPumpLogs(data || []);
            }
        } catch (error) {
            console.error('Unknown error:', error);
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (log: PumpLog) => {
        setCurrentLog(log);
        setEditedLeftAmount(log.left_amount.toString());
        setEditedRightAmount(log.right_amount.toString());
        setEditedHours(log.hours.toString());
        setEditedMinutes(log.minutes.toString());
        setEditedSeconds(log.seconds.toString());
        setEditedNote(log.note || '');
        setEditModalVisible(true);
    };

    const handleSaveEdit = async () => {
        if (!currentLog) return;

        try {
            const updatedLog = {
                left_amount: parseFloat(editedLeftAmount),
                right_amount: parseFloat(editedRightAmount),
                hours: parseInt(editedHours) || 0,
                minutes: parseInt(editedMinutes) || 0,
                seconds: parseInt(editedSeconds) || 0,
                note: editedNote,
            };

            const { error } = await supabase
                .from('pump_log')
                .update(updatedLog)
                .eq('id', currentLog.id);

            if (error) {
                console.error('Error updating pump log:', error);
                Alert.alert('Error', 'Failed to update pump log');
            } else {
                Alert.alert('Success', 'Pump log updated successfully');
                fetchPumpLogs();
                setEditModalVisible(false);
            }
        } catch (error) {
            console.error('Unknown error:', error);
            Alert.alert('Error', 'An unexpected error occurred');
        }
    };

    const handleDelete = async (id: number) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this pump log?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const { error } = await supabase
                                .from('pump_log')
                                .delete()
                                .eq('id', id);

                            if (error) {
                                console.error('Error deleting pump log:', error);
                                Alert.alert('Error', 'Failed to delete pump log');
                            } else {
                                fetchPumpLogs();
                            }
                        } catch (error) {
                            console.error('Unknown error:', error);
                            Alert.alert('Error', 'An unexpected error occurred');
                        }
                    },
                },
            ]
        );
    };

    const formatTime = (hours: number, minutes: number, seconds: number) => {
        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <View className="flex-1 bg-white">
            <ScrollView className="flex-1 p-4">
                <Link href="/pump" className="mb-4">
                    <Text className="text-blue-500">← Back to Pump</Text>
                </Link>

                <Text className="text-xl font-bold mb-4">Pump History</Text>

                {loading ? (
                    <Text className="text-gray-500 text-center">Loading...</Text>
                ) : pumpLogs.length === 0 ? (
                    <Text className="text-gray-500 text-center">No pump logs recorded yet</Text>
                ) : (
                    pumpLogs.map((log) => (
                        <View
                            key={log.id}
                            className="border border-gray-200 rounded-lg p-4 mb-4"
                        >
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="font-bold">Pump Session</Text>
                                <View className="flex-row">
                                    <TouchableOpacity
                                        onPress={() => handleEdit(log)}
                                        className="bg-blue-100 py-1 px-2 rounded mr-2"
                                    >
                                        <Text className="text-blue-500">Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleDelete(log.id)}
                                        className="bg-red-100 py-1 px-2 rounded"
                                    >
                                        <Text className="text-red-500">Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {log.created_at && (
                                <Text className="text-gray-600">
                                    {formatDate(log.created_at)}
                                </Text>
                            )}
                            <View className="mt-2">
                                <Text className="text-gray-800">
                                    Left: {log.left_amount} oz, Right: {log.right_amount} oz
                                </Text>
                                <Text className="text-gray-800">
                                    Duration: {formatTime(log.hours, log.minutes, log.seconds)}
                                </Text>
                                <Text className="text-gray-800">
                                    Total: {(log.left_amount + log.right_amount).toFixed(1)} oz
                                </Text>
                                {log.note && (
                                    <Text className="text-gray-600 mt-2">{log.note}</Text>
                                )}
                            </View>
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
                        <Text className="text-xl font-bold mb-4">Edit Pump Log</Text>
                        
                        <View className="mb-4">
                            <Text className="font-semibold mb-2">Left Amount (oz)</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg p-2"
                                value={editedLeftAmount}
                                onChangeText={setEditedLeftAmount}
                                keyboardType="decimal-pad"
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="font-semibold mb-2">Right Amount (oz)</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg p-2"
                                value={editedRightAmount}
                                onChangeText={setEditedRightAmount}
                                keyboardType="decimal-pad"
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="font-semibold mb-2">Duration</Text>
                            <View className="flex-row space-x-2">
                                <View className="flex-1">
                                    <Text className="text-xs text-gray-500 mb-1">Hours</Text>
                                    <TextInput
                                        className="border border-gray-300 rounded-lg p-2"
                                        value={editedHours}
                                        onChangeText={setEditedHours}
                                        keyboardType="number-pad"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs text-gray-500 mb-1">Minutes</Text>
                                    <TextInput
                                        className="border border-gray-300 rounded-lg p-2"
                                        value={editedMinutes}
                                        onChangeText={setEditedMinutes}
                                        keyboardType="number-pad"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs text-gray-500 mb-1">Seconds</Text>
                                    <TextInput
                                        className="border border-gray-300 rounded-lg p-2"
                                        value={editedSeconds}
                                        onChangeText={setEditedSeconds}
                                        keyboardType="number-pad"
                                    />
                                </View>
                            </View>
                        </View>

                        <View className="mb-4">
                            <Text className="font-semibold mb-2">Notes</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg p-2"
                                value={editedNote}
                                onChangeText={setEditedNote}
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

export default PumpHistory;
