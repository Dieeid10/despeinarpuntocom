import { api } from '@/services/api'
import { urls } from './urls'
import type { ServicioReserva } from '@/interfaces'

export const serviciosReservaServices = {
  getServiciosByReservaId: (reservation_id: number) =>
    api.get<ServicioReserva[]>(
      urls.services.getByReserveId(reservation_id)
    ),
}