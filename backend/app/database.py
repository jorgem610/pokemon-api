from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# URL de conexión a la base de datos SQLite.
SQLALCHEMY_DATABASE_URL = "sqlite:///./pokemon.db"

# El engine es el punto de entrada a la base de datos.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#Fabrica de sesiones
Base = declarative_base()

def get_db():
    #Abre una sesion
    db = SessionLocal()
    try:
        #Espera que responda la sesion
        yield db
    finally:
        #Se cierra la sesion
        db.close()