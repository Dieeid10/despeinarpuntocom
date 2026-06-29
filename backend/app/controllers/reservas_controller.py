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

def get_reserva_form_by_id(reserva_id: int):
    reserva = database['select_case'](
        '''
        SELECT
            reserva_id,
            cliente_id,
            paquete_id,
            fecha_reserva,
            estado,
            tipo_reserva
        FROM reservas
        WHERE reserva_id = ?
        ''',
        (reserva_id,)
    )

    if not reserva:
        return None

    reserva = reserva[0]

    vuelos = database['select_case'](
        '''
        SELECT vuelo_id
        FROM reservas_vuelos
        WHERE reserva_id = ?
        ''',
        (reserva_id,)
    ) or []

    servicios = database['select_case'](
        '''
        SELECT servicio_id, cantidad
        FROM reservas_servicios
        WHERE reserva_id = ?
        ''',
        (reserva_id,)
    ) or []

    pasajeros = database['select_case'](
        '''
        SELECT
            rp.nombre,
            rp.apellido,
            rp.documento,
            a.vuelo_id,
            rp.asiento_id,
            a.numero_asiento,
            a.tipo_asiento,
            a.precio_base
        FROM reservas_pasajeros AS rp
        INNER JOIN asientos AS a
            ON rp.asiento_id = a.asiento_id
        WHERE rp.reserva_id = ?
        ''',
        (reserva_id,)
    ) or []

    return {
        'reserva_id': reserva['reserva_id'],
        'cliente_id': reserva['cliente_id'],
        'paquete_id': reserva['paquete_id'],
        'fecha_reserva': reserva['fecha_reserva'],
        'estado': reserva['estado'],
        'tipo_reserva': reserva['tipo_reserva'],
        'vuelos': [v['vuelo_id'] for v in vuelos],
        'servicios': servicios,
        'pasajeros': pasajeros,
    }

def create_reserva(cliente_id: str, tipo_reserva: str, paquete_id: int = None, vuelos: list[int] = [], servicios: list[dict] = [], pasajeros: list[dict] = []):
    result = database['execute_procedure']('sp_insert_reserva', (cliente_id, paquete_id, tipo_reserva))
    reserva_id = result[0]['sp_insert_reserva']

    for vuelo_id in vuelos:
        database['insert_case'](
            'INSERT INTO reservas_vuelos (reserva_id, vuelo_id) VALUES (?, ?)',
            (reserva_id, vuelo_id)
        )

    for pasajero in pasajeros:
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

def update_reserva(reserva_id: int, tipo_reserva: str, paquete_id: int = None, vuelos: list[int] = [], servicios: list[dict] = [], pasajeros: list[dict] = []):
    database['update_case'](
        'UPDATE reservas SET tipo_reserva=?, paquete_id=? WHERE reserva_id=?',
        (tipo_reserva, paquete_id, reserva_id)
    )

    database['delete_case']('DELETE FROM reservas_vuelos WHERE reserva_id = ?', (reserva_id,))
    for vuelo_id in vuelos:
        database['insert_case'](
            'INSERT INTO reservas_vuelos (reserva_id, vuelo_id) VALUES (?, ?)',
            (reserva_id, vuelo_id)
        )

    database['delete_case']('DELETE FROM reservas_pasajeros WHERE reserva_id = ?', (reserva_id,))
    for pasajero in pasajeros:
        database['insert_case'](
            'INSERT INTO reservas_pasajeros (reserva_id, nombre, apellido, documento, asiento_id) VALUES (?, ?, ?, ?, ?)',
            (reserva_id, pasajero['nombre'], pasajero['apellido'], pasajero['documento'], pasajero['asiento_id'])
        )

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
    database['execute_procedure']('sp_insert_pago', (reserva_id, monto, metodo_pago, 'completado', comprobante))

def get_servicios_by_id(reserva_id: int):
    services = database['execute_procedure']('sp_get_servicios_reserva', (reserva_id,))
    return services

reservas_dict = {
    'get_reservas': get_reservas,
    'get_reserva_by_id': get_reserva_by_id,
    'get_reserva_form_by_id': get_reserva_form_by_id,
    'create_reserva': create_reserva,
    'update_estado_reserva': update_estado_reserva,
    'update_reserva': update_reserva,
    'delete_reserva': delete_reserva,
    'registrar_pago': registrar_pago,
    'get_servicios_by_id': get_servicios_by_id
}