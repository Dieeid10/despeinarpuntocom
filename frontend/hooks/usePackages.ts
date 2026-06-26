import { useEffect, useState } from 'react'
import { paquetesServices } from '@/services/paquetes'

export function usePaquetes(enabled = true) {
  const [paquetes, setPaquetes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPaquetes = async () => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    const result = await paquetesServices.getPaquetes()

    if (!result.success) {
      setError(result.message ?? 'Error al cargar paquetes')
      setLoading(false)
      return
    }

    setPaquetes(result.data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchPaquetes()
  }, [enabled])

  return { paquetes, loading, error, fetchPaquetes }
}