'use client'

import { useEffect, useMemo, useState } from 'react'
import { useClient } from '@/hooks/useClient'
import { useFlights } from '@/hooks/useFlights'
import { usePaquetes } from '@/hooks/usePackages'
import { useReservas } from '@/hooks/useReservas'
import { useServiciosAdicionales } from '@/hooks/useServiciosAdicionales'
import { useAsientosVuelo } from '@/hooks/useAsientosVuelo'

type Step = 'datos' | 'servicios' | 'pasajeros'

type ServicioSeleccionado = {
  servicio_id: number
  cantidad: number
}

type PasajeroForm = {
  nombre: string
  apellido: string
  documento: string
  vuelo_id: number | ''
  asiento_id: number | ''
  numero_asiento?: string
  tipo_asiento?: string
  precio_base?: number
}

type ReservaInitialData = {
  reserva_id?: number
  cliente_id?: string
  tipo_reserva?: 'vuelo' | 'paquete'
  estado?: 'pendiente' | 'confirmada' | 'cancelada' | 'completada'
  fecha_reserva?: string
  paquete_id?: number | null
  vuelos?: number[]
  servicios?: ServicioSeleccionado[]
  pasajeros?: PasajeroForm[]
}

type ReservaFormModalProps = {
  open: boolean
  onClose: () => void
  initialData?: ReservaInitialData | null
  onSaved?: () => void
}

export function ReservaFormModal({
  open,
  onClose,
  initialData = null,
  onSaved,
}: ReservaFormModalProps) {
  const isEdit = Boolean(initialData?.reserva_id)

  const { state: clientsState } = useClient()
  const { state: flightsState } = useFlights()
  const { state: paquetesState } = usePaquetes()
  const { servicios } = useServiciosAdicionales()
  const { createReserva, updateReserva } = useReservas()

  const clientes = clientsState.clients
  const vuelos = flightsState.vuelos
  const paquetes = paquetesState.paquetes

  const [step, setStep] = useState<Step>('datos')
  const [saving, setSaving] = useState(false)
  const [clienteSearch, setClienteSearch] = useState('')

  const [form, setForm] = useState({
    cliente_id: '',
    tipo_reserva: 'vuelo' as 'vuelo' | 'paquete',
    estado: 'pendiente' as 'pendiente' | 'confirmada' | 'cancelada' | 'completada',
    fecha_reserva: '',
    paquete_id: '' as number | '',
    vuelos: [] as number[],
  })

  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<ServicioSeleccionado[]>([])
  const [pasajeros, setPasajeros] = useState<PasajeroForm[]>([])

  useEffect(() => {
    if (!open) return

    setStep('datos')

    if (initialData) {
      setForm({
        cliente_id: initialData.cliente_id ?? '',
        tipo_reserva: initialData.tipo_reserva ?? 'vuelo',
        estado: initialData.estado ?? 'pendiente',
        fecha_reserva: initialData.fecha_reserva ? initialData.fecha_reserva.slice(0, 10) : '',
        paquete_id: initialData.paquete_id ?? '',
        vuelos: initialData.vuelos ?? [],
      })

      setServiciosSeleccionados(initialData.servicios ?? [])
      setPasajeros(initialData.pasajeros ?? [])
      return
    }

    setForm({
      cliente_id: '',
      tipo_reserva: 'vuelo',
      estado: 'pendiente',
      fecha_reserva: '',
      paquete_id: '',
      vuelos: [],
    })

    setServiciosSeleccionados([])
    setPasajeros([])
  }, [open, initialData])

  const clientesFiltrados = useMemo(() => {
    const term = clienteSearch.toLowerCase().trim()

    if (!term) return clientes ?? []

    return (clientes ?? []).filter((cliente: any) =>
      `${cliente.nombre} ${cliente.apellido} ${cliente.documento} ${cliente.email}`
        .toLowerCase()
        .includes(term)
    )
  }, [clientes, clienteSearch])

  const serviciosMap = useMemo(() => {
    return new Map(serviciosSeleccionados.map((s) => [s.servicio_id, s]))
  }, [serviciosSeleccionados])

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const toggleVuelo = (vueloId: number) => {
    setForm((prev) => {
      const exists = prev.vuelos.includes(vueloId)

      return {
        ...prev,
        vuelos: exists
          ? prev.vuelos.filter((id) => id !== vueloId)
          : [...prev.vuelos, vueloId],
      }
    })
  }

  const toggleServicio = (servicioId: number) => {
    setServiciosSeleccionados((prev) => {
      const exists = prev.some((s) => s.servicio_id === servicioId)

      if (exists) {
        return prev.filter((s) => s.servicio_id !== servicioId)
      }

      return [...prev, { servicio_id: servicioId, cantidad: 1 }]
    })
  }

  const cambiarCantidadServicio = (servicioId: number, cantidad: number) => {
    setServiciosSeleccionados((prev) =>
      prev.map((servicio) =>
        servicio.servicio_id === servicioId
          ? { ...servicio, cantidad }
          : servicio
      )
    )
  }

  const agregarPasajero = () => {
    setPasajeros((prev) => [
      ...prev,
      {
        nombre: '',
        apellido: '',
        documento: '',
        vuelo_id: form.vuelos[0] ?? '',
        asiento_id: '',
      },
    ])
  }

  const quitarPasajero = (index: number) => {
    setPasajeros((prev) => prev.filter((_, i) => i !== index))
  }

  const actualizarPasajero = (index: number, key: keyof PasajeroForm, value: any) => {
    setPasajeros((prev) =>
      prev.map((pasajero, i) =>
        i === index
          ? {
              ...pasajero,
              [key]: value,
              ...(key === 'vuelo_id' ? { asiento_id: '' } : {}),
            }
          : pasajero
      )
    )
  }

  const validarFormulario = () => {
    if (!form.cliente_id) {
      alert('Seleccioná un cliente.')
      setStep('datos')
      return false
    }

    if (!form.fecha_reserva) {
      alert('Seleccioná una fecha de reserva.')
      setStep('datos')
      return false
    }

    if (form.tipo_reserva === 'paquete' && !form.paquete_id) {
      alert('Seleccioná un paquete.')
      setStep('datos')
      return false
    }

    if (form.tipo_reserva === 'vuelo' && form.vuelos.length === 0) {
      alert('Seleccioná al menos un vuelo.')
      setStep('datos')
      return false
    }

    if (pasajeros.length === 0) {
      alert('Agregá al menos un pasajero.')
      setStep('pasajeros')
      return false
    }

    for (const pasajero of pasajeros) {
      if (!pasajero.nombre || !pasajero.apellido || !pasajero.documento || !pasajero.asiento_id) {
        alert('Completá todos los datos de los pasajeros.')
        setStep('pasajeros')
        return false
      }
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validarFormulario()) return

    const vuelosUsadosEnPasajeros = pasajeros
      .map((p) => p.vuelo_id)
      .filter((id): id is number => typeof id === 'number')

    const vuelosFinales = Array.from(new Set([
      ...form.vuelos,
      ...vuelosUsadosEnPasajeros,
    ]))

    const payload = {
      cliente_id: form.cliente_id,
      tipo_reserva: form.tipo_reserva,
      estado: form.estado,
      fecha_reserva: form.fecha_reserva,
      paquete_id: form.tipo_reserva === 'paquete' ? Number(form.paquete_id) : null,
      vuelos: vuelosFinales,
      servicios: serviciosSeleccionados,
      pasajeros: pasajeros.map((pasajero) => ({
        nombre: pasajero.nombre,
        apellido: pasajero.apellido,
        documento: pasajero.documento,
        asiento_id: Number(pasajero.asiento_id),
      })),
    }

    setSaving(true)

    try {
      if (isEdit && initialData?.reserva_id) {
        await updateReserva(initialData.reserva_id, payload)
      } else {
        await createReserva(payload)
      }

      onSaved?.()
      onClose()
    } catch (error) {
      console.error(error)
      alert('No se pudo guardar la reserva.')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? 'Modificar reserva' : 'Nueva reserva'}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="px-6 pt-4">
          <div className="grid grid-cols-3 bg-gray-100 rounded-lg p-1 text-sm">
            <button
              type="button"
              onClick={() => setStep('datos')}
              className={`py-2 rounded-md ${step === 'datos' ? 'bg-white shadow-sm font-medium' : 'text-gray-500'}`}
            >
              Datos
            </button>

            <button
              type="button"
              onClick={() => setStep('servicios')}
              className={`py-2 rounded-md ${step === 'servicios' ? 'bg-white shadow-sm font-medium' : 'text-gray-500'}`}
            >
              Servicios adicionales
            </button>

            <button
              type="button"
              onClick={() => setStep('pasajeros')}
              className={`py-2 rounded-md ${step === 'pasajeros' ? 'bg-white shadow-sm font-medium' : 'text-gray-500'}`}
            >
              Pasajeros
            </button>
          </div>
        </div>

        <div className="px-6 py-5 overflow-y-auto max-h-[65vh]">
          {step === 'datos' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de reserva
                  </label>

                  <select
                    value={form.tipo_reserva}
                    onChange={(e) => {
                      const tipo = e.target.value as 'vuelo' | 'paquete'

                      setForm((prev) => ({
                        ...prev,
                        tipo_reserva: tipo,
                        paquete_id: tipo === 'paquete' ? prev.paquete_id : '',
                        vuelos: tipo === 'vuelo' ? prev.vuelos : [],
                      }))
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="vuelo">Vuelo</option>
                    <option value="paquete">Paquete</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado inicial
                  </label>

                  <select
                    value={form.estado}
                    onChange={(e) => handleChange('estado', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="cancelada">Cancelada</option>
                    <option value="completada">Completada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente
                </label>

                <input
                  type="text"
                  value={clienteSearch}
                  onChange={(e) => setClienteSearch(e.target.value)}
                  placeholder="Buscar por nombre, documento o email..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2"
                />

                <select
                  value={form.cliente_id}
                  onChange={(e) => handleChange('cliente_id', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">— Seleccionar cliente —</option>

                  {clientesFiltrados.map((cliente: any) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.apellido}, {cliente.nombre} - {cliente.documento}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de reserva
                  </label>

                  <input
                    type="date"
                    value={form.fecha_reserva}
                    onChange={(e) => handleChange('fecha_reserva', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>

                {form.tipo_reserva === 'paquete' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Paquete
                    </label>

                    <select
                      value={form.paquete_id}
                      onChange={(e) => handleChange('paquete_id', e.target.value ? Number(e.target.value) : '')}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="">— Seleccionar paquete —</option>

                      {(paquetes ?? []).map((paquete: any) => (
                        <option key={paquete.paquete_id} value={paquete.paquete_id}>
                          {paquete.nombre} - ${Number(paquete.precio).toLocaleString('es-AR')}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {form.tipo_reserva === 'vuelo' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vuelos
                  </label>

                  <div className="border border-gray-200 rounded-lg divide-y max-h-60 overflow-y-auto">
                    {(vuelos ?? []).map((vuelo: any) => {
                      const checked = form.vuelos.includes(vuelo.vuelo_id)

                      return (
                        <label
                          key={vuelo.vuelo_id}
                          className="flex items-center justify-between gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              {vuelo.origen_ciudad ?? vuelo.origen_iata} → {vuelo.destino_ciudad ?? vuelo.destino_iata}
                            </p>
                            <p className="text-xs text-gray-500">
                              {vuelo.aerolinea} | {vuelo.fecha_salida}
                            </p>
                          </div>

                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleVuelo(vuelo.vuelo_id)}
                          />
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'servicios' && (
            <div className="space-y-3">
              {(servicios ?? []).length === 0 ? (
                <p className="text-sm text-gray-400">
                  No hay servicios adicionales cargados.
                </p>
              ) : (
                (servicios ?? []).map((servicio: any) => {
                  const seleccionado = serviciosMap.get(servicio.servicio_id)

                  return (
                    <div
                      key={servicio.servicio_id}
                      className="border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between gap-4"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {servicio.nombre}
                        </p>
                        <p className="text-xs text-gray-500">
                          {servicio.descripcion}
                        </p>
                        <p className="text-xs text-gray-700 mt-1">
                          ${Number(servicio.precio).toLocaleString('es-AR')}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {seleccionado && (
                          <input
                            type="number"
                            min={1}
                            value={seleccionado.cantidad}
                            onChange={(e) => cambiarCantidadServicio(servicio.servicio_id, Number(e.target.value))}
                            className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm"
                          />
                        )}

                        <button
                          type="button"
                          onClick={() => toggleServicio(servicio.servicio_id)}
                          className={`w-11 h-6 rounded-full p-1 transition-colors ${seleccionado ? 'bg-blue-600' : 'bg-gray-300'}`}
                        >
                          <span
                            className={`block w-4 h-4 bg-white rounded-full transition-transform ${seleccionado ? 'translate-x-5' : 'translate-x-0'}`}
                          />
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}

          {step === 'pasajeros' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    Pasajeros de la reserva
                  </h3>
                  <p className="text-xs text-gray-500">
                    Agregá uno o varios pasajeros y asignales un asiento.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={agregarPasajero}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-lg"
                >
                  Agregar pasajero
                </button>
              </div>

              {pasajeros.length === 0 ? (
                <p className="text-sm text-gray-400 border border-dashed border-gray-300 rounded-lg p-4 text-center">
                  Todavía no agregaste pasajeros.
                </p>
              ) : (
                pasajeros.map((pasajero, index) => (
                  <PasajeroItem
                    key={index}
                    index={index}
                    pasajero={pasajero}
                    vuelos={vuelos ?? []}
                    onChange={actualizarPasajero}
                    onRemove={quitarPasajero}
                  />
                ))
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            Cancelar
          </button>

          <div className="flex gap-2">
            {step !== 'datos' && (
              <button
                type="button"
                onClick={() => setStep(step === 'pasajeros' ? 'servicios' : 'datos')}
                className="text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Anterior
              </button>
            )}

            {step !== 'pasajeros' ? (
              <button
                type="button"
                onClick={() => setStep(step === 'datos' ? 'servicios' : 'pasajeros')}
                className="text-sm px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="text-sm px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
              >
                {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear reserva'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PasajeroItem({
  index,
  pasajero,
  vuelos,
  onChange,
  onRemove,
}: {
  index: number
  pasajero: PasajeroForm
  vuelos: any[]
  onChange: (index: number, key: keyof PasajeroForm, value: any) => void
  onRemove: (index: number) => void
}) {
  const { state } = useAsientosVuelo(
    pasajero.vuelo_id ? Number(pasajero.vuelo_id) : null
  )

  const asientos = state.asientos

  const asientoActualExiste = asientos.some(
    (asiento: any) => asiento.asiento_id === pasajero.asiento_id
  )

  const asientosConActual =
    pasajero.asiento_id && !asientoActualExiste
      ? [
          {
            asiento_id: pasajero.asiento_id,
            numero_asiento: pasajero.numero_asiento ?? 'Asiento actual',
            tipo_asiento: pasajero.tipo_asiento ?? '',
            precio_base: pasajero.precio_base ?? 0,
          },
          ...asientos,
        ]
      : asientos

  return (
    <div className="border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-800">
          Pasajero {index + 1}
        </h4>

        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Quitar
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <input
          type="text"
          value={pasajero.nombre}
          onChange={(e) => onChange(index, 'nombre', e.target.value)}
          placeholder="Nombre"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />

        <input
          type="text"
          value={pasajero.apellido}
          onChange={(e) => onChange(index, 'apellido', e.target.value)}
          placeholder="Apellido"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />

        <input
          type="text"
          value={pasajero.documento}
          onChange={(e) => onChange(index, 'documento', e.target.value)}
          placeholder="Documento"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <select
          value={pasajero.vuelo_id}
          onChange={(e) => onChange(index, 'vuelo_id', e.target.value ? Number(e.target.value) : '')}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">— Vuelo para asiento —</option>

          {vuelos.map((vuelo: any) => (
            <option key={vuelo.vuelo_id} value={vuelo.vuelo_id}>
              {vuelo.origen_ciudad ?? vuelo.origen_iata} → {vuelo.destino_ciudad ?? vuelo.destino_iata}
            </option>
          ))}
        </select>

        <select
          value={pasajero.asiento_id}
          onChange={(e) => onChange(index, 'asiento_id', e.target.value ? Number(e.target.value) : '')}
          disabled={!pasajero.vuelo_id}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:bg-gray-100"
        >
          <option value="">— Asiento —</option>

          {asientosConActual.map((asiento: any) => (
            <option key={asiento.asiento_id} value={asiento.asiento_id}>
              {asiento.numero_asiento} - {asiento.tipo_asiento} - ${Number(asiento.precio_base).toLocaleString('es-AR')}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}