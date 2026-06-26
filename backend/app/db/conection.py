import os
from dotenv import load_dotenv
import psycopg

load_dotenv()

state = {
    "connection": None
}


def get_connection():
    if state["connection"] is None or state["connection"].closed:
        database_url = os.getenv("DATABASE_URL")

        if not database_url:
            raise RuntimeError("Falta DATABASE_URL en el archivo .env")

        state["connection"] = psycopg.connect(database_url)

    return state["connection"]


def close_connection():
    if state["connection"]:
        state["connection"].close()
        state["connection"] = None