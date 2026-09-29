from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles   # <-- NUEVO IMPORT
import os

from .views import pokemon, type as type_views
from .database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pokemon API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


os.makedirs("static/pokemon", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(pokemon.router)
app.include_router(type_views.router)


@app.get("/")
def root():
    return {"message": "Pokemon API funcionando"}