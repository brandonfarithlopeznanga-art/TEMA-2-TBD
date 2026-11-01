import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# Cargar las variables del archivo .env
load_dotenv()

# Obtener la dirección de conexión
DATABASE_URL = os.getenv("DATABASE_URL")

# Crear la conexión con PostgreSQL
engine = create_engine(DATABASE_URL, echo=True)

# Crear las sesiones para trabajar con la base de datos
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Clase base para crear los modelos de la base de datos
class Base(DeclarativeBase):
    pass


# Función para administrar las sesiones
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()