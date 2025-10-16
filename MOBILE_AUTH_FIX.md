# 🔧 Fix Mobile Magic Link Authentication

## The Problem

Magic links work on desktop but redirect to login page on mobile.

## The Root Cause

Your Supabase **Site URL** is currently set to `http://localhost:3000` instead of your production URL. This causes mobile auth to fail.

## The Fix (2 minutes)

### Step 1: Update Supabase Site URL

1. Go to: [https://fkjdzlrthtcwcjgbucca.supabase.co](https://fkjdzlrthtcwcjgbucca.supabase.co)

2. Navigate to: **Authentication** → **URL Configuration**

3. **Change Site URL from:**
   ```
   http://localhost:3000
   ```
   **To:**
   ```
   https://whattodo.vercel.app
   ```

4. **In Redirect URLs, make sure you have BOTH:**
   ```
   https://whattodo.vercel.app/auth/callback
   http://localhost:3001/auth/callback
   ```
   
   This allows auth to work in both production AND local development.

5. Click **Save**

### Step 2: Test on Mobile

1. On your mobile device, go to: `https://whattodo.vercel.app`
2. Click "Sign In"
3. Enter your email
4. Check email on your phone
5. Click the magic link
6. You should now be redirected to `/app/lists` ✅

---

## Why This Happens

When you click a magic link on mobile:
- Email apps often open links in an in-app browser
- Supabase validates the redirect URL against your configured Site URL
- If the Site URL doesn't match, the session exchange fails
- The user gets redirected back to login

**The fix:** Setting the correct production URL in Supabase solves this!

---

## Additional Mobile Tips

### If you're still having issues:

**Option 1: Open in Safari/Chrome**
- Long-press the magic link
- Select "Open in Safari" or "Open in Chrome"
- This ensures it opens in your main browser

**Option 2: Copy Link Address**
- Long-press the magic link
- Copy the link
- Paste into Safari/Chrome
- This bypasses the email app's browser

---

## Verification Checklist

After making the change, verify:

- [ ] Site URL in Supabase = `https://whattodo.vercel.app`
- [ ] Redirect URLs include your Vercel app URL
- [ ] Redirect URLs include `http://localhost:3001` for local dev
- [ ] Saved changes in Supabase
- [ ] Tested on mobile device

---

## Still Not Working?

Check these:

1. **Clear browser cache on mobile**
   - Settings → Safari/Chrome → Clear History and Website Data

2. **Check Vercel deployment logs**
   - Go to Vercel dashboard
   - Check recent deployment logs for errors

3. **Verify environment variables in Vercel**
   - `NEXT_PUBLIC_APP_URL` should be `https://whattodo.vercel.app`
   - Both Production and Preview environments set

4. **Database migrations**
   - Ensure you ran both SQL migration files
   - Check that `profiles` table exists in Supabase

---

## Pro Tip

For the best mobile experience:
- Install the PWA (Add to Home Screen)
- This opens the app in standalone mode
- No browser chrome, feels like a native app!

---

**Once you update the Site URL in Supabase, mobile auth will work perfectly!** 🎯

