-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (matches auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text unique not null,
  display_name text,
  avatar_url text,
  created_at timestamptz default now() not null
);

-- Groups table (optional container for lists)
create table groups (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  position int,
  created_at timestamptz default now() not null
);

-- Lists table
create table lists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  group_id uuid references groups(id) on delete set null,
  title text not null,
  description text,
  visibility text check (visibility in ('private', 'unlisted', 'public')) default 'private' not null,
  slug text unique,
  cover_url text,
  tags text[],
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Items table
create table items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  list_id uuid not null references lists(id) on delete cascade,
  type text check (type in ('movie', 'show', 'book', 'podcast', 'game', 'boardgame', 'app', 'link')) not null,
  title text not null,
  url text,
  source text,
  source_id text,
  status text check (status in ('saved', 'started', 'done')) default 'saved' not null,
  notes text,
  tags text[],
  metadata jsonb,
  added_at timestamptz default now() not null,
  completed_at timestamptz,
  updated_at timestamptz default now() not null
);

-- Marketplace listings table
create table marketplace_listings (
  id uuid primary key default uuid_generate_v4(),
  list_id uuid not null references lists(id) on delete cascade,
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  slug text unique not null,
  title text not null,
  summary text,
  category text,
  tags text[],
  is_public bool default true not null,
  is_indexable bool default true not null,
  forked_from_list_id uuid references lists(id) on delete set null,
  created_at timestamptz default now() not null
);

-- Likes table
create table likes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid not null references marketplace_listings(id) on delete cascade,
  created_at timestamptz default now() not null,
  unique(user_id, listing_id)
);

-- Saves/bookmarks table
create table saves (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid not null references marketplace_listings(id) on delete cascade,
  created_at timestamptz default now() not null,
  unique(user_id, listing_id)
);

-- Reports table (optional moderation)
create table reports (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid not null references marketplace_listings(id) on delete cascade,
  reason text,
  created_at timestamptz default now() not null
);

-- Catalog cache table (for external API responses)
create table catalog_cache (
  key text primary key,
  payload jsonb not null,
  ttl_expires_at timestamptz,
  created_at timestamptz default now() not null
);

-- Indexes for performance
create index idx_profiles_handle on profiles(handle);
create index idx_groups_user on groups(user_id);
create index idx_lists_user on lists(user_id);
create index idx_lists_slug on lists(slug);
create index idx_lists_visibility on lists(visibility);
create index idx_lists_tags on lists using gin(tags);
create index idx_items_user on items(user_id);
create index idx_items_list on items(list_id);
create index idx_items_status on items(status);
create index idx_items_tags on items using gin(tags);
create index idx_marketplace_slug on marketplace_listings(slug);
create index idx_marketplace_public on marketplace_listings(is_public);
create index idx_marketplace_tags on marketplace_listings using gin(tags);
create index idx_likes_user on likes(user_id);
create index idx_likes_listing on likes(listing_id);
create index idx_saves_user on saves(user_id);
create index idx_saves_listing on saves(listing_id);

-- Trigger function for updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Add triggers for updated_at
create trigger trg_lists_updated
  before update on lists
  for each row execute function set_updated_at();

create trigger trg_items_updated
  before update on items
  for each row execute function set_updated_at();

