from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal, User, Base, engine
import bcrypt

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://autosell-vert.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class RegisterData(BaseModel):
    name: str
    email: str
    password: str

class LoginData(BaseModel):
    email: str
    password: str

@app.get("/")
def root():
    return {"message": "AutoSell API running!"}

@app.post("/register")
def register(data: RegisterData, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()
    user = User(name=data.name, email=data.email, password=hashed)
    db.add(user)
    db.commit()
    return {"message": "Account created!"}

@app.post("/login")
def login(data: LoginData, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not bcrypt.checkpw(data.password.encode(), user.password.encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful!", "name": user.name}

class ProductData(BaseModel):
    name: str
    price: float
    supplier_url: str

@app.post("/products")
def add_product(data: ProductData):
    return {"message": "Product added!", "product": data}

@app.get("/products")
def get_products():
    return {"products": []}