# WhatToDo PWA

A Progressive Web App for tracking and organizing movies, books, podcasts, games, and more. Built with Next.js, Supabase, and TypeScript with a beautiful teal-themed design.

## Features

- 📚 **Organize Everything** - Create lists for movies, books, podcasts, games, and more
- 🌐 **Share & Discover** - Make lists public and browse curated lists from others
- 📱 **PWA Support** - Install on mobile and desktop, works offline
- 🔐 **Private by Default** - Your data is private unless you explicitly share
- ⚡ **Fast & Modern** - Built with Next.js 15 App Router
- 🔄 **Real-time Sync** - Offline edits sync when you're back online
- 🎨 **Beautiful Design** - Custom teal color scheme with dark mode

## Design System

- **Primary Color**: #18b9a9 (Teal)
- **Font**: Inter
- **Dark Mode**: Enabled by default with `#11211f` background
- **Light Mode**: `#f6f8f8` background
- **Card Surfaces**: Subtle backgrounds with soft shadows
- **Responsive**: Mobile-first with bottom navigation

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **PWA**: Service Workers, IndexedDB (Dexie.js), Background Sync
- **External APIs**: TMDb (movies/TV), Open Library (books), iTunes (podcasts), RAWG (games)
- **OG Images**: @vercel/og for social sharing

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- API keys for external services (optional):
  - TMDb API key
  - RAWG API key

### 1. Clone and Install

```bash
git clone https://github.com/jaking1979/whattodo.git
cd whattodo
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional (for metadata lookups)
TMDB_API_KEY=your_tmdb_key
RAWG_API_KEY=your_rawg_key
```

### 3. Set Up Database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the migration files in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`

See `supabase/MIGRATIONS.md` for detailed instructions.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
whattodo/
├── app/                    # Next.js App Router
│   ├── app/               # Authenticated app routes
│   │   ├── lists/        # List management
│   │   ├── inbox/        # Quick capture
│   │   ├── activity/     # Completed items
│   │   └── settings/     # User settings
│   ├── marketplace/      # Public marketplace
│   ├── u/[handle]/       # Public user/list pages
│   ├── api/              # API routes
│   └── auth/             # Auth callback
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utilities and helpers
│   ├── supabase/         # Supabase clients
│   ├── api/              # External API integrations
│   ├── validations/      # Zod schemas
│   ├── offline/          # PWA/offline support
│   └── utils/            # Helper functions
├── supabase/
│   └── migrations/       # Database migrations
├── public/               # Static files
│   ├── manifest.json     # PWA manifest
│   └── sw.js            # Service worker
└── types/                # TypeScript types
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Environment Variables on Vercel

Add these in **Project Settings → Environment Variables**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL` (your Vercel URL)
- `TMDB_API_KEY` (optional)
- `RAWG_API_KEY` (optional)

## Key Features

### Authentication

- Email magic link authentication
- Automatic profile creation on first sign-in
- Row-Level Security (RLS) enforced at database level

### Lists

- Create unlimited lists
- Private, unlisted, or public visibility
- Organize with tags and groups
- Track item status (saved/started/done)

### Items

- Movies, TV shows, books, podcasts, games
- Auto-fetch metadata from external APIs
- Add notes and custom tags
- Track completion dates

### Marketplace

- Publish lists to marketplace
- Like and save favorite lists
- Remix (clone) others' lists
- Simple search and filtering

### PWA/Offline

- Installable on mobile and desktop
- Offline access to recent data
- Background sync for edits
- Cache-first strategy for speed

## API Routes

- `GET /api/lookup` - Search external APIs for media metadata
- `POST /api/lookup` - Parse URLs and fetch metadata
- `GET /api/export` - Export user data as JSON
- `POST /api/marketplace/publish` - Publish list to marketplace
- `GET /api/marketplace/search` - Search marketplace listings
- `POST /api/marketplace/like` - Like/unlike a listing
- `POST /api/marketplace/save` - Save/unsave a listing

## Server Actions

Located in `app/actions/`:

- `lists.ts` - List CRUD operations
- `items.ts` - Item CRUD operations
- `profile.ts` - Profile management

## Contributing

Contributions are welcome! Please open an issue or PR.

## License

MIT

## Support

For issues or questions, please open a GitHub issue.

---

Built with ❤️ using Next.js and Supabase
