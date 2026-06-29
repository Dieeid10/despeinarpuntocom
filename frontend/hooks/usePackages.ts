import { useCallback, useEffect, useMemo, useState } from 'react'
import { paquetesServices } from '@/services/paquetes'
import type { PaquetesState, Paquete } from '@/interfaces'

export function usePaquetes(enabled = true) {
  const [ state, setState ] = useState<PaquetesState>({
    paquetes: [],
    loading: false,
    error: null,
    busqueda: '',
    filterType: ''
  })

  const patchState = (updates: Partial<PaquetesState>) => 
          setState(prev => ({ ...prev, ...updates }))
  
    const fetchPaquetes = useCallback(async () => {
        patchState({ loading: true, error: null })

        const result = await paquetesServices.getPaquetes()
        console.log('Result es de vuelos es : ', result)

        if (!result.success) {
            patchState({
                error: result.message,
                loading: false
            })
            return
        }

        patchState({
            paquetes: result.data,
            loading: false
        })
    }, [])

    const createPaquete = async (flight: Paquete) => {
        const result = await paquetesServices.createPaquete(flight)

        if (result.success) {
            await fetchPaquetes()
        }

        return result
    }

    const updatePaquete = async (package_id: number, flight: Paquete) => {
        const result = await paquetesServices.updatePaquete(package_id, flight)

        if (result.success) {
            await fetchPaquetes()
        }

        return result
    }

    const deletePaquete = async (package_id: number) => {
        const result = await paquetesServices.deletePaquete(package_id)

        if (result.success) {
            await fetchPaquetes()
        }

        return result
    }

    useEffect(() => {
        fetchPaquetes()
    }, [fetchPaquetes])

    const paquetesFiltrados = useMemo(() => {
        return state.paquetes.filter((p: Paquete) => {
            const matchEstado = !state.filterType || (state.filterType === 'activo' ? p.activo : !p.activo)

            const matchBusqueda = 
                !state.busqueda ||
                `${p.nombre} ${p.descripcion}`
                .toLowerCase()
                .includes(state.busqueda.toLowerCase())

            return matchEstado && matchBusqueda
        })
    }, [state.paquetes, state.filterType, state.busqueda])
  
  
    return { state, patchState, fetchPaquetes, createPaquete, updatePaquete, deletePaquete, paquetesFiltrados }
}