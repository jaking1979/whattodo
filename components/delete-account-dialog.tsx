'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface DeleteAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteAccountDialog({ open, onOpenChange }: DeleteAccountDialogProps) {
  const router = useRouter()
  const [confirmText, setConfirmText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      
      // Delete all user data (handled by FK cascades in database)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Not authenticated')
        return
      }

      // Delete profile (will cascade delete lists and items)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id)

      if (profileError) {
        toast.error('Failed to delete account')
        console.error(profileError)
        return
      }

      // Sign out
      await supabase.auth.signOut()

      toast.success('Account deleted')
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Delete account error:', error)
      toast.error('Failed to delete account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm p-0 gap-0 bg-background rounded-xl">
        <div className="flex justify-center py-3">
          <div className="w-10 h-1.5 bg-primary/20 dark:bg-primary/30 rounded-full"></div>
        </div>

        <div className="text-center p-6">
          <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
            <svg className="text-destructive h-8 w-8" fill="currentColor" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Delete Account</h2>
          <p className="text-muted-foreground mb-6">
            This will permanently delete your account, all your lists, and all your items.
            <span className="block mt-2 text-destructive font-medium">
              This action cannot be undone.
            </span>
          </p>

          <div className="mb-6">
            <label className="text-sm text-muted-foreground block mb-2 text-left">
              Type <strong>DELETE</strong> to confirm:
            </label>
            <input
              className="w-full h-14 bg-primary/10 dark:bg-primary/20 border-none rounded-lg px-4 placeholder:text-foreground/50 focus:ring-2 focus:ring-destructive text-center text-lg font-mono"
              placeholder="DELETE"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                setConfirmText('')
                onOpenChange(false)
              }}
              className="w-full h-12 px-6 font-bold bg-primary/20 dark:bg-primary/30 rounded-lg hover:bg-primary/30 dark:hover:bg-primary/40 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading || confirmText !== 'DELETE'}
              className="w-full h-12 px-6 font-bold text-white bg-destructive rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

