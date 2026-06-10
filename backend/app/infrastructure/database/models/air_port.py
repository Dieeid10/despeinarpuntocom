from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.infrastructure.database.base import Base

class AirportModel(Base):
    __tablename__ = "airports"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    codigo_iata: Mapped[str] = mapped_column(String(3), unique=True, nullable=False)
    nombre: Mapped[str] = mapped_column(String(255), nullable=False)
    ciudad: Mapped[str] = mapped_column(String(255), nullable=False)
    pais: Mapped[str] = mapped_column(String(255), nullable=False)