import { useState } from 'react'
import { motion } from 'framer-motion'
import { dbUpdateRoom } from '../utils/firebase'

export default function MultiplayerLobby({ room, roomCode, localPlayerId, onLeave }) {
  const [copied, setCopied] = useState(false)
  const players = Object.values(room?.players || {}).sort((a, b) => a.joinedAt - b.joinedAt)
  const localPlayer = room?.players?.[localPlayerId]
  const isHost = room?.metadata?.hostId === localPlayerId
  const timerDuration = room?.metadata?.timerDuration ?? 45

  const copyRoomLink = () => {
    const inviteUrl = `${window.location.origin}${window.location.pathname}?room=${roomCode}`
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleReady = async () => {
    if (!localPlayer || isHost) return
    const nextReady = !localPlayer.isReady
    await dbUpdateRoom(roomCode, {
      [`players/${localPlayerId}/isReady`]: nextReady
    })
  }

  const changeTimer = async (duration) => {
    if (!isHost) return
    await dbUpdateRoom(roomCode, {
      'metadata/timerDuration': duration
    })
  }

  const startDraft = async () => {
    if (!isHost) return
    
    // Assign snake draft order index to players based on join time
    const updates = {}
    players.forEach((p, idx) => {
      updates[`players/${p.id}/order`] = idx
    })
    
    // Set game status to drafting
    updates['metadata/status'] = 'drafting'
    updates['gameState/turnTimerStart'] = Date.now()
    
    await dbUpdateRoom(roomCode, updates)
  }

  const allPlayersReady = players.length >= 2 && players.every(p => p.isReady)

  return (
    <div style={{
      width: '100%', maxWidth: '520px', margin: '24px auto 60px',
      padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '20px',
    }}>
      
      {/* ── Header details ────────────────────────────────────────── */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px', padding: '24px 20px',
        boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
        position: 'relative', overflow: 'hidden',
      }}>
        
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '-40%', right: '-40%',
          width: '200px', height: '200px',
          background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
          filter: 'blur(30px)', pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{
            fontSize: '22px', fontWeight: 800, margin: 0,
            fontFamily: 'Outfit, Inter', color: '#f5f5f5', letterSpacing: '-0.02em'
          }}>
            🏆 Game Lobby
          </h2>
          <button
            onClick={onLeave}
            style={{
              padding: '6px 12px', borderRadius: '8px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: '#f87171', fontSize: '11px', fontWeight: 700,
              fontFamily: 'Inter', cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
          >
            Leave Room
          </button>
        </div>

        {/* Room Code Showcase */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '16px', padding: '16px', marginBottom: '24px',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, fontFamily: 'Inter' }}>
            Room Entry Code
          </span>
          <h1 style={{
            fontSize: '36px', fontWeight: 900, margin: '6px 0',
            fontFamily: 'Outfit, Inter', color: '#f59e0b', letterSpacing: '0.12em',
            textShadow: '0 0 16px rgba(245,158,11,0.2)',
          }}>
            {roomCode}
          </h1>
          <button
            onClick={copyRoomLink}
            style={{
              padding: '6px 16px', borderRadius: '999px',
              background: copied ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${copied ? '#10b981' : 'rgba(255,255,255,0.12)'}`,
              color: copied ? '#10b981' : 'rgba(255,255,255,0.6)',
              fontSize: '11px', fontWeight: 600,
              fontFamily: 'Inter', cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            {copied ? '✓ Copied Invite Link!' : '🔗 Copy Invite Link'}
          </button>
        </div>

        {/* Settings Panel */}
        <div style={{
          background: 'rgba(255,255,255,0.015)',
          border: '1px solid rgba(255,255,255,0.04)',
          borderRadius: '14px', padding: '14px 16px',
        }}>
          <h3 style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, fontFamily: 'Inter', marginBottom: '12px' }}>
            Draft Rules Configuration
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ⏱️ Turn Timer:
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[30, 45, 60, 0].map(duration => {
                const active = timerDuration === duration
                const label = duration === 0 ? 'None' : `${duration}s`
                return (
                  <button
                    key={duration}
                    onClick={() => changeTimer(duration)}
                    disabled={!isHost}
                    style={{
                      padding: '4px 10px', borderRadius: '6px',
                      background: active ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${active ? '#f59e0b' : 'rgba(255,255,255,0.08)'}`,
                      color: active ? '#f59e0b' : 'rgba(255,255,255,0.4)',
                      fontSize: '11px', fontWeight: 700,
                      fontFamily: 'Inter', cursor: isHost ? 'pointer' : 'default',
                      transition: 'all 0.15s',
                    }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

      </div>

      {/* ── Participant list ──────────────────────────────────────── */}
      <div>
        <h3 style={{
          fontSize: '11px', color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          fontWeight: 700, fontFamily: 'Inter', marginBottom: '10px',
          paddingLeft: '4px',
        }}>
          Players in Room ({players.length}/4)
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {players.map((player, idx) => {
            const isPlayerHost = room.metadata.hostId === player.id
            const isLocal = player.id === localPlayerId
            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '12px 16px', borderRadius: '14px',
                  background: isLocal ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                  border: isLocal ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.05)',
                  position: 'relative',
                }}
              >
                <div style={{ fontSize: '32px' }}>{player.avatar}</div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span style={{
                    fontSize: '14px', fontWeight: 700, color: '#f5f5f5',
                    fontFamily: 'Inter', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                  }}>
                    {player.name}
                    {isLocal && <span style={{ fontSize: '10px', fontWeight: 500, color: 'rgba(255,255,255,0.3)' }}>(You)</span>}
                  </span>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', fontFamily: 'Inter', marginTop: '2px' }}>
                    {isPlayerHost ? '👑 Lobby Host' : 'Draft Participant'}
                  </span>
                </div>

                {/* Ready Status indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    fontSize: '10px', fontWeight: 700,
                    color: player.isReady ? '#10b981' : '#f87171',
                    fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.04em',
                  }}>
                    {player.isReady ? 'Ready' : 'Not Ready'}
                  </span>
                  <div style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: player.isReady ? '#10b981' : '#ef4444',
                    boxShadow: `0 0 8px ${player.isReady ? '#10b981' : '#ef4444'}80`,
                  }} />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ── Ready Actions ────────────────────────────────────────── */}
      <div style={{ marginTop: '8px' }}>
        {isHost ? (
          <button
            onClick={startDraft}
            disabled={!allPlayersReady}
            style={{
              width: '100%', padding: '16px', borderRadius: '14px',
              background: allPlayersReady
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'rgba(255,255,255,0.03)',
              border: allPlayersReady ? 'none' : '1px solid rgba(255,255,255,0.06)',
              color: allPlayersReady ? '#0a0a0a' : 'rgba(255,255,255,0.2)',
              fontSize: '14px', fontWeight: 800, letterSpacing: '0.08em',
              textTransform: 'uppercase', cursor: allPlayersReady ? 'pointer' : 'not-allowed',
              fontFamily: 'Inter, sans-serif',
              boxShadow: allPlayersReady ? '0 6px 24px rgba(16,185,129,0.25)' : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            {players.length < 2
              ? 'Waiting for Friends to Join…'
              : !allPlayersReady
                ? 'Waiting for Everyone to be Ready…'
                : '🚀 Start Synced Draft!'}
          </button>
        ) : (
          <button
            onClick={toggleReady}
            style={{
              width: '100%', padding: '16px', borderRadius: '14px',
              background: localPlayer?.isReady
                ? 'rgba(239,68,68,0.08)'
                : 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
              border: localPlayer?.isReady ? '1px solid rgba(239,68,68,0.28)' : 'none',
              color: localPlayer?.isReady ? '#ef4444' : '#0a0a0a',
              fontSize: '14px', fontWeight: 800, letterSpacing: '0.08em',
              textTransform: 'uppercase', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              boxShadow: localPlayer?.isReady ? 'none' : '0 6px 24px rgba(245,158,11,0.25)',
              transition: 'all 0.25s ease',
            }}
          >
            {localPlayer?.isReady ? 'Cancel Ready' : '✓ Toggle Ready'}
          </button>
        )}
      </div>

    </div>
  )
}
