import { api } from '@/services/api'
import { urls } from './urls'
import type { Vuelo } from '@/interfaces'

export const vuelosServices = {
  getVuelos: () =>
    api.get<Vuelo[]>(urls.flights.getFlights),

  createVuelo: (flight: Vuelo) =>
    api.post<Vuelo, Vuelo>(
      urls.flights.createFlights,
      flight
    ),

  updateVuelo: (flight_id: number, flight: Partial<Vuelo>) =>
    api.put<Vuelo, Partial<Vuelo>>(
      urls.flights.updateFlight(flight_id),
      flight
    ),

  deleteVuelo: (flight_id: number) =>
    api.delete<null>(urls.flights.deleteFlight(flight_id)),
}