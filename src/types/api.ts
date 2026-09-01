/**
* 💡 TYPAGE TYPESCRIPT POUR L'API @learn (FastAPI)
*/

// --- 1. TYPES AUTHENTIFICATION ---
export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

export interface UserLoginPayload {
  email: string;
  password: string;
}

export interface UserSignUpPayload {
  nom: string;
  email: string;
  password: string;
  role: "Demandeur" | "Donneur" | "admin" | "hospital";
}

export interface LoginResponse {
  message: string;
  user: string;
  access_token: string;
}

export interface SignUpResponse {
  message: string;
  user: string;
}

// --- 2. TYPES ÉTUDIANTS ---
export interface Etudiant {
  id?: number;
  nom: string;
  prenom: string;
  age: number;
  filiere: string;
}

export interface EtudiantsResponse {
  message: string;
  etudiants: Etudiant[];
}

// --- 3. TYPES TÂCHES ---
export interface Task {
  id: number;
  title: string;
  description?: string;
  done: boolean;
}

export interface TaskCreatePayload {
  title: string;
  description?: string;
  done?: boolean;
}

export interface TaskUpdatePayload {
  title?: string;
  description?: string;
  done?: boolean;
}