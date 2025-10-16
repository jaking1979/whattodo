import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { generateHandleFromEmail } from '@/lib/utils/handle'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/app/lists'
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth callback error:', error)
      // Redirect to login with error message
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent('Authentication failed. Please try again.')}`
      )
    }

    if (data.user) {
      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      // Create profile if it doesn't exist
      if (!profile) {
        const handle = generateHandleFromEmail(data.user.email || '')
        
        try {
          await (supabase.from('profiles') as any).insert({
            id: data.user.id,
            handle: handle,
            display_name: data.user.email?.split('@')[0] || handle,
            avatar_url: data.user.user_metadata?.avatar_url || null,
          })
        } catch (profileError) {
          console.error('Profile creation error:', profileError)
        }
      }

      // Successful authentication - redirect to app
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // No code or invalid request - return to login
  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent('Invalid authentication link.')}`
  )
}

