'use client'

import { useState } from 'react'
import { PublishToMarketplaceDialog } from './publish-to-marketplace-dialog'
import { toast } from 'sonner'

interface PublishButtonProps {
  listId: string
  listTitle: string
  isPublic: boolean
}

export function PublishButton({ listId, listTitle, isPublic }: PublishButtonProps) {
  const [showDialog, setShowDialog] = useState(false)

  const handleClick = () => {
    if (!isPublic) {
      toast.error('List must be public to publish to Exchange')
      return
    }
    setShowDialog(true)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="px-4 h-9 flex items-center justify-center rounded-lg bg-primary text-white font-semibold text-sm"
      >
        Publish
      </button>

      {isPublic && (
        <PublishToMarketplaceDialog
          open={showDialog}
          onOpenChange={setShowDialog}
          listId={listId}
          listTitle={listTitle}
        />
      )}
    </>
  )
}

