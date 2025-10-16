# WhatToDo - Deployment Guide

This guide will help you deploy WhatToDo to Vercel with Supabase backend.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Supabase account (free tier works)
- API keys for external services (optional):
  - TMDb API key (for movies/TV)
  - RAWG API key (for games)

## Step 1: Set Up Supabase

### 1.1 Create Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Note your **Project URL** and **Anon/Public Key** from Settings → API

### 1.2 Run Database Migrations

1. Navigate to your Supabase project dashboard
2. Go to **SQL Editor**
3. Run the migration files in order:
   - Copy and paste `supabase/migrations/001_initial_schema.sql`
   - Click "Run" to execute
   - Copy and paste `supabase/migrations/002_rls_policies.sql`
   - Click "Run" to execute

See `supabase/MIGRATIONS.md` for detailed instructions.

### 1.3 Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Under **Authentication** → **URL Configuration**:
   - Add your site URL: `https://your-app.vercel.app`
   - Add redirect URLs: `https://your-app.vercel.app/auth/callback`

## Step 2: Push to GitHub

```bash
git add .
git commit -m "Initial WhatToDo PWA setup"
git push origin main
```

## Step 3: Deploy to Vercel

### 3.1 Connect Repository

1. Go to [https://vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository: `jaking1979/whattodo`
4. Vercel will auto-detect Next.js settings

### 3.2 Configure Environment Variables

In **Project Settings** → **Environment Variables**, add:

**Required:**
```
NEXT_PUBLIC_SUPABASE_URL=https://fkjdzlrthtcwcjgbucca.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Optional (for metadata lookups):**
```
TMDB_API_KEY=your_tmdb_key_here
RAWG_API_KEY=your_rawg_key_here
```

**Important:** Add these to both **Production** and **Preview** environments.

### 3.3 Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Visit your deployed app!

## Step 4: Post-Deployment

### 4.1 Update Supabase Auth URLs

Go back to Supabase **Authentication** → **URL Configuration** and add your Vercel URL:
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/auth/callback`

### 4.2 Test Authentication

1. Visit your app
2. Try signing in with email
3. Check that profile is created
4. Verify you can create lists and items

## Step 5: Optional - Custom Domain

1. In Vercel, go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` environment variable
5. Update Supabase auth URLs

## Troubleshooting

### Build Fails

- Check that all environment variables are set
- Verify Next.js version is 14 or higher
- Check build logs for specific errors

### Auth Not Working

- Verify Supabase URL and anon key are correct
- Check that redirect URLs are configured in Supabase
- Ensure `NEXT_PUBLIC_APP_URL` matches your deployment URL

### Images Not Loading

- Check that image domains are whitelisted in `next.config.ts`
- Verify external API keys are valid

### Database Errors

- Confirm migrations were run successfully
- Check that RLS policies are enabled
- Verify table structure matches schema

## Monitoring

- Use Vercel Analytics for page views
- Check Vercel Logs for runtime errors
- Monitor Supabase dashboard for database usage

## Support

For issues:
1. Check GitHub Issues
2. Review Supabase docs: [https://supabase.com/docs](https://supabase.com/docs)
3. Review Next.js docs: [https://nextjs.org/docs](https://nextjs.org/docs)

---

**Congratulations!** Your WhatToDo PWA is now live! 🎉

