import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { dbUpdateRoom } from '../utils/firebase'
import SpinWheel from './SpinWheel'
import PlayerPicker from './PlayerPicker'
import SquadPanel from './SquadPanel'
import squadsWC from '../data/squads'
import iplSquads from '../data/iplSquads'

export default function MultiplayerDraft({ room, roomCode, localPlayerId, onLeave }) {
  const mode = room?.metadata?.mode ?? 'wc'
  const isIPL = mode === 'ipl'
  const squadsData = isIPL ? iplSquads : squadsWC

  const players = Object.values(room?.players || {}).sort((a, b) => a.order - b.order)
  const totalPlayers = players.length
  
  const gameState = room?.gameState || {}
  const { currentRound = 1, activePlayerIndex = 0, turnTimerStart = 0 } = gameState
  const spinState = gameState.spinState || { status: 'idle', targetResult: null }
  const selectedNations = gameState.selectedNations || []
  const pickedPlayerNames = gameState.pickedPlayerNames || []

  const activePlayer = players.find(p => p.order === activePlayerIndex)
  const isMyTurn = activePlayer?.id === localPlayerId
  const mySquad = room?.players?.[localPlayerId]?.squad || []

  // Calculate local wheel exclusions for the active player dynamically in real-time
  const activePlayerSquad = activePlayer?.squad || []
  const nationCounts = {}
  activePlayerSquad.forEach(p => {
    const key = isIPL ? p.team : p.nation
    if (key) nationCounts[key] = (nationCounts[key] || 0) + 1
  })
  const activePlayerExcluded = Object.keys(nationCounts).filter(key => nationCounts[key] >= 2)

  const [localSpinning, setLocalSpinning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const timerRef = useRef(null)

  // ── Turn Timer logic ──
  const timerDuration = room?.metadata?.timerDuration ?? 45
  useEffect(() => {
    if (timerDuration === 0 || !turnTimerStart) {
      setTimeLeft(0)
      return
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - turnTimerStart) / 1000)
      const left = Math.max(timerDuration - elapsed, 0)
      setTimeLeft(left)

      // Active player handles auto-drafting when timer ends
      if (left === 0 && isMyTurn) {
        handleAutoDraft()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [turnTimerStart, timerDuration, isMyTurn])

  // Synced Spinning animation trigger
  useEffect(() => {
    if (spinState.status === 'spinning' && !isMyTurn && !localSpinning) {
      // Synchronized guest spin
      setLocalSpinning(true)
      const timer = setTimeout(() => {
        setLocalSpinning(false)
      }, 3500) // Settle animation matches wheel length
      return () => clearTimeout(timer)
    }
  }, [spinState.status, isMyTurn])

  const handleActiveSpin = async (targetResult) => {
    if (!isMyTurn) return
    // Lock the spin in database
    await dbUpdateRoom(roomCode, {
      'gameState/spinState': {
        status: 'spinning',
        targetResult,
        spinStartTime: Date.now()
      }
    })
  }

  const handleSpinComplete = async (winningResult) => {
    if (!isMyTurn) return
    // Lands on winning resulting, prompt player selection phase
    await dbUpdateRoom(roomCode, {
      'gameState/spinState/status': 'settled'
    })
  }

  const handlePlayerSelect = async (player) => {
    if (!isMyTurn) return

    // 1. Prepare player object
    const playerWithTeam = isIPL 
      ? { ...player, team: spinState.targetResult } 
      : { ...player, nation: spinState.targetResult }

    // 2. Add player to my squad
    const updatedSquad = [...mySquad, playerWithTeam]

    // 3. Update database: Add player to squad, add name to picked lockout list
    const updates = {
      [`players/${localPlayerId}/squad`]: updatedSquad,
      'gameState/pickedPlayerNames': [...pickedPlayerNames, player.name]
    }

    // 4. Advance snake draft turn
    const { nextIndex, nextRound } = advanceSnakeTurn(totalPlayers, activePlayerIndex, currentRound)
    
    // Check if the overall draft has completed (all players have 11)
    const isDraftFinished = nextRound > 11
    
    updates['gameState/currentRound'] = nextRound
    updates['gameState/activePlayerIndex'] = nextIndex
    updates['gameState/turnTimerStart'] = Date.now()
    updates['gameState/spinState'] = { status: 'idle', targetResult: null, spinStartTime: 0 }

    if (isDraftFinished) {
      updates['metadata/status'] = 'simulating'
    }

    await dbUpdateRoom(roomCode, updates)
  }

  const handleSkipSpin = async () => {
    if (!isMyTurn) return
    // Reset spinState back to idle so player can spin again
    await dbUpdateRoom(roomCode, {
      'gameState/spinState': { status: 'idle', targetResult: null, spinStartTime: 0 }
    })
  }

  const handleAutoDraft = async () => {
    // Spin must settle first
    const result = spinState.targetResult || Object.keys(squadsData).filter(n => !activePlayerExcluded.includes(n))[0]
    
    // Select the first unpicked eligible player
    const pickedNames = new Set(pickedPlayerNames)
    const available = (squadsData[result] || []).find(p => !pickedNames.has(p.name))
    
    if (available) {
      handlePlayerSelect(available)
    } else {
      // No player available, skip
      await dbUpdateRoom(roomCode, {
        'gameState/activePlayerIndex': (activePlayerIndex + 1) % totalPlayers,
        'gameState/turnTimerStart': Date.now(),
        'gameState/spinState': { status: 'idle', targetResult: null, spinStartTime: 0 }
      })
    }
  }

  const advanceSnakeTurn = (playersCount, currentIndex, round) => {
    const isEvenRound = round % 2 === 0
    const isLastInRound = (!isEvenRound && currentIndex === playersCount - 1) ||
                          (isEvenRound && currentIndex === 0)
    
    let nextIndex = currentIndex
    let nextRound = round
    
    if (isLastInRound) {
      nextRound += 1
    } else {
      nextIndex = !isEvenRound ? currentIndex + 1 : currentIndex - 1
    }
    
    return { nextIndex, nextRound }
  }

  // Combine local squad with global locked list for correct modal deduction
  const syncedCurrentXI = mySquad

  return (
    <div style={{
      width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
      position: 'relative', minHeight: '80vh',
    }}>
      
      {/* ── Synced HUD ── */}
      <div style={{
        width: '100%', maxWidth: '520px', padding: '16px 20px 8px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700, fontFamily: 'Inter' }}>
            Round {currentRound}/11
          </span>
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#f5f5f5', fontFamily: 'Outfit, Inter', marginTop: '2px' }}>
            {isMyTurn ? '🌟 Your Turn' : `⏳ ${activePlayer?.name}'s Turn`}
          </span>
        </div>

        {/* Turn Timer Display */}
        {timerDuration > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '6px 12px', borderRadius: '10px',
            background: timeLeft <= 10 ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${timeLeft <= 10 ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
            color: timeLeft <= 10 ? '#f87171' : 'rgba(255,255,255,0.6)',
            fontSize: '13px', fontWeight: 800, fontFamily: 'Outfit, Inter',
          }}>
            ⏱️ {timeLeft}s
          </div>
        )}
      </div>

      {/* ── Active board showing spinning or synced viewers ── */}
      <div style={{ width: '100%', zIndex: 1, position: 'relative' }}>
        {spinState.status !== 'settled' && (
          <div style={{ position: 'relative' }}>
            {/* Viewer Overlay Shield */}
            {!isMyTurn && (
              <div style={{
                position: 'absolute', inset: 0, zIndex: 20,
                background: 'rgba(0,0,0,0.4)', borderRadius: '24px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', padding: '24px', pointerEvents: 'all',
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎰</div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#f5f5f5', fontFamily: 'Outfit, Inter', margin: '0 0 4px' }}>
                  Live Spin Sync
                </h3>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontFamily: 'Inter', margin: 0 }}>
                  {spinState.status === 'spinning'
                    ? `Watching the wheel spin for ${activePlayer?.name}…`
                    : `Waiting for ${activePlayer?.name} to spin the wheel…`}
                </p>
              </div>
            )}

            <SpinWheel
              onResult={(res) => {
                handleActiveSpin(res)
                handleSpinComplete(res)
              }}
              squadsData={squadsData}
              excludeNations={activePlayerExcluded}
            />
          </div>
        )}
      </div>

      {/* ── Live Roster panel ── */}
      {mySquad.length > 0 && spinState.status !== 'settled' && (
        <SquadPanel
          players={mySquad}
          onReset={onLeave}
          mode={mode}
        />
      )}

      {/* ── Player Selection Synced Modal ── */}
      <AnimatePresence>
        {spinState.status === 'settled' && (
          <div style={{ position: 'relative', width: '100%', zIndex: 100 }}>
            {/* Viewers Picker overlay */}
            {!isMyTurn && (
              <div style={{
                position: 'fixed', inset: 0, zIndex: 110,
                background: 'rgba(0,0,0,0.85)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', padding: '24px',
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>👁️</div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#f5f5f5', fontFamily: 'Outfit, Inter', margin: '0 0 4px' }}>
                  Choosing Player
                </h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter', margin: 0 }}>
                  {activePlayer?.name} is drafting from <strong style={{ color: '#f59e0b' }}>{spinState.targetResult}</strong>…
                </p>
              </div>
            )}

            <PlayerPicker
              nation={spinState.targetResult}
              position={null}
              // Combines local squad (for position limits) with global locks (to prevent duplicates)
              currentXI={[
                ...mySquad,
                ...pickedPlayerNames
                  .filter(name => !mySquad.some(p => p.name === name))
                  .map(name => ({ name, position: 'DUMMY', role: 'DUMMY' }))
              ]}
              onSelect={handlePlayerSelect}
              onSkip={handleSkipSpin}
              mode={mode}
              squadsData={squadsData}
            />
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
