'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Check if already installed or running as standalone app
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://')

    console.log('InstallPrompt: isStandalone =', isStandalone)

    if (isStandalone) {
      // App is already installed, don't show prompt
      console.log('InstallPrompt: App is standalone, not showing')
      return
    }

    // Check if user previously dismissed the prompt
    const dismissed = localStorage.getItem('installPromptDismissed')
    if (dismissed) {
      const dismissedDate = new Date(dismissed)
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
      
      console.log('InstallPrompt: Days since dismissed =', daysSinceDismissed)
      
      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        console.log('InstallPrompt: Recently dismissed, not showing')
        return
      }
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('InstallPrompt: beforeinstallprompt event fired')
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show our custom install prompt
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // For iOS Safari or if beforeinstallprompt hasn't fired yet
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isInStandaloneMode = (window.navigator as any).standalone
    
    console.log('InstallPrompt: isIOS =', isIOS, 'isInStandaloneMode =', isInStandaloneMode)
    
    // Show prompt after a delay if not iOS standalone and not recently dismissed
    if (!isInStandaloneMode && !dismissed) {
      setTimeout(() => {
        console.log('InstallPrompt: Showing prompt after delay')
        setShowPrompt(true)
      }, 3000) // Show after 3 seconds
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // iOS or unsupported browser - just close and show instructions elsewhere
      setShowPrompt(false)
      return
    }

    // Show the install prompt
    deferredPrompt.prompt()
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    }
    
    // Clear the deferredPrompt
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    // Remember that user dismissed
    localStorage.setItem('installPromptDismissed', new Date().toISOString())
    setShowPrompt(false)
  }

  const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent className="sm:max-w-md p-0 gap-0 bg-background rounded-xl">
        <div className="relative">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-primary/10 text-muted-foreground"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="p-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center">
                <svg className="text-primary" height="48" viewBox="0 0 256 256" width="48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M148 64a12 12 0 1 1-12-12a12 12 0 0 1 12 12Zm-12 52a12 12 0 1 0 12 12a12 12 0 0 0-12-12Zm0 64a12 12 0 1 0 12 12a12 12 0 0 0-12-12Zm-80-92v-4a8 8 0 0 1 16 0v4h112v-4a8 8 0 0 1 16 0v4a24 24 0 0 1 24 24v88a24 24 0 0 1-24 24H40a24 24 0 0 1-24-24v-88a24 24 0 0 1 24-24Zm160 24H40v88h160Z" fill="currentColor"></path>
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Install WhatToDo</h2>
              <p className="text-muted-foreground">
                Add WhatToDo to your home screen for quick access and offline use.
              </p>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-left bg-card/30 p-4 rounded-lg">
                <p className="text-sm font-semibold">To install on iOS:</p>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Tap the <strong>Share</strong> button in Safari</li>
                  <li>Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong></li>
                  <li>Tap <strong>&quot;Add&quot;</strong> to confirm</li>
                </ol>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleInstall}
                  className="w-full h-12 rounded-xl bg-primary text-white font-bold shadow-lg hover:bg-primary/90 transition-colors"
                >
                  Install App
                </button>
                <button
                  onClick={handleDismiss}
                  className="w-full h-12 rounded-xl bg-primary/20 dark:bg-primary/30 font-bold hover:bg-primary/30 dark:hover:bg-primary/40 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            )}

            {!isIOS && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-4,48a12,12,0,1,1-12,12A12,12,0,0,1,124,72Zm12,112a16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40a8,8,0,0,1,0,16Z"></path>
                </svg>
                <span>Works offline • Fast app experience • No app store needed</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

