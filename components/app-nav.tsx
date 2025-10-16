'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Search, Package, List as ListIcon, Store } from 'lucide-react'
import { QuickAddButton } from './quick-add-button'
import type { User } from '@supabase/supabase-js'

interface AppNavProps {
  user: User
  profile: any
}

export function AppNav({ user, profile }: AppNavProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const isActive = (path: string) => pathname.startsWith(path)

  return (
    <>
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <svg className="text-foreground" height="28" viewBox="0 0 256 256" width="28" xmlns="http://www.w3.org/2000/svg">
              <path d="M148 64a12 12 0 1 1-12-12a12 12 0 0 1 12 12Zm-12 52a12 12 0 1 0 12 12a12 12 0 0 0-12-12Zm0 64a12 12 0 1 0 12 12a12 12 0 0 0-12-12Zm-80-92v-4a8 8 0 0 1 16 0v4h112v-4a8 8 0 0 1 16 0v4a24 24 0 0 1 24 24v88a24 24 0 0 1-24 24H40a24 24 0 0 1-24-24v-88a24 24 0 0 1 24-24Zm160 24H40v88h160Z" fill="currentColor"></path>
            </svg>
            <h1 className="text-xl font-bold">WhatToDo</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-foreground">
              <Search className="h-6 w-6" />
            </button>
            <QuickAddButton />
          </div>
        </div>
        <div className="px-4">
          <div className="flex rounded-xl bg-card p-1">
            <Link
              href="/app/inbox"
              className={`flex-1 text-center rounded-lg py-2.5 text-sm font-bold ${
                isActive('/app/inbox')
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground'
              }`}
            >
              Inbox
            </Link>
            <Link
              href="/app/lists"
              className={`flex-1 text-center rounded-lg py-2.5 text-sm font-bold ${
                isActive('/app/lists') || isActive('/app/l/')
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground'
              }`}
            >
              Lists
            </Link>
            <Link
              href="/marketplace"
              className={`flex-1 text-center rounded-lg py-2.5 text-sm font-bold ${
                isActive('/marketplace') || isActive('/m/')
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground'
              }`}
            >
              Marketplace
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <nav className="flex items-center justify-around px-4 pb-3 pt-2">
          <Link href="/app/inbox" className={`flex flex-col items-center gap-1 ${isActive('/app/inbox') ? 'text-primary' : 'text-muted-foreground'}`}>
            <Package className="h-6 w-6" />
            <span className="text-xs font-medium">Inbox</span>
          </Link>
          <Link href="/app/lists" className={`flex flex-col items-center gap-1 ${isActive('/app/lists') || isActive('/app/l/') ? 'text-primary' : 'text-muted-foreground'}`}>
            <ListIcon className="h-6 w-6" />
            <span className="text-xs font-medium">Lists</span>
          </Link>
          <Link href="/marketplace" className={`flex flex-col items-center gap-1 ${isActive('/marketplace') || isActive('/m/') ? 'text-primary' : 'text-muted-foreground'}`}>
            <Store className="h-6 w-6" />
            <span className="text-xs font-medium">Marketplace</span>
          </Link>
        </nav>
      </footer>
    </>
  )
}

