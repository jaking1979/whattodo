'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { createList } from '@/app/actions/lists'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function NewListButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title')
      return
    }

    setLoading(true)
    try {
      const result = await createList({
        title,
        description: description || undefined,
        visibility: 'private',
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('List created!')
        setTitle('')
        setDescription('')
        setOpen(false)
        router.push(`/app/l/${(result.data as any).id}`)
      }
    } catch (error) {
      toast.error('Failed to create list')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-base font-bold text-white shadow-lg shadow-primary/30 transition-transform active:scale-95"
      >
        <Plus className="h-5 w-5" />
        <span>New List</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md p-0 gap-0 bg-background rounded-xl">
          <div className="flex justify-center py-3">
            <div className="w-10 h-1.5 bg-primary/20 dark:bg-primary/30 rounded-full"></div>
          </div>

          <div className="px-6 pt-4 pb-2">
            <h2 className="text-xl font-bold">Create New List</h2>
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
          </div>

          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={() => setOpen(false)}
              className="flex-1 py-3 px-4 rounded-lg bg-primary/20 dark:bg-primary/30 font-bold text-center"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={loading || !title.trim()}
              className="flex-1 py-3 px-4 rounded-lg bg-primary text-white font-bold text-center disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

