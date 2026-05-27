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
/** Maximum players allowed per role in the IPL XI */
export const IPL_MAX_BY_ROLE = {
  WK:  2,
  BAT: 5,
  AR:  3,
  BWL: 5,
}

/** Minimum players required per role for a balanced IPL XI */
export const IPL_MIN_BY_ROLE = {
  WK:  1,
  BAT: 3,
  AR:  1,
  BWL: 3,
}

/**
 * Checks if a completed 11-player IPL XI meets the minimum role requirements.
 * @param {object[]} xi  - Array of picked player objects (each has .role)
 * @returns {string|null} Warning message, or null if XI is balanced
 */
export function computeIPLBalance(xi) {
  if (xi.length < SQUAD_SIZE) return null   // not yet complete, no warn yet

  const counts = { WK: 0, BAT: 0, AR: 0, BWL: 0 }
  xi.forEach(p => {
    if (p.role && counts[p.role] !== undefined) counts[p.role]++
  })

  const missing = []
  if (counts.WK  < IPL_MIN_BY_ROLE.WK)  missing.push(`min ${IPL_MIN_BY_ROLE.WK} WK`)
  if (counts.BAT < IPL_MIN_BY_ROLE.BAT) missing.push(`min ${IPL_MIN_BY_ROLE.BAT} BAT`)
  if (counts.AR  < IPL_MIN_BY_ROLE.AR)  missing.push(`min ${IPL_MIN_BY_ROLE.AR} AR`)
  if (counts.BWL < IPL_MIN_BY_ROLE.BWL) missing.push(`min ${IPL_MIN_BY_ROLE.BWL} BWL`)

  return missing.length
    ? `Unbalanced XI — needs: ${missing.join(' · ')}`
    : null
}

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
      /* ── IPL: enforce per-role max caps ──────────────────────── */
      const role = player.role
      const roleCount = currentXI.filter(p => p.role === role).length
      if (roleCount >= (IPL_MAX_BY_ROLE[role] ?? 99)) return

      // Embed the team name for display purposes
      const playerWithTeam = { ...player, team: currentSpin }
      const nextLength = currentXI.length + 1
      setCurrentXI(prev => [...prev, playerWithTeam])
      // IPL mode: wheel keeps all teams (no exclusion after pick)
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
