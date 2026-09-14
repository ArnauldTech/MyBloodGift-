import { BrowserRouter as Router } from "react-router-dom"
import { Toaster } from "sonner"
import AppRoutes from "./routes"
import { useEffect, useState } from "react"
import { NetworkErrorScreen } from "./components/ui/LoadingScreen"

function App() {
  const [networkError, setNetworkError] = useState(() => !navigator.onLine)
  const themeKey = `display_mode_${localStorage.getItem("user_role") ?? "guest"}`
  const [theme, setTheme] = useState(() => localStorage.getItem(themeKey) ?? "light")
  useEffect(() => {
    const syncTheme = () => setTheme(localStorage.getItem(`display_mode_${localStorage.getItem("user_role") ?? "guest"}`) ?? "light")
    window.addEventListener("mbg:theme-change", syncTheme)
    return () => window.removeEventListener("mbg:theme-change", syncTheme)
  }, [])
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])
  useEffect(() => {
    const show = () => setNetworkError(true)
    const hide = () => setNetworkError(false)
    window.addEventListener("mbg:network-error", show)
    window.addEventListener("online", hide)
    return () => {
      window.removeEventListener("mbg:network-error", show)
      window.removeEventListener("online", hide)
    }
  }, [])
  if (networkError) return <NetworkErrorScreen onRetry={() => window.location.reload()} />
  return (
    <Router>
      <Toaster position="top-right" richColors closeButton />
      <AppRoutes />
    </Router>
  )
}

export default App
