import { useState, useRef } from 'react'
import { motion, animate, useMotionValue } from 'framer-motion'
import squads from '../data/squads'

/* ─── Color palette ──────────────────────────────────────────────── */
const PALETTE = [
  '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899',
  '#06b6d4', '#f97316', '#84cc16', '#e11d48', '#0ea5e9',
  '#d946ef', '#22c55e', '#fb923c', '#a3e635', '#facc15',
]

/* ─── SVG math helpers ───────────────────────────────────────────── */
const toRad = (d) => (d * Math.PI) / 180

function polar(cx, cy, r, deg) {
  return [
    cx + r * Math.cos(toRad(deg)),
    cy + r * Math.sin(toRad(deg)),
  ]
}

function arcPath(cx, cy, r, a0, a1) {
  const [x1, y1] = polar(cx, cy, r, a0)
  const [x2, y2] = polar(cx, cy, r, a1)
  const large = a1 - a0 > 180 ? 1 : 0
  return `M${cx},${cy} L${x1.toFixed(3)},${y1.toFixed(3)} A${r},${r},0,${large},1,${x2.toFixed(3)},${y2.toFixed(3)} Z`
}

const CX = 210
const CY = 210
const R  = 188

/**
 * SpinWheel
 * @param {string[]}  nations    - array of nation names to display on wheel
 * @param {Function}  onResult   - callback called with winning nation name after spin
 */
export default function SpinWheel({ onResult }) {
  const defaultNations = Object.keys(squads)

  const [nations, setNations] = useState(defaultNations)
  const [input,   setInput]   = useState('')
  const [spinning, setSpinning] = useState(false)
  const [winner,  setWinner]  = useState(null)

  /* accumulated absolute rotation so framer-motion animates forward */
  const rotRef  = useRef(0)
  const rotMV   = useMotionValue(0) // framer-motion MotionValue drives the SVG

  const N        = nations.length
  const segAngle = 360 / N

  /* ─── Spin ─────────────────────────────────────────────────────── */
  const spin = async () => {
    if (spinning || N < 2) return
    setSpinning(true)
    setWinner(null)

    // Add 1440–2520° of random rotation (4–7 full spins). No targeting.
    const extraDeg = 1440 + Math.random() * 1080
    const target   = rotRef.current + extraDeg

    await animate(rotMV, target, {
      duration: 3.2 + Math.random() * 0.8,
      ease: [0.17, 0.67, 0.05, 1.0],
    })

    rotRef.current = target

    /*
     * Work backwards from where the wheel landed to find the winner.
     *
     * Segments are drawn starting at −90° (12 o'clock) going clockwise.
     * When the wheel rotates +R° clockwise, the fixed pointer at −90° (top)
     * is now pointing at wheel-local angle (−90° − R).
     * Relative to the first segment's start (−90°), the offset is just −R.
     *
     * We therefore NEGATE the rotation before mod-ing:
     *   finalAngle  = (−totalRotation) mod 360
     *   segIndex    = floor(finalAngle / segAngle)
     *
     * Using +target here instead of −target is the classic off-by-mirror bug
     * that swaps symmetric segments (e.g. Brazil↔England, Spain↔Argentina).
     */
    const finalAngle = ((-target % 360) + 360) % 360
    const segIndex   = Math.floor(finalAngle / segAngle) % N

    setSpinning(false)
    setWinner(nations[segIndex])
    onResult?.(nations[segIndex])
  }

  /* ─── Nation list management ───────────────────────────────────── */
  const addNation = () => {
    const v = input.trim()
    if (!v || nations.includes(v)) return
    setNations(p => [...p, v])
    setInput('')
  }

  const removeNation = (n) => {
    if (nations.length <= 2) return
    setNations(p => p.filter(x => x !== n))
    if (winner === n) setWinner(null)
  }

  /* ─── Render ───────────────────────────────────────────────────── */
  return (
    <section
      aria-label="Spin Wheel – nation picker"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '28px',
        padding: '40px 24px',
        width: '100%',
        maxWidth: '560px',
        margin: '0 auto',
      }}
    >

      {/* ── Add / remove nations ─────────────────────────────────── */}
      <div style={{ width: '100%' }}>
        {/* Input row */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          <input
            id="nation-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addNation()}
            placeholder="Add a nation…"
            aria-label="Nation name"
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              padding: '10px 16px',
              color: '#f5f5f5',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e  => (e.target.style.borderColor = 'rgba(245,158,11,0.4)')}
            onBlur={e   => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
          <button
            id="add-nation-btn"
            onClick={addNation}
            style={{
              padding: '10px 20px',
              background: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.28)',
              borderRadius: '10px',
              color: '#f59e0b',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(245,158,11,0.22)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(245,158,11,0.12)')}
          >
            + Add
          </button>
        </div>

        {/* Nation chips */}
        <div
          role="list"
          aria-label="Nations in wheel"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
        >
          {nations.map((n, i) => {
            const color = PALETTE[i % PALETTE.length]
            return (
              <motion.span
                key={n}
                role="listitem"
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.75 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: `${color}18`,
                  border: `1px solid ${color}42`,
                  borderRadius: '999px',
                  padding: '5px 10px 5px 9px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <span style={{
                  width: '7px', height: '7px',
                  borderRadius: '50%', background: color, flexShrink: 0,
                }} />
                {n}
                {nations.length > 2 && (
                  <button
                    onClick={() => removeNation(n)}
                    aria-label={`Remove ${n}`}
                    style={{
                      background: 'none', border: 'none',
                      color, cursor: 'pointer', opacity: 0.55,
                      fontSize: '15px', lineHeight: 1, padding: '0 2px',
                      display: 'flex', alignItems: 'center',
                      transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = 1)}
                    onMouseLeave={e => (e.currentTarget.style.opacity = 0.55)}
                  >
                    ×
                  </button>
                )}
              </motion.span>
            )
          })}
        </div>
      </div>

      {/* ── Wheel ────────────────────────────────────────────────── */}
      <div
        style={{ position: 'relative', display: 'inline-block' }}
        aria-label="Spin wheel"
      >
        {/* Ambient glow ring – pulses while spinning */}
        <motion.div
          animate={{
            boxShadow: spinning
              ? ['0 0 40px rgba(245,158,11,0.2)', '0 0 80px rgba(245,158,11,0.35)', '0 0 40px rgba(245,158,11,0.2)']
              : '0 0 24px rgba(245,158,11,0.1)',
          }}
          transition={{ duration: 1.2, repeat: spinning ? Infinity : 0 }}
          style={{
            position: 'absolute', inset: '-10px',
            borderRadius: '50%', pointerEvents: 'none',
          }}
        />

        {/* Pointer ▼ */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-16px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            width: 0, height: 0,
            borderLeft: '13px solid transparent',
            borderRight: '13px solid transparent',
            borderTop: '24px solid #f59e0b',
            filter: 'drop-shadow(0 0 10px rgba(245,158,11,0.9))',
          }}
        />

        {/* SVG Wheel */}
        <motion.svg
          width={CX * 2}
          height={CY * 2}
          viewBox={`0 0 ${CX * 2} ${CY * 2}`}
          style={{
            display: 'block',
            rotate: rotMV,
            originX: '50%',
            originY: '50%',
          }}
          aria-hidden="true"
        >
          <defs>
            {/* Radial highlight per segment (white sheen on outer edge) */}
            <radialGradient id="sheen" cx="50%" cy="20%" r="80%">
              <stop offset="0%"   stopColor="white" stopOpacity="0.18" />
              <stop offset="100%" stopColor="white" stopOpacity="0"    />
            </radialGradient>
            {/* Soft shadow vignette */}
            <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
              <stop offset="70%"  stopColor="black" stopOpacity="0"    />
              <stop offset="100%" stopColor="black" stopOpacity="0.35" />
            </radialGradient>
          </defs>

          {/* Outer decorative ring */}
          <circle
            cx={CX} cy={CY} r={R + 6}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="3"
          />

          {/* Segments */}
          {nations.map((nation, i) => {
            const a0    = -90 + i * segAngle
            const a1    = a0 + segAngle
            const mid   = (a0 + a1) / 2
            const [lx, ly] = polar(CX, CY, R * 0.63, mid)
            const color = PALETTE[i % PALETTE.length]
            const fs    = N > 9 ? 8 : N > 6 ? 10 : 12
            const label = nation.length > 11 ? nation.slice(0, 10) + '…' : nation

            return (
              <g key={nation}>
                {/* Filled segment */}
                <path
                  d={arcPath(CX, CY, R, a0, a1)}
                  fill={color}
                  stroke="#0a0a0a"
                  strokeWidth="1.5"
                  opacity="0.93"
                />
                {/* Sheen overlay */}
                <path
                  d={arcPath(CX, CY, R, a0, a1)}
                  fill="url(#sheen)"
                />
                {/* Label */}
                <text
                  x={lx}
                  y={ly}
                  transform={`rotate(${mid + 90}, ${lx.toFixed(3)}, ${ly.toFixed(3)})`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={fs}
                  fontWeight="700"
                  fontFamily="Inter, sans-serif"
                  style={{
                    userSelect: 'none',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))',
                  }}
                >
                  {label}
                </text>
              </g>
            )
          })}

          {/* Vignette edge */}
          <circle cx={CX} cy={CY} r={R} fill="url(#vignette)" />

          {/* Centre hub */}
          <circle cx={CX} cy={CY} r={30} fill="#0f0f0f" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
          <circle cx={CX} cy={CY} r={14} fill="rgba(245,158,11,0.2)" />
          <circle cx={CX} cy={CY} r={7}  fill="#f59e0b" />
        </motion.svg>
      </div>

      {/* ── Spin button ──────────────────────────────────────────── */}
      <motion.button
        id="spin-btn"
        onClick={spin}
        disabled={spinning || N < 2}
        whileHover={spinning || N < 2 ? {} : { scale: 1.06 }}
        whileTap={spinning || N < 2  ? {} : { scale: 0.94 }}
        style={{
          padding: '14px 52px',
          background: spinning
            ? 'rgba(245,158,11,0.08)'
            : 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
          border: spinning
            ? '1px solid rgba(245,158,11,0.25)'
            : '1px solid transparent',
          borderRadius: '999px',
          color: spinning ? '#f59e0b' : '#0a0a0a',
          fontSize: '15px',
          fontWeight: 800,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          cursor: spinning || N < 2 ? 'not-allowed' : 'pointer',
          fontFamily: 'Inter, sans-serif',
          boxShadow: spinning ? 'none' : '0 0 36px rgba(245,158,11,0.4)',
          transition: 'background 0.35s, color 0.35s, box-shadow 0.35s',
          opacity: N < 2 ? 0.35 : 1,
        }}
      >
        {spinning ? '⚡ Spinning…' : '🎰 Spin!'}
      </motion.button>

      {/* ── Winner banner ─────────────────────────────────────────── */}
      {winner && (
        <motion.div
          key={winner + Date.now()}
          initial={{ opacity: 0, y: 24, scale: 0.85 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          transition={{ type: 'spring', stiffness: 280, damping: 18 }}
          role="status"
          aria-live="polite"
          style={{
            padding: '22px 36px',
            background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(249,115,22,0.05))',
            border: '1px solid rgba(245,158,11,0.22)',
            borderRadius: '18px',
            textAlign: 'center',
            backdropFilter: 'blur(16px)',
            width: '100%',
          }}
        >
          <div style={{ fontSize: '30px', marginBottom: '6px' }}>🏆</div>
          <div style={{
            fontSize: '11px',
            color: 'rgba(245,158,11,0.65)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontWeight: 600,
            marginBottom: '8px',
            fontFamily: 'Inter, sans-serif',
          }}>
            Selected Nation
          </div>
          <div style={{
            fontSize: '30px',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #f59e0b, #f97316)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontFamily: 'Outfit, Inter, sans-serif',
          }}>
            {winner}
          </div>
        </motion.div>
      )}

    </section>
  )
}
