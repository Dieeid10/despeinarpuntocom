import { client } from '@/services/api'
import { urls } from './urls'

export const reservasServices = {
    getReservas: () => client.get(urls.reservations.getReservations)
}