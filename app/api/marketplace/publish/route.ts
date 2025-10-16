import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createMarketplaceListingSchema } from '@/lib/validations'
import { generateUniqueSlug } from '@/lib/utils/slug'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validated = createMarketplaceListingSchema.parse(body)

    // Verify the list exists and belongs to the user
    const { data: list } = await supabase
      .from('lists')
      .select('*')
      .eq('id', validated.list_id)
      .eq('user_id', user.id)
      .single()

    if (!list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 })
    }

    // List must be public to publish to marketplace
    if ((list as any).visibility !== 'public') {
      return NextResponse.json(
        { error: 'List must be public to publish to marketplace' },
        { status: 400 }
      )
    }

    // Check if already published
    const { data: existing } = await supabase
      .from('marketplace_listings')
      .select('*')
      .eq('list_id', validated.list_id)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'List is already published to marketplace' },
        { status: 400 }
      )
    }

    // Create marketplace listing
    const slug = generateUniqueSlug(validated.title)

    const { data, error } = await (supabase
      .from('marketplace_listings') as any)
      .insert({
        list_id: validated.list_id,
        owner_user_id: user.id,
        slug,
        title: validated.title,
        summary: validated.summary,
        category: validated.category,
        tags: validated.tags,
        is_public: true,
        is_indexable: validated.is_indexable,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Publish error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to publish to marketplace' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const listingId = searchParams.get('id')

  if (!listingId) {
    return NextResponse.json({ error: 'Listing ID required' }, { status: 400 })
  }

  try {
    const { error } = await supabase
      .from('marketplace_listings')
      .delete()
      .eq('id', listingId)
      .eq('owner_user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Unpublish error:', error)
    return NextResponse.json(
      { error: 'Failed to unpublish from marketplace' },
      { status: 500 }
    )
  }
}

