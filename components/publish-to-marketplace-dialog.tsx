'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface PublishToMarketplaceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  listId: string
  listTitle: string
}

export function PublishToMarketplaceDialog({ 
  open, 
  onOpenChange, 
  listId, 
  listTitle 
}: PublishToMarketplaceDialogProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: listTitle,
    summary: '',
    category: '',
    tags: '',
    isIndexable: true,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/marketplace/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          list_id: listId,
          title: formData.title,
          summary: formData.summary || null,
          category: formData.category || null,
          tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : null,
          is_indexable: formData.isIndexable,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Published to marketplace!')
        onOpenChange(false)
        router.push(`/m/${result.data.slug}`)
      } else {
        toast.error(result.error || 'Failed to publish')
      }
    } catch (error) {
      toast.error('Failed to publish')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 bg-background rounded-t-xl sm:rounded-xl">
        <div className="py-2 flex justify-center">
          <div className="w-10 h-1.5 rounded-full bg-primary/20 dark:bg-primary/30"></div>
        </div>
        
        <div className="px-6 pt-4 pb-2">
          <h2 className="text-xl font-bold">Publish List</h2>
        </div>

        <div className="px-6 py-4 space-y-4 overflow-y-auto max-h-[60vh]">
          <div>
            <input
              className="w-full h-14 bg-primary/10 dark:bg-primary/20 text-foreground placeholder:text-foreground/50 rounded-lg px-4 text-base border-none focus:ring-2 focus:ring-primary"
              placeholder="Title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <textarea
              className="w-full min-h-[96px] bg-primary/10 dark:bg-primary/20 text-foreground placeholder:text-foreground/50 rounded-lg p-4 text-base resize-none border-none focus:ring-2 focus:ring-primary"
              placeholder="Summary"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            />
          </div>

          <div>
            <select
              className="w-full h-14 bg-primary/10 dark:bg-primary/20 text-foreground rounded-lg px-4 text-base appearance-none border-none focus:ring-2 focus:ring-primary"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{
                backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
              }}
            >
              <option value="">Category</option>
              <option value="Movies">Movies</option>
              <option value="Books">Books</option>
              <option value="Games">Games</option>
              <option value="Podcasts">Podcasts</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>

          <div>
            <input
              className="w-full h-14 bg-primary/10 dark:bg-primary/20 text-foreground placeholder:text-foreground/50 rounded-lg px-4 text-base border-none focus:ring-2 focus:ring-primary"
              placeholder="Tags (comma-separated)"
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-base">Indexable for Marketplace</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.isIndexable}
                onChange={(e) => setFormData({ ...formData, isIndexable: e.target.checked })}
              />
              <div className="w-11 h-6 bg-primary/20 peer-focus:outline-none rounded-full peer dark:bg-primary/30 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        <div className="px-6 pt-4 pb-6">
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.title.trim()}
            className="w-full h-12 bg-primary text-white rounded-lg text-base font-bold disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

