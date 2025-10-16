# WhatToDo - Quick Start Guide

Get your WhatToDo PWA running in under 10 minutes!

## Prerequisites Check

- ✅ Node.js 18+ installed
- ✅ Git installed
- ✅ Supabase project created
- ✅ Environment variables ready

## 5-Minute Local Setup

### Step 1: Clone & Install (1 min)

```bash
cd /Users/josh/whattodo
npm install
```

### Step 2: Configure Environment (1 min)

The `.env.local` file is already configured with:
- Supabase URL: `https://fkjdzlrthtcwcjgbucca.supabase.co`
- Anon Key: Already set
- TMDb API Key: `da41a1b3020f0d2f53fb72c21200e970`
- RAWG API Key: `d3c0476b06be4d56af18192eb81a1595`

### Step 3: Run Database Migrations (3 min)

1. Go to [https://fkjdzlrthtcwcjgbucca.supabase.co](https://fkjdzlrthtcwcjgbucca.supabase.co)
2. Click **SQL Editor**
3. Copy contents of `supabase/migrations/001_initial_schema.sql` and run
4. Copy contents of `supabase/migrations/002_rls_policies.sql` and run

**Verify**: Check **Database** → **Tables** to confirm all tables exist.

### Step 4: Configure Supabase Auth (2 min)

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Under **Authentication** → **URL Configuration**:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### Step 5: Start Development Server (30 sec)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## First Steps in the App

1. Click **Sign In**
2. Enter your email
3. Check your email for the magic link
4. Click the link to sign in
5. You'll be redirected to `/app/lists`
6. Start creating lists and adding items!

## Testing the Features

### Test Authentication
- ✅ Sign in with email
- ✅ Profile created automatically
- ✅ Redirected to /app/lists

### Test Lists
- ✅ Create a new list
- ✅ View list details
- ✅ Change visibility (Private/Public)

### Test Items
- ✅ Add items to lists
- ✅ Mark items as Started/Done
- ✅ View in Inbox
- ✅ See completed items in Activity

### Test Marketplace
- ✅ Publish a public list
- ✅ Browse marketplace
- ✅ Like/save listings
- ✅ Remix a list

### Test PWA
- ✅ Install as app (on mobile or Chrome desktop)
- ✅ Works offline (view cached pages)
- ✅ Syncs when back online

## Common Issues

### "User not found" Error
- Check that migrations ran successfully
- Verify profiles table exists
- Try signing out and back in

### API Lookup Not Working
- Verify API keys in `.env.local`
- Check console for error messages
- APIs work without keys but have limited functionality

### Images Not Loading
- Check `next.config.ts` has image domains whitelisted
- Verify external URLs are accessible

## Production Deployment

See `DEPLOYMENT.md` for full deployment guide to Vercel.

Quick deploy:
```bash
# Push to GitHub
git add .
git commit -m "Ready for deployment"
git push

# Deploy to Vercel
npx vercel --prod
```

## Need Help?

- Check `README.md` for full documentation
- See `IMPLEMENTATION.md` for feature status
- Review `supabase/MIGRATIONS.md` for database help
- Check GitHub Issues for known problems

---

**You're ready to go!** Enjoy using WhatToDo! 🎉

