'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { updateProfileSchema } from '@/lib/validations'

export async function updateProfile(input: { handle?: string; display_name?: string; avatar_url?: string }) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  const validated = updateProfileSchema.parse(input)

  const { data, error } = await (supabase
    .from('profiles') as any)
    .update(validated)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/app/settings')
  return { data }
}

export async function getProfile(userId?: string) {
  const supabase = await createClient()
  
  let targetUserId = userId
  if (!targetUserId) {
    const { data: { user } } = await supabase.auth.getUser()
    targetUserId = user?.id
  }

  if (!targetUserId) {
    return { error: 'User not found' }
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', targetUserId)
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function getProfileByHandle(handle: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('handle', handle)
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

