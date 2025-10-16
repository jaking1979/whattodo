import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ChevronLeft, Heart, Bookmark, RefreshCcw } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default async function MarketplaceListingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  // Get listing with related data
  const { data: listing, error } = await supabase
    .from('marketplace_listings')
    .select(`
      *,
      lists!inner(*, items(*)),
      profiles!inner(handle, display_name, avatar_url)
    `)
    .eq('slug', slug)
    .eq('is_public', true)
    .single()

  if (error || !listing) {
    notFound()
  }

  const list = (listing as any).lists
  const items = list?.items || []
  const listingData = listing as any

  // Get like and save counts
  const [likesResult, savesResult] = await Promise.all([
    supabase.from('likes').select('id', { count: 'exact', head: true }).eq('listing_id', listingData.id),
    supabase.from('saves').select('id', { count: 'exact', head: true }).eq('listing_id', listingData.id),
  ])

  const likesCount = likesResult.count || 0
  const savesCount = savesResult.count || 0

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <Link href="/marketplace">
            <button className="p-2">
              <ChevronLeft className="h-6 w-6" />
            </button>
          </Link>
          <h1 className="text-lg font-bold flex-1 text-center pr-10">{listingData.title}</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-8">
        <div className="p-4 space-y-6">
          {list?.cover_url && (
            <div className="aspect-video w-full rounded-xl bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${list.cover_url})` }} />
          )}

          <div>
            <h2 className="text-2xl font-bold mb-2">{listingData.title}</h2>
            {listingData.summary && (
              <p className="text-muted-foreground">{listingData.summary}</p>
            )}
            <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
              <span>by @{listingData.profiles.handle}</span>
              {listingData.category && (
                <>
                  <span>•</span>
                  <span>{listingData.category}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl bg-card border border-border hover:bg-primary/10">
              <Heart className="h-5 w-5" />
              <span className="font-semibold">{likesCount}</span>
            </button>
            <button className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl bg-card border border-border hover:bg-primary/10">
              <Bookmark className="h-5 w-5" />
              <span className="font-semibold">{savesCount}</span>
            </button>
          </div>

          <button className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-primary text-white font-bold shadow-lg hover:bg-primary/90 transition-colors">
            <RefreshCcw className="h-5 w-5" />
            <span>Remix This List</span>
          </button>

          <div className="space-y-2">
            <h3 className="text-lg font-bold">Items ({items.length})</h3>
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
                      <div className="w-16 h-16 rounded-lg relative overflow-hidden">
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
    </div>
  )
}

