from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from pydantic import BaseModel, ConfigDict

from database import get_db
from models import Libro

app = FastAPI(
    title="API de Biblioteca",
    description="API REST para administrar libros de una biblioteca",
    version="1.0.0"
)


# Estructura de los datos que recibiremos
class LibroCrear(BaseModel):
    titulo: str
    autor: str
    genero: str
    precio: float
    existencias: int = 0


# Estructura de los datos que devolveremos
class LibroRespuesta(LibroCrear):
    id: int

    model_config = ConfigDict(from_attributes=True)


# Endpoint de bienvenida
@app.get("/")
def inicio():
    return {
        "mensaje": "API de Biblioteca funcionando correctamente"
    }


# Consultar todos los libros
@app.get("/libros", response_model=list[LibroRespuesta])
def listar_libros(db: Session = Depends(get_db)):
    consulta = select(Libro).order_by(Libro.id)
    return db.scalars(consulta).all()


# Consultar un libro por su ID
@app.get("/libros/{libro_id}", response_model=LibroRespuesta)
def consultar_libro(libro_id: int, db: Session = Depends(get_db)):
    libro = db.get(Libro, libro_id)

    if libro is None:
        raise HTTPException(
            status_code=404,
            detail="Libro no encontrado"
        )

    return libro


# Registrar un libro
@app.post("/libros", response_model=LibroRespuesta, status_code=201)
def registrar_libro(datos: LibroCrear, db: Session = Depends(get_db)):
    libro = Libro(**datos.model_dump())

    db.add(libro)
    db.commit()
    db.refresh(libro)

    return libro


# Modificar un libro
@app.put("/libros/{libro_id}", response_model=LibroRespuesta)
def modificar_libro(
    libro_id: int,
    datos: LibroCrear,
    db: Session = Depends(get_db)
):
    libro = db.get(Libro, libro_id)

    if libro is None:
        raise HTTPException(
            status_code=404,
            detail="Libro no encontrado"
        )

    for campo, valor in datos.model_dump().items():
        setattr(libro, campo, valor)

    db.commit()
    db.refresh(libro)

    return libro


# Eliminar un libro
@app.delete("/libros/{libro_id}")
def eliminar_libro(libro_id: int, db: Session = Depends(get_db)):
    libro = db.get(Libro, libro_id)

    if libro is None:
        raise HTTPException(
            status_code=404,
            detail="Libro no encontrado"
        )

    db.delete(libro)
    db.commit()

    return {
        "mensaje": "Libro eliminado correctamente",
        "id": libro_id
    }