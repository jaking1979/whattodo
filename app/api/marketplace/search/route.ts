import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  const category = searchParams.get('category')
  const tag = searchParams.get('tag')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  const supabase = await createClient()

  try {
    let queryBuilder = supabase
      .from('marketplace_listings')
      .select(`
        *,
        lists!inner(title, cover_url, items(count)),
        profiles!inner(handle, display_name, avatar_url)
      `)
      .eq('is_public', true)
      .eq('is_indexable', true)

    // Text search on title and summary
    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
    }

    // Filter by category
    if (category && category !== 'all') {
      queryBuilder = queryBuilder.eq('category', category)
    }

    // Filter by tag
    if (tag) {
      queryBuilder = queryBuilder.contains('tags', [tag])
    }

    // Pagination and ordering
    const { data, error, count } = await queryBuilder
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get like and save counts for each listing
    const listingsWithCounts = await Promise.all(
      (data || []).map(async (listing: any) => {
        const [likesCount, savesCount] = await Promise.all([
          supabase.from('likes').select('id', { count: 'exact', head: true }).eq('listing_id', listing.id),
          supabase.from('saves').select('id', { count: 'exact', head: true }).eq('listing_id', listing.id),
        ])

        return {
          ...listing,
          likes_count: likesCount.count || 0,
          saves_count: savesCount.count || 0,
        }
      })
    )

    return NextResponse.json({
      data: listingsWithCounts,
      count: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to search marketplace' },
      { status: 500 }
    )
  }
}

