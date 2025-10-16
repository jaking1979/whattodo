'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface LikeButtonProps {
  listingId: string
  initialCount: number
  initialIsLiked?: boolean
}

export function LikeButton({ listingId, initialCount, initialIsLiked = false }: LikeButtonProps) {
  const router = useRouter()
  const [count, setCount] = useState(initialCount)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch current like status
    const fetchLikeStatus = async () => {
      try {
        const response = await fetch(`/api/marketplace/like?listing_id=${listingId}`)
        const data = await response.json()
        setCount(data.count || 0)
        setIsLiked(data.isLiked || false)
      } catch (error) {
        console.error('Failed to fetch like status')
      }
    }
    fetchLikeStatus()
  }, [listingId])

  const handleToggle = async () => {
    if (loading) return

    // Optimistic update
    const previousCount = count
    const previousIsLiked = isLiked
    
    setIsLiked(!isLiked)
    setCount(isLiked ? count - 1 : count + 1)
    setLoading(true)

    try {
      const response = await fetch('/api/marketplace/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listingId }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Roll back on error
        setIsLiked(previousIsLiked)
        setCount(previousCount)
        if (response.status === 401) {
          toast.error('Please sign in to like')
          setTimeout(() => {
            window.location.href = '/login'
          }, 1000)
        } else {
          toast.error('Failed to update like')
        }
      } else {
        // Refresh to sync with server
        router.refresh()
      }
    } catch (error) {
      // Roll back on error
      setIsLiked(previousIsLiked)
      setCount(previousCount)
      toast.error('Failed to update like')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl bg-card border border-border hover:bg-primary/10 transition-colors disabled:opacity-50"
    >
      <Heart 
        className={`h-5 w-5 ${isLiked ? 'fill-primary text-primary' : ''}`}
      />
      <span className="font-semibold">{count}</span>
    </button>
  )
}

