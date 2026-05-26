import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Formation layouts ─────────────────────────────────────────── */
const FORMATIONS = {
  '4-3-3': [
    { role: 'GK',  x: 50, y: 85 },
    { role: 'LB',  x: 12, y: 68 }, { role: 'CB', x: 35, y: 68 }, { role: 'CB', x: 65, y: 68 }, { role: 'RB', x: 88, y: 68 },
    { role: 'CM',  x: 22, y: 50 }, { role: 'CM', x: 50, y: 50 }, { role: 'CM', x: 78, y: 50 },
    { role: 'LW',  x: 14, y: 24 }, { role: 'ST', x: 50, y: 19 }, { role: 'RW', x: 86, y: 24 },
  ],
  '4-4-2': [
    { role: 'GK',  x: 50, y: 85 },
    { role: 'LB',  x: 12, y: 68 }, { role: 'CB', x: 35, y: 68 }, { role: 'CB', x: 65, y: 68 }, { role: 'RB', x: 88, y: 68 },
    { role: 'LM',  x: 12, y: 50 }, { role: 'CM', x: 35, y: 50 }, { role: 'CM', x: 65, y: 50 }, { role: 'RM', x: 88, y: 50 },
    { role: 'ST',  x: 35, y: 22 }, { role: 'ST', x: 65, y: 22 },
  ],
  '4-2-3-1': [
    { role: 'GK',  x: 50, y: 85 },
    { role: 'LB',  x: 12, y: 70 }, { role: 'CB', x: 35, y: 70 }, { role: 'CB', x: 65, y: 70 }, { role: 'RB', x: 88, y: 70 },
    { role: 'DM',  x: 36, y: 56 }, { role: 'DM', x: 64, y: 56 },
    { role: 'LW',  x: 14, y: 40 }, { role: 'AM', x: 50, y: 40 }, { role: 'RW', x: 86, y: 40 },
    { role: 'ST',  x: 50, y: 20 },
  ],
  '3-5-2': [
    { role: 'GK',   x: 50, y: 85 },
    { role: 'CB',   x: 25, y: 68 }, { role: 'CB',  x: 50, y: 68 }, { role: 'CB',  x: 75, y: 68 },
    { role: 'LWB',  x: 8,  y: 51 }, { role: 'CM', x: 29, y: 51 }, { role: 'CM', x: 50, y: 51 }, { role: 'CM', x: 71, y: 51 }, { role: 'RWB', x: 92, y: 51 },
    { role: 'ST',   x: 35, y: 22 }, { role: 'ST', x: 65, y: 22 },
  ],
  '5-3-2': [
    { role: 'GK',   x: 50, y: 85 },
    { role: 'LWB',  x: 8,  y: 70 }, { role: 'CB', x: 27, y: 70 }, { role: 'CB', x: 50, y: 70 }, { role: 'CB', x: 73, y: 70 }, { role: 'RWB', x: 92, y: 70 },
    { role: 'CM',   x: 25, y: 50 }, { role: 'CM', x: 50, y: 50 }, { role: 'CM', x: 75, y: 50 },
    { role: 'ST',   x: 35, y: 22 }, { role: 'ST', x: 65, y: 22 },
  ],
}

const POS_COLORS = { GK: '#f59e0b', DEF: '#3b82f6', MID: '#10b981', FWD: '#ec4899' }
const POS_LABELS = { GK: 'Goalkeepers', DEF: 'Defenders', MID: 'Midfielders', FWD: 'Forwards' }

// Maps each formation slot role to the player position it accepts
const SLOT_TO_POS = {
  GK:  'GK',
  LB:  'DEF', CB: 'DEF', RB: 'DEF', LWB: 'DEF', RWB: 'DEF',
  CM:  'MID', DM: 'MID', AM: 'MID', LM:  'MID', RM:  'MID',
  ST:  'FWD', LW: 'FWD', RW: 'FWD',
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

const getLastName = (name) => name.trim().split(' ').at(-1)

/* ─── Football pitch SVG ─────────────────────────────────────────── */
function PitchSVG() {
  return (
    <svg viewBox="0 0 340 510" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true">
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={0} y={i * 57} width={340} height={57} fill={i % 2 === 0 ? '#1b5e20' : '#1e6b23'} />
      ))}
      <rect x="18" y="18" width="304" height="474" fill="none" stroke="rgba(255,255,255,0.72)" strokeWidth="2" />
      <line x1="18" y1="255" x2="322" y2="255" stroke="rgba(255,255,255,0.72)" strokeWidth="1.5" />
      <circle cx="170" cy="255" r="50" fill="none" stroke="rgba(255,255,255,0.72)" strokeWidth="1.5" />
      <circle cx="170" cy="255" r="3.5" fill="rgba(255,255,255,0.8)" />
      {/* Top */}
      <rect x="73" y="18" width="194" height="80" fill="none" stroke="rgba(255,255,255,0.72)" strokeWidth="1.5" />
      <rect x="114" y="18" width="112" height="36" fill="none" stroke="rgba(255,255,255,0.72)" strokeWidth="1.5" />
      <rect x="138" y="7" width="64" height="13" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
      <circle cx="170" cy="70" r="2.5" fill="rgba(255,255,255,0.8)" />
      <path d="M 126 98 A 50 50 0 0 1 214 98" fill="none" stroke="rgba(255,255,255,0.72)" strokeWidth="1.5" />
      {/* Bottom */}
      <rect x="73" y="412" width="194" height="80" fill="none" stroke="rgba(255,255,255,0.72)" strokeWidth="1.5" />
      <rect x="114" y="456" width="112" height="36" fill="none" stroke="rgba(255,255,255,0.72)" strokeWidth="1.5" />
      <rect x="138" y="490" width="64" height="13" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
      <circle cx="170" cy="440" r="2.5" fill="rgba(255,255,255,0.8)" />
      <path d="M 126 412 A 50 50 0 0 0 214 412" fill="none" stroke="rgba(255,255,255,0.72)" strokeWidth="1.5" />
      {/* Corners */}
      <path d="M 32 18 A 14 14 0 0 1 18 32" fill="none" stroke="rgba(255,255,255,0.72)" strokeWidth="1.5" />
      <path d="M 308 18 A 14 14 0 0 0 322 32" fill="none" stroke="rgba(255,255,255,0.72)" strokeWidth="1.5" />
      <path d="M 18 474 A 14 14 0 0 0 32 488" fill="none" stroke="rgba(255,255,255,0.72)" strokeWidth="1.5" />
      <path d="M 322 474 A 14 14 0 0 1 308 488" fill="none" stroke="rgba(255,255,255,0.72)" strokeWidth="1.5" />
    </svg>
  )
}

/* ─── Empty formation slot ───────────────────────────────────────── */
function EmptySlot({ slot, onClick, index }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 400, damping: 22 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      aria-label={`Assign player to ${slot.role}`}
      style={{
        position: 'absolute',
        left: `${slot.x}%`,
        top: `${slot.y}%`,
        marginLeft: '-20px',
        marginTop: '-20px',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '2px dashed rgba(255,255,255,0.4)',
        background: 'rgba(255,255,255,0.06)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        padding: 0,
        outline: 'none',
        transition: 'border-color 0.2s, background 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)'
        e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
        e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
      }}
    >
      {/* Player silhouette */}
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <circle cx="12" cy="7.5" r="3.8" fill="rgba(255,255,255,0.22)" />
        <path d="M5 20 Q5 13.5 12 13.5 Q19 13.5 19 20" fill="rgba(255,255,255,0.22)" />
      </svg>

      {/* + badge */}
      <div style={{
        position: 'absolute',
        bottom: '-3px',
        right: '-3px',
        width: '17px',
        height: '17px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.92)',
        color: '#1a4a1a',
        fontSize: '13px',
        fontWeight: 900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
        pointerEvents: 'none',
      }}>
        +
      </div>

      {/* Role label below */}
      <div style={{
        position: 'absolute',
        top: '100%',
        marginTop: '3px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.65)',
        color: 'rgba(255,255,255,0.72)',
        fontSize: '8px',
        fontWeight: 700,
        padding: '1px 5px',
        borderRadius: '4px',
        fontFamily: 'Inter, sans-serif',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
      }}>
        {slot.role}
      </div>
    </motion.button>
  )
}

/* ─── Filled formation slot ──────────────────────────────────────── */
function FilledSlot({ slot, player, color, onRemove, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      style={{
        position: 'absolute',
        left: `${slot.x}%`,
        top: `${slot.y}%`,
        marginLeft: '-20px',
        marginTop: '-20px',
        zIndex: 10,
      }}
    >
      {/* Role label above */}
      <div style={{
        position: 'absolute',
        bottom: '100%',
        marginBottom: '3px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: `${color}e0`,
        color: 'white',
        fontSize: '8px',
        fontWeight: 800,
        padding: '1px 5px',
        borderRadius: '4px',
        fontFamily: 'Inter, sans-serif',
        letterSpacing: '0.05em',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
      }}>
        {slot.role}
      </div>

      {/* Player circle */}
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${color}, ${color}aa)`,
        border: '2.5px solid rgba(255,255,255,0.88)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 4px 14px rgba(0,0,0,0.55), 0 0 0 3px ${color}30`,
        fontSize: '12px',
        fontWeight: 800,
        color: 'white',
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
        userSelect: 'none',
      }}>
        {player.number}

        {/* × remove badge */}
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.85 }}
          onClick={onRemove}
          aria-label={`Remove ${player.name}`}
          style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: '#dc2626',
            border: '2px solid #0a0a0a',
            color: 'white',
            fontSize: '11px',
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            lineHeight: 1,
            zIndex: 20,
          }}
        >
          ×
        </motion.button>
      </div>

      {/* Name label below */}
      <div style={{
        position: 'absolute',
        top: '100%',
        marginTop: '3px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.82)',
        color: 'white',
        fontSize: '9px',
        fontWeight: 600,
        padding: '2px 6px',
        borderRadius: '5px',
        fontFamily: 'Inter, sans-serif',
        whiteSpace: 'nowrap',
        maxWidth: '76px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        pointerEvents: 'none',
      }}>
        {getLastName(player.name)}
      </div>
    </motion.div>
  )
}

/* ─── Slot player picker (bottom sheet) ─────────────────────────── */
function SlotPickerPanel({ availablePlayers, slotRole, requiredPos, onSelect, onClose }) {
  const posColor = requiredPos ? POS_COLORS[requiredPos] : '#f59e0b'
  const posLabel = requiredPos ? POS_LABELS[requiredPos] : 'Players'

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
        }}
      />

      {/* Bottom sheet */}
      <motion.div
        key="sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 360, damping: 32 }}
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          zIndex: 301,
          background: '#111',
          borderRadius: '20px 20px 0 0',
          border: '1px solid rgba(255,255,255,0.09)',
          borderBottom: 'none',
          maxHeight: '62vh',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 -16px 48px rgba(0,0,0,0.7)',
        }}
      >
        {/* Handle */}
        <div style={{
          width: '36px', height: '4px', borderRadius: '2px',
          background: 'rgba(255,255,255,0.15)',
          margin: '10px auto 0', flexShrink: 0,
        }} />

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px 10px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#f5f5f5', fontFamily: 'Inter, sans-serif' }}>
              <span style={{
                display: 'inline-block',
                padding: '1px 8px', marginRight: '8px',
                background: `${posColor}18`,
                border: `1px solid ${posColor}35`,
                borderRadius: '6px',
                color: posColor,
                fontSize: '11px', fontWeight: 800, letterSpacing: '0.06em',
              }}>
                {slotRole}
              </span>
              {posLabel} only
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.32)', fontFamily: 'Inter, sans-serif', marginTop: '3px' }}>
              {availablePlayers.length} player{availablePlayers.length !== 1 ? 's' : ''} available
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.55)',
              fontSize: '18px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >×</button>
        </div>

        {/* Player list */}
        <div style={{
          overflowY: 'auto', flex: 1,
          padding: '6px 0 16px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.07) transparent',
        }}>
          {availablePlayers.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '32px 20px',
              color: 'rgba(255,255,255,0.28)',
              fontFamily: 'Inter, sans-serif', fontSize: '13px',
              lineHeight: 1.6,
            }}>
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>🔒</div>
              No unassigned <span style={{ color: posColor, fontWeight: 600 }}>{posLabel}</span> left.<br />
              Remove one from another slot first.
            </div>
          ) : (
            availablePlayers.map(player => {
              const c = POS_COLORS[PLAYER_POS_TO_CAT[player.position]] ?? '#a3a3a3'
              return (
                <motion.button
                  key={player.name}
                  whileHover={{ background: 'rgba(255,255,255,0.055)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(player)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    width: '100%', padding: '11px 20px',
                    background: 'none', border: 'none',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <span style={{ width: '26px', textAlign: 'right', fontSize: '13px', fontWeight: 800, color: `${c}88`, fontFamily: 'Inter, sans-serif', flexShrink: 0 }}>
                    {player.number}
                  </span>
                  <span style={{
                    padding: '2px 8px', background: `${c}16`, border: `1px solid ${c}32`,
                    borderRadius: '999px', color: c, fontSize: '10px', fontWeight: 700,
                    fontFamily: 'Inter, sans-serif', letterSpacing: '0.05em', flexShrink: 0,
                  }}>
                    {player.position}
                  </span>
                  <span style={{ flex: 1, fontSize: '13px', fontWeight: 600, color: '#f0f0f0', fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {player.name}
                  </span>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', fontFamily: 'Inter, sans-serif', flexShrink: 0, maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {player.club}
                  </span>
                </motion.button>
              )
            })
          )}
        </div>
      </motion.div>
    </>
  )
}


/* ─── FormationPicker ───────────────────────────────────────────── */
/**
 * @param {object[]} players   - The drafted XI from useSquadBuilder
 * @param {Function} onAIReview - Called with { formation, lineup } when CTA is clicked
 */
export default function FormationPicker({ players = [], onAIReview }) {
  const [selectedFormation, setSelectedFormation] = useState(null)
  // slotAssignments: { [slotIndex]: playerObject }
  const [slotAssignments, setSlotAssignments] = useState({})
  // activeSlot: index of slot currently open for picking (null = panel closed)
  const [activeSlot, setActiveSlot] = useState(null)

  const formationSlots = selectedFormation ? FORMATIONS[selectedFormation] : []

  /* Reset assignments + close panel when formation changes */
  useEffect(() => {
    setSlotAssignments({})
    setActiveSlot(null)
  }, [selectedFormation])

  /* Players not yet placed on the pitch */
  const assignedNames = useMemo(
    () => new Set(Object.values(slotAssignments).map(p => p?.name)),
    [slotAssignments]
  )
  const availablePlayers = useMemo(
    () => players.filter(p => !assignedNames.has(p.name)),
    [players, assignedNames]
  )

  const filledCount  = Object.keys(slotAssignments).length
  const totalSlots   = formationSlots.length
  const allFilled    = selectedFormation && filledCount === totalSlots

  const assignPlayer = (slotIdx, player) => {
    setSlotAssignments(prev => ({ ...prev, [slotIdx]: player }))
    setActiveSlot(null)
  }

  const removePlayer = (slotIdx) => {
    setSlotAssignments(prev => {
      const next = { ...prev }
      delete next[slotIdx]
      return next
    })
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      padding: '16px 16px 40px',
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto',
    }}>

      {/* ── Top bar: dropdown + slot counter ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}>
        {/* Formation dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="formation-select" style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '12px',
            fontFamily: 'Inter, sans-serif',
          }}>
            Formation
          </label>
          <div style={{ position: 'relative' }}>
            <select
              id="formation-select"
              value={selectedFormation ?? ''}
              onChange={e => setSelectedFormation(e.target.value || null)}
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                color: selectedFormation ? '#f5f5f5' : 'rgba(255,255,255,0.3)',
                padding: '9px 32px 9px 13px',
                fontSize: '14px',
                fontWeight: 700,
                fontFamily: 'Outfit, Inter, sans-serif',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                WebkitAppearance: 'none',
              }}
            >
              <option value="">Select…</option>
              {Object.keys(FORMATIONS).map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <span style={{
              position: 'absolute', right: '10px', top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255,255,255,0.38)',
              pointerEvents: 'none', fontSize: '11px',
            }}>▾</span>
          </div>
        </div>

        {/* Slot progress */}
        {selectedFormation && (
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            color: allFilled ? '#f59e0b' : 'rgba(255,255,255,0.35)',
            fontFamily: 'Inter, sans-serif',
          }}>
            {filledCount}/{totalSlots}
          </span>
        )}
      </div>

      {/* ── Football pitch ── */}
      <div style={{
        position: 'relative',
        width: '100%',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 12px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
      }}>
        {/* 2:3 aspect ratio */}
        <div style={{ paddingBottom: '150%' }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <PitchSVG />

            {/* No formation selected overlay */}
            <AnimatePresence>
              {!selectedFormation && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.35)',
                    backdropFilter: 'blur(2px)',
                    gap: '8px',
                  }}
                >
                  <span style={{ fontSize: '36px' }}>⚽</span>
                  <span style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '13px',
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    Pick a formation above
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Formation slots */}
            <AnimatePresence>
              {selectedFormation && formationSlots.map((slot, i) => {
                const player = slotAssignments[i] ?? null
                const color  = player ? (POS_COLORS[PLAYER_POS_TO_CAT[player.position]] ?? '#a3a3a3') : '#ffffff'

                return player ? (
                  <FilledSlot
                    key={`filled-${i}`}
                    slot={slot}
                    player={player}
                    color={color}
                    index={i}
                    onRemove={() => removePlayer(i)}
                  />
                ) : (
                  <EmptySlot
                    key={`empty-${i}`}
                    slot={slot}
                    index={i}
                    onClick={() => setActiveSlot(i)}
                  />
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Get AI Review CTA ── */}
      <motion.button
        id="ai-review-btn"
        disabled={!allFilled}
        whileHover={allFilled ? { scale: 1.04 } : {}}
        whileTap={allFilled  ? { scale: 0.96 } : {}}
        onClick={() => {
          if (allFilled) {
            const lineup = formationSlots.map((slot, i) => ({
              slot: slot.role,
              player: slotAssignments[i],
            }))
            onAIReview?.({ formation: selectedFormation, lineup })
          }
        }}
        style={{
          width: '100%',
          padding: '15px',
          background: allFilled
            ? 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)'
            : 'rgba(255,255,255,0.04)',
          border: allFilled ? 'none' : '1px solid rgba(255,255,255,0.07)',
          borderRadius: '12px',
          color: allFilled ? '#0a0a0a' : 'rgba(255,255,255,0.2)',
          fontSize: '14px',
          fontWeight: 800,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          cursor: allFilled ? 'pointer' : 'not-allowed',
          fontFamily: 'Inter, sans-serif',
          boxShadow: allFilled ? '0 0 32px rgba(245,158,11,0.35)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        {allFilled
          ? '✨ Get AI Review'
          : selectedFormation
            ? `Place ${totalSlots - filledCount} more player${totalSlots - filledCount !== 1 ? 's' : ''}`
            : 'Select a Formation First'}
      </motion.button>

      {/* ── Slot picker bottom sheet ── */}
      <AnimatePresence>
        {activeSlot !== null && (() => {
          const slotRole = formationSlots[activeSlot]?.role ?? ''
          const requiredPos = SLOT_TO_POS[slotRole] ?? null
          const posFilteredPlayers = requiredPos
            ? availablePlayers.filter(p => PLAYER_POS_TO_CAT[p.position] === requiredPos)
            : availablePlayers
          return (
            <SlotPickerPanel
              availablePlayers={posFilteredPlayers}
              slotRole={slotRole}
              requiredPos={requiredPos}
              onSelect={(player) => assignPlayer(activeSlot, player)}
              onClose={() => setActiveSlot(null)}
            />
          )
        })()}
      </AnimatePresence>
    </div>
  )
}
