import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Fetch all user data
    const [profile, lists, items, groups, marketplaceListings, likes, saves] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('lists').select('*').eq('user_id', user.id),
      supabase.from('items').select('*').eq('user_id', user.id),
      supabase.from('groups').select('*').eq('user_id', user.id),
      supabase.from('marketplace_listings').select('*').eq('owner_user_id', user.id),
      supabase.from('likes').select('*').eq('user_id', user.id),
      supabase.from('saves').select('*').eq('user_id', user.id),
    ])

    const exportData = {
      version: '1.0',
      exported_at: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
      },
      profile: profile.data,
      groups: groups.data || [],
      lists: lists.data || [],
      items: items.data || [],
      marketplace_listings: marketplaceListings.data || [],
      likes: likes.data || [],
      saves: saves.data || [],
    }

    // Return as downloadable JSON file
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="whattodo-export-${new Date().toISOString().split('T')[0]}.json"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}

