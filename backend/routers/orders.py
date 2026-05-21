from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from database import SessionLocal, engine, Base
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Order Model
class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    platform = Column(String, default="meesho")
    order_id = Column(String)
    product_name = Column(String)
    quantity = Column(Integer, default=1)
    price = Column(Float, default=0)
    status = Column(String, default="pending")
    customer_name = Column(String)
    customer_address = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

router = APIRouter(prefix="/orders", tags=["orders"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class OrderCreate(BaseModel):
    platform: str = "meesho"
    order_id: str
    product_name: str
    quantity: int = 1
    price: float = 0
    status: str = "pending"
    customer_name: str = ""
    customer_address: str = ""

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    price: Optional[float] = None

@router.get("/")
def get_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).all()
    return orders

@router.post("/")
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    db_order = Order(**order.dict())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

@router.put("/{order_id}")
def update_order(order_id: int, order: OrderUpdate, db: Session = Depends(get_db)):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    for key, value in order.dict(exclude_none=True).items():
        setattr(db_order, key, value)
    db.commit()
    return db_order

@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    db.delete(db_order)
    db.commit()
    return {"message": "Order deleted"}