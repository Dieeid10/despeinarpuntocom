from app.db.conection import close_connection, get_connection
from functools import wraps

def comprobate_connection(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        connection = get_connection()
        if connection is None:
            raise RuntimeError("No hay conexión a la base de datos")
        cursor = connection.cursor()
        try:
            return func(cursor, connection, *args, **kwargs)
        finally:
            cursor.close()
    return wrapper

@comprobate_connection
def insert_case(cursor, connection, query: str, query_params: tuple = ()):
    cursor.execute(query, query_params)
    connection.commit()

@comprobate_connection
def select_case(cursor, connection, query: str, query_params: tuple = ()):
    cursor.execute(query, query_params)
    return cursor.fetchall()

@comprobate_connection
def update_case(cursor, connection, query: str, query_params: tuple = ()):
    cursor.execute(query, query_params)
    connection.commit()

@comprobate_connection
def delete_case(cursor, connection, query: str, query_params: tuple = ()):
    cursor.execute(query, query_params)
    connection.commit()

database = {
    'select_case': select_case,
    'insert_case': insert_case,
    'update_case': update_case,
    'delete_case': delete_case,
    'close_connection': close_connection
}