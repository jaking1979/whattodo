import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { generateHandleFromEmail } from '@/lib/utils/handle'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Check if profile exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        // Create profile if it doesn't exist
        if (!profile) {
          const handle = generateHandleFromEmail(user.email || '')
          
          await (supabase.from('profiles') as any).insert({
            id: user.id,
            handle: handle,
            display_name: user.email?.split('@')[0] || handle,
            avatar_url: user.user_metadata?.avatar_url || null,
          })
        }
      }

      // Redirect to app
      return NextResponse.redirect(`${origin}/app/lists`)
    }
  }

  // Return to login if there was an error
  return NextResponse.redirect(`${origin}/login`)
}

