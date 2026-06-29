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
    pasajero_documento: string | null
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
    rol_nombre: string
    rol_id: number
}

export interface Password {
    password: string
}

export interface LoginData {
    token: string
}

export interface ServicioAdicionalReserva {
  servicio_id: number
  nombre: string
  tipo: string
  descripcion: string
  precio: number
  cantidad: number
  subtotal: number
}

export interface ServiciosReservaState {
  servicios: ServicioAdicionalReserva[]
  loading: boolean
  error: string | null
}

export interface VuelosState {
    vuelos: Vuelo[]
    loading: boolean
    error: string | null
    busqueda: string
    filterType: string
}

export interface Vuelo {
  vuelo_id: number
  tipo_vuelo: 'nacional' | 'internacional' | string
  fecha_salida: string
  fecha_llegada: string
  duracion_horas: number
  origen_iata: string
  origen_ciudad: string
  origen_pais: string
  destino_iata: string
  destino_ciudad: string
  destino_pais: string
  aerolinea: string
  total_asientos: number
}

export interface PaquetesState {
    paquetes: Paquete[]
    loading: boolean
    error: string | null
    busqueda: string
    filterType: string
}

export interface Paquete {
  paquete_id: number
  nombre: string
  descripcion: string
  duracion_dias: number
  precio: number
  activo: boolean
  cantidad_vuelos: number
  cantidad_servicios: number
}

export interface AsientosState {
    asientos: Asiento[]
    loading: boolean
    error: string | null
}

export interface Asiento {
    asiento_id: number
    vuelo_id: number
    tipo_asiento: string
    numero_asiento: string
    precio_base: number
}