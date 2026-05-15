from sqlalchemy import create_engine, Column, Integer, String,Float,DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

import os
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./autosell.db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    sku = Column(String)
    cost_price = Column(Float)
    sell_price = Column(Float)
    platform = Column(String)
    category = Column(String)
    stock = Column(Integer, default=0)
    image_url = Column(String)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
Base.metadata.create_all(bind=engine)
