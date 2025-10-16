const RAWG_API_KEY = process.env.RAWG_API_KEY
const RAWG_BASE_URL = 'https://api.rawg.io/api'

export interface RAWGGame {
  id: number
  name: string
  slug: string
  background_image?: string
  released?: string
  rating?: number
  genres?: Array<{ id: number; name: string }>
  platforms?: Array<{ platform: { id: number; name: string } }>
}

export async function searchGames(query: string): Promise<RAWGGame[]> {
  if (!RAWG_API_KEY) {
    throw new Error('RAWG API key not configured')
  }

  const url = `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(query)}&page_size=10`
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error('Failed to search games')
  }

  const data = await response.json()
  return data.results || []
}

export async function getGameById(id: number): Promise<RAWGGame | null> {
  if (!RAWG_API_KEY) {
    throw new Error('RAWG API key not configured')
  }

  const url = `${RAWG_BASE_URL}/games/${id}?key=${RAWG_API_KEY}`
  const response = await fetch(url)
  
  if (!response.ok) {
    return null
  }

  return response.json()
}

export function normalizeGame(game: RAWGGame) {
  return {
    title: game.name,
    type: 'game' as const,
    source: 'rawg' as const,
    source_id: game.id.toString(),
    url: `https://rawg.io/games/${game.slug}`,
    metadata: {
      cover: game.background_image,
      released: game.released,
      rating: game.rating,
      genres: game.genres?.map(g => g.name),
      platforms: game.platforms?.map(p => p.platform.name),
    },
  }
}

