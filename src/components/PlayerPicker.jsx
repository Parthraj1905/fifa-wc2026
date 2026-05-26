import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import squads from '../data/squads'
import { MAX_BY_POS, MID_POOL_POSITIONS, MID_POOL_MAX } from '../hooks/useSquadBuilder'

/* ─── Position metadata ─────────────────────────────────────────── */
const POSITIONS = ['GK', 'CB', 'LB', 'RB', 'CM', 'CDM', 'CAM', 'ST', 'RW', 'LW']

const POS_META = {
  GK: { label: 'Goalkeepers', short: 'GK', color: '#FF0000', bg: 'rgba(245,158,11,0.14)' },
  CB: { label: 'CenterBack', short: 'CB', color: '#FFA500', bg: 'rgba(59,130,246,0.14)' },
  LB: { label: 'LeftBack', short: 'LB', color: '#FFFF00', bg: 'rgba(16,185,129,0.14)' },
  RB: { label: 'RightBack', short: 'RB', color: '#FFFF00', bg: 'rgba(16,185,129,0.14)' },
  CM: { label: 'CenterMid', short: 'CM', color: '#008000', bg: 'rgba(16,185,129,0.14)' },
  CDM: { label: 'CenterDefensiveMid', short: 'CDM', color: '#008000', bg: 'rgba(16,185,129,0.14)' },
  CAM: { label: 'CenterAttackingMid', short: 'CAM', color: '#00FFFF', bg: 'rgba(16,185,129,0.14)' },
  LW: { label: 'LeftWing', short: 'LW', color: '#f7198eff', bg: 'rgba(236,72,153,0.14)' },
  RW: { label: 'RightWing', short: 'RW', color: '#f7198eff', bg: 'rgba(236,72,153,0.14)' },
  ST: { label: 'Striker', short: 'ST', color: '#FFFFFF', bg: 'rgba(236,72,153,0.14)' },
}

const FLAGS = {
  Brazil: '🇧🇷', Spain: '🇪🇸', France: '🇫🇷',
  Argentina: '🇦🇷', England: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', Colombia: '🇨🇴',
  Germany: '🇩🇪', USA: '🇺🇸', Croatia: '🇭🇷',
  Portugal: '🇵🇹',
}

/** Check if a position slot is full given current squad */
function isPositionFull(pos, posCounts, midPoolCount) {
  if (MID_POOL_POSITIONS.includes(pos)) {
    return midPoolCount >= MID_POOL_MAX
  }
  return (posCounts[pos] ?? 0) >= (MAX_BY_POS[pos] ?? 99)
}

/** Get count/max for a position (respecting mid pool) */
function getPosQuota(pos, posCounts, midPoolCount) {
  if (MID_POOL_POSITIONS.includes(pos)) {
    return { count: midPoolCount, max: MID_POOL_MAX }
  }
  return { count: posCounts[pos] ?? 0, max: MAX_BY_POS[pos] ?? 1 }
}

/**
 * PlayerPicker
 *
 * @param {string}   nation     - Nation key from squads.js
 * @param {string}   position   - Position group to auto-scroll to on open
 * @param {object[]} currentXI  - Full current squad for dedup + position-cap filtering
 * @param {Function} onSelect   - Called with player object on card click (no close needed)
 * @param {Function} onSkip     - Optional: shown only if ALL players from this nation are
 *                                unavailable so the user isn't stuck
 */
export default function PlayerPicker({ nation, position, currentXI = [], onSelect, onSkip }) {
  const sectionRefs = useRef({})

  /* ── Build available player list ─────────────────────────────── */
  const pickedNames = new Set(currentXI.map(p => p.name))

  // Count current positions so we can cap display
  const posCounts = {}
  currentXI.forEach(p => { posCounts[p.position] = (posCounts[p.position] ?? 0) + 1 })
  const midPoolCount = currentXI.filter(p => MID_POOL_POSITIONS.includes(p.position)).length

  // Filter: not already picked + position cap not reached (respecting mid pool)
  const allAvailable = (squads[nation] ?? []).filter(p =>
    !pickedNames.has(p.name) &&
    !isPositionFull(p.position, posCounts, midPoolCount)
  )

  // Group by position (only positions that have available players)
  const grouped = POSITIONS.reduce((acc, pos) => {
    acc[pos] = allAvailable.filter(p => p.position === pos)
    return acc
  }, {})

  const hasAnyPlayer = allAvailable.length > 0

  /* ── Lock body scroll ────────────────────────────────────────── */
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  /* ── Auto-scroll to position group ──────────────────────────── */
  useEffect(() => {
    if (!position || !sectionRefs.current[position]) return
    const id = setTimeout(() => {
      sectionRefs.current[position]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 280)
    return () => clearTimeout(id)
  }, [position])

  /* ── NO Escape / backdrop close — user must pick ─────────────── */

  const handleSelect = (player) => { onSelect?.(player) }

  return (
    <AnimatePresence>
      {/* Backdrop — non-interactive (no onClose) */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        role="presentation"
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.78)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      />

      {/* Modal panel */}
      <motion.div
        key="modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Pick a player from ${nation}`}
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 101,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '12px',
          pointerEvents: 'none',
        }}
      >
        <div
          className="picker-modal"
          style={{
            pointerEvents: 'all',
            width: '100%', maxWidth: '640px', maxHeight: '90vh',
            display: 'flex', flexDirection: 'column',
            background: '#111111',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
            overflow: 'hidden',
          }}
        >
          {/* ── Header ─────────────────────────────────────────── */}
          <div className="picker-header" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 18px 12px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            flexShrink: 0,
            flexWrap: 'wrap',
            gap: '10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px', lineHeight: 1 }}>{FLAGS[nation] ?? '🌍'}</span>
              <div>
                <h2 style={{
                  margin: 0, fontSize: '18px', fontWeight: 800,
                  color: '#f5f5f5', fontFamily: 'Outfit, Inter, sans-serif',
                  letterSpacing: '-0.02em',
                }}>
                  {nation}
                </h2>
                <p style={{
                  margin: '2px 0 0',
                  fontSize: '11px', color: 'rgba(255,255,255,0.35)',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {allAvailable.length} available · pick one
                </p>
              </div>
            </div>

            {/* Position tab pills (horizontally scrollable) */}
            <div className="picker-pills" style={{
              display: 'flex', gap: '4px', alignItems: 'center',
              overflowX: 'auto', maxWidth: '100%',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none',
              flexShrink: 0,
            }}>
              {POSITIONS.map(pos => {
                const meta = POS_META[pos]
                const { count, max } = getPosQuota(pos, posCounts, midPoolCount)
                const maxed = count >= max
                const isActive = pos === position
                return (
                  <button
                    key={pos}
                    onClick={() => sectionRefs.current[pos]?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    title={maxed ? `${pos} limit reached (${count}/${max})` : `${count}/${max}`}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '999px',
                      border: `1px solid ${maxed ? 'rgba(255,255,255,0.08)' : isActive ? meta.color : 'rgba(255,255,255,0.1)'}`,
                      background: maxed ? 'rgba(255,255,255,0.03)' : isActive ? meta.bg : 'transparent',
                      color: maxed ? 'rgba(255,255,255,0.2)' : isActive ? meta.color : 'rgba(255,255,255,0.4)',
                      fontSize: '9px', fontWeight: 700, cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif', letterSpacing: '0.04em',
                      transition: 'all 0.18s',
                      position: 'relative',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {meta.short}
                    {/* Count badge */}
                    <span style={{
                      marginLeft: '3px',
                      fontSize: '8px',
                      opacity: 0.6,
                    }}>
                      {count}/{max}
                    </span>
                    {/* "Full" strikethrough line */}
                    {maxed && (
                      <span style={{
                        position: 'absolute', top: '50%', left: '4px', right: '4px',
                        height: '1px', background: 'rgba(255,255,255,0.2)',
                        transform: 'translateY(-50%)',
                      }} />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Position quota bar ───────────────────────────────── */}
          <div className="picker-quota-bar" style={{
            display: 'flex',
            gap: 0,
            flexShrink: 0,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            flexWrap: 'wrap',
          }}>
            {POSITIONS.map(pos => {
              const meta = POS_META[pos]
              const { count, max } = getPosQuota(pos, posCounts, midPoolCount)
              const pct = Math.min((count / max) * 100, 100)
              const full = count >= max
              return (
                <div key={pos} style={{
                  flex: '1 1 auto',
                  minWidth: '44px',
                  padding: '6px 8px',
                  borderRight: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '8px', fontWeight: 700, color: full ? meta.color : 'rgba(255,255,255,0.35)', fontFamily: 'Inter', letterSpacing: '0.06em' }}>
                      {meta.short}
                    </span>
                    <span style={{ fontSize: '8px', fontWeight: 600, color: full ? meta.color : 'rgba(255,255,255,0.25)', fontFamily: 'Inter' }}>
                      {count}/{max}
                    </span>
                  </div>
                  <div style={{ height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: full ? meta.color : `${meta.color}88`,
                      borderRadius: '2px',
                      transition: 'width 0.4s ease',
                    }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Player list OR empty state ───────────────────────── */}
          {!hasAnyPlayer ? (
            /* All positions maxed or all players already picked for this nation */
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '12px', padding: '40px 24px', textAlign: 'center',
            }}>
              <span style={{ fontSize: '40px' }}>🚫</span>
              <p style={{
                color: 'rgba(255,255,255,0.5)', fontSize: '14px',
                fontFamily: 'Inter, sans-serif', margin: 0, lineHeight: 1.6,
              }}>
                No available players from <strong style={{ color: '#f5f5f5' }}>{nation}</strong>.
                <br />All eligible position slots are full.
              </p>
              {onSkip && (
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={onSkip}
                  style={{
                    marginTop: '8px', padding: '11px 28px',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '999px',
                    color: '#f5f5f5', fontSize: '13px', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  }}
                >
                  ↺ Skip &amp; Spin Again
                </motion.button>
              )}
            </div>
          ) : (
            /* Scrollable player list */
            <div
              style={{
                overflowY: 'auto', flex: 1,
                padding: '16px 16px 24px',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255,255,255,0.1) transparent',
              }}
            >
              {POSITIONS.map((pos, groupIdx) => {
                const players = grouped[pos]
                if (!players?.length) return null
                const meta = POS_META[pos]

                return (
                  <section
                    key={pos}
                    ref={el => { sectionRefs.current[pos] = el }}
                    style={{ marginBottom: groupIdx < POSITIONS.length - 1 ? '26px' : 0 }}
                  >
                    {/* Group header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center',
                        padding: '3px 10px',
                        background: meta.bg,
                        border: `1px solid ${meta.color}38`,
                        borderRadius: '999px',
                        color: meta.color,
                        fontSize: '11px', fontWeight: 700,
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        fontFamily: 'Inter, sans-serif',
                      }}>
                        {meta.short}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif' }}>
                        {meta.label}
                      </span>
                      <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'rgba(255,255,255,0.2)', fontFamily: 'Inter, sans-serif' }}>
                        {players.length}
                      </span>
                    </div>

                    {/* Player cards */}
                    <div className="player-card-grid" style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                      gap: '10px',
                    }}>
                      {players.map((player, cardIdx) => (
                        <PlayerCard
                          key={`${player.name}-${player.number}`}
                          player={player}
                          meta={meta}
                          onSelect={handleSelect}
                          delayIdx={cardIdx}
                        />
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ─── PlayerCard ─────────────────────────────────────────────────── */
function PlayerCard({ player, meta, onSelect, delayIdx }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: Math.min(delayIdx * 0.03, 0.25) }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(player)}
      aria-label={`Select ${player.name}`}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        gap: '6px', padding: '12px 12px 10px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px',
        cursor: 'pointer', textAlign: 'left', width: '100%',
        transition: 'border-color 0.18s, background 0.18s, box-shadow 0.18s',
        position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${meta.color}50`
        e.currentTarget.style.background = `${meta.bg}`
        e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px ${meta.color}30`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Jersey number watermark */}
      <span style={{
        position: 'absolute', top: '8px', right: '10px',
        fontSize: '20px', fontWeight: 900,
        color: `${meta.color}18`,
        fontFamily: 'Outfit, Inter, sans-serif',
        lineHeight: 1, letterSpacing: '-0.04em', userSelect: 'none',
      }}>
        {player.number}
      </span>

      {/* Position badge */}
      <span style={{
        display: 'inline-flex', alignItems: 'center',
        padding: '2px 8px',
        background: meta.bg, border: `1px solid ${meta.color}35`,
        borderRadius: '999px', color: meta.color,
        fontSize: '10px', fontWeight: 700, letterSpacing: '0.07em',
        fontFamily: 'Inter, sans-serif',
      }}>
        {meta.short}
      </span>

      {/* Name */}
      <span style={{
        fontSize: '12px', fontWeight: 700, color: '#f0f0f0',
        fontFamily: 'Inter, sans-serif', lineHeight: 1.3, paddingRight: '24px',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        maxWidth: '100%',
      }}>
        {player.name}
      </span>

      {/* Club */}
      <span style={{
        fontSize: '10px', color: 'rgba(255,255,255,0.35)',
        fontFamily: 'Inter, sans-serif', fontWeight: 500,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        maxWidth: '100%',
      }}>
        {player.club}
      </span>
    </motion.button>
  )
}
