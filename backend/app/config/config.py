from dotenv import load_dotenv
import logging
import os

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

def get_logget(name: str):
    return logging.getLogger(name=name)

# Configuración de la aplicación
mode=os.getenv("mode", "production")

# Configuración de la base de datos
config_db = {
    "db_host": os.getenv("SQLSERVER_HOST") if mode != 'developer' else os.getenv("DATABASE_HOST_DEV"),
    "db_user": os.getenv("SQLSERVER_USER") if mode != 'developer' else os.getenv("DATABASE_USER_DEV"),
    "db_password": os.getenv("SQLSERVER_PASSWORD") if mode != 'developer' else os.getenv("DATABASE_PASSWORD_DEV"),
    "db_name": os.getenv("SQLSERVER_DATABASE") if mode != 'developer' else os.getenv("DATABASE_NAME_DEV"),
}

# Configuración del JWT
config_jwt = {
    "secret": os.getenv("JWT_SECRET"),
    "algorithm": os.getenv("JWT_ALGORITHM"),
    "expiration_seconds": int(os.getenv("JWT_EXPIRATION_SECONDS", 3600))
}

