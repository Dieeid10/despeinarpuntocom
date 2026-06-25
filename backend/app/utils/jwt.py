from jwt import encode, decode, ExpiredSignatureError, InvalidTokenError
from fastapi import HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config.config import config_jwt
from datetime import datetime, timedelta, timezone

def create_jwt(data: dict) -> str:
    expiration = datetime.now() + timedelta(hours=config_jwt["expiration_seconds"])
    data.update({"exp": expiration.timestamp()})
    token: str = encode(payload=data, key=config_jwt["secret"], algorithm=config_jwt["algorithm"])
    return token

def validate_token(token: str) -> dict:
    try:
        payload: dict = decode(token, key=config_jwt["secret"], algorithms=[config_jwt["algorithm"]])
        exp = payload.get("exp")
        if exp is None:
            raise Exception("Token inválido: falta la fecha de expiración")
        if datetime.datetime.now().timestamp() > exp:
            raise Exception("Token expirado")
        return payload
    except ExpiredSignatureError:
        raise Exception("Token expirado")
    except InvalidTokenError:
        raise Exception("Token inválido")


class JWTBearer(HTTPBearer):
    async def __call__(self, request: Request):
        auth: HTTPAuthorizationCredentials = await super().__call__(request)
        if auth.credentials:
            data = validate_token(auth.credentials)
            return data
        raise HTTPException(status_code=403, detail="Invalid or missing token")