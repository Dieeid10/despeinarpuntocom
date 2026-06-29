import { api } from '@/services/api'
import { urls } from './urls'
import type { ServicioAdicionalReserva } from '@/interfaces'

export const serviciosReservaServices = {
  getServiciosByReservaId: (reservation_id: number) =>
    api.get<ServicioAdicionalReserva[]>(
      urls.services.getByReserveId(reservation_id)
    ),
}