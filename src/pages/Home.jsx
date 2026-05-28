import { startTransition, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SpinWheel from '../components/SpinWheel'
import PlayerPicker from '../components/PlayerPicker'
import FormationPicker from '../components/FormationPicker'
import IPLSquadReview from '../components/IPLSquadReview'
import SquadPanel from '../components/SquadPanel'
import ReviewCard from '../components/ReviewCard'
import { reviewTeam } from '../utils/reviewTeam'
import useSquadBuilder, { SQUAD_SIZE } from '../hooks/useSquadBuilder'
import squadsWC from '../data/squads'
import iplSquads from '../data/iplSquads'
import MultiplayerManager from '../components/MultiplayerManager'

/* ── Score label maps per mode ─────────────────────────────────── */
const SCORE_LABELS = {
  wc:  { score1: 'Squad Balance', score2: 'Formation Fit' },
  ipl: { score1: 'Batting Depth', score2: 'Bowling Attack' },
}

/**
 * Home — game orchestration layer.
 * @param {'wc'|'ipl'} mode  - Passed down from App.jsx
 */
export default function Home({ mode = 'wc' }) {
  const isIPL = mode === 'ipl'

  /* Choose the right dataset */
  const squadsData = isIPL ? iplSquads : squadsWC

  const {
    selectedNations,
    currentXI,
    currentSpin,
    phase,
    handleSpinResult,
    handlePlayerPick,
    skipNation,
    resetGame,
  } = useSquadBuilder(mode)

  const [review,      setReview]      = useState(null)
  const [isReviewing, setIsReviewing] = useState(false)
  const [activeFormat, setActiveFormat] = useState(null) // null | 'solo' | 'multiplayer'

  const onSpinResult = (nation) => {
    // 220 ms grace: let SpinWheel paint its exit frame before mounting
    // the heavy PlayerPicker modal — eliminates mobile frame-drop jank
    setTimeout(() => {
      startTransition(() => { handleSpinResult(nation) })
    }, 220)
  }

  /* IPL: no formation argument needed */
  const handleAIReview = async ({ formation } = {}) => {
    setIsReviewing(true)
    try {
      const res = await reviewTeam(currentXI, formation ?? null, mode)
      setReview(res)
    } catch (err) {
      console.error('AI review failed:', err)
    } finally {
      setIsReviewing(false)
    }
  }

  const onResetGame = () => {
    setReview(null)
    setIsReviewing(false)
    resetGame()
  }

  /* IPL balance: no minimum requirements — always null */
  const iplBalanceWarning = null

  /* ─── Subtitle copy ─────────────────────────────────────────── */
  const subtitle = (() => {
    if (phase === 'spinning' && currentXI.length === 0)
      return isIPL
        ? 'Spin to pick an IPL team, then draft a player for your Dream XI.'
        : 'Spin to pick a nation, then draft a player for your squad.'
    if (phase === 'spinning' && currentXI.length > 0)
      return `${SQUAD_SIZE - currentXI.length} more picks to go — spin again!`
    if (phase === 'picking' && currentSpin)
      return isIPL
        ? `Drafting from ${currentSpin} — choose your player.`
        : `Drafting from ${currentSpin} — pick wisely.`
    if (phase === 'formation' && !isReviewing && !review)
      return isIPL
        ? 'Dream XI complete — review balance and get an AI cricket analysis.'
        : 'Squad complete — set your formation and get an AI review.'
    if (isReviewing) return isIPL ? 'Asking the AI cricket analyst…' : 'Running tactical analysis through AI…'
    if (review)      return isIPL ? 'Your Dream XI has been assessed.' : 'The tactical breakdown has been finalized.'
    return ''
  })()

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

      {/* ── Ambient glows ─────────────────────────────────────────── */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '-15%', left: '-8%',
          width: '500px', height: '500px',
          background: isIPL
            ? 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', right: '-8%',
          width: '600px', height: '600px',
          background: isIPL
            ? 'radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
      </div>

      {/* ── Page content ─────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>

        {/* Hero header */}
        <div className="hero-header" style={{ textAlign: 'center', padding: '28px 24px 8px' }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: isIPL ? 'rgba(59,130,246,0.08)' : 'rgba(245,158,11,0.08)',
              border: isIPL ? '1px solid rgba(59,130,246,0.2)' : '1px solid rgba(245,158,11,0.2)',
              borderRadius: '999px', padding: '6px 16px', marginBottom: '16px',
            }}
          >
            <span style={{ fontSize: '15px' }}>{isIPL ? '🏏' : '⚽'}</span>
            <span style={{
              fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: isIPL ? '#3b82f6' : '#f59e0b',
              fontFamily: 'Inter, sans-serif',
            }}>
              {isIPL ? 'Indian Premier League' : 'FIFA World Cup 2026'}
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
            {isIPL ? (
              <>
                <span style={{
                  background: 'linear-gradient(135deg, #f5f5f5 30%, #a3a3a3)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  IPL
                </span>{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #3b82f6, #60a5fa 50%, #ec4899)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  Dream XI
                </span>
              </>
            ) : (
              <>
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
              </>
            )}
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
            {subtitle}
          </motion.p>
        </div>

        {/* ── Format Selection Dashboard ─────────────────────────── */}
        {activeFormat === null && (
          <div style={{
            width: '100%',
            maxWidth: '680px',
            margin: '32px auto 60px',
            padding: '0 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              width: '100%',
            }}>
              {/* Card 1: Solo Draft */}
              <motion.button
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveFormat('solo')}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '24px',
                  padding: '32px 24px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = isIPL ? 'rgba(59,130,246,0.3)' : 'rgba(245,158,11,0.3)'
                  e.currentTarget.style.boxShadow = isIPL ? '0 12px 32px rgba(59,130,246,0.1)' : '0 12px 32px rgba(245,158,11,0.1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ fontSize: '40px' }}>{isIPL ? '🏏' : '⚽'}</div>
                <h2 style={{
                  fontSize: '20px', fontWeight: 800, color: '#f5f5f5',
                  fontFamily: 'Outfit, Inter, sans-serif', margin: 0,
                }}>
                  Solo Campaign
                </h2>
                <p style={{
                  fontSize: '13px', color: 'rgba(255,255,255,0.45)',
                  fontFamily: 'Inter, sans-serif', margin: 0, lineHeight: 1.6,
                }}>
                  Spin the wheel, draft from selected franchises, build your ultimate XI, and get graded and roasted by our AI sports tactician.
                </p>
                <div style={{
                  marginTop: '12px', padding: '10px 24px', borderRadius: '12px',
                  background: isIPL
                    ? 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
                    : 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                  color: '#0a0a0a', fontSize: '13px', fontWeight: 800,
                  fontFamily: 'Inter', textAlign: 'center', alignSelf: 'flex-start',
                }}>
                  Start Solo Draft
                </div>
              </motion.button>

              {/* Card 2: Custom Rooms */}
              <motion.button
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveFormat('multiplayer')}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '24px',
                  padding: '32px 24px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)'
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(16,185,129,0.1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ fontSize: '40px' }}>🏆</div>
                <h2 style={{
                  fontSize: '20px', fontWeight: 800, color: '#f5f5f5',
                  fontFamily: 'Outfit, Inter, sans-serif', margin: 0,
                }}>
                  Play with Friends
                </h2>
                <p style={{
                  fontSize: '13px', color: 'rgba(255,255,255,0.45)',
                  fontFamily: 'Inter, sans-serif', margin: 0, lineHeight: 1.6,
                }}>
                  Create or join custom rooms. Draft in real-time with up to 4 friends in a competitive synced Snake Draft with timers!
                </p>
                <div style={{
                  marginTop: '12px', padding: '10px 24px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#0a0a0a', fontSize: '13px', fontWeight: 800,
                  fontFamily: 'Inter', textAlign: 'center', alignSelf: 'flex-start',
                }}>
                  Launch Multiplayer
                </div>
              </motion.button>
            </div>
          </div>
        )}

        {/* ── Multiplayer Campaign Manager ───────────────────────── */}
        {activeFormat === 'multiplayer' && (
          <MultiplayerManager
            mode={mode}
            onBack={() => setActiveFormat(null)}
          />
        )}

        {/* ── Solo Campaign Flow ─────────────────────────────────── */}
        {activeFormat === 'solo' && (
          <>
            {/* Back Button */}
            <div style={{ width: '100%', maxWidth: '520px', margin: '0 auto', padding: '0 24px 8px' }}>
              <button
                onClick={() => onResetGame() || setActiveFormat(null)}
                style={{
                  background: 'none', border: 'none',
                  color: 'rgba(255,255,255,0.3)', fontSize: '12px', cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', padding: '4px 8px', borderRadius: '8px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#f55'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
              >
                ← Back to Campaign Selection
              </button>
            </div>

            {/* Progress bar: X/11 players picked */}
            <div
              aria-label={`${currentXI.length} of ${SQUAD_SIZE} players picked`}
              style={{
                width: '100%',
                maxWidth: '520px',
                margin: '0 auto 4px',
                padding: '0 24px',
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '6px',
              }}>
                <span style={{
                  fontSize: '11px', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  color: 'rgba(255,255,255,0.3)',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {isIPL ? 'Dream XI Progress' : 'Squad Progress'}
                </span>
                <span style={{
                  fontSize: '13px', fontWeight: 800,
                  color: currentXI.length >= SQUAD_SIZE ? '#f59e0b' : 'rgba(255,255,255,0.55)',
                  fontFamily: 'Outfit, Inter, sans-serif',
                  letterSpacing: '-0.02em',
                  transition: 'color 0.3s',
                }}>
                  {currentXI.length}
                  <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>
                    /{SQUAD_SIZE}
                  </span>
                </span>
              </div>
              <div style={{ height: '5px', borderRadius: '999px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                <motion.div
                  initial={false}
                  animate={{ width: `${(currentXI.length / SQUAD_SIZE) * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  style={{
                    height: '100%', borderRadius: '999px',
                    background: currentXI.length >= SQUAD_SIZE
                      ? 'linear-gradient(90deg, #f59e0b, #10b981)'
                      : isIPL
                        ? 'linear-gradient(90deg, #3b82f6, #ec4899)'
                        : 'linear-gradient(90deg, #f59e0b, #f97316)',
                    boxShadow: currentXI.length > 0 ? '0 0 8px rgba(245,158,11,0.5)' : 'none',
                  }}
                />
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                marginTop: '5px', paddingLeft: '1px', paddingRight: '1px',
              }}>
                {Array.from({ length: SQUAD_SIZE }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      background: i < currentXI.length
                        ? isIPL
                          ? 'linear-gradient(135deg, #3b82f6, #ec4899)'
                          : 'linear-gradient(135deg, #f59e0b, #f97316)'
                        : 'rgba(255,255,255,0.1)',
                      scale: i === currentXI.length - 1 ? [1, 1.4, 1] : 1,
                    }}
                    transition={{ duration: 0.35 }}
                    style={{ width: '5px', height: '5px', borderRadius: '50%' }}
                  />
                ))}
              </div>
            </div>

            {/* Spin Wheel / Formation / Review */}
            <AnimatePresence mode="wait">
              {/* Spin phase */}
              {phase === 'spinning' && (
                <motion.div
                  key="wheel"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  <SpinWheel
                    onResult={onSpinResult}
                    squadsData={squadsData}
                    excludeNations={selectedNations}
                  />
                </motion.div>
              )}

              {/* Review loading / result */}
              {(isReviewing || review) && (
                <ReviewCard
                  key="review"
                  review={review}
                  isLoading={isReviewing}
                  resetGame={onResetGame}
                  scoreLabels={SCORE_LABELS[mode]}
                  mode={mode}
                />
              )}

              {/* Formation phase — WC: FormationPicker, IPL: IPLSquadReview */}
              {phase === 'formation' && !isReviewing && !review && (
                <motion.div
                  key="formation"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.45 }}
                >
                  {isIPL ? (
                    <IPLSquadReview
                      players={currentXI}
                      balanceWarning={iplBalanceWarning}
                      onAIReview={handleAIReview}
                    />
                  ) : (
                    <FormationPicker
                      players={currentXI}
                      onAIReview={handleAIReview}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Live Squad Panel */}
            <AnimatePresence>
              {currentXI.length > 0 && phase !== 'picking' && !isReviewing && !review && (
                <SquadPanel
                  players={currentXI}
                  onReset={onResetGame}
                  mode={mode}
                />
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* ── PlayerPicker modal ── */}
      <AnimatePresence>
        {activeFormat === 'solo' && phase === 'picking' && currentSpin && (
          <PlayerPicker
            nation={currentSpin}
            position={null}
            currentXI={currentXI}
            onSelect={handlePlayerPick}
            onSkip={skipNation}
            mode={mode}
            squadsData={squadsData}
          />
        )}
      </AnimatePresence>

    </main>
  )
}
