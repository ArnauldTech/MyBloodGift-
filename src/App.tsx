import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Landing from "./Pages/Landing"
import LoginPage from "@/Pages/LoginPage.tsx"
import SignupPage from "@/Pages/SignupPage.tsx"
import { Toaster } from "sonner"
import DashBoardDonneur from "./Pages/DashBordDonneur"
import Don from "./Pages/Don"
import Demande from "./Pages/Demande"



function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors closeButton/>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/Dash" element={<DashBoardDonneur/>} />
        <Route path="/Don" element={<Don/>} />
        <Route path="/Demande" element={<Demande/>} />
      </Routes>
    </Router>
  )
}

export default App
