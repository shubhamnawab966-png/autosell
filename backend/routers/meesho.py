import csv
import io
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from routers.auth import get_current_user

router = APIRouter(prefix="/meesho", tags=["meesho"])

@router.post("/import-orders")
async def import_meesho_orders(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Sirf CSV file allowed hai")
    
    content = await file.read()
    text = content.decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(text))
    
    orders = []
    for row in reader:
        orders.append({
            "platform": "meesho",
            "order_id": row.get("Sub Order No", row.get("Order ID", "")),
            "product_name": row.get("Product Name", row.get("Product", "")),
            "quantity": int(row.get("Quantity", 1) or 1),
            "price": float(row.get("Final Price", row.get("Price", 0)) or 0),
            "status": row.get("Status", "pending"),
            "customer_name": row.get("Customer Name", ""),
            "customer_address": row.get("Customer Address", ""),
        })
    
    return {
        "success": True,
        "imported": len(orders),
        "orders": orders
    }

@router.get("/orders")
def get_meesho_orders(current_user = Depends(get_current_user)):
    return {
        "message": "Meesho direct API abhi available nahi. CSV import use karo.",
        "import_endpoint": "/meesho/import-orders"
    }