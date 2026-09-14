import { useCallback, useEffect, useState } from "react"
import {
  Award,
  CalendarDays,
  CheckCircle2,
  Droplet,
  Heart,
  HeartPulse,
  MapPin,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  X,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DashboardLayout,
  SectionCard,
  StatCard,
  StatusBadge,
} from "@/components/ui/DashboardLayout"
import { authService } from "@/api/authServices"
import {
  bloodService,
  type DonationAppointment,
  type DonationCenter,
  type DonationEligibilityAnalysis,
} from "@/api/bloodServices"
import type { User } from "@/types/api"

function DashBoardDonneur() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [available, setAvailable] = useState<boolean>(false)
  const [eligibility, setEligibility] = useState<DonationEligibilityAnalysis | null>(null)
  const [appointments, setAppointments] = useState<DonationAppointment[]>([])
  const [centers, setCenters] = useState<DonationCenter[]>([])
  const [ranking, setRanking] = useState<{ donations: number; level: string; rank: number; donors_ranked: number; next_level_at: number } | null>(null)
  const [loading, setLoading] = useState(true)

  // AI Modal state
  const [showAiModal, setShowAiModal] = useState(false)
  const [aiAnalysisResult, setAiAnalysisResult] = useState<DonationEligibilityAnalysis | null>(null)
  const [aiAnalyzing, setAiAnalyzing] = useState(false)
  const [aiForm, setAiForm] = useState({
    symptoms: "",
    medical_history: "",
    last_donation_days: undefined as number | undefined,
    medication: false,
    fever_or_infection: false,
  })

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [u, el, appts, ctrs, ranking] = await Promise.all([
        authService.getMe().catch(() => null),
        bloodService.getDonorAiEligibility().catch(() => null),
        bloodService.listAppointments().catch(() => []),
        bloodService.findCenters({ latitude: 3.8667, longitude: 11.5167 }).catch(() => []),
        bloodService.getDonorRanking().catch(() => null),
      ])
      if (u) {
        setUser(u)
        setAvailable(!!u.available)
      }
      setEligibility(el)
      setAppointments(appts)
      setCenters(ctrs)
      setRanking(ranking)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Initial dashboard hydration intentionally updates several remote-resource states.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData()
  }, [loadData])

  const toggleAvailability = async () => {
    const nextState = !available
    setAvailable(nextState)
    try {
      await bloodService.setDonorAvailability(nextState)
    } catch {
      setAvailable(!nextState)
    }
  }

  const handleRunAiAnalysis = async (e: React.FormEvent) => {
    e.preventDefault()
    setAiAnalyzing(true)
    setAiAnalysisResult(null)
    try {
      const res = await bloodService.analyzeDonation(aiForm)
      setAiAnalysisResult(res)
    } catch (err) {
      setAiAnalysisResult({
        eligible: false,
        explanation: err instanceof Error ? err.message : "Erreur lors de l'analyse.",
        score: 0,
        risk_level: "élevé",
        factors: ["Analyse indisponible"],
        recommendations: ["Réessayez lorsque la connexion sera rétablie."],
        data_sufficiency: "insuffisante",
        next_eligible_date: null,
        evaluated_at: new Date().toISOString(),
      })
    } finally {
      setAiAnalyzing(false)
    }
  }

  const nextAppt = appointments.length > 0 ? appointments[0] : null
  const bloodGroupStr = user?.blood_group ? `${user.blood_group}${user.rhesus || "+"}` : "O+"

  return (
    <DashboardLayout activeItem="Tableau de bord" role="donneur" userName={user?.first_name}>
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Banner Welcome */}
        <div className="relative overflow-hidden rounded-3xl border border-red-200/80 bg-linear-to-r from-red-600 via-rose-600 to-red-700 p-6 sm:p-8 text-white shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xs border border-white/20">
                <Award className="h-3.5 w-3.5 text-amber-300" /> Donneur Engagé · Niveau {ranking?.level ?? "—"} · Rang {ranking?.rank ?? "—"}
              </div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl text-white">
                Bonjour {user?.first_name || "Users"}, chaque don est un cadeau de vie.
              </h1>
              <p className="text-red-100 text-sm sm:text-base leading-relaxed">
                Grâce à votre engagement solidaire, vous faites partie du réseau citoyen qui répond aux urgences de transfusion sanguine.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl border-white/40 bg-white/10 text-white hover:bg-white/20 backdrop-blur-xs font-semibold"
                onClick={() => setShowAiModal(true)}
              >
                <Sparkles className="h-4 w-4 text-purple-300" /> Éligibilité IA
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="rounded-xl bg-white border border-white text-white hover:bg-slate-100 font-bold shadow-lg"
                onClick={() => navigate("/donneur/dons")}
              >
                <Plus className="h-4 w-4 " /> Planifier un don
              </Button>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-64 w-64 translate-x-12 -translate-y-12 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        </div>

        {/* Toggle Dispo Card */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover-lift">
          <div className="flex items-center gap-4">
            <div className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${available ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30" : "bg-slate-200 text-slate-600"}`}>
              <HeartPulse className={`h-6 w-6 ${available ? "heart-beat" : ""}`} />
              {available && <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-white pulse-emerald" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                Disponibilité Alertes Urgentes : {available ? "ACTIF" : "INACTIF"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {available
                  ? "Vous recevrez des notifications directes en cas de besoin critique de votre groupe sanguin."
                  : "Activez votre statut pour être contacté en priorité par les établissements proches."}
              </p>
            </div>
          </div>
          <Button
            variant={available ? "secondary" : "primary"}
            className={`rounded-xl px-5 font-semibold whitespace-nowrap ${available ? "bg-slate-100 text-white hover:bg-slate-200" : ""}`}
            onClick={() => void toggleAvailability()}
          >
            {available ? "Me désactiver" : "Me déclarer disponible"}
          </Button>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Mon Groupe Sanguin"
            value={bloodGroupStr}
            detail="Profil vérifié sur la plateforme"
            icon={<Droplet className="h-5 w-5 text-red-600" />}
            tone="red"
          />
          <StatCard
            label="Éligibilité Don"
            value={eligibility?.eligible ? "Éligible" : "En attente"}
            detail={eligibility ? `Score IA ${eligibility.score}/100 · risque ${eligibility.risk_level}` : "Analyse en cours"}
            icon={<ShieldCheck className="h-5 w-5 text-emerald-600" />}
            tone={eligibility?.eligible ? "green" : "amber"}
          />
          <StatCard
            label="Prochain Rendez-vous"
            value={nextAppt ? new Date(nextAppt.scheduled_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "Aucun"}
            detail={nextAppt ? (nextAppt.center_name || `Centre #${nextAppt.center_id}`) : "Aucune réservation programmée"}
            icon={<CalendarDays className="h-5 w-5 text-blue-600" />}
            tone="blue"
          />
          <StatCard
            label="Impact Estimé"
            value={ranking ? `#${ranking.rank}` : "—"}
            detail={ranking ? `${ranking.donations} don(s) validé(s) sur ${ranking.donors_ranked} donneur(s)` : "Classement indisponible"}
            icon={<Heart className="h-5 w-5 text-rose-600" />}
            tone="red"
          />
        </div>

        {/* Main Content Layout */}
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <SectionCard
            title="Mes Prochains Rendez-vous"
            description="Consultez et gérez vos réservations de collecte."
          >
            {loading ? (
              <p className="py-8 text-center text-sm text-slate-500">Chargement de vos rendez-vous...</p>
            ) : appointments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
                <CalendarDays className="mx-auto h-10 w-10 text-slate-400" />
                <p className="mt-3 text-sm font-semibold text-slate-700">Vous n'avez pas de rendez-vous à venir.</p>
                <p className="mt-1 text-xs text-slate-500">Réservez dès maintenant dans un centre partenaire.</p>
                <Button variant="outline" className="mt-4 rounded-xl font-semibold" onClick={() => navigate("/donneur/dons")}>
                  Prendre un rendez-vous
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {appointments.map((appt) => (
                  <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0" key={appt.id}>
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                        <CalendarDays className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{appt.center_name || `Centre #${appt.center_id}`}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          {new Date(appt.scheduled_at).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
                        </p>
                      </div>
                    </div>
                    <StatusBadge tone={appt.status === "confirmed" || appt.status === "pending" ? "success" : "neutral"}>
                      {appt.status === "pending" ? "En attente" : appt.status === "confirmed" ? "Confirmé" : appt.status}
                    </StatusBadge>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Centres Proches Référencés" description="Points de collecte ouverts dans votre zone.">
            {centers.length === 0 ? (
              <div className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-500">
                Recherche des centres de collecte...
              </div>
            ) : (
              <div className="space-y-3">
                {centers.slice(0, 3).map((center) => (
                  <div key={center.id} className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 hover:border-slate-300 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-red-100/80 p-2 text-red-600">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-slate-900 truncate">{center.name}</h4>
                        <p className="mt-0.5 text-xs text-slate-500 truncate">{center.address}</p>
                        <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                          <UserCheck className="h-3 w-3" />
                          {center.available ? "Ouvert aujourd'hui" : "Ouverture restreinte"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full rounded-xl font-semibold text-xs" onClick={() => navigate("/donneur/centres")}>
                  Voir tous les centres
                </Button>
              </div>
            )}
          </SectionCard>
        </div>
      </div>

      {/* Modal Analyse Éligibilité IA */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-purple-700">
                <Sparkles className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-bold text-slate-900">Analyse Médicale d'Éligibilité IA</h3>
              </div>
              <button onClick={() => setShowAiModal(false)} className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRunAiAnalysis} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Jours depuis votre dernier don</label>
                <input
                  type="number"
                  min="0"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  value={aiForm.last_donation_days ?? ""}
                  onChange={(e) => setAiForm({ ...aiForm, last_donation_days: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Symptômes récents (si aucun, laisser vide)</label>
                <input
                  type="text"
                  placeholder="Ex: fièvre, rhume, toux, grippe..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  value={aiForm.symptoms}
                  onChange={(e) => setAiForm({ ...aiForm, symptoms: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2.5 pt-2 text-xs font-medium text-slate-700">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aiForm.medication}
                    onChange={(e) => setAiForm({ ...aiForm, medication: e.target.checked })}
                    className="accent-purple-600 h-4 w-4 rounded"
                  />
                  Traitements médicamenteux récents (antibiotiques...)
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aiForm.fever_or_infection}
                    onChange={(e) => setAiForm({ ...aiForm, fever_or_infection: e.target.checked })}
                    className="accent-purple-600 h-4 w-4 rounded"
                  />
                  Fièvre ou état infectieux au cours des 14 derniers jours
                </label>
              </div>

              <Button type="submit" variant="primary" disabled={aiAnalyzing} className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 font-bold py-3">
                {aiAnalyzing ? "Diagnostic IA en cours..." : "Lancer l'Analyse d'Éligibilité IA"}
              </Button>
            </form>

            {aiAnalysisResult && (
              <div className={`mt-5 rounded-2xl p-4 border ${aiAnalysisResult.eligible ? "bg-emerald-50 border-emerald-200 text-emerald-950" : "bg-amber-50 border-amber-200 text-amber-950"}`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {aiAnalysisResult.eligible ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      Éligibilité Favorable
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="h-5 w-5 text-amber-600" />
                      Contre-indication Détectée
                    </>
                  )}
                </div>
                <p className="mt-2 text-xs leading-relaxed">{aiAnalysisResult.explanation}</p>
                <div className="mt-3 flex items-center justify-between text-xs font-semibold">
                  <span>Score IA : {aiAnalysisResult.score}/100</span>
                  <span>Risque {aiAnalysisResult.risk_level}</span>
                </div>
                {aiAnalysisResult.factors.length > 0 && (
                  <ul className="mt-3 list-disc space-y-1 pl-4 text-xs">
                    {aiAnalysisResult.factors.map((factor) => <li key={factor}>{factor}</li>)}
                  </ul>
                )}
                <p className="mt-3 text-xs font-semibold">Recommandations</p>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-xs">
                  {aiAnalysisResult.recommendations.map((recommendation) => <li key={recommendation}>{recommendation}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default DashBoardDonneur
