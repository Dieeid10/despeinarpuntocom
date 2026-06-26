import { useEffect, useMemo, useState } from 'react'
import { reservasServices } from '@/services/reservas'
import type { ReservasState } from '@/interfaces'

export function useReservas() {
  const [state, setState] = useState<ReservasState>({
    reservas: [],
    loading: true,
    error: null,
    filtroEstado: '',
    filtroTipo: '',
    busqueda: '',
  })

  const patchState = (updates: Partial<ReservasState>) => {
    setState((prev) => ({
      ...prev,
      ...updates,
    }))
  }

  const fetchReservas = async () => {
    patchState({
      loading: true,
      error: null,
    })

    const result = await reservasServices.getReservas()

    if (!result.success) {
      patchState({
        error: result.message ?? 'Error al cargar las reservas',
        loading: false,
      })

      return
    }

    patchState({
      reservas: result.data ?? [],
      loading: false,
    })
  }

  useEffect(() => {
    fetchReservas()
  }, [])

  const reservasFiltradas = useMemo(() => {
    const search = state.busqueda.trim().toLowerCase()

    return state.reservas.filter((r) => {
      const matchEstado =
        !state.filtroEstado || r.estado === state.filtroEstado

      const matchTipo =
        !state.filtroTipo || r.tipo_reserva === state.filtroTipo

      const cliente = r.cliente_nombre?.toLowerCase() ?? ''
      const email = r.cliente_email?.toLowerCase() ?? ''
      const pasajero = r.pasajero_nombre?.toLowerCase() ?? ''
      const documento = r.pasajero_documento?.toLowerCase() ?? ''
      const asiento = r.numero_asiento?.toLowerCase() ?? ''

      const matchBusqueda =
        !search ||
        cliente.includes(search) ||
        email.includes(search) ||
        pasajero.includes(search) ||
        documento.includes(search) ||
        asiento.includes(search)

      return matchEstado && matchTipo && matchBusqueda
    })
  }, [ state.reservas, state.filtroEstado, state.filtroTipo, state.busqueda ])

  return { ...state, patchState, fetchReservas, reservasFiltradas }
}