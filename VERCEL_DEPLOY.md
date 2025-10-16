# 🚀 Deploy WhatToDo to Vercel - Step by Step

Your code is now on GitHub: `https://github.com/jaking1979/whattodo`

## Quick Deploy Checklist

### ✅ Step 1: Database Setup (5 minutes) - **DO THIS FIRST!**

1. Go to: [https://fkjdzlrthtcwcjgbucca.supabase.co](https://fkjdzlrthtcwcjgbucca.supabase.co)
2. Click **SQL Editor**
3. Create new query → Copy/paste `supabase/migrations/001_initial_schema.sql` → Run
4. Create new query → Copy/paste `supabase/migrations/002_rls_policies.sql` → Run
5. Verify in **Database** → **Tables** that you see 8 tables (profiles, lists, items, etc.)

**Important**: Skip this and your app won't work! ⚠️

---

### Step 2: Deploy to Vercel (5 minutes)

#### Option A: One-Click Deploy (Fastest)

1. Go to: [https://vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Find and select: `jaking1979/whattodo`
4. Click **"Import"**

Vercel will auto-detect Next.js settings. ✅

#### Option B: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

### Step 3: Add Environment Variables (3 minutes)

After importing, before first deploy:

1. In Vercel dashboard → **Settings** → **Environment Variables**
2. Add these variables (for **Production** AND **Preview**):

```
NEXT_PUBLIC_SUPABASE_URL=https://fkjdzlrthtcwcjgbucca.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZramR6bHJ0aHRjd2NqZ2J1Y2NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTYyODIsImV4cCI6MjA3NjE5MjI4Mn0.CgQTghNQt9KWM2vUbconc03VdveHmkLW2XAQlMnOPpU

NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app

TMDB_API_KEY=da41a1b3020f0d2f53fb72c21200e970

RAWG_API_KEY=d3c0476b06be4d56af18192eb81a1595
```

**Replace** `your-app-name.vercel.app` with your actual Vercel URL (you'll get this after deploy).

---

### Step 4: Configure Supabase Auth (2 minutes)

1. Go back to Supabase: [https://fkjdzlrthtcwcjgbucca.supabase.co](https://fkjdzlrthtcwcjgbucca.supabase.co)
2. **Authentication** → **URL Configuration**
3. Set **Site URL**: `https://your-app-name.vercel.app`
4. Add **Redirect URLs**: `https://your-app-name.vercel.app/auth/callback`
5. Click **Save**

---

### Step 5: Deploy! (1 minute)

1. Back in Vercel → **Deployments**
2. Click **"Redeploy"** (if you added env vars after first deploy)
3. Wait for build to complete (~2 minutes)
4. Click **"Visit"** to see your live app!

---

## 🎯 Post-Deployment

### Update App URL

Once deployed, update this environment variable in Vercel:

1. **Settings** → **Environment Variables**
2. Find `NEXT_PUBLIC_APP_URL`
3. Update to your actual URL: `https://your-app-name.vercel.app`
4. Redeploy

### Test Your Live App

1. ✅ Visit your Vercel URL
2. ✅ Sign in with email
3. ✅ Check magic link in email
4. ✅ Create a list
5. ✅ Add items
6. ✅ Publish to marketplace
7. ✅ Test PWA install
8. ✅ Try offline mode

---

## 🔧 Troubleshooting

### Build Fails
- Check all environment variables are set
- Verify they're set for **both** Production and Preview
- Check build logs in Vercel dashboard

### Auth Not Working
- Verify `NEXT_PUBLIC_APP_URL` matches your Vercel URL
- Check Supabase redirect URLs are configured
- Make sure Site URL is set in Supabase

### Database Errors
- Confirm migrations ran successfully
- Check tables exist in Supabase
- Verify RLS policies are enabled

### Images Not Loading
- Check `next.config.ts` has correct image domains
- Verify external URLs are accessible

---

## 📊 Your Deployment URLs

After deployment, you'll have:

- **Production**: `https://your-app.vercel.app`
- **GitHub**: `https://github.com/jaking1979/whattodo`
- **Supabase**: `https://fkjdzlrthtcwcjgbucca.supabase.co`

---

## ⚡ Quick Vercel Settings

Vercel will auto-configure:
- ✅ Framework: Next.js
- ✅ Build Command: `next build`
- ✅ Output Directory: `.next`
- ✅ Install Command: `npm install`
- ✅ Node Version: 18.x

You don't need to change these!

---

## 🎉 You're Done!

Once deployed:
1. Share your app URL with friends
2. Test all features
3. Monitor in Vercel Analytics
4. Check Supabase dashboard for usage

Need help? Check:
- `DEPLOYMENT.md` - Full deployment guide
- `QUICKSTART.md` - Testing guide
- Vercel docs: [vercel.com/docs](https://vercel.com/docs)
- Supabase docs: [supabase.com/docs](https://supabase.com/docs)

---

**Ready to deploy?** Go to [vercel.com/new](https://vercel.com/new) now! 🚀

