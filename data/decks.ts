export interface Deck {
  id: string
  name: string
  description: string
  locale: string
  cards: string[]
}

/**
 * Simple frontmatter parser that doesn't require gray-matter
 * Parses YAML frontmatter between --- markers
 */
function parseFrontmatter(content: string): { data: Record<string, string>, content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)
  
  if (!match) {
    return { data: {}, content }
  }
  
  const [, frontmatter, body] = match
  const data: Record<string, string> = {}
  
  // Parse simple YAML key-value pairs
  frontmatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim()
      const value = line.substring(colonIndex + 1).trim()
      data[key] = value
    }
  })
  
  return { data, content: body }
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
  
  const decks: Deck[] = []
  
  for (const [filePath, fileContent] of Object.entries(deckFiles)) {
    // Parse frontmatter
    const { data, content } = parseFrontmatter(fileContent as string)
    
    // Extract deck ID from filename
    const fileName = filePath.split('/').pop()
    const id = fileName?.replace('.md', '') || ''
    
    // Parse cards from content (one card per line, filter empty lines)
    const cards = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
    
    decks.push({
      id,
      name: data.name || id,
      description: data.description || '',
      locale: data.locale || 'en-US',
      cards
    })
  }
  
  // Sort by ID for consistent ordering
  return decks.sort((a, b) => a.id.localeCompare(b.id))
}

export const decks: Deck[] = loadDecksFromMarkdown()
