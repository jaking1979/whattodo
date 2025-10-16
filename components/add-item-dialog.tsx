'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Package, List } from 'lucide-react'
import { createItem } from '@/app/actions/items'
import { toast } from 'sonner'

interface AddItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  listId?: string
  defaultList?: 'inbox' | 'choose'
}

export function AddItemDialog({ open, onOpenChange, listId, defaultList = 'inbox' }: AddItemDialogProps) {
  const [query, setQuery] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedList, setSelectedList] = useState(listId || 'inbox')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      // For now, create a simple item without metadata lookup
      const result = await createItem({
        list_id: selectedList,
        type: 'link',
        title: query,
        url: query.startsWith('http') ? query : undefined,
        status: 'saved',
        notes: notes || undefined,
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Item added successfully')
        setQuery('')
        setNotes('')
        onOpenChange(false)
      }
    } catch (error) {
      toast.error('Failed to add item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 bg-background rounded-t-xl sm:rounded-xl">
        <div className="flex justify-center py-3">
          <div className="w-10 h-1.5 bg-primary/20 dark:bg-primary/30 rounded-full"></div>
        </div>
        
        <div className="px-4 pb-4">
          <h2 className="text-xl font-bold mb-4">Add an item</h2>
          
          <div className="mb-5">
            <input
              className="w-full bg-primary/10 dark:bg-primary/20 border-none rounded-lg h-14 px-4 placeholder:text-foreground/50 focus:ring-2 focus:ring-primary"
              placeholder="Paste a URL or search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="space-y-2 mb-5">
            <button
              onClick={() => setSelectedList('inbox')}
              className={`w-full flex items-center gap-4 p-3 rounded-lg text-left ${
                selectedList === 'inbox'
                  ? 'bg-primary/20 dark:bg-primary/30'
                  : 'hover:bg-primary/10'
              }`}
            >
              <div className="w-10 h-10 flex items-center justify-center bg-primary/20 dark:bg-primary/30 rounded-lg">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium flex-1">Inbox</span>
              {selectedList === 'inbox' && (
                <svg className="text-primary" fill="currentColor" height="20" viewBox="0 0 256 256" width="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                </svg>
              )}
            </button>

            <button className="w-full flex items-center gap-4 p-3 rounded-lg text-left hover:bg-primary/10">
              <div className="w-10 h-10 flex items-center justify-center bg-primary/20 dark:bg-primary/30 rounded-lg">
                <List className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium">Move to List...</span>
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Notes</h3>
            <textarea
              className="w-full bg-primary/10 dark:bg-primary/20 border-none rounded-lg p-4 min-h-24 placeholder:text-foreground/50 focus:ring-2 focus:ring-primary resize-none"
              placeholder="Add notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 py-3 px-4 rounded-lg bg-primary/20 dark:bg-primary/30 font-bold text-center"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !query.trim()}
              className="flex-1 py-3 px-4 rounded-lg bg-primary text-white font-bold text-center disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add to Inbox'}
            </button>
          </div>
        </div>
        
        <div className="h-5"></div>
      </DialogContent>
    </Dialog>
  )
}

