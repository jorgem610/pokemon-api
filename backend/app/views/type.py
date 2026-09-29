from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..controllers import type as type_controller
from .. import schemas

router = APIRouter(prefix="/types", tags=["Type"])


@router.get("/", response_model=list[schemas.Type])
def read_all_types(db: Session = Depends(get_db)):
    """GET /types -> lista todos los tipos"""
    return type_controller.get_all_types(db)


@router.get("/{type_id}", response_model=schemas.Type)
def read_type(type_id: int, db: Session = Depends(get_db)):
    """GET /types/{id} -> devuelve un tipo concreto"""
    type_obj = type_controller.get_type_by_id(db, type_id)
    if type_obj is None:
        raise HTTPException(status_code=404, detail="Type no encontrado")
    return type_obj


@router.post("/", response_model=schemas.Type, status_code=201)
def create_type(type_data: schemas.TypeCreate, db: Session = Depends(get_db)):
    """POST /types -> crea un tipo nuevo"""
    return type_controller.create_type(db, type_data)


@router.delete("/{type_id}", status_code=204)
def delete_type(type_id: int, db: Session = Depends(get_db)):
    """DELETE /types/{id} -> borra un tipo"""
    deleted = type_controller.delete_type(db, type_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Type no encontrado")

@router.put("/{type_id}", response_model=schemas.Type)
def update_type(type_id: int, type_data: schemas.TypeCreate, db: Session = Depends(get_db)):
    """PUT /types/{id} -> actualiza un tipo existente"""
    updated = type_controller.update_type(db, type_id, type_data)
    if updated is None:
        raise HTTPException(status_code=404, detail="Type no encontrado")
    return updated