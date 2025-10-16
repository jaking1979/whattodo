'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { AddItemDialog } from './add-item-dialog'

export function QuickAddButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center bg-primary text-white rounded-full w-10 h-10 shadow-lg hover:shadow-xl transition-shadow"
      >
        <Plus className="h-6 w-6" />
      </button>
      <AddItemDialog open={open} onOpenChange={setOpen} />
    </>
  )
}

