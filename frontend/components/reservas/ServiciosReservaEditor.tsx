import { useServiciosReserva } from "@/hooks/useServiciosReserva"

interface ServicesEditProps {
    reservaId: number 
    onChange?: () => void
}

function ServiciosReservaEditor({ reservaId, onChange, }: ServicesEditProps) {
  const { servicios, serviciosDisponibles, loading, error, agregarServicio, eliminarServicio, fetchServicios } = useServiciosReserva(reservaId)

  const [servicioId, setServicioId] = useState('')
  const [cantidad, setCantidad] = useState(1)

  const handleAgregarServicio = async () => {
    if (!servicioId) return

    await agregarServicio(Number(servicioId), cantidad)
    await fetchServicios()

    setServicioId('')
    setCantidad(1)

    onChange?.()
  }

  const handleEliminarServicio = async (id: number) => {
    await eliminarServicio(id)
    await fetchServicios()
    onChange?.()
  }

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">
        Servicios adicionales
      </h3>

      <div className="flex gap-2 mb-3">
        <select
          value={servicioId}
          onChange={(e) => setServicioId(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm flex-1"
        >
          <option value="">Seleccionar servicio</option>

          {serviciosDisponibles?.map((servicio: any) => (
            <option
              key={servicio.servicio_id}
              value={servicio.servicio_id}
            >
              {servicio.nombre} - ${Number(servicio.precio).toLocaleString('es-AR')}
            </option>
          ))}
        </select>

        <input
          type="number"
          min={1}
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-20"
        />

        <button
          type="button"
          onClick={handleAgregarServicio}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md"
        >
          Agregar
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Cargando servicios...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : servicios.length === 0 ? (
        <p className="text-sm text-gray-400">
          Esta reserva no tiene servicios adicionales.
        </p>
      ) : (
        <div className="flex gap-2 flex-wrap">
          {servicios.map((servicio: any) => (
            <span
              key={servicio.servicio_id}
              className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1"
            >
              {servicio.nombre}
              {servicio.cantidad > 1 ? ` x${servicio.cantidad}` : ''}

              <button
                type="button"
                onClick={() => handleEliminarServicio(servicio.servicio_id)}
                className="ml-1 text-indigo-500 hover:text-red-600 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}