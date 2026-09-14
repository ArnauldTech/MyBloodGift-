import { Compass, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <section className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/10 p-8 text-center shadow-2xl backdrop-blur">
        <Compass className="mx-auto h-12 w-12 text-red-300" />
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-red-200">Erreur 404</p>
        <h1 className="mt-3 text-4xl font-bold">Page introuvable</h1>
        <p className="mt-3 text-slate-300">Cette page n’existe pas ou a été déplacée.</p>
        <Button asChild variant="primary" className="mt-7 rounded-xl">
          <a href="/"><Home className="h-4 w-4" /> Retour à l’accueil</a>
        </Button>
      </section>
    </main>
  )
}
