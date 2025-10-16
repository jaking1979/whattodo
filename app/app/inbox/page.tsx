import { createClient } from '@/lib/supabase/server'
import { ItemMenu } from '@/components/item-menu'

export default async function InboxPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Get or create an "Inbox" list
  let { data: inboxList } = await supabase
    .from('lists')
    .select('*, items(*)')
    .eq('user_id', user.id)
    .eq('title', 'Inbox')
    .single()

  // Create inbox list if it doesn't exist
  if (!inboxList) {
    const { data: newList } = await (supabase
      .from('lists') as any)
      .insert({
        user_id: user.id,
        title: 'Inbox',
        description: 'Quick capture - sort these later',
        visibility: 'private',
      })
      .select('*, items(*)')
      .single()

    inboxList = newList
  }

  const items = (inboxList as any)?.items || []
  const inboxId = (inboxList as any)?.id

  return (
    <main className="flex-grow p-4 space-y-2 pb-28">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-6xl mb-4">📥</div>
          <h3 className="text-xl font-bold mb-2">Your inbox is empty</h3>
          <p className="text-muted-foreground text-center max-w-sm">
            Tap the + button above to quickly capture items you want to check out later
          </p>
        </div>
      ) : (
        <>
          {items.map((item: any) => (
            <div key={item.id} className="bg-card p-3 rounded-xl shadow-soft">
              <div className="flex items-center gap-4">
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-semibold truncate">{item.title}</p>
                  <span className="inline-block text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium capitalize mt-1">
                    {item.type}
                  </span>
                  {item.notes && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.notes}</p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <ItemMenu
                    itemId={item.id}
                    itemTitle={item.title}
                    currentStatus={item.status}
                    currentNotes={item.notes}
                    listId={inboxId}
                  />
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </main>
  )
}

