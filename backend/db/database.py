from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker,Session
# Dependency for FastAPI routes
from typing import Generator
import os

# Load database URL from env, fallback to local Postgres
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://anushree_user:airbnb@localhost:5432/Catalog"
)

# Create engine
engine = create_engine(DATABASE_URL, echo=True)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()




def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()