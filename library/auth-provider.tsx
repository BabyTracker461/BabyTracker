import { Session } from '@supabase/supabase-js'
import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from 'react'
import supabase from '@/library/supabase-client'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthContextType = {
    session: Session | null
    loading: boolean
    error: string | null
    // add other helpers like signIn, signOut, signUp, etc.
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export function AuthProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // 1) Check for an existing session when the provider mounts
        const getSession = async () => {
            try {
                const { data, error } = await supabase.auth.getSession()
                if (error) throw error
                setSession(data.session)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        getSession()

        // 2) Listen for future auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setSession(session)
            },
        )

        // Cleanup subscription on unmount
        return () => {
            authListener.subscription?.unsubscribe()
        }
    }, [])

    const value: AuthContextType = {
        session,
        loading,
        error,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
