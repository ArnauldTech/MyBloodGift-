import { useState } from "react"
import { Widget } from "./Card"
import { HeartPulse, LogOut, Menu, X } from "lucide-react"
import { navItems, roleNavItems, type AppRole } from "@/utils/object"
import { useNavigate } from "react-router-dom"
import { authService } from "@/api/authServices"

type LoginInfo = {
  Donneur?: string
  Role?: string
  lieu?: string
  role?: AppRole
}

function SideBar({
  Donneur = "Default",
  Role = "Default",
  lieu = "Tableau de bord",
  role = "donneur",
}: LoginInfo) {
  const [activeItem, setActiveItem] = useState(lieu)
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        onClick={() => setIsOpen((prev) => !prev)}
        className={` sticky ${!isOpen ? "left-4 " : "translate-x-50 "}  top-4 z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-900/80 text-white shadow-lg backdrop-blur-sm transition duration-300 hover:bg-slate-800 md:hidden`}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={() => {
            console.log("1")
            setIsOpen(false)
          }}
          className="fixed inset-0 z-30 bg-slate-950/45 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-72 max-w-[85vw] -translate-x-full flex-col border-r border-white/10 bg-linear-to-b from-sky-950 via-blue-950 to-indigo-950 text-slate-100 shadow-2xl shadow-sky-950/30 transition-transform duration-300 md:static md:w-64 md:max-w-none md:translate-x-0 lg:w-72 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <header className="flex items-center gap-3 border-b border-white/10 px-4 py-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-red-500 to-red-700 text-sm font-black tracking-wide text-white shadow-lg shadow-red-900/40 ring-4 ring-white/5 transition-transform duration-200 hover:scale-105 cursor-pointer">
            <HeartPulse className="h-6 w-6" aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-base font-bold tracking-tight text-white sm:text-lg">
              MyBloodGift
            </h1>
            <p className="truncate text-[10px] font-medium uppercase tracking-[0.2em] text-blue-200/80">
              {Donneur} • {Role}
            </p>
          </div>
        </header>

        <nav className="mt-6 flex flex-col gap-2 px-3">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-200/70">
            Navigation
          </p>

          {(roleNavItems[role] ?? navItems).map(({ title, icon, lien }) => {
            const isActive = activeItem === title

            return (
              <Widget
                key={title}
                variant={isActive ? "secondary" : "outline"}
                size="lg"
                logo={icon}
                title={title}
                onClick={() => {
                  setActiveItem(title)
                  navigate(lien)
                  setIsOpen(false)
                }}
                className={`w-full justify-start gap-3 rounded-xl border px-3 py-3 text-left transition-all duration-200 ${
                  isActive
                    ? "border-transparent bg-white/12 text-white shadow-lg shadow-blue-900/25"
                    : "border-white/10 bg-transparent text-slate-200 hover:border-white/20 hover:bg-white/8 hover:text-white"
                }`}
              />
            )
          })}
        </nav>

        <div className="mt-auto border-t border-white/10 p-3">
          <Widget
            variant="primary"
            size="lg"
            logo={LogOut}
            title="Déconnexion"
            onClick={() => {
              authService.logout()
              navigate("/")
            }}
            className="w-full justify-start gap-3 rounded-xl border border-red-400/30 bg-linear-to-r from-red-500 to-red-700 px-3 text-left text-white shadow-lg shadow-red-900/30 hover:from-red-400 hover:to-red-600"
          />
        </div>
      </aside>
    </>
  )
}

export default SideBar
