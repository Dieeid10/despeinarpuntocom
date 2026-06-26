import { client } from '@/services/api'
import { urls } from './urls'
import type { Vuelo } from '@/interfaces'

export const vuelosServices = {
    getVuelos: () => client.get(urls.flights.getFlights),
    createVuelo: (flight: Vuelo) => client.post(urls.flights.createFlights, flight),
    updateVuelo: (flight_id: number, flight: Vuelo ) => client.put(urls.flights.updateFlight(flight_id), flight),
    deleteVuelo: (flight_id: number) => client.delete(urls.flights.deleteFlight(flight_id))
}