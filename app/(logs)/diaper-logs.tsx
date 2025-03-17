import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { format } from 'date-fns'
import { getActiveChildId } from '@/library/utils'
import supabase from '@/library/supabase-client'

// Updated interface for diaper log entry
interface DiaperLog {
    id: string
    child_id: string
    consistency: string
    amount: string
    logged_at: string
    note: string | null
}

// Component to display diaper logs
const DiaperLogsView: React.FC = () => {
    const [diaperLogs, setDiaperLogs] = useState<DiaperLog[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchDiaperLogs()
    }, [])

    const fetchDiaperLogs = async () => {
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

            const { data, error } = await supabase
                .from('diaper_logs')
                .select('*')
                .eq('child_id', childId)
                .order('logged_at', { ascending: false })

            if (error) throw error
            setDiaperLogs(data || [])
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

    const renderDiaperLogItem = ({ item }: { item: DiaperLog }) => (
        <View style={styles.logItem}>
            <Text style={styles.dateText}>
                {format(new Date(item.logged_at), 'MMM dd, yyyy')}
            </Text>
            <Text style={styles.timeText}>
                Time: {format(new Date(item.logged_at), 'h:mm a')}
            </Text>
            <Text style={styles.typeText}>Consistency: {item.consistency}</Text>

            <Text style={styles.sizeText}>Size: {item.amount}</Text>
            {item.note && (
                <Text style={styles.noteText}>Note: {item.note}</Text>
            )}
        </View>
    )

    if (loading) {
        return <Text>Loading diaper logs...</Text>
    }

    if (error) {
        return <Text>Error: {error}</Text>
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Diaper Logs</Text>
            <FlatList
                data={diaperLogs}
                renderItem={renderDiaperLogItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    consistencyText: {
        fontSize: 16,
        marginBottom: 4,
    },
    sizeText: {
        fontSize: 16,
        marginBottom: 4,
    },
    typeText: {
        fontSize: 16,
        marginBottom: 4,
    },
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

export default DiaperLogsView
