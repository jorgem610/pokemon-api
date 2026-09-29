from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base



pokemon_type = Table(
    "pokemon_type",
    Base.metadata,
    Column("pokemon_id", Integer, ForeignKey("pokemons.id"), primary_key=True),
    Column("type_id", Integer, ForeignKey("types.id"), primary_key=True),
)


class Type(Base):
    __tablename__ = "types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)  # ej. "Fuego", "Agua"

    pokemons = relationship(
        "Pokemon", secondary=pokemon_type, back_populates="types"
    )