import { useState, useEffect, useCallback } from 'react'
import { asientosServices } from '@/services/asientos'

type AsientoVuelo = {
  asiento_id: number
  vuelo_id: number
  tipo_asiento: string
  numero_asiento: string
  precio_base: number
}

type AsientosVueloState = {
  asientos: AsientoVuelo[]
  loading: boolean
  error: string | null
}

export function useAsientosVuelo(vueloId: number | null) {
  const [state, setState] = useState<AsientosVueloState>({
    asientos: [],
    loading: false,
    error: null,
  })

  const patchState = (updates: Partial<AsientosVueloState>) =>
    setState(prev => ({ ...prev, ...updates }))

  const fetchAsientos = useCallback(async () => {
    if (!vueloId) {
      patchState({ asientos: [], loading: false, error: null })
      return
    }

    patchState({ loading: true, error: null })

    const result = await asientosServices.getAsientosDisponiblesByVuelo(vueloId)

    if (!result.success) {
      patchState({
        error: result.message ?? 'Error al cargar asientos',
        loading: false,
      })
      return
    }

    patchState({
      asientos: result.data ?? [],
      loading: false,
    })
  }, [vueloId])

  useEffect(() => {
    fetchAsientos()
  }, [fetchAsientos])

  return { state, patchState, fetchAsientos }
}