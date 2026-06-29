import { api } from '@/services/api'
import { urls } from './urls'
import type { Client } from '@/interfaces'

export const clientsServices = {
  getClients: () =>
    api.get<Client[]>(urls.clients.getClients),

  createClient: (newClient: Client) =>
    api.post<Client, Client>(
      urls.clients.createClient,
      newClient
    ),

  updateClient: (client_id: string, dataClient: Partial<Client>) =>
    api.put<Client, Partial<Client>>(
      urls.clients.updateClient(client_id),
      dataClient
    ),

  deleteClient: (client_id: string) =>
    api.delete<null>(urls.clients.deleteClient(client_id)),
}