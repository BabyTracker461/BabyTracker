import { LocalDiaperLog } from '@/types/diaper'
import { SupabaseClient } from '@supabase/supabase-js'
import * as SQLite from 'expo-sqlite'
import { getActiveChildId } from './utils'
export function localDb() {
    console.log('Local database opened not in root layout.')
    const db = SQLite.openDatabaseSync('simplebaby.db')
    return db
}

export async function initLocalDb() {
    const db = await SQLite.openDatabaseAsync('simplebaby.db')
    console.log('Local database opened.')

    try {
        db.execSync('BEGIN TRANSACTION;')

        // Check if the 'status' table exists
        // We query the sqlite_master table, which contains metadata about the database schema.
        const result = db.getFirstSync(
            "SELECT name FROM sqlite_master WHERE type='table' AND name = ?;",
            ['status'],
        )

        let tableExists = !!result

        if (tableExists) {
            console.log('Existing local database exists.')
        } else {
            db.execSync(`
        CREATE TABLE status (
          status TEXT PRIMARY KEY NOT NULL
        );
      `)

            db.runSync('INSERT INTO status (status) VALUES (?);', ['online'])
            console.log('Note: local database online for the first time.')
        }

        db.execSync('COMMIT;')
    } catch (error) {
        console.error('Local database setup failed:', error)
        try {
            db.execSync('ROLLBACK;')
            console.log('Transaction rolled back.')
        } catch (rollbackError) {
            console.error('Failed to rollback transaction:', rollbackError)
        }
        throw error
    }
    console.log('Local database online.')

    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS local_diaper_logs (
            local_id INTEGER PRIMARY KEY AUTOINCREMENT,
            supabase_id TEXT UNIQUE,
            child_id TEXT NOT NULL,
            consistency TEXT NOT NULL,
            amount TEXT NOT NULL,
            change_time TEXT NOT NULL,
            logged_at TEXT,
            note TEXT
        );
    `)

    db.closeAsync()
}

export async function setupLocalDiaperTable(db: SQLite.SQLiteDatabase) {
    try {
        // Using TEXT for timestamps (ISO strings) and UUIDs is common and simpler
        // Using UNIQUE constraint on supabase_id helps with UPSERT logic during sync
        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS local_diaper_logs (
                local_id INTEGER PRIMARY KEY AUTOINCREMENT,
                supabase_id TEXT UNIQUE,
                child_id TEXT NOT NULL,
                consistency TEXT NOT NULL,
                amount TEXT NOT NULL,
                change_time TEXT NOT NULL,
                logged_at TEXT,
                note TEXT
            );
        `)
        console.log("Local 'local_diaper_logs' table ensured.")
    } catch (error) {
        console.error('Failed to set up local diaper table:', error)
        throw error // Handle appropriately
    }
}

export const syncDiaperLogs = async (
    db: SQLite.SQLiteDatabase,
    supabase: SupabaseClient,
): Promise<{
    uploadSuccess: boolean
    downloadSuccess: boolean
    uploadStats: { succeeded: number; failed: number; totalPending: number }
    downloadStats: { processed: number; failed: number; totalReceived: number }
    errors: any[]
}> => {
    // --- Get Active Child ID ---
    const child_id = (await getActiveChildId()).childId // Retrieve the active child ID

    // --- Check if Child ID is available ---
    if (!child_id) {
        console.error(
            'Sync: Cannot sync diaper logs. No active child ID found.',
        )
        // Return a specific failure state indicating no sync could be performed
        return {
            uploadSuccess: false,
            downloadSuccess: false,
            uploadStats: { succeeded: 0, failed: 0, totalPending: 0 },
            downloadStats: { processed: 0, failed: 0, totalReceived: 0 },
            errors: [
                { type: 'setup', message: 'No active child ID found to sync.' },
            ],
        }
    }

    console.log(
        `Starting diaper log synchronization for child_id: ${child_id}...`,
    ) // Include child_id in log

    let overallUploadSuccess = true
    let overallDownloadSuccess = true
    const errors: any[] = []

    // --- Upload Stats ---
    let successfulUploads = 0
    let failedUploads = 0
    let totalPending = 0

    // --- 1. Upload Pending Local Logs for the specific child ---
    try {
        console.log(
            `Sync: Checking for pending local logs for child_id ${child_id} to upload...`,
        )
        const sqlUpload =
            'SELECT * FROM local_diaper_logs WHERE supabase_id IS NULL AND child_id = ?;'
        const pendingLogs = await db.getAllAsync<LocalDiaperLog>(sqlUpload, [
            child_id,
        ]) // Filter by child_id

        totalPending = pendingLogs.length

        console.log(
            `Sync: Found ${totalPending} pending log(s) for child_id ${child_id} for upload.`,
        )

        for (const log of pendingLogs) {
            // Basic data check (already present)
            if (!log.consistency || !log.amount || !log.change_time) {
                // child_id is already confirmed by query
                console.warn(
                    `Sync: Skipping upload for local_id ${log.local_id} due to missing essential data.`,
                )
                continue
            }

            // console.log(`Sync: Attempting to upload local_id: ${log.local_id}`);
            try {
                const payload = {
                    child_id: log.child_id, // Should match the active child_id
                    consistency: log.consistency,
                    amount: log.amount,
                    change_time: log.change_time,
                    note: log.note,
                }

                // Double-check child_id consistency before sending
                if (payload.child_id !== child_id) {
                    console.warn(
                        `Sync: Skipping upload for local_id ${log.local_id}. Log child_id (${log.child_id}) does not match active child_id (${child_id}).`,
                    )
                    continue // Should not happen if local DB query is correct, but safety check
                }

                const { data: supabaseData, error: supabaseError } =
                    await supabase
                        .from('diaper_logs')
                        .insert(payload)
                        .select()
                        .single()

                if (supabaseError) throw supabaseError
                if (!supabaseData?.id || !supabaseData?.logged_at) {
                    throw new Error(
                        'Supabase insert during sync succeeded but returned no ID/timestamp.',
                    )
                }

                await db.runAsync(
                    'UPDATE local_diaper_logs SET supabase_id = ?, logged_at = ? WHERE local_id = ?',
                    [supabaseData.id, supabaseData.logged_at, log.local_id],
                )
                successfulUploads++
            } catch (uploadError: any) {
                console.error(
                    `Sync: Failed to upload local_id: ${log.local_id}`,
                    uploadError?.message,
                )
                errors.push({
                    type: 'upload',
                    local_id: log.local_id,
                    message: uploadError?.message,
                    error: uploadError,
                })
                failedUploads++
                overallUploadSuccess = false
            }
        }
        console.log(
            `Sync: Finished uploading pending logs for child_id ${child_id}. Succeeded: ${successfulUploads}, Failed: ${failedUploads}, Total Attempted: ${
                successfulUploads + failedUploads
            }`,
        )
    } catch (dbError) {
        console.error(
            `Sync: Error retrieving pending logs from local DB for child_id ${child_id}:`,
            dbError,
        )
        errors.push({ type: 'upload_fetch', error: dbError })
        overallUploadSuccess = false
    }

    // --- Download Stats ---
    let successfulDownloads = 0
    let failedDownloads = 0
    let totalReceived = 0

    // --- 2. Download Remote Changes for the specific child and UPSERT Locally ---
    try {
        console.log(
            `Sync: Fetching logs from Supabase for child_id ${child_id} for local update...`,
        ) // Update log
        const { data: remoteLogs, error: downloadError } = await supabase
            .from('diaper_logs')
            .select('*')
            .eq('child_id', child_id) // Filter by child_id using .eq()

        if (downloadError) throw downloadError

        if (!remoteLogs || remoteLogs.length === 0) {
            console.log(
                `Sync: No logs found in Supabase for child_id ${child_id}.`,
            ) // Update log
            totalReceived = 0
        } else {
            totalReceived = remoteLogs.length
            console.log(
                `Sync: Received ${totalReceived} logs from Supabase for child_id ${child_id}. Processing UPSERT...`,
            ) // Update log

            await db.withTransactionAsync(async () => {
                for (const remoteLog of remoteLogs) {
                    // Basic data check (already present)
                    if (
                        !remoteLog.id ||
                        !remoteLog.consistency ||
                        !remoteLog.amount ||
                        !remoteLog.change_time ||
                        !remoteLog.logged_at
                    ) {
                        // child_id is checked by filter, but validate anyway
                        console.warn(
                            `Sync: Skipping UPSERT for remote log due to missing data: id=${remoteLog.id}`,
                        )
                        continue
                    }
                    // Optional: Add consistency check for child_id if needed
                    if (remoteLog.child_id !== child_id) {
                        console.warn(
                            `Sync: Skipping UPSERT for remote log id ${remoteLog.id}. Its child_id (${remoteLog.child_id}) doesn't match the active one (${child_id}). Should not happen with .eq() filter.`,
                        )
                        continue
                    }

                    const upsertSql = `
                        INSERT INTO local_diaper_logs (
                            supabase_id, child_id, consistency, amount, change_time, logged_at, note
                        ) VALUES (?, ?, ?, ?, ?, ?, ?)
                        ON CONFLICT(supabase_id) DO UPDATE SET
                            child_id = excluded.child_id,
                            consistency = excluded.consistency,
                            amount = excluded.amount,
                            change_time = excluded.change_time,
                            logged_at = excluded.logged_at,
                            note = excluded.note
                        -- Optional WHERE clause, e.g.: WHERE excluded.logged_at > local_diaper_logs.logged_at;
                    `
                    try {
                        const result = await db.runAsync(upsertSql, [
                            remoteLog.id,
                            remoteLog.child_id, // Should match active child_id
                            remoteLog.consistency,
                            remoteLog.amount,
                            remoteLog.change_time,
                            remoteLog.logged_at,
                            remoteLog.note ?? null,
                        ])

                        if (result.changes > 0) {
                            successfulDownloads++
                        }
                    } catch (upsertError: any) {
                        console.error(
                            `Sync: Error UPSERTING supabase_id ${remoteLog.id}:`,
                            upsertError?.message,
                        )
                        errors.push({
                            type: 'download_upsert',
                            supabase_id: remoteLog.id,
                            message: upsertError?.message,
                            error: upsertError,
                        })
                        failedDownloads++
                        overallDownloadSuccess = false
                    }
                }
            })
            console.log(
                `Sync: Finished processing downloaded logs for child_id ${child_id}. Processed (Inserted/Updated): ${successfulDownloads}, Failed Attempts: ${failedDownloads}, Total Received: ${totalReceived}`,
            ) // Update log
        }
    } catch (downloadDbError) {
        console.error(
            `Sync: Error during download/UPSERT operation for child_id ${child_id}:`,
            downloadDbError,
        ) // Update log
        errors.push({ type: 'download', error: downloadDbError })
        overallDownloadSuccess = false
    }

    console.log(
        `Sync: Synchronization attempt for child_id ${child_id} finished.`,
    ) // Update log
    if (errors.length > 0) {
        console.warn(
            `Sync: Completed with ${errors.length} error(s) for child_id ${child_id}.`,
        ) // Update log
    }

    // !! Removed db.closeAsync() call here !!

    // Return detailed stats along with overall success flags
    return {
        uploadSuccess: overallUploadSuccess,
        downloadSuccess: overallDownloadSuccess,
        uploadStats: {
            succeeded: successfulUploads,
            failed: failedUploads,
            totalPending: totalPending,
        },
        downloadStats: {
            processed: successfulDownloads,
            failed: failedDownloads,
            totalReceived: totalReceived,
        },
        errors,
    }
}
