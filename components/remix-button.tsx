'use client'

import { useState, useEffect } from 'react'
import { RefreshCcw } from 'lucide-react'
import { ConfirmRemixDialog } from './confirm-remix-dialog'

interface RemixButtonProps {
  listId: string
  listTitle: string
  className?: string
}

export function RemixButton({ listId, listTitle, className }: RemixButtonProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated (simple check)
    const checkAuth = () => {
      // If we're on a page that requires auth, we're authenticated
      // Otherwise, we'll handle it in the dialog/action
      setIsAuthenticated(true)
    }
    checkAuth()
  }, [])

  const handleClick = () => {
    // Open dialog - it will handle auth check
    setShowDialog(true)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={className || "w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-primary text-white font-bold shadow-lg hover:bg-primary/90 transition-colors"}
      >
        <RefreshCcw className="h-5 w-5" />
        <span>Remix This List</span>
      </button>

      <ConfirmRemixDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        listId={listId}
        listTitle={listTitle}
      />
    </>
  )
}

