import { Navigate, useLocation } from "react-router-dom"
import type { ReactNode } from "react"
import type { AppRole } from "@/utils/object"

type ProtectedRouteProps = {
  children: ReactNode
  roles?: AppRole[]
}

function readRole(): AppRole | null {
  const stored = localStorage.getItem("user_role") as AppRole | null
  return stored && ["donneur", "demandeur", "hospital", "admin"].includes(stored) ? stored : null
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const location = useLocation()
  const token = localStorage.getItem("access_token")
  const role = readRole()
  if (!token)
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  if (roles && (!role || !roles.includes(role))) return <Navigate to="/403" replace />
  return <>{children}</>
}

export function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6 text-center">
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-950">Accès refusé</h1>
        <p className="mt-2 text-slate-600">Votre rôle ne permet pas d’accéder à cette page.</p>
        <a className="mt-5 inline-block font-semibold text-red-600 hover:underline" href="/">
          Retour à l’accueil
        </a>
      </div>
    </main>
  )
}
