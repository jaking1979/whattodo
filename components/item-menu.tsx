'use client'

import { useState } from 'react'
import { MoreVertical, MoveRight, Edit, Trash2, Share2, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoveItemDialog } from './move-item-dialog'
import { EditNotesDialog } from './edit-notes-dialog'
import { DeleteItemDialog } from './delete-item-dialog'
import { updateItemStatus } from '@/app/actions/items'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ItemMenuProps {
  itemId: string
  itemTitle: string
  currentStatus: 'saved' | 'started' | 'done'
  currentNotes?: string
  listId: string
}

export function ItemMenu({ itemId, itemTitle, currentStatus, currentNotes, listId }: ItemMenuProps) {
  const router = useRouter()
  const [showMoveDialog, setShowMoveDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleStatusChange = async (newStatus: 'saved' | 'started' | 'done') => {
    const result = await updateItemStatus(itemId, newStatus)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`Marked as ${newStatus}`)
      router.refresh()
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: itemTitle,
          text: `Check out: ${itemTitle}`,
          url,
        })
      } catch (error) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard')
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 text-muted-foreground hover:bg-primary/10 rounded-full">
            <MoreVertical className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setShowMoveDialog(true)}>
            <MoveRight className="h-4 w-4 mr-2" />
            Move to List
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Notes
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {currentStatus !== 'saved' && (
            <DropdownMenuItem onClick={() => handleStatusChange('saved')}>
              <Check className="h-4 w-4 mr-2" />
              Mark as Saved
            </DropdownMenuItem>
          )}
          {currentStatus !== 'started' && (
            <DropdownMenuItem onClick={() => handleStatusChange('started')}>
              <Check className="h-4 w-4 mr-2" />
              Mark as Started
            </DropdownMenuItem>
          )}
          {currentStatus !== 'done' && (
            <DropdownMenuItem onClick={() => handleStatusChange('done')}>
              <Check className="h-4 w-4 mr-2" />
              Mark as Done
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <MoveItemDialog
        open={showMoveDialog}
        onOpenChange={setShowMoveDialog}
        itemId={itemId}
        itemTitle={itemTitle}
        currentListId={listId}
      />

      <EditNotesDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        itemId={itemId}
        itemTitle={itemTitle}
        currentNotes={currentNotes}
      />

      <DeleteItemDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        itemId={itemId}
        itemTitle={itemTitle}
      />
    </>
  )
}

