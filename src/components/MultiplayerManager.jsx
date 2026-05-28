import { useState, useEffect, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { dbSubscribeRoom, dbUpdateRoom, dbCreateRoom, dbJoinRoom, isDemo } from '../utils/firebase'
import MultiplayerLobby from './MultiplayerLobby'
import MultiplayerDraft from './MultiplayerDraft'
import MatchSimulator from './MatchSimulator'

// Stable player ID in sessionStorage
const getLocalPlayerId = () => {
  let id = sessionStorage.getItem('mp_player_id')
  if (!id) {
    id = 'usr_' + Math.random().toString(36).substring(2, 9).toUpperCase()
    sessionStorage.setItem('mp_player_id', id)
  }
  return id
}

const AVATARS = ['🦁', '🐼', '🐯', '🦊', '🐨', '🦅', '🦈', '🐉']
const RANDOM_NAMES = ['Captain Cool', 'Master Blaster', 'Goal Machine', 'Super Striker', 'Tiki Taka', 'Fast Bowler', 'Power Hitter', 'Wall']

export default function MultiplayerManager({ mode = 'wc', onBack }) {
  const [localPlayer, setLocalPlayer] = useState(() => {
    const id = getLocalPlayerId()
    const randName = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)]
    const randAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)]
    return { id, name: randName, avatar: randAvatar }
  })

  const [roomCode, setRoomCode] = useState('')
  const [room, setRoom] = useState(null)
  const [error, setError] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Subscribe to room updates once connected
  useEffect(() => {
    if (!roomCode || !room) return
    const unsub = dbSubscribeRoom(roomCode, (updatedRoom) => {
      setRoom(updatedRoom)
    })
    return () => unsub()
  }, [roomCode, !!room])

  const handleCreateRoom = async (settings) => {
    setIsConnecting(true)
    setError('')
    try {
      const code = Math.random().toString(36).substring(2, 6).toUpperCase()
      const host = { ...localPlayer, isReady: true }
      await dbCreateRoom(code, host, { ...settings, mode })
      setRoomCode(code)
      setRoom({
        metadata: { mode, status: 'lobby', hostId: host.id, timerDuration: settings.timerDuration, createdAt: Date.now() },
        players: { [host.id]: { ...host, joinedAt: Date.now(), order: 0, squad: [] } },
        gameState: { currentRound: 1, activePlayerIndex: 0, turnTimerStart: 0, isReversed: false, selectedNations: [], pickedPlayerNames: [], spinState: { status: 'idle', targetResult: null, spinStartTime: 0 } }
      })
    } catch (err) {
      console.error(err)
      setError('Failed to create room. Please try again.')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleJoinRoom = async (code) => {
    const cleanedCode = code.trim().toUpperCase()
    if (cleanedCode.length !== 4) {
      setError('Room code must be exactly 4 letters.')
      return
    }
    setIsConnecting(true)
    setError('')
    try {
      const guest = { ...localPlayer, isReady: false }
      const roomData = await dbJoinRoom(cleanedCode, guest)
      setRoomCode(cleanedCode)
      setRoom(roomData)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to join room. Verify the code and try again.')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleLeaveRoom = async () => {
    if (!roomCode) return
    try {
      const playersUpdate = { ...room.players }
      delete playersUpdate[localPlayer.id]
      
      if (Object.keys(playersUpdate).length === 0) {
        // Deleted last player, clear room
        await dbUpdateRoom(roomCode, { players: null, metadata: null })
      } else {
        const nextHostId = room.metadata.hostId === localPlayer.id ? Object.keys(playersUpdate)[0] : room.metadata.hostId
        await dbUpdateRoom(roomCode, {
          [`players/${localPlayer.id}`]: null,
          'metadata/hostId': nextHostId
        })
      }
    } catch (err) {
      console.error(err)
    }
    setRoom(null)
    setRoomCode('')
  }

  // Render Setup / Connection Interface
  if (!room) {
    return (
      <div style={{
        width: '100%', maxWidth: '420px', margin: '32px auto 60px',
        padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '20px',
      }}>
        {/* Back navigation */}
        <button
          onClick={onBack}
          style={{
            alignSelf: 'flex-start', background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.4)', fontSize: '13px', cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', padding: '4px 8px', borderRadius: '8px',
            display: 'flex', alignItems: 'center', gap: '6px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#f55'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
        >
          ← Back to Campaign Selection
        </button>

        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px', padding: '24px 20px',
          boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
        }}>
          <h2 style={{
            fontSize: '20px', fontWeight: 800, margin: '0 0 16px',
            fontFamily: 'Outfit, Inter', textAlign: 'center', color: '#f5f5f5'
          }}>
            🎮 Multiplayer Setup
          </h2>

          {isDemo && (
            <div style={{
              background: 'rgba(59,130,246,0.08)',
              border: '1px solid rgba(59,130,246,0.22)',
              borderRadius: '10px', padding: '8px 12px',
              fontSize: '11px', color: '#93c5fd', lineHeight: 1.5,
              fontFamily: 'Inter, sans-serif', marginBottom: '16px',
              textAlign: 'center',
            }}>
              🚀 Running in <strong>Zero-Config Demo Mode</strong>!<br />
              Open this page in another browser window to test real-time tab syncing.
            </div>
          )}

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: '10px', padding: '10px 12px',
              color: '#f87171', fontSize: '12px', marginBottom: '16px',
              fontFamily: 'Inter, sans-serif', textAlign: 'center',
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Profile Editor */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
            <button
              onClick={() => {
                const nextAvatarIdx = (AVATARS.indexOf(localPlayer.avatar) + 1) % AVATARS.length
                setLocalPlayer(p => ({ ...p, avatar: AVATARS[nextAvatarIdx] }))
              }}
              style={{
                width: '54px', height: '54px', borderRadius: '16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                fontSize: '28px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}
              title="Change avatar"
            >
              {localPlayer.avatar}
            </button>
            <div style={{ flex: 1 }}>
              <label htmlFor="player-name-input" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Inter' }}>
                Your Nickname
              </label>
              <input
                id="player-name-input"
                type="text"
                value={localPlayer.name}
                maxLength={18}
                onChange={e => setLocalPlayer(p => ({ ...p, name: e.target.value.trim() || 'Player' }))}
                style={{
                  width: '100%', padding: '8px 12px', marginTop: '4px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px', color: '#f5f5f5', fontSize: '14px',
                  fontFamily: 'Inter', outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 -20px 20px' }} />

          {/* Join / Create Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Join Room */}
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'Inter', marginBottom: '8px' }}>
                Join Custom Room
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  id="room-code-input"
                  type="text"
                  placeholder="CODE"
                  maxLength={4}
                  autoComplete="off"
                  style={{
                    width: '90px', padding: '12px', textAlign: 'center',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px', color: '#f5f5f5', fontSize: '16px',
                    fontWeight: 700, fontFamily: 'Outfit, Inter', letterSpacing: '0.12em',
                    outline: 'none',
                  }}
                  onKeyDown={e => e.key === 'Enter' && handleJoinRoom(e.currentTarget.value)}
                />
                <button
                  onClick={() => {
                    const inputEl = document.getElementById('room-code-input')
                    if (inputEl) handleJoinRoom(inputEl.value)
                  }}
                  disabled={isConnecting}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#f5f5f5', fontSize: '14px', fontWeight: 700,
                    cursor: isConnecting ? 'not-allowed' : 'pointer',
                    fontFamily: 'Inter', transition: 'background 0.2s',
                  }}
                >
                  {isConnecting ? 'Connecting…' : 'Join Room'}
                </button>
              </div>
            </div>

            {/* Create Room */}
            <div style={{ marginTop: '4px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'Inter', marginBottom: '8px' }}>
                Host New Draft Room
              </h3>
              <button
                onClick={() => handleCreateRoom({ timerDuration: 45 })}
                disabled={isConnecting}
                style={{
                  width: '100%', padding: '13px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                  border: 'none', color: '#0a0a0a', fontSize: '14px', fontWeight: 800,
                  letterSpacing: '0.02em', cursor: isConnecting ? 'not-allowed' : 'pointer',
                  fontFamily: 'Inter', boxShadow: '0 4px 20px rgba(245,158,11,0.2)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                {isConnecting ? 'Creating Room…' : 'Host Custom Room'}
              </button>
            </div>
          </div>

        </div>
      </div>
    )
  }

  // Active room routing based on status metadata
  const status = room?.metadata?.status ?? 'lobby'

  return (
    <AnimatePresence mode="wait">
      {status === 'lobby' && (
        <motion.div key="lobby" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <MultiplayerLobby
            room={room}
            roomCode={roomCode}
            localPlayerId={localPlayer.id}
            onLeave={handleLeaveRoom}
          />
        </motion.div>
      )}

      {status === 'drafting' && (
        <motion.div key="drafting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <MultiplayerDraft
            room={room}
            roomCode={roomCode}
            localPlayerId={localPlayer.id}
            onLeave={handleLeaveRoom}
          />
        </motion.div>
      )}

      {(status === 'simulating' || status === 'ended') && (
        <motion.div key="simulating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <MatchSimulator
            room={room}
            roomCode={roomCode}
            localPlayerId={localPlayer.id}
            onLeave={handleLeaveRoom}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
