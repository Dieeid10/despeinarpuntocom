from fastapi import APIRouter, Request
from app.controllers.reservas_controller import reservas_dict
from app.utils.handler import route_handler
from app.utils.response import success

router = APIRouter()

@router.get('/')
@route_handler
async def get_all_reservations():
    result = reservas_dict['get_reservas']()

    return success(data=result, message='Reservas recuperadas con exito.')

@router.get('/adicionales/{reserva_id}')
@route_handler
async def get_adicionales_by_id(reserva_id: int):
    servicios = reservas_dict['get_servicios_by_id'](reserva_id)

    return success(data=servicios, message='Servicios recuperados con exito.')

@router.get('/{reserva_id}/form')
@route_handler
async def get_reservation_form_by_id(reserva_id: int):
    result = reservas_dict['get_reserva_form_by_id'](reserva_id)

    return success(data=result, message='Reserva para formulario recuperada con exito.')

@router.get('/{reserva_id}')
@route_handler
async def get_reservation_by_id(reserva_id: int):
    result = reservas_dict['get_reserva_by_id'](reserva_id)

    return success(data=result, message='Reserva recuperada con exito')

@router.post('/')
@route_handler
async def create_reservation(request: Request):
    body = await request.json()

    result = reservas_dict['create_reserva'](
        cliente_id=body.get('cliente_id'),
        tipo_reserva=body.get('tipo_reserva'),
        paquete_id=body.get('paquete_id'),
        vuelos=body.get('vuelos', []),
        servicios=body.get('servicios', []),
        pasajeros=body.get('pasajeros', []),
    )

    return success(data={'reserva_id': result}, message='Reserva creada con exito.', status_code=201)

@router.put('/{reserva_id}/status')
@route_handler
async def update_reservation_estado(reserva_id: int, request: Request):
    body = await request.json()
    reservas_dict['update_estado_reserva'](reserva_id, body.get('estado'))

    return success(message='Estado actualizado con exito.')

@router.put('/{reserva_id}')
@route_handler
async def update_reservation(reserva_id: int, request: Request):
    body = await request.json()

    reservas_dict['update_reserva'](
        reserva_id=reserva_id,
        tipo_reserva=body.get('tipo_reserva'),
        paquete_id=body.get('paquete_id'),
        vuelos=body.get('vuelos', []),
        servicios=body.get('servicios', []),
        pasajeros=body.get('pasajeros', []),
    )

    return success(message='Reserva actualizada con exito.')

@router.post('/{reserva_id}/payment')
@route_handler
async def register_payment(reserva_id: int, request: Request):
    body = await request.json()

    reservas_dict['registrar_pago'](
        reserva_id=reserva_id,
        monto=body.get('monto'),
        metodo_pago=body.get('metodo_pago'),
        comprobante=body.get('comprobante'),
    )

    return success(message='Pago registrado con exito.', status_code=201)

@router.delete('/{reserva_id}')
@route_handler
async def delete_reservation(reserva_id: int):
    reservas_dict['delete_reserva'](reserva_id)

    return success(message='Reserva eliminada con exito.')