'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createListSchema, updateListSchema } from '@/lib/validations'
import { generateUniqueSlug } from '@/lib/utils/slug'
import type { CreateListInput, UpdateListInput } from '@/lib/validations'

export async function createList(input: CreateListInput) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  const validated = createListSchema.parse(input)

  // Generate slug if visibility is public or unlisted
  let slug = null
  if (validated.visibility === 'public' || validated.visibility === 'unlisted') {
    slug = generateUniqueSlug(validated.title)
  }

  const { data, error} = await (supabase
    .from('lists') as any)
    .insert({
      ...validated,
      user_id: user.id,
      slug,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/app/lists')
  return { data }
}

export async function updateList(input: UpdateListInput) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  const validated = updateListSchema.parse(input)
  const { id, ...updates } = validated

  // Generate or update slug if visibility changed to public/unlisted
  if (updates.visibility && (updates.visibility === 'public' || updates.visibility === 'unlisted')) {
    const { data: existingList } = await supabase
      .from('lists')
      .select('slug, title')
      .eq('id', id)
      .single()

    if (!(existingList as any)?.slug) {
      (updates as any).slug = generateUniqueSlug(updates.title || (existingList as any)?.title || 'list')
    }
  }

  const { data, error } = await (supabase
    .from('lists') as any)
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/app/lists')
  revalidatePath(`/app/l/${id}`)
  return { data }
}

export async function deleteList(id: string) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('lists')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/app/lists')
  return { success: true }
}

export async function getLists() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  const { data, error } = await supabase
    .from('lists')
    .select('*, items(count)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function getList(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('lists')
    .select('*, items(*)')
    .eq('id', id)
    .single()

  if (error) {
    return { error: error.message }
  }

  // Check if user has access (owner or public/unlisted)
  if ((data as any).user_id !== user?.id && (data as any).visibility === 'private') {
    return { error: 'Unauthorized' }
  }

  return { data }
}

export async function cloneList(listId: string) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  // Get the original list and its items
  const { data: originalList, error: listError } = await supabase
    .from('lists')
    .select('*, items(*)')
    .eq('id', listId)
    .single()

  if (listError || !originalList) {
    return { error: 'List not found' }
  }

  const original = originalList as any

  // Create new list
  const { data: newList, error: createError } = await (supabase
    .from('lists') as any)
    .insert({
      user_id: user.id,
      title: `${original.title} (Copy)`,
      description: original.description,
      visibility: 'private', // Always start as private
      tags: original.tags,
    })
    .select()
    .single()

  if (createError || !newList) {
    return { error: 'Failed to create list' }
  }

  // Clone items if any
  if (original.items && original.items.length > 0) {
    const itemsToInsert = original.items.map((item: any) => ({
      user_id: user.id,
      list_id: newList.id,
      type: item.type,
      title: item.title,
      url: item.url,
      source: item.source,
      source_id: item.source_id,
      status: 'saved', // Reset to saved
      metadata: item.metadata,
      tags: item.tags,
    }))

    await (supabase.from('items') as any).insert(itemsToInsert)
  }

  revalidatePath('/app/lists')
  return { data: newList }
}

