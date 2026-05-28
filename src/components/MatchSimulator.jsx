import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { dbUpdateRoom } from '../utils/firebase'
import { reviewTeam } from '../utils/reviewTeam'
import ReviewCard from './ReviewCard'

export default function MatchSimulator({ room, roomCode, localPlayerId, onLeave }) {
  const mode = room?.metadata?.mode ?? 'wc'
  const isIPL = room?.metadata?.mode === 'ipl'
  
  const players = Object.values(room?.players || {}).sort((a, b) => a.order - b.order)
  const localPlayer = room?.players?.[localPlayerId]
  const isHost = room?.metadata?.hostId === localPlayerId

  const aiReviews = room?.results?.aiReviews || {}
  const matchSimulation = room?.results?.matchSimulation || null

  const playAgainStates = room?.gameState?.playAgain || {}
  const rematchCount = Object.values(playAgainStates).filter(Boolean).length
  const totalInRoom = players.length
  const hasRequestedRematch = !!playAgainStates[localPlayerId]

  const [localReviewing, setLocalReviewing] = useState(false)
  const [error, setError] = useState('')

  // 1. Trigger AI Review on mount for the local player if not already done
  useEffect(() => {
    if (!localPlayer || aiReviews[localPlayerId] || localReviewing) return

    const getAIReview = async () => {
      setLocalReviewing(true)
      try {
        // Construct mock/null formation for IPL, or default "4-3-3" for WC
        const formation = isIPL ? null : '4-3-3'
        const res = await reviewTeam(localPlayer.squad || [], formation, mode)
        
        // Write local review to DB with correct keys balanceScore & formationScore
        await dbUpdateRoom(roomCode, {
          [`results/aiReviews/${localPlayerId}`]: {
            playerName: localPlayer.name,
            avatar: localPlayer.avatar,
            score1: res.balanceScore ?? 5,
            score2: res.formationScore ?? 5,
            tactical: res.tactical ?? 'Tactical analysis loading...',
            roast: res.roast ?? 'One roast line loading...'
          }
        })
      } catch (err) {
        console.error('AI Review failed:', err)
        setError('Failed to load your AI review. Please retry.')
      } finally {
        setLocalReviewing(false)
      }
    }

    getAIReview()
  }, [localPlayerId, !!aiReviews[localPlayerId]])

  // 2. Host simulates the match once ALL player reviews are written to the database
  const allReviewsReceived = players.every(p => aiReviews[p.id])
  
  useEffect(() => {
    if (!isHost || !allReviewsReceived || matchSimulation) return

    const runMatchSimulation = async () => {
      // Find top two players by average AI score
      const ratedPlayers = players.map(p => {
        const review = aiReviews[p.id]
        const avg = ((review.score1 || 5) + (review.score2 || 5)) / 2
        return { ...p, avgScore: avg }
      }).sort((a, b) => b.avgScore - a.avgScore)

      const teamA = ratedPlayers[0]
      const teamB = ratedPlayers[1] || ratedPlayers[0] // fallback if solo

      const scoreAWeight = teamA.avgScore
      const scoreBWeight = teamB.avgScore
      const totalWeight = scoreAWeight + scoreBWeight

      // Win Probability
      const winProbA = scoreAWeight / totalWeight
      
      // Determine final scoreline
      let goalsA = 0
      let goalsB = 0
      
      if (Math.random() < winProbA) {
        goalsA = Math.floor(Math.random() * 3) + 2 // 2 to 4
        goalsB = Math.floor(Math.random() * goalsA)
      } else {
        goalsB = Math.floor(Math.random() * 3) + 2
        goalsA = Math.floor(Math.random() * goalsB)
      }

      // Generate dynamic match commentary pull from their drafted squad lists!
      const squadA = teamA.squad || []
      const squadB = teamB.squad || []

      const getPlayerA = () => squadA[Math.floor(Math.random() * squadA.length)]?.name || 'Star Player'
      const getPlayerB = () => squadB[Math.floor(Math.random() * squadB.length)]?.name || 'Star Player'

      const events = []
      
      if (isIPL) {
        // IPL Cricket Commentary
        const runsA = goalsA * 45 + 100 // Scale score
        const runsB = goalsB * 45 + 100
        const wicketsA = Math.floor(Math.random() * 8)
        const wicketsB = Math.floor(Math.random() * 8)

        events.push(`🏏 The match begins between ${teamA.name}'s XI and ${teamB.name}'s XI!`)
        events.push(`🔥 5.2 Ov: ${getPlayerA()} smashes a glorious boundary through extra cover!`)
        events.push(`☝️ 9.4 Ov: OUT! ${getPlayerB()} takes a stunning diving catch behind the stumps!`)
        events.push(`💥 14.1 Ov: Huge six! ${getPlayerA()} sends the ball flying straight into the top tier!`)
        events.push(`🏁 Innings complete! ${teamA.name}'s XI: ${runsA}/${wicketsA} | ${teamB.name}'s XI: ${runsB}/${wicketsB}`)
        
        const winner = runsA >= runsB ? teamA : teamB
        const margin = Math.abs(runsA - runsB)

        await dbUpdateRoom(roomCode, {
          'results/matchSimulation': {
            scoreLine: `${runsA}/${wicketsA} vs ${runsB}/${wicketsB}`,
            winnerId: winner.id,
            winnerName: winner.name,
            events,
            headline: `${winner.name}'s XI wins a thriller by ${runsA >= runsB ? margin + ' runs' : ' wickets'}!`
          },
          'metadata/status': 'ended'
        })
      } else {
        // FIFA Football Commentary
        events.push(`⚽ The whistle blows! Grand Final between ${teamA.name}'s XI and ${teamB.name}'s XI is underway!`)
        events.push(`🔥 18' Close call! ${getPlayerA()} fires a powerful header, but it clips the crossbar!`)
        
        if (goalsA > 0) {
          events.push(`🥅 34' GOAL! ${getPlayerA()} breaks the deadlock with a brilliant curling shot!`)
        }
        if (goalsB > 0) {
          events.push(`🥅 58' GOAL! ${teamB.name}'s squad responds! ${getPlayerB()} slots it coolly past the keeper!`)
        }
        if (goalsA > 1) {
          events.push(`🥅 78' GOAL! ${getPlayerA()} scores a spectacular volley to double the lead!`)
        }
        
        events.push(`🏁 Full Time! A high-octane tactical match concludes!`)
        
        const winner = goalsA >= goalsB ? teamA : teamB
        
        await dbUpdateRoom(roomCode, {
          'results/matchSimulation': {
            scoreLine: `${goalsA} - ${goalsB}`,
            winnerId: winner.id,
            winnerName: winner.name,
            events,
            headline: `${winner.name}'s XI clinches the tactical victory!`
          },
          'metadata/status': 'ended'
        })
      }
    }

    runMatchSimulation()
  }, [isHost, allReviewsReceived, !!matchSimulation])

  // 3. Host: reset room back to lobby when everyone requests Play Again
  useEffect(() => {
    if (!isHost || totalInRoom === 0 || rematchCount < totalInRoom) return

    const resetRoomForRematch = async () => {
      const updates = {
        'metadata/status': 'lobby',
        'gameState/currentRound': 1,
        'gameState/activePlayerIndex': 0,
        'gameState/turnTimerStart': 0,
        'gameState/spinState': { status: 'idle', targetResult: null, spinStartTime: 0 },
        'gameState/pickedPlayerNames': [],
        'gameState/selectedNations': [],
        'gameState/playAgain': null,
        'results': null
      }
      players.forEach(p => {
        updates[`players/${p.id}/squad`] = []
        updates[`players/${p.id}/isReady`] = p.id === room.metadata.hostId ? true : false
      })
      await dbUpdateRoom(roomCode, updates)
    }

    const timer = setTimeout(resetRoomForRematch, 500)
    return () => clearTimeout(timer)
  }, [isHost, rematchCount, totalInRoom])

  const handleRequestRematch = async () => {
    await dbUpdateRoom(roomCode, {
      [`gameState/playAgain/${localPlayerId}`]: true
    })
  }

  // 4. Render Synced Review/Simulation state loading
  if (!allReviewsReceived || !matchSimulation) {
    return (
      <div style={{
        width: '100%', maxWidth: '420px', margin: '60px auto',
        padding: '0 20px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '20px', textAlign: 'center',
      }}>
        <div className="pulse-hub" style={{ fontSize: '64px', animation: 'pulse 1.8s infinite ease-in-out' }}>
          🧠
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#f5f5f5', fontFamily: 'Outfit, Inter', margin: 0 }}>
          Calculating AI Reviews
        </h2>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', fontFamily: 'Inter', margin: 0, lineHeight: 1.6 }}>
          Asking the AI Analyst to rate all squads and calculate the match simulation. Please hold tight...
        </p>

        {/* Players loading grid */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
          {players.map(p => {
            const hasReview = !!aiReviews[p.id]
            return (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{p.avatar}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#f5f5f5', fontFamily: 'Inter' }}>
                    {p.name}
                  </span>
                </div>
                <span style={{
                  fontSize: '11px', fontWeight: 700,
                  color: hasReview ? '#10b981' : '#f59e0b',
                  fontFamily: 'Inter',
                }}>
                  {hasReview ? '✓ Reviewed' : '⏳ Thinking…'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // 5. Render Final Leaderboard, Reviews & Match Simulation Timeline!
  const sortedPodium = Object.values(aiReviews).sort((a, b) => {
    const avgA = (a.score1 + a.score2) / 2
    const avgB = (b.score1 + b.score2) / 2
    return avgB - avgA
  })

  return (
    <div style={{
      width: '100%', maxWidth: '520px', margin: '24px auto 60px',
      padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '24px',
    }}>
      
      {/* ── Match Score Arena card ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(255,255,255,0.02) 100%)',
        border: '1px solid rgba(245,158,11,0.22)',
        borderRadius: '24px', padding: '24px 20px',
        boxShadow: '0 20px 48px rgba(0,0,0,0.6)',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          padding: '4px 14px', borderRadius: '0 0 10px 10px',
          background: 'rgba(245,158,11,0.15)',
          border: '1px solid rgba(245,158,11,0.25)',
          borderTop: 'none',
          fontSize: '9px', fontWeight: 800, color: '#f59e0b',
          fontFamily: 'Inter', letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          Simulated Match Final Result
        </div>

        <h1 style={{
          fontSize: '44px', fontWeight: 900, margin: '20px 0 6px',
          fontFamily: 'Outfit, Inter', color: '#f5f5f5', letterSpacing: '0.04em',
          textShadow: '0 0 24px rgba(255,255,255,0.1)',
        }}>
          {matchSimulation.scoreLine}
        </h1>
        <p style={{
          fontSize: '14px', fontWeight: 700, color: '#f59e0b',
          fontFamily: 'Inter', margin: 0,
        }}>
          🏆 {matchSimulation.headline}
        </p>

        {/* Live Match Commentary feed */}
        <div style={{
          marginTop: '20px', background: 'rgba(0,0,0,0.25)',
          borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)',
          padding: '12px 14px', textAlign: 'left',
          display: 'flex', flexDirection: 'column', gap: '8px',
        }}>
          {matchSimulation.events.map((evt, idx) => (
            <p key={idx} style={{
              fontSize: '11px', color: 'rgba(255,255,255,0.6)',
              fontFamily: 'Inter', margin: 0, lineHeight: 1.4,
            }}>
              {evt}
            </p>
          ))}
        </div>
      </div>

      {/* ── Synced AI review card carousel ── */}
      <div>
        <h3 style={{
          fontSize: '11px', color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          fontWeight: 700, fontFamily: 'Inter', marginBottom: '12px',
          paddingLeft: '4px',
        }}>
          Participant AI Ratings &amp; Roasts
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sortedPodium.map((rev, idx) => {
            const avg = ((rev.score1 + rev.score2) / 2).toFixed(1)
            return (
              <div key={rev.playerName} style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px', padding: '16px 18px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '32px' }}>{rev.avatar}</span>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#f5f5f5', margin: 0, fontFamily: 'Outfit, Inter' }}>
                        {rev.playerName}
                      </h4>
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', fontFamily: 'Inter' }}>
                        Rank #{idx + 1}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '18px', fontWeight: 900, color: '#f59e0b', fontFamily: 'Outfit, Inter' }}>
                      {avg}
                    </span>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', fontFamily: 'Inter', display: 'block' }}>
                      Avg AI Score
                    </span>
                  </div>
                </div>

                {/* Score breakdown metrics */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '6px 8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontFamily: 'Inter' }}>
                      {isIPL ? 'Batting' : 'Balance'}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#f5f5f5', fontFamily: 'Outfit', display: 'block', marginTop: '2px' }}>
                      {rev.score1}/10
                    </span>
                  </div>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '6px 8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontFamily: 'Inter' }}>
                      {isIPL ? 'Bowling' : 'Tactics'}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#f5f5f5', fontFamily: 'Outfit', display: 'block', marginTop: '2px' }}>
                      {rev.score2}/10
                    </span>
                  </div>
                </div>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '12px' }} />

                <p style={{
                  fontSize: '11px', color: '#ffb0b0', fontStyle: 'italic',
                  background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.12)',
                  padding: '8px 10px', borderRadius: '8px', margin: '0 0 10px',
                  fontFamily: 'Inter, sans-serif', lineHeight: 1.4,
                }}>
                  🔥 {rev.roast}
                </p>

                <p style={{
                  fontSize: '11px', color: 'rgba(255,255,255,0.5)',
                  fontFamily: 'Inter, sans-serif', margin: 0, lineHeight: 1.5,
                }}>
                  {rev.tactical}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Rematch Actions ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {hasRequestedRematch ? (
          <button
            disabled
            className="pulse-rematch-btn"
            style={{
              width: '100%', padding: '16px', borderRadius: '12px',
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.3)',
              color: '#10b981', fontSize: '14px', fontWeight: 800,
              fontFamily: 'Inter, sans-serif', textTransform: 'uppercase',
              letterSpacing: '0.04em', cursor: 'not-allowed',
            }}
          >
            ⏳ Rematch Requested ({rematchCount}/{totalInRoom} players)
          </button>
        ) : (
          <button
            onClick={handleRequestRematch}
            style={{
              width: '100%', padding: '16px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none', color: '#0a0a0a', fontSize: '14px', fontWeight: 800,
              fontFamily: 'Inter, sans-serif', textTransform: 'uppercase',
              letterSpacing: '0.04em', cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(16,185,129,0.2)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            🔄 Play Again / Rematch
          </button>
        )}

        <button
          onClick={onLeave}
          style={{
            width: '100%', padding: '14px', borderRadius: '12px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 700,
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
        >
          ↺ Exit to Main Selection
        </button>
      </div>

    </div>
  )
}
