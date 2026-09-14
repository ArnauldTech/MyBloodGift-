import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Activity,
  AlertTriangle,
  Bell,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Download,
  Hospital,
  HeartPulse,
  MapPin,
  Package,
  Search,
  ShieldCheck,
  Users,
  LocateFixed,
  Pencil,
  Trash2,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DashboardLayout,
  PageHeader,
  SectionCard,
  StatCard,
  StatusBadge,
} from "@/components/ui/DashboardLayout"
import { MapPreview } from "@/components/ui/MapPreview"
import type { AppRole } from "@/utils/object"
import { bloodService, type BloodGroup, type StockItem } from "@/api/bloodServices"
import { authService } from "@/api/authServices"
import type { User } from "@/types/api"
import { useAsyncResource } from "@/hooks/useAsyncResource"
import { bloodRequestSchema } from "@/utils/validation"
import { useLiveNotifications } from "@/hooks/useLiveNotifications"
import { aiService, type AIInsight } from "@/api/aiServices"
import { LoadingScreen } from "@/components/ui/LoadingScreen"
import { toast } from "sonner"

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"

export function RendezVous() {
  const { data: appointments, loading, error, refresh } = useAsyncResource(
    bloodService.listAppointments,
    [],
  )
  const [showBooking, setShowBooking] = useState(false)
  const [booking, setBooking] = useState({ center_id: "1", scheduled_at: "" })
  const [bookingError, setBookingError] = useState<string | null>(null)
  const cancel = async (id: number) => {
    await bloodService.cancelAppointment(id)
    await refresh()
  }
  return (
    <DashboardLayout activeItem="Rendez-vous">
      <PageShell>
        <PageHeader
          eyebrow="Agenda"
          title="Mes rendez-vous"
          description="Gérez vos prochaines collectes et retrouvez votre historique."
          action={
            <Button variant="primary" className="rounded-xl" onClick={() => setShowBooking(true)}>
              <CalendarDays className="h-4 w-4" /> Nouveau rendez-vous
            </Button>
          }
        />
        {showBooking && (
          <SectionCard title="Réserver un créneau">
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={async (event) => {
              event.preventDefault()
              setBookingError(null)
              try {
                await bloodService.createAppointment({ center_id: Number(booking.center_id), scheduled_at: booking.scheduled_at })
                setShowBooking(false)
                await refresh()
              } catch (cause) {
                setBookingError(cause instanceof Error ? cause.message : "Ce créneau n'est pas disponible.")
              }
            }}>
              <label className="text-sm font-semibold">Centre
                <input required type="number" min="1" className={`${inputClass} mt-2`} value={booking.center_id} onChange={(e) => setBooking({ ...booking, center_id: e.target.value })} />
              </label>
              <label className="text-sm font-semibold">Date et heure
                <input required type="datetime-local" className={`${inputClass} mt-2`} value={booking.scheduled_at} onChange={(e) => setBooking({ ...booking, scheduled_at: e.target.value })} />
              </label>
              {bookingError && <p className="text-sm text-red-600 sm:col-span-2">{bookingError}</p>}
              <Button type="submit" variant="primary" className="rounded-xl sm:col-span-2">Confirmer le créneau</Button>
            </form>
          </SectionCard>
        )}
        <SectionCard title="Mes rendez-vous" description="Les créneaux sont synchronisés avec le centre de collecte.">
          {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {loading ? <EmptyState icon={<CalendarDays className="animate-pulse" />} text="Chargement de votre agenda…" /> : appointments.length === 0 ? <EmptyState icon={<CalendarDays />} text="Aucun rendez-vous enregistré." /> : (
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <article key={appointment.id} className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-4">
                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600"><CalendarDays /></div>
                    <div>
                      <h3 className="font-bold">{appointment.center_name ?? `Centre #${appointment.center_id}`}</h3>
                      <p className="mt-1 text-sm text-slate-600">{new Date(appointment.scheduled_at).toLocaleString("fr-FR")} · <MapPin className="inline h-3.5 w-3.5" /> {appointment.center_address ?? "Adresse à confirmer"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge tone={appointment.status === "cancelled" ? "neutral" : "success"}>{appointment.status === "cancelled" ? "Annulé" : appointment.status === "completed" ? "Terminé" : "Confirmé"}</StatusBadge>
                    {appointment.status === "pending" || appointment.status === "confirmed" ? <Button variant="outline" className="rounded-xl" onClick={() => void cancel(appointment.id)}>Annuler</Button> : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </SectionCard>
      </PageShell>
    </DashboardLayout>
  )
}

export function Notifications({ role = "donneur" }: { role?: AppRole }) {
  const { connected } = useLiveNotifications()
  const { data: notifications, loading, error, refresh } = useAsyncResource(
    bloodService.listNotifications,
    [],
  )
  const markAllRead = async () => {
    await bloodService.markAllNotificationsRead()
    await refresh()
  }
  return (
    <DashboardLayout role={role} activeItem="Notifications">
      <PageShell>
        <PageHeader
          eyebrow="Centre de messages"
          title="Notifications"
          description="Restez informée des besoins et des mises à jour de votre compte."
          action={
            <Button variant="outline" className="rounded-xl" onClick={() => void markAllRead()}>
              Tout marquer comme lu
            </Button>
          }
        />
        <SectionCard title="Récentes">
          <p className="mb-4 text-xs text-slate-500">
            <span
              className={`mr-2 inline-block h-2 w-2 rounded-full ${connected ? "bg-emerald-500" : "bg-slate-300"}`}
            />
            {connected
              ? "Notifications en temps réel"
              : "Synchronisation à la prochaine actualisation"}
          </p>
          {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {loading ? (
            <EmptyState icon={<Bell />} text="Chargement des notifications…" />
          ) : notifications.length === 0 ? (
            <EmptyState icon={<Bell />} text="Aucune notification pour le moment." />
          ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notification) => (
              <div className="flex items-center gap-4 py-4 first:pt-0" key={notification.title}>
                <div className="rounded-xl bg-red-50 p-3 text-red-600">
                  <Bell className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{notification.title}</p>
                  <p className="text-sm text-slate-500">{notification.message}</p>
                </div>
                <StatusBadge tone={notification.read ? "neutral" : "danger"}>
                  {notification.read ? "Lue" : "Nouvelle"}
                </StatusBadge>
              </div>
            ))}
          </div>
          )}
        </SectionCard>
      </PageShell>
    </DashboardLayout>
  )
}

export function Profil({ role = "donneur" }: { role?: AppRole }) {
  const [saved, setSaved] = useState(false)
  const { data: user, loading, error, refresh } = useAsyncResource(authService.getMe, null)
  const { data: ranking } = useAsyncResource(bloodService.getDonorRanking, null)
  const downloadCard = async () => {
    const blob = await bloodService.downloadDonorCard()
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "carte-donneur.pdf"
    link.click()
    URL.revokeObjectURL(url)
  }
  return (
    <DashboardLayout role={role} activeItem="Profil">
      <PageShell>
        <PageHeader
          eyebrow="Mon compte"
          title="Mon profil"
          description="Maintenez vos informations personnelles et votre groupe sanguin à jour."
          action={role === "donneur" ? <Button variant="secondary" className="rounded-xl" onClick={() => void downloadCard()}><Download className="h-4 w-4" /> Carte donneur</Button> : undefined}
        />
        {role === "donneur" && ranking && (
          <SectionCard title="Carte numérique du donneur" description="Présentation officielle de votre engagement et de votre classement réel.">
            <div className="overflow-hidden rounded-3xl bg-linear-to-br from-red-700 via-red-600 to-rose-500 p-5 text-white shadow-xl sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-100">MyBloodGift</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-red-200">Carte nationale donneur</p>
                </div>
                <HeartPulse className="h-8 w-8 text-red-100" />
              </div>
              <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-red-200">Titulaire du compte</p>
                  <p className="mt-1 text-2xl font-black">{user?.first_name} {user?.last_name}</p>
                  <p className="mt-2 text-sm text-red-100">Groupe sanguin : {user?.blood_group}{user?.rhesus}</p>
                </div>
                <div className="rounded-2xl bg-white/15 px-5 py-4 text-center backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-widest text-red-100">Rang réel</p>
                  <p className="mt-1 text-4xl font-black">#{ranking.rank}</p>
                  <p className="text-sm font-bold text-amber-200">Niveau {ranking.level}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 border-t border-white/20 pt-4 text-xs text-red-100">
                <span>{ranking.donations} don(s) validé(s)</span>
                <span>•</span>
                <span>{ranking.donors_ranked} donneur(s) classé(s)</span>
                <span>•</span>
                <span>Prochain palier : {ranking.next_level_at} dons</span>
              </div>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-950 p-5 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Données sécurisées</p>
                <p className="mt-3 font-mono text-sm tracking-widest text-emerald-300">•••• •••• #{ranking.rank.toString().padStart(4, "0")}</p>
                <p className="mt-2 text-xs text-slate-400">Identité vérifiée · QR disponible sur la carte PDF</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Impact solidaire</p>
                <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white">{ranking.donations * 3} vies</p>
                <p className="text-xs text-slate-500">estimées grâce à vos dons validés</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 dark:border-emerald-900/60 dark:bg-emerald-950/30">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">Éligibilité</p>
                <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-200">Statut calculé selon vos dons et les règles médicales.</p>
              </div>
              <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            </div>
          </SectionCard>
        )}
        <SectionCard title="Informations personnelles">
          {loading ? <p className="text-sm text-slate-500">Chargement du profil…</p> : error ? (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>
          ) : <form
            className="grid gap-5 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault()
              const values = new FormData(event.currentTarget)
              void authService.updateMe({
                first_name: String(values.get("first_name")),
                last_name: String(values.get("last_name")),
                phone: String(values.get("phone")),
                blood_group: String(values.get("blood_group")).slice(0, -1) as User["blood_group"],
                rhesus: String(values.get("blood_group")).slice(-1) as User["rhesus"],
              }).then(() => {
                setSaved(true)
                void refresh()
              }).catch(() => setSaved(false))
            }}
          >
            <label className="text-sm font-semibold">
              Prénom
              <input name="first_name" className={`${inputClass} mt-2`} defaultValue={user?.first_name ?? ""} />
            </label>
            <label className="text-sm font-semibold">
              Nom
              <input name="last_name" className={`${inputClass} mt-2`} defaultValue={user?.last_name ?? ""} />
            </label>
            <label className="text-sm font-semibold">
              Email
              <input
                type="email"
                className={`${inputClass} mt-2`}
                name="email"
                readOnly
                defaultValue={user?.email ?? ""}
              />
            </label>
            <label className="text-sm font-semibold">
              Groupe sanguin
              <select name="blood_group" className={`${inputClass} mt-2`} defaultValue={`${user?.blood_group ?? "O"}${user?.rhesus ?? "+"}`}>
                <option>O+</option>
                <option>O-</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>
            </label>
            <label className="text-sm font-semibold">
              Téléphone
              <input name="phone" className={`${inputClass} mt-2`} defaultValue={user?.phone ?? ""} placeholder="+237 6 00 00 00 00" />
            </label>
            <div className="sm:col-span-2 flex items-center gap-3">
              <Button type="submit" variant="primary" className="rounded-xl">
                Enregistrer les modifications
              </Button>
              {saved && (
                <span className="text-sm text-emerald-600">Modifications enregistrées.</span>
              )}
            </div>
          </form>}
        </SectionCard>
      </PageShell>
    </DashboardLayout>
  )
}

export function Parametres({ role = "donneur" }: { role?: AppRole }) {
  const displayKey = `display_mode_${role}`
  const [dark, setDark] = useState(() => localStorage.getItem(displayKey) === "dark")
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
    localStorage.setItem(displayKey, dark ? "dark" : "light")
    window.dispatchEvent(new Event("mbg:theme-change"))
  }, [dark, displayKey])
  return (
    <DashboardLayout role={role} activeItem="Paramètres">
      <PageShell>
        <PageHeader
          eyebrow="Préférences"
          title="Paramètres"
          description="Configurez vos notifications et vos préférences de confidentialité."
        />
        <SectionCard title="Notifications">
          <div className="space-y-4">
            {[
              "Alertes urgentes de mon groupe sanguin",
              "Rappels de rendez-vous",
              "Actualités des campagnes locales",
            ].map((label, index) => (
              <label
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-sm"
                key={label}
              >
                {label}
                <input
                  type="checkbox"
                  defaultChecked={index < 2}
                  className="h-5 w-5 accent-red-600"
                />
              </label>
            ))}
          </div>
          <Button variant="primary" className="mt-5 rounded-xl">
            Enregistrer
          </Button>
        </SectionCard>
        <SectionCard title="Apparence">
          <label className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-sm">
            Mode sombre
            <input type="checkbox" checked={dark} onChange={(event) => setDark(event.target.checked)} className="h-5 w-5 accent-red-600" />
          </label>
        </SectionCard>
      </PageShell>
    </DashboardLayout>
  )
}

export function Centres() {
  const [location, setLocation] = useState({ latitude: 3.8667, longitude: 11.5167 })
  const [locationError, setLocationError] = useState<string | null>(null)
  const [locating, setLocating] = useState(false)
  const [hasRealPos, setHasRealPos] = useState(false)
  const loadCenters = useCallback(() => bloodService.findCenters(location), [location])
  const { data: centers, loading, error, refresh } = useAsyncResource(loadCenters, [])

  const locate = () => {
    if (!navigator.geolocation) {
      setLocationError("La géolocalisation n'est pas disponible sur cet appareil.")
      return
    }
    setLocating(true)
    setLocationError(null)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationError(null)
        setHasRealPos(true)
        setLocating(false)
        setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude })
      },
      () => {
        setLocationError("Autorisez la localisation pour rechercher les centres proches.")
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  useEffect(() => {
    // Ask for the real device position when the map screen opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    locate()
  }, [])

  return (
    <DashboardLayout activeItem="Dons">
      <PageShell>
        <PageHeader
          eyebrow="Géolocalisation"
          title="Trouver un centre"
          description="Localisez les centres de collecte partenaires et calculez votre itinéraire en temps réel."
          action={
            <Button
              variant="primary"
              className="rounded-xl"
              onClick={locate}
              disabled={locating}
            >
              <LocateFixed className={`h-4 w-4 ${locating ? "animate-spin" : ""}`} />
              {locating ? "Localisation…" : hasRealPos ? "Actualiser ma position" : "Me localiser"}
            </Button>
          }
        />

        {/* Error banner */}
        {locationError && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            {locationError}
          </div>
        )}

        {/* Main 2-col grid */}
        <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
          {/* Left: center list */}
          <SectionCard
            title="Centres proches"
            description={loading ? "Recherche en cours…" : `${centers.length} centre(s) trouvé(s)`}
          >
            {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            {loading ? (
              <EmptyState icon={<MapPin className="animate-pulse" />} text="Recherche des centres…" />
            ) : centers.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <EmptyState icon={<MapPin />} text="Aucun centre trouvé près de votre position." />
                <Button variant="primary" className="rounded-xl" onClick={locate}>
                  <LocateFixed className="h-4 w-4" /> Me localiser maintenant
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {centers.map((center) => (
                  <article
                    key={center.id}
                    className="card-interactive flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-linear-to-b from-white to-slate-50/50 p-4 shadow-sm"
                  >
                    {/* Status dot + icon */}
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${center.available ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                      <MapPin className="h-5 w-5" />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900 truncate">{center.name}</h3>
                        <span
                          className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            center.available
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${center.available ? "bg-emerald-500" : "bg-amber-400"}`} />
                          {center.available ? "Ouvert" : "À confirmer"}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-slate-500 truncate">{center.address}</p>
                      {center.distance_km !== undefined && (
                        <p className="mt-1 text-xs font-semibold text-slate-400">
                          ≋ {center.distance_km.toFixed(1)} km
                        </p>
                      )}
                    </div>

                    {/* Route CTA */}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 flex items-center gap-1.5 rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-red-700"
                    >
                      <X className="h-3.5 w-3.5 rotate-45" />
                      Itinéraire
                    </a>
                  </article>
                ))}
                <Button variant="ghost" className="w-full rounded-xl text-xs" onClick={() => void refresh()}>
                  Actualiser la liste
                </Button>
              </div>
            )}
          </SectionCard>

          {/* Right: map (takes priority on mobile with order) */}
          <SectionCard title="Carte interactive">
            <MapPreview
              centers={centers}
              location={location}
              onLocate={locate}
            />
          </SectionCard>
        </div>
      </PageShell>
    </DashboardLayout>
  )
}

export function AdminUsers() {
  const [query, setQuery] = useState("")
  const { data: users, loading, error, refresh } = useAsyncResource(bloodService.listAdminUsers, [])

  const filteredUsers = users.filter(
    (u) =>
      `${u.first_name} ${u.last_name} ${u.email} ${u.role}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  )

  return (
    <DashboardLayout role="admin" activeItem="Utilisateurs">
      <PageShell>
        <PageHeader
          eyebrow="Administration"
          title="Utilisateurs"
          description="Gérez les comptes, les rôles et les accès à la plateforme."
          action={
            <Button variant="primary" className="rounded-xl" onClick={() => void refresh()}>
              Actualiser la liste
            </Button>
          }
        />
        <SectionCard title="Comptes enregistrés">
          <div className="mb-5 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={`${inputClass} pl-9`}
                placeholder="Rechercher par nom, email ou rôle..."
              />
            </div>
            <Button variant="outline" className="rounded-xl" onClick={() => setQuery("")}>
              Réinitialiser
            </Button>
          </div>
          {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">Chargement des utilisateurs…</p>
          ) : filteredUsers.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">Aucun utilisateur trouvé.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center" key={user.id}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700 font-bold text-sm">
                    {user.first_name[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{user.first_name} {user.last_name}</p>
                    <p className="text-xs text-slate-500">{user.email} · <span className="font-semibold uppercase text-blue-600">{user.role}</span></p>
                  </div>
                  <StatusBadge tone={user.available ? "success" : "neutral"}>
                    {user.is_active ? (user.available ? "Disponible" : "Actif") : "Suspendu"}
                  </StatusBadge>
                  <Button
                    variant={user.is_active ? "outline" : "primary"}
                    className="rounded-xl"
                    onClick={async () => {
                      await bloodService.setAdminUserStatus(user.id, !user.is_active)
                      await refresh()
                    }}
                  >
                    {user.is_active ? "Suspendre" : "Réactiver"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </PageShell>
    </DashboardLayout>
  )
}

export function AdminEstablishments() {
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: "", address: "", latitude: 3.8667, longitude: 11.5167 })
  const loadCenters = useCallback(() => bloodService.findCenters({ latitude: 3.8667, longitude: 11.5167 }), [])
  const { data: centers, loading, error, refresh } = useAsyncResource(loadCenters, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await bloodService.createEstablishment(form)
      setShowForm(false)
      setForm({ name: "", address: "", latitude: 3.8667, longitude: 11.5167 })
      await refresh()
    } catch {
      alert("Erreur lors de la création de l'établissement")
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout role="admin" activeItem="Établissements">
      <PageShell>
        <PageHeader
          eyebrow="Administration"
          title="Établissements sanitaires"
          description="Référencez les centres et contrôlez leur statut de participation."
          action={
            <Button variant="primary" className="rounded-xl" onClick={() => setShowForm(!showForm)}>
              <Hospital className="h-4 w-4" /> {showForm ? "Fermer" : "Ajouter un établissement"}
            </Button>
          }
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Établissements"
            value={String(centers.length)}
            detail="Référencés en base"
            icon={<Hospital className="h-5 w-5" />}
            tone="blue"
          />
          <StatCard
            label="Actifs"
            value={String(centers.filter((c) => c.available).length)}
            detail="Opérationnels"
            icon={<CheckCircle2 className="h-5 w-5" />}
            tone="green"
          />
          <StatCard
            label="Couverture"
            value="100%"
            detail="Géolocalisation activée"
            icon={<ShieldCheck className="h-5 w-5" />}
            tone="amber"
          />
        </div>

        {showForm && (
          <SectionCard title="Nouveau Centre Sanitaire">
            <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold sm:col-span-2">
                Nom de l'établissement
                <input
                  required
                  className={inputClass + " mt-2"}
                  placeholder="Ex: Hôpital Militaire Instruction Mohamed V"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label className="text-sm font-semibold sm:col-span-2">
                Adresse complète
                <input
                  required
                  className={inputClass + " mt-2"}
                  placeholder="Ex: Messa, Yaoundé"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </label>
              <label className="text-sm font-semibold">
                Latitude
                <input
                  type="number"
                  step="any"
                  required
                  className={inputClass + " mt-2"}
                  value={form.latitude}
                  onChange={(e) => setForm({ ...form, latitude: Number(e.target.value) })}
                />
              </label>
              <label className="text-sm font-semibold">
                Longitude
                <input
                  type="number"
                  step="any"
                  required
                  className={inputClass + " mt-2"}
                  value={form.longitude}
                  onChange={(e) => setForm({ ...form, longitude: Number(e.target.value) })}
                />
              </label>
              <div className="sm:col-span-2 flex gap-3">
                <Button type="submit" variant="primary" disabled={saving} className="rounded-xl">
                  {saving ? "Création…" : "Enregistrer l'établissement"}
                </Button>
                <Button type="button" variant="outline" className="rounded-xl" onClick={() => setShowForm(false)}>
                  Annuler
                </Button>
              </div>
            </form>
          </SectionCard>
        )}

        <SectionCard title="Liste des Établissements Sanitaires">
          {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">Chargement des établissements…</p>
          ) : centers.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">Aucun centre référencé.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {centers.map((c) => (
                <div key={c.id} className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                  <div className="rounded-lg bg-red-50 p-2 text-red-600">
                    <Hospital className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{c.name}</h4>
                    <p className="text-xs text-slate-500">{c.address}</p>
                    <p className="mt-1 text-xs font-semibold text-emerald-600">
                      {c.available ? "Ouvert" : "Fermé"} · Lat: {c.latitude}, Lon: {c.longitude}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Couverture géographique">
          <MapPreview centers={centers} />
        </SectionCard>
      </PageShell>
    </DashboardLayout>
  )
}


export function Stock({ role = "hospital" }: { role?: AppRole }) {
  const { data: stock, loading, error, refresh } = useAsyncResource(bloodService.listStock, [])
  const [referenceDate] = useState(() => Date.now())
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<StockItem | null>(null)
  const [form, setForm] = useState({ blood_group: "O+" as BloodGroup, units: "1", collected_at: "", expires_at: "" })
  const [saving, setSaving] = useState(false)
  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    const payload = {
      blood_group: form.blood_group,
      units: Number(form.units),
      expires_at: form.expires_at,
      collected_at: form.collected_at,
    }
    setSaving(true)
    try {
      if (editing) await bloodService.updateStockItem(editing.id, payload)
      else await bloodService.createStockItem(payload)
      setShowForm(false)
      setEditing(null)
      toast.success(editing ? "Poche modifiée avec succès." : "Poche ajoutée au stock.")
      await refresh()
    } catch (cause) {
      const apiError = cause as { response?: { data?: { detail?: string } } }
      toast.error(apiError.response?.data?.detail ?? "L'opération sur la poche a échoué.")
    } finally {
      setSaving(false)
    }
  }
  const remove = async (item: StockItem) => {
    if (window.confirm(`Supprimer la poche ${item.blood_group} ?`)) {
      try {
        await bloodService.deleteStockItem(item.id)
        toast.success("Poche supprimée définitivement.")
        await refresh()
      } catch (cause) {
        const apiError = cause as { response?: { data?: { detail?: string } } }
        toast.error(apiError.response?.data?.detail ?? "La suppression de la poche a échoué.")
      }
    }
  }
  const openEdit = (item: StockItem) => {
    setEditing(item)
    setForm({
      blood_group: item.blood_group,
      units: String(item.units),
      expires_at: item.expires_at.slice(0, 10),
      collected_at: item.collected_at?.slice(0, 10) ?? "",
    })
    setShowForm(true)
  }
  const groups = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]
  const totals = groups.map((group) => ({
    group,
    units: stock
      .filter((item) => item.blood_group === group)
      .reduce((sum, item) => sum + item.units, 0),
  }))
  const expiring = stock.filter(
    (item) => new Date(item.expires_at).getTime() - referenceDate < 7 * 86400000,
  )
  const totalUnits = stock.reduce((sum, item) => sum + item.units, 0)
  return (
    <DashboardLayout role={role} activeItem="Stock">
      <PageShell>
        <PageHeader
          eyebrow="Gestion hôpital"
          title="Stock de sang"
          description="Suivez les réserves, les dates d’expiration et les besoins de réapprovisionnement."
          action={
            <Button
              variant="primary"
              className="rounded-xl"
              onClick={() => {
                setEditing(null)
                setShowForm(true)
              }}
            >
              <Package className="h-4 w-4" /> Ajouter une poche
            </Button>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Poches disponibles"
            value={String(totalUnits)}
            detail="Tous groupes confondus"
            icon={<Package className="h-5 w-5" />}
            tone="blue"
          />
          <StatCard
            label="Groupes critiques"
            value={String(totals.filter((item) => item.units < 15).length)}
            detail="Sous le seuil de sécurité"
            icon={<Activity className="h-5 w-5" />}
            tone="red"
          />
          <StatCard
            label="Expire bientôt"
            value={String(expiring.length)}
            detail="Dans les 7 prochains jours"
            icon={<Bell className="h-5 w-5" />}
            tone="amber"
          />
          <StatCard
            label="Taux de couverture"
            value={`${Math.min(100, Math.round((totalUnits / 250) * 100))}%`}
            detail="Objectif réseau : 250 poches"
            icon={<ShieldCheck className="h-5 w-5" />}
            tone="green"
          />
        </div>
        {showForm && (
          <SectionCard title={editing ? "Modifier une poche" : "Ajouter une poche"}>
            <form onSubmit={save} className="grid gap-4 sm:grid-cols-3">
              <label className="text-sm font-semibold">
                Groupe
                <select
                  className={inputClass + " mt-2"}
                  value={form.blood_group}
                  onChange={(e) => setForm({ ...form, blood_group: e.target.value as BloodGroup })}
                >
                  {groups.map((group) => (
                    <option key={group}>{group}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold">
                Quantité
                <input
                  required
                  min="1"
                  type="number"
                  className={inputClass + " mt-2"}
                  value={form.units}
                  onChange={(e) => setForm({ ...form, units: e.target.value })}
                />
              </label>
              <label className="text-sm font-semibold">
                Date de prélèvement
                <input required type="date" className={inputClass + " mt-2"} value={form.collected_at} onChange={(e) => setForm({ ...form, collected_at: e.target.value })} />
              </label>
              <label className="text-sm font-semibold">
                Expiration
                <input
                  required
                  type="date"
                  className={inputClass + " mt-2"}
                  value={form.expires_at}
                  onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                />
              </label>
              <div className="flex gap-3 sm:col-span-3">
                <Button type="submit" variant="primary" disabled={saving} className="rounded-xl">
                  {saving ? "Enregistrement…" : editing ? "Enregistrer les modifications" : "Ajouter la poche"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setShowForm(false)}
                >
                  <X className="h-4 w-4" /> Annuler
                </Button>
              </div>
            </form>
          </SectionCard>
        )}
        <SectionCard
          title="Niveau par groupe"
          description="Une vue immédiate des réserves et des seuils d’alerte."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {totals.map((item) => (
              <article className="rounded-xl border border-slate-200 p-4" key={item.group}>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-red-600">{item.group}</span>
                  <StatusBadge
                    tone={item.units < 15 ? "danger" : item.units < 30 ? "warning" : "success"}
                  >
                    {item.units < 15 ? "Critique" : item.units < 30 ? "À surveiller" : "Normal"}
                  </StatusBadge>
                </div>
                <p className="mt-3 text-2xl font-bold">
                  {item.units} <span className="text-sm font-normal text-slate-500">poches</span>
                </p>
                <div className="mt-3 h-2 rounded-full bg-slate-100">
                  <div
                    className={`h-2 rounded-full ${item.units < 15 ? "bg-red-500" : item.units < 30 ? "bg-amber-500" : "bg-emerald-500"}`}
                    style={{ width: `${Math.min(100, item.units * 2)}%` }}
                  />
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Inventaire détaillé">
          {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {loading ? (
            <EmptyState
              icon={<Package className="animate-pulse" />}
              text="Chargement de l’inventaire…"
            />
          ) : stock.length === 0 ? (
            <EmptyState icon={<Package />} text="Aucune poche enregistrée." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-120 text-left text-sm">
                <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="pb-3">Groupe</th>
                    <th className="pb-3">Disponibilité</th>
                    <th className="pb-3">Expiration</th>
                    <th className="pb-3">Statut</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stock.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4 font-bold text-red-600">{item.blood_group}</td>
                      <td className="py-4">{item.units} poches</td>
                      <td className="py-4">
                        {new Date(item.expires_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="py-4">
                        <StatusBadge
                          tone={
                            item.status === "expired"
                              ? "danger"
                              : expiring.includes(item)
                                ? "warning"
                                : "success"
                          }
                        >
                          {item.status === "expired"
                            ? "Expiré"
                            : expiring.includes(item)
                              ? "Expire bientôt"
                              : "Disponible"}
                        </StatusBadge>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            aria-label="Modifier"
                            onClick={() => openEdit(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            aria-label="Supprimer"
                            onClick={() => void remove(item)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </PageShell>
    </DashboardLayout>
  )
}

export function HospitalDashboard() {
  const navigate = useNavigate()
  const { data: stock } = useAsyncResource(bloodService.listStock, [])
  const { data: requests } = useAsyncResource(bloodService.listRequests, [])

  const totalBags = stock.reduce((sum, item) => sum + item.units, 0)
  const openRequests = requests.filter((r) => r.status === "en_attente" || r.status === "en_cours")

  return (
    <DashboardLayout role="hospital" activeItem="Tableau de bord">
      <PageShell>
        <PageHeader
          eyebrow="Espace établissement"
          title="Vue d'ensemble du centre"
          description="Pilotez les dons, les demandes et les réserves de votre établissement."
          action={
            <Button variant="primary" className="rounded-xl" onClick={() => navigate("/hospital/demandes")}>
              <PlusIcon /> Nouvelle demande
            </Button>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Stock total"
            value={String(totalBags)}
            detail="Poches disponibles"
            icon={<Package className="h-5 w-5" />}
            tone="blue"
          />
          <StatCard
            label="Demandes ouvertes"
            value={String(openRequests.length)}
            detail="Besoins actifs"
            icon={<ClipboardList className="h-5 w-5" />}
            tone="red"
          />
          <StatCard
            label="Groupes en réserve"
            value={String(new Set(stock.map((s) => s.blood_group)).size)}
            detail="Sur 8 groupes sanguins"
            icon={<CheckCircle2 className="h-5 w-5" />}
            tone="green"
          />
          <StatCard
            label="Total Demandes"
            value={String(requests.length)}
            detail="Historique centre"
            icon={<Users className="h-5 w-5" />}
            tone="amber"
          />
        </div>

        <SectionCard title="Actions rapides">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: Package, label: "Gérer le stock", sub: "Poches disponibles", color: "bg-blue-50 text-blue-600", path: "/hospital/stock" },
              { icon: ClipboardList, label: "Publier une demande", sub: "Besoins urgents", color: "bg-red-50 text-red-600", path: "/hospital/demandes" },
              { icon: Activity, label: "Voir les rapports", sub: "Stats & analyses", color: "bg-emerald-50 text-emerald-600", path: "/hospital/rapports" },
            ].map(({ icon: Icon, label, sub, color, path }) => (
              <button
                key={label}
                type="button"
                onClick={() => navigate(path)}
                className="card-interactive flex items-start gap-4 rounded-2xl border border-slate-200 bg-linear-to-b from-white to-slate-50/60 p-5 text-left shadow-sm"
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{label}</p>
                  <p className="text-xs text-slate-400">{sub}</p>
                </div>
              </button>
            ))}
          </div>
        </SectionCard>
      </PageShell>
    </DashboardLayout>
  )
}

export function AdminDashboard() {
  const navigate = useNavigate()
  const { data: stats } = useAsyncResource(bloodService.getAdminStats, null)

  return (
    <DashboardLayout role="admin" activeItem="Tableau de bord">
      <PageShell>
        <PageHeader
          eyebrow="Administration"
          title="Console de pilotage"
          description="Surveillez l'activité de la plateforme et administrez les accès."
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label="Utilisateurs"
            value={String(stats?.users_count ?? 0)}
            detail="Inscrits sur la plateforme"
            icon={<Users className="h-5 w-5" />}
            tone="blue"
          />
          <StatCard
            label="Demandes réelles"
            value={String(stats?.requests_count ?? 0)}
            detail="Enregistrées en base"
            icon={<ClipboardList className="h-5 w-5" />}
            tone="red"
          />
          <StatCard
            label="Dons enregistrés"
            value={String(stats?.donations_count ?? 0)}
            detail="Traçabilité complète"
            icon={<CheckCircle2 className="h-5 w-5" />}
            tone="green"
          />
        </div>

        {/* Admin quick actions – color-coded */}
        <SectionCard title="Gestion de la plateforme">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Users, label: "Gérer les utilisateurs", sub: "Rôles & accès", color: "bg-blue-50 text-blue-600", path: "/admin/utilisateurs" },
              { icon: Hospital, label: "Établissements", sub: "Centres sanitaires", color: "bg-indigo-50 text-indigo-600", path: "/admin/etablissements" },
              { icon: Activity, label: "Rapports & Stats", sub: "Tableau analytique", color: "bg-emerald-50 text-emerald-600", path: "/admin/rapports" },
            ].map(({ icon: Icon, label, sub, color, path }) => (
              <button
                key={label}
                type="button"
                onClick={() => navigate(path)}
                className="card-interactive flex items-start gap-4 rounded-2xl border border-slate-200 bg-linear-to-b from-white to-slate-50/60 p-5 text-left shadow-sm"
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{label}</p>
                  <p className="text-xs text-slate-400">{sub}</p>
                </div>
              </button>
            ))}
          </div>
        </SectionCard>
      </PageShell>
    </DashboardLayout>
  )
}

export function DemandeurDashboard() {
  const navigate = useNavigate()
  const { data: requests, loading, error, refresh } = useAsyncResource(bloodService.listRequests, [])

  return (
    <DashboardLayout role="demandeur" activeItem="Tableau de bord">
      <PageShell>
        <PageHeader
          eyebrow="Espace demandeur"
          title="Suivi de vos demandes"
          description="Consultez l’état des demandes de sang et les réponses des donneurs."
          action={
            <Button variant="primary" className="rounded-xl" onClick={() => navigate("/demandeur/nouvelle-demande")}>
              <PlusIcon /> Effectuer une demande
            </Button>
          }
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Mes demandes"
            value={String(requests.length)}
            detail="Publiées en réseau"
            icon={<ClipboardList className="h-5 w-5" />}
          />
          <StatCard
            label="En attente"
            value={String(requests.filter((r) => r.status === "en_attente").length)}
            detail="Besoins actifs"
            icon={<Users className="h-5 w-5" />}
            tone="amber"
          />
          <StatCard
            label="Satisfaites"
            value={String(requests.filter((r) => r.status === "satisfaite").length)}
            detail="Poches reçues"
            icon={<CheckCircle2 className="h-5 w-5" />}
            tone="green"
          />
        </div>
        <SectionCard title="Demandes récentes">
          <div className="mb-4 flex justify-end">
            <Button variant="ghost" className="rounded-lg text-xs" onClick={() => void refresh()}>
              Actualiser
            </Button>
          </div>
          {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">Chargement de vos demandes…</p>
          ) : requests.length === 0 ? (
            <div className="rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">
              Vous n'avez créé aucune demande de sang pour le moment.
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  className="flex items-center gap-4 rounded-xl border border-slate-200 p-4"
                  key={req.id}
                >
                  <ClipboardList className="text-red-600 h-5 w-5" />
                  <div className="flex-1">
                    <span className="text-sm font-semibold">{req.establishment} · {req.blood_group} ({req.units} poches)</span>
                    {req.deadline && <p className="text-xs text-slate-400">Échéance: {req.deadline}</p>}
                  </div>
                  <StatusBadge tone={req.status === "en_attente" ? "warning" : req.status === "satisfaite" ? "success" : "neutral"}>
                    {req.status === "en_attente" ? "En attente" : req.status === "en_cours" ? "En cours" : req.status}
                  </StatusBadge>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </PageShell>
    </DashboardLayout>
  )
}


export function Rapports({ role = "donneur" }: { role?: AppRole }) {
  const { data: insight, loading, error, refresh } = useAsyncResource(aiService.getInsights, null)
  useEffect(() => {
    const timer = window.setInterval(() => void refresh(), 60000)
    return () => window.clearInterval(timer)
  }, [refresh])
  const download = async () => {
    const blob = await aiService.downloadReport()
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "rapport-ia.pdf"
    link.click()
    URL.revokeObjectURL(url)
  }
  return (
    <DashboardLayout role={role} activeItem="Rapports">
      <PageShell>
        <PageHeader
          eyebrow="Analyse"
          title="Rapports système"
          description="Mesurez les performances du réseau de collecte et de distribution."
          action={
            <Button variant="secondary" className="rounded-xl" onClick={() => void download()}>
              <Download className="h-4 w-4" /> Télécharger
            </Button>
          }
        />
        <SectionCard title="Analyse actualisée" description="Les indicateurs sont recalculés à chaque actualisation à partir des demandes et du stock.">
          <div className="mb-4 flex justify-end">
            <Button variant="outline" className="rounded-xl" onClick={() => void refresh()}>Actualiser l'analyse</Button>
          </div>
          {loading ? <LoadingScreen message="Analyse des stocks et des besoins…" /> : error ? <p className="text-sm text-red-600">{error}</p> : insight ? (
            <>
            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard label="Poches disponibles" value={String(insight.risks.reduce((sum, risk) => sum + risk.stock_units, 0))} detail="Stock actuel" icon={<Package />} tone="blue" />
              <StatCard label="Prévision 30 jours" value={String(insight.risks.reduce((sum, risk) => sum + risk.forecast_units, 0))} detail="Consommation estimée" icon={<Activity />} tone="green" />
              <StatCard label="Risques élevés" value={String(insight.risks.filter((risk) => risk.risk_level === "élevé").length)} detail="À traiter en priorité" icon={<AlertTriangle />} tone="amber" />
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="mb-4 font-semibold">Stock et prévision par groupe</h3>
                <div className="space-y-4">
                  {insight.risks.map((risk) => {
                    const max = Math.max(risk.stock_units, risk.forecast_units, 1)
                    return <div key={risk.blood_group}><div className="mb-1 flex justify-between text-xs font-semibold"><span>{risk.blood_group}</span><span>{risk.stock_units} / {risk.forecast_units}</span></div><div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-500" style={{ width: `${(risk.stock_units / max) * 100}%` }} /></div><div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-amber-400" style={{ width: `${(risk.forecast_units / max) * 100}%` }} /></div></div>
                  })}
                </div>
                <div className="mt-4 flex gap-4 text-xs text-slate-500"><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-blue-500" />Stock</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-400" />Prévision</span></div>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="mb-4 font-semibold">Niveau de risque</h3>
                <div className="flex h-48 items-end justify-around gap-3">
                  {insight.risks.map((risk) => <div key={risk.blood_group} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className={`w-full max-w-12 rounded-t-lg ${risk.risk_level === "élevé" ? "bg-red-500" : risk.risk_level === "modéré" ? "bg-amber-400" : "bg-emerald-500"}`} style={{ height: `${Math.max(12, (risk.forecast_units / Math.max(...insight.risks.map((item) => item.forecast_units), 1)) * 100)}%` }} /><span className="text-xs font-semibold">{risk.blood_group}</span></div>)}
                </div>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {insight.risks.map((risk) => (
                <article key={risk.blood_group} className="rounded-xl border border-slate-200 p-4">
                  <p className="font-bold text-red-600">{risk.blood_group}</p>
                  <p className="mt-2 text-sm">Stock : {risk.stock_units}</p>
                  <p className="text-sm">Prévision : {risk.forecast_units}</p>
                  <StatusBadge tone={risk.risk_level === "élevé" ? "danger" : risk.risk_level === "modéré" ? "warning" : "success"}>{risk.risk_level}</StatusBadge>
                </article>
              ))}
            </div>
            </>
          ) : null}
        </SectionCard>
        <SectionCard title="Activité mensuelle">
          <div className="flex h-64 items-end gap-3 rounded-xl bg-slate-50 p-5">
            {[42, 58, 46, 70, 64, 82, 76, 92, 68, 88, 74, 96].map((height, index) => (
              <div className="flex flex-1 flex-col justify-end gap-2" key={index}>
                <div className="rounded-t-lg bg-blue-500" style={{ height: `${height}%` }} />
                <span className="text-center text-[10px] text-slate-400">{index + 1}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </PageShell>
    </DashboardLayout>
  )
}

export function NewBloodRequest({ role = "demandeur" }: { role?: AppRole }) {
  const [created, setCreated] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    const values = new FormData(event.currentTarget)
    try {
      const payload = await bloodRequestSchema.validate({
        establishment: values.get("establishment"),
        blood_group: values.get("blood_group"),
        units: Number(values.get("units")),
        deadline: values.get("deadline"),
        urgency: values.get("urgency"),
        notes: values.get("notes") || "",
      })
      await bloodService.createRequest({
        ...payload,
        blood_group: payload.blood_group as BloodGroup,
      })
      setCreated(true)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "La demande n’a pas pu être publiée.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout role={role} activeItem="Demandes">
      <PageShell>
        <PageHeader
          eyebrow={role === "hospital" ? "Gestion hôpital" : "Demandeur"}
          title="Effectuer une demande de sang"
          description="Décrivez le besoin afin de mobiliser rapidement les donneurs compatibles."
        />
        <SectionCard title="Informations de la demande">
          {created ? (
            <div className="rounded-xl bg-emerald-50 p-6 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
              <h3 className="mt-3 text-xl font-bold text-emerald-900">Demande publiée</h3>
              <p className="mt-2 text-sm text-emerald-700">
                Les donneurs compatibles de votre région seront informés.
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-5 rounded-xl"
                onClick={() => setCreated(false)}
              >
                Créer une autre demande
              </Button>
            </div>
          ) : (
            <form className="grid gap-5 sm:grid-cols-2" onSubmit={submit}>
              <label className="text-sm font-semibold">
                Établissement
                <input
                  name="establishment"
                  required
                  className={`${inputClass} mt-2`}
                  placeholder="Nom de l’hôpital ou de la clinique"
                />
              </label>
              <label className="text-sm font-semibold">
                Groupe sanguin
                <select
                  name="blood_group"
                  required
                  className={`${inputClass} mt-2`}
                  defaultValue=""
                >
                  <option value="">Sélectionner</option>
                  {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((group) => (
                    <option key={group}>{group}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold">
                Nombre de poches
                <input
                  name="units"
                  required
                  type="number"
                  min="1"
                  className={`${inputClass} mt-2`}
                  placeholder="Ex. 4"
                />
              </label>
              <label className="text-sm font-semibold">
                Niveau d’urgence
                <select name="urgency" required defaultValue="normal" className={`${inputClass} mt-2`}>
                  <option value="normal">Normale — planifiable</option>
                  <option value="urgent">Urgente — sous 24 h</option>
                  <option value="critique">Critique — immédiate</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                Échéance
                <input name="deadline" required type="date" className={`${inputClass} mt-2`} />
              </label>
              <label className="text-sm font-semibold sm:col-span-2">
                Motif ou informations complémentaires
                <textarea
                  name="notes"
                  className={`${inputClass} mt-2 min-h-28`}
                  placeholder="Ajoutez les informations utiles..."
                />
              </label>
              {error && (
                <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700 sm:col-span-2">
                  {error}
                </p>
              )}
              <Button
                disabled={saving}
                type="submit"
                variant="primary"
                className="rounded-xl sm:col-span-2"
              >
                {saving ? "Publication…" : "Publier la demande"}
              </Button>
            </form>
          )}
        </SectionCard>
      </PageShell>
    </DashboardLayout>
  )
}

export function AIInsights({ role = "hospital" }: { role?: AppRole }) {
  const [insights, setInsights] = useState<AIInsight | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setInsights(await aiService.getInsights())
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "L’analyse n’est pas disponible.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Load the latest analysis once when the decision-support screen opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [])

  return (
    <DashboardLayout role={role} activeItem="Analyse IA">
      <PageShell>
        <PageHeader eyebrow="Aide à la décision" title="Analyse intelligente" description="Prévisions, risques et recommandations explicables pour piloter les campagnes." action={<Button variant="outline" className="rounded-xl" onClick={() => void load()} disabled={loading}>Actualiser</Button>} />
        {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {loading ? <LoadingScreen message="Analyse prédictive en cours…" /> : insights ? (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard label="Qualité des données" value={insights.data_sufficiency === "suffisante" ? "Bonne" : "À renforcer"} detail="Historique disponible" icon={<BrainCircuit />} tone="blue" />
              <StatCard label="Horizon" value={`${insights.horizon_days} j`} detail="Projection glissante" icon={<Activity />} tone="green" />
              <StatCard label="Risques élevés" value={String(insights.risks.filter((risk) => risk.risk_level === "élevé").length)} detail="À traiter en priorité" icon={<AlertTriangle />} tone="amber" />
            </div>
            <SectionCard title="Prévisions par groupe" description={insights.method}>
              <div className="grid gap-3 md:grid-cols-2">
                {insights.forecasts.map((forecast) => <article key={forecast.blood_group} className="rounded-xl border border-slate-200 p-4"><div className="flex items-center justify-between"><h3 className="font-bold">{forecast.blood_group}</h3><StatusBadge tone={forecast.status === "fiable" ? "success" : "warning"}>{forecast.status}</StatusBadge></div><p className="mt-3 text-2xl font-bold">{forecast.estimated_consumption} poches</p><p className="mt-1 text-sm text-slate-500">{Math.round(forecast.confidence * 100)} % de confiance · {forecast.data_points} observations</p></article>)}
              </div>
            </SectionCard>
            <SectionCard title="Recommandations opérationnelles">
              <div className="space-y-3">
                {insights.recommendations.map((recommendation) => <article key={recommendation.title} className="rounded-xl border border-slate-200 p-4"><div className="flex items-start gap-3"><div className="rounded-lg bg-red-50 p-2 text-red-600"><AlertTriangle className="h-5 w-5" /></div><div><h3 className="font-bold">{recommendation.title}</h3><p className="mt-1 text-sm text-slate-600">{recommendation.explanation}</p><p className="mt-2 text-sm font-medium text-blue-700">{recommendation.suggested_action}</p></div></div></article>)}
              </div>
              {insights.limitations.length > 0 && <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800"><strong>Limites :</strong> {insights.limitations.join(" ")}</div>}
            </SectionCard>
          </>
        ) : null}
      </PageShell>
    </DashboardLayout>
  )
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {children}
    </div>
  )
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm text-slate-400 border border-slate-200">
        {icon}
      </div>
      <p className="max-w-xs text-sm text-slate-400 leading-relaxed">{text}</p>
    </div>
  )
}

function PlusIcon() {
  return <span className="text-base leading-none font-bold">+</span>
}
