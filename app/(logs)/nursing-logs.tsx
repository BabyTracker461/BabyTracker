import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { format } from 'date-fns'
import { getActiveChildId } from '@/library/utils'
import supabase from '@/library/supabase-client'

// Define the shape of a nursing log entry
interface NursingLog {
    id: string
    child_id: string
    left_duration: string | null
    right_duration: string | null
    logged_at: string
    note: string | null
    left_amount: string | null
    right_amount: string | null
}

// Component to display nursing logs
const NursingLogsView: React.FC = () => {
    const [nursingLogs, setNursingLogs] = useState<NursingLog[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchNursingLogs()
    }, [])

    const fetchNursingLogs = async () => {
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
                .from('nursing_logs')
                .select('*')
                .eq('child_id', childId)
                .order('logged_at', { ascending: false })

            if (error) throw error
            setNursingLogs(data || [])
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

    const renderNursingLogItem = ({ item }: { item: NursingLog }) => (
        <View style={styles.logItem}>
            <Text style={styles.dateText}>
                {format(new Date(item.logged_at), 'MMM dd, yyyy')}
            </Text>
            <Text style={styles.timeText}>
                Time Logged: {format(new Date(item.logged_at), 'h:mm a')}
            </Text>
            {item.left_duration && (
                <Text style={styles.durationText}>
                    Left Duration: {item.left_duration}
                </Text>
            )}
            {item.right_duration && (
                <Text style={styles.durationText}>
                    Right Duration: {item.right_duration}
                </Text>
            )}
            {item.left_amount && (
                <Text style={styles.amountText}>
                    Left Amount: {item.left_amount}
                </Text>
            )}
            {item.right_amount && (
                <Text style={styles.amountText}>
                    Right Amount: {item.right_amount}
                </Text>
            )}
            {item.note && (
                <Text style={styles.noteText}>Note: {item.note}</Text>
            )}
        </View>
    )

    if (loading) {
        return <Text>Loading nursing logs...</Text>
    }

    if (error) {
        return <Text>Error: {error}</Text>
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nursing Logs</Text>
            <FlatList
                data={nursingLogs}
                renderItem={renderNursingLogItem}
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
    timeText: {
        fontSize: 16,
        marginBottom: 4,
    },
    durationText: {
        fontSize: 16,
        marginBottom: 4,
    },
    amountText: {
        fontSize: 16,
        marginBottom: 4,
    },
    noteText: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#666',
    },
})

export default NursingLogsView
