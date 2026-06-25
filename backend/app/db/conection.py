from app.config.config import config_db
import pyodbc

state = {
    'connection': None
}

def get_connection():
    if state['connection'] is None:
        connection_string = (
            f"DRIVER={{ODBC Driver 18 for SQL Server}};"
            f"SERVER={config_db['db_host']};"
            f"DATABASE={config_db['db_name']};"
            f"UID={config_db['db_user']};"
            f"PWD={config_db['db_password']};"
            "Encrypt=yes;TrustServerCertificate=yes"
        )
        state['connection'] = pyodbc.connect(connection_string)
    return state['connection']

def close_connection():
    if state['connection']:
        state['connection'].close()
        state['connection'] = None