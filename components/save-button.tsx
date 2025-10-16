'use client'

import { useState, useEffect } from 'react'
import { Bookmark } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface SaveButtonProps {
  listingId: string
  initialCount: number
  initialIsSaved?: boolean
}

export function SaveButton({ listingId, initialCount, initialIsSaved = false }: SaveButtonProps) {
  const router = useRouter()
  const [count, setCount] = useState(initialCount)
  const [isSaved, setIsSaved] = useState(initialIsSaved)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch current save status
    const fetchSaveStatus = async () => {
      try {
        const response = await fetch(`/api/marketplace/save?listing_id=${listingId}`)
        const data = await response.json()
        setCount(data.count || 0)
        setIsSaved(data.isSaved || false)
      } catch (error) {
        console.error('Failed to fetch save status')
      }
    }
    fetchSaveStatus()
  }, [listingId])

  const handleToggle = async () => {
    if (loading) return

    // Optimistic update
    const previousCount = count
    const previousIsSaved = isSaved
    
    setIsSaved(!isSaved)
    setCount(isSaved ? count - 1 : count + 1)
    setLoading(true)

    try {
      const response = await fetch('/api/marketplace/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listingId }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Roll back on error
        setIsSaved(previousIsSaved)
        setCount(previousCount)
        if (response.status === 401) {
          toast.error('Please sign in to save')
          setTimeout(() => {
            window.location.href = '/login'
          }, 1000)
        } else {
          toast.error('Failed to update save')
        }
      } else {
        // Refresh to sync with server
        router.refresh()
      }
    } catch (error) {
      // Roll back on error
      setIsSaved(previousIsSaved)
      setCount(previousCount)
      toast.error('Failed to update save')
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
      <Bookmark 
        className={`h-5 w-5 ${isSaved ? 'fill-primary text-primary' : ''}`}
      />
      <span className="font-semibold">{count}</span>
    </button>
  )
}

