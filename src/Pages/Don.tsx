import { CalendarDays, CheckCircle2, Clock3, Droplet, MapPin, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { DashboardLayout, PageHeader, SectionCard, StatCard } from "@/components/ui/DashboardLayout"
import { bloodService, type DonationCenter } from "@/api/bloodServices"
import { donationSchema } from "@/utils/validation"

function Don() {
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [centers, setCenters] = useState<DonationCenter[]>([])
  const [eligibility, setEligibility] = useState<{ eligible: boolean; next_donation_date: string } | null>(null)

  useEffect(() => {
    const fallback = () =>
      bloodService.findCenters({ latitude: 3.8667, longitude: 11.5167 })
        .then(setCenters)
        .catch(() => undefined)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          bloodService.findCenters({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }).then(setCenters).catch(fallback),
        fallback,
        { enableHighAccuracy: true, timeout: 10000 },
      )
    } else {
      fallback()
    }

    bloodService.getDonorEligibility()
      .then(setEligibility)
      .catch(() => {})
  }, [])

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    const values = new FormData(event.currentTarget)
    try {
      const payload = await donationSchema.validate({
        center_id: Number(values.get("center_id")),
        date: values.get("date"),
        time: values.get("time"),
      })
      await bloodService.createAppointment({
        center_id: payload.center_id,
        scheduled_at: `${payload.date}T${payload.time}:00`,
      })
      setSubmitted(true)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Le rendez-vous n’a pas pu être créé.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout activeItem="Dons" role="donneur">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        <PageHeader
          eyebrow="Don de sang"
          title="Organisez votre prochain don"
          description="Choisissez un centre, une date et un créneau qui vous conviennent. Votre disponibilité peut sauver des vies."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Mon Statut"
            value={eligibility?.eligible ? "Éligible" : "En attente"}
            detail={eligibility?.eligible ? "Profil médical à jour" : "Prochain don recommandé plus tard"}
            icon={<Droplet className="h-5 w-5" />}
          />
          <StatCard
            label="Délai recommandé"
            value="56 jours"
            detail="Entre deux dons de sang total"
            icon={<Clock3 className="h-5 w-5" />}
            tone="blue"
          />
          <StatCard
            label="Éligibilité"
            value={eligibility?.eligible ? "Validée" : "À vérifier"}
            detail="Entretien médical sur place"
            icon={<ShieldCheck className="h-5 w-5" />}
            tone={eligibility?.eligible ? "green" : "amber"}
          />
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <SectionCard
            title="Réserver un créneau"
            description="Les champs marqués d’un astérisque sont obligatoires."
          >
            {submitted ? (
              <div className="rounded-xl bg-emerald-50 p-6 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
                <h3 className="mt-3 text-xl font-bold text-emerald-900">Rendez-vous demandé !</h3>
                <p className="mt-2 text-sm text-emerald-700">
                  Nous vous confirmerons le créneau par notification dans votre espace.
                </p>
                <Button
                  variant="outline"
                  className="mt-5 rounded-xl"
                  onClick={() => setSubmitted(false)}
                >
                  Planifier un autre rendez-vous
                </Button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={submit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Centre de collecte
                    <select
                      name="center_id"
                      required
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 font-normal outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    >
                      {centers.length === 0 ? (
                        <>
                          <option value="">Sélectionnez un centre</option>
                        </>
                      ) : (
                        centers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} — {c.address}
                          </option>
                        ))
                      )}
                    </select>
                  </label>
                  <label className="text-sm font-semibold text-slate-700">
                    Date souhaitée
                    <input
                      name="date"
                      required
                      type="date"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 font-normal outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    />
                  </label>
                </div>
                <label className="text-sm font-semibold text-slate-700">
                  Créneau horaire
                  <select
                    name="time"
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 font-normal outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  >
                    <option value="09:00">09:00 - 09:30</option>
                    <option value="10:00">10:00 - 10:30</option>
                    <option value="10:30">10:30 - 11:00</option>
                    <option value="14:00">14:00 - 14:30</option>
                    <option value="15:00">15:00 - 15:30</option>
                  </select>
                </label>
                <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
                  <input required type="checkbox" className="mt-0.5 accent-red-600" /> Je confirme
                  être en bonne santé et respecter les conditions de don.
                </label>
                {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
                <Button
                  disabled={saving}
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full rounded-xl"
                >
                  {saving ? "Enregistrement…" : "Confirmer le rendez-vous"}
                </Button>
              </form>
            )}
          </SectionCard>
          <SectionCard title="À savoir avant votre don">
            <div className="space-y-4">
              <div className="flex gap-3">
                <CalendarDays className="h-5 w-5 shrink-0 text-red-600" />
                <p className="text-sm leading-6 text-slate-600">
                  Prévoyez environ 45 minutes pour l’entretien, le don et la récupération.
                </p>
              </div>
              <div className="flex gap-3">
                <Droplet className="h-5 w-5 shrink-0 text-red-600" />
                <p className="text-sm leading-6 text-slate-600">
                  Buvez suffisamment d’eau et prenez un repas léger avant de venir.
                </p>
              </div>
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-red-600" />
                <p className="text-sm leading-6 text-slate-600">
                  Présentez une pièce d’identité à l’accueil du centre.
                </p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Don
