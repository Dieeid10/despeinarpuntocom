from fastapi import APIRouter, Request
from app.controllers.clients_controller import clients_dict
from app.utils.handler import route_handler
from app.utils.response import success
from uuid import UUID

router = APIRouter()

@router.get("/")
@route_handler
async def get_clientes():
    result = clients_dict['get_clients']()

    return success(data=result, message='Clientes con exito.')

@router.get('/{id_client}')
@route_handler
async def get_client_by_id(client_id: UUID):
    result = clients_dict['get_client_by_id'](client_id)

    return success(data=result, message='Cliente recupeado con exito.')

@router.post('/')
@route_handler
async def create_client(request: Request):
    print('Entro en el create')
    body = await request.json()
    result = clients_dict['create_client'](
        nombre = body.get('nombre'), 
        apellido = body.get('apellido'), 
        documento = body.get('documento'), 
        email = body.get('email'), 
        telefono = body.get('telefono'), 
        fecha_nacimiento = body.get('fecha_nacimiento'), 
        direccion = body.get('direccion')
    )

    return success(data={'client_id': result}, message='Cliente creado con exito.')

@router.put('/{client_id}')
@route_handler
async def update_client(client_id: UUID, request: Request):
    body = await request.json()
    result = clients_dict['update_client'](
        client_id = client_id,
        nombre = body.get('nombre'), 
        apellido = body.get('apellido'), 
        documento = body.get('documento'), 
        email = body.get('email'), 
        telefono = body.get('telefono'), 
        fecha_nacimiento = body.get('fecha_nacimiento'), 
        direccion = body.get('direccion')
    )

    return success(data={'client_id': result}, message='Cliente actualizado con exito.')

@router.delete('/{client_id}')
@route_handler
async def delete_client(client_id: UUID):
    clients_dict['delete_client'](client_id)

    return success(message='Cliente eliminado con exito.')