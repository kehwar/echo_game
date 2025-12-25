/**
 * Build-time script to parse markdown deck files and generate JSON
 * This runs during the build process to avoid needing gray-matter in the browser
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, relative } from 'path'
import matter from 'gray-matter'

interface CardContent {
  text: string
  subtext?: string
}

type Card = string | CardContent

interface Deck {
  id: string
  name: string
  description: string
  locale: string
  cards: Card[]
  extends?: string | string[]
  hidden?: boolean
}

/**
 * Helper function to safely extract string values from frontmatter data
 */
function getStringValue(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

/**
 * Helper function to safely extract boolean values from frontmatter data
 */
function getBooleanValue(value: unknown): boolean {
  return typeof value === 'boolean' ? value : false
}

/**
 * Recursively find all markdown files in a directory
 */
function findMarkdownFiles(dir: string): string[] {
  const files: string[] = []
  const entries = readdirSync(dir)

  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath))
    } else if (entry.endsWith('.md')) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Parse all markdown deck files and generate decks data
 */
function generateDecks(): Deck[] {
  const decksDir = join(process.cwd(), 'assets', 'decks')
  const markdownFiles = findMarkdownFiles(decksDir)

  // First pass: Load all decks without resolving extends
  const rawDecks: Map<string, Deck> = new Map()
  const deckIdMap: Map<string, string> = new Map()

  for (const filePath of markdownFiles) {
    const fileContent = readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    // Extract deck ID from file path including locale
    const relativePath = relative(decksDir, filePath)
    const pathParts = relativePath.split(/[/\\]/)
    const locale = pathParts[0] // Get locale directory name
    const fileName = pathParts[pathParts.length - 1]
    const baseName = fileName.replace('.md', '')
    const id = `${locale}-${baseName}`
    const altId = `${locale}/${baseName}` // Alternative format for extends

    // Parse cards from content (one card per line, filter empty lines and comments)
    const cards = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith('# '))
      .map(line => {
        // Check if the line contains "//" separator for multiline cards
        if (line.includes('//')) {
          const parts = line.split('//')
          const text = parts[0].trim()
          const subtext = parts.slice(1).join('//').trim()
          // Only return object if subtext is not empty
          return subtext ? { text, subtext } : text
        }
        // Return as simple string for single-line cards
        return line
      })

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
    deckIdMap.set(id, id)
    deckIdMap.set(altId, id)
  }

  // Second pass: Resolve extends and merge cards
  const resolvedDecks: Deck[] = []
  const visitedDecks = new Set<string>()

  /**
   * Normalize deck ID to canonical format
   */
  function normalizeDeckId(deckId: string): string | null {
    return deckIdMap.get(deckId) || null
  }

  /**
   * Recursively resolve deck extensions and merge cards
   */
  function resolveExtends(deckId: string, path: string[] = []): Card[] {
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
    const allCards: Card[] = []

    // Resolve extended decks first
    if (deck.extends) {
      const extendsArray = Array.isArray(deck.extends) ? deck.extends : [deck.extends]

      for (const extendedDeckId of extendsArray) {
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
      // For card objects, we need to stringify to compare
      const uniqueCards: Card[] = []
      const seen = new Set<string>()
      
      for (const card of allCards) {
        const key = typeof card === 'string' ? card : JSON.stringify(card)
        if (!seen.has(key)) {
          seen.add(key)
          uniqueCards.push(card)
        }
      }

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

// Generate and write decks data
const decks = generateDecks()
const outputPath = join(process.cwd(), 'data', 'decks.json')
writeFileSync(outputPath, JSON.stringify(decks, null, 2), 'utf-8')

console.log(`✓ Generated ${decks.length} decks to ${outputPath}`)
