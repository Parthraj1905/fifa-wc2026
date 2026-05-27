import { motion } from 'framer-motion'
import { IPL_MIN_BY_ROLE } from '../hooks/useSquadBuilder'

/* ─── Role display config ───────────────────────────────────────── */
const ROLE_META = {
  WK:  { label: 'Wicket Keepers', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: '🧤' },
  BAT: { label: 'Batters',        color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  icon: '🏏' },
  AR:  { label: 'All-Rounders',   color: '#10b981', bg: 'rgba(16,185,129,0.12)',  icon: '⚡' },
  BWL: { label: 'Bowlers',        color: '#ec4899', bg: 'rgba(236,72,153,0.12)',  icon: '🔴' },
}

const ROLE_ORDER = ['WK', 'BAT', 'AR', 'BWL']

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
 * IPLSquadReview
 *
 * Shown after all 11 IPL players are drafted (replaces FormationPicker).
 * Displays the XI grouped by role with a balance checker and CTA.
 *
 * @param {object[]} players        - currentXI from useSquadBuilder (each has .role, .team)
 * @param {string|null} balanceWarning - from computeIPLBalance(); null = balanced
 * @param {Function} onAIReview     - called with no args when CTA is clicked
 */
export default function IPLSquadReview({ players = [], balanceWarning, onAIReview }) {
  /* Group players by role */
  const grouped = ROLE_ORDER.reduce((acc, role) => {
    acc[role] = players.filter(p => p.role === role)
    return acc
  }, {})

  /* Count per role for the balance bars */
  const counts = ROLE_ORDER.reduce((acc, role) => {
    acc[role] = grouped[role].length
    return acc
  }, {})

  const isBalanced = !balanceWarning

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      padding: '16px 16px 40px',
      width: '100%',
      maxWidth: '480px',
      margin: '0 auto',
    }}>

      {/* ── Header ───────────────────────────────────────────────── */}
      <div style={{ width: '100%', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: '999px',
          padding: '5px 14px',
          marginBottom: '10px',
        }}>
          <span style={{ fontSize: '13px' }}>🏆</span>
          <span style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#f59e0b',
            fontFamily: 'Inter, sans-serif',
          }}>
            IPL Dream XI
          </span>
        </div>
        <p style={{
          fontSize: '13px', color: 'rgba(255,255,255,0.4)',
          fontFamily: 'Inter, sans-serif', margin: 0,
        }}>
          {players.length} players drafted across {new Set(players.map(p => p.team).filter(Boolean)).size} teams
        </p>
      </div>

      {/* ── Balance checker ──────────────────────────────────────── */}
      <div style={{
        width: '100%',
        background: isBalanced ? 'rgba(16,185,129,0.07)' : 'rgba(239,68,68,0.07)',
        border: `1px solid ${isBalanced ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.22)'}`,
        borderRadius: '14px',
        padding: '14px 16px',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px',
        }}>
          <span style={{ fontSize: '16px' }}>{isBalanced ? '✅' : '⚠️'}</span>
          <span style={{
            fontSize: '13px', fontWeight: 700,
            color: isBalanced ? '#10b981' : '#f87171',
            fontFamily: 'Inter, sans-serif',
          }}>
            {isBalanced ? 'Well-balanced XI' : balanceWarning}
          </span>
        </div>

        {/* Mini role bars */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {ROLE_ORDER.map(role => {
            const meta  = ROLE_META[role]
            const count = counts[role]
            const min   = IPL_MIN_BY_ROLE[role]
            const ok    = count >= min
            return (
              <div key={role} style={{
                flex: '1 1 80px',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '10px',
                padding: '8px 10px',
                border: `1px solid ${ok ? meta.color + '30' : 'rgba(239,68,68,0.3)'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px' }}>{meta.icon}</span>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: meta.color, fontFamily: 'Inter', letterSpacing: '0.06em' }}>
                    {role}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: 800, color: ok ? '#f5f5f5' : '#f87171', fontFamily: 'Outfit, Inter, sans-serif' }}>
                    {count}
                  </span>
                </div>
                <div style={{ height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,0.07)' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min((count / Math.max(count, min + 1)) * 100, 100)}%`,
                    background: ok ? meta.color : '#ef4444',
                    borderRadius: '2px',
                    transition: 'width 0.4s',
                  }} />
                </div>
                <div style={{ marginTop: '4px', fontSize: '8px', color: 'rgba(255,255,255,0.25)', fontFamily: 'Inter' }}>
                  min {min}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Player list grouped by role ───────────────────────────── */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {ROLE_ORDER.map(role => {
          const rolePlayers = grouped[role]
          if (!rolePlayers.length) return null
          const meta = ROLE_META[role]

          return (
            <div key={role} style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '14px',
              overflow: 'hidden',
            }}>
              {/* Role header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 14px',
                background: meta.bg,
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                <span style={{ fontSize: '14px' }}>{meta.icon}</span>
                <span style={{
                  fontSize: '11px', fontWeight: 700, color: meta.color,
                  fontFamily: 'Inter, sans-serif', letterSpacing: '0.07em', textTransform: 'uppercase',
                }}>
                  {meta.label}
                </span>
                <span style={{
                  marginLeft: 'auto',
                  fontSize: '11px', fontWeight: 600,
                  color: `${meta.color}99`,
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {rolePlayers.length}
                </span>
              </div>

              {/* Players */}
              {rolePlayers.map((player, i) => {
                const teamColor = IPL_TEAM_COLORS[player.team] ?? '#a3a3a3'
                return (
                  <motion.div
                    key={player.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22, delay: i * 0.04 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 14px',
                      borderBottom: i < rolePlayers.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    }}
                  >
                    {/* Team colour dot */}
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: teamColor,
                      flexShrink: 0,
                      boxShadow: `0 0 6px ${teamColor}80`,
                    }} />

                    {/* Name */}
                    <span style={{
                      flex: 1,
                      fontSize: '13px', fontWeight: 600, color: '#f0f0f0',
                      fontFamily: 'Inter, sans-serif',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {player.name}
                    </span>

                    {/* Batting style badge */}
                    <span style={{
                      fontSize: '9px', fontWeight: 700,
                      color: player.battingStyle === 'LHB' ? '#a78bfa' : 'rgba(255,255,255,0.3)',
                      fontFamily: 'Inter, sans-serif',
                      letterSpacing: '0.04em',
                    }}>
                      {player.battingStyle}
                    </span>

                    {/* Nationality */}
                    <span style={{
                      fontSize: '10px', color: 'rgba(255,255,255,0.28)',
                      fontFamily: 'Inter, sans-serif',
                      maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {player.nationality}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* ── Get AI Review CTA ─────────────────────────────────────── */}
      <motion.button
        id="ipl-ai-review-btn"
        disabled={!isBalanced}
        whileHover={isBalanced ? { scale: 1.04 } : {}}
        whileTap={isBalanced  ? { scale: 0.96 } : {}}
        onClick={() => isBalanced && onAIReview?.()}
        style={{
          width: '100%',
          padding: '15px',
          background: isBalanced
            ? 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)'
            : 'rgba(255,255,255,0.04)',
          border: isBalanced ? 'none' : '1px solid rgba(255,255,255,0.07)',
          borderRadius: '12px',
          color: isBalanced ? '#0a0a0a' : 'rgba(255,255,255,0.2)',
          fontSize: '14px',
          fontWeight: 800,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          cursor: isBalanced ? 'pointer' : 'not-allowed',
          fontFamily: 'Inter, sans-serif',
          boxShadow: isBalanced ? '0 0 32px rgba(245,158,11,0.35)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        {isBalanced
          ? '✨ Get AI Review'
          : `Fix Balance First — ${balanceWarning?.replace('Unbalanced XI — needs: ', '')}`}
      </motion.button>
    </div>
  )
}
