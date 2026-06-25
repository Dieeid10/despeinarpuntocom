export const urls = {
    users: {
        login: '/users/login',
        getUsers: '/users',
        createUser: '/users',
        updateUser: (user_id: string) => `/users/${user_id}`,
        deleteUser: (user_id: string) => `/users/${user_id}`
    },
    reservations: {
        getReservations: '/reservations',
        createReservation: '/reservations',
        getReservationById: (reservation_id: string ) => `/reservarion/${reservation_id}`,
        updateReservationById: (reservation_id: string ) => `/reservarion/${reservation_id}`,
        deteleReservationById: (reservation_id: string ) => `/reservarion/${reservation_id}`,
        getStatusReservationById: (reservation_id: string ) => `/reservarion/${reservation_id}/status`,
        registerPaymentById: (reservation_id: string ) => `/reservarion/${reservation_id}/payment`,
    },
    flights: {
        getFlights: '/flights'
    },
    packages: {
        getPackages: '/packages'
    },
    clients: {
        getClients: '/clients',
        createClient: '/clients',
        updateClient: (client_id: string) => `/clients/${client_id}`,
        deleteClient: (client_id: string) => `/clients/${client_id}`
    }
}