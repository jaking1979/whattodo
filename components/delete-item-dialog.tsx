'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { deleteItem } from '@/app/actions/items'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface DeleteItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemId: string
  itemTitle: string
}

export function DeleteItemDialog({
  open,
  onOpenChange,
  itemId,
  itemTitle,
}: DeleteItemDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      const result = await deleteItem(itemId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Item deleted')
        onOpenChange(false)
        router.refresh()
      }
    } catch (error) {
      toast.error('Failed to delete item')
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
              <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Delete Item?</h2>
          <p className="text-muted-foreground mb-6">
            Are you sure you want to delete &quot;{itemTitle}&quot;? This action cannot be undone.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onOpenChange(false)}
              className="w-full h-12 px-6 font-bold bg-primary/20 dark:bg-primary/30 rounded-lg hover:bg-primary/30 dark:hover:bg-primary/40 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="w-full h-12 px-6 font-bold text-white bg-destructive rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

