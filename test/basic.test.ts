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
