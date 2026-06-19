from fastapi import APIRouter
from app.routes.clientes_router import router as clientes_router
from app.routes.login_router import router as login_router

router = APIRouter()
router.include_router(login_router, prefix='/Login', tags=['Login'])
router.include_router(clientes_router, prefix="/clientes", tags=["Clientes"])