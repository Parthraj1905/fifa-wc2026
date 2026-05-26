import { startTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SpinWheel from '../components/SpinWheel'
import PlayerPicker from '../components/PlayerPicker'
import FormationPicker from '../components/FormationPicker'
import SquadPanel from '../components/SquadPanel'
import useSquadBuilder, { SQUAD_SIZE } from '../hooks/useSquadBuilder'

export default function Home() {
  const {
    selectedNations,
    currentXI,
    currentSpin,
    phase,
    handleSpinResult,
    handlePlayerPick,
    skipNation,
    resetGame,
  } = useSquadBuilder()

  /* Wrap spin result in startTransition so the wheel exit stays smooth */
  const onSpinResult = (nation) => {
    startTransition(() => {
      handleSpinResult(nation)
    })
  }

  return (
    <main
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >

      {/* ── Ambient glows ── */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '-15%', left: '-8%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', right: '-8%',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
      </div>

      {/* ── Page content ── */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>

        {/* Hero header */}
        <div className="hero-header" style={{ textAlign: 'center', padding: '40px 24px 8px' }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: '999px', padding: '6px 16px', marginBottom: '16px',
            }}
          >
            <span style={{ fontSize: '15px' }}>⚽</span>
            <span style={{
              fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f59e0b',
              fontFamily: 'Inter, sans-serif',
            }}>
              FIFA World Cup 2026
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: 'clamp(1.6rem, 6vw, 4rem)',
              fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1,
              fontFamily: 'Outfit, Inter, sans-serif',
            }}
          >
            <span style={{
              background: 'linear-gradient(135deg, #f5f5f5 30%, #a3a3a3)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              WC 2026
            </span>{' '}
            <span style={{
              background: 'linear-gradient(135deg, #f59e0b, #fbbf24 50%, #f97316)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Squad Builder
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{
              marginTop: '10px', fontSize: '0.95rem',
              color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif',
            }}
          >
            {phase === 'spinning' && currentXI.length === 0 && 'Spin to pick a nation, then draft a player for your squad.'}
            {phase === 'spinning' && currentXI.length > 0  && `${SQUAD_SIZE - currentXI.length} more picks to go — spin again!`}
            {phase === 'formation' && 'Squad complete — set your formation and get an AI review.'}
          </motion.p>
        </div>

        {/* ── Spin Wheel ── */}
        <AnimatePresence mode="wait">
          {phase === 'spinning' && (
            <motion.div
              key="wheel"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.4 }}
            >
              <SpinWheel
                onResult={onSpinResult}
                excludeNations={selectedNations}
              />
            </motion.div>
          )}

          {/* ── Formation Picker ── */}
          {phase === 'formation' && (
            <motion.div
              key="formation"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <FormationPicker
                players={currentXI}
                onAIReview={({ formation, players }) => {
                  console.log('AI Review requested:', formation, players)
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Live Squad Panel ──────────────────────────────────────
             Visible in both "spinning" and "formation" phases so the
             user always sees what they've drafted.                   */}
        <AnimatePresence>
          {currentXI.length > 0 && phase !== 'picking' && (
            <SquadPanel
              players={currentXI}
              onReset={resetGame}
            />
          )}
        </AnimatePresence>

      </div>

      {/* ── PlayerPicker modal ── */}
      <AnimatePresence>
        {phase === 'picking' && currentSpin && (
          <PlayerPicker
            nation={currentSpin}
            position={null}
            currentXI={currentXI}
            onSelect={handlePlayerPick}
            onSkip={skipNation}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
