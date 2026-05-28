import { useState, useCallback } from 'react'

/* ─── WC constants ──────────────────────────────────────────────── */
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

/* ─── IPL constants ─────────────────────────────────────────────── */
/** WK + BAT combined pool max (no separate cap per role) */
export const IPL_BAT_WK_POOL_MAX = 6

/** Maximum Bowlers allowed in the IPL XI */
export const IPL_BWL_MAX = 5

/** Max players that can be picked from the same IPL franchise */
export const IPL_MAX_PER_TEAM = 2

/** Max overseas (non-Indian) players allowed in an IPL XI */
export const IPL_MAX_OVERSEAS = 4

/**
 * useSquadBuilder — central state machine for WC 2026 and IPL Squad Builder.
 *
 * @param {'wc'|'ipl'} mode
 *
 * Phases:
 *   "spinning"  → wheel visible, waiting for spin
 *   "picking"   → PlayerPicker open for currentSpin nation / team
 *   "formation" → 11 players drafted, show formation/review view
 *
 * WC rules:  1 GK · 2 CB · 1 LB · 1 RB · 3 MID (CM/CDM/CAM) · 1 LW · 1 RW · 1 ST
 * IPL rules: max 2 WK · max 5 BAT · max 3 AR · max 5 BWL  (min enforced as warning)
 * Both modes: no duplicate player names, 11 total
 */
export default function useSquadBuilder(mode = 'wc') {
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

    if (mode === 'ipl') {
      /* ── WK+BAT combined pool cap (max 6) ───────────────────── */
      if (player.role === 'WK' || player.role === 'BAT') {
        const batWkCount = currentXI.filter(p => p.role === 'WK' || p.role === 'BAT').length
        if (batWkCount >= IPL_BAT_WK_POOL_MAX) return
      }

      /* ── BWL cap (max 5) ─────────────────────────────────── */
      if (player.role === 'BWL') {
        const bwlCount = currentXI.filter(p => p.role === 'BWL').length
        if (bwlCount >= IPL_BWL_MAX) return
      }
      /* AR: no cap */

      /* ── Team cap: max 2 per franchise ───────────────────────── */
      const teamCount = currentXI.filter(p => p.team === currentSpin).length
      if (teamCount >= IPL_MAX_PER_TEAM) return

      /* ── Overseas cap: max 4 non-Indian ──────────────────────── */
      const isOverseas = player.nationality !== 'Indian'
      if (isOverseas) {
        const overseasCount = currentXI.filter(p => p.nationality !== 'Indian').length
        if (overseasCount >= IPL_MAX_OVERSEAS) return
      }

      const playerWithTeam = { ...player, team: currentSpin }
      const nextLength = currentXI.length + 1
      setCurrentXI(prev => [...prev, playerWithTeam])

      /* Exclude team from wheel once the cap is reached */
      if (currentSpin && teamCount + 1 >= IPL_MAX_PER_TEAM) {
        setSelectedNations(prev => [...new Set([...prev, currentSpin])])
      }

      setCurrentSpin(null)
      setPhase(nextLength >= SQUAD_SIZE ? 'formation' : 'spinning')

    } else {
      /* ── WC: enforce position caps (existing logic) ──────────── */
      const pos = player.position

      if (MID_POOL_POSITIONS.includes(pos)) {
        const midCount = currentXI.filter(p => MID_POOL_POSITIONS.includes(p.position)).length
        if (midCount >= MID_POOL_MAX) return
      } else {
        const posCount = currentXI.filter(p => p.position === pos).length
        if (posCount >= (MAX_BY_POS[pos] ?? 99)) return
      }

      // Embed nation for reliable flag display
      const playerWithNation = { ...player, nation: currentSpin }
      const nextLength = currentXI.length + 1
      setCurrentXI(prev => [...prev, playerWithNation])

      if (currentSpin) {
        // WC: lock out the nation once a player has been picked from it
        setSelectedNations(prev => [...new Set([...prev, currentSpin])])
      }

      setCurrentSpin(null)
      setPhase(nextLength >= SQUAD_SIZE ? 'formation' : 'spinning')
    }
  }, [currentSpin, currentXI, mode])

  /* ─── skipNation ───────────────────────────────────────────────── */
  /**
   * Used when a team has no pickable players (all slots full or already picked).
   * Goes back to spinning WITHOUT locking that nation/team.
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
