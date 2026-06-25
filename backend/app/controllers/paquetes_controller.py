from app.db.db_cases import database

def get_paquetes():
    return database['execute_procedure']('sp_get_paquetes')

def get_paquete_by_id(paquete_id: int):
    return database['select_case']('SELECT * FROM vw_paquetes_detalle WHERE paquete_id = ?', (paquete_id,))

def create_paquete(nombre: str, descripcion: str, duracion_dias: int, precio: float, vuelos: list[int], servicios: list[int]):
    database['execute_procedure']('sp_insert_paquete', (nombre, descripcion, duracion_dias, precio))

    result = database['select_case']('SELECT MAX(paquete_id) AS id FROM paquetes')
    paquete_id = result[0]['id']

    for vuelo_id in vuelos:
        database['insert_case']('INSERT INTO paquetes_vuelos (paquete_id, vuelo_id) VALUES (?, ?)', (paquete_id, vuelo_id))

    for servicio_id in servicios:
        database['insert_case']('INSERT INTO paquetes_servicios (paquete_id, servicio_id) VALUES (?, ?)', (paquete_id, servicio_id))

    return paquete_id

def update_paquete(paquete_id: int, nombre: str, descripcion: str, duracion_dias: int, precio: float, vuelos: list[int], servicios: list[int]):
    database['update_case'](
        'UPDATE paquetes SET nombre=?, descripcion=?, duracion_dias=?, precio=? WHERE paquete_id=?',
        (nombre, descripcion, duracion_dias, precio, paquete_id)
    )

    database['delete_case']('DELETE FROM paquetes_vuelos WHERE paquete_id = ?', (paquete_id,))
    for vuelo_id in vuelos:
        database['insert_case']('INSERT INTO paquetes_vuelos (paquete_id, vuelo_id) VALUES (?, ?)', (paquete_id, vuelo_id))

    database['delete_case']('DELETE FROM paquetes_servicios WHERE paquete_id = ?', (paquete_id,))
    for servicio_id in servicios:
        database['insert_case']('INSERT INTO paquetes_servicios (paquete_id, servicio_id) VALUES (?, ?)', (paquete_id, servicio_id))

def toggle_paquete(paquete_id: int):
    database['execute_procedure']('sp_toggle_paquete', (paquete_id,))

def delete_paquete(paquete_id: int):
    database['delete_case']('DELETE FROM paquetes_servicios WHERE paquete_id = ?', (paquete_id,))
    database['delete_case']('DELETE FROM paquetes_vuelos    WHERE paquete_id = ?', (paquete_id,))
    database['delete_case']('DELETE FROM paquetes           WHERE paquete_id = ?', (paquete_id,))

paquetes_dict = {
    'get_paquetes': get_paquetes,
    'get_paquete_by_id': get_paquete_by_id,
    'create_paquete': create_paquete,
    'update_paquete': update_paquete,
    'toggle_paquete': toggle_paquete,
    'delete_paquete': delete_paquete,
}