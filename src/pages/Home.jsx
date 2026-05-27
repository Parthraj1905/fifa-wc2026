import { startTransition, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SpinWheel from '../components/SpinWheel'
import PlayerPicker from '../components/PlayerPicker'
import FormationPicker from '../components/FormationPicker'
import IPLSquadReview from '../components/IPLSquadReview'
import SquadPanel from '../components/SquadPanel'
import ReviewCard from '../components/ReviewCard'
import { reviewTeam } from '../utils/reviewTeam'
import useSquadBuilder, { SQUAD_SIZE, computeIPLBalance } from '../hooks/useSquadBuilder'
import squadsWC from '../data/squads'
import iplSquads from '../data/iplSquads'

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

  const onSpinResult = (nation) => {
    startTransition(() => { handleSpinResult(nation) })
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

  /* IPL balance warning (computed only when XI is full) */
  const iplBalanceWarning = isIPL ? computeIPLBalance(currentXI) : null

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

        {/* ── Progress bar: X/11 players picked ───────────────────── */}
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

        {/* ── Spin Wheel / Formation / Review ─────────────────────── */}
        <AnimatePresence mode="wait">

          {/* Spin phase */}
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
                squadsData={squadsData}
                /* WC: exclude already-used nations; IPL: no exclusion (wheel stays full) */
                excludeNations={isIPL ? [] : selectedNations}
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

        {/* ── Live Squad Panel ────────────────────────────────────────
             Shown in spinning + formation phases (not during review).  */}
        <AnimatePresence>
          {currentXI.length > 0 && phase !== 'picking' && !isReviewing && !review && (
            <SquadPanel
              players={currentXI}
              onReset={onResetGame}
              mode={mode}
            />
          )}
        </AnimatePresence>

      </div>

      {/* ── PlayerPicker modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {phase === 'picking' && currentSpin && (
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
