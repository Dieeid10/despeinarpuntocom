import { api } from '@/services/api'
import { urls } from './urls'
import type { Paquete } from '@/interfaces'

export const paquetesServices = {
  getPaquetes: () =>
    api.get<Paquete[]>(urls.packages.getPackages),

  getPaqueteById: (package_id: number) =>
    api.get<Paquete>(urls.packages.getPackageById(package_id)),

  createPaquete: (newPackage: Paquete) =>
    api.post<Paquete, Paquete>(
      urls.packages.createPackage,
      newPackage
    ),

  updatePaquete: (package_id: number, newPackage: Partial<Paquete>) =>
    api.put<Paquete, Partial<Paquete>>(
      urls.packages.updatePackage(package_id),
      newPackage
    ),

  deletePaquete: (package_id: number) =>
    api.delete<null>(urls.packages.deletePackage(package_id)),
}