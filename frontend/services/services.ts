import { client } from '@/services/api'
import { urls } from './urls'

export const serviciosReservaServices = {
    getServiciosByReservaId: (reservation_id: number) => client.get(urls.services.getByReserveId(reservation_id))
}