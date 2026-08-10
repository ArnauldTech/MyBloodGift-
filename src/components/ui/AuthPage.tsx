import { ArrowRight, HeartPulse } from "lucide-react"
import { Button } from "./button"

type AuthPageProps = {
  mode: "login" | "signup"
}

export default function AuthPage({ mode }: AuthPageProps) {
  const isSignup = mode === "signup"

  return (
    <div className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.12),transparent_35%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] shadow-sm xl:flex-row">
        <div className="flex flex-1 flex-col gap-6 border-b border-slate-200 bg-red-600/95 p-8 text-white xl:border-b-0 xl:border-r xl:p-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white">
              <HeartPulse className="h-4 w-4" /> MyBloodGift
            </div>
            <h1 className="text-3xl font-semibold sm:text-4xl">
              {isSignup ? "Rejoignez la communauté de don" : "Bienvenue sur MyBloodGift"}
            </h1>
            <p className="max-w-md text-sm leading-7 text-white/80">
              {isSignup
                ? "Inscrivez-vous pour recevoir des alertes et contribuer aux besoins de votre région."
                : "Connectez-vous pour suivre les stocks, les campagnes et les centres de collecte."}
            </p>
          </div>

          <div className="grid gap-3 rounded-3xl bg-white/10 p-5 text-sm text-white/85">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="font-semibold">Suivi en temps réel</p>
              <p className="mt-1 text-sm text-white/80">Consultez les stocks de sang disponibles et les demandes urgentes.</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="font-semibold">Simple et sécurisé</p>
              <p className="mt-1 text-sm text-white/80">Vos informations restent confidentielles et vous recevez uniquement les alertes pertinentes.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center p-8 sm:p-10">
          <div className="w-full max-w-md rounded-[1.5rem] border border-slate-200 bg-white p-8 shadow-md">
            <div className="mb-7">
              <span className="text-sm font-semibold uppercase tracking-[0.35em] text-red-600">{isSignup ? "Inscription" : "Connexion"}</span>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">{isSignup ? "Créer un compte" : "Se connecter"}</h2>
              <p className="mt-2 text-sm text-slate-500">{isSignup ? "Remplissez le formulaire pour rejoindre MyBloodGift." : "Entrez vos identifiants pour accéder à l’application."}</p>
            </div>

            <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
              {isSignup && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="fullName">
                    Nom complet
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Amina Diop"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">
                  Adresse e-mail
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="vous@example.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                />
              </div>

              {isSignup && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="confirmPassword">
                    Confirmer le mot de passe
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                  />
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-slate-600">
                {!isSignup && (
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500" />
                    Se souvenir de moi
                  </label>
                )}
                {!isSignup && <a href="#" className="font-medium text-red-600 hover:text-red-700">Mot de passe oublié ?</a>}
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full rounded-2xl py-3 text-base font-semibold">
                {isSignup ? "Créer mon compte" : "Se connecter"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
              <p>{isSignup ? "Déjà membre ?" : "Pas encore de compte ?"}</p>
              <a href={isSignup ? "/login" : "/signup"} className="font-semibold text-red-600 hover:text-red-700">
                {isSignup ? "Se connecter" : "Créer un compte"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
