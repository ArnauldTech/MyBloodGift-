import { axiosClient } from "./axiosClient"
import type {
  User,
  UserLoginPayload,
  UserSignUpPayload,
  LoginResponse,
  SignUpResponse,
} from "../types/api"

export const authService = {
  async login(payload: UserLoginPayload): Promise<LoginResponse> {
    const response = await axiosClient.post<LoginResponse>("/auth/login", payload)
    localStorage.setItem("access_token", response.data.access_token)
    const apiRole = (response.data.role ?? "donneur").toLowerCase()
    const role = apiRole === "hopital" ? "hospital" : apiRole
    if (["donneur", "demandeur", "hospital", "admin"].includes(role)) {
      localStorage.setItem("user_role", role)
    }
    window.dispatchEvent(new Event("mbg:theme-change"))
    return response.data
  },

  async signup(payload: UserSignUpPayload): Promise<SignUpResponse> {
    const response = await axiosClient.post<SignUpResponse>("/auth/register", payload)
    return response.data
  },

  async requestOtp(email: string): Promise<void> {
    await axiosClient.post("/auth/otp/request", { email })
  },

  async verifyOtp(email: string, code: string): Promise<void> {
    await axiosClient.post("/auth/otp/verify", { email, code })
  },

  async getMe(): Promise<User> {
    const response = await axiosClient.get<User>("/auth/me")
    return response.data
  },

  async updateMe(payload: Partial<User>): Promise<User> {
    const response = await axiosClient.patch<User>("/users/me", payload)
    return response.data
  },

  logout(): void {
    localStorage.removeItem("access_token")
    localStorage.removeItem("user_role")
  },
}
