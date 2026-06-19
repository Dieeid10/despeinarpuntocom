from fastapi import Depends, HTTPException
from app.utils.jwt import JWTBearer

def RoleRequired(*rols):
    async def verificate(user=Depends(JWTBearer)):
        if user.get('rol') not in rols:
            raise HTTPException(
                status_code=403,
                detail="No tienes permisos para utilizar este endpoint"
            )
        return user
    
    return verificate