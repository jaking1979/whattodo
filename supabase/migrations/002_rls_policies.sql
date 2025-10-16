-- Enable Row Level Security on all tables
alter table profiles enable row level security;
alter table groups enable row level security;
alter table lists enable row level security;
alter table items enable row level security;
alter table marketplace_listings enable row level security;
alter table likes enable row level security;
alter table saves enable row level security;
alter table reports enable row level security;
alter table catalog_cache enable row level security;

-- Profiles policies
create policy "Users can view any profile"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Groups policies
create policy "Users can manage own groups"
  on groups for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Lists policies
create policy "Users can manage own lists"
  on lists for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Anyone can view public lists"
  on lists for select
  using (visibility = 'public');

create policy "Anyone can view unlisted lists (if they have the link)"
  on lists for select
  using (visibility = 'unlisted');

-- Items policies
create policy "Users can manage own items"
  on items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Anyone can view items of public lists"
  on items for select
  using (
    exists (
      select 1 from lists
      where lists.id = items.list_id
        and lists.visibility = 'public'
    )
  );

create policy "Anyone can view items of unlisted lists"
  on items for select
  using (
    exists (
      select 1 from lists
      where lists.id = items.list_id
        and lists.visibility = 'unlisted'
    )
  );

-- Marketplace listings policies
create policy "Users can manage own marketplace listings"
  on marketplace_listings for all
  using (auth.uid() = owner_user_id)
  with check (auth.uid() = owner_user_id);

create policy "Anyone can view public marketplace listings"
  on marketplace_listings for select
  using (is_public = true);

-- Likes policies
create policy "Users can manage own likes"
  on likes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Anyone can view likes (for counts)"
  on likes for select
  using (true);

-- Saves policies
create policy "Users can manage own saves"
  on saves for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Anyone can view saves (for counts)"
  on saves for select
  using (true);

-- Reports policies
create policy "Users can create reports"
  on reports for insert
  with check (auth.uid() = user_id);

create policy "Users can view own reports"
  on reports for select
  using (auth.uid() = user_id);

-- Catalog cache policies (server-side only, but allowing reads)
create policy "Anyone can read catalog cache"
  on catalog_cache for select
  using (true);

create policy "Service role can manage catalog cache"
  on catalog_cache for all
  using (true)
  with check (true);

