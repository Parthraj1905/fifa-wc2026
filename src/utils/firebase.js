import { initializeApp, getApps } from 'firebase/app'
import { getDatabase, ref, onValue, set, update, get } from 'firebase/database'

// Check for Firebase environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const hasConfig = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.databaseURL &&
  firebaseConfig.projectId
)

let db = null
let app = null

if (hasConfig) {
  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig)
    }
    db = getDatabase(app)
    console.log('📡 Firebase RTDB connected successfully!')
  } catch (err) {
    console.warn('⚠️ Firebase initialization failed. Falling back to Demo Mode:', err)
  }
} else {
  console.log('ℹ️ No Firebase config found. Launching in Local Zero-Config Demo Mode! (Open multiple tabs to test syncing)')
}

export const isDemo = !db

/* ─── BroadcastChannel Sync Engine for Zero-Config Demo Mode ─── */
let demoRooms = {}
let demoListeners = {}
let bc = null

function deepMerge(target, source) {
  if (!source) return target
  if (!target) return JSON.parse(JSON.stringify(source))
  
  const output = JSON.parse(JSON.stringify(source))
  
  // Merge aiReviews
  if (target.results && target.results.aiReviews && output.results && output.results.aiReviews) {
    output.results.aiReviews = {
      ...target.results.aiReviews,
      ...output.results.aiReviews
    }
  }
  
  // Merge playAgain
  if (target.gameState && target.gameState.playAgain && output.gameState && output.gameState.playAgain) {
    output.gameState.playAgain = {
      ...target.gameState.playAgain,
      ...output.gameState.playAgain
    }
  }
  
  // Merge players
  if (target.players && output.players) {
    Object.keys(target.players).forEach(playerId => {
      if (output.players[playerId]) {
        output.players[playerId] = {
          ...target.players[playerId],
          ...output.players[playerId]
        }
      }
    })
  }
  
  return output
}

if (isDemo) {
  bc = new BroadcastChannel('multiplayer-squad-builder-sync')
  bc.onmessage = (event) => {
    const { type, roomCode, data } = event.data
    if (type === 'SYNC_ROOM') {
      demoRooms[roomCode] = deepMerge(demoRooms[roomCode] || null, data)
      triggerListeners(roomCode)
    }
  }
}

const triggerListeners = (roomCode) => {
  if (demoListeners[roomCode]) {
    const freshState = JSON.parse(JSON.stringify(demoRooms[roomCode] || null))
    demoListeners[roomCode].forEach(cb => cb(freshState))
  }
}

const broadcastRoom = (roomCode) => {
  if (bc && demoRooms[roomCode]) {
    bc.postMessage({
      type: 'SYNC_ROOM',
      roomCode,
      data: demoRooms[roomCode],
    })
  }
}

/* ─── Unified Database API (Transparently switches modes) ─── */

/**
 * Creates a new custom room.
 */
export async function dbCreateRoom(roomCode, hostPlayer, settings) {
  const initialData = {
    metadata: {
      mode: settings.mode,
      status: 'lobby',
      hostId: hostPlayer.id,
      timerDuration: settings.timerDuration || 0,
      createdAt: Date.now(),
    },
    players: {
      [hostPlayer.id]: {
        id: hostPlayer.id,
        name: hostPlayer.name,
        avatar: hostPlayer.avatar,
        joinedAt: Date.now(),
        isReady: true,
        order: 0,
        squad: [],
      },
    },
    gameState: {
      currentRound: 1,
      activePlayerIndex: 0,
      turnTimerStart: 0,
      isReversed: false,
      selectedNations: [],
      pickedPlayerNames: [],
      spinState: {
        status: 'idle',
        targetResult: null,
        spinStartTime: 0,
      },
    },
    results: {
      aiReviews: {},
      matchSimulation: null
    },
  }

  if (!isDemo) {
    await set(ref(db, `rooms/${roomCode}`), initialData)
  } else {
    demoRooms[roomCode] = initialData
    triggerListeners(roomCode)
    broadcastRoom(roomCode)
  }
  return initialData
}

/**
 * Joins an existing room.
 */
export async function dbJoinRoom(roomCode, player) {
  if (!isDemo) {
    const snapshot = await get(ref(db, `rooms/${roomCode}`))
    if (!snapshot.exists()) throw new Error('Room not found')
    const room = snapshot.val()
    if (room.metadata.status !== 'lobby') throw new Error('Game already in progress')
    if (Object.keys(room.players || {}).length >= 4) throw new Error('Room is full (max 4 players)')

    const playerPath = `rooms/${roomCode}/players/${player.id}`
    const playerData = {
      id: player.id,
      name: player.name,
      avatar: player.avatar,
      joinedAt: Date.now(),
      isReady: false,
      squad: [],
    }
    await set(ref(db, playerPath), playerData)
    return room
  } else {
    const room = demoRooms[roomCode]
    if (!room) throw new Error('Room not found')
    if (room.metadata.status !== 'lobby') throw new Error('Game already in progress')
    if (Object.keys(room.players || {}).length >= 4) throw new Error('Room is full (max 4 players)')

    room.players[player.id] = {
      id: player.id,
      name: player.name,
      avatar: player.avatar,
      joinedAt: Date.now(),
      isReady: false,
      squad: [],
    }
    triggerListeners(roomCode)
    broadcastRoom(roomCode)
    return room
  }
}

/**
 * Updates any branch of the room state.
 */
export async function dbUpdateRoom(roomCode, pathsObj) {
  if (!isDemo) {
    await update(ref(db, `rooms/${roomCode}`), pathsObj)
  } else {
    const room = demoRooms[roomCode]
    if (!room) return
    
    // Deep update key paths
    Object.entries(pathsObj).forEach(([pathKey, val]) => {
      const parts = pathKey.split('/')
      let curr = room
      for (let i = 0; i < parts.length - 1; i++) {
        if (!curr[parts[i]]) curr[parts[i]] = {}
        curr = curr[parts[i]]
      }
      if (val === null) {
        delete curr[parts[parts.length - 1]]
      } else {
        curr[parts[parts.length - 1]] = val
      }
    })
    
    triggerListeners(roomCode)
    broadcastRoom(roomCode)
  }
}

/**
 * Subscribes to realtime updates of a room.
 * Returns an unsubscribe callback.
 */
export function dbSubscribeRoom(roomCode, onUpdate) {
  if (!isDemo) {
    const roomRef = ref(db, `rooms/${roomCode}`)
    return onValue(roomRef, (snapshot) => {
      onUpdate(snapshot.val())
    })
  } else {
    if (!demoListeners[roomCode]) {
      demoListeners[roomCode] = []
    }
    demoListeners[roomCode].push(onUpdate)
    
    // Trigger initial callback
    onUpdate(demoRooms[roomCode] ? JSON.parse(JSON.stringify(demoRooms[roomCode])) : null)
    
    // Sync other tabs
    if (bc && demoRooms[roomCode]) {
      bc.postMessage({ type: 'REQ_SYNC', roomCode })
    }

    return () => {
      if (demoListeners[roomCode]) {
        demoListeners[roomCode] = demoListeners[roomCode].filter(cb => cb !== onUpdate)
      }
    }
  }
}

// Support REQ_SYNC for other tabs to fetch current room states in Demo mode
if (isDemo && bc) {
  bc.addEventListener('message', (event) => {
    const { type, roomCode } = event.data
    if (type === 'REQ_SYNC' && demoRooms[roomCode]) {
      broadcastRoom(roomCode)
    }
  })
}
