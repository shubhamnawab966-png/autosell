content = """import csv
import io
from fastapi import APIRouter, UploadFile, File, HTTPException

router = APIRouter(prefix="/meesho", tags=["meesho"])

@router.post("/import-orders")
async def import_meesho_orders(file: UploadFile = File(...)):
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
            "product_name": row.get("Product Name", ""),
            "quantity": int(row.get("Quantity", 1) or 1),
            "price": float(row.get("Final Price", 0) or 0),
            "status": row.get("Status", "pending"),
            "customer_name": row.get("Customer Name", ""),
            "customer_address": row.get("Customer Address", ""),
        })
    return {"success": True, "imported": len(orders), "orders": orders}

@router.get("/orders")
def get_meesho_orders():
    return {"message": "CSV import use karo", "endpoint": "/meesho/import-orders"}
"""

with open("routers/meesho.py", "w") as f:
    f.write(content)

print("meesho.py fixed!")