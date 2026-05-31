from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine, Base, User, Product
import bcrypt
import jwt
import os

from routers.meesho import router as meesho_router
from routers.orders import router as orders_router
from routers.settings import router as settings_router

Base.metadata.create_all(bind=engine)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(meesho_router)
app.include_router(orders_router)
app.include_router(settings_router)

SECRET_KEY = os.environ.get("SECRET_KEY", "autosell-secret-key")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = jwt.encode({"id": db_user.id, "email": db_user.email}, SECRET_KEY, algorithm="HS256")
    return {"token": token, "user": {"id": db_user.id, "name": db_user.name, "email": db_user.email}}
@app.get("/test-cj-auth")
async def test_cj_auth():
    from cj_api import get_access_token
    token = await get_access_token(force=True)
    return {"token_preview": token[:10] + "..."}

@app.get("/api/products/search")
async def search_products(q: str = "trending"):
    from cj_api import search_cj_products
    return await search_cj_products(query=q)