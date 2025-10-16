'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { getLists } from '@/app/actions/lists'
import { moveItemToList } from '@/app/actions/items'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'

interface MoveItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemId: string
  itemTitle: string
  currentListId: string
}

export function MoveItemDialog({
  open,
  onOpenChange,
  itemId,
  itemTitle,
  currentListId,
}: MoveItemDialogProps) {
  const router = useRouter()
  const [lists, setLists] = useState<any[]>([])
  const [selectedListId, setSelectedListId] = useState(currentListId)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchLists = async () => {
      const result = await getLists()
      if (result.data) {
        setLists(result.data as any[])
      }
    }
    if (open) {
      fetchLists()
    }
  }, [open])

  const handleMove = async () => {
    if (selectedListId === currentListId) {
      onOpenChange(false)
      return
    }

    setLoading(true)
    try {
      const result = await moveItemToList(itemId, selectedListId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Item moved successfully')
        onOpenChange(false)
        router.refresh()
      }
    } catch (error) {
      toast.error('Failed to move item')
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
          <h2 className="text-xl font-bold">Move Item</h2>
          <p className="text-sm text-muted-foreground mt-1">{itemTitle}</p>
        </div>

        <div className="px-6 py-4 space-y-2 max-h-96 overflow-y-auto">
          {lists.map((list) => (
            <button
              key={list.id}
              onClick={() => setSelectedListId(list.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                selectedListId === list.id
                  ? 'bg-primary/20 dark:bg-primary/30'
                  : 'hover:bg-primary/10'
              }`}
            >
              <div className="flex-1">
                <p className="font-medium">{list.title}</p>
                <p className="text-xs text-muted-foreground">
                  {list.items?.[0]?.count || 0} items
                </p>
              </div>
              {selectedListId === list.id && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </button>
          ))}
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 py-3 px-4 rounded-lg bg-primary/20 dark:bg-primary/30 font-bold text-center"
          >
            Cancel
          </button>
          <button
            onClick={handleMove}
            disabled={loading || selectedListId === currentListId}
            className="flex-1 py-3 px-4 rounded-lg bg-primary text-white font-bold text-center disabled:opacity-50"
          >
            {loading ? 'Moving...' : 'Move'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

