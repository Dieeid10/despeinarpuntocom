from fastapi import APIRouter
from app.routes.clientes_router import router as clientes_router
from app.routes.users_router import router as users_router
from app.routes.reservas_router import router as reservas_router
from app.routes.vuelos_router import router as vuelos_router
from app.routes.paquetes_router import router as paquetes_router
from app.routes.asientos_router import router as asientos_router

router = APIRouter()
router.include_router(users_router, prefix='/users', tags=['Users'])
router.include_router(clientes_router, prefix="/clients", tags=["Clientes"])
router.include_router(reservas_router, prefix="/reservations", tags=["Reservas"])
router.include_router(vuelos_router, prefix="/flights", tags=["Flights"])
router.include_router(paquetes_router, prefix="/packages", tags=["Packages"])
router.include_router(asientos_router, prefix="/asientos", tags=["Asientos"])