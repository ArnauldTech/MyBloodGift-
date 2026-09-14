/**
 * 💡 TYPAGE TYPESCRIPT POUR L'API @learn (FastAPI)
 */

// --- 1. TYPES AUTHENTIFICATION ---
export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  role?: "donneur" | "demandeur" | "hopital" | "admin"
  phone?: string | null
  blood_group?: "A" | "B" | "AB" | "O" | null
  rhesus?: "+" | "-" | null
  available?: boolean
  establishment_name?: string | null
  establishment_type?: string | null
  license_number?: string | null
  city?: string | null
}

export interface UserLoginPayload {
  email: string
  password: string
}

export interface UserSignUpPayload {
  first_name: string
  last_name: string
  email: string
  password: string
  role: "donneur" | "demandeur" | "hopital" | "admin"
  phone?: string
  blood_group?: User["blood_group"]
  rhesus?: User["rhesus"]
  address?: string
  establishment_name?: string
  establishment_type?: string
  license_number?: string
  city?: string
}

export interface LoginResponse {
  message?: string
  user: string
  access_token: string
  role?: "donneur" | "demandeur" | "hopital" | "admin"
}

export interface SignUpResponse {
  message: string
  user: string
}
