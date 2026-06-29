import { useEffect, useState } from 'react'
import { serviciosReservaServices } from '@/services/services'
import type { ServicioAdicionalReserva, ServiciosReservaState } from '@/interfaces'

export function useServiciosAdicionales(reservaId?: number | null) {
  const [state, setState] = useState<ServiciosReservaState>({
    servicios: [],
    loading: false,
    error: null,
  })

  const fetchServicios = async () => {
    if (!reservaId) return

    setState({
      servicios: [],
      loading: true,
      error: null,
    })

    const result = await serviciosReservaServices.getServiciosByReservaId(reservaId)

    if (!result.success) {
      setState({
        servicios: [],
        loading: false,
        error: result.message,
      })

      return
    }

    setState({
      servicios: result.data ?? [],
      loading: false,
      error: null,
    })
  }

  useEffect(() => {
    fetchServicios()
  }, [reservaId])

  return { ...state, fetchServicios }
}