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
        getReservationById: (reservation_id: number ) => `/reservarion/${reservation_id}`,
        updateReservationById: (reservation_id: number ) => `/reservarion/${reservation_id}`,
        deteleReservationById: (reservation_id: number ) => `/reservarion/${reservation_id}`,
        getStatusReservationById: (reservation_id: number ) => `/reservarion/${reservation_id}/status`,
        registerPaymentById: (reservation_id: number ) => `/reservarion/${reservation_id}/payment`,
        getReservationFormById: (reservation_id: number) => `/reservations/${reservation_id}/form`,
        updateReservationStatus: (reservation_id: number) => `/reservations/${reservation_id}/status`,
    },
    flights: {
        getFlights: '/flights',
        createFlights: '/flights',
        updateFlight: (fligth_id: number) => `/flights/${fligth_id}`,
        deleteFlight: (fligth_id: number) => `/flights/${fligth_id}`
    },
    packages: {
        getPackages: '/packages',
        getPackageById: (package_id: number) => `/packages/${package_id}`, 
        createPackage: '/packages',
        updatePackage: (package_id: number) => `/packages/${package_id}`,
        deletePackage: (package_id: number) => `/packages/${package_id}`,
    },
    clients: {
        getClients: '/clients',
        createClient: '/clients',
        updateClient: (client_id: string) => `/clients/${client_id}`,
        deleteClient: (client_id: string) => `/clients/${client_id}`
    },
    services: {
        getByReserveId: (reservation_id: number) => `/reservations/adicionales/${reservation_id}`
    },
    asientos: {
         getAll: '/asientos',
        getById: (asiento_id: number) => `/asientos/${asiento_id}`,
        getByVuelo: (vuelo_id: number) => `/asientos/vuelo/${vuelo_id}`,
        getDisponiblesByVuelo: (vuelo_id: number) => `/asientos/vuelo/${vuelo_id}/disponibles`,
        create: '/asientos',
        update: (asiento_id: number) => `/asientos/${asiento_id}`,
        delete: (asiento_id: number) => `/asientos/${asiento_id}`,
    }
}