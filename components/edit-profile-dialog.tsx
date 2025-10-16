'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { updateProfile } from '@/app/actions/profile'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentHandle: string
  currentDisplayName?: string
  currentAvatarUrl?: string
}

export function EditProfileDialog({
  open,
  onOpenChange,
  currentHandle,
  currentDisplayName = '',
  currentAvatarUrl = '',
}: EditProfileDialogProps) {
  const router = useRouter()
  const [displayName, setDisplayName] = useState(currentDisplayName)
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setDisplayName(currentDisplayName || '')
      setAvatarUrl(currentAvatarUrl || '')
    }
  }, [open, currentDisplayName, currentAvatarUrl])

  const handleSave = async () => {
    setLoading(true)
    try {
      const result = await updateProfile({
        display_name: displayName || undefined,
        avatar_url: avatarUrl || undefined,
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Profile updated')
        onOpenChange(false)
        router.refresh()
      }
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 bg-background rounded-xl">
        <div className="flex justify-center py-3">
          <div className="w-10 h-1.5 bg-primary/20 dark:bg-primary/30 rounded-full"></div>
        </div>

        <div className="px-6 pt-4 pb-2">
          <h2 className="text-xl font-bold">Edit Profile</h2>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground block mb-2">Handle (read-only)</label>
            <input
              className="w-full h-14 bg-muted border-none rounded-lg px-4 text-muted-foreground cursor-not-allowed"
              type="text"
              value={`@${currentHandle}`}
              disabled
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground block mb-2">Display Name</label>
            <input
              className="w-full h-14 bg-primary/10 dark:bg-primary/20 border-none rounded-lg px-4 placeholder:text-foreground/50 focus:ring-2 focus:ring-primary"
              placeholder="Your name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground block mb-2">Avatar URL</label>
            <input
              className="w-full h-14 bg-primary/10 dark:bg-primary/20 border-none rounded-lg px-4 placeholder:text-foreground/50 focus:ring-2 focus:ring-primary"
              placeholder="https://example.com/avatar.jpg"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 py-3 px-4 rounded-lg bg-primary/20 dark:bg-primary/30 font-bold text-center"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-lg bg-primary text-white font-bold text-center disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

