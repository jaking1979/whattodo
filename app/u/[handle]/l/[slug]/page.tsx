import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ChevronLeft, Share2, RefreshCcw } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ handle: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle, slug } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('handle', handle)
    .single()

  if (!profile) {
    return { title: 'List Not Found' }
  }

  const { data: list } = await supabase
    .from('lists')
    .select('*')
    .eq('slug', slug)
    .eq('user_id', (profile as any).id)
    .single()

  if (!list || ((list as any).visibility !== 'public' && (list as any).visibility !== 'unlisted')) {
    return { title: 'List Not Found' }
  }

  return {
    title: `${(list as any).title} by @${handle} - WhatToDo`,
    description: (list as any).description || `A curated list by @${handle}`,
  }
}

export default async function PublicListPage({ params }: Props) {
  const { handle, slug } = await params
  const supabase = await createClient()

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('handle', handle)
    .single()

  if (!profile) {
    notFound()
  }

  // Get list with items
  const { data: list, error } = await supabase
    .from('lists')
    .select('*, items(*)')
    .eq('slug', slug)
    .eq('user_id', (profile as any).id)
    .single()

  if (error || !list) {
    notFound()
  }

  // Check visibility
  if ((list as any).visibility !== 'public' && (list as any).visibility !== 'unlisted') {
    notFound()
  }

  const items = (list as any).items || []
  const listData = list as any

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <Link href="/marketplace">
            <button className="p-2">
              <ChevronLeft className="h-6 w-6" />
            </button>
          </Link>
          <h1 className="text-lg font-bold flex-1 text-center">{listData.title}</h1>
          <button className="p-2">
            <Share2 className="h-6 w-6" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-28">
        <div className="p-4 space-y-6">
          <div className="flex items-center gap-4">
            {(profile as any).avatar_url && (
              <div className="w-24 h-24 rounded-full bg-cover bg-center shadow-md relative overflow-hidden">
                <Image
                  src={(profile as any).avatar_url}
                  alt={(profile as any).display_name || (profile as any).handle}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex flex-col">
              <p className="text-xl font-bold">{(profile as any).display_name || (profile as any).handle}</p>
              <p className="text-base text-muted-foreground">@{(profile as any).handle}</p>
            </div>
          </div>

          <button className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-primary text-white font-bold shadow-lg hover:bg-primary/90 transition-colors">
            <RefreshCcw className="h-5 w-5" />
            <span>Remix This List</span>
          </button>

          <div className="space-y-2">
            {items.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                This list is empty
              </div>
            ) : (
              items.map((item: any) => {
                const metadata = item.metadata || {}
                const poster = metadata.poster || metadata.cover || metadata.artwork
                
                return (
                  <div key={item.id} className="flex items-center gap-4 p-2 rounded-xl bg-card/30 dark:bg-card/10">
                    {poster && (
                      <div className="w-16 h-16 rounded-lg bg-cover bg-center bg-no-repeat relative overflow-hidden">
                        <Image
                          src={poster}
                          alt={`${item.title} cover`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.title}</p>
                      <p className="text-sm text-muted-foreground capitalize">{item.type}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Created with <Link href="/" className="text-primary hover:underline">WhatToDo</Link></p>
        </div>
      </footer>
    </div>
  )
}

