from app.db.conection import close_connection, get_connection
from functools import wraps
from datetime import datetime, date
from decimal import Decimal

def parse_row(row: dict) -> dict:
    result = {}
    for key, value in row.items():
        if isinstance(value, (datetime, date)):
            result[key] = value.isoformat()
        elif isinstance(value, Decimal):
            result[key] = float(value)
        else:
            result[key] = value
    return result

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
    if query_params:
        cursor.execute(query, query_params)
    else:
        cursor.execute(query)
    
    if cursor.description:
        columns = [col[0] for col in cursor.description]
        rows = cursor.fetchall()
        return [parse_row(dict(zip(columns, row))) for row in rows] if rows else None
    
    return None

@comprobate_connection
def update_case(cursor, connection, query: str, query_params: tuple = ()):
    cursor.execute(query, query_params)
    connection.commit()

@comprobate_connection
def delete_case(cursor, connection, query: str, query_params: tuple = ()):
    cursor.execute(query, query_params)
    connection.commit()

@comprobate_connection
def execute_procedure(cursor, connection, procedure_name: str, params: tuple = ()):    
    placeholders = ', '.join(['?' for _ in params])
    
    if placeholders:
        query = f"EXEC {procedure_name} {placeholders}"
        cursor.execute(query, params)
    else:
        query = f"EXEC {procedure_name}"
        cursor.execute(query)

    if cursor.description:
        columns = [col[0] for col in cursor.description]
        rows = cursor.fetchall()
        connection.commit()
        return [parse_row(dict(zip(columns, row))) for row in rows] if rows else None
    
    connection.commit()
    return None

database = {
    'select_case': select_case,
    'insert_case': insert_case,
    'update_case': update_case,
    'delete_case': delete_case,
    'execute_procedure': execute_procedure,
    'close_connection': close_connection
}