from sqlalchemy import text
from database import engine

try:
    with engine.connect() as conexion:
        resultado = conexion.execute(text("SELECT version()"))
        version = resultado.fetchone()

        print("¡CONEXIÓN EXITOSA!")
        print("Estamos conectados a PostgreSQL.")
        print("Versión de la base de datos:")
        print(version[0])

except Exception as error:
    print("NO SE PUDO CONECTAR A POSTGRESQL")
    print(error)