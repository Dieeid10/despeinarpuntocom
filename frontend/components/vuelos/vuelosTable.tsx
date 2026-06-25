'use client'

import { useEffect, useState } from 'react'
import { vuelosServices } from '@/services/vuelos'

interface Vuelo {
    vuelo_id: number
    tipo_vuelo: 'nacional' | 'internacional'
    fecha_salida: string
    fecha_llegada: string
    duracion_horas: number
    origen_iata: string
    origen_ciudad: string
    origen_pais: string
    destino_iata: string
    destino_ciudad: string
    destino_pais: string
    aerolinea: string
    total_asientos: number
}

const tipoStyles: Record<string, string> = {
    nacional:       'bg-blue-100 text-blue-800',
    internacional:  'bg-purple-100 text-purple-800',
}

const formatFecha = (fecha: string) =>
    new Date(fecha).toLocaleString('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })

export default function VuelosTable() {
    const [vuelos, setVuelos]         = useState<Vuelo[]>([])
    const [loading, setLoading]       = useState(true)
    const [error, setError]           = useState<string | null>(null)
    const [filtroTipo, setFiltroTipo] = useState('')
    const [busqueda, setBusqueda]     = useState('')
    const [modalData, setModalData] = useState<Record<string, any> | null>(null)

    useEffect(() => {
        const fetchVuelos = async () => {
            const result = await vuelosServices.getVuelos()
            if (!result.success) {
                setError(result.message)
            } else {
                setVuelos(result.data)
            }
            setLoading(false)
        }
        fetchVuelos()
    }, [])

    const vuelosFiltrados = vuelos.filter(v => {
        const matchTipo     = !filtroTipo || v.tipo_vuelo === filtroTipo
        const matchBusqueda = !busqueda   ||
            v.origen_ciudad.toLowerCase().includes(busqueda.toLowerCase()) ||
            v.destino_ciudad.toLowerCase().includes(busqueda.toLowerCase()) ||
            v.aerolinea.toLowerCase().includes(busqueda.toLowerCase())
        return matchTipo && matchBusqueda
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
        <>
            <header className=" flex justify-between items-center px-10 py-4 mb-6 bg-[var(--color-conteiner)]">
                <h2 className="text-xl font-bold text-gray-800">Vuelos</h2>
                <button
                    onClick={() => setModalData({})}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
                >
                    + Nuevo vuelo
                </button>
            </header>

            <div className="flex gap-3 mb-6 flex-wrap">
                <input
                    type="text"
                    placeholder="Buscar ciudad o aerolínea..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={filtroTipo}
                    onChange={e => setFiltroTipo(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Todos los tipos</option>
                    <option value="nacional">Nacional</option>
                    <option value="internacional">Internacional</option>
                </select>
            </div>

            <div className="border border-gray-200 rounded-md overflow-hidden p-5">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">Tipo</th>
                            <th className="px-4 py-3 text-left">Origen</th>
                            <th className="px-4 py-3 text-left">Destino</th>
                            <th className="px-4 py-3 text-left">Salida</th>
                            <th className="px-4 py-3 text-left">Llegada</th>
                            <th className="px-4 py-3 text-left">Duración</th>
                            <th className="px-4 py-3 text-left">Aerolínea</th>
                            <th className="px-4 py-3 text-left">Asientos</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {vuelosFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="text-center py-8 text-gray-400">
                                    No hay vuelos
                                </td>
                            </tr>
                        ) : (
                            vuelosFiltrados.map((v, index) => (
                                <tr key={`${v.vuelo_id}-${index}`} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-500">#{v.vuelo_id}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${tipoStyles[v.tipo_vuelo]}`}>
                                            {v.tipo_vuelo}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-800">{v.origen_ciudad}</p>
                                        <p className="text-xs text-gray-400">{v.origen_iata} · {v.origen_pais}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-800">{v.destino_ciudad}</p>
                                        <p className="text-xs text-gray-400">{v.destino_iata} · {v.destino_pais}</p>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{formatFecha(v.fecha_salida)}</td>
                                    <td className="px-4 py-3 text-gray-600">{formatFecha(v.fecha_llegada)}</td>
                                    <td className="px-4 py-3 text-gray-600">{v.duracion_horas}h</td>
                                    <td className="px-4 py-3 text-gray-600">{v.aerolinea}</td>
                                    <td className="px-4 py-3">
                                        {v.total_asientos === 0
                                            ? <span className="text-xs text-gray-400">Sin asientos</span>
                                            : <span>{v.total_asientos}</span>
                                        }
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <p className="text-xs text-gray-400 mt-2">
                {vuelosFiltrados.length} vuelos encontrados
            </p>
        </>
    )
}