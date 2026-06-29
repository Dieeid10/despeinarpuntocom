// hooks/useClients.ts
import { useState, useEffect, useCallback, useMemo } from 'react'
import { usersServices } from '@/services/users'
import type { UsersState, User, Password } from '@/interfaces'

export function useUsers() {
  const [state, setState] = useState<UsersState>({
    users: [],
    loading: true,
    error: null,
    busqueda: '',
    filterRol: ''
  })

  const patchState = (updates: Partial<UsersState>) =>
    setState(prev => ({ ...prev, ...updates }))

  const fetchUsers = useCallback(async () => {
    patchState({ loading: true, error: null })

    const result = await usersServices.getUsers()

    if (!result.success) {
      patchState({
        error: result.message,
        loading: false,
      })
      return
    }

    patchState({
      users: result.data,
      loading: false,
    })
  }, [])

  const createUser = async (data: User) => {
    const result = await usersServices.createUser(data)
    
    if (result.success) {
      await fetchUsers()
    }

    return result
  }

  const updateUser = async (user_id: string, dataUser: User ) => {
    const result = await usersServices.updateUser(user_id, dataUser)
    console.log('Resulta es: ',result)
    
    if (result.success) {
      await fetchUsers()
    }

    return result
  }

  const deleteUser = async (user_id: string) => {
    const result = await usersServices.deleteUser(user_id)

    if (result.success) {
      await fetchUsers()
    }

    return result
  }

  const updatePassword = async (user_id: string, passwordData: Password) => {
    const result = await usersServices.updatePassword(user_id, passwordData)
    return result
  }

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const usersFiltrados = useMemo(() => {
      return state.users.filter((c) => {
        const matchEstado = !state.filterRol || c.rol_nombre.toLowerCase() === state.filterRol
  
        const matchBusqueda =
            !state.busqueda ||
            `${c.nombre} ${c.apellido}`
            .toLowerCase()
            .includes(state.busqueda.toLowerCase()) ||
            c.email
            .toLowerCase()
            .includes(state.busqueda.toLowerCase())
  
        return matchEstado && matchBusqueda;
      });
    }, [state.users, state.filterRol, state.busqueda]);

  return { state, patchState, fetchUsers, createUser, updateUser, deleteUser, updatePassword, usersFiltrados }
}