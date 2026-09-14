import { Route } from "react-router-dom"
import Landing from "@/Pages/Landing"
import LoginPage from "@/Pages/LoginPage"
import SignupPage from "@/Pages/SignupPage"
import OtpPage, { ForgotPasswordPage } from "@/Pages/OtpPage"
import { ForbiddenPage } from "./guards"
import NotFoundPage from "@/Pages/NotFoundPage"

export function authRoutes() {
  return (
    <>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </>
  )
}
