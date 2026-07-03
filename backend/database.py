from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./autosell.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
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
    user_id = Column(Integer, index=True, nullable=False)
    pid = Column(String)
    productName = Column(String, nullable=False)
    productImage = Column(String)
    sellPrice = Column(Float, default=0)
    cost_price = Column(Float, default=0)
    isFreeShipping = Column(Boolean, default=False)
    saleStatus = Column(String, default='active')
    platform = Column(String, default='cj_dropshipping')
    supplier = Column(String, default='cj_dropshipping')
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)