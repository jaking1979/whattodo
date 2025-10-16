/**
 * Generate a random user handle
 */
export function generateHandle(): string {
  const adjectives = [
    'happy', 'clever', 'bright', 'swift', 'calm', 'bold', 'wise', 'kind',
    'cool', 'neat', 'quick', 'smooth', 'grand', 'prime', 'fine', 'keen'
  ]
  
  const nouns = [
    'panda', 'tiger', 'eagle', 'wolf', 'fox', 'bear', 'lion', 'hawk',
    'owl', 'shark', 'lynx', 'raven', 'falcon', 'otter', 'seal', 'dolphin'
  ]
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const num = Math.floor(Math.random() * 999)
  
  return `${adj}${noun}${num}`
}

/**
 * Generate a handle from an email address
 */
export function generateHandleFromEmail(email: string): string {
  const username = email.split('@')[0]
  const cleaned = username.replace(/[^a-z0-9]/gi, '').toLowerCase()
  const suffix = Math.floor(Math.random() * 999)
  
  if (cleaned.length >= 3) {
    return `${cleaned}${suffix}`
  }
  
  return generateHandle()
}

