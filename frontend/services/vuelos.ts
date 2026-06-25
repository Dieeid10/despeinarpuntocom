import { client } from '@/services/api'
import { urls } from './urls'

export const vuelosServices = {
    getVuelos: () => client.get(urls.flights.getFlights)
}