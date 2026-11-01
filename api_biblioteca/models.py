from sqlalchemy import String, Integer, Float
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Libro(Base):
    __tablename__ = "libros"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    titulo: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    autor: Mapped[str] = mapped_column(
        String(120),
        nullable=False
    )

    genero: Mapped[str] = mapped_column(
        String(80),
        nullable=False
    )

    precio: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    existencias: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )