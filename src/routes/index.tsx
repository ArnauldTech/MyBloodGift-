import { Routes } from "react-router-dom"
import { authRoutes } from "./authRoutes"
import { donorRoutes } from "./donorRoutes"
import { roleRoutes } from "./roleRoutes"

export default function AppRoutes() {
  return (
    <Routes>
      {authRoutes()}
      {donorRoutes()}
      {roleRoutes()}
    </Routes>
  )
}
