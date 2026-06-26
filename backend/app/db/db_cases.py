from app.db.conection import close_connection, get_connection
from functools import wraps
from datetime import datetime, date
from decimal import Decimal
from uuid import UUID


def parse_row(row: dict) -> dict:
    result = {}

    for key, value in row.items():
        if isinstance(value, (datetime, date)):
            result[key] = value.isoformat()
        elif isinstance(value, Decimal):
            result[key] = float(value)
        elif isinstance(value, UUID):
            result[key] = str(value)
        else:
            result[key] = value

    return result


def adapt_query(query: str) -> str:
    return query.replace("?", "%s")


def comprobate_connection(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        connection = get_connection()

        if connection is None:
            raise RuntimeError("No hay conexión a la base de datos")

        cursor = connection.cursor()

        try:
            return func(cursor, connection, *args, **kwargs)
        except Exception:
            connection.rollback()
            raise
        finally:
            cursor.close()

    return wrapper


@comprobate_connection
def insert_case(cursor, connection, query: str, query_params: tuple = ()):
    query = adapt_query(query)

    cursor.execute(query, query_params)
    connection.commit()


@comprobate_connection
def select_case(cursor, connection, query: str, query_params: tuple = ()):
    query = adapt_query(query)

    cursor.execute(query, query_params)

    if cursor.description:
        columns = [col.name for col in cursor.description]
        rows = cursor.fetchall()

        return [
            parse_row(dict(zip(columns, row)))
            for row in rows
        ] if rows else None

    return None


@comprobate_connection
def update_case(cursor, connection, query: str, query_params: tuple = ()):
    query = adapt_query(query)

    cursor.execute(query, query_params)
    connection.commit()


@comprobate_connection
def delete_case(cursor, connection, query: str, query_params: tuple = ()):
    query = adapt_query(query)

    cursor.execute(query, query_params)
    connection.commit()


@comprobate_connection
def execute_procedure(cursor, connection, procedure_name: str, params: tuple = ()):
    placeholders = ", ".join(["%s" for _ in params])

    if placeholders:
        query = f"SELECT * FROM {procedure_name}({placeholders});"
        cursor.execute(query, params)
    else:
        query = f"SELECT * FROM {procedure_name}();"
        cursor.execute(query)

    if cursor.description:
        columns = [col.name for col in cursor.description]
        rows = cursor.fetchall()
        connection.commit()

        return [
            parse_row(dict(zip(columns, row)))
            for row in rows
        ] if rows else None

    connection.commit()
    return None


database = {
    "select_case": select_case,
    "insert_case": insert_case,
    "update_case": update_case,
    "delete_case": delete_case,
    "execute_procedure": execute_procedure,
    "close_connection": close_connection
}