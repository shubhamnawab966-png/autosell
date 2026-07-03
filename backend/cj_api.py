import time
import httpx
from fastapi import HTTPException

CJ_AUTH_URL = "https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken"
CJ_PRODUCT_URL = "https://developers.cjdropshipping.com/api2.0/v1/product/list"

CJ_API_KEY = "CJ5318179@api@046fef6227444d5cbc230ad5e0b94d73"

_token_cache = {"token": None, "expires_at": 0}

async def get_access_token(force=False):
    now = int(time.time())
    if not force and _token_cache["token"] and now < _token_cache["expires_at"]:
        return _token_cache["token"]
    async with httpx.AsyncClient(timeout=30) as client:
        res = await client.post(
            CJ_AUTH_URL,
            json={"apiKey": CJ_API_KEY},
            headers={"Content-Type": "application/json"}
        )
    data = res.json()
    print("AUTH RESPONSE:", data)
    if data.get("result") is True:
        token = data["data"]["accessToken"]
        _token_cache["token"] = token
        _token_cache["expires_at"] = now + 82800
        return token
    raise HTTPException(status_code=502, detail=f"CJ Auth failed: {data}")

async def search_cj_products(query: str, page_num=1, page_size=20):
    token = await get_access_token()
    async with httpx.AsyncClient(timeout=45) as client:
        res = await client.get(
            CJ_PRODUCT_URL,
            headers={"Content-Type": "application/json", "CJ-Access-Token": token},
            params={"productNameEn": query, "pageNum": page_num, "pageSize": page_size}
        )
    data = res.json()
    print("SEARCH RESPONSE:", data)
    if data.get("result") is True:
        items = data.get("data", {}).get("list", [])

        # Price fix: CJ ka raw USD price -> INR conversion + 30% markup
        # min Rs.20 profit guarantee, nearest Rs.10 pe round
        for item in items:
            try:
                usd_price = float(str(item.get("sellPrice", 0)).split("--")[0].strip())
            except (ValueError, TypeError):
                usd_price = 0

            cost_inr = round(usd_price * 80)
            sell_inr = round((cost_inr * 1.30) / 10) * 10
            if sell_inr - cost_inr < 20:
                sell_inr = cost_inr + 20

            item["cost_price"] = cost_inr
            item["sellPrice"] = sell_inr

        return {"ok": True, "count": len(items), "items": items}
    raise HTTPException(status_code=502, detail=f"CJ Search failed: {data}")