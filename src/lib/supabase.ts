import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// signup
export const signUpUser = async (email: string, password: string) => {
    return await supabase.auth.signUp({
        email,
        password
    })
}

// login
export const signInUser = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
        email,
        password
    })
}
