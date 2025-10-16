'use client'

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="text-6xl mb-4">📡</div>
        <h1 className="text-3xl font-bold">You&apos;re Offline</h1>
        <p className="text-muted-foreground max-w-md">
          You&apos;re currently offline, but you can still access your recently viewed lists.
          Any changes you make will sync when you&apos;re back online.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 h-12 px-6 rounded-xl bg-primary text-white font-bold shadow-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

