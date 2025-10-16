'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

export function ExchangeSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('query') || '')

  useEffect(() => {
    setQuery(searchParams.get('query') || '')
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    
    if (query.trim()) {
      params.set('query', query.trim())
    } else {
      params.delete('query')
    }
    
    router.push(`/marketplace?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Exchange..."
          className="w-full h-12 bg-primary/10 dark:bg-primary/20 border-none rounded-lg pl-12 pr-4 placeholder:text-foreground/50 focus:ring-2 focus:ring-primary"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      </div>
    </form>
  )
}

