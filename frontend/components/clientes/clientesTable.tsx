'use client'

import { useClient } from '@/hooks/useClient'
import { useState } from 'react'
import { ModalForm } from '@/components/ui/modal'
import { HeaderTagles } from '../ui/HeaderTables'
import { Client } from '@/interfaces'

const CLIENT_FIELDS = [
    { key: 'nombre', label: 'Nombre', type: 'text' as const, required: true },
    { key: 'apellido', label: 'Apellido', type: 'text' as const,  required: true },
    { key: 'documento', label: 'Documento', type: 'text' as const,  required: true },
    { key: 'email', label: 'Email', type: 'email' as const, required: true },
    { key: 'telefono', label: 'Teléfono', type: 'text' as const,  required: true },
    { key: 'fecha_nacimiento', label: 'Fecha nacimiento', type: 'date' as const, required: true },
    { key: 'direccion', label: 'Dirección', type: 'text' as const,  required: true },
]

export default function ClientsTable() {
    const { state, patchState, fetchClients, createClient, updateClient, deleteClient, clientsFiltrados } = useClient()
    const [modalData, setModalData] = useState<Record<string, any> | null>(null)

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
                title="Cleintes"
                openModal={() => setModalData({})}
                textButton="+ Nuevo cliente"
            />

            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Buscar por nombre, documento o email..."
                    value={state.busqueda}
                    onChange={e => patchState({ busqueda: e.target.value })}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                />
            </div>

            <div className="border border-gray-200 rounded-md overflow-hidden p-5">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 text-left">Nombre</th>
                            <th className="px-4 py-3 text-left">Documento</th>
                            <th className="px-4 py-3 text-left">Email</th>
                            <th className="px-4 py-3 text-left">Teléfono</th>
                            <th className="px-4 py-3 text-left">Nacimiento</th>
                            <th className="px-4 py-3 text-left">Dirección</th>
                            <th className="px-4 py-3 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {clientsFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-8 text-gray-400">
                                    No hay clientes
                                </td>
                            </tr>
                        ) : (
                            clientsFiltrados.map((c, index) => (
                                <tr key={`${c.id}-${index}`} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-800">{c.nombre} {c.apellido}</p>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{c.documento}</td>
                                    <td className="px-4 py-3 text-gray-600">{c.email}</td>
                                    <td className="px-4 py-3 text-gray-600">{c.telefono}</td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {new Date(c.fecha_nacimiento).toLocaleDateString('es-AR')}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{c.direccion}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => setModalData(c)}
                                            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs font-medium px-2 py-1 rounded-md transition-colors disabled:opacity-50"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => deleteClient(c.id)}
                                            className="bg-red-100 hover:bg-red-200 text-red-800 text-xs font-medium px-2 py-1 rounded-md transition-colors"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <p className="text-xs text-gray-400 mt-2">
                {clientsFiltrados.length} clientes encontrados
            </p>
            {
                modalData &&
                <ModalForm<Client>
                    title={modalData?.id ? 'Editar cliente' : 'Nuevo cliente'}
                    fields={CLIENT_FIELDS}
                    initialData={modalData ?? undefined}
                    onClose={() => setModalData(null)}
                    onSubmit={async (data) => {
                        console.log('La data es: ',data)

                        if (modalData?.id) {
                        console.log('Está ejecutando el update')

                        return await updateClient(
                            modalData.id,
                            {
                            ...modalData,
                            ...data,
                            }
                        )
                        }

                        return await createClient(data)
                    }}
                />
            }
        </>
    )
}