from app.db.db_cases import database


def get_asientos():
    return database['select_case'](
        'SELECT asiento_id, vuelo_id, tipo_asiento, numero_asiento, precio_base FROM asientos ORDER BY vuelo_id, tipo_asiento, numero_asiento'
    )


def get_asiento_by_id(asiento_id: int):
    return database['select_case'](
        'SELECT asiento_id, vuelo_id, tipo_asiento, numero_asiento, precio_base FROM asientos WHERE asiento_id = ?',
        (asiento_id,)
    )


def get_asientos_by_vuelo(vuelo_id: int):
    return database['select_case'](
        'SELECT asiento_id, vuelo_id, tipo_asiento, numero_asiento, precio_base FROM asientos WHERE vuelo_id = ? ORDER BY tipo_asiento, numero_asiento',
        (vuelo_id,)
    )


def get_asientos_disponibles_by_vuelo(vuelo_id: int):
    return database['select_case'](
        """
        SELECT
            a.asiento_id,
            a.vuelo_id,
            a.tipo_asiento,
            a.numero_asiento,
            a.precio_base
        FROM asientos AS a
        WHERE a.vuelo_id = ?
          AND NOT EXISTS (
              SELECT 1
              FROM reservas_pasajeros AS rp
              INNER JOIN reservas AS r
                  ON rp.reserva_id = r.reserva_id
              WHERE rp.asiento_id = a.asiento_id
                AND r.estado <> 'cancelada'
          )
        ORDER BY a.tipo_asiento, a.numero_asiento
        """,
        (vuelo_id,)
    )


def create_asiento(vuelo_id: int, tipo_asiento: str, numero_asiento: str, precio_base: float):
    database['insert_case'](
        'INSERT INTO asientos (vuelo_id, tipo_asiento, numero_asiento, precio_base) VALUES (?, ?, ?, ?)',
        (vuelo_id, tipo_asiento, numero_asiento, precio_base)
    )


def update_asiento(asiento_id: int, vuelo_id: int, tipo_asiento: str, numero_asiento: str, precio_base: float):
    database['update_case'](
        'UPDATE asientos SET vuelo_id=?, tipo_asiento=?, numero_asiento=?, precio_base=? WHERE asiento_id=?',
        (vuelo_id, tipo_asiento, numero_asiento, precio_base, asiento_id)
    )


def delete_asiento(asiento_id: int):
    database['delete_case'](
        'DELETE FROM asientos WHERE asiento_id = ?',
        (asiento_id,)
    )


asientos_dict = {
    'get_asientos': get_asientos,
    'get_asiento_by_id': get_asiento_by_id,
    'get_asientos_by_vuelo': get_asientos_by_vuelo,
    'get_asientos_disponibles_by_vuelo': get_asientos_disponibles_by_vuelo,
    'create_asiento': create_asiento,
    'update_asiento': update_asiento,
    'delete_asiento': delete_asiento,
}