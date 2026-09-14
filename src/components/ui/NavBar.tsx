import { useState } from "react"
import { HeartPulse, Menu, X } from "lucide-react"
import Links from "./Links.tsx"
import { Button } from "@/components/ui/button.tsx"

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 md:px-8 py-3 md:py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-700 text-white shadow-md shadow-red-900/40 ring-2 ring-white/10 transition-transform group-hover:scale-105">
            <HeartPulse className="h-5 w-5 heart-beat" aria-hidden="true" />
          </div>
          <div>
            <span className="text-base font-bold text-white md:text-lg">MyBloodGift</span>
            <span className="ml-2 hidden text-xs font-medium text-blue-300/80 sm:inline">
              Chaque don compte
            </span>
          </div>
        </a>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Links way="/#accueil" text="Accueil" />
          <Links way="/#comment" text="Comment ça marche" />
          <Links way="/#fonctionnalites" text="Fonctionnalités" />
          <Links way="/#acteurs" text="Acteurs" />
          <Links way="/#faq" text="FAQ" />
        </ul>

        {/* Desktop CTA buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="rounded-lg border border-white/15 bg-white/8 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/15 transition-all"
          >
            <a href="/login">Connexion</a>
          </Button>
          <Button
            asChild
            variant="primary"
            size="sm"
            className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-sm font-bold text-white shadow-lg shadow-red-700/30 hover:from-red-400 hover:to-red-500 transition-all"
          >
            <a href="/signup">Créer un compte</a>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white backdrop-blur-sm transition hover:bg-white/15 md:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-gradient-to-b from-slate-900/95 to-blue-950/95 px-4 backdrop-blur-xl sm:px-6 md:hidden">
          <ul className="flex flex-col gap-1 py-3 text-sm font-medium text-slate-200">
            <Links way="/#accueil" text="Accueil" />
            <Links way="/#comment" text="Comment ça marche" />
            <Links way="/#fonctionnalites" text="Fonctionnalités" />
            <Links way="/#acteurs" text="Acteurs" />
            <Links way="/#faq" text="FAQ" />
          </ul>
          <div className="flex flex-col gap-2 pb-5 pt-2 border-t border-white/10">
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="w-full rounded-xl border border-white/20 bg-white/10 text-sm font-semibold text-white hover:bg-white/20 transition-all"
            >
              <a href="/login">Connexion</a>
            </Button>
            <Button
              asChild
              variant="primary"
              size="lg"
              className="w-full rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-sm font-bold text-white shadow-md transition-all"
            >
              <a href="/signup">Créer un compte</a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
