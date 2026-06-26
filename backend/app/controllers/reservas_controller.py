from app.db.db_cases import database

def get_reservas():
    reservas = database['execute_procedure']('sp_get_reservas_detalle')
    if not reservas:
        return None
    return reservas

def get_reserva_by_id(reserva_id: int):
    reserva = database['execute_procedure']('sp_get_reserva_by_id', (reserva_id,))
    if not reserva:
        return None
    return reserva

def create_reserva(cliente_id: str, tipo_reserva: str, paquete_id: int = None, vuelos: list[int] = [], servicios: list[dict] = [], pasajero: dict = None):
    database['execute_procedure']('sp_insert_reserva', (cliente_id, paquete_id, tipo_reserva))

    result = database['select_case']('SELECT MAX(reserva_id) AS id FROM reservas')
    reserva_id = result[0]['id']

    for vuelo_id in vuelos:
        database['insert_case']('INSERT INTO reservas_vuelos (reserva_id, vuelo_id) VALUES (?, ?)', (reserva_id, vuelo_id))

    if pasajero:
        database['insert_case'](
            'INSERT INTO reservas_pasajeros (reserva_id, nombre, apellido, documento, asiento_id) VALUES (?, ?, ?, ?, ?)',
            (reserva_id, pasajero['nombre'], pasajero['apellido'], pasajero['documento'], pasajero['asiento_id'])
        )

    for servicio in servicios:
        database['insert_case'](
            'INSERT INTO reservas_servicios (reserva_id, servicio_id, cantidad) VALUES (?, ?, ?)',
            (reserva_id, servicio['servicio_id'], servicio.get('cantidad', 1))
        )

    return reserva_id

def update_estado_reserva(reserva_id: int, estado: str):
    database['execute_procedure']('sp_update_estado_reserva', (reserva_id, estado))

def update_reserva(reserva_id: int, tipo_reserva: str, paquete_id: int = None, vuelos: list[int] = [], servicios: list[dict] = [], pasajero: dict = None):
    "Actualizo reserva"
    database['update_case'](
        'UPDATE reservas SET tipo_reserva=?, paquete_id=? WHERE reserva_id=?',
        (tipo_reserva, paquete_id, reserva_id)
    )

    "Elimino datos de antigua reserva en tabla intermedia reservas_vuelos"
    database['delete_case']('DELETE FROM reservas_vuelos WHERE reserva_id = ?', (reserva_id,))
    for vuelo_id in vuelos:
        database['insert_case']('INSERT INTO reservas_vuelos (reserva_id, vuelo_id) VALUES (?, ?)', (reserva_id, vuelo_id))

    "Elimino datos de antigua reserva en tabla intermedia reservas_pasajeros"
    database['delete_case']('DELETE FROM reservas_pasajeros WHERE reserva_id = ?', (reserva_id,))
    if pasajero:
        database['insert_case'](
            'INSERT INTO reservas_pasajeros (reserva_id, nombre, apellido, documento, asiento_id) VALUES (?, ?, ?, ?, ?)',
            (reserva_id, pasajero['nombre'], pasajero['apellido'], pasajero['documento'], pasajero['asiento_id'])
        )

    "Elimino datos de antigua reserva en tabla intermedia reservas_servicios"
    database['delete_case']('DELETE FROM reservas_servicios WHERE reserva_id = ?', (reserva_id,))
    for servicio in servicios:
        database['insert_case'](
            'INSERT INTO reservas_servicios (reserva_id, servicio_id, cantidad) VALUES (?, ?, ?)',
            (reserva_id, servicio['servicio_id'], servicio.get('cantidad', 1))
        )

def delete_reserva(reserva_id: int):
    database['delete_case']('DELETE FROM reservas_servicios WHERE reserva_id = ?', (reserva_id,))
    database['delete_case']('DELETE FROM reservas_pasajeros WHERE reserva_id = ?', (reserva_id,))
    database['delete_case']('DELETE FROM reservas_vuelos WHERE reserva_id = ?', (reserva_id,))
    database['delete_case']('DELETE FROM pagos WHERE reserva_id = ?', (reserva_id,))
    database['delete_case']('DELETE FROM reservas WHERE reserva_id = ?', (reserva_id,))

def registrar_pago(reserva_id: int, monto: float, metodo_pago: str, comprobante: str):
    database['execute_procedure']('sp_insert_pago', (reserva_id, monto, metodo_pago, comprobante))

def get_servicios_by_id(reserva_id: int):
    services = database['execute_procedure']('sp_get_servicios_reserva', (reserva_id,))
    print('Services es: ', services)
    return services

reservas_dict = {
    'get_reservas': get_reservas,
    'get_reserva_by_id': get_reserva_by_id,
    'create_reserva': create_reserva,
    'update_estado_reserva': update_estado_reserva,
    'update_reserva': update_reserva,
    'delete_reserva': delete_reserva,
    'registrar_pago': registrar_pago,
    'get_servicios_by_id': get_servicios_by_id
}