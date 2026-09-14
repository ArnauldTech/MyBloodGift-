import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000"

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response && typeof window !== "undefined") {
      window.dispatchEvent(new Event("mbg:network-error"))
    }
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token")
      localStorage.removeItem("user_role")
    }
    return Promise.reject(error)
  },
)
