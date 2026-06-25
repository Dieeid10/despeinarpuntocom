# utils/response.py
from fastapi.responses import JSONResponse

def success(data=None, message="OK", status_code=200):
    return JSONResponse(status_code=status_code, content={
        "success": True,
        "message": message,
        "data": data
    })

def error(message="Error", status_code=400, data=None):
    return JSONResponse(status_code=status_code, content={
        "success": False,
        "message": message,
        "data": data
    })