import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { format } from 'date-fns'
import { getActiveChildId } from '@/library/utils'
import supabase from '@/library/supabase-client'

// Define the shape of a sleep log entry
interface SleepLog {
    id: string
    start_time: string
    end_time: string
    duration: string | null
    note: string | null
}

// Component to display sleep logs
const SleepLogsView: React.FC = () => {
    const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchSleepLogs()
    }, [])

    const fetchSleepLogs = async () => {
        try {
            const {
                success,
                childId,
                error: childError,
            } = await getActiveChildId()
            if (!success || !childId) {
                throw new Error(
                    typeof childError === 'string'
                        ? childError
                        : childError?.message ||
                          'Failed to get active child ID',
                )
            }

            // Supabase query with TypeScript generics
            const { data, error } = await supabase
                .from('sleep_logs')
                .select('*')
                .eq('child_id', childId)
                .order('start_time', { ascending: false })

            if (error) throw error
            setSleepLogs(data || [])
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'An unknown error occurred',
            )
        } finally {
            setLoading(false)
        }
    }

    const renderSleepLogItem = ({ item }: { item: SleepLog }) => (
        <View style={styles.logItem}>
            <Text style={styles.dateText}>
                {format(new Date(item.start_time), 'MMM dd, yyyy')}
            </Text>
            <View style={styles.timeContainer}>
                <Text style={styles.timeText}>
                    Start: {format(new Date(item.start_time), 'h:mm a')}
                </Text>
                <Text style={styles.timeText}>
                    End: {format(new Date(item.end_time), 'h:mm a')}
                </Text>
            </View>
            {item.duration && (
                <Text style={styles.durationText}>
                    Duration: {item.duration}
                </Text>
            )}
            {item.note && (
                <Text style={styles.noteText}>Note: {item.note}</Text>
            )}
        </View>
    )

    if (loading) {
        return <Text>Loading sleep logs...</Text>
    }

    if (error) {
        return <Text>Error: {error}</Text>
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sleep Logs</Text>
            <FlatList
                data={sleepLogs}
                renderItem={renderSleepLogItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    listContainer: {
        paddingBottom: 16,
    },
    logItem: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    timeText: {
        fontSize: 16,
    },
    durationText: {
        fontSize: 16,
        marginBottom: 4,
    },
    noteText: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#666',
    },
})

export default SleepLogsView
