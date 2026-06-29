import { client } from '@/services/api'
import { urls } from './urls'
import { Paquete } from '@/interfaces'

export const paquetesServices = {
    getPaquetes: () => client.get(urls.packages.getPackages),
    getPaqueteById: (package_id: number) => client.get(urls.packages.getPackageById(package_id)),
    createPaquete: (newPackage: Paquete) => client.post(urls.packages.createPackage, newPackage),
    updatePaquete: (package_id: number, newPackage: Paquete) => client.put(urls.packages.updatePackage(package_id), newPackage),
    deletePaquete: (package_id: number) => client.delete(urls.packages.deletePackage(package_id))
}