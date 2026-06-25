from app.db.db_cases import database
from uuid import UUID

def get_users():
    return database['execute_procedure']('sp_get_all_users')

def get_user_by_username(username: str):
    result = database['execute_procedure']('sp_get_user_by_email', (username,))
    if not result:
        return None
    return result[0]

def create_user(nombre: str, apellido: str, email: str, password: str, rol_id: int):
    database['insert_case'](
        """INSERT INTO usuarios (usuario_id, nombre, apellido, email, password_hash, rol_id)
           VALUES (NEWID(), ?, ?, ?, LOWER(CONVERT(VARCHAR(255), HASHBYTES('SHA2_256', ?), 2)), ?)""",
        (nombre, apellido, email, password, rol_id)
    )
    return f"Se ha insertado al usuario {nombre} {apellido} con exito"

def update_user(usuario_id: UUID, nombre: str, apellido: str, email: str, rol_id: int):
    database['update_case'](
        'UPDATE usuarios SET nombre=?, apellido=?, email=?, rol_id=? WHERE usuario_id=?',
        (nombre, apellido, email, rol_id, usuario_id)
    )
    return f"Se ha actualizado al usuario {nombre} {apellido} con exito"

def update_password(usuario_id: UUID, password: str):
    database['update_case'](
        """UPDATE usuarios SET password_hash = LOWER(CONVERT(VARCHAR(255), HASHBYTES('SHA2_256', ?), 2)) WHERE usuario_id=?""",
        (password, usuario_id)
    )
    return f"Se ha actualizado la password de con exito"

def delete_user(usuario_id: UUID):
    database['delete_case']('DELETE FROM usuarios WHERE usuario_id = ?', (usuario_id,))
    return f"Se ha eliminado al usuario con exito"

def get_roles():
    return database['select_case']('SELECT rol_id, nombre FROM roles ORDER BY nombre')
    

user_dict = {
    'get_users': get_users,
    'get_user_by_username': get_user_by_username,
    'create_user': create_user,
    'update_user': update_user,
    'update_password': update_password,
    'delete_user': delete_user,
    'get_roles': get_roles,
}