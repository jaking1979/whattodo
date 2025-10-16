'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { updateItem } from '@/app/actions/items'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface EditNotesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemId: string
  itemTitle: string
  currentNotes?: string
}

export function EditNotesDialog({
  open,
  onOpenChange,
  itemId,
  itemTitle,
  currentNotes = '',
}: EditNotesDialogProps) {
  const router = useRouter()
  const [notes, setNotes] = useState(currentNotes)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      const result = await updateItem({
        id: itemId,
        notes: notes || null,
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Notes updated')
        onOpenChange(false)
        router.refresh()
      }
    } catch (error) {
      toast.error('Failed to update notes')
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
          <h2 className="text-xl font-bold">Edit Notes</h2>
          <p className="text-sm text-muted-foreground mt-1">{itemTitle}</p>
        </div>

        <div className="px-6 py-4">
          <textarea
            className="w-full min-h-32 bg-primary/10 dark:bg-primary/20 border-none rounded-lg p-4 placeholder:text-foreground/50 focus:ring-2 focus:ring-primary resize-none"
            placeholder="Add notes about this item..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            autoFocus
          />
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
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

