from sqlalchemy.orm import Session
from ..models.type import Type
from .. import schemas


def get_all_types(db: Session):
    return db.query(Type).all()


def get_type_by_id(db: Session, type_id: int):
    return db.query(Type).filter(Type.id == type_id).first()


def create_type(db: Session, type_data: schemas.TypeCreate):
    new_type = Type(name=type_data.name)
    db.add(new_type)
    db.commit()
    db.refresh(new_type)
    return new_type


def delete_type(db: Session, type_id: int):
    type_obj = get_type_by_id(db, type_id)
    if type_obj is None:
        return False

    db.delete(type_obj)
    db.commit()
    return True

def update_type(db: Session, type_id: int, type_data: schemas.TypeCreate):
    type_obj = get_type_by_id(db, type_id)
    if type_obj is None:
        return None

    type_obj.name = type_data.name
    db.commit()
    db.refresh(type_obj)
    return type_obj