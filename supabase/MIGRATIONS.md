# Database Migrations

This directory contains SQL migration files for the WhatToDo application.

## Running Migrations

### Option 1: Using Supabase Dashboard (Recommended for first-time setup)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of each migration file in order:
   - `001_initial_schema.sql`
   - `002_rls_policies.sql`
4. Run each file

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed locally:

```bash
# Login to Supabase
npx supabase login

# Link to your project
npx supabase link --project-ref fkjdzlrthtcwcjgbucca

# Push migrations
npx supabase db push
```

### Option 3: Manual SQL Execution

You can connect to your Postgres database directly using the connection string from your Supabase project settings and execute the migration files.

## Migration Files

- **001_initial_schema.sql**: Creates all tables, indexes, and triggers
- **002_rls_policies.sql**: Sets up Row-Level Security policies

## Verifying Migrations

After running migrations, verify that:

1. All tables exist in the `public` schema
2. RLS is enabled on all tables
3. Indexes are created
4. Triggers are active

You can check this in the Supabase dashboard under **Database** → **Tables**.

## Note

These migrations should be run on a fresh database. If you need to reset your database:

1. Go to **Database** → **Migrations** in Supabase dashboard
2. Click "Reset database" (warning: this deletes all data)
3. Re-run the migrations

