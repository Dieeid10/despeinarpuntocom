from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.utils.jwt import JWTBearer

router = APIRouter()

@router.get("/clientes")
async def get_clientes():
    # Aquí iría la lógica para obtener los clientes desde la base de datos
    clientes = [
        {"id": 1, "nombre": "Cliente 1"},
        {"id": 2, "nombre": "Cliente 2"},
        {"id": 3, "nombre": "Cliente 3"}
    ]
    return JSONResponse(content=clientes)