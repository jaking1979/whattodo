import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { listing_id } = await request.json()

    if (!listing_id) {
      return NextResponse.json({ error: 'Listing ID required' }, { status: 400 })
    }

    // Check if already saved
    const { data: existing } = await supabase
      .from('saves')
      .select('*')
      .eq('user_id', user.id)
      .eq('listing_id', listing_id)
      .single()

    if (existing) {
      // Unsave
      const { error } = await supabase
        .from('saves')
        .delete()
        .eq('id', (existing as any).id)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ saved: false })
    } else {
      // Save
      const { error } = await (supabase
        .from('saves') as any)
        .insert({ user_id: user.id, listing_id })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ saved: true })
    }
  } catch (error: any) {
    console.error('Save error:', error)
    return NextResponse.json(
      { error: 'Failed to toggle save' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { searchParams } = new URL(request.url)
  const listing_id = searchParams.get('listing_id')

  if (!listing_id) {
    return NextResponse.json({ error: 'Listing ID required' }, { status: 400 })
  }

  try {
    // Get save count
    const { count } = await supabase
      .from('saves')
      .select('id', { count: 'exact', head: true })
      .eq('listing_id', listing_id)

    // Check if current user has saved
    let isSaved = false
    if (user) {
      const { data } = await supabase
        .from('saves')
        .select('id')
        .eq('user_id', user.id)
        .eq('listing_id', listing_id)
        .single()

      isSaved = !!data
    }

    return NextResponse.json({
      count: count || 0,
      isSaved,
    })
  } catch (error) {
    console.error('Get save error:', error)
    return NextResponse.json(
      { error: 'Failed to get saves' },
      { status: 500 }
    )
  }
}

