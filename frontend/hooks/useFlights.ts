import { useCallback, useEffect, useMemo, useState } from 'react'
import { vuelosServices } from '@/services/vuelos'
import type { Vuelo, VuelosState } from '@/interfaces'

export function useFlights() {
    const [state, setState] = useState<VuelosState>({
        vuelos: [],
        loading: true,
        error: null,
        busqueda: '',
        filterType: ''
    })

    const patchState = (updates: Partial<VuelosState>) => 
        setState(prev => ({ ...prev, ...updates }))

    const fetchVuelos = useCallback(async () => {
        patchState({ loading: true, error: null })

        const result = await vuelosServices.getVuelos()
        console.log('Result es de vuelos es : ', result)

        if (!result.success) {
            patchState({
                error: result.message,
                loading: false
            })
            return
        }

        patchState({
            vuelos: result.data,
            loading: false
        })
    }, [])

    const createFlight = async (flight: Vuelo) => {
        const result = await vuelosServices.createVuelo(flight)

        if (result.success) {
            await fetchVuelos()
        }

        return result
    }

    const updateFlight = async (flight_id: number, flight: Vuelo) => {
        const result = await vuelosServices.updateVuelo(flight_id, flight)

        if (result.success) {
            await fetchVuelos()
        }

        return result
    }

    const deleteFlight = async (flight_id: number) => {
        const result = await vuelosServices.deleteVuelo(flight_id)

        if (result.success) {
            await fetchVuelos()
        }

        return result
    }

    useEffect(() => {
        fetchVuelos()
    }, [fetchVuelos])

    const vuelosFiltrados = useMemo(() => {
        return state.vuelos.filter((v: Vuelo) => {
            const matchEstado = !state.filterType || v.tipo_vuelo === state.filterType

            const matchBusqueda = 
                !state.busqueda ||
                `${v.origen_ciudad} ${v.destino_ciudad}`
                .toLowerCase()
                .includes(state.busqueda.toLowerCase()) ||
                v.destino_iata
                .toLowerCase()
                .includes(state.busqueda.toLowerCase())
                v.aerolinea
                .toLowerCase()
                .includes(state.busqueda.toLowerCase())

            return matchEstado && matchBusqueda
        })
    }, [state.vuelos, state.filterType, state.busqueda])


    return { state, patchState, fetchVuelos, createFlight, updateFlight, deleteFlight, vuelosFiltrados }
}