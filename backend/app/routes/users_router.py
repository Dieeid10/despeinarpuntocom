from fastapi import APIRouter, Request
from app.utils.jwt import create_jwt
from app.controllers.users_controller import user_dict
from app.utils.handler import route_handler
from app.utils.errors import unauthorized, bad_request
from app.utils.response import success
from uuid import UUID
import hashlib

router = APIRouter()

@router.get("/")
async def recuperate_users():
    result = user_dict['get_users']()
    
    if not result:
        raise ValueError(status_code=401, detail="No se encontraron usuarios.")
    
    return success(data=result, message='Usuarios recuperados con exito.')

@router.post("/login")
@route_handler
async def login(request: Request):
    body = await request.json()
    username = body.get('username')
    password = body.get('password')

    password_hash = hashlib.sha256(password.encode()).hexdigest()
    result = user_dict['get_user_by_username'](username)
    print(result)
    if not result or result['password_hash'] != password_hash:
        unauthorized()

    token = create_jwt({'username': username, 'rol': result['rol_nombre']})

    return success(data={"token": token}, message='Login exitoso.')

@router.post("/")
@route_handler
async def create_user(request: Request):
    body = await request.json()
    print('Lo que llega es: ', body)

    password = body.get('password')
    if not password:
        return bad_request()

    password_hash = hashlib.sha256(password.encode()).hexdigest()

    result = user_dict['create_user'](
        nombre=body.get('nombre'),
        apellido=body.get('apellido'),
        email=body.get('email'),
        password=password_hash,
        rol_id=body.get('rol_id')
    )

    return success(data={'user_id': result}, message='Usuario creado con éxito.')

@router.put("/{user_id}")
@route_handler
async def update_user(user_id: UUID, request: Request):
    print('Entro en el update_user')
    body = await request.json()
    user_dict['update_user'](
        usuario_id = user_id,
        nombre = body.get('nombre'),
        apellido = body.get('apellido'),
        email = body.get('email'),
        rol_id = body.get('rol_id')
    )

    return success(message='Usuario actualizado con exito.')

@router.patch("/{user_id}")
@route_handler
async def update_password(user_id: UUID, request: Request):
    password = await request.json()
    if not password:
        return bad_request()
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    user_dict['update_password'](
        usuario_id = user_id,
        password = password_hash
    )

    return success(message='Password actualizada con exito.')

@router.delete("/{user_id}")
@route_handler
async def delete_user(user_id: UUID):
    print('El user que llega es: ', user_id)
    user_dict['delete_user'](
        usuario_id = user_id
    )

    return success(message='Usuario eliminado con exito.')