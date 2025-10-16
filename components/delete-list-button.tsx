'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { DeleteListDialog } from './delete-list-dialog'

interface DeleteListButtonProps {
  listId: string
  listTitle: string
  itemCount: number
}

export function DeleteListButton({
  listId,
  listTitle,
  itemCount,
}: DeleteListButtonProps) {
  const [showDialog, setShowDialog] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="p-2 rounded-full hover:bg-destructive/10 text-destructive"
      >
        <Trash2 className="h-6 w-6" />
      </button>

      <DeleteListDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        listId={listId}
        listTitle={listTitle}
        itemCount={itemCount}
      />
    </>
  )
}

