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
            score1: Number(res.balanceScore ?? 5),
            score2: Number(res.formationScore ?? 5),
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
        const score1 = parseFloat(review?.score1) || 5
        const score2 = parseFloat(review?.score2) || 5
        const avg = (score1 + score2) / 2
        return { ...p, avgScore: avg }
      }).sort((a, b) => b.avgScore - a.avgScore)

      const teamA = ratedPlayers[0]
      const teamB = ratedPlayers[1] || ratedPlayers[0] // fallback if solo

      const scoreAWeight = teamA.avgScore
      const scoreBWeight = teamB.avgScore
      const totalWeight = scoreAWeight + scoreBWeight

      // Win Probability
      const winProbA = scoreAWeight / totalWeight
      const winnerIsA = Math.random() < winProbA
      const winner = winnerIsA ? teamA : teamB
      const loser = winnerIsA ? teamB : teamA

      // Extract player categories helper
      const getRandomPlayer = (squad, categories = []) => {
        if (!squad || squad.length === 0) return 'Star Player'
        let pool = squad
        if (categories.length > 0) {
          pool = squad.filter(p => {
            const val = (p.role || p.position || '').toUpperCase()
            return categories.some(cat => val.includes(cat.toUpperCase()))
          })
          if (pool.length === 0) pool = squad
        }
        return pool[Math.floor(Math.random() * pool.length)]?.name || 'Star Player'
      }

      const events = []
      let scoreLineText = ''
      let headlineText = ''

      if (isIPL) {
        // Cricket simulation
        const winnerBattedFirst = Math.random() < 0.5
        const ratingGap = winner.avgScore - loser.avgScore // favorite score - underdog score
        
        let winnerRuns, winnerWickets, loserRuns, loserWickets
        let marginText = ''
        
        const batsmanWinner = getRandomPlayer(winner.squad, ['BAT', 'WK', 'AR'])
        const batsmanLoser = getRandomPlayer(loser.squad, ['BAT', 'WK', 'AR'])
        const bowlerWinner = getRandomPlayer(winner.squad, ['BWL', 'AR'])
        const bowlerLoser = getRandomPlayer(loser.squad, ['BWL', 'AR'])

        if (winnerBattedFirst) {
          // Winner bats first
          winnerRuns = 155 + Math.floor(winner.avgScore * 6) + Math.floor(Math.random() * 25)
          winnerWickets = Math.floor(Math.random() * 5) + 3 // 3 to 7
          
          let marginRuns
          if (winnerIsA) {
            // Favorite wins (15 to 55 runs margin)
            marginRuns = Math.floor(12 + ratingGap * 24 + Math.random() * 15)
          } else {
            // Underdog wins (tight: 2 to 12 runs margin)
            marginRuns = Math.floor(2 + Math.random() * 10)
          }
          
          loserRuns = winnerRuns - marginRuns
          loserWickets = Math.floor(Math.random() * 3) + 7 // 7 to 10 wickets
          marginText = `${marginRuns} runs`
        } else {
          // Loser bats first, winner chases
          loserRuns = 145 + Math.floor(loser.avgScore * 5) + Math.floor(Math.random() * 20)
          loserWickets = Math.floor(Math.random() * 4) + 4 // 4 to 7
          
          winnerRuns = loserRuns + Math.floor(Math.random() * 4) + 1 // target achieved
          
          let wicketsLeft
          if (winnerIsA) {
            // Favorite wins (wins by 4 to 7 wickets)
            wicketsLeft = Math.floor(4 + ratingGap * 3 + Math.random() * 2)
            wicketsLeft = Math.min(Math.max(wicketsLeft, 2), 7)
          } else {
            // Underdog wins (thriller: wins by 1 to 3 wickets)
            wicketsLeft = Math.floor(1 + Math.random() * 2)
          }
          winnerWickets = 10 - wicketsLeft
          marginText = `${wicketsLeft} wickets`
        }

        // Format scoreLine: keep A vs B order stable
        const runsA = teamA.id === winner.id ? winnerRuns : loserRuns
        const wicketsA = teamA.id === winner.id ? winnerWickets : loserWickets
        const runsB = teamB.id === winner.id ? winnerRuns : loserRuns
        const wicketsB = teamB.id === winner.id ? winnerWickets : loserWickets
        scoreLineText = `${runsA}/${wicketsA} vs ${runsB}/${wicketsB}`

        events.push(`🏏 The Grand Finale is underway! ${winnerBattedFirst ? winner.name : loser.name}'s XI won the toss and elected to bat first.`)
        
        // Mid-innings milestones
        const scoreType = winnerRuns >= 185 && Math.random() < 0.45 ? 'CENTURY' : 'FIFTY'
        if (scoreType === 'CENTURY') {
          events.push(`🔥 Spectacular Century! ${batsmanWinner} plays an absolute masterclass, scoring 102* off just 54 balls to single-handedly drive the innings!`)
        } else {
          events.push(`💥 Milestone! ${batsmanWinner} anchors the innings beautifully, raising his bat for a blistering 68 off 38 deliveries!`)
        }

        // Bowling highlights in 1st innings
        events.push(`☝️ Sensational Bowling! ${bowlerLoser} strikes back, picking up a crucial 3-wicket haul to keep the score in check.`)
        
        events.push(`🏁 Innings complete! ${winnerBattedFirst ? winner.name : loser.name}'s XI scores ${winnerBattedFirst ? winnerRuns : loserRuns}/${winnerBattedFirst ? winnerWickets : loserWickets}. Target: ${winnerBattedFirst ? loserRuns + 1 : winnerRuns} runs.`)
        
        // 2nd Innings chase key moments
        events.push(`⚡ The Chase is on! ${batsmanLoser} leads the charge for ${winnerBattedFirst ? loser.name : winner.name}'s XI, bringing up a courageous fifty (54 off 31 balls).`)
        
        const wktsWinnerBowling = Math.floor(Math.random() * 2) + 3 // 3 or 4 wickets
        const runsWinnerBowling = Math.floor(Math.random() * 15) + 15
        events.push(`🎯 Match-winning Spell! ${bowlerWinner} steps up when it matters most, delivering a lethal spell of ${wktsWinnerBowling}/${runsWinnerBowling} in the death overs.`)

        if (winnerBattedFirst) {
          events.push(`🏁 Clinical Bowling! ${winner.name}'s XI successfully defends the total, bowling out the opposition to seal the trophy!`)
          headlineText = `${winner.name}'s XI wins by ${marginText}!`
        } else {
          events.push(`🏁 Thrilling Finish! ${winner.name}'s XI chases down the target in a nail-biting final over!`)
          headlineText = `${winner.name}'s XI wins by ${marginText}!`
        }

        await dbUpdateRoom(roomCode, {
          'results/matchSimulation': {
            scoreLine: scoreLineText,
            winnerId: winner.id,
            winnerName: winner.name,
            events,
            headline: headlineText
          },
          'metadata/status': 'ended'
        })
      } else {
        // FIFA Football Commentary
        const ratingGap = winner.avgScore - loser.avgScore
        let goalsWinner, goalsLoser
        
        if (winnerIsA) {
          // Favorite wins (1 to 3 goals)
          if (ratingGap > 1.2 && Math.random() < 0.35) {
            goalsWinner = 3 + Math.floor(Math.random() * 2) // 3 or 4
            goalsLoser = Math.floor(Math.random() * 2)
          } else {
            goalsWinner = Math.floor(Math.random() * 2) + 1 // 1 or 2
            goalsLoser = Math.floor(Math.random() * goalsWinner)
          }
        } else {
          // Underdog wins (always by 1 goal)
          goalsWinner = Math.floor(Math.random() * 2) + 1 // 1 or 2
          goalsLoser = goalsWinner - 1
        }

        const scorerWinner = getRandomPlayer(winner.squad, ['FWD', 'MID', 'ST', 'LW', 'RW'])
        const scorerWinnerSecondary = getRandomPlayer(winner.squad, ['FWD', 'MID', 'ST', 'LW', 'RW'])
        const scorerLoser = getRandomPlayer(loser.squad, ['FWD', 'MID', 'ST', 'LW', 'RW'])
        const cardLoser = getRandomPlayer(loser.squad, ['DEF', 'MID', 'CB', 'LB', 'RB'])

        const goalsA = teamA.id === winner.id ? goalsWinner : goalsLoser
        const goalsB = teamB.id === winner.id ? goalsWinner : goalsLoser
        scoreLineText = `${goalsA} - ${goalsB}`

        events.push(`⚽ The whistle blows! The Grand Final between ${teamA.name}'s XI and ${teamB.name}'s XI is officially underway!`)
        events.push(`🥅 GOAL! ${scorerWinner} breaks the deadlock in the 24th minute with a spectacular curling shot into the top-right corner!`)
        
        if (goalsLoser > 0) {
          events.push(`🥅 GOAL! ${loser.name}'s squad responds! ${scorerLoser} slots it coolly past the keeper in the 56th minute to equalize.`)
        }
        
        if (Math.random() < 0.45) {
          events.push(`🟥 RED CARD! ${cardLoser} is sent off in the 71st minute for a dangerous high-boot challenge! ${loser.name}'s XI is down to 10 men!`)
        } else if (Math.random() < 0.4) {
          events.push(`🥅 PENALTY! A penalty is awarded to ${winner.name}'s XI in the 63rd minute! ${scorerWinnerSecondary} steps up and hammers it home!`)
        } else {
          events.push(`🟨 Yellow Card! ${cardLoser} is booked in the 43rd minute after a cynical tactical foul to stop a dangerous counterattack.`)
        }

        if (goalsWinner > 1 && goalsWinner > goalsLoser + 1) {
          events.push(`🥅 GOAL! What a beauty! ${scorerWinnerSecondary} seals the championship in the 85th minute with a thunderous volley from outside the box!`)
        }

        events.push(`🏁 Full Time! A high-octane tactical match concludes. Final score: ${goalsWinner} - ${goalsLoser}!`)
        headlineText = `${winner.name}'s XI clinches the tactical victory!`

        await dbUpdateRoom(roomCode, {
          'results/matchSimulation': {
            scoreLine: scoreLineText,
            winnerId: winner.id,
            winnerName: winner.name,
            events,
            headline: headlineText
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
  const sortSquadPlayers = (squad, isIPL) => {
    if (!squad) return []
    const copy = [...squad]
    if (isIPL) {
      const roleOrder = { WK: 0, BAT: 1, AR: 2, BWL: 3 }
      return copy.sort((a, b) => {
        const orderA = roleOrder[a.role] ?? 9
        const orderB = roleOrder[b.role] ?? 9
        return orderA - orderB
      })
    } else {
      const posOrder = {
        GK: 0,
        CB: 1, LB: 2, RB: 3, DEF: 4,
        CM: 5, CDM: 6, CAM: 7, MID: 8,
        ST: 9, LW: 10, RW: 11, FWD: 12
      }
      return copy.sort((a, b) => {
        const orderA = posOrder[a.position] ?? 99
        const orderB = posOrder[b.position] ?? 99
        return orderA - orderB
      })
    }
  }

  const ratedPlayers = players.map(p => {
    const review = aiReviews[p.id]
    const score1 = parseFloat(review?.score1) || 5
    const score2 = parseFloat(review?.score2) || 5
    const avg = (score1 + score2) / 2
    return { ...p, avgScore: avg }
  }).sort((a, b) => b.avgScore - a.avgScore)

  const teamA = ratedPlayers[0]
  const teamB = ratedPlayers[1] || ratedPlayers[0]

  const sortedPodium = Object.values(aiReviews).sort((a, b) => {
    // If we have match simulation, rank the winner at index 0
    if (matchSimulation) {
      if (a.playerName === matchSimulation.winnerName) return -1
      if (b.playerName === matchSimulation.winnerName) return 1
    }

    const scoreA1 = parseFloat(a.score1) || 5
    const scoreA2 = parseFloat(a.score2) || 5
    const scoreB1 = parseFloat(b.score1) || 5
    const scoreB2 = parseFloat(b.score2) || 5
    const avgA = (scoreA1 + scoreA2) / 2
    const avgB = (scoreB1 + scoreB2) / 2
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

      {/* ── Side-by-Side Playing 11 ── */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '20px',
        padding: '20px 16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        <h3 style={{
          fontSize: '11px', color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          fontWeight: 800, fontFamily: 'Inter, sans-serif',
          textAlign: 'center', marginBottom: '16px',
        }}>
          📋 Side-by-Side Playing 11
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}>
          {/* Team A */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '8px',
            borderRight: '1px solid rgba(255,255,255,0.05)',
            paddingRight: '8px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              paddingBottom: '8px', marginBottom: '4px',
            }}>
              <span style={{ fontSize: '20px' }}>{teamA?.avatar}</span>
              <span style={{
                fontSize: '12px', fontWeight: 800, color: '#f59e0b',
                fontFamily: 'Outfit, Inter', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
              }} title={teamA?.name}>
                {teamA?.name}'s XI
              </span>
            </div>
            {sortSquadPlayers(teamA?.squad, isIPL).map((p, idx) => {
              const roleLabel = isIPL ? p.role : p.position
              const roleIcon = isIPL 
                ? (p.role === 'WK' ? '🧤' : p.role === 'BAT' ? '🏏' : p.role === 'AR' ? '⚡' : '🔴')
                : (p.position === 'GK' ? '🧤' : ['CB', 'LB', 'RB', 'DEF'].some(pos => p.position.includes(pos)) ? '🛡️' : ['CM', 'CDM', 'CAM', 'MID'].some(pos => p.position.includes(pos)) ? '⚽' : '🔥')

              return (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '6px 8px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid rgba(255,255,255,0.03)',
                  fontSize: '11px', color: 'rgba(255,255,255,0.85)',
                  fontFamily: 'Inter', gap: '4px', minWidth: 0
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 0, flex: 1 }}>
                    <span>{roleIcon}</span>
                    <span style={{
                      fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }} title={p.name}>
                      {p.name}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '9px', fontWeight: 800,
                    background: 'rgba(255,255,255,0.06)',
                    padding: '2px 5px', borderRadius: '4px',
                    color: 'rgba(255,255,255,0.5)',
                  }}>
                    {roleLabel}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Team B */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '8px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              paddingBottom: '8px', marginBottom: '4px',
            }}>
              <span style={{ fontSize: '20px' }}>{teamB?.avatar}</span>
              <span style={{
                fontSize: '12px', fontWeight: 800, color: '#3b82f6',
                fontFamily: 'Outfit, Inter', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
              }} title={teamB?.name}>
                {teamB?.name}'s XI
              </span>
            </div>
            {sortSquadPlayers(teamB?.squad, isIPL).map((p, idx) => {
              const roleLabel = isIPL ? p.role : p.position
              const roleIcon = isIPL 
                ? (p.role === 'WK' ? '🧤' : p.role === 'BAT' ? '🏏' : p.role === 'AR' ? '⚡' : '🔴')
                : (p.position === 'GK' ? '🧤' : ['CB', 'LB', 'RB', 'DEF'].some(pos => p.position.includes(pos)) ? '🛡️' : ['CM', 'CDM', 'CAM', 'MID'].some(pos => p.position.includes(pos)) ? '⚽' : '🔥')

              return (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '6px 8px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid rgba(255,255,255,0.03)',
                  fontSize: '11px', color: 'rgba(255,255,255,0.85)',
                  fontFamily: 'Inter', gap: '4px', minWidth: 0
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 0, flex: 1 }}>
                    <span>{roleIcon}</span>
                    <span style={{
                      fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }} title={p.name}>
                      {p.name}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '9px', fontWeight: 800,
                    background: 'rgba(255,255,255,0.06)',
                    padding: '2px 5px', borderRadius: '4px',
                    color: 'rgba(255,255,255,0.5)',
                  }}>
                    {roleLabel}
                  </span>
                </div>
              )
            })}
          </div>
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
