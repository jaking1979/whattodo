import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'

export default async function ActivityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Get completed items
  const { data: completedItems } = await supabase
    .from('items')
    .select('*, lists(title, slug)')
    .eq('user_id', user.id)
    .eq('status', 'done')
    .not('completed_at', 'is', null)
    .order('completed_at', { ascending: false })
    .limit(50)

  // Group by month
  const itemsByMonth = (completedItems || []).reduce((acc: any, item: any) => {
    const date = new Date(item.completed_at)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        name: monthName,
        items: [],
      }
    }
    acc[monthKey].items.push(item)
    return acc
  }, {})

  const months = Object.entries(itemsByMonth).sort((a, b) => b[0].localeCompare(a[0]))

  return (
    <main className="flex-grow p-4 space-y-6 pb-28">
      {months.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold mb-2">No activity yet</h3>
          <p className="text-muted-foreground text-center max-w-sm">
            Mark items as done to see them here
          </p>
        </div>
      ) : (
        months.map(([monthKey, month]: any) => (
          <div key={monthKey} className="space-y-3">
            <h2 className="text-lg font-bold px-2">{month.name}</h2>
            {month.items.map((item: any) => {
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
                    <p className="text-sm text-muted-foreground capitalize">
                      {item.type}
                      {item.lists && ` • from ${(item.lists as any).title}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.completed_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    Done
                  </div>
                </div>
              )
            })}
          </div>
        ))
      )}
    </main>
  )
}

