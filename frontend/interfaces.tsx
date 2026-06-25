export interface ReservasState {
  reservas: Reserva[];
  loading: boolean;
  error: string | null;
  filtroEstado: string;
  filtroTipo: string;
  busqueda: string;
}

export interface Reserva {
    reserva_id: number
    fecha_reserva: string
    estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada'
    tipo_reserva: 'vuelo' | 'paquete'
    cliente_nombre: string
    cliente_email: string
    pasajero_nombre: string | null
    numero_asiento: string | null
    tipo_asiento: string | null
    paquete_nombre: string | null
    origen: string | null
    destino: string | null
    monto_pagado: number | null
    metodo_pago: string | null
    estado_pago: string | null
}

export interface Client {
    id?: string
    nombre: string
    apellido: string
    documento: string
    email: string
    telefono: string
    fecha_nacimiento: string
    direccion: string
}

export interface ClientsState {
    clients: Client[]
    loading: boolean
    error: string | null
    busqueda: string
}

export interface UsersState {
    users: User[]
    loading: boolean
    error: string | null
    busqueda: string
    filterRol: string
}

export interface User {
    usuario_id: string
    nombre: string
    apellido: string
    email: string
    rol: string
    rol_id: number
}

export interface Password {
    password: string
}

export interface LoginData {
    token: string
}