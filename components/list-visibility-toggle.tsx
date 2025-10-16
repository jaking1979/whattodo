'use client'

import { useState } from 'react'
import { updateList } from '@/app/actions/lists'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ListVisibilityToggleProps {
  listId: string
  currentVisibility: 'private' | 'unlisted' | 'public'
}

export function ListVisibilityToggle({ listId, currentVisibility }: ListVisibilityToggleProps) {
  const router = useRouter()
  const [visibility, setVisibility] = useState(currentVisibility)
  const [loading, setLoading] = useState(false)

  const handleChange = async (newVisibility: 'private' | 'unlisted' | 'public') => {
    if (newVisibility === visibility) return

    setLoading(true)
    const previousVisibility = visibility
    setVisibility(newVisibility) // Optimistic update

    try {
      const result = await updateList({
        id: listId,
        visibility: newVisibility,
      })

      if (result.error) {
        setVisibility(previousVisibility) // Roll back
        toast.error(result.error)
      } else {
        toast.success(`List is now ${newVisibility}`)
        router.refresh()
      }
    } catch (error) {
      setVisibility(previousVisibility) // Roll back
      toast.error('Failed to update visibility')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex border-b border-border/50">
      <button
        onClick={() => handleChange('private')}
        disabled={loading}
        className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-colors ${
          visibility === 'private'
            ? 'border-primary text-primary'
            : 'border-transparent text-muted-foreground hover:text-primary'
        }`}
      >
        Private
      </button>
      <button
        onClick={() => handleChange('unlisted')}
        disabled={loading}
        className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-colors ${
          visibility === 'unlisted'
            ? 'border-primary text-primary'
            : 'border-transparent text-muted-foreground hover:text-primary'
        }`}
      >
        Unlisted
      </button>
      <button
        onClick={() => handleChange('public')}
        disabled={loading}
        className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-colors ${
          visibility === 'public'
            ? 'border-primary text-primary'
            : 'border-transparent text-muted-foreground hover:text-primary'
        }`}
      >
        Public
      </button>
    </div>
  )
}

