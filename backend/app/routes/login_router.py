from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.utils.jwt import create_jwt
from app.config.config import get_logget
from app.db.db_cases import database
import hashlib

router = APIRouter()

logger = get_logget(__name__)

@router.get("/users")
async def recuperate_users():
    try:
        result = database['select_case'](
            """SELECT usuarios.nombre, usuarios.apellido, roles.nombre as rol FROM usuarios 
                INNER JOIN roles
                ON usuarios.rol_id = roles.rol_id""",
            ()
        )

        if not result:
            raise ValueError(status_code=401, detail="Credenciales inválidas")

    except Exception as e:
        error_message = f"Error: {e}"
        logger.error(error_message)
        print(error_message)
    finally:
        database['close_connection']()

@router.post("/login")
async def login(username: str, password: str):
    try:
        password_hash = hashlib.md5(password.encode()).hexdigest()
        result = database['select_case'](
            """SELECT u.nombre, u.apellido, roles.nombre as rol FROM usuarios AS u
                INNER JOIN roles AS r
                ON u.rol_id = r.rol_id
                WHERE u.nombre = ? AND u.password = ?""",
            (username, password_hash)
        )

        if not result:
            raise ValueError(status_code=401, detail="Credenciales inválidas")
        
        token = create_jwt({'sub': result[0][0], 'role': result[0][2]})
        return JSONResponse(status_code=200, content={'message': 'Datos validos.', 'token': token})
    except Exception as e:
        error_message = f"Error: {e}"
        logger.error(error_message)
        print(error_message)
    finally:
        database['close_connection']()