-- Add sober content field to marketplace_listings
alter table marketplace_listings add column if not exists is_sober_content boolean default false not null;

-- Add index for filtering
create index if not exists idx_marketplace_sober on marketplace_listings(is_sober_content);

-- Add admin review flag for moderation
alter table marketplace_listings add column if not exists admin_approved boolean default null;

-- Add index for admin review
create index if not exists idx_marketplace_admin_approved on marketplace_listings(admin_approved);

-- Update the public read policy to only show sober content or admin-approved content
drop policy if exists "Anyone can view public marketplace listings" on marketplace_listings;

create policy "Anyone can view sober marketplace listings"
  on marketplace_listings for select
  using (is_public = true and is_sober_content = true);

-- Optional: Policy for viewing all content if we add a toggle later
create policy "Anyone can view approved marketplace listings"
  on marketplace_listings for select
  using (is_public = true and admin_approved = true);

