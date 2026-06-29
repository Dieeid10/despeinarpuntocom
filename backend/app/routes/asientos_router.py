from fastapi import APIRouter, Request
from app.controllers.asientos_controller import asientos_dict
from app.utils.handler import route_handler
from app.utils.response import success

router = APIRouter()

@router.get("/")
@route_handler
async def get_asientos():
    result = asientos_dict['get_asientos']()

    return success(data=result, message='Asientos recuperados con exito.')


@router.get("/{asiento_id}")
@route_handler
async def get_asiento_by_id(asiento_id: int):
    result = asientos_dict['get_asiento_by_id'](asiento_id)

    return success(data=result, message='Asiento recuperado con exito.')


@router.get("/vuelo/{vuelo_id}")
@route_handler
async def get_asientos_by_vuelo(vuelo_id: int):
    result = asientos_dict['get_asientos_by_vuelo'](vuelo_id)

    return success(data=result, message='Asientos del vuelo recuperados con exito.')


@router.get("/vuelo/{vuelo_id}/disponibles")
@route_handler
async def get_asientos_disponibles_by_vuelo(vuelo_id: int):
    result = asientos_dict['get_asientos_disponibles_by_vuelo'](vuelo_id)

    return success(data=result, message='Asientos disponibles recuperados con exito.')


@router.post("/")
@route_handler
async def create_asiento(request: Request):
    body = await request.json()

    result = asientos_dict['create_asiento'](
        vuelo_id=body.get('vuelo_id'),
        tipo_asiento=body.get('tipo_asiento'),
        numero_asiento=body.get('numero_asiento'),
        precio_base=body.get('precio_base')
    )

    return success(data={'asiento_id': result}, message='Asiento creado con exito.')


@router.put("/{asiento_id}")
@route_handler
async def update_asiento(asiento_id: int, request: Request):
    body = await request.json()

    asientos_dict['update_asiento'](
        asiento_id=asiento_id,
        vuelo_id=body.get('vuelo_id'),
        tipo_asiento=body.get('tipo_asiento'),
        numero_asiento=body.get('numero_asiento'),
        precio_base=body.get('precio_base')
    )

    return success(message='Asiento actualizado con exito.')


@router.delete("/{asiento_id}")
@route_handler
async def delete_asiento(asiento_id: int):
    asientos_dict['delete_asiento'](asiento_id)

    return success(message='Asiento eliminado con exito.')