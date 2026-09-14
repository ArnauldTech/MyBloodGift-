import { axiosClient } from "./axiosClient"

export type BloodGroup = "O+" | "O-" | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-"

export interface BloodRequest {
  id: number
  establishment: string
  blood_group: BloodGroup
  units: number
  city?: string
  status: "en_attente" | "validee" | "en_cours" | "satisfaite" | "annulee" | "rejetee"
  urgency?: "normal" | "urgent" | "critique"
  deadline?: string
}

export interface NearbyDonor {
  id: number
  first_name: string
  last_name: string
  blood_group: "A" | "B" | "AB" | "O" | null
  rhesus: "+" | "-" | null
  distance_km: number
  available: boolean
}

export interface AIDonorMatch extends NearbyDonor {
  compatibility_score: number
  availability_score: number
  priority_score: number
  donations_validated: number
  reasons: string[]
}

export interface AppNotification {
  id: number
  title: string
  message: string
  read: boolean
  created_at: string
}

export interface DonationAppointment {
  id: number
  center_id: number
  scheduled_at: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  center_name?: string
  center_address?: string | null
}

export interface AdminStats {
  users_count: number
  requests_count: number
  donations_count: number
}

export interface CreateBloodRequestPayload {
  establishment: string
  blood_group: BloodGroup
  units: number
  deadline: string
  urgency?: "normal" | "urgent" | "critique"
  notes?: string
}

type ApiBloodRequest = Omit<BloodRequest, "blood_group"> & {
  blood_group: "A" | "B" | "AB" | "O"
  rhesus?: "+" | "-"
}

function normalizeStatus(status: string): BloodRequest["status"] {
  const aliases: Record<string, BloodRequest["status"]> = {
    pending: "en_attente",
    matched: "en_cours",
    fulfilled: "satisfaite",
    cancelled: "annulee",
  }
  return aliases[status] ?? (status as BloodRequest["status"])
}

function normalizeRequest(request: ApiBloodRequest): BloodRequest {
  return {
    ...request,
    status: normalizeStatus(request.status),
    blood_group: `${request.blood_group}${request.rhesus ?? ""}` as BloodGroup,
  }
}

function splitBloodGroup(value: BloodGroup): ["A" | "B" | "AB" | "O", "+" | "-"] {
  const rhesus = value.endsWith("+") ? "+" : "-"
  return [value.slice(0, -1) as "A" | "B" | "AB" | "O", rhesus]
}

function normalizeBag(item: {
  id: number
  blood_group: "A" | "B" | "AB" | "O"
  rhesus: "+" | "-"
  units?: number
  expires_at: string
  collected_at?: string
  status: string
  urgency?: "normal" | "urgent" | "critique"
}): StockItem {
  const status =
    item.status === "disponible"
      ? "available"
      : item.status === "reservee"
        ? "reserved"
        : "expired"
  return {
    id: item.id,
    blood_group: `${item.blood_group}${item.rhesus}` as BloodGroup,
    units: item.units ?? 1,
    expires_at: item.expires_at,
    collected_at: item.collected_at,
    status,
  }
}

export interface CreateDonationPayload {
  center_id: number
  scheduled_at: string
}

export interface StockItem {
  id: number
  blood_group: BloodGroup
  units: number
  expires_at: string
  collected_at?: string
  status: "available" | "reserved" | "expired"
}

export interface StockItemPayload {
  blood_group: BloodGroup
  units: number
  expires_at: string
  collected_at?: string
}

export interface DonationCenter {
  id: number
  name: string
  address: string
  latitude: number
  longitude: number
  available: boolean
  distance_km?: number
}

export interface Location {
  latitude: number
  longitude: number
  accuracy?: number
}

export const bloodService = {
  async listRequests(): Promise<BloodRequest[]> {
    const response = await axiosClient.get<ApiBloodRequest[]>("/blood-requests")
    return response.data.map(normalizeRequest)
  },
  async createRequest(payload: CreateBloodRequestPayload): Promise<BloodRequest> {
    const [blood_group, rhesus] = payload.blood_group.endsWith("+")
      ? [payload.blood_group.slice(0, -1), "+"]
      : [payload.blood_group.slice(0, -1), "-"]
    const response = await axiosClient.post<ApiBloodRequest>("/blood-requests", {
      ...payload,
      urgency: payload.urgency ?? "normal",
      blood_group,
      rhesus,
    })
    return normalizeRequest(response.data)
  },
  async listAppointments(): Promise<DonationAppointment[]> {
    const response = await axiosClient.get<DonationAppointment[]>("/rendez-vous")
    return response.data
  },
  async createAppointment(payload: CreateDonationPayload): Promise<DonationAppointment> {
    const response = await axiosClient.post<DonationAppointment>("/rendez-vous", payload)
    return response.data
  },
  async cancelAppointment(id: number): Promise<DonationAppointment> {
    const response = await axiosClient.patch<DonationAppointment>(`/rendez-vous/${id}/cancel`)
    return response.data
  },
  async listStock(): Promise<StockItem[]> {
    const response = await axiosClient.get("/blood-bags")
    return response.data.map(normalizeBag)
  },
  async createStockItem(payload: StockItemPayload): Promise<StockItem> {
    const [blood_group, rhesus] = splitBloodGroup(payload.blood_group)
    const expires_at_iso = payload.expires_at.includes("T") ? payload.expires_at : `${payload.expires_at}T12:00:00`
    const created = await Promise.all(
      Array.from({ length: payload.units }, () =>
        axiosClient.post("/blood-bags", {
          blood_group,
          rhesus,
          expires_at: expires_at_iso,
          collected_at: payload.collected_at,
        }),
      ),
    )
    return normalizeBag(created[created.length - 1].data)
  },
  async updateStockItem(id: number, payload: Partial<StockItemPayload>): Promise<StockItem> {
    const expires_at_iso = payload.expires_at
      ? payload.expires_at.includes("T")
        ? payload.expires_at
        : `${payload.expires_at}T12:00:00`
      : undefined
    const updatePayload: Record<string, string> = {}
    if (payload.blood_group) {
      const [blood_group, rhesus] = splitBloodGroup(payload.blood_group)
      updatePayload.blood_group = blood_group
      updatePayload.rhesus = rhesus
    }
    if (payload.collected_at) {
      updatePayload.collected_at = payload.collected_at.includes("T")
        ? payload.collected_at
        : `${payload.collected_at}T12:00:00`
    }
    if (expires_at_iso) updatePayload.expires_at = expires_at_iso
    const response = await axiosClient.patch(`/blood-bags/${id}/update`, updatePayload)
    return normalizeBag(response.data)
  },
  async deleteStockItem(id: number): Promise<void> {
    await axiosClient.delete(`/blood-bags/${id}`)
  },
  async findCenters(location: Location): Promise<DonationCenter[]> {
    const response = await axiosClient.get<DonationCenter[]>("/geolocation/centres", { params: location })
    return response.data
  },
  async findNearbyDonors(location: Location, bloodGroup?: BloodGroup): Promise<NearbyDonor[]> {
    const params: Record<string, string | number> = {
      latitude: location.latitude,
      longitude: location.longitude,
      radius_km: 50,
    }
    if (bloodGroup) {
      params.blood_group = bloodGroup.slice(0, -1)
      params.rhesus = bloodGroup.endsWith("+") ? "+" : "-"
    }
    const response = await axiosClient.get<NearbyDonor[]>("/geolocation/donneurs-proches", { params })
    return response.data
  },
  async getAIDonorMatches(location: Location, bloodGroup: BloodGroup): Promise<AIDonorMatch[]> {
    const response = await axiosClient.get<AIDonorMatch[]>("/ai/donor-matches", {
      params: {
        latitude: location.latitude,
        longitude: location.longitude,
        blood_group: bloodGroup.slice(0, -1),
        rhesus: bloodGroup.endsWith("+") ? "+" : "-",
      },
    })
    return response.data
  },
  async listNotifications(): Promise<AppNotification[]> {
    const response = await axiosClient.get<AppNotification[]>("/notifications")
    return response.data
  },
  async markAllNotificationsRead(): Promise<void> {
    await axiosClient.patch("/notifications/read-all")
  },
  async setDonorAvailability(available: boolean): Promise<void> {
    await axiosClient.patch(`/donors/me/availability?available=${available}`)
  },
  async getDonorEligibility(): Promise<{ eligible: boolean; next_donation_date: string }> {
    const response = await axiosClient.get<{ eligible: boolean; next_donation_date: string }>(
      "/donors/me/eligibility",
    )
    return response.data
  },
  async getDonorRanking(): Promise<{ donations: number; level: string; rank: number; donors_ranked: number; next_level_at: number }> {
    const response = await axiosClient.get("/donors/me/ranking")
    return response.data
  },
  async downloadDonorCard(): Promise<Blob> {
    const response = await axiosClient.get("/donors/me/card", { responseType: "blob" })
    return response.data
  },
  async getAdminStats(): Promise<AdminStats> {
    const response = await axiosClient.get<AdminStats>("/admin/stats")
    return response.data
  },
  async listAdminUsers(): Promise<Array<{ id: number; first_name: string; last_name: string; email: string; role: string; available?: boolean; is_active: boolean }>> {
    const response = await axiosClient.get("/admin/utilisateurs")
    return response.data
  },
  async setAdminUserStatus(id: number, active: boolean): Promise<void> {
    await axiosClient.patch(`/admin/utilisateurs/${id}/status`, undefined, { params: { active } })
  },
  async offerHelp(requestId: number): Promise<void> {
    await axiosClient.post(`/blood-requests/${requestId}/help`)
  },
  async downloadAIReport(): Promise<Blob> {
    const response = await axiosClient.get("/ai/report", { responseType: "blob" })
    return response.data
  },
  async createEstablishment(payload: { name: string; address: string; latitude: number; longitude: number }): Promise<DonationCenter> {
    const response = await axiosClient.post<DonationCenter>("/admin/etablissements", payload)
    return response.data
  },
  async getDonorAiEligibility(): Promise<DonationEligibilityAnalysis> {
    const response = await axiosClient.get<DonationEligibilityAnalysis>("/analysis/donation-eligibility/me")
    return response.data
  },
  async analyzeDonation(payload: {
    symptoms?: string
    medical_history?: string
    last_donation_days?: number
    medication?: boolean
    fever_or_infection?: boolean
  }): Promise<DonationEligibilityAnalysis> {
    const response = await axiosClient.post<DonationEligibilityAnalysis>(
      "/analysis/donation-eligibility",
      payload,
    )
    return response.data
  },
}

export type DonationEligibilityAnalysis = {
  eligible: boolean
  explanation: string
  score: number
  risk_level: string
  factors: string[]
  recommendations: string[]
  data_sufficiency: string
  next_eligible_date: string | null
  evaluated_at: string
}
