from fastapi import APIRouter, Request
from app.controllers.paquetes_controller import paquetes_dict
from app.utils.handler import route_handler
from app.utils.response import success

router = APIRouter()

@router.get('/')
@route_handler
async def get_all_paquetes():
    result = paquetes_dict['get_paquetes']()

    return success(data=result, message='Paquetes recuperados con exito.')

@router.get('/{paquete_id}')
@route_handler
async def get_paquete_by_id(paquete_id: int):
    result = paquetes_dict['get_paquete_by_id'](paquete_id)

    return success(data=result, message='Paquete recuperado con exito.')

@router.post('/')
@route_handler
async def create_paquete(request: Request):
    body = await request.json()
    result = paquetes_dict['create_paquete'](
        nombre = body.get('nombre'),
        descripcion = body.get('descripcion'),
        duracion_dias = body.get('duracion_dias'),
        precio = body.get('precio'),
        vuelos = body.get('vuelos', []),
        servicios = body.get('servicios', []),
    )

    return success(data={'paquete_id': result}, message='Paquete creado con exito.', status_code=201)

@router.put('/{paquete_id}')
@route_handler
async def update_paquete(paquete_id: int, request: Request):
    body = await request.json()
    paquetes_dict['update_paquete'](
        paquete_id = paquete_id,
        nombre = body.get('nombre'),
        descripcion = body.get('descripcion'),
        duracion_dias = body.get('duracion_dias'),
        precio = body.get('precio'),
        vuelos = body.get('vuelos', []),
        servicios = body.get('servicios', []),
    )

    return success(message='Paquete actualizado con exito.')

@router.patch('/{paquete_id}/toggle')
@route_handler
async def toggle_paquete(paquete_id: int):
    paquetes_dict['toggle_paquete'](paquete_id)

    return success(message='Estado del paquete actualizado con exito.')

@router.delete('/{paquete_id}')
@route_handler
async def delete_paquete(paquete_id: int):
    paquetes_dict['delete_paquete'](paquete_id)
    
    return success(message='Paquete eliminado con exito.')