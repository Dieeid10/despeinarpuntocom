import { client, ApiResponse } from '@/services/api'
import { urls } from './urls'
import type { User, Password, LoginData, UsersState } from '@/interfaces'

export const usersServices = {
    login: (data: { username: string, password: string }) => client.post<ApiResponse<LoginData>>(urls.users.login, data),
    getUsers: () => client.get<ApiResponse<UsersState>>(urls.users.getUsers),
    createUser: (newUser: User ) => client.post<ApiResponse<User>>(urls.users.createUser, newUser),
    updateUser: (user_id: string, dataUser: User) => client.put(urls.users.updateUser(user_id), dataUser),
    deleteUser: (user_id: string) => client.delete(urls.users.deleteUser(user_id)),
    updatePassword: (user_id: string, dataUser: Password) => client.patch(urls.users.updateUser(user_id), dataUser),
}