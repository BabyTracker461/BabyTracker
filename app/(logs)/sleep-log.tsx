import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Alert,
    TextInput,
    Modal,
    TouchableOpacity,
    Pressable,
} from 'react-native'
import { format } from 'date-fns'
import { getActiveChildId } from '@/library/utils'
import supabase from '@/library/supabase-client'
import { decryptData, encryptData } from '@/library/crypto'

interface SleepLog {
    id: string
    start_time: string
    end_time: string
    duration: string | null
    note: string | null
}

const SleepLogsView: React.FC = () => {
    const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [editingLog, setEditingLog] = useState<SleepLog | null>(null)
    const [editModalVisible, setEditModalVisible] = useState(false)

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
                        : childError?.message || 'Failed to get active child ID'
                )
            }

            const { data, error } = await supabase
                .from('sleep_logs')
                .select('*')
                .eq('child_id', childId)
                .order('start_time', { ascending: false })

            if (error) throw error

            const decrypted = await Promise.all(
                (data || []).map(async (entry) => ({
                    ...entry,
                    duration: entry.duration ? await decryptData(entry.duration) : '',
                    note: entry.note ? await decryptData(entry.note) : '',
                }))
            )

            setSleepLogs(decrypted)
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'An unknown error occurred'
            )
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        Alert.alert('Delete Entry', 'Are you sure you want to delete this log?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    const { error } = await supabase
                        .from('sleep_logs')
                        .delete()
                        .eq('id', id)
                    if (error) {
                        Alert.alert('Error deleting log')
                        return
                    }
                    setSleepLogs((prev) => prev.filter((log) => log.id !== id))
                },
            },
        ])
    }

    const handleSaveEdit = async () => {
        if (!editingLog) return

        try {
            const encryptedDuration = editingLog.duration
                ? await encryptData(editingLog.duration)
                : null
            const encryptedNote = editingLog.note
                ? await encryptData(editingLog.note)
                : null

            const { error } = await supabase
                .from('sleep_logs')
                .update({
                    duration: encryptedDuration,
                    note: encryptedNote,
                })
                .eq('id', editingLog.id)

            if (error) {
                Alert.alert('Failed to update log')
                return
            }

            await fetchSleepLogs()
            setEditModalVisible(false)
        } catch (err) {
            console.error('Update error:', err)
            Alert.alert('Something went wrong during save.')
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
            {item.duration && <Text style={styles.durationText}>Duration: {item.duration}</Text>}
            {item.note && <Text style={styles.noteText}>📝{item.note}</Text>}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
                <Pressable
                    onPress={() => {
                        setEditingLog(item)
                        setEditModalVisible(true)
                    }}
                    style={{ marginRight: 8 }}
                >
                    <Text style={{ color: '#2563eb' }}>✏️ Edit</Text>
                </Pressable>
                <Pressable onPress={() => handleDelete(item.id)}>
                    <Text style={{ color: '#dc2626' }}>🗑️ Delete</Text>
                </Pressable>
            </View>
        </View>
    )

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sleep Logs</Text>
            {loading ? (
                <Text>Loading sleep logs...</Text>
            ) : error ? (
                <Text>Error: {error}</Text>
            ) : (
                <FlatList
                    data={sleepLogs}
                    renderItem={renderSleepLogItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            )}

            {/* Edit Modal */}
            <Modal
                visible={editModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000088', padding: 16 }}>
                    <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, width: '100%' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Edit Sleep Log</Text>
                        <Text style={{ fontSize: 14, marginBottom: 4 }}>Duration</Text>
                        <TextInput
                            style={styles.input}
                            value={editingLog?.duration || ''}
                            onChangeText={(text) =>
                                setEditingLog((prev) => prev ? { ...prev, duration: text } : prev)
                            }
                        />
                        <Text style={{ fontSize: 14, marginBottom: 4 }}>Note</Text>
                        <TextInput
                            style={styles.input}
                            value={editingLog?.note || ''}
                            onChangeText={(text) =>
                                setEditingLog((prev) => prev ? { ...prev, note: text } : prev)
                            }
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                            <TouchableOpacity
                                style={{ marginRight: 12 }}
                                onPress={() => setEditModalVisible(false)}
                            >
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ backgroundColor: '#10b981', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}
                                onPress={handleSaveEdit}
                            >
                                <Text style={{ color: 'white' }}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 12,
    },
})

export default SleepLogsView


