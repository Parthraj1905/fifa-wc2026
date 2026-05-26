import { useState, useCallback } from 'react'

export const SQUAD_SIZE = 15
export const MAX_BY_POS = { GK: 2, DEF: 5, MID: 5, FWD: 3 }

/**
 * useSquadBuilder — central state machine for the WC 2026 Squad Builder.
 *
 * Phases:
 *   "spinning"  → wheel visible, waiting for spin
 *   "picking"   → PlayerPicker open for currentSpin nation
 *   "formation" → 15 players drafted, show formation view
 *
 * Squad rules:
 *   - 15 players total
 *   - Max 2 GK · Max 5 DEF · Max 5 MID · Max 3 FWD
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

    // Enforce position caps
    const posCount = currentXI.filter(p => p.position === player.position).length
    if (posCount >= (MAX_BY_POS[player.position] ?? 99)) return

    const nextLength = currentXI.length + 1
    setCurrentXI(prev => [...prev, player])

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
