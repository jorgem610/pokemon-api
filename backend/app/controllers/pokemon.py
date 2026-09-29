from sqlalchemy.orm import Session
from ..models.pokemon import Pokemon
from ..models.type import Type
from .. import schemas


def get_all_pokemon(db: Session):
    return db.query(Pokemon).all()


def get_pokemon_by_id(db: Session, pokemon_id: int):
    return db.query(Pokemon).filter(Pokemon.id == pokemon_id).first()


def create_pokemon(db: Session, pokemon_data: schemas.PokemonCreate):
    types = db.query(Type).filter(Type.id.in_(pokemon_data.type_ids)).all()

   
    new_pokemon = Pokemon(
        name=pokemon_data.name,
        level=pokemon_data.level,
        hp=pokemon_data.hp,
        types=types, 
    )

   
    db.add(new_pokemon)
    db.commit()
    db.refresh(new_pokemon)  

    return new_pokemon


def update_pokemon(db: Session, pokemon_id: int, pokemon_data: schemas.PokemonCreate):
    
    pokemon = get_pokemon_by_id(db, pokemon_id)
    if pokemon is None:
        return None

    pokemon.name = pokemon_data.name
    pokemon.level = pokemon_data.level
    pokemon.hp = pokemon_data.hp
    pokemon.types = db.query(Type).filter(Type.id.in_(pokemon_data.type_ids)).all()

    db.commit()
    db.refresh(pokemon)
    return pokemon


def delete_pokemon(db: Session, pokemon_id: int):
    
    pokemon = get_pokemon_by_id(db, pokemon_id)
    if pokemon is None:
        return False

    db.delete(pokemon)
    db.commit()
    return True

def set_pokemon_image(db: Session, pokemon_id: int, image_url: str):
    pokemon = get_pokemon_by_id(db, pokemon_id)
    if pokemon is None:
        return None
    pokemon.image_url = image_url
    db.commit()
    db.refresh(pokemon)
    return pokemon