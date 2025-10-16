const ITUNES_BASE_URL = 'https://itunes.apple.com/search'

export interface ITunesPodcast {
  collectionId: number
  collectionName: string
  artistName: string
  artworkUrl600?: string
  artworkUrl100?: string
  feedUrl?: string
  genres?: string[]
  releaseDate?: string
}

export async function searchPodcasts(query: string): Promise<ITunesPodcast[]> {
  const url = `${ITUNES_BASE_URL}?term=${encodeURIComponent(query)}&media=podcast&entity=podcast&limit=10`
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error('Failed to search podcasts')
  }

  const data = await response.json()
  return data.results || []
}

export async function getPodcastById(id: number): Promise<ITunesPodcast | null> {
  const url = `${ITUNES_BASE_URL}?id=${id}&media=podcast&entity=podcast`
  const response = await fetch(url)
  
  if (!response.ok) {
    return null
  }

  const data = await response.json()
  return data.results?.[0] || null
}

export function normalizePodcast(podcast: ITunesPodcast) {
  return {
    title: podcast.collectionName,
    type: 'podcast' as const,
    source: 'itunes' as const,
    source_id: podcast.collectionId.toString(),
    url: podcast.feedUrl || `https://podcasts.apple.com/podcast/id${podcast.collectionId}`,
    metadata: {
      artist: podcast.artistName,
      artwork: podcast.artworkUrl600 || podcast.artworkUrl100,
      genres: podcast.genres,
      release_date: podcast.releaseDate,
    },
  }
}

