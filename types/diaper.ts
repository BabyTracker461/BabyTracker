export type diaper_amount = 'SM' | 'MD' | 'LG'
export type diaper_consistency = 'Wet' | 'Dry' | 'Mixed'

export type DiaperLog = {
    timestamp: Date
    amount: diaper_amount
    consistency: diaper_consistency
    note?: string
}

export type LocalDiaperLog = {
    local_id: number
    supabase_id?: string | null // The UUID from Supabase
    child_id: string
    consistency: diaper_consistency
    amount: diaper_amount
    change_time: string // Store as ISO string
    logged_at?: string | null // Store as ISO string from Supabase
    note?: string | null
}
