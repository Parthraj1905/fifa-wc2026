import { useState } from 'react'
import { motion } from 'framer-motion'
import Home from './pages/Home'

const MODES = [
  { id: 'wc',  label: 'WC 2026', icon: '⚽' },
  { id: 'ipl', label: 'IPL',     icon: '🏏' },
]

export default function App() {
  const [mode, setMode] = useState('wc')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Mode toggle ──────────────────────────────────────────── */}
      <div
        role="tablist"
        aria-label="Game mode selector"
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '16px 16px 0',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{
          display: 'inline-flex',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: '999px',
          padding: '4px',
          gap: '2px',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}>
          {MODES.map(m => {
            const active = mode === m.id
            return (
              <motion.button
                key={m.id}
                id={`mode-btn-${m.id}`}
                role="tab"
                aria-selected={active}
                onClick={() => setMode(m.id)}
                whileHover={active ? {} : { scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 20px',
                  borderRadius: '999px',
                  border: 'none',
                  cursor: active ? 'default' : 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  transition: 'background 0.25s, color 0.25s, box-shadow 0.25s',
                  background: active
                    ? 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)'
                    : 'transparent',
                  color: active ? '#0a0a0a' : 'rgba(255,255,255,0.45)',
                  boxShadow: active ? '0 2px 16px rgba(245,158,11,0.35)' : 'none',
                }}
              >
                <span style={{ fontSize: '14px' }}>{m.icon}</span>
                {m.label}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* ── Game — re-mount on mode change to auto-reset state ───── */}
      <Home key={mode} mode={mode} />

    </div>
  )
}
