from fastapi import FastAPI
from app.routes import router as api_router
from starlette.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

app.title = "Servicio de aerolíneas"
app.version = "1.0.1"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

app.include_router(api_router)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=False)