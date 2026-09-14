import { useEffect, useState, type ReactNode } from "react"
import SideBar from "@/components/ui/SideBar"
import type { AppRole } from "@/utils/object"
import { authService } from "@/api/authServices"

type DashboardLayoutProps = {
  activeItem: string
  role?: AppRole
  userName?: string
  children: ReactNode
}

export function DashboardLayout({
  activeItem,
  role = "donneur",
  userName,
  children,
}: DashboardLayoutProps) {
  const [name, setName] = useState(userName || "Utilisateur")

  useEffect(() => {
    if (!userName) {
      authService
        .getMe()
        .then((user) => {
          if (user?.first_name) {
            setName(`${user.first_name} ${user.last_name || ""}`.trim())
          }
        })
        .catch(() => {})
    }
  }, [userName])

  return (
    <main className="h-screen overflow-hidden bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-100 text-slate-900 md:flex">
      {/* Mobile top nav */}
      <nav className="fixed inset-x-0 top-0 z-50 flex h-16 items-center border-b border-white/10 bg-linear-to-r from-slate-900 via-blue-950 to-indigo-950 px-3 shadow-lg md:hidden">
        <SideBar Donneur={name} Role={roleLabel(role)} role={role} lieu={activeItem} />
      </nav>
      {/* Desktop sidebar */}
      <nav className="fixed inset-y-0 left-0 z-40 hidden md:flex md:min-h-screen">
        <SideBar Donneur={name} Role={roleLabel(role)} role={role} lieu={activeItem} />
      </nav>
      <section className="min-w-0 flex-1 overflow-y-auto pt-16 md:ml-72 md:pt-0 lg:ml-72">
        {children}
      </section>
    </main>
  )
}

function roleLabel(role: AppRole) {
  return role === "hospital"
    ? "Hôpital"
    : role === "admin"
      ? "Administrateur"
      : role === "demandeur"
        ? "Demandeur"
        : "Donneur"
}

type PageHeaderProps = {
  eyebrow?: string
  title: string
  description: string
  action?: ReactNode
}

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-red-600 flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}

export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode
  tone?: "success" | "warning" | "danger" | "neutral"
}) {
  const tones = {
    success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
    danger: "bg-red-50 text-red-700 ring-red-600/20",
    neutral: "bg-slate-100 text-slate-600 ring-slate-500/20",
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

type StatCardProps = {
  label: string
  value: string
  detail: string
  icon: ReactNode
  tone?: "red" | "blue" | "green" | "amber"
}

export function StatCard({ label, value, detail, icon, tone = "red" }: StatCardProps) {
  const tones = {
    red: { icon: "bg-red-50 text-red-600", accent: "stat-accent-red" },
    blue: { icon: "bg-blue-50 text-blue-600", accent: "stat-accent-blue" },
    green: { icon: "bg-emerald-50 text-emerald-600", accent: "stat-accent-green" },
    amber: { icon: "bg-amber-50 text-amber-600", accent: "stat-accent-amber" },
  }
  const t = tones[tone]
  return (
    <article
      className={`card-interactive rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ${t.accent}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${t.icon} shadow-sm`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-400">{detail}</p>
    </article>
  )
}

export function SectionCard({
  title,
  description,
  children,
  className = "",
}: {
  title: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      <div className="mb-5 flex flex-col gap-0.5 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-slate-400">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}
