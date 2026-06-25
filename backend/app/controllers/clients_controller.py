from app.db.db_cases import database
from uuid import UUID

def get_clients():
    return database['select_case']('SELECT id, nombre, apellido, documento, email, telefono, fecha_nacimiento, direccion FROM clientes ORDER BY apellido')

def get_client_by_id(client_id: UUID):
    return database['select_case']('SELECT id, nombre, apellido, documento, email, telefono, fecha_nacimiento, direccion FROM clientes WHERE id = ?', (client_id,))

def create_client(nombre: str, apellido: str, documento: str, email: str, telefono: str, fecha_nacimiento: str, direccion: str):
    database['insert_case'](
        'INSERT INTO clientes (nombre, apellido, documento, email, telefono, fecha_nacimiento, direccion) VALUES (?, ?, ?, ?, ?, ?, ?)',
        (nombre, apellido, documento, email, telefono, fecha_nacimiento, direccion)
    )

def update_client(client_id: UUID, nombre: str, apellido: str, documento: str, email: str, telefono: str, fecha_nacimiento: str, direccion: str):
    database['update_case'](
        'UPDATE clientes SET nombre=?, apellido=?, documento=?, email=?, telefono=?, fecha_nacimiento=?, direccion=? WHERE id=?',
        (nombre, apellido, documento, email, telefono, fecha_nacimiento, direccion, client_id)
    )

def delete_client(client_id: UUID):
    database['delete_case']('DELETE FROM clientes WHERE id = ?', (client_id,))

clients_dict = {
    'get_clients': get_clients,
    'get_client_by_id': get_client_by_id,
    'create_client': create_client,
    'update_client': update_client,
    'delete_client': delete_client,
}