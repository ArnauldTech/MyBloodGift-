import { useState } from "react"
import { Link } from "react-router-dom"
import Links from "./Links.tsx"
import { Button } from "./button.tsx"

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="w-full backdrop-blur-xl sticky top-0 z-50 shadow-md bg-linear-to-r from-gray-900/80 to-gray-800/80">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 md:px-8 py-3 md:py-4">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-red-500 to-red-700 font-bold text-white text-sm transition-transform hover:scale-110">
            MGB
          </div>
          <span className="text-base md:text-lg font-bold text-white  sm:inline">MyBloodGift</span>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white transition hover:bg-white/10 md:hidden"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {menuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <ul className="hidden md:flex items-center gap-6 text-sm font-medium text-white">
          <Links way="/" text="Home" />
          <Links way="/about" text="About" />
          <Links way="/banks" text="Banks" />
          <Links way="/campaigns" text="Campaigns" />
          <Links way="/facs" text="FAQ" />
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <Button asChild variant="primary" size="lg" className="rounded-lg text-sm font-semibold transition-all hover:shadow-lg">
            <Link to="/signup">Créer un compte</Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="rounded-lg text-sm font-semibold transition-all hover:shadow-lg">
            <Link to="/login">Connexion</Link>
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-gray-900/95 px-4 sm:px-6 md:hidden">
          <ul className="flex flex-col gap-2 py-4 text-sm font-medium text-white">
            <Links way="/" text="Home" />
            <Links way="/about" text="About" />
            <Links way="/banks" text="Banks" />
            <Links way="/campaigns" text="Campaigns" />
            <Links way="/facs" text="FAQ" />
          </ul>
          <div className="flex flex-col gap-2 pb-4">
            <Button asChild variant="primary" size="lg" className="w-full rounded-lg text-sm font-semibold transition-all">
              <Link to="/signup">Créer un compte</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full rounded-lg text-sm font-semibold transition-all">
              <Link to="/login">Connexion</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}