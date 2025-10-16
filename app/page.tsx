import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="text-foreground" height="28" viewBox="0 0 256 256" width="28" xmlns="http://www.w3.org/2000/svg">
              <path d="M148 64a12 12 0 1 1-12-12a12 12 0 0 1 12 12Zm-12 52a12 12 0 1 0 12 12a12 12 0 0 0-12-12Zm0 64a12 12 0 1 0 12 12a12 12 0 0 0-12-12Zm-80-92v-4a8 8 0 0 1 16 0v4h112v-4a8 8 0 0 1 16 0v4a24 24 0 0 1 24 24v88a24 24 0 0 1-24 24H40a24 24 0 0 1-24-24v-88a24 24 0 0 1 24-24Zm160 24H40v88h160Z" fill="currentColor"></path>
            </svg>
            <h1 className="text-2xl font-bold">WhatToDo</h1>
          </div>
          <Link href="/login">
            <button className="h-10 px-4 rounded-lg border border-border hover:bg-card transition-colors font-medium text-sm">
              Sign In
            </button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Your Personal Media Tracker
          </h2>
          <p className="text-xl text-muted-foreground">
            Track movies, books, podcasts, and games you want to watch, read, listen, and play. 
            Share your curated lists with the world.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/login">
              <button className="h-12 px-6 rounded-xl bg-primary text-white font-bold shadow-lg hover:bg-primary/90 transition-colors">
                Get Started
              </button>
            </Link>
            <Link href="/marketplace">
              <button className="h-12 px-6 rounded-xl bg-card border border-border hover:bg-primary/10 font-bold transition-colors">
                Browse Lists
              </button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mt-16 text-left">
            <div className="space-y-2 bg-card/30 p-6 rounded-xl">
              <div className="text-3xl">📚</div>
              <h3 className="font-bold text-lg">Organize Everything</h3>
              <p className="text-sm text-muted-foreground">
                Create lists for movies, books, podcasts, games, and more. Keep track of what you&apos;ve saved, started, and completed.
              </p>
            </div>
            <div className="space-y-2 bg-card/30 p-6 rounded-xl">
              <div className="text-3xl">🌐</div>
              <h3 className="font-bold text-lg">Share & Discover</h3>
              <p className="text-sm text-muted-foreground">
                Make your lists public and share them with friends. Browse curated lists from others in the marketplace.
              </p>
            </div>
            <div className="space-y-2 bg-card/30 p-6 rounded-xl">
              <div className="text-3xl">📱</div>
              <h3 className="font-bold text-lg">Works Offline</h3>
              <p className="text-sm text-muted-foreground">
                Install as a PWA on your phone or desktop. Access your lists even when you&apos;re offline.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>WhatToDo - Track, organize, and share what matters to you.</p>
        </div>
      </footer>
    </div>
  );
}
