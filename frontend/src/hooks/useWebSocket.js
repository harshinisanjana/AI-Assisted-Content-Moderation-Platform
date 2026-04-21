import { useCallback, useEffect, useRef, useState } from 'react'

const RECONNECT_DELAY = 3000
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const WS_URL = API_BASE.replace(/^http/, 'ws') + '/ws'

/**
 * Custom hook for WebSocket connection with auto-reconnect.
 * @param {Function} onEvent — callback invoked with (eventName, data) when a message arrives
 * @returns {{ status: 'connected'|'disconnected'|'reconnecting' }}
 */
export default function useWebSocket(onEvent) {
  const [status, setStatus] = useState('disconnected')
  const wsRef = useRef(null)
  const reconnectTimer = useRef(null)
  const onEventRef = useRef(onEvent)

  // Keep the callback ref fresh without re-triggering the effect
  useEffect(() => {
    onEventRef.current = onEvent
  }, [onEvent])

  const connect = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState <= 1) return

    setStatus('reconnecting')
    const ws = new WebSocket(WS_URL)

    ws.onopen = () => {
      setStatus('connected')
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current)
        reconnectTimer.current = null
      }
    }

    ws.onmessage = (event) => {
      try {
        const { event: eventName, data } = JSON.parse(event.data)
        if (onEventRef.current) {
          onEventRef.current(eventName, data)
        }
      } catch {
        // ignore malformed messages
      }
    }

    ws.onclose = () => {
      setStatus('disconnected')
      wsRef.current = null
      reconnectTimer.current = setTimeout(() => {
        setStatus('reconnecting')
        connect()
      }, RECONNECT_DELAY)
    }

    ws.onerror = () => {
      ws.close()
    }

    wsRef.current = ws
  }, [])

  useEffect(() => {
    connect()
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
      if (wsRef.current) wsRef.current.close()
    }
  }, [connect])

  return { status }
}
