from fastapi import HTTPException
from app.config.config import get_logget
from app.utils.response import error
from functools import wraps

logger = get_logget(__name__)

def route_handler(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except HTTPException as e:
            # errores HTTP que vos lanzás (401, 403, 404...)
            return error(message=e.detail, status_code=e.status_code)
        except Exception as e:
            logger.error(f"Error en {func.__name__}: {e}")
            return error(message="Error interno del servidor", status_code=500)
    return wrapper