import { axiosClient } from "./axiosClient"

export type AIInsight = {
  generated_at: string
  horizon_days: number
  method: string
  data_sufficiency: "suffisante" | "insuffisante"
  limitations: string[]
  forecasts: {
    blood_group: string
    horizon_days: number
    estimated_consumption: number
    confidence: number
    data_points: number
    status: string
  }[]
  risks: {
    blood_group: string
    stock_units: number
    forecast_units: number
    risk_level: string
    explanation: string
  }[]
  recommendations: {
    type: string
    priority: string
    title: string
    explanation: string
    suggested_action: string
  }[]
}

export const aiService = {
  async getInsights(): Promise<AIInsight> {
    const response = await axiosClient.get<AIInsight>("/ai/insights")
    return response.data
  },
  async downloadReport(): Promise<Blob> {
    const response = await axiosClient.get("/ai/report", { responseType: "blob" })
    return response.data
  },
}
