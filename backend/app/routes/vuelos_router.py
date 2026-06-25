from fastapi import APIRouter, Request
from app.controllers.vuelos_controller import vuelos_dict
from app.utils.handler import route_handler
from app.utils.response import success

router = APIRouter()

@router.get('/')
@route_handler
async def get_all_vuelos():
    result = vuelos_dict['get_vuelos']()
    
    return success(data=result, message='Vuelos recuperados con exito.')

@router.get('/aeropuertos')
@route_handler
async def get_aeropuertos():
    result = vuelos_dict['get_aeropuertos']()

    return success(data=result, message='Aeropuertos recuperados con exito.')

@router.get('/aerolineas')
@route_handler
async def get_aerolineas():
    result = vuelos_dict['get_aerolineas']()

    return success(data=result, message='Aerolineas recuperadas con exito.')

@router.get('/{vuelo_id}')
@route_handler
async def get_vuelo_by_id(vuelo_id: int):
    result = vuelos_dict['get_vuelo_by_id'](vuelo_id)

    return success(data=result, message='Vuelo recuperado con exito.')

@router.get('/{vuelo_id}/asientos')
@route_handler
async def get_asientos_vuelo(vuelo_id: int):
    result = vuelos_dict['get_asientos_vuelo'](vuelo_id)

    return success(data=result, message='Asientos recuperados con exito.')

@router.post('/')
@route_handler
async def create_vuelo(request: Request):
    body = await request.json()
    result = vuelos_dict['create_vuelo'](
        tipo_vuelo = body.get('tipo_vuelo'),
        origen_id = body.get('origen_id'),
        destino_id = body.get('destino_id'),
        fecha_salida = body.get('fecha_salida'),
        fecha_llegada = body.get('fecha_llegada'),
        id_aerolinea = body.get('id_aerolinea'),
        asientos = body.get('asientos', []),
    )

    return success(data={'vuelo_id': result}, message='Vuelo creado con exito.', status_code=201)

@router.put('/{vuelo_id}')
@route_handler
async def update_vuelo(vuelo_id: int, request: Request):
    body = await request.json()
    vuelos_dict['update_vuelo'](
        vuelo_id = vuelo_id,
        tipo_vuelo = body.get('tipo_vuelo'),
        origen_id = body.get('origen_id'),
        destino_id = body.get('destino_id'),
        fecha_salida = body.get('fecha_salida'),
        fecha_llegada = body.get('fecha_llegada'),
        id_aerolinea = body.get('id_aerolinea'),
    )

    return success(message='Vuelo actualizado con exito.')

@router.delete('/{vuelo_id}')
@route_handler
async def delete_vuelo(vuelo_id: int):
    vuelos_dict['delete_vuelo'](vuelo_id)

    return success(message='Vuelo eliminado con exito.')