import axios from 'axios'
import { env } from "@/config/config";

export const client = axios.create({
    baseURL: env.api_url,
    headers: { 'Content-Type': 'application/json' }
})

client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

client.interceptors.response.use((response) => response.data, (error) => {
    const message = error.response?.data?.message ?? 'Error inesperado'
    return Promise.reject({ success: false, message })
})

export interface ApiResponse<t> {
    success: boolean,
    message: string,
    data: t
}