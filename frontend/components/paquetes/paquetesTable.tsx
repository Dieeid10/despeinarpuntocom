'use client'

import { usePaquetes } from '@/hooks/usePackages'
import { useState } from 'react'
import { ModalForm } from '../ui/modal'
import { HeaderTagles } from '../ui/HeaderTables'
import { Paquete } from '@/interfaces'

const formatPrecio = (precio: number) => `$${precio.toLocaleString('es-AR')}`

const PACKAGE_FIELDS = [
  { key: 'nombre', label: 'Nombre', type: 'text' as const, required: true },
  { key: 'descripcion', label: 'Descripción', type: 'text' as const, required: true },
  { key: 'duracion_dias', label: 'Duración en días', type: 'number' as const, required: true },
  { key: 'precio', label: 'Precio', type: 'number' as const, required: true },
  {
    key: 'activo',
    label: 'Estado',
    type: 'select' as const,
    options: [
      { value: 'true', label: 'Activo' },
      { value: 'false', label: 'Inactivo' },
    ],
    required: true,
  },
]

export default function PaquetesTable() {
    const { state, patchState, fetchPaquetes, createPaquete, updatePaquete, deletePaquete, paquetesFiltrados } = usePaquetes()
    const [ modalData, setModalData ] = useState<Record<string, any> | null>(null)

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
                title='Paquetes'
                textButton='+ Nuevo paquete'
                openModal={() => setModalData({})}
            />

            <div className="flex gap-3 mb-6 flex-wrap">
                <input
                    type="text"
                    placeholder="Buscar paquete..."
                    value={state.busqueda}
                    onChange={e => patchState({ busqueda: e.target.value})}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={state.filterType}
                    onChange={e => patchState({ filterType: e.target.value})}
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
                            <th className="px-4 py-3 text-left">Acciones</th>
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
                                    <td className="flex flex-col justify-center items-start px-4 py-3 gap-4">
                                        <button
                                            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs font-medium px-2 py-1 rounded-md transition-colors disabled:opacity-50"
                                            onClick={() => setModalData(p)}
                                        >
                                            Editar paquete
                                        </button>
                                        <button
                                            className="bg-red-100 hover:bg-red-200 text-red-800 text-xs font-medium px-2 py-1 rounded-md transition-colors"
                                            onClick={() => deletePaquete(p.paquete_id)}
                                        >
                                            Eliminar paquete
                                        </button>
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
            {
                modalData &&
                <ModalForm<Paquete>
                    title={
                        modalData?.paquete_id
                        ? 'Editar cliente'
                        : 'Nuevo cliente'
                    }
                    fields={ PACKAGE_FIELDS }
                    initialData={modalData ?? undefined}
                    onClose={() => setModalData(null)}
                    onSubmit={async (data) => {
                        if (data?.paquete_id) {
                            return await updatePaquete(
                                data.paquete_id,
                                data
                            )
                        }
                        console.log(data)
                        return await createPaquete(data)
                    }}
                />
            }
        </>
    )
}