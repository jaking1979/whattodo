'use client'

import { useState } from 'react'
import { User, ChevronRight } from 'lucide-react'
import { EditProfileDialog } from './edit-profile-dialog'

interface EditProfileButtonProps {
  handle: string
  displayName?: string
  avatarUrl?: string
}

export function EditProfileButton({ handle, displayName, avatarUrl }: EditProfileButtonProps) {
  const [showDialog, setShowDialog] = useState(false)

  return (
    <>
      <li 
        onClick={() => setShowDialog(true)}
        className="flex items-center gap-4 p-4 hover:bg-primary/10 rounded-t-xl cursor-pointer"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 text-primary">
          <User className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="font-medium">Profile</p>
          <p className="text-sm text-muted-foreground">@{handle}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </li>

      <EditProfileDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        currentHandle={handle}
        currentDisplayName={displayName}
        currentAvatarUrl={avatarUrl}
      />
    </>
  )
}

