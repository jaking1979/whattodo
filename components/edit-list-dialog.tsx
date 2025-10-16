'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { updateList } from '@/app/actions/lists'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface EditListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  listId: string
  currentTitle: string
  currentDescription?: string
  currentTags?: string[]
}

export function EditListDialog({
  open,
  onOpenChange,
  listId,
  currentTitle,
  currentDescription = '',
  currentTags = [],
}: EditListDialogProps) {
  const router = useRouter()
  const [title, setTitle] = useState(currentTitle)
  const [description, setDescription] = useState(currentDescription)
  const [tags, setTags] = useState(currentTags.join(', '))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setTitle(currentTitle)
      setDescription(currentDescription || '')
      setTags(currentTags.join(', '))
    }
  }, [open, currentTitle, currentDescription, currentTags])

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }

    setLoading(true)
    try {
      const result = await updateList({
        id: listId,
        title,
        description: description || null,
        tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : null,
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('List updated')
        onOpenChange(false)
        router.refresh()
      }
    } catch (error) {
      toast.error('Failed to update list')
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
          <h2 className="text-xl font-bold">Edit List</h2>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <input
              className="w-full h-14 bg-primary/10 dark:bg-primary/20 border-none rounded-lg px-4 placeholder:text-foreground/50 focus:ring-2 focus:ring-primary"
              placeholder="List title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <textarea
              className="w-full min-h-24 bg-primary/10 dark:bg-primary/20 border-none rounded-lg p-4 placeholder:text-foreground/50 focus:ring-2 focus:ring-primary resize-none"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <input
              className="w-full h-14 bg-primary/10 dark:bg-primary/20 border-none rounded-lg px-4 placeholder:text-foreground/50 focus:ring-2 focus:ring-primary"
              placeholder="Tags (comma-separated)"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
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
            disabled={loading || !title.trim()}
            className="flex-1 py-3 px-4 rounded-lg bg-primary text-white font-bold text-center disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

