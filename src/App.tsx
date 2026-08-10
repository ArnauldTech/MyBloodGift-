import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Landing from "./Pages/Landing"
import LoginPage from "@/Pages/LoginPage.tsx"
import SignupPage from "@/Pages/SignupPage.tsx"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<div>About</div>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  )
}

export default App
