import { useEffect, useState } from "react"

export function useLiveNotifications() {
  const [connected, setConnected] = useState(false)
  useEffect(() => {
    const url = import.meta.env.VITE_WS_URL
    if (!url) return
    const socket = new WebSocket(url)
    socket.onopen = () => setConnected(true)
    socket.onclose = () => setConnected(false)
    socket.onerror = () => setConnected(false)
    return () => socket.close()
  }, [])
  return { connected }
}
