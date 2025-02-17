import supabase from '@/library/supabase-client'

export interface AuthResponse {
    user: any
    session: any
    error: any
}

export const signUp = async (
    email: string,
    password: string,
): Promise<AuthResponse> => {
    console.log('signUp function called with:', email, password)
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })
    return { user: data?.user, session: data?.session, error }
}

export const signIn = async (
    email: string,
    password: string,
): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    return { user: data?.user, session: data?.session, error }
}

export const signOut = async (): Promise<{ error: any }> => {
    const { error } = await supabase.auth.signOut()
    return { error }
}
