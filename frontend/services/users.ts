import { api } from '@/services/api'
import { urls } from './urls'
import type { User, Password, LoginData, UsersState } from '@/interfaces'

export const usersServices = {
  login: (data: { username: string; password: string }) =>
    api.post<LoginData, { username: string; password: string }>(
      urls.users.login,
      data
    ),

  getUsers: () =>
    api.get<UsersState>(urls.users.getUsers),

  createUser: (newUser: User) =>
    api.post<User, User>(
      urls.users.createUser,
      newUser
    ),

  updateUser: (user_id: string, dataUser: Partial<User>) =>
    api.put<User, Partial<User>>(
      urls.users.updateUser(user_id),
      dataUser
    ),

  deleteUser: (user_id: string) =>
    api.delete<null>(urls.users.deleteUser(user_id)),

  updatePassword: (user_id: string, dataUser: Password) =>
    api.patch<null, Password>(
      urls.users.updateUser(user_id),
      dataUser
    ),
}