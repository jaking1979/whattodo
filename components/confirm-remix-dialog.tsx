'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { cloneList } from '@/app/actions/lists'

interface ConfirmRemixDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  listId: string
  listTitle: string
}

export function ConfirmRemixDialog({
  open,
  onOpenChange,
  listId,
  listTitle,
}: ConfirmRemixDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const result = await cloneList(listId)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('List remixed successfully!')
        onOpenChange(false)
        router.push(`/app/l/${(result.data as any).id}`)
      }
    } catch (error) {
      toast.error('Failed to remix list')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm p-0 gap-0 bg-background rounded-t-xl sm:rounded-xl">
        <div className="flex justify-center py-3">
          <div className="w-10 h-1.5 bg-primary/20 dark:bg-primary/30 rounded-full"></div>
        </div>

        <div className="text-center p-6">
          <h2 className="text-2xl font-bold mb-2">Remix this list?</h2>
          <p className="text-muted-foreground mb-8">
            This will copy &quot;{listTitle}&quot; to your collection. You can then edit it as you wish.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onOpenChange(false)}
              className="w-full h-12 px-6 font-bold bg-primary/20 dark:bg-primary/30 rounded-lg hover:bg-primary/30 dark:hover:bg-primary/40 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="w-full h-12 px-6 font-bold text-white bg-primary rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Remixing...' : 'Confirm Remix'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

