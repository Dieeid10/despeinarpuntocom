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
        getFlights: '/flights',
        createFlights: '/flights',
        updateFlight: (fligth_id: number) => `/flights/${fligth_id}`,
        deleteFlight: (fligth_id: number) => `/flights/${fligth_id}`
    },
    packages: {
        getPackages: '/packages'
    },
    clients: {
        getClients: '/clients',
        createClient: '/clients',
        updateClient: (client_id: string) => `/clients/${client_id}`,
        deleteClient: (client_id: string) => `/clients/${client_id}`
    },
    services: {
        getByReserveId: (reservation_id: number) => `/reservations/adicionales/${reservation_id}`
    }
}