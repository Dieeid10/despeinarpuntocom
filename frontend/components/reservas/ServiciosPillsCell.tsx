import { useServiciosAdicionales } from '@/hooks/useServiciosAdicionales'

export function ServiciosPillsCell({ reservaId }: { reservaId: number }) {
  const { servicios, loading, error } = useServiciosAdicionales(reservaId)

  if (loading) {
    return <span className="text-xs text-gray-400">Cargando...</span>
  }

  if (error) {
    return <span className="text-xs text-red-500">Error</span>
  }

  if (!servicios || servicios.length === 0) {
    return <span className="text-gray-400">—</span>
  }

  return (
    <div className="flex gap-1 flex-wrap">
      {servicios.map((servicio: any) => (
        <span
          key={reservaId + servicio.servicio_id}
          className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full"
          title={servicio.descripcion}
        >
          {servicio.nombre}
          {servicio.cantidad > 1 ? ` x${servicio.cantidad}` : ''}
        </span>
      ))}
    </div>
  )
}