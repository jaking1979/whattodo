const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  release_date: string
  vote_average: number
}

export interface TMDBShow {
  id: number
  name: string
  overview: string
  poster_path: string | null
  first_air_date: string
  vote_average: number
}

export async function searchMovies(query: string): Promise<TMDBMovie[]> {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key not configured')
  }

  const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error('Failed to search movies')
  }

  const data = await response.json()
  return data.results || []
}

export async function searchShows(query: string): Promise<TMDBShow[]> {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key not configured')
  }

  const url = `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error('Failed to search shows')
  }

  const data = await response.json()
  return data.results || []
}

export async function getMovieById(id: number): Promise<TMDBMovie | null> {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key not configured')
  }

  const url = `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`
  const response = await fetch(url)
  
  if (!response.ok) {
    return null
  }

  return response.json()
}

export async function getShowById(id: number): Promise<TMDBShow | null> {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key not configured')
  }

  const url = `${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}`
  const response = await fetch(url)
  
  if (!response.ok) {
    return null
  }

  return response.json()
}

export function getPosterUrl(path: string | null, size: 'w200' | 'w500' | 'original' = 'w500'): string | null {
  if (!path) return null
  return `https://image.tmdb.org/t/p/${size}${path}`
}

export function normalizeMovie(movie: TMDBMovie) {
  return {
    title: movie.title,
    type: 'movie' as const,
    source: 'tmdb' as const,
    source_id: movie.id.toString(),
    url: `https://www.themoviedb.org/movie/${movie.id}`,
    metadata: {
      overview: movie.overview,
      poster: getPosterUrl(movie.poster_path),
      release_date: movie.release_date,
      rating: movie.vote_average,
    },
  }
}

export function normalizeShow(show: TMDBShow) {
  return {
    title: show.name,
    type: 'show' as const,
    source: 'tmdb' as const,
    source_id: show.id.toString(),
    url: `https://www.themoviedb.org/tv/${show.id}`,
    metadata: {
      overview: show.overview,
      poster: getPosterUrl(show.poster_path),
      first_air_date: show.first_air_date,
      rating: show.vote_average,
    },
  }
}

