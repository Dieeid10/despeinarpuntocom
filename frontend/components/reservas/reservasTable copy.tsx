'use client'

import { useEffect, useState } from 'react'
import { reservasServices } from '@/services/reservas'
import { ModalForm } from '../ui/modal'

interface Reserva {
    reserva_id: number
    fecha_reserva: string
    estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada'
    tipo_reserva: 'vuelo' | 'paquete'
    cliente_nombre: string
    cliente_email: string
    pasajero_nombre: string | null
    numero_asiento: string | null
    tipo_asiento: string | null
    paquete_nombre: string | null
    origen: string | null
    destino: string | null
    monto_pagado: number | null
    metodo_pago: string | null
    estado_pago: string | null
}

const estadoStyles: Record<string, string> = {
    pendiente:  'bg-yellow-100 text-yellow-800',
    confirmada: 'bg-green-100  text-green-800',
    cancelada:  'bg-red-100    text-red-800',
    completada: 'bg-gray-100   text-gray-800',
}

const tipoStyles: Record<string, string> = {
    vuelo:   'bg-blue-100   text-blue-800',
    paquete: 'bg-purple-100 text-purple-800',
}

const formatFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })

const formatMonto = (monto: number | null) =>
    monto ? `$${monto.toLocaleString('es-AR')}` : '—'

export default function ReservasTable() {
    const [reservas, setReservas] = useState<Reserva[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError]  = useState<string | null>(null)
    const [filtroEstado, setFiltroEstado] = useState('')
    const [filtroTipo, setFiltroTipo] = useState('')
    const [busqueda, setBusqueda] = useState('')
    const [modal, setModal] = useState<{ open: boolean, data?: Reserva }>({ open: false })

    const fetchReservas = async () => {
        const result = await reservasServices.getReservas()
        if (!result.success) {
            setError(result.message)
        } else {
            setReservas(result.data)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchReservas()
    }, [])

    const reservasFiltradas = reservas.filter(r => {
        const matchEstado   = !filtroEstado || r.estado === filtroEstado
        const matchTipo     = !filtroTipo   || r.tipo_reserva === filtroTipo
        const matchBusqueda = !busqueda     || r.cliente_nombre.toLowerCase().includes(busqueda.toLowerCase())
        return matchEstado && matchTipo && matchBusqueda
    })

    if (loading) return (
        <div className="flex justify-center items-center h-full">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )

    if (error) return (
        <div className="p-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
            </div>
        </div>
    )

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Reservas</h2>

            <div className="flex gap-3 mb-6 flex-wrap">
                <input
                    type="text"
                    placeholder="Buscar cliente..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={filtroEstado}
                    onChange={e => setFiltroEstado(e.target.value)}
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
                    onChange={e => setFiltroTipo(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Todos los tipos</option>
                    <option value="vuelo">Vuelo</option>
                    <option value="paquete">Paquete</option>
                </select>
                <button onClick={() => setModal({ open: true })}>+ Nueva reserva</button>
            </div>

            {modal.open && (
                <ModalForm
                    title={modal.data ? 'Editar reserva' : 'Nueva reserva'}
                    url={modal.data ? `http://localhost:8000/reservas/${modal.data.reserva_id}` : 'http://localhost:8000/reservas'}
                    method={modal.data ? 'PUT' : 'POST'}
                    initialData={modal.data}
                    onClose={() => setModal({ open: false })}
                    onSuccess={() => fetchReservas()}
                    fields={[
                        { key: 'estado', label: 'Estado', type: 'select', options: [
                            { value: 'pendiente',  label: 'Pendiente' },
                            { value: 'confirmada', label: 'Confirmada' },
                            { value: 'cancelada',  label: 'Cancelada' },
                            { value: 'completada', label: 'Completada' },
                        ]},
                        { key: 'tipo_reserva', label: 'Tipo', type: 'select', options: [
                            { value: 'vuelo',   label: 'Vuelo' },
                            { value: 'paquete', label: 'Paquete' },
                        ]},
                    ]}
                />
            )}

            {/* Tabla */}
            <div className="border border-gray-200 rounded-md overflow-hidden">
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
                                <td colSpan={10} className="text-center py-8 text-gray-400">
                                    No hay reservas
                                </td>
                            </tr>
                        ) : (
                            reservasFiltradas.map((r, index) => (
                                <tr key={`${r.reserva_id}-${index}`} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-500">#{r.reserva_id}</td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-800">{r.cliente_nombre}</p>
                                        <p className="text-xs text-gray-400">{r.cliente_email}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${tipoStyles[r.tipo_reserva]}`}>
                                            {r.tipo_reserva}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {r.tipo_reserva === 'paquete'
                                            ? r.paquete_nombre ?? '—'
                                            : r.origen && r.destino
                                                ? `${r.origen} → ${r.destino}`
                                                : '—'
                                        }
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{r.pasajero_nombre ?? '—'}</td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {r.numero_asiento
                                            ? `${r.numero_asiento} (${r.tipo_asiento})`
                                            : '—'
                                        }
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoStyles[r.estado]}`}>
                                            {r.estado}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{formatFecha(r.fecha_reserva)}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800">{formatMonto(r.monto_pagado)}</td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {r.metodo_pago ? r.metodo_pago.replace(/_/g, ' ') : '—'}
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
        </div>
    )
}