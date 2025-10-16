import { createClient } from '@/lib/supabase/server'
import { ChevronLeft, ChevronRight, User, Mail, Download, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <>
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center p-4">
          <Link href="/app/lists">
            <button className="flex items-center justify-center w-10 h-10">
              <ChevronLeft className="h-6 w-6" />
            </button>
          </Link>
          <h1 className="flex-1 text-lg font-bold text-center mr-10">Settings</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 space-y-8 pb-28">
        <section className="space-y-4">
          <h2 className="px-4 text-sm font-bold tracking-wider uppercase text-muted-foreground">Account</h2>
          <div className="bg-card/30 dark:bg-card/10 rounded-xl shadow-sm">
            <ul className="divide-y divide-border/20">
              <li className="flex items-center gap-4 p-4 hover:bg-primary/10 rounded-t-xl">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Profile</p>
                  <p className="text-sm text-muted-foreground">@{(profile as any)?.handle}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </li>
              <li className="flex items-center gap-4 p-4 hover:bg-primary/10 rounded-b-xl">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="px-4 text-sm font-bold tracking-wider uppercase text-muted-foreground">Data</h2>
          <div className="bg-card/30 dark:bg-card/10 rounded-xl shadow-sm">
            <ul className="divide-y divide-border/20">
              <li className="flex items-center gap-4 p-4 hover:bg-primary/10 rounded-t-xl">
                <Link href="/api/export" className="flex items-center gap-4 flex-1">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 text-primary">
                    <Download className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Export Data</p>
                    <p className="text-sm text-muted-foreground">Download all your data as JSON</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              </li>
              <li className="flex items-center gap-4 p-4 hover:bg-destructive/10 rounded-b-xl">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-destructive/20 text-destructive">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-destructive">Delete Account</p>
                  <p className="text-sm text-muted-foreground">Permanently delete your account</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </li>
            </ul>
          </div>
        </section>
      </main>
    </>
  )
}

