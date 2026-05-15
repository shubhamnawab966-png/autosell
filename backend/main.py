from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import SessionLocal, engine, Base, User, Product
import bcrypt
import jwt
import os
from datetime import datetime

Base.metadata.create_all(bind=engine)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = os.environ.get("SECRET_KEY", "autosell-secret-key")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ─── AUTH ───────────────────────────────

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

@app.get("/")
def root():
    return {"message": "AutoSell API running!"}

@app.post("/api/auth/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()
    new_user = User(name=user.name, email=user.email, password=hashed)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    token = jwt.encode({"id": new_user.id, "email": new_user.email}, SECRET_KEY, algorithm="HS256")
    return {"token": token, "user": {"id": new_user.id, "name": new_user.name, "email": new_user.email}}

@app.post("/api/auth/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not bcrypt.checkpw(user.password.encode(), db_user.password.encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = jwt.encode({"id": db_user.id, "email": db_user.email}, SECRET_KEY, algorithm="HS256")
    return {"token": token, "user": {"id": db_user.id, "name": db_user.name, "email": db_user.email}}

# ─── PRODUCTS ───────────────────────────

class ProductCreate(BaseModel):
    name: str
    sku: Optional[str] = None
    cost_price: Optional[float] = None
    sell_price: Optional[float] = None
    platform: Optional[str] = None
    category: Optional[str] = None
    stock: Optional[int] = 0
    image_url: Optional[str] = None
    description: Optional[str] = None

@app.get("/api/products")
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).order_by(Product.id.desc()).all()
    return {"products": products}

@app.post("/api/products")
def add_product(product: ProductCreate, db: Session = Depends(get_db)):
    new_product = Product(**product.dict())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@app.put("/api/products/{product_id}")
def update_product(product_id: int, product: ProductCreate, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product nahi mila")
    for key, value in product.dict().items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.delete("/api/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product nahi mila")
    db.delete(db_product)
    db.commit()
    return {"message": "Product delete ho gaya"}