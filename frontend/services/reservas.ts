import { client } from '@/services/api'
import { urls } from './urls'

export const reservasServices = {
  getReservas: () => {
    return client.get(urls.reservations.getReservations)
  },

  getReservaFormById: (reservation_id: number) => {
    return client.get(urls.reservations.getReservationFormById(reservation_id))
  },

  createReserva: (data: any) => {
    return client.post(urls.reservations.createReservation, data)
  },

  updateReserva: (reservation_id: number, data: any) => {
    return client.put(urls.reservations.updateReservation(reservation_id), data)
  },

  deleteReserva: (reservation_id: number) => {
    return client.delete(urls.reservations.deleteReservation(reservation_id))
  },

  updateEstadoReserva: (reservation_id: number, estado: string) => {
    return client.put(urls.reservations.updateReservationStatus(reservation_id), {
      estado,
    })
  },
}