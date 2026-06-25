'use client'

import { useEffect, useState } from 'react'
import { paquetesServices } from '@/services/paquetes'

interface Paquete {
    paquete_id: number
    nombre: string
    descripcion: string
    duracion_dias: number
    precio: number
    activo: boolean
    cantidad_vuelos: number
    cantidad_servicios: number
}

const formatPrecio = (precio: number) => `$${precio.toLocaleString('es-AR')}`

export default function PaquetesTable() {
    const [paquetes, setPaquetes]         = useState<Paquete[]>([])
    const [loading, setLoading]           = useState(true)
    const [error, setError]               = useState<string | null>(null)
    const [filtroActivo, setFiltroActivo] = useState('')
    const [busqueda, setBusqueda]         = useState('')

    useEffect(() => {
        const fetchPaquetes = async () => {
            const result = await paquetesServices.getPaquetes()
            if (!result.success) {
                setError(result.message)
            } else {
                setPaquetes(result.data)
            }
            setLoading(false)
        }
        fetchPaquetes()
    }, [])

    const paquetesFiltrados = paquetes.filter(p => {
        const matchActivo   = !filtroActivo || (filtroActivo === 'activo' ? p.activo : !p.activo)
        const matchBusqueda = !busqueda     || p.nombre.toLowerCase().includes(busqueda.toLowerCase())
        return matchActivo && matchBusqueda
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
            <h2 className="text-xl font-bold text-gray-800 mb-6">Paquetes</h2>

            {/* Filtros */}
            <div className="flex gap-3 mb-6 flex-wrap">
                <input
                    type="text"
                    placeholder="Buscar paquete..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={filtroActivo}
                    onChange={e => setFiltroActivo(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Todos</option>
                    <option value="activo">Activos</option>
                    <option value="inactivo">Inactivos</option>
                </select>
            </div>

            {/* Tabla */}
            <div className="border border-gray-200 rounded-md overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">Nombre</th>
                            <th className="px-4 py-3 text-left">Descripción</th>
                            <th className="px-4 py-3 text-left">Duración</th>
                            <th className="px-4 py-3 text-left">Precio</th>
                            <th className="px-4 py-3 text-left">Vuelos</th>
                            <th className="px-4 py-3 text-left">Servicios</th>
                            <th className="px-4 py-3 text-left">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paquetesFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-8 text-gray-400">
                                    No hay paquetes
                                </td>
                            </tr>
                        ) : (
                            paquetesFiltrados.map((p, index) => (
                                <tr key={`${p.paquete_id}-${index}`} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-500">#{p.paquete_id}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800">{p.nombre}</td>
                                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{p.descripcion}</td>
                                    <td className="px-4 py-3 text-gray-600">{p.duracion_dias} días</td>
                                    <td className="px-4 py-3 font-medium text-gray-800">{formatPrecio(p.precio)}</td>
                                    <td className="px-4 py-3 text-gray-600">{p.cantidad_vuelos}</td>
                                    <td className="px-4 py-3 text-gray-600">{p.cantidad_servicios}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                                            {p.activo ? 'activo' : 'inactivo'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <p className="text-xs text-gray-400 mt-2">
                {paquetesFiltrados.length} paquetes encontrados
            </p>
        </div>
    )
}