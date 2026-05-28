import { motion, AnimatePresence } from 'framer-motion'
import {
  SQUAD_SIZE,
  MAX_BY_POS, MID_POOL_POSITIONS, MID_POOL_MAX,
  IPL_BAT_WK_POOL_MAX, IPL_BWL_MAX, IPL_MAX_PER_TEAM, IPL_MAX_OVERSEAS,
} from '../hooks/useSquadBuilder'

/* ─── WC display maps ────────────────────────────────────────────── */
const WC_POS_COLORS = {
  GK: '#f59e0b',
  DEF: '#3b82f6',
  MID: '#10b981',
  FWD: '#ec4899',
}

const WC_POS_TO_CAT = {
  GK: 'GK', CB: 'DEF', LB: 'DEF', RB: 'DEF',
  CDM: 'MID', CM: 'MID', CAM: 'MID',
  ST: 'FWD', LW: 'FWD', RW: 'FWD',
}

const FLAGS = {
  Brazil: '🇧🇷', Spain: '🇪🇸', France: '🇫🇷', Colombia: '🇨🇴',
  Argentina: '🇦🇷', England: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', Croatia: '🇭🇷', Portugal: '🇵🇹',
  Germany: '🇩🇪', USA: '🇺🇸', Belgium: '🇧🇪', Turkey: '🇹🇷',
}

/* WC quota rows */
const WC_QUOTA_ROWS = [
  { key: 'GK',  label: 'GK',  cat: 'GK' },
  { key: 'CB',  label: 'CB',  cat: 'DEF' },
  { key: 'LB',  label: 'LB',  cat: 'DEF' },
  { key: 'RB',  label: 'RB',  cat: 'DEF' },
  { key: 'MID', label: 'MID', cat: 'MID', isPool: true },
  { key: 'LW',  label: 'LW',  cat: 'FWD' },
  { key: 'RW',  label: 'RW',  cat: 'FWD' },
  { key: 'ST',  label: 'ST',  cat: 'FWD' },
]

/* ─── IPL display maps ───────────────────────────────────────────── */
const IPL_ROLE_COLORS = {
  WK:  '#f59e0b',
  BAT: '#3b82f6',
  AR:  '#10b981',
  BWL: '#ec4899',
}

const IPL_TEAM_COLORS = {
  'Mumbai Indians':               '#0057b7',
  'Chennai Super Kings':          '#e8b429',
  'Royal Challengers Bengaluru':  '#cc0000',
  'Kolkata Knight Riders':        '#7b2d8b',
  'Rajasthan Royals':             '#e8538c',
  'Punjab Kings':                 '#d4232e',
  'Delhi Capitals':               '#004c93',
  'Sunrisers Hyderabad':          '#f26522',
  'Gujarat Titans':               '#1c3f94',
  'Lucknow Super Giants':         '#a2d9e7',
}

/**
 * SquadPanel — live tracker shown throughout the game.
 *
 * @param {object[]} players - currentXI array from useSquadBuilder
 * @param {Function} onReset - wired to resetGame()
 * @param {'wc'|'ipl'} mode - controls display style
 */
export default function SquadPanel({ players = [], onReset, mode = 'wc' }) {
  if (players.length === 0) return null

  const isIPL = mode === 'ipl'

  /* IPL counters for the header */
  const overseasCount = isIPL
    ? players.filter(p => p.nationality !== 'Indian').length
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.35 }}
      style={{
        width: '100%',
        maxWidth: '520px',
        margin: '0 auto',
        padding: '0 12px 32px',
      }}
    >
      <div style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px',
        overflow: 'hidden',
      }}>

        {/* ── Header ───────────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '12px', fontWeight: 700,
              color: 'rgba(255,255,255,0.45)',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              fontFamily: 'Inter, sans-serif',
            }}>
              {isIPL ? 'Dream XI' : 'Current Squad'}
            </span>

            {/* Slot pips */}
            <div style={{ display: 'flex', gap: '3px', marginLeft: '2px' }}>
              {Array.from({ length: SQUAD_SIZE }).map((_, i) => (
                <div key={i} style={{
                  width: '7px', height: '7px',
                  borderRadius: '50%',
                  background: i < players.length
                    ? isIPL
                      ? 'linear-gradient(135deg, #3b82f6, #ec4899)'
                      : 'linear-gradient(135deg, #f59e0b, #f97316)'
                    : 'rgba(255,255,255,0.1)',
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>

            <span style={{
              fontSize: '11px',
              color: players.length >= SQUAD_SIZE ? '#f59e0b' : 'rgba(255,255,255,0.3)',
              fontFamily: 'Inter, sans-serif', fontWeight: 600,
            }}>
              {players.length}/{SQUAD_SIZE}
            </span>

            {/* IPL overseas counter */}
            {isIPL && (
              <span style={{
                fontSize: '10px', fontWeight: 600,
                color: overseasCount >= IPL_MAX_OVERSEAS ? '#a78bfa' : 'rgba(255,255,255,0.25)',
                fontFamily: 'Inter, sans-serif',
                borderLeft: '1px solid rgba(255,255,255,0.1)',
                paddingLeft: '8px',
                marginLeft: '2px',
              }}>
                OS {overseasCount}/{IPL_MAX_OVERSEAS}
              </span>
            )}
          </div>

          {/* Reset */}
          <button
            onClick={onReset}
            style={{
              background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.22)',
              fontSize: '12px', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              padding: '4px 8px', borderRadius: '6px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#ef4444'
              e.currentTarget.style.background = 'rgba(239,68,68,0.1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.22)'
              e.currentTarget.style.background = 'none'
            }}
            title="Reset squad"
          >
            ↺ reset
          </button>
        </div>

        {/* ── Quota mini-bar ────────────────────────────────────── */}
        <div className="squad-quota-bar" style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          flexShrink: 0,
          flexWrap: 'wrap',
        }}>
          {isIPL ? (
            /* IPL: show custom pool limits */
            (() => {
              const batWkCount = players.filter(p => p.role === 'WK' || p.role === 'BAT').length
              const bwlCount   = players.filter(p => p.role === 'BWL').length
              const arCount    = players.filter(p => p.role === 'AR').length

              const rows = [
                { label: 'BAT+WK', count: batWkCount, max: IPL_BAT_WK_POOL_MAX, color: '#3b82f6' },
                { label: 'BWL',    count: bwlCount,   max: IPL_BWL_MAX,          color: '#ec4899' },
                { label: 'AR',     count: arCount,    max: 11,                  color: '#10b981', noBar: true },
              ]

              return rows.map(row => {
                const pct = Math.min((row.count / row.max) * 100, 100)
                const full = row.count >= row.max
                return (
                  <div key={row.label} style={{
                    flex: '1 1 auto', minWidth: '60px',
                    padding: '6px 10px',
                    borderRight: '1px solid rgba(255,255,255,0.04)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontSize: '8px', fontWeight: 700, color: full ? row.color : 'rgba(255,255,255,0.3)', fontFamily: 'Inter' }}>{row.label}</span>
                      <span style={{ fontSize: '8px', color: full ? row.color : 'rgba(255,255,255,0.2)', fontFamily: 'Inter', fontWeight: 600 }}>
                        {row.count}{row.noBar ? '' : `/${row.max}`}
                      </span>
                    </div>
                    {!row.noBar ? (
                      <div style={{ height: '2px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: row.color, borderRadius: '2px', transition: 'width 0.4s' }} />
                      </div>
                    ) : (
                      <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.15)', fontFamily: 'Inter', lineHeight: 1 }}>uncapped</div>
                    )}
                  </div>
                )
              })
            })()
          ) : (
            /* WC: show position counts vs caps */
            WC_QUOTA_ROWS.map(row => {
              const c = WC_POS_COLORS[row.cat]
              let count, max
              if (row.isPool) {
                count = players.filter(p => MID_POOL_POSITIONS.includes(p.position)).length
                max   = MID_POOL_MAX
              } else {
                count = players.filter(p => p.position === row.key).length
                max   = MAX_BY_POS[row.key]
              }
              const full = count >= max
              return (
                <div key={row.key} style={{
                  flex: '1 1 auto', minWidth: '48px',
                  padding: '6px 8px',
                  borderRight: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '8px', fontWeight: 700, color: full ? c : 'rgba(255,255,255,0.3)', fontFamily: 'Inter' }}>{row.label}</span>
                    <span style={{ fontSize: '8px', color: full ? c : 'rgba(255,255,255,0.2)', fontFamily: 'Inter', fontWeight: 600 }}>{count}/{max}</span>
                  </div>
                  <div style={{ height: '2px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)' }}>
                    <div style={{ height: '100%', width: `${Math.min((count / max) * 100, 100)}%`, background: full ? c : `${c}66`, borderRadius: '2px', transition: 'width 0.4s' }} />
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* ── Player rows ──────────────────────────────────────── */}
        <div style={{
          maxHeight: '260px',
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.08) transparent',
        }}>
          <AnimatePresence initial={false}>
            {players.map((player, i) => {
              if (isIPL) {
                /* ── IPL player row ─────────────────────────── */
                const roleColor = IPL_ROLE_COLORS[player.role] ?? '#a3a3a3'
                const teamColor = IPL_TEAM_COLORS[player.team]  ?? '#a3a3a3'
                const isOverseas = player.nationality !== 'Indian'

                return (
                  <motion.div
                    key={`${i}-${player.name}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22, delay: 0.05 }}
                    className="squad-player-row"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '9px 14px',
                      borderBottom: i < players.length - 1
                        ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    }}
                  >
                    {/* Rank */}
                    <span style={{
                      width: '16px', textAlign: 'right',
                      fontSize: '11px', fontWeight: 600,
                      color: 'rgba(255,255,255,0.18)',
                      fontFamily: 'Inter, sans-serif', flexShrink: 0,
                    }}>
                      {i + 1}
                    </span>

                    {/* Team colour dot */}
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: teamColor,
                      boxShadow: `0 0 5px ${teamColor}80`,
                      flexShrink: 0,
                    }} />

                    {/* Role badge */}
                    <span style={{
                      display: 'inline-flex', alignItems: 'center',
                      padding: '2px 6px',
                      background: `${roleColor}15`,
                      border: `1px solid ${roleColor}32`,
                      borderRadius: '999px',
                      color: roleColor,
                      fontSize: '9px', fontWeight: 700,
                      fontFamily: 'Inter, sans-serif', letterSpacing: '0.04em',
                      flexShrink: 0,
                    }}>
                      {player.role}
                    </span>

                    {/* Name */}
                    <span style={{
                      flex: 1, fontSize: '13px', fontWeight: 600,
                      color: '#f0f0f0', fontFamily: 'Inter, sans-serif',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      minWidth: 0,
                    }}>
                      {player.name}
                    </span>

                    {/* Overseas marker */}
                    {isOverseas && (
                      <span style={{
                        fontSize: '9px', fontWeight: 700,
                        color: '#a78bfa', fontFamily: 'Inter, sans-serif',
                        flexShrink: 0, letterSpacing: '0.04em',
                      }}>
                        OS
                      </span>
                    )}

                    {/* Batting style */}
                    <span style={{
                      fontSize: '9px', fontWeight: 600,
                      color: player.battingStyle === 'LHB' ? 'rgba(167,139,250,0.7)' : 'rgba(255,255,255,0.2)',
                      fontFamily: 'Inter, sans-serif', flexShrink: 0,
                    }}>
                      {player.battingStyle}
                    </span>
                  </motion.div>
                )
              }

              /* ── WC player row ─────────────────────────────── */
              const wcColor = WC_POS_COLORS[WC_POS_TO_CAT[player.position]] ?? '#a3a3a3'
              const flag = FLAGS[player.nation] ?? ''

              return (
                <motion.div
                  key={`${i}-${player.name}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.22, delay: 0.05 }}
                  className="squad-player-row"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '9px 14px',
                    borderBottom: i < players.length - 1
                      ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}
                >
                  {/* Rank */}
                  <span style={{
                    width: '16px', textAlign: 'right',
                    fontSize: '11px', fontWeight: 600,
                    color: 'rgba(255,255,255,0.18)',
                    fontFamily: 'Inter, sans-serif', flexShrink: 0,
                  }}>
                    {i + 1}
                  </span>

                  {/* Jersey number */}
                  <span className="squad-jersey" style={{
                    width: '22px', textAlign: 'right',
                    fontSize: '12px', fontWeight: 800,
                    color: `${wcColor}99`,
                    fontFamily: 'Inter, sans-serif', flexShrink: 0,
                  }}>
                    {player.number}
                  </span>

                  {/* Position badge */}
                  <span style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '2px 6px',
                    background: `${wcColor}15`, border: `1px solid ${wcColor}32`,
                    borderRadius: '999px', color: wcColor,
                    fontSize: '9px', fontWeight: 700,
                    fontFamily: 'Inter, sans-serif', letterSpacing: '0.04em',
                    flexShrink: 0,
                  }}>
                    {player.position}
                  </span>

                  {/* Name */}
                  <span style={{
                    flex: 1, fontSize: '13px', fontWeight: 600,
                    color: '#f0f0f0', fontFamily: 'Inter, sans-serif',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    minWidth: 0,
                  }}>
                    {player.name}
                  </span>

                  {/* Flag */}
                  {flag && (
                    <span style={{ fontSize: '14px', flexShrink: 0 }}>{flag}</span>
                  )}

                  {/* Club */}
                  <span className="squad-club" style={{
                    fontSize: '10px', color: 'rgba(255,255,255,0.28)',
                    fontFamily: 'Inter, sans-serif', flexShrink: 0,
                    maxWidth: '80px', overflow: 'hidden',
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    textAlign: 'right',
                  }}>
                    {player.club}
                  </span>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
