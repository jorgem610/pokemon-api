from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import shutil

from ..database import get_db
from ..controllers import pokemon as pokemon_controller
from .. import schemas

router = APIRouter(prefix="/pokemon", tags=["Pokemon"])


@router.get("/", response_model=list[schemas.Pokemon])
def read_all_pokemon(db: Session = Depends(get_db)):
    """GET /pokemon -> lista todos los Pokemon"""
    return pokemon_controller.get_all_pokemon(db)


@router.get("/{pokemon_id}", response_model=schemas.Pokemon)
def read_pokemon(pokemon_id: int, db: Session = Depends(get_db)):
    """GET /pokemon/{id} -> devuelve un Pokemon concreto"""
    pokemon = pokemon_controller.get_pokemon_by_id(db, pokemon_id)
    if pokemon is None:
        raise HTTPException(status_code=404, detail="Pokemon no encontrado")
    return pokemon


@router.post("/", response_model=schemas.Pokemon, status_code=201)
def create_pokemon(pokemon: schemas.PokemonCreate, db: Session = Depends(get_db)):
    """POST /pokemon -> crea un Pokemon nuevo"""
    return pokemon_controller.create_pokemon(db, pokemon)


@router.put("/{pokemon_id}", response_model=schemas.Pokemon)
def update_pokemon(
    pokemon_id: int, pokemon: schemas.PokemonCreate, db: Session = Depends(get_db)
):
    """PUT /pokemon/{id} -> actualiza un Pokemon existente"""
    updated = pokemon_controller.update_pokemon(db, pokemon_id, pokemon)
    if updated is None:
        raise HTTPException(status_code=404, detail="Pokemon no encontrado")
    return updated


@router.delete("/{pokemon_id}", status_code=204)
def delete_pokemon(pokemon_id: int, db: Session = Depends(get_db)):
    """DELETE /pokemon/{id} -> borra un Pokemon"""
    deleted = pokemon_controller.delete_pokemon(db, pokemon_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Pokemon no encontrado")


@router.post("/{pokemon_id}/image", response_model=schemas.Pokemon)
def upload_pokemon_image(
    pokemon_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)
):
    """POST /pokemon/{id}/image -> sube/reemplaza la imagen de un Pokemon"""
    pokemon = pokemon_controller.get_pokemon_by_id(db, pokemon_id)
    if pokemon is None:
        raise HTTPException(status_code=404, detail="Pokemon no encontrado")

    extension = file.filename.split(".")[-1]
    file_path = f"static/pokemon/{pokemon_id}.{extension}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image_url = f"/static/pokemon/{pokemon_id}.{extension}"
    return pokemon_controller.set_pokemon_image(db, pokemon_id, image_url)