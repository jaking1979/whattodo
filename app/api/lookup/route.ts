import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { searchMovies, searchShows, normalizeMovie, normalizeShow } from '@/lib/api/tmdb'
import { searchBooks, normalizeBook } from '@/lib/api/openlibrary'
import { searchPodcasts, normalizePodcast } from '@/lib/api/itunes'
import { searchGames, normalizeGame } from '@/lib/api/rawg'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  const type = searchParams.get('type') as 'movie' | 'show' | 'book' | 'podcast' | 'game' | null

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    // Check cache first
    const cacheKey = `lookup:${type || 'all'}:${query.toLowerCase()}`
    const supabase = await createClient()
    
    const { data: cached } = await supabase
      .from('catalog_cache')
      .select('*')
      .eq('key', cacheKey)
      .gt('ttl_expires_at', new Date().toISOString())
      .single()

    if (cached) {
      return NextResponse.json((cached as any).payload)
    }

    // If no cache, search external APIs
    let results: any[] = []

    if (!type || type === 'movie') {
      try {
        const movies = await searchMovies(query)
        results.push(...movies.slice(0, 5).map(normalizeMovie))
      } catch (error) {
        console.error('TMDB movie search error:', error)
      }
    }

    if (!type || type === 'show') {
      try {
        const shows = await searchShows(query)
        results.push(...shows.slice(0, 5).map(normalizeShow))
      } catch (error) {
        console.error('TMDB show search error:', error)
      }
    }

    if (!type || type === 'book') {
      try {
        const books = await searchBooks(query)
        results.push(...books.slice(0, 5).map(normalizeBook))
      } catch (error) {
        console.error('Open Library search error:', error)
      }
    }

    if (!type || type === 'podcast') {
      try {
        const podcasts = await searchPodcasts(query)
        results.push(...podcasts.slice(0, 5).map(normalizePodcast))
      } catch (error) {
        console.error('iTunes search error:', error)
      }
    }

    if (!type || type === 'game') {
      try {
        const games = await searchGames(query)
        results.push(...games.slice(0, 5).map(normalizeGame))
      } catch (error) {
        console.error('RAWG search error:', error)
      }
    }

    // Cache results for 30 days
    const ttlDate = new Date()
    ttlDate.setDate(ttlDate.getDate() + 30)

    await (supabase.from('catalog_cache') as any).upsert({
      key: cacheKey,
      payload: { results },
      ttl_expires_at: ttlDate.toISOString(),
    })

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Lookup error:', error)
    return NextResponse.json(
      { error: 'Failed to lookup items' },
      { status: 500 }
    )
  }
}

// URL parsing helper
export async function POST(request: Request) {
  const body = await request.json()
  const { url } = body

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  try {
    // Parse different URL formats
    let type: string | null = null
    let id: string | null = null
    let query: string | null = null

    // TMDb URLs
    if (url.includes('themoviedb.org/movie/')) {
      type = 'movie'
      const match = url.match(/movie\/(\d+)/)
      id = match?.[1] || null
    } else if (url.includes('themoviedb.org/tv/')) {
      type = 'show'
      const match = url.match(/tv\/(\d+)/)
      id = match?.[1] || null
    }
    // RAWG URLs
    else if (url.includes('rawg.io/games/')) {
      type = 'game'
      const match = url.match(/games\/([\w-]+)/)
      query = match?.[1]?.replace(/-/g, ' ') || null
    }
    // Open Library URLs
    else if (url.includes('openlibrary.org/works/')) {
      type = 'book'
      const match = url.match(/works\/([\w-]+)/)
      query = match?.[1]?.replace(/-/g, ' ') || null
    }
    // Generic fallback - treat as search query
    else {
      query = url
    }

    if (query) {
      // Redirect to GET with query
      const searchUrl = `/api/lookup?query=${encodeURIComponent(query)}${type ? `&type=${type}` : ''}`
      const lookupUrl = new URL(searchUrl, request.url)
      return GET(new Request(lookupUrl))
    }

    return NextResponse.json({ error: 'Could not parse URL' }, { status: 400 })
  } catch (error) {
    console.error('URL parse error:', error)
    return NextResponse.json(
      { error: 'Failed to parse URL' },
      { status: 500 }
    )
  }
}

