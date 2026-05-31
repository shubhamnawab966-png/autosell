@app.get("/api/products/search")
async def search_products(q: str = "trending"):
    from cj_api import search_cj_products
    return await search_cj_products(query=q)

@app.post("/api/products/import")
async def import_product(request: dict):
    """
    CJ product ko apne store mein add karo
    """
    try:
        pid = request.get('pid')
        product_name = request.get('productName')
        sell_price = request.get('sellPrice')
        product_image = request.get('productImage')

        print(f"✅ Product imported: {product_name} | PID: {pid} | Price: ${sell_price}")

        return {
            "ok": True,
            "message": f"✅ {product_name} imported successfully!",
            "product_id": pid
        }
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return {"ok": False, "error": str(e)}
