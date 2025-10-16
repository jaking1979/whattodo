'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createItemSchema, updateItemSchema, updateItemStatusSchema } from '@/lib/validations'
import type { CreateItemInput, UpdateItemInput } from '@/lib/validations'

export async function createItem(input: CreateItemInput) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  const validated = createItemSchema.parse(input)

  const { data, error } = await (supabase
    .from('items') as any)
    .insert({
      ...validated,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/app/lists')
  revalidatePath(`/app/l/${validated.list_id}`)
  return { data }
}

export async function updateItem(input: UpdateItemInput) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  const validated = updateItemSchema.parse(input)
  const { id, ...updates } = validated

  const { data, error } = await (supabase
    .from('items') as any)
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/app/lists')
  revalidatePath(`/app/l/${data.list_id}`)
  return { data }
}

export async function updateItemStatus(id: string, status: 'saved' | 'started' | 'done') {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  const updates: any = { status }
  
  // Set completed_at when marking as done
  if (status === 'done') {
    updates.completed_at = new Date().toISOString()
  } else if (status === 'saved' || status === 'started') {
    // Clear completed_at when unmarking
    updates.completed_at = null
  }

  const { data, error } = await (supabase
    .from('items') as any)
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/app/lists')
  revalidatePath(`/app/l/${data.list_id}`)
  revalidatePath('/app/activity')
  return { data }
}

export async function deleteItem(id: string) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  // Get the list_id before deleting for revalidation
  const { data: item } = await supabase
    .from('items')
    .select('list_id')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  if (item && (item as any).list_id) {
    revalidatePath('/app/lists')
    revalidatePath(`/app/l/${(item as any).list_id}`)
  }

  return { success: true }
}

export async function getItemsByList(listId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('list_id', listId)
    .order('added_at', { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function getRecentActivity(limit = 50) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  const { data, error } = await supabase
    .from('items')
    .select('*, lists(title, slug)')
    .eq('user_id', user.id)
    .eq('status', 'done')
    .not('completed_at', 'is', null)
    .order('completed_at', { ascending: false })
    .limit(limit)

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function moveItemToList(itemId: string, newListId: string) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  // Get the old list_id for revalidation
  const { data: item } = await supabase
    .from('items')
    .select('list_id')
    .eq('id', itemId)
    .single()

  const { data, error } = await (supabase
    .from('items') as any)
    .update({ list_id: newListId })
    .eq('id', itemId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // Revalidate both old and new lists
  if (item && (item as any).list_id) {
    revalidatePath(`/app/l/${(item as any).list_id}`)
  }
  revalidatePath(`/app/l/${newListId}`)
  revalidatePath('/app/lists')

  return { data }
}

