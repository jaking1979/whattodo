'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const CATEGORIES = [
  'All',
  'Sober Activities',
  'Movies',
  'Books',
  'Games',
  'Podcasts',
  'Wellness',
  'Mixed',
]

export function ExchangeFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || 'All'

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (category === 'All') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    
    router.push(`/marketplace?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
            currentCategory === category || (currentCategory === '' && category === 'All')
              ? 'bg-primary text-white'
              : 'bg-card hover:bg-primary/10'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

