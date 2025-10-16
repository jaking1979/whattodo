'use client'

import { useState } from 'react'
import { Trash2, ChevronRight } from 'lucide-react'
import { DeleteAccountDialog } from './delete-account-dialog'

export function DeleteAccountButton() {
  const [showDialog, setShowDialog] = useState(false)

  return (
    <>
      <li 
        onClick={() => setShowDialog(true)}
        className="flex items-center gap-4 p-4 hover:bg-destructive/10 rounded-b-xl cursor-pointer"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-destructive/20 text-destructive">
          <Trash2 className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-destructive">Delete Account</p>
          <p className="text-sm text-muted-foreground">Permanently delete your account</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </li>

      <DeleteAccountDialog
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  )
}

