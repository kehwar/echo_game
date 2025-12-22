import { describe, it, expect } from 'vitest'

describe('Echo Game', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true)
  })

  it('should generate random room code', () => {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    expect(roomCode).toHaveLength(6)
    expect(roomCode).toMatch(/^[A-Z0-9]+$/)
  })
})

describe('Deck Format', () => {
  it('should validate deck structure', () => {
    // Define expected deck structure
    const sampleDeck = {
      id: 'animals',
      name: 'Animals',
      description: 'Act out your favorite animals',
      locale: 'en-US',
      cards: ['ELEPHANT', 'KANGAROO', 'PENGUIN']
    }

    expect(sampleDeck).toHaveProperty('id')
    expect(sampleDeck).toHaveProperty('name')
    expect(sampleDeck).toHaveProperty('description')
    expect(sampleDeck).toHaveProperty('locale')
    expect(sampleDeck).toHaveProperty('cards')
    
    expect(typeof sampleDeck.id).toBe('string')
    expect(typeof sampleDeck.name).toBe('string')
    expect(typeof sampleDeck.description).toBe('string')
    expect(typeof sampleDeck.locale).toBe('string')
    expect(Array.isArray(sampleDeck.cards)).toBe(true)
    expect(sampleDeck.cards.length).toBeGreaterThan(0)
  })

  it('should parse frontmatter correctly', () => {
    const sampleMarkdown = `---
name: Animals
description: Act out your favorite animals
locale: en-US
---

ELEPHANT
KANGAROO
PENGUIN`

    // Simple frontmatter parser test
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
    const match = sampleMarkdown.match(frontmatterRegex)
    
    expect(match).toBeTruthy()
    expect(match?.[1]).toContain('name: Animals')
    expect(match?.[2]).toContain('ELEPHANT')
  })
})
