'use client'

import { useFlights } from "@/hooks/useFlights"
import { useState } from 'react'
import { ModalForm } from '@/components/ui/modal'
import { HeaderTagles } from "../ui/HeaderTables"

const tipoStyles: Record<string, string> = {
    nacional: 'bg-blue-100 text-blue-800',
    internacional: 'bg-purple-100 text-purple-800',
}

const formatFecha = (fecha: string) =>
    new Date(fecha).toLocaleString('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })

const VUELO_FIELDS = [
  { key: 'tipo_vuelo', label: 'Tipo de vuelo', type: 'select' as const, required: true, 
    options: [
      { value: 'nacional', label: 'Nacional' },
      { value: 'internacional', label: 'Internacional' },
    ],
  },
  { key: 'origen_id', label: 'Aeropuerto de origen', type: 'text' as const, required: true },
  { key: 'destino_id', label: 'Aeropuerto de destino', type: 'text' as const, required: true },
  { key: 'fecha_salida', label: 'Fecha y hora de salida', type: 'datetime-local' as const, required: true },
  { key: 'fecha_llegada', label: 'Fecha y hora de llegada', type: 'datetime-local' as const, required: true },
  { key: 'id_aerolinea', label: 'ID de aerolínea', type: 'number' as const, required: true },
]

export function VuelosTable() {
    const { state, patchState, fetchVuelos, createFlight, updateFlight, deleteFlight, vuelosFiltrados } = useFlights()
    const [modalData, setModalData] = useState<Record<string, any> | null>(null)
    console.log('La cantidad de vuelos recuperados son: ', vuelosFiltrados.length)
    
    if (vuelosFiltrados.length == 0) return (
        <>
            <HeaderTagles
                title="Vuelos"
                openModal={() => setModalData({})}
                textButton="+ Nuevo vuelo"
            />
            <h1>No se encontraron vuelos</h1>
        </>
    )

    if (state.loading) return (
        <div className="flex justify-center items-center h-full">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )

    if (state.error) return (
        <div className="p-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {state.error}
            </div>
        </div>
    )

    return (
        <>
            <HeaderTagles
                title="Vuelos"
                openModal={() => setModalData({})}
                textButton="+ Nuevo vuelo"
            />

            <div className="flex gap-3 mb-6 flex-wrap">
                <input
                    type="text"
                    placeholder="Buscar ciudad o aerolínea..."
                    value={state.busqueda}
                    onChange={e => patchState({ busqueda: e.target.value })}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={state.filterType}
                    onChange={e => patchState({ filterType: e.target.value })}
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
            {
                modalData &&
                <ModalForm
                    title={
                        modalData?.vuelo_id
                        ? 'Editar vuelo'
                        : 'Nuevo vuelo'
                    }
                    fields={VUELO_FIELDS}
                    initialData={modalData ?? undefined}
                    onClose={() => setModalData(null)}
                    onSubmit={async (data) => {
                        console.log(data)
                        if (data?.id) {
                            console.log('Esta ejecutando el update')
                            return await updateFlight(
                                data.id,
                                data
                            )
                        }

                        return await createFlight(data)
                    }}
                />
            }
        </>
    )
}