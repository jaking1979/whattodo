import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ItemMenu } from '@/components/item-menu'

export default async function ListDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get list with items
  const { data: list, error } = await supabase
    .from('lists')
    .select('*, items(*)')
    .eq('id', id)
    .single()

  if (error || !list) {
    notFound()
  }

  // Verify ownership
  if ((list as any).user_id !== user.id) {
    redirect('/app/lists')
  }

  const items = (list as any).items || []
  const listData = list as any

  return (
    <>
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-sm border-b border-border/50">
        <div className="p-4 flex items-center justify-between">
          <Link href="/app/lists">
            <button className="p-2 -ml-2">
              <ChevronLeft className="h-6 w-6" />
            </button>
          </Link>
          <h1 className="text-lg font-bold absolute left-1/2 -translate-x-1/2">
            {listData.title}
          </h1>
          {listData.visibility === 'public' && (
            <button className="px-4 h-9 flex items-center justify-center rounded-lg bg-primary text-white font-semibold text-sm">
              Publish
            </button>
          )}
        </div>
        <div className="px-4">
          <div className="flex border-b border-border/50">
            <a className="flex-1 py-3 text-center text-sm font-semibold border-b-2 border-primary text-primary" href="#">
              Private
            </a>
            <a className="flex-1 py-3 text-center text-sm font-semibold border-b-2 border-transparent text-muted-foreground hover:text-primary transition-colors" href="#">
              Public
            </a>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-2 pb-28">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold mb-2">No items yet</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              Add your first item to this list
            </p>
          </div>
        ) : (
          items.map((item: any) => {
            const metadata = item.metadata || {}
            const poster = metadata.poster || metadata.cover || metadata.artwork
            
            return (
              <div key={item.id} className="flex items-center gap-4 bg-card p-3 rounded-xl shadow-soft">
                {poster && (
                  <div className="size-14 rounded-lg overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={poster}
                      alt={`${item.title} cover`}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{item.title}</p>
                  <p className="text-sm text-muted-foreground capitalize">{item.type}</p>
                  {item.notes && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary font-medium capitalize">
                    {item.status}
                  </div>
                  <ItemMenu
                    itemId={item.id}
                    itemTitle={item.title}
                    currentStatus={item.status}
                    currentNotes={item.notes}
                    listId={id}
                  />
                </div>
              </div>
            )
          })
        )}
      </main>
    </>
  )
}

