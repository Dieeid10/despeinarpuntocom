'use client'

import { useState } from 'react'
import { ModalForm } from '../ui/modal'
import { useReservas } from '@/hooks/useReservas'
import { ServiciosPillsCell } from './ServiciosPillsCell'

const estadoStyles: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  confirmada: 'bg-green-100 text-green-800',
  cancelada: 'bg-red-100 text-red-800',
  completada: 'bg-gray-100 text-gray-800',
}

const tipoStyles: Record<string, string> = {
  vuelo: 'bg-blue-100 text-blue-800',
  paquete: 'bg-purple-100 text-purple-800',
}

const formatFecha = (fecha?: string | null) => {
  if (!fecha) return '—'

  const date = new Date(fecha)

  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const formatMonto = (monto?: number | string | null) => {
  if (monto === null || monto === undefined || monto === '') return '—'

  const value = Number(monto)

  if (Number.isNaN(value)) return '—'

  return `$${value.toLocaleString('es-AR')}`
}

const RESERVA_FIELDS = [
  { key: 'cliente_id', label: 'ID del cliente', type: 'text' as const, required: true },
  { key: 'tipo_reserva', label: 'Tipo de reserva', type: 'select' as const, required: true,
    options: [
      { value: 'vuelo', label: 'Vuelo' },
      { value: 'paquete', label: 'Paquete' },
    ],
  }, 
  { key: 'paquete_id', label: 'ID del paquete', type: 'number' as const, required: false },
  { key: 'vuelo_id', label: 'ID del vuelo', type: 'number' as const, required: false },
  { key: 'pasajero_nombre', label: 'Nombre del pasajero', type: 'text' as const, required: true },
  { key: 'pasajero_apellido', label: 'Apellido del pasajero', type: 'text' as const, required: true },
  { key: 'pasajero_documento', label: 'Documento del pasajero', type: 'text' as const, required: true },
  { key: 'asiento_id', label: 'ID del asiento', type: 'number' as const, required: true }
]

export default function ReservasTable() {
  const {
    loading,
    error,
    filtroEstado,
    filtroTipo,
    busqueda,
    reservasFiltradas,
    patchState,
    fetchReservas,
  } = useReservas()

  const [modalData, setModalData] = useState<Record<string, any> | null>(null)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div>
      <header className="flex justify-between items-center px-10 py-4 mb-6 bg-[var(--color-conteiner)]">
        <h2 className="text-xl font-bold text-gray-800">Reservas</h2>

        <button
          onClick={() => setModalData({})}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
        >
          + Nueva reserva
        </button>
      </header>

      <div className="flex gap-3 mb-6 flex-wrap px-5">
        <input
          type="text"
          placeholder="Buscar cliente, pasajero o documento..."
          value={busqueda}
          onChange={(e) =>
            patchState({
              busqueda: e.target.value,
            })
          }
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={filtroEstado}
          onChange={(e) =>
            patchState({
              filtroEstado: e.target.value,
            })
          }
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="confirmada">Confirmada</option>
          <option value="cancelada">Cancelada</option>
          <option value="completada">Completada</option>
        </select>

        <select
          value={filtroTipo}
          onChange={(e) =>
            patchState({
              filtroTipo: e.target.value,
            })
          }
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los tipos</option>
          <option value="vuelo">Vuelo</option>
          <option value="paquete">Paquete</option>
        </select>
      </div>

      <div className="border border-gray-200 rounded-md overflow-hidden p-5">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Detalle</th>
              <th className="px-4 py-3 text-left">Pasajero</th>
              <th className="px-4 py-3 text-left">Asiento</th>
              <th className="px-4 py-3 text-left">Servicios</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Monto</th>
              <th className="px-4 py-3 text-left">Pago</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {reservasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={12} className="text-center py-8 text-gray-400">
                  No hay reservas
                </td>
              </tr>
            ) : (
              reservasFiltradas.map((r) => (
                <tr
                  key={`${r.reserva_id}-${r.reserva_pasajero_id ?? 'sin-pasajero'}`}
                  className="hover:bg-gray-50 transition-colors"
                >

                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">
                      {r.cliente_nombre ?? '—'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {r.cliente_email ?? '—'}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tipoStyles[r.tipo_reserva] ?? 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {r.tipo_reserva ?? '—'}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {r.tipo_reserva === 'paquete'
                      ? r.paquete_nombre ?? '—'
                      : r.origen && r.destino
                        ? `${r.origen} → ${r.destino}`
                        : '—'}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {r.pasajero_nombre ?? '—'}
                    {r.pasajero_documento && (
                      <p className="text-xs text-gray-400">
                        DNI: {r.pasajero_documento}
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {r.numero_asiento
                      ? `${r.numero_asiento} (${r.tipo_asiento ?? 'sin clase'})`
                      : '—'}
                  </td>

                  <td className="px-4 py-3">
                    <ServiciosPillsCell reservaId={r.reserva_id} />
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        estadoStyles[r.estado] ?? 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {r.estado ?? '—'}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {formatFecha(r.fecha_reserva)}
                  </td>

                  <td className="px-4 py-3 font-medium text-gray-800">
                    {formatMonto(r.monto_pagado)}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {r.metodo_pago ? r.metodo_pago.replace(/_/g, ' ') : '—'}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        type="button"
                        
                        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs font-medium px-2 py-1 rounded-md transition-colors"
                      >
                        Modificar
                      </button>

                      <button
                        type="button"
                        
                        className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-medium px-2 py-1 rounded-md transition-colors"
                      >
                        Imprimir
                      </button>

                      <button
                        type="button"
                        
                        className="bg-red-100 hover:bg-red-200 text-red-800 text-xs font-medium px-2 py-1 rounded-md transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-2 px-5">
        {reservasFiltradas.length} registros encontrados
      </p>

      { modalData && (
        <ModalForm
          title={
            modalData?.reserva_id
              ? `Actualizar reserva #${modalData.reserva_id}`
              : 'Nueva reserva'
          }
          onClose={() => setModalData(null)}
          initialData={modalData}
          fields={RESERVA_FIELDS}
          onSubmit={async (data) => {
            console.log('Datos de reserva:', data)

            /*
              Acá llamás a tu servicio.

              Si es nueva:
              await reservasServices.createReserva(data)

              Si es actualización:
              await reservasServices.updateReserva(modalData.reserva_id, data)
            */

            await fetchReservas()
            setModalData(null)
          }}
        >
          {modalData?.reserva_id && (
            <ServiciosReservaEditor
              reservaId={modalData.reserva_id}
              onChange={fetchReservas}
            />
          )}
        </ModalForm>
      )}
    </div>
  )
}