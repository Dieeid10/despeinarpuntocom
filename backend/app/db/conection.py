from app.config.config import config_db
import pyodbc

state = {
    'connection': None
}

def get_connection():
    if state['connection']:
        connection_string = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={config_db['db_host']};DATABASE={config_db['db_name']};UID={config_db['db_user']};PWD={config_db['db_password']}"
        state['connection'] = pyodbc.connect(connection_string)
    return state['connection']

def close_connection():
    if state['connection']:
        state['connection'].close()
        state['connection'] = None