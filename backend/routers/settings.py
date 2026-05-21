from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, Boolean
from database import SessionLocal, engine, Base
from pydantic import BaseModel
from typing import Optional

# Settings Model
class UserSettings(Base):
    __tablename__ = "user_settings"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, unique=True)
    store_name = Column(String, default="")
    phone = Column(String, default="")
    meesho_api_key = Column(String, default="")
    flipkart_api_key = Column(String, default="")
    auto_pricing = Column(Boolean, default=False)
    notification_email = Column(Boolean, default=True)

Base.metadata.create_all(bind=engine)

router = APIRouter(prefix="/settings", tags=["settings"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class SettingsUpdate(BaseModel):
    store_name: Optional[str] = None
    phone: Optional[str] = None
    meesho_api_key: Optional[str] = None
    flipkart_api_key: Optional[str] = None
    auto_pricing: Optional[bool] = None
    notification_email: Optional[bool] = None

@router.get("/")
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(UserSettings).filter(UserSettings.user_id == 1).first()
    if not settings:
        settings = UserSettings(user_id=1)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.put("/")
def update_settings(data: SettingsUpdate, db: Session = Depends(get_db)):
    settings = db.query(UserSettings).filter(UserSettings.user_id == 1).first()
    if not settings:
        settings = UserSettings(user_id=1)
        db.add(settings)
    for key, value in data.dict(exclude_none=True).items():
        setattr(settings, key, value)
    db.commit()
    db.refresh(settings)
    return {"message": "Settings saved!", "data": settings}