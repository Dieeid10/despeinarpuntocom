import { client } from '@/services/api'
import { urls } from './urls'
import type { Asiento } from '@/interfaces'

export const asientosServices = {
    getAsientos: async () => {
    return client.get(urls.asientos.getAll)
  },

  getAsientoById: async (asiento_id: number) => {
    return client.get(urls.asientos.getById(asiento_id))
  },

  getAsientosByVuelo: async (vuelo_id: number) => {
    return client.get(urls.asientos.getByVuelo(vuelo_id))
  },

  getAsientosDisponiblesByVuelo: async (vuelo_id: number) => {
    return client.get(urls.asientos.getDisponiblesByVuelo(vuelo_id))
  },

  createAsiento: async (data: Asiento) => {
    return client.post(urls.asientos.create, data)
  },

  updateAsiento: async (asiento_id: number, data: Asiento) => {
    return client.put(urls.asientos.update(asiento_id), data)
  },

  deleteAsiento: async (asiento_id: number) => {
    return client.delete(urls.asientos.delete(asiento_id))
  },
}