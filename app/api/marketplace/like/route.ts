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

    // Check if already liked
    const { data: existing } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', user.id)
      .eq('listing_id', listing_id)
      .single()

    if (existing) {
      // Unlike
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('id', (existing as any).id)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ liked: false })
    } else {
      // Like
      const { error } = await (supabase
        .from('likes') as any)
        .insert({ user_id: user.id, listing_id })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ liked: true })
    }
  } catch (error: any) {
    console.error('Like error:', error)
    return NextResponse.json(
      { error: 'Failed to toggle like' },
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
    // Get like count
    const { count } = await supabase
      .from('likes')
      .select('id', { count: 'exact', head: true })
      .eq('listing_id', listing_id)

    // Check if current user has liked
    let isLiked = false
    if (user) {
      const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('listing_id', listing_id)
        .single()

      isLiked = !!data
    }

    return NextResponse.json({
      count: count || 0,
      isLiked,
    })
  } catch (error) {
    console.error('Get like error:', error)
    return NextResponse.json(
      { error: 'Failed to get likes' },
      { status: 500 }
    )
  }
}

