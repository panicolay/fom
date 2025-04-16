import { supabase } from '../lib/supabase'

interface SignUpParams {
  email: string
  password: string
  username: string
  avatarUrl?: string | null
  bio?: string | null
}

export async function signUpUser({
  email,
  password,
  username,
  avatarUrl = null,
  bio = null,
}: SignUpParams) {
  // 1. User creation via Supabase Auth
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password })
  if (signUpError) {
    console.log('🚀 ~ signUpUser ~ signUpError.message:', signUpError.message)
    throw new Error(signUpError.message)
  }

  // 2. Wait for the session to be active
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !sessionData.session) {
    throw new Error('Impossible to get session after signup.')
  }

  console.log('🚀 ~ signUpUser ~ sessionData:', sessionData)
  const userId = sessionData.session.user.id
  console.log('🚀 ~ signUpUser ~ userId:', userId)

  // 2. UserProfile creation in `profiles` table
  const { error: profileError } = await supabase.from('profiles').insert({
    id: userId,
    username,
    avatar_url: avatarUrl,
    bio,
  })

  if (profileError) {
    console.log('🚀 ~ signUpUser ~ profileError.message:', profileError.message)
    throw new Error(profileError.message)
  }

  return signUpData.user
}
