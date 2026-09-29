from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..database import Base
from .type import pokemon_type


class Pokemon(Base):
    __tablename__ = "pokemons"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    level = Column(Integer)
    hp = Column(Integer)
    image_url = Column(String, nullable=True) 

    types = relationship(
        "Type", secondary=pokemon_type, back_populates="pokemons"
    )