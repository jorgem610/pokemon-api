from pydantic import BaseModel


class TypeBase(BaseModel):
    name: str

class TypeCreate(TypeBase):
    pass  


class Type(TypeBase):
    id: int

class Config:
    from_attributes = True


# --- Pokemon ---

class PokemonBase(BaseModel):
    name: str
    level: int
    hp: int


class PokemonCreate(PokemonBase):
    type_ids: list[int] = []  


class Pokemon(PokemonBase):
    id: int
    image_url: str | None = None
    types: list[Type] = []  

    class Config:
        from_attributes = True