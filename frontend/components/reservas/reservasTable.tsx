'use client'

import { useState } from 'react'
import { ModalForm } from '../ui/modal'
import { useReservas } from '@/hooks/useReservas'

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

const formatFecha = (fecha: string) =>
  new Date(fecha).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

const formatMonto = (monto: number | null) =>
  monto ? `$${monto.toLocaleString('es-AR')}` : '—'

const CLIENT_FIELDS = [
    { key: 'nombre', label: 'Nombre', type: 'text' as const, required: true },
    { key: 'apellido', label: 'Apellido', type: 'text' as const,  required: true },
    { key: 'email', label: 'Email', type: 'email' as const, required: true },
]

export default function ReservasTable() {
  const { loading, error, filtroEstado, filtroTipo, busqueda, reservasFiltradas, patchState, fetchReservas } = useReservas()
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
    <div className="">
      <header className=" flex justify-between items-center px-10 py-4 mb-6 bg-[var(--color-conteiner)]">
          <h2 className="text-xl font-bold text-gray-800">Reservas</h2>
          <button
              onClick={() => setModalData({})}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
              + Nueva reserva
          </button>
      </header>

      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Buscar cliente..."
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
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Detalle</th>
              <th className="px-4 py-3 text-left">Pasajero</th>
              <th className="px-4 py-3 text-left">Asiento</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Monto</th>
              <th className="px-4 py-3 text-left">Pago</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {reservasFiltradas.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="text-center py-8 text-gray-400"
                >
                  No hay reservas
                </td>
              </tr>
            ) : (
              reservasFiltradas.map((r) => (
                <tr
                  key={r.reserva_id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-500">
                    #{r.reserva_id}
                  </td>

                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">
                      {r.cliente_nombre}
                    </p>
                    <p className="text-xs text-gray-400">
                      {r.cliente_email}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${tipoStyles[r.tipo_reserva]}`}
                    >
                      {r.tipo_reserva}
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
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {r.numero_asiento
                      ? `${r.numero_asiento} (${r.tipo_asiento})`
                      : '—'}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${estadoStyles[r.estado]}`}
                    >
                      {r.estado}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {formatFecha(r.fecha_reserva)}
                  </td>

                  <td className="px-4 py-3 font-medium text-gray-800">
                    {formatMonto(r.monto_pagado)}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {r.metodo_pago
                      ? r.metodo_pago.replace(/_/g, ' ')
                      : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-2">
        {reservasFiltradas.length} reservas encontradas
      </p>
      {modalData && (
        <ModalForm
          title={
            modalData?.usuario_id
            ? 'Editar cliente'
            : 'Nuevo cliente'
          }
          onClose={() => setModalData(null)}
          initialData={modalData ?? undefined}
          fields={CLIENT_FIELDS}
          onSubmit={(data) => {}}
          //fields={[
          //  {
          //    key: 'estado',
          //    label: 'Estado',
          //    type: 'select',
          //    options: [
          //      {
          //        value: 'pendiente',
          //        label: 'Pendiente',
          //      },
          //      {
          //        value: 'confirmada',
          //        label: 'Confirmada',
          //      },
          //      {
          //        value: 'cancelada',
          //        label: 'Cancelada',
          //      },
          //      {
          //        value: 'completada',
          //        label: 'Completada',
          //      },
          //    ],
          //  },
          //  {
          //    key: 'tipo_reserva',
          //    label: 'Tipo',
          //    type: 'select',
          //    options: [
          //      {
          //        value: 'vuelo',
          //        label: 'Vuelo',
          //      },
          //      {
          //        value: 'paquete',
          //        label: 'Paquete',
          //      },
          //    ],
          //  },
          //]}
        />
      )}
    </div>
  )
}