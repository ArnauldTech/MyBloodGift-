import { Button } from "@/components/ui/button"
import NavBar from "@/components/ui/NavBar"
import { MapPreview } from "@/components/ui/MapPreview"
import { UsersCardObject, questionCardObject } from "@/utils/object"
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronDown,
  HeartPulse,
  MapPin,
  Sparkles,
  Zap,
  ShieldCheck,
  Activity,
  BarChart3,
  Users,
} from "lucide-react"
import { useState } from "react"

// ─── Metrics ──────────────────────────────────────────────────────────────────
const metrics = [
  { label: "Établissements", value: "100%", sub: "Connectés", accent: "text-red-600 bg-red-50 border-red-100" },
  { label: "Réponse alerte", value: "< 15 min", sub: "Garanti", accent: "text-blue-600 bg-blue-50 border-blue-100" },
  { label: "Donneurs actifs", value: "+3 200", sub: "Sur le réseau", accent: "text-emerald-600 bg-emerald-50 border-emerald-100" },
]

// ─── How it works ─────────────────────────────────────────────────────────────
const steps = [
  {
    num: "01",
    icon: Users,
    title: "Créez votre compte",
    desc: "Inscription en 2 minutes, choisissez votre rôle (Donneur, Hôpital, Demandeur).",
    color: "text-red-600 bg-red-50",
  },
  {
    num: "02",
    icon: Bell,
    title: "Recevez des alertes ciblées",
    desc: "Notifications instantanées selon votre groupe sanguin et votre géolocalisation.",
    color: "text-blue-600 bg-blue-50",
  },
  {
    num: "03",
    icon: HeartPulse,
    title: "Donnez et sauvez des vies",
    desc: "Planifiez un rendez-vous dans un centre partenaire et faites un don.",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    num: "04",
    icon: ShieldCheck,
    title: "Suivi complet & traçabilité",
    desc: "Chaque poche de sang est tracée du don à la transfusion en temps réel.",
    color: "text-amber-600 bg-amber-50",
  },
]

// ─── Features ─────────────────────────────────────────────────────────────────
const features = [
  { icon: Zap, title: "IA d'Éligibilité", desc: "Analysez votre éligibilité au don en temps réel grâce à notre moteur d'intelligence artificielle." },
  { icon: MapPin, title: "Géolocalisation", desc: "Trouvez les centres de collecte les plus proches et vérifiez leur disponibilité." },
  { icon: Activity, title: "Stock en direct", desc: "Visualisez les niveaux de stock par groupe sanguin dans tous les établissements partenaires." },
  { icon: BarChart3, title: "Rapports & Stats", desc: "Tableaux de bord complets pour piloter votre centre ou votre activité de don." },
]

// ─── FAQ ─────────────────────────────────────────────────────────────────────
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <button
      type="button"
      className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:border-red-200 hover:shadow-md"
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold text-slate-900">{question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${open ? "rotate-180 text-red-500" : ""}`}
        />
      </div>
      {open && (
        <p className="mt-3 text-sm leading-relaxed text-slate-500 fade-in-up">{answer}</p>
      )}
    </button>
  )
}

export default function Landing() {
  return (
    <>
      {/* ─── Ticker Banner ───────────────────────────────────── */}
      <div
        aria-label="Annonce urgente"
        className="relative overflow-hidden bg-gradient-to-r from-red-700 via-rose-600 to-red-700 py-2.5 text-xs font-semibold text-white"
      >
        <div className="ticker-wrapper">
          <span className="ticker-scroll inline-flex items-center gap-6 whitespace-nowrap px-4">
            <Sparkles className="inline h-3.5 w-3.5 text-amber-300" />
            Urgence nationale · Groupe O− en déficit critique · Donnez maintenant et sauvez jusqu'à 3 vies
            &nbsp;&nbsp;·&nbsp;&nbsp;
            <Sparkles className="inline h-3.5 w-3.5 text-amber-300" />
            Groupe A− : besoin urgent dans 14 établissements partenaires
            &nbsp;&nbsp;·&nbsp;&nbsp;
            Rejoignez +3 200 donneurs actifs sur MyBloodGift
          </span>
        </div>
      </div>

      {/* ─── Sticky Header ───────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/8 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 shadow-xl backdrop-blur-md">
        <NavBar />
      </header>

      <main className="w-full min-h-screen bg-gradient-to-b from-white via-slate-50 to-blue-50/30 text-slate-900 overflow-x-hidden">

        {/* ─── HERO ──────────────────────────────────────────── */}
        <section
          id="accueil"
          className="relative mx-auto flex w-full max-w-7xl flex-col-reverse gap-10 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between md:px-8 md:py-24"
        >
          {/* Decorative background blobs */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-red-100/40 blur-3xl" />
            <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-blue-100/30 blur-3xl" />
          </div>

          {/* Left: text */}
          <div className="flex w-full flex-col gap-6 md:w-1/2">
            <div className="max-w-2xl space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-red-200/80 bg-red-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-red-700 shadow-sm">
                <HeartPulse className="h-3.5 w-3.5 text-red-500 heart-beat" />
                Plateforme Sanitaire Numérique
              </span>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                La coordination qui transforme chaque don en{" "}
                <span className="gradient-text-red">espoir</span>.
              </h1>
              <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
                Connectez-vous directement avec les établissements de santé, gérez vos réservations, recevez des alertes ciblées et suivez la traçabilité des poches de sang.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                variant="primary"
                size="lg"
                className="w-full rounded-xl px-7 text-base font-bold shadow-lg glow-red sm:w-auto"
              >
                <a href="/signup">
                  Créer un compte <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="w-full text-white rounded-xl border border-slate-200 bg-white px-7 text-base font-semibold  shadow-sm hover:bg-slate-50 sm:w-auto"
              >
                <a href="/login">Se connecter</a>
              </Button>
            </div>

            {/* Metrics row */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className={`card-interactive rounded-2xl border ${m.accent} bg-white px-3 py-4 shadow-xs text-center`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">{m.label}</p>
                  <p className="mt-1 text-xl font-extrabold leading-tight">{m.value}</p>
                  <p className="mt-0.5 text-[10px] opacity-60">{m.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: alert card */}
          <div className="flex w-full items-center justify-center md:w-1/2">
            <div className="relative w-full max-w-sm float-slow">
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-red-600 to-rose-800 blur-2xl opacity-25" />
              <div className="relative overflow-hidden rounded-[2.5rem] border border-red-300/50 bg-gradient-to-br from-red-600 to-rose-700 p-1.5 shadow-2xl shadow-red-900/30">
                <div className="rounded-[2rem] bg-slate-950/20 p-6 backdrop-blur-md text-white">
                  {/* header */}
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-white/20 bg-red-400/30 px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
                      Alerte Critique
                    </span>
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 pulse-emerald" />
                  </div>
                  <h2 className="mt-4 text-2xl font-bold">Besoin Urgent Groupe O−</h2>
                  <p className="mt-1 text-xs text-red-100">CHU de Yaoundé · Cameroun · 4 poches requises</p>

                  {/* stats mini */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {[
                      { label: "Centres proches", val: "5 actifs" },
                      { label: "Éligibilité IA", val: "Instantanée" },
                      { label: "Délai réponse", val: "< 15 min" },
                      { label: "Réseau national", val: "Connecté" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl border border-white/10 bg-white/10 p-3"
                      >
                        <p className="text-[10px] text-red-100">{item.label}</p>
                        <p className="mt-0.5 text-sm font-bold text-white">{item.val}</p>
                      </div>
                    ))}
                  </div>

                  {/* CTA inside card */}
                  <a
                    href="/signup"
                    className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/15 py-3 text-sm font-bold text-white transition hover:bg-white/25"
                  >
                    <HeartPulse className="h-4 w-4" /> Répondre à l'appel
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ──────────────────────────────────── */}
        <section
          id="comment"
          className="border-y border-slate-200/60 bg-white py-20"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <div className="mb-14 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-600">
                Processus
              </p>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl">
                Comment ça marche ?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-slate-500">
                Rejoindre le réseau MyBloodGift et sauver des vies en 4 étapes simples.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <article
                  key={step.num}
                  className="card-interactive group rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 p-6 shadow-sm"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${step.color} shadow-sm`}>
                      <step.icon className="h-6 w-6" />
                    </div>
                    <span className="text-4xl font-black text-slate-100 select-none">{step.num}</span>
                  </div>
                  <h3 className="font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FEATURES + MAP ────────────────────────────────── */}
        <section id="fonctionnalites" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <div className="mb-14 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-600">
                Fonctionnalités
              </p>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl">
                Des outils puissants, pensés pour l'urgence
              </h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Map preview */}
              <div className="card-interactive rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Réseau national</p>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">Centres de collecte</h3>
                  </div>
                  <div className="rounded-xl bg-red-50 p-2.5 text-red-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                </div>
                <MapPreview compact />
              </div>

              {/* Feature grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {features.map((f) => (
                  <div
                    key={f.title}
                    className="card-interactive rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-slate-900">{f.title}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── ACTORS ────────────────────────────────────────── */}
        <section id="acteurs" className="border-t border-slate-200/60 bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <div className="mb-14 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-600">Acteurs du réseau</p>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl">
                Une plateforme adaptée à chaque mission
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-slate-500">
                Interface dédiée pour Donneurs, Demandeurs, Hôpitaux et Administrateurs.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {UsersCardObject.map((item, i) => (
                <article
                  key={i}
                  className="card-interactive group rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/60 p-6 shadow-sm"
                >
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${item.color} transition-transform group-hover:scale-110`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── LIVE NOTIFICATION SHOWCASE ────────────────────── */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-red-200/60 bg-gradient-to-br from-red-600 via-rose-600 to-red-700 p-8 shadow-xl md:p-12">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/8 blur-3xl" />
                <div className="absolute -bottom-10 left-10 h-60 w-60 rounded-full bg-rose-400/20 blur-3xl" />
              </div>
              <div className="relative z-10 grid gap-8 lg:grid-cols-2 lg:items-center">
                <div className="text-white">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 pulse-emerald" />
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">Live · Temps Réel</span>
                  </div>
                  <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                    Notifications instantanées & alertes d'urgence
                  </h2>
                  <p className="mt-4 max-w-lg text-red-100 leading-relaxed">
                    Restez informé des besoins critiques en temps réel. Notre réseau déclenche des alertes ciblées par groupe sanguin et position géographique.
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button asChild variant="secondary" size="lg" className="rounded-xl border-none bg-white  hover:bg-slate-100 font-bold px-8">
                      <a href="/signup">Créer un compte</a>
                    </Button>
                    <Button asChild variant="primary" size="lg" className="rounded-xl border-white/40 text-white hover:bg-white/10 font-bold px-8">
                      <a href="/login">Se connecter</a>
                    </Button>
                  </div>
                </div>

                {/* Mock notification feed */}
                <div className="flex flex-col gap-3">
                  {[
                    { type: "Critique", msg: "Besoin urgent O− · CHU de Yaoundé, Cameroun", time: "Il y a 2 min", dot: "bg-red-300" },
                    { type: "Urgent", msg: "Don A− requis · Centre Agdal · 3 poches", time: "Il y a 8 min", dot: "bg-amber-300" },
                    { type: "Info", msg: "Votre rendez-vous du 28/06 est confirmé", time: "Il y a 15 min", dot: "bg-emerald-300" },
                  ].map((n) => (
                    <div key={n.msg} className="flex items-start gap-3 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                      <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.dot} pulse-emerald`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white/70 uppercase tracking-wider">{n.type}</p>
                        <p className="text-sm font-semibold text-white truncate">{n.msg}</p>
                      </div>
                      <span className="shrink-0 text-[10px] text-red-200 whitespace-nowrap">{n.time}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    <span className="text-xs font-semibold text-white/70">Connecté en temps réel · WebSocket actif</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FAQ ───────────────────────────────────────────── */}
        <section id="faq" className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-600">FAQ</p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-950">Questions fréquentes</h2>
          </div>
          <div className="space-y-4">
            {questionCardObject.map((card, i) => (
              <FaqItem key={i} question={card.question} answer={card.answer} />
            ))}
          </div>
        </section>

        {/* ─── FINAL CTA ─────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 md:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-red-200/60 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-8 shadow-2xl md:p-14 text-white">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/8 blur-3xl" />
              <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-rose-400/20 blur-3xl" />
            </div>
            <div className="relative z-10 flex flex-col items-center gap-8 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/15 border border-white/20 backdrop-blur-md">
                <HeartPulse className="h-10 w-10 text-white heart-beat" />
              </div>
              <div>
                <span className="rounded-full border border-white/20 bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
                  Engagement Citoyen
                </span>
                <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                  Rejoignez le réseau national MyBloodGift.
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-red-100 leading-relaxed sm:text-lg">
                  Inscrivez-vous en moins de 2 minutes pour recevoir les alertes compatibles et réserver votre prochain don.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="secondary" size="lg" className="rounded-xl border-none bg-white hover:bg-slate-100 font-bold px-10">
                  <a href="/signup">Créer un compte gratuitement</a>
                </Button>
                <Button asChild variant="primary" size="lg" className="rounded-xl border-white/40 text-white hover:bg-white/10 font-bold px-10">
                  <a href="/login">Se connecter</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 text-center sm:px-6 md:flex-row md:items-center md:justify-between md:text-left">
          <div className="flex items-center justify-center gap-3 md:justify-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-700 font-black text-white shadow-md text-xs">
              MBG
            </div>
            <div>
              <p className="font-bold text-slate-900">MyBloodGift</p>
              <p className="text-xs text-slate-500">© 2026 MyBloodGift · Système national de gestion du sang</p>
            </div>
          </div>
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-slate-600 font-medium" aria-label="Footer">
            <a href="#" className="transition hover:text-red-600">Confidentialité</a>
            <a href="#" className="transition hover:text-red-600">Mentions légales</a>
            <a href="#" className="transition hover:text-red-600">Contact & Assistance</a>
          </nav>
        </div>
      </footer>
    </>
  )
}
