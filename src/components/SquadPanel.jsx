import { motion, AnimatePresence } from 'framer-motion'
import { SQUAD_SIZE, MAX_BY_POS, MID_POOL_POSITIONS, MID_POOL_MAX } from '../hooks/useSquadBuilder'

const POS_COLORS = {
  GK: '#f59e0b',
  DEF: '#3b82f6',
  MID: '#10b981',
  FWD: '#ec4899',
}

const PLAYER_POS_TO_CAT = {
  GK: 'GK',
  CB: 'DEF',
  LB: 'DEF',
  RB: 'DEF',
  CDM: 'MID',
  CM: 'MID',
  CAM: 'MID',
  ST: 'FWD',
  LW: 'FWD',
  RW: 'FWD',
}

const FLAGS = {
  Brazil: '🇧🇷', Spain: '🇪🇸', France: '🇫🇷', Colombia: '🇨🇴',
  Argentina: '🇦🇷', England: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', Croatia: '🇭🇷', Portugal: '🇵🇹',
  Germany: '🇩🇪', USA: '🇺🇸'
}

/* Consolidated quota rows: individual positions + one combined MID row */
const QUOTA_ROWS = [
  { key: 'GK',  label: 'GK',  cat: 'GK' },
  { key: 'CB',  label: 'CB',  cat: 'DEF' },
  { key: 'LB',  label: 'LB',  cat: 'DEF' },
  { key: 'RB',  label: 'RB',  cat: 'DEF' },
  { key: 'MID', label: 'MID', cat: 'MID', isPool: true },
  { key: 'LW',  label: 'LW',  cat: 'FWD' },
  { key: 'RW',  label: 'RW',  cat: 'FWD' },
  { key: 'ST',  label: 'ST',  cat: 'FWD' },
]

/**
 * SquadPanel — live tracker shown throughout the game.
 *
 * @param {object[]} players - currentXI array from useSquadBuilder (each has .nation)
 * @param {Function} onReset - wired to resetGame()
 */
export default function SquadPanel({ players = [], onReset }) {
  if (players.length === 0) return null

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '12px', fontWeight: 700,
              color: 'rgba(255,255,255,0.45)',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              fontFamily: 'Inter, sans-serif',
            }}>
              Current Squad
            </span>
            {/* Slot pips */}
            <div style={{ display: 'flex', gap: '3px', marginLeft: '2px' }}>
              {Array.from({ length: SQUAD_SIZE }).map((_, i) => (
                <div key={i} style={{
                  width: '7px', height: '7px',
                  borderRadius: '50%',
                  background: i < players.length
                    ? 'linear-gradient(135deg, #f59e0b, #f97316)'
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
          </div>

          {/* Reset */}
          <button
            onClick={onReset}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.22)',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              padding: '4px 8px',
              borderRadius: '6px',
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

        {/* ── Position quota mini-bar ─────────────────────────── */}
        <div className="squad-quota-bar" style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          flexShrink: 0,
          flexWrap: 'wrap',
        }}>
          {QUOTA_ROWS.map(row => {
            const c = POS_COLORS[row.cat]
            let count, max
            if (row.isPool) {
              count = players.filter(p => MID_POOL_POSITIONS.includes(p.position)).length
              max = MID_POOL_MAX
            } else {
              count = players.filter(p => p.position === row.key).length
              max = MAX_BY_POS[row.key]
            }
            const full = count >= max
            return (
              <div key={row.key} style={{
                flex: '1 1 auto',
                minWidth: '48px',
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
          })}
        </div>

        {/* ── Player rows ─────────────────────────────────────── */}
        <div
          style={{
            maxHeight: '260px',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.08) transparent',
          }}
        >
          <AnimatePresence initial={false}>
            {players.map((player, i) => {
              const color = POS_COLORS[PLAYER_POS_TO_CAT[player.position]] ?? '#a3a3a3'
              const flag = FLAGS[player.nation] ?? ''

              return (
                <motion.div
                  key={`${i}-${player.name}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.22, delay: 0.05 }}
                  className="squad-player-row"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 14px',
                    borderBottom: i < players.length - 1
                      ? '1px solid rgba(255,255,255,0.04)'
                      : 'none',
                  }}
                >
                  {/* Rank */}
                  <span style={{
                    width: '16px',
                    textAlign: 'right',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.18)',
                    fontFamily: 'Inter, sans-serif',
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </span>

                  {/* Jersey number */}
                  <span className="squad-jersey" style={{
                    width: '22px',
                    textAlign: 'right',
                    fontSize: '12px',
                    fontWeight: 800,
                    color: `${color}99`,
                    fontFamily: 'Inter, sans-serif',
                    flexShrink: 0,
                  }}>
                    {player.number}
                  </span>

                  {/* Position badge */}
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '2px 6px',
                    background: `${color}15`,
                    border: `1px solid ${color}32`,
                    borderRadius: '999px',
                    color,
                    fontSize: '9px',
                    fontWeight: 700,
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '0.04em',
                    flexShrink: 0,
                  }}>
                    {player.position}
                  </span>

                  {/* Name */}
                  <span style={{
                    flex: 1,
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#f0f0f0',
                    fontFamily: 'Inter, sans-serif',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    minWidth: 0,
                  }}>
                    {player.name}
                  </span>

                  {/* Flag */}
                  {flag && (
                    <span style={{ fontSize: '14px', flexShrink: 0 }}>
                      {flag}
                    </span>
                  )}

                  {/* Club */}
                  <span className="squad-club" style={{
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.28)',
                    fontFamily: 'Inter, sans-serif',
                    flexShrink: 0,
                    maxWidth: '80px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
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
