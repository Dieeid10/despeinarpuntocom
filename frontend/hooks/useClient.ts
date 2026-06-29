// hooks/useClients.ts
import { useState, useEffect, useCallback } from 'react'
import { clientsServices } from '@/services/clients'
import type { ClientsState, Client } from '@/interfaces'

export function useClient() {
  const [state, setState] = useState<ClientsState>({
    clients: [],
    loading: true,
    error: null,
    busqueda: '',
  })

  const patchState = (updates: Partial<ClientsState>) =>
    setState(prev => ({ ...prev, ...updates }))

  const fetchClients = useCallback(async () => {
    patchState({ loading: true, error: null })

    const result = await clientsServices.getClients()

    if (!result.success) {
      patchState({
        error: result.message,
        loading: false,
      })
      return
    }

    patchState({
      clients: result.data,
      loading: false,
    })
  }, [])

  const createClient = async (data: Client) => {
    const result = await clientsServices.createClient(data)
    console.log('Esta ejecutando el create.')
    if (result.success) {
      await fetchClients()
    }

    return result
  }

  const updateClient = async (client_id: string, dataClient: Client ) => {
    const result = await clientsServices.updateClient(client_id, dataClient)
    console.log('Resulta es: ',result)
    
    if (result.success) {
      await fetchClients()
    }

    return result
  }

  const deleteClient = async (client_id: string) => {
    const result = await clientsServices.deleteClient(client_id)

    if (result.success) {
      await fetchClients()
    }

    return result
  }

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const clientsFiltrados = state.clients.filter(c =>
    !state.busqueda ||
    `${c.nombre} ${c.apellido}`
      .toLowerCase()
      .includes(state.busqueda.toLowerCase()) ||
    c.documento.includes(state.busqueda) ||
    c.email
      .toLowerCase()
      .includes(state.busqueda.toLowerCase())
  )

  return {
    state,
    patchState,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    clientsFiltrados,
  }
}