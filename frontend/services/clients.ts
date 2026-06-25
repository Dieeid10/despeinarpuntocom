import { client } from '@/services/api'
import { urls } from './urls'
import type { Client } from '@/interfaces'

export const clientsServices = {
    getClients: () => client.get(urls.clients.getClients),
    createClient: (newClient: Client ) => client.post(urls.clients.createClient, newClient),
    updateClient: (client_id: string, dataClient: Client) => client.put(urls.clients.updateClient(client_id), dataClient),
    deleteClient: (client_id: string) => client.delete(urls.clients.deleteClient(client_id))
}