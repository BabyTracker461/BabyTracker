import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { format } from 'date-fns'
import { getActiveChildId } from '@/library/utils'
import supabase from '@/library/supabase-client'

interface HealthLog {
    id: string
    child_id: string | null
    category: string | null
    growth_length: string | null
    growth_weight: string | null
    growth_head: string | null
    activity_type: string | null
    activity_duration: string | null
    meds_name: string | null
    meds_amount: string | null
    meds_time_taken: string | null
    note: string | null
    logged_at: string
}

const HealthLogsView: React.FC = () => {
    const [logs, setLogs] = useState<HealthLog[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchHealthLogs()
    }, [])

    const fetchHealthLogs = async () => {
        try {
            const {
                success,
                childId,
                error: childError,
            } = await getActiveChildId()
            if (!success || !childId) {
                throw new Error('No active child selected')
            }

            const { data, error } = await supabase
                .from('health_logs')
                .select('*')
                .eq('child_id', childId)
                .order('logged_at', { ascending: false })

            if (error) throw error
            setLogs(data || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load logs')
        } finally {
            setLoading(false)
        }
    }

    // Render all available details regardless of the log.category value.
    const renderLogDetails = (log: HealthLog) => {
        const details = []

        // Render any growth fields if they exist.
        if (log.growth_length || log.growth_weight || log.growth_head) {
            if (log.growth_length) details.push(`Length: ${log.growth_length}`)
            if (log.growth_weight) details.push(`Weight: ${log.growth_weight}`)
            if (log.growth_head) details.push(`Head: ${log.growth_head}`)
        }

        // Render any activity fields if they exist.
        if (log.activity_type || log.activity_duration) {
            if (log.activity_type) details.push(`Type: ${log.activity_type}`)
            if (log.activity_duration)
                details.push(`Duration: ${log.activity_duration}`)
        }

        // Render medication fields if available.
        if (log.meds_name) {
            details.push(`Medication: ${log.meds_name}`)
            if (log.meds_amount) details.push(`Dose: ${log.meds_amount}`)
            if (log.meds_time_taken) {
                details.push(
                    `Time Taken: ${format(
                        new Date(log.meds_time_taken),
                        'h:mm a',
                    )}`,
                )
            }
        }

        return details.map((detail, index) => (
            <Text key={index} style={styles.detailText}>
                {detail}
            </Text>
        ))
    }

    const renderLogItem = ({ item }: { item: HealthLog }) => (
        <View style={styles.logItem}>
            <Text style={styles.dateText}>
                {format(new Date(item.logged_at), 'MMM dd, yyyy')}
            </Text>
            <Text style={styles.timeText}>
                {format(new Date(item.logged_at), 'h:mm a')}
            </Text>
            {item.category && (
                <Text style={styles.categoryText}>
                    Category: {item.category}
                </Text>
            )}
            {renderLogDetails(item)}
            {item.note && (
                <Text style={styles.noteText}>Note: {item.note}</Text>
            )}
        </View>
    )

    if (loading) return <Text>Loading health logs...</Text>
    if (error) return <Text>Error: {error}</Text>

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Health Logs</Text>
            <FlatList
                data={logs}
                renderItem={renderLogItem}
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
    categoryText: {
        fontSize: 16,
        fontWeight: '600',
        marginVertical: 8,
        color: '#2c3e50',
    },
    detailText: {
        fontSize: 16,
        marginBottom: 4,
        color: '#34495e',
    },
    noteText: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#666',
    },
})

export default HealthLogsView
