import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import squadsWC from '../data/squads'
import { MAX_BY_POS, MID_POOL_POSITIONS, MID_POOL_MAX, IPL_BAT_WK_POOL_MAX, IPL_BWL_MAX, IPL_MAX_PER_TEAM, IPL_MAX_OVERSEAS } from '../hooks/useSquadBuilder'

/* ─── WC: Position metadata ─────────────────────────────────────── */
const WC_POSITIONS = ['GK', 'CB', 'LB', 'RB', 'CM', 'CDM', 'CAM', 'LW', 'RW', 'ST']

const WC_POS_META = {
  GK: { label: 'Goalkeepers', short: 'GK', color: '#FF0000', bg: 'rgba(245,158,11,0.14)' },
  CB: { label: 'Center Back', short: 'CB', color: '#FFA500', bg: 'rgba(59,130,246,0.14)' },
  LB: { label: 'Left Back', short: 'LB', color: '#FFFF00', bg: 'rgba(16,185,129,0.14)' },
  RB: { label: 'Right Back', short: 'RB', color: '#FFFF00', bg: 'rgba(16,185,129,0.14)' },
  CM: { label: 'Center Mid', short: 'CM', color: '#008000', bg: 'rgba(16,185,129,0.14)' },
  CDM: { label: 'Defensive Mid', short: 'CDM', color: '#008000', bg: 'rgba(16,185,129,0.14)' },
  CAM: { label: 'Attacking Mid', short: 'CAM', color: '#00FFFF', bg: 'rgba(16,185,129,0.14)' },
  LW: { label: 'Left Wing', short: 'LW', color: '#f7198eff', bg: 'rgba(236,72,153,0.14)' },
  RW: { label: 'Right Wing', short: 'RW', color: '#f7198eff', bg: 'rgba(236,72,153,0.14)' },
  ST: { label: 'Striker', short: 'ST', color: '#FFFFFF', bg: 'rgba(236,72,153,0.14)' },
}

/* ─── IPL: Role metadata ─────────────────────────────────────────── */
const IPL_ROLES = ['WK', 'BAT', 'AR', 'BWL']

const IPL_ROLE_META = {
  WK: { label: 'Wicket Keepers', short: 'WK', color: '#f59e0b', bg: 'rgba(245,158,11,0.14)' },
  BAT: { label: 'Batters', short: 'BAT', color: '#3b82f6', bg: 'rgba(59,130,246,0.14)' },
  AR: { label: 'All-Rounders', short: 'AR', color: '#10b981', bg: 'rgba(16,185,129,0.14)' },
  BWL: { label: 'Bowlers', short: 'BWL', color: '#ec4899', bg: 'rgba(236,72,153,0.14)' },
}

/* ─── WC flag map ─────────────────────────────────────────────────── */
const FLAGS = {
  Brazil: '🇧🇷', Spain: '🇪🇸', France: '🇫🇷',
  Argentina: '🇦🇷', England: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', Colombia: '🇨🇴',
  Germany: '🇩🇪', USA: '🇺🇸', Croatia: '🇭🇷',
  Portugal: '🇵🇹', Belgium: '🇧🇪', Turkey: '🇹🇷',
}

/* ─── IPL team icons ──────────────────────────────────────────────── */
const IPL_ICONS = {
  'Mumbai Indians': '🔵',
  'Chennai Super Kings': '🟡',
  'Royal Challengers Bengaluru': '🔴',
  'Kolkata Knight Riders': '🟣',
  'Rajasthan Royals': '🩷',
  'Punjab Kings': '🔴',
  'Delhi Capitals': '💠',
  'Sunrisers Hyderabad': '🟠',
  'Gujarat Titans': '🔷',
  'Lucknow Super Giants': '🩵',
}

/* ─── WC helpers ─────────────────────────────────────────────────── */
function isPositionFull(pos, posCounts, midPoolCount) {
  if (MID_POOL_POSITIONS.includes(pos)) return midPoolCount >= MID_POOL_MAX
  return (posCounts[pos] ?? 0) >= (MAX_BY_POS[pos] ?? 99)
}

function getWCPosQuota(pos, posCounts, midPoolCount) {
  if (MID_POOL_POSITIONS.includes(pos)) return { count: midPoolCount, max: MID_POOL_MAX }
  return { count: posCounts[pos] ?? 0, max: MAX_BY_POS[pos] ?? 1 }
}

/**
 * PlayerPicker
 *
 * @param {string}    nation      - Nation/team key
 * @param {string}    position    - WC: position group to auto-scroll to on open
 * @param {object[]}  currentXI   - Current squad for dedup + cap filtering
 * @param {Function}  onSelect    - Called with player object on card click
 * @param {Function}  onSkip      - Shown when no players are available
 * @param {'wc'|'ipl'} mode       - Which sport mode
 * @param {object}    squadsData  - Dataset override (default = WC squads import)
 */
export default function PlayerPicker({
  nation,
  position,
  currentXI = [],
  onSelect,
  onSkip,
  mode = 'wc',
  squadsData,
}) {
  const isIPL = mode === 'ipl'
  const dataSource = squadsData ?? squadsWC

  const GROUPS = isIPL ? IPL_ROLES : WC_POSITIONS
  const META_MAP = isIPL ? IPL_ROLE_META : WC_POS_META

  const sectionRefs = useRef({})
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 180)
    return () => clearTimeout(timer)
  }, [])

  /* ── Build available player list ─────────────────────────────── */
  const pickedNames = new Set(currentXI.map(p => p.name))

  let allAvailable
  let posCounts = {}
  let midPoolCount = 0
  let teamPickedCount = 0
  let overseasCount = 0
  let isTeamFull = false
  let isOverseasFull = false

  if (isIPL) {
    /* IPL: pool cap for WK+BAT, individual cap for BWL, no cap for AR */
    const batWkCount = currentXI.filter(p => p.role === 'WK' || p.role === 'BAT').length
    const bwlCount = currentXI.filter(p => p.role === 'BWL').length
    const isBatWkFull = batWkCount >= IPL_BAT_WK_POOL_MAX
    const isBwlFull = bwlCount >= IPL_BWL_MAX

    teamPickedCount = currentXI.filter(p => p.role !== 'DUMMY' && p.team === nation).length
    overseasCount = currentXI.filter(p => p.role !== 'DUMMY' && p.nationality !== 'Indian').length
    isTeamFull = teamPickedCount >= IPL_MAX_PER_TEAM
    isOverseasFull = overseasCount >= IPL_MAX_OVERSEAS

    allAvailable = (dataSource[nation] ?? []).filter(p => {
      if (pickedNames.has(p.name)) return false
      if (isTeamFull) return false
      if (isOverseasFull && p.nationality !== 'Indian') return false
      if ((p.role === 'WK' || p.role === 'BAT') && isBatWkFull) return false
      if (p.role === 'BWL' && isBwlFull) return false
      return true
    })
  } else {
    /* WC: filter by position caps */
    currentXI.forEach(p => { posCounts[p.position] = (posCounts[p.position] ?? 0) + 1 })
    midPoolCount = currentXI.filter(p => MID_POOL_POSITIONS.includes(p.position)).length

    allAvailable = (dataSource[nation] ?? []).filter(p =>
      !pickedNames.has(p.name) &&
      !isPositionFull(p.position, posCounts, midPoolCount)
    )
  }

  /* Group by role (IPL) or position (WC) */
  const getGroup = (p) => isIPL ? p.role : p.position
  const grouped = GROUPS.reduce((acc, g) => {
    acc[g] = allAvailable.filter(p => getGroup(p) === g)
    return acc
  }, {})

  const hasAnyPlayer = allAvailable.length > 0

  /* Quota helpers */
  const getQuota = (group) => {
    if (isIPL) {
      /* WK and BAT share the combined pool */
      if (group === 'WK' || group === 'BAT') {
        const cnt = currentXI.filter(p => p.role === 'WK' || p.role === 'BAT').length
        return { count: cnt, max: IPL_BAT_WK_POOL_MAX }
      }
      if (group === 'BWL') {
        return { count: currentXI.filter(p => p.role === 'BWL').length, max: IPL_BWL_MAX }
      }
      /* AR: no hard cap, just informational */
      return { count: currentXI.filter(p => p.role === 'AR').length, max: 11 }
    }
    return getWCPosQuota(group, posCounts, midPoolCount)
  }

  /* ── Lock body scroll ────────────────────────────────────────── */
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  /* ── Auto-scroll to position/role group ──────────────────────── */
  useEffect(() => {
    if (!position || !sectionRefs.current[position]) return
    const id = setTimeout(() => {
      sectionRefs.current[position]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 280)
    return () => clearTimeout(id)
  }, [position])

  const handleSelect = (player) => { onSelect?.(player) }

  /* ── Header icon ─────────────────────────────────────────────── */
  const headerIcon = isIPL ? (IPL_ICONS[nation] ?? '🏏') : (FLAGS[nation] ?? '🌍')

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        role="presentation"
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(5, 5, 5, 0.94)',
        }}
      />

      {/* Modal panel */}
      <motion.div
        key="modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Pick a player from ${nation}`}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.99 }}
        transition={{ duration: 0.15 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 101,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '12px',
          pointerEvents: 'none',
          willChange: 'transform',
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
              <span style={{ fontSize: '28px', lineHeight: 1 }}>{headerIcon}</span>
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
                  {isIPL && <span style={{ color: 'rgba(245,158,11,0.6)', marginLeft: '6px' }}>🏏 IPL</span>}
                  {isIPL && isTeamFull && (
                    <span style={{ color: '#ef4444', marginLeft: '6px', fontWeight: 700 }}>· Team Full (2/2)</span>
                  )}
                  {isIPL && isOverseasFull && (
                    <span style={{ color: '#a78bfa', marginLeft: '6px', fontWeight: 700 }}>· Overseas Full (4/4)</span>
                  )}
                </p>
              </div>
            </div>

            {/* Role / Position tab pills */}
            <div className="picker-pills" style={{
              display: 'flex', gap: '4px', alignItems: 'center',
              overflowX: 'auto', maxWidth: '100%',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none',
              flexShrink: 0,
            }}>
              {/* IPL cap indicators */}
              {isIPL && (
                <>
                  <span style={{
                    padding: '3px 8px', borderRadius: '999px', flexShrink: 0,
                    border: `1px solid ${isTeamFull ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}`,
                    background: isTeamFull ? 'rgba(239,68,68,0.12)' : 'transparent',
                    color: isTeamFull ? '#f87171' : 'rgba(255,255,255,0.35)',
                    fontSize: '9px', fontWeight: 700,
                    fontFamily: 'Inter, sans-serif', letterSpacing: '0.04em',
                    whiteSpace: 'nowrap',
                  }}>
                    TEAM {teamPickedCount}/{IPL_MAX_PER_TEAM}
                  </span>
                  <span style={{
                    padding: '3px 8px', borderRadius: '999px', flexShrink: 0,
                    border: `1px solid ${isOverseasFull ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.1)'}`,
                    background: isOverseasFull ? 'rgba(167,139,250,0.1)' : 'transparent',
                    color: isOverseasFull ? '#a78bfa' : 'rgba(255,255,255,0.35)',
                    fontSize: '9px', fontWeight: 700,
                    fontFamily: 'Inter, sans-serif', letterSpacing: '0.04em',
                    whiteSpace: 'nowrap',
                  }}>
                    OS {overseasCount}/{IPL_MAX_OVERSEAS}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '10px', flexShrink: 0 }}>|</span>
                </>
              )}
              {GROUPS.map(group => {
                const meta = META_MAP[group]
                const { count, max } = getQuota(group)
                const maxed = count >= max
                const isActive = group === position
                return (
                  <button
                    key={group}
                    onClick={() => sectionRefs.current[group]?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    title={maxed ? `${group} limit reached (${count}/${max})` : `${count}/${max}`}
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
                    <span style={{ marginLeft: '3px', fontSize: '8px', opacity: 0.6 }}>
                      {count}/{max}
                    </span>
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

          {/* ── Quota bar ─────────────────────────────────────────── */}
          <div className="picker-quota-bar" style={{
            display: 'flex',
            gap: 0,
            flexShrink: 0,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            flexWrap: 'wrap',
          }}>
            {GROUPS.map(group => {
              const meta = META_MAP[group]
              const { count, max } = getQuota(group)
              const pct = Math.min((count / max) * 100, 100)
              const full = count >= max
              return (
                <div key={group} style={{
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
                <br />All eligible {isIPL ? 'role' : 'position'} slots are full.
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
          ) : !isReady ? (
            <div style={{
              overflowY: 'auto', flex: 1,
              padding: '16px 16px 24px',
            }}>
              {/* Shimmer loading layout */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{
                  padding: '3px 10px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '999px',
                  color: 'rgba(255,255,255,0.1)',
                  fontSize: '11px', fontWeight: 700,
                  fontFamily: 'Inter, sans-serif',
                }}>
                  ---
                </span>
                <span style={{ width: '80px', height: '14px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }} />
              </div>
              <div className="player-card-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '10px',
              }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                      gap: '8px', padding: '12px 12px 10px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      width: '100%',
                      height: '76px',
                    }}
                  >
                    <div style={{ width: '35px', height: '14px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)' }} />
                    <div style={{ width: '75%', height: '14px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)' }} />
                    <div style={{ width: '50%', height: '10px', borderRadius: '4px', background: 'rgba(255,255,255,0.03)' }} />
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              overflowY: 'auto', flex: 1,
              padding: '16px 16px 24px',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255,255,255,0.1) transparent',
            }}>
              {GROUPS.map((group, groupIdx) => {
                const players = grouped[group]
                if (!players?.length) return null
                const meta = META_MAP[group]

                return (
                  <section
                    key={group}
                    ref={el => { sectionRefs.current[group] = el }}
                    style={{ marginBottom: groupIdx < GROUPS.length - 1 ? '26px' : 0 }}
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
                          key={player.name}
                          player={player}
                          meta={meta}
                          isIPL={isIPL}
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
function PlayerCard({ player, meta, isIPL, onSelect, delayIdx }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
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
      {/* Watermark — jersey number (WC) or batting style (IPL) */}
      <span style={{
        position: 'absolute', top: '8px', right: '10px',
        fontSize: isIPL ? '11px' : '20px', fontWeight: 900,
        color: `${meta.color}22`,
        fontFamily: 'Outfit, Inter, sans-serif',
        lineHeight: 1, letterSpacing: isIPL ? '0.04em' : '-0.04em',
        userSelect: 'none',
      }}>
        {isIPL ? player.battingStyle : player.number}
      </span>

      {/* Role / position badge */}
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

      {/* Subtitle — club (WC) or nationality (IPL) */}
      <span style={{
        fontSize: '10px', color: 'rgba(255,255,255,0.35)',
        fontFamily: 'Inter, sans-serif', fontWeight: 500,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        maxWidth: '100%',
      }}>
        {isIPL ? player.nationality : player.club}
      </span>
    </motion.button>
  )
}
