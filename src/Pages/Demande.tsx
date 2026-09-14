import { AlertTriangle, ClipboardList, Droplet, MapPin, Plus, Search } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DashboardLayout,
  PageHeader,
  SectionCard,
  StatCard,
  StatusBadge,
} from "@/components/ui/DashboardLayout"
import { bloodService } from "@/api/bloodServices"
import { useAsyncResource } from "@/hooks/useAsyncResource"

function Demande() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [helping, setHelping] = useState<number | null>(null)
  const loadRequests = useCallback(() => bloodService.listRequests(), [])
  const { data, loading, error, refresh } = useAsyncResource(loadRequests, [])
  const requests = useMemo(
    () =>
      data.filter((request) =>
        `${request.establishment} ${request.blood_group} ${request.city ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [data, query],
  )
  return (
    <DashboardLayout activeItem="Demandes">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        <PageHeader
          eyebrow="Besoins de sang"
          title="Demandes à proximité"
          description="Consultez les besoins compatibles avec votre groupe et manifestez votre disponibilité en quelques clics."
          action={
            <Button
              variant="primary"
              size="lg"
              className="rounded-xl"
              onClick={() => navigate("/nouvelle-demande")}
            >
              <Plus className="h-4 w-4" /> Créer une demande
            </Button>
          }
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Demandes actives"
            value={String(data.filter((request) => request.status === "en_attente").length)}
            detail="Dans votre région"
            icon={<ClipboardList className="h-5 w-5" />}
          />
          <StatCard
            label="Compatibles avec vous"
            value={String(data.filter((request) => request.status === "en_attente").length)}
            detail="Groupe sanguin O+"
            icon={<Droplet className="h-5 w-5" />}
            tone="blue"
          />
          <StatCard
            label="Urgences"
            value={String(data.filter((request) => request.urgency === "urgent").length)}
            detail="À traiter en priorité"
            icon={<AlertTriangle className="h-5 w-5" />}
            tone="amber"
          />
        </div>
        <SectionCard
          title="Demandes récentes"
          description="Les demandes sont triées par urgence et proximité."
        >
          <div className="mb-5 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher un centre, un groupe ou une ville..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
              />
            </div>
            <Button variant="outline" className="rounded-xl" onClick={() => void refresh()}>
              Actualiser
            </Button>
          </div>
          {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">Chargement des demandes…</p>
          ) : (
            <div className="grid gap-4">
              {requests.map((request) => (
                <article
                  key={request.id}
                  className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`rounded-lg p-2 ${request.status === "en_attente" ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-600"}`}
                    >
                      <Droplet className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900">{request.establishment}</h3>
                        {request.status === "en_attente" && (
                          <StatusBadge tone="danger">Urgent</StatusBadge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        <MapPin className="mr-1 inline h-3.5 w-3.5" />
                        {request.city ? `${request.city} · ` : ""}REQ-{request.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-5 sm:justify-end">
                    <div>
                      <p className="font-bold text-red-600">{request.blood_group}</p>
                      <p className="text-xs text-slate-500">
                        {request.units} poches{request.deadline ? ` · ${request.deadline}` : ""}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      disabled={helping === request.id}
                      onClick={async () => {
                        setHelping(request.id)
                        try {
                          await bloodService.offerHelp(request.id)
                          await refresh()
                        } finally {
                          setHelping(null)
                        }
                      }}
                    >
                      {helping === request.id ? "Envoi…" : "Je peux aider"}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
          {requests.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500">
              Aucune demande ne correspond à votre recherche.
            </p>
          )}
        </SectionCard>
      </div>
    </DashboardLayout>
  )
}

export default Demande
