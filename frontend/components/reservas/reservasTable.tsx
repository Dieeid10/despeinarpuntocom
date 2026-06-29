'use client'

import { useState } from 'react'
import { useReservas } from '@/hooks/useReservas'
import { ServiciosPillsCell } from './ServiciosPillsCell'
import { ReservaFormModal } from '@/components/reservas/reservasForm'

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

export default function ReservasTable() {
  const { loading, error, filtroEstado, filtroTipo, busqueda, reservasFiltradas, patchState, fetchReservas, deleteReserva, getReservaFormById } = useReservas()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<Record<string, any> | null>(null)
  const [loadingForm, setLoadingForm] = useState(false)

  const handleNuevaReserva = () => {
    setModalData(null)
    setModalOpen(true)
  }

  const handleModificar = async (reserva: any) => {
    setLoadingForm(true)

    try {
      const result = await getReservaFormById(reserva.reserva_id)

      console.log('Resultado getReservaFormById:', result)

      if (!result.success || !result.data) {
        alert(result.message ?? 'No se pudo cargar la reserva.')
        return
      }

      setModalData(result.data)
      setModalOpen(true)
    } catch (error) {
      console.error('Error cargando reserva para form:', error)
      alert('No se pudo cargar la reserva.')
    } finally {
      setLoadingForm(false)
    }
  }

  const handleEliminar = async (reservaId: number) => {
    const confirmar = confirm(`¿Seguro que querés eliminar la reserva #${reservaId}?`)

    if (!confirmar) return

    const result = await deleteReserva(reservaId)

    if (!result.success) {
      alert(result.message ?? 'No se pudo eliminar la reserva')
      return
    }
  }

  const handleImprimirComprobante = (reserva: any) => {
    const detalle =
      reserva.tipo_reserva === 'paquete'
        ? reserva.paquete_nombre ?? '—'
        : reserva.origen && reserva.destino
          ? `${reserva.origen} → ${reserva.destino}`
          : '—'

    const asiento = reserva.numero_asiento
      ? `${reserva.numero_asiento} (${reserva.tipo_asiento ?? 'sin clase'})`
      : '—'

    const metodoPago = reserva.metodo_pago
      ? reserva.metodo_pago.replace(/_/g, ' ')
      : '—'

    const ventana = window.open('', '_blank')

    if (!ventana) {
      alert('No se pudo abrir la ventana de impresión')
      return
    }

    ventana.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Comprobante Reserva #${reserva.reserva_id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #111827; }
            h1 { color: #2563eb; margin-bottom: 4px; }
            h2 { font-size: 18px; margin-top: 24px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; }
            p { margin: 6px 0; font-size: 14px; }
            .box { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-top: 12px; }
          </style>
        </head>

        <body>
          <h1>Comprobante de reserva</h1>
          <p>Empresa de turismo - Sistema de reservas</p>

          <div class="box">
            <h2>Datos de la reserva</h2>
            <p><strong>Número de reserva:</strong> #${reserva.reserva_id}</p>
            <p><strong>Fecha:</strong> ${formatFecha(reserva.fecha_reserva)}</p>
            <p><strong>Tipo:</strong> ${reserva.tipo_reserva ?? '—'}</p>
            <p><strong>Estado:</strong> ${reserva.estado ?? '—'}</p>
            <p><strong>Detalle:</strong> ${detalle}</p>
          </div>

          <div class="box">
            <h2>Cliente</h2>
            <p><strong>Nombre:</strong> ${reserva.cliente_nombre ?? '—'}</p>
            <p><strong>Email:</strong> ${reserva.cliente_email ?? '—'}</p>
            <p><strong>Documento:</strong> ${reserva.cliente_documento ?? '—'}</p>
          </div>

          <div class="box">
            <h2>Pasajero</h2>
            <p><strong>Nombre:</strong> ${reserva.pasajero_nombre ?? '—'}</p>
            <p><strong>Documento:</strong> ${reserva.pasajero_documento ?? '—'}</p>
            <p><strong>Asiento:</strong> ${asiento}</p>
          </div>

          <div class="box">
            <h2>Pago</h2>
            <p><strong>Monto:</strong> ${formatMonto(reserva.monto_pagado)}</p>
            <p><strong>Método:</strong> ${metodoPago}</p>
            <p><strong>Estado del pago:</strong> ${reserva.estado_pago ?? '—'}</p>
            <p><strong>Comprobante:</strong> ${reserva.comprobante_pago ?? '—'}</p>
          </div>
        </body>
      </html>
    `)

    ventana.document.close()
    ventana.focus()
    ventana.print()
  }

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
          onClick={handleNuevaReserva}
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

      {loadingForm && (
        <p className="text-sm text-blue-500 px-5 mb-2">
          Cargando datos de la reserva...
        </p>
      )}

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
                <td colSpan={11} className="text-center py-8 text-gray-400">
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
                        onClick={() => handleModificar(r)}
                        disabled={loadingForm}
                        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs font-medium px-2 py-1 rounded-md transition-colors disabled:opacity-50"
                      >
                        Modificar
                      </button>

                      <button
                        type="button"
                        onClick={() => handleImprimirComprobante(r)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-medium px-2 py-1 rounded-md transition-colors"
                      >
                        Imprimir
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEliminar(r.reserva_id)}
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

      <ReservaFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setModalData(null)
        }}
        initialData={modalData}
        onSaved={fetchReservas}
      />
    </div>
  )
}