import { createClient } from '@/lib/supabase/server'
import { Heart, Bookmark } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { ExchangeSearch } from '@/components/exchange-search'
import { ExchangeFilters } from '@/components/exchange-filters'

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; category?: string }>
}) {
  const { query, category } = await searchParams
  const supabase = await createClient()

  // Get marketplace listings - Filter by sober content only
  let queryBuilder = supabase
    .from('marketplace_listings')
    .select(`
      *,
      lists!inner(title, cover_url, items(count)),
      profiles!inner(handle, display_name, avatar_url)
    `)
    .eq('is_public', true)
    .eq('is_indexable', true)
    .eq('is_sober_content', true)

  if (query) {
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
  }

  if (category && category !== 'all') {
    queryBuilder = queryBuilder.eq('category', category)
  }

  const { data: listings } = await queryBuilder
    .order('created_at', { ascending: false })
    .limit(20)

  // Get counts for each listing
  const listingsWithCounts = await Promise.all(
    (listings || []).map(async (listing: any) => {
      const [likesResult, savesResult] = await Promise.all([
        supabase.from('likes').select('id', { count: 'exact', head: true }).eq('listing_id', listing.id),
        supabase.from('saves').select('id', { count: 'exact', head: true }).eq('listing_id', listing.id),
      ])

      return {
        ...listing,
        likes_count: likesResult.count || 0,
        saves_count: savesResult.count || 0,
      }
    })
  )

  return (
    <>
      <div className="px-4 pt-4 pb-4 space-y-4">
        <Suspense fallback={<div className="h-12 bg-primary/10 rounded-lg animate-pulse" />}>
          <ExchangeSearch />
        </Suspense>
        <Suspense fallback={<div className="h-10 bg-primary/10 rounded-lg animate-pulse" />}>
          <ExchangeFilters />
        </Suspense>
      </div>

      <div className="space-y-4 p-4 pb-28">
        {!listingsWithCounts || listingsWithCounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-6xl mb-4">🔄</div>
            <h3 className="text-xl font-bold mb-2">No listings found</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              Check back later for sober and family-friendly lists from the community
            </p>
          </div>
        ) : (
          listingsWithCounts.map((listing: any) => (
            <Link key={listing.id} href={`/m/${listing.slug}`}>
              <div className="overflow-hidden rounded-xl bg-primary/10 shadow-sm dark:bg-white/5">
                {listing.lists?.cover_url && (
                  <div className="aspect-video w-full bg-cover bg-center" style={{ backgroundImage: `url(${listing.lists.cover_url})` }} />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-bold">{listing.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {listing.summary || listing.lists?.title}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-sm text-muted-foreground">
                      by @{listing.profiles?.handle}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {listing.likes_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bookmark className="h-4 w-4" />
                        {listing.saves_count}
                      </span>
                    </div>
                  </div>
                  {listing.category && (
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                        {listing.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  )
}

