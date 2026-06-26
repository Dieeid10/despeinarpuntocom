'use client'

import { useState } from 'react'
import { useUsers } from '@/hooks/useUsers'
import { ModalForm } from '@/components/ui/modal'
import { HeaderTagles } from '@/components/ui/HeaderTables'

const USER_FIELDS = [
  { key: 'nombre', label: 'Nombre', type: 'text' as const, required: true },
  { key: 'apellido', label: 'Apellido', type: 'text' as const, required: true },
  { key: 'password', label: 'Password', type: 'test' as const, required: true },
  { key: 'email', label: 'Email', type: 'email' as const, required: true },
  {
    key: 'rol_id',
    label: 'Rol',
    type: 'select' as const,
    options: [
      { value: '1', label: 'Gerente' },
      { value: '2', label: 'Operario' },
      { value: '3', label: 'Finanzas' },
    ],
    required: true 
  },
]

const PASSWORD_FIELDS = [{ key: 'password', label: 'Nueva contraseña', type: 'password' as const, required: true,},]

export default function UsersTable() {
    const { createUser, deleteUser, fetchUsers, patchState, state, updateUser, updatePassword, usersFiltrados } = useUsers()
    const [ modalData, setModalData ] = useState<Record<string, any> | null>(null)
    const [passwordUser, setPasswordUser] = useState<Record<string, any> | null>(null)

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
                title='Usuarios'
                textButton='+ Nuevo usuario'
                openModal={() => setModalData({})}
            />

            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Buscar por nombre, documento o email..."
                    value={state.busqueda}
                    onChange={e => patchState({ busqueda: e.target.value })}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                />
                <select
                    value={state.filterRol}
                    onChange={(e) =>
                        patchState({
                            filterRol: e.target.value,
                        })
                    }
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Todos los tipos</option>
                    <option value="gerente">Gerentes</option>
                    <option value="operario">Operarios</option>
                    <option value="finanzas">Finanzas</option>
                </select>
            </div>

            <div className="border border-gray-200 rounded-md overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 text-left">Nombre</th>
                            <th className="px-4 py-3 text-left">Email</th>
                            <th className="px-4 py-3 text-left">Rol</th>
                            <th className="px-4 py-3 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {usersFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-8 text-gray-400">
                                    No hay clientes
                                </td>
                            </tr>
                        ) : (
                            usersFiltrados.map((c, index) => (
                                <tr key={`${c.usuario_id}-${index}`} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-800">{c.nombre} {c.apellido}</p>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{c.email}</td>
                                    <td className="px-4 py-3 text-gray-600">{c.rol_nombre}</td>
                                    <td className="flex flex-col justify-center items-start px-4 py-3 gap-4">
                                        <button
                                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4 py-2 rounded-md transition-colors"
                                            onClick={() => setModalData(c)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4 py-2 rounded-md transition-colors"
                                            onClick={() => setPasswordUser(c)}
                                        >
                                            Cambiar password
                                        </button>
                                        <button
                                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4 py-2 rounded-md transition-colors"
                                            onClick={() => deleteUser(c.usuario_id)}
                                        >
                                            Eliminar usuario
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <p className="text-xs text-gray-400 mt-2">
                {usersFiltrados.length} clientes encontrados
            </p>
            {
                modalData &&
                <ModalForm
                    title={
                        modalData?.usuario_id
                        ? 'Editar cliente'
                        : 'Nuevo cliente'
                    }
                    fields={
                            modalData?.usuario_id
                            ? USER_FIELDS.filter(field => field.key !== 'password')
                            : USER_FIELDS
                        }
                    initialData={modalData ?? undefined}
                    onClose={() => setModalData(null)}
                    onSubmit={async (data) => {
                        console.log('La password es: ', data.password)
                        if (data?.usuario_id) {
                            return await updateUser(
                                data.usuario_id,
                                data
                            )
                        }
                        console.log(data)
                        return await createUser(data)
                    }}
                />
            }
            {
                passwordUser && (
                    <ModalForm
                    title="Cambiar contraseña"
                    fields={PASSWORD_FIELDS}
                    onClose={() => setPasswordUser(null)}
                    onSubmit={async (data) => {
                        await updatePassword(
                            passwordUser.usuario_id,
                            data.password
                        )

                        setPasswordUser(null)
                    }}
                    />
                )
            }
        </>
    )
}