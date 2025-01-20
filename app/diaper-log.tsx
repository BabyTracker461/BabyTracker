import {
    Text,
    Platform,
    View,
    Pressable,
    Keyboard,
    TouchableWithoutFeedback,
    ScrollView,
    TextInput,
} from 'react-native';
import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import supabase from '@/app/lib/supabase-client';

interface DiaperLog {
    id: string; // UUID as string
    type: 'wet' | 'dry' | 'both'; // Type of diaper change
    rash: boolean; // Rash reported or not
    note?: string; // Optional notes
    logged_at: string; // Timestamp when the log was created
}

export default function DiaperLogs() {
    const insets = useSafeAreaInsets();
    const [diaperLogs, setDiaperLogs] = useState<DiaperLog[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Filter States
    const [filterEnabled, setFilterEnabled] = useState(false);
    const [filterType, setFilterType] = useState<string>('');
    const [filterRash, setFilterRash] = useState<string>('');
    const [filterDate, setFilterDate] = useState<string>('');

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            let query = supabase
                .from('diaper_log')
                .select('*')
                .order('logged_at', { ascending: false });

            // Apply filters if enabled
            if (filterEnabled) {
                if (filterType !== '') {
                    query = query.eq('type', filterType);
                }
                if (filterRash !== '') {
                    query = query.eq('rash', filterRash === 'true');
                }
                if (filterDate !== '') {
                    query = query
                        .gte('logged_at', `${filterDate}T00:00:00`)
                        .lte('logged_at', `${filterDate}T23:59:59`);
                }
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching diaper logs:', error.message);
            } else {
                setDiaperLogs(data as DiaperLog[]);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        }
        setIsLoading(false);
    };

    const globalFeedbackUpdate = () => {
        if (Keyboard.isVisible()) Keyboard.dismiss();
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Diaper Logs 🍼',
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
            <TouchableWithoutFeedback
                onPress={globalFeedbackUpdate}
                accessible={false}
            >
                <View className="flex-col justify-between h-full">
                    {/* Filter Section */}
                    <View
                        style={{
                            padding: 10,
                            backgroundColor: '#f1f5f9',
                            borderRadius: 8,
                            marginHorizontal: 10,
                            marginTop: 10,
                            shadowColor: '#000',
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                        }}
                    >
                        <Pressable
                            onPress={() => setFilterEnabled(!filterEnabled)}
                            style={{
                                backgroundColor: filterEnabled
                                    ? '#f87171' // Red when enabled
                                    : '#60a5fa', // Blue when disabled
                                padding: 10,
                                borderRadius: 10,
                                alignItems: 'center',
                                marginBottom: 10,
                            }}
                        >
                            <Text style={{ color: 'white', fontSize: 16 }}>
                                {filterEnabled
                                    ? 'Disable Filtering'
                                    : 'Enable Filtering'}
                            </Text>
                        </Pressable>

                        {filterEnabled && (
                            <View style={{ flexWrap: 'wrap', gap: 10 }}>
                                {/* Filter by Type */}
                                <View style={{ marginBottom: 10 }}>
                                    <Text style={{ fontSize: 14, marginBottom: 5 }}>
                                        Type:
                                    </Text>
                                    <View style={{ flexDirection: 'row', gap: 10 }}>
                                        <Pressable
                                            onPress={() => setFilterType('wet')}
                                            style={{
                                                backgroundColor: filterType === 'wet' ? '#60a5fa' : '#ccc',
                                                padding: 10,
                                                borderRadius: 5,
                                            }}
                                        >
                                            <Text style={{ color: 'white' }}>Wet</Text>
                                        </Pressable>
                                        <Pressable
                                            onPress={() => setFilterType('dry')}
                                            style={{
                                                backgroundColor: filterType === 'dry' ? '#60a5fa' : '#ccc',
                                                padding: 10,
                                                borderRadius: 5,
                                            }}
                                        >
                                            <Text style={{ color: 'white' }}>Dry</Text>
                                        </Pressable>
                                        <Pressable
                                            onPress={() => setFilterType('both')}
                                            style={{
                                                backgroundColor: filterType === 'both' ? '#60a5fa' : '#ccc',
                                                padding: 10,
                                                borderRadius: 5,
                                            }}
                                        >
                                            <Text style={{ color: 'white' }}>Both</Text>
                                        </Pressable>
                                    </View>
                                </View>

                                {/* Filter by Rash */}
                                <View style={{ marginBottom: 10 }}>
                                    <Text style={{ fontSize: 14, marginBottom: 5 }}>
                                        Rash:
                                    </Text>
                                    <View style={{ flexDirection: 'row', gap: 10 }}>
                                        <Pressable
                                            onPress={() => setFilterRash('true')}
                                            style={{
                                                backgroundColor: filterRash === 'true' ? '#60a5fa' : '#ccc',
                                                padding: 10,
                                                borderRadius: 5,
                                            }}
                                        >
                                            <Text style={{ color: 'white' }}>Yes</Text>
                                        </Pressable>
                                        <Pressable
                                            onPress={() => setFilterRash('false')}
                                            style={{
                                                backgroundColor: filterRash === 'false' ? '#60a5fa' : '#ccc',
                                                padding: 10,
                                                borderRadius: 5,
                                            }}
                                        >
                                            <Text style={{ color: 'white' }}>No</Text>
                                        </Pressable>
                                    </View>
                                </View>

                                {/* Filter by Date */}
                                <View style={{ marginBottom: 10 }}>
                                    <Text style={{ fontSize: 14, marginBottom: 5 }}>
                                        Date (YYYY-MM-DD):
                                    </Text>
                                    <TextInput
                                        placeholder="YYYY-MM-DD"
                                        value={filterDate}
                                        onChangeText={(text) =>
                                            setFilterDate(text)
                                        }
                                        style={{
                                            height: 40,
                                            borderColor: '#ccc',
                                            borderWidth: 1,
                                            borderRadius: 5,
                                            paddingHorizontal: 8,
                                            backgroundColor: '#fff',
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Fetch Logs Button */}
                        <Pressable
                            onPress={fetchLogs}
                            style={{
                                backgroundColor: '#4ade80', // Green
                                padding: 10,
                                borderRadius: 10,
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ color: 'white', fontSize: 16 }}>
                                Fetch Logs
                            </Text>
                        </Pressable>
                    </View>

                    {/* Scrollable View for Logs */}
                    <ScrollView
                        style={{ padding: 10, flex: 1 }}
                        contentContainerStyle={{ paddingBottom: insets.bottom }}
                    >
                        {diaperLogs.length === 0 && !isLoading && (
                            <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                No diaper logs available. Adjust filters or
                                fetch logs to view data.
                            </Text>
                        )}
                        {isLoading && (
                            <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                Loading...
                            </Text>
                        )}
                        {diaperLogs.map((log) => (
                            <View
                                key={log.id}
                                style={{
                                    marginBottom: 10,
                                    padding: 10,
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 5,
                                    backgroundColor: '#f9fafb',
                                    shadowColor: '#000',
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 2,
                                }}
                            >
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                    {`Type: ${log.type}`}
                                </Text>
                                <Text style={{ fontSize: 14 }}>
                                    {`Rash: ${log.rash ? 'Yes' : 'No'}`}
                                </Text>
                                <Text style={{ fontSize: 14 }}>
                                    {`Notes: ${log.note || 'None'}`}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: '#6b7280',
                                    }}
                                >
                                    {`Logged At: ${new Date(
                                        log.logged_at
                                    ).toLocaleString()}`}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </>
    );
}
