import axios, { AxiosRequestConfig } from 'axios'
import { env } from '@/config/config'

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
}

export const client = axios.create({
  baseURL: env.api_url,
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message ?? 'Error inesperado'

    return Promise.reject({
      success: false,
      message,
    } satisfies ApiResponse)
  }
)

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    client.get<ApiResponse<T>, ApiResponse<T>>(url, config),

  post: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) =>
    client.post<ApiResponse<T>, ApiResponse<T>, D>(url, data, config),

  put: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) =>
    client.put<ApiResponse<T>, ApiResponse<T>, D>(url, data, config),

  patch: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) =>
    client.patch<ApiResponse<T>, ApiResponse<T>, D>(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    client.delete<ApiResponse<T>, ApiResponse<T>>(url, config),
}