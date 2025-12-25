/**
 * Deck data loaded from pre-generated JSON
 * The JSON is generated at build time by scripts/generate-decks.ts
 */
import decksData from './decks.json'

export interface CardContent {
  text: string
  subtext?: string
}

export type Card = string | CardContent

export interface Deck {
  id: string
  name: string
  description: string
  locale: string
  cards: Card[]
  extends?: string | string[]
  hidden?: boolean
}

export const decks: Deck[] = decksData
