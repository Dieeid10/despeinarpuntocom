import { client } from '@/services/api'
import { urls } from './urls'

export const paquetesServices = {
    getPaquetes: () => client.get(urls.packages.getPackages)
}