import { api } from '@/services/api'
import { urls } from './urls'
import type { Reserva } from '@/interfaces'

export const reservasServices = {
  getReservas: () =>
    api.get<Reserva[]>(urls.reservations.getReservations),

  getReservaFormById: (reservation_id: number) =>
    api.get<Reserva>(
      urls.reservations.getReservationFormById(reservation_id)
    ),

  createReserva: (data: Reserva) =>
    api.post<Reserva, Reserva>(
      urls.reservations.createReservation,
      data
    ),

  updateReserva: (reservation_id: number, data: Partial<Reserva>) =>
    api.put<Reserva, Partial<Reserva>>(
      urls.reservations.updateReservationById(reservation_id),
      data
    ),

  deleteReserva: (reservation_id: number) =>
    api.delete<null>(
      urls.reservations.deteleReservationById(reservation_id)
    ),

  updateEstadoReserva: (reservation_id: number, estado: string) =>
    api.put<Reserva, { estado: string }>(
      urls.reservations.updateReservationStatus(reservation_id),
      { estado }
    ),
}