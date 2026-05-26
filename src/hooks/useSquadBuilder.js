import { useState, useCallback } from 'react'

export const SQUAD_SIZE = 11
export const MAX_BY_POS = {
  GK: 1,
  CB: 2,
  LB: 1,
  RB: 1,
  LW: 1,
  RW: 1,
  ST: 1
}

/* Midfield positions share a combined pool of 3 */
export const MID_POOL_POSITIONS = ['CM', 'CDM', 'CAM']
export const MID_POOL_MAX = 3

/**
 * useSquadBuilder — central state machine for the WC 2026 Squad Builder.
 *
 * Phases:
 *   "spinning"  → wheel visible, waiting for spin
 *   "picking"   → PlayerPicker open for currentSpin nation
 *   "formation" → 11 players drafted, show formation view
 *
 * Squad rules:
 *   - 11 players total
 *   - 1 GK · 2 CB · 1 LB · 1 RB · 3 MID (any CM/CDM/CAM) · 1 LW · 1 RW · 1 ST
 *   - No duplicate player names
 */
export default function useSquadBuilder() {
  const [selectedNations, setSelectedNations] = useState([])
  const [currentXI, setCurrentXI] = useState([])   // up to SQUAD_SIZE players
  const [currentSpin, setCurrentSpin] = useState(null)
  const [phase, setPhase] = useState('spinning')

  /* ─── handleSpinResult ─────────────────────────────────────────── */
  const handleSpinResult = useCallback((nation) => {
    setCurrentSpin(nation)
    setPhase('picking')
  }, [])

  /* ─── handlePlayerPick ─────────────────────────────────────────── */
  const handlePlayerPick = useCallback((player) => {
    // Reject duplicate names
    if (currentXI.some(p => p.name === player.name)) return

    const pos = player.position

    // Enforce position caps — shared midfield pool or individual
    if (MID_POOL_POSITIONS.includes(pos)) {
      const midCount = currentXI.filter(p => MID_POOL_POSITIONS.includes(p.position)).length
      if (midCount >= MID_POOL_MAX) return
    } else {
      const posCount = currentXI.filter(p => p.position === pos).length
      if (posCount >= (MAX_BY_POS[pos] ?? 99)) return
    }

    // Embed nation into the player object for reliable flag display
    const playerWithNation = { ...player, nation: currentSpin }

    const nextLength = currentXI.length + 1
    setCurrentXI(prev => [...prev, playerWithNation])

    if (currentSpin) {
      setSelectedNations(prev => [...new Set([...prev, currentSpin])])
    }

    setCurrentSpin(null)
    setPhase(nextLength >= SQUAD_SIZE ? 'formation' : 'spinning')
  }, [currentSpin, currentXI])

  /* ─── skipNation ───────────────────────────────────────────────── */
  /**
   * Used when a nation has no pickable players (all position slots full).
   * Goes back to spinning WITHOUT locking that nation.
   */
  const skipNation = useCallback(() => {
    setCurrentSpin(null)
    setPhase('spinning')
  }, [])

  /* ─── resetGame ────────────────────────────────────────────────── */
  const resetGame = useCallback(() => {
    setSelectedNations([])
    setCurrentXI([])
    setCurrentSpin(null)
    setPhase('spinning')
  }, [])

  return {
    selectedNations,
    currentXI,
    currentSpin,
    phase,
    handleSpinResult,
    handlePlayerPick,
    skipNation,
    resetGame,
  }
}
