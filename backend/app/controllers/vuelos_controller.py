from app.db.db_cases import database

def get_vuelos():
    vuelos = database['select_case']('SELECT * FROM vw_vuelos_detalle')
    if not vuelos:
        return None
    
    return vuelos

def get_vuelo_by_id(vuelo_id: int):
    vuelo = database['execute_procedure']('sp_get_vuelo_by_id', (vuelo_id,))
    if not vuelo:
        return None
    
    return vuelo

def create_vuelo(tipo_vuelo: str, origen_id: str, destino_id: str, fecha_salida: str, fecha_llegada: str, id_aerolinea: int, asientos: list[dict] = []):
    result = database['execute_procedure']('sp_insert_vuelo', (tipo_vuelo, origen_id, destino_id, fecha_salida, fecha_llegada, id_aerolinea))
    vuelo_id = result[0]['sp_insert_vuelo']

    for asiento in asientos:
        database['insert_case'](
            'INSERT INTO asientos (vuelo_id, tipo_asiento, numero_asiento, precio_base) VALUES (?, ?, ?, ?)',
            (vuelo_id, asiento['tipo_asiento'], asiento['numero_asiento'], asiento['precio_base'])
        )

    return vuelo_id

def update_vuelo(vuelo_id: int, tipo_vuelo: str, origen_id: str, destino_id: str, fecha_salida: str, fecha_llegada: str, id_aerolinea: int):
    database['update_case'](
        'UPDATE vuelos SET tipo_vuelo=?, origen_id=?, destino_id=?, fecha_salida=?, fecha_llegada=?, id_aerolinea=? WHERE vuelo_id=?',
        (tipo_vuelo, origen_id, destino_id, fecha_salida, fecha_llegada, id_aerolinea, vuelo_id)
    )
    return f"Se ha actualizado el vuelo {vuelo_id} con exito"

def delete_vuelo(vuelo_id: int):
    database['delete_case']('DELETE FROM reservas_vuelos WHERE vuelo_id = ?', (vuelo_id,))
    database['delete_case']('DELETE FROM paquetes_vuelos WHERE vuelo_id = ?', (vuelo_id,))
    database['delete_case']('DELETE FROM asientos WHERE vuelo_id = ?', (vuelo_id,))
    database['delete_case']('DELETE FROM vuelos WHERE vuelo_id = ?', (vuelo_id,))

    return f"Se ha eliminado el vuelo {vuelo_id} con exito"

def get_aeropuertos():
    aeropuertos = database['select_case']('SELECT codigo_iata,  nombre, ciudad, pais FROM aeropuertos ORDER BY pais, ciudad')

    if not aeropuertos:
        return None
    
    return aeropuertos

def get_aerolineas():
    aerolineas = database['select_case']('SELECT id_aerolinea, nombre, tipo FROM aerolineas ORDER BY nombre')
    if not aerolineas:
        return None
    
    return aerolineas

def get_asientos_vuelo(vuelo_id: int):
    return database['select_case']( 'SELECT asiento_id, tipo_asiento, numero_asiento, precio_base FROM asientos WHERE vuelo_id = ? ORDER BY tipo_asiento, numero_asiento',
        (vuelo_id,)
    )

vuelos_dict = {
    'get_vuelos': get_vuelos,
    'get_vuelo_by_id': get_vuelo_by_id,
    'create_vuelo': create_vuelo,
    'update_vuelo': update_vuelo,
    'delete_vuelo': delete_vuelo,
    'get_aeropuertos': get_aeropuertos,
    'get_aerolineas': get_aerolineas,
    'get_asientos_vuelo': get_asientos_vuelo,
}