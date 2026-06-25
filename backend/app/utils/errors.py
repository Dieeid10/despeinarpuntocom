from fastapi import HTTPException

def not_found(detail="Recurso no encontrado"):
    raise HTTPException(status_code=404, detail=detail)

def unauthorized(detail="Credenciales inválidas"):
    raise HTTPException(status_code=401, detail=detail)

def forbidden(detail="No tenés permisos para esto"):
    raise HTTPException(status_code=403, detail=detail)

def bad_request(detail="Datos inválidos"):
    raise HTTPException(status_code=400, detail=detail)

def server_error(detail="Error interno del servidor"):
    raise HTTPException(status_code=500, detail=detail)