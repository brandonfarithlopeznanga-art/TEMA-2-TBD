from database import engine, Base
from models import Libro

# Crear las tablas definidas en los modelos
Base.metadata.create_all(bind=engine)

print("¡Tablas creadas correctamente!")
print("La tabla 'libros' está lista para utilizarse.")