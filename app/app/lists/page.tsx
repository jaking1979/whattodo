import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { NewListButton } from '@/components/new-list-button'

export default async function ListsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Get all lists with item counts
  const { data: lists } = await supabase
    .from('lists')
    .select(`
      *,
      items(count)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const getItemCount = (list: any) => {
    return list.items?.[0]?.count || 0
  }

  const getTimeAgo = (date: string) => {
    const now = new Date()
    const then = new Date(date)
    const days = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return '1d ago'
    if (days < 7) return `${days}d ago`
    if (days < 30) return `${Math.floor(days / 7)}w ago`
    return `${Math.floor(days / 30)}m ago`
  }

  return (
    <>
      <main className="flex-grow p-4 pb-28">
        {!lists || lists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold mb-2">No lists yet</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Create your first list to start organizing your media
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {lists.map((list: any) => (
              <Link key={list.id} href={`/app/l/${list.id}`}>
                <div className="flex flex-col gap-4 rounded-xl bg-card/50 dark:bg-card/20 p-4 shadow-soft hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <h2 className="text-base font-bold">{list.title}</h2>
                      <p className="text-sm text-muted-foreground">{getItemCount(list)} items</p>
                      <p className="text-xs text-muted-foreground/70">
                        Updated {getTimeAgo(list.updated_at)}
                      </p>
                    </div>
                    <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary dark:bg-primary/30 capitalize">
                      {list.visibility}
                    </span>
                  </div>
                  {list.cover_url && (
                    <div 
                      className="h-24 w-full rounded-lg bg-cover bg-center"
                      style={{ backgroundImage: `url(${list.cover_url})` }}
                    />
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <div className="md:hidden sticky bottom-16 z-10 p-4">
        <NewListButton />
      </div>
    </>
  )
}

