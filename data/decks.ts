import matter from 'gray-matter'

export interface Deck {
  id: string
  name: string
  description: string
  locale: string
  cards: string[]
  extends?: string | string[]
  hidden?: boolean
}

/**
 * Helper function to safely extract string values from frontmatter data
 * @param value - The frontmatter value to convert
 * @returns String value or empty string if not a string
 */
function getStringValue(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

/**
 * Helper function to safely extract boolean values from frontmatter data
 * @param value - The frontmatter value to convert
 * @returns Boolean value or false if not a boolean
 */
function getBooleanValue(value: unknown): boolean {
  return typeof value === 'boolean' ? value : false
}

/**
 * Load decks from markdown files using Vite's import.meta.glob
 * This works at build time and doesn't require Node.js modules in the browser
 */
function loadDecksFromMarkdown(): Deck[] {
  // Use eager import to get the actual content at build time
  const deckFiles = import.meta.glob('/assets/decks/**/*.md', { 
    eager: true,
    query: '?raw',
    import: 'default'
  })
  
  // First pass: Load all decks without resolving extends
  const rawDecks: Map<string, Deck> = new Map()
  const deckIdMap: Map<string, string> = new Map() // Maps both formats to canonical ID
  
  for (const [filePath, fileContent] of Object.entries(deckFiles)) {
    // Parse frontmatter using gray-matter
    const { data, content } = matter(fileContent as string)
    
    // Extract deck ID from file path including locale
    // e.g., /assets/decks/en-US/animals.md -> en-US-animals
    const pathParts = filePath.split('/')
    const locale = pathParts[pathParts.length - 2] // Get locale directory name
    const fileName = pathParts[pathParts.length - 1] // Get filename
    const baseName = fileName?.replace('.md', '') || ''
    const id = `${locale}-${baseName}`
    const altId = `${locale}/${baseName}` // Alternative format for extends
    
    // Parse cards from content (one card per line, filter empty lines and comments)
    const cards = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith('# '))
    
    // Parse extends property
    let extendsValue: string | string[] | undefined
    if (data.extends) {
      extendsValue = data.extends
    }
    
    const deck: Deck = {
      id,
      name: getStringValue(data.name) || baseName,
      description: getStringValue(data.description) || '',
      locale: getStringValue(data.locale) || locale,
      cards,
      extends: extendsValue,
      hidden: getBooleanValue(data.hidden)
    }
    
    rawDecks.set(id, deck)
    // Map both formats to the canonical ID
    deckIdMap.set(id, id)
    deckIdMap.set(altId, id)
  }
  
  // Second pass: Resolve extends and merge cards
  const resolvedDecks: Deck[] = []
  const visitedDecks = new Set<string>()
  
  /**
   * Normalize deck ID to canonical format
   * @param deckId - The ID to normalize (can be locale-name or locale/name)
   * @returns Canonical deck ID or null if not found
   */
  function normalizeDeckId(deckId: string): string | null {
    return deckIdMap.get(deckId) || null
  }
  
  /**
   * Recursively resolve deck extensions and merge cards
   * @param deckId - The ID of the deck to resolve (in canonical format)
   * @param path - Current path for circular dependency detection
   * @returns Array of cards from this deck and all extended decks
   */
  function resolveExtends(deckId: string, path: string[] = []): string[] {
    // Check for circular dependency
    if (path.includes(deckId)) {
      console.warn(`Circular dependency detected: ${path.join(' -> ')} -> ${deckId}`)
      return []
    }
    
    const deck = rawDecks.get(deckId)
    if (!deck) {
      console.warn(`Deck not found: ${deckId}`)
      return []
    }
    
    const newPath = [...path, deckId]
    const allCards: string[] = []
    
    // Resolve extended decks first
    if (deck.extends) {
      const extendsArray = Array.isArray(deck.extends) ? deck.extends : [deck.extends]
      
      for (const extendedDeckId of extendsArray) {
        // Normalize the extended deck ID
        const normalizedId = normalizeDeckId(extendedDeckId)
        if (normalizedId) {
          const extendedCards = resolveExtends(normalizedId, newPath)
          allCards.push(...extendedCards)
        } else {
          console.warn(`Extended deck not found: ${extendedDeckId}`)
        }
      }
    }
    
    // Add this deck's own cards
    allCards.push(...deck.cards)
    
    return allCards
  }
  
  // Process all decks
  for (const [id, deck] of rawDecks.entries()) {
    if (!visitedDecks.has(id)) {
      visitedDecks.add(id)
      
      // Resolve all cards including extended decks
      const allCards = resolveExtends(id)
      
      // Remove duplicates while preserving order
      const uniqueCards = Array.from(new Set(allCards))
      
      resolvedDecks.push({
        id,
        name: deck.name,
        description: deck.description,
        locale: deck.locale,
        cards: uniqueCards,
        extends: deck.extends,
        hidden: deck.hidden
      })
    }
  }
  
  // Sort by ID for consistent ordering
  return resolvedDecks.sort((a, b) => a.id.localeCompare(b.id))
}

export const decks: Deck[] = loadDecksFromMarkdown()
