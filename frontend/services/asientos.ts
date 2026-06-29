import { api } from '@/services/api'
import { urls } from './urls'
import type { Asiento } from '@/interfaces'

export const asientosServices = {
  getAsientos: () =>
    api.get<Asiento[]>(urls.asientos.getAll),

  getAsientoById: (asiento_id: number) =>
    api.get<Asiento>(urls.asientos.getById(asiento_id)),

  getAsientosByVuelo: (vuelo_id: number) =>
    api.get<Asiento[]>(urls.asientos.getByVuelo(vuelo_id)),

  getAsientosDisponiblesByVuelo: (vuelo_id: number) =>
    api.get<Asiento[]>(urls.asientos.getDisponiblesByVuelo(vuelo_id)),

  createAsiento: (data: Asiento) =>
    api.post<Asiento, Asiento>(urls.asientos.create, data),

  updateAsiento: (asiento_id: number, data: Partial<Asiento>) =>
    api.put<Asiento, Partial<Asiento>>(
      urls.asientos.update(asiento_id),
      data
    ),

  deleteAsiento: (asiento_id: number) =>
    api.delete<null>(urls.asientos.delete(asiento_id)),
}