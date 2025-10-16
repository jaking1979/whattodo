'use client'

import { useState } from 'react'
import { Edit } from 'lucide-react'
import { EditListDialog } from './edit-list-dialog'

interface EditListButtonProps {
  listId: string
  currentTitle: string
  currentDescription?: string
  currentTags?: string[]
}

export function EditListButton({
  listId,
  currentTitle,
  currentDescription,
  currentTags,
}: EditListButtonProps) {
  const [showDialog, setShowDialog] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="p-2 rounded-full hover:bg-primary/10"
      >
        <Edit className="h-6 w-6" />
      </button>

      <EditListDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        listId={listId}
        currentTitle={currentTitle}
        currentDescription={currentDescription}
        currentTags={currentTags}
      />
    </>
  )
}

