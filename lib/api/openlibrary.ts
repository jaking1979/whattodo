const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org'

export interface OpenLibraryBook {
  key: string
  title: string
  author_name?: string[]
  first_publish_year?: number
  isbn?: string[]
  cover_i?: number
}

export async function searchBooks(query: string): Promise<OpenLibraryBook[]> {
  const url = `${OPEN_LIBRARY_BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=10`
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error('Failed to search books')
  }

  const data = await response.json()
  return data.docs || []
}

export async function getBookByKey(key: string): Promise<any> {
  const url = `${OPEN_LIBRARY_BASE_URL}${key}.json`
  const response = await fetch(url)
  
  if (!response.ok) {
    return null
  }

  return response.json()
}

export function getCoverUrl(coverId: number | undefined, size: 'S' | 'M' | 'L' = 'M'): string | null {
  if (!coverId) return null
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
}

export function normalizeBook(book: OpenLibraryBook) {
  const bookId = book.key.replace('/works/', '')
  
  return {
    title: book.title,
    type: 'book' as const,
    source: 'openlibrary' as const,
    source_id: bookId,
    url: `${OPEN_LIBRARY_BASE_URL}${book.key}`,
    metadata: {
      authors: book.author_name || [],
      first_publish_year: book.first_publish_year,
      cover: getCoverUrl(book.cover_i),
      isbn: book.isbn?.[0],
    },
  }
}

