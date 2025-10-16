'use client'

import { Share2 } from 'lucide-react'
import { toast } from 'sonner'

interface ShareListButtonProps {
  listSlug?: string
  listTitle: string
  handle: string
  visibility: 'private' | 'unlisted' | 'public'
}

export function ShareListButton({ listSlug, listTitle, handle, visibility }: ShareListButtonProps) {
  const handleShare = async () => {
    if (visibility === 'private') {
      toast.error('Make list public or unlisted to share')
      return
    }

    if (!listSlug) {
      toast.error('List URL not available yet')
      return
    }

    const url = `${window.location.origin}/u/${handle}/l/${listSlug}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: listTitle,
          text: `Check out my list: ${listTitle}`,
          url,
        })
        toast.success('Shared!')
      } catch (error) {
        // User cancelled, ignore
      }
    } else {
      navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard')
    }
  }

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-full hover:bg-primary/10"
    >
      <Share2 className="h-6 w-6" />
    </button>
  )
}

