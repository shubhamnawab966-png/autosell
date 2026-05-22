from dotenv import load_dotenv
load_dotenv()

import requests
import os

CJ_API_KEY = os.getenv("CJ_API_KEY")
BASE_URL = "https://developers.cjdropshipping.com/api2.0/v1"

def get_access_token():
    url = f"{BASE_URL}/authentication/getAccessToken"
    payload = {"apiKey": CJ_API_KEY}
    response = requests.post(url, json=payload)
    data = response.json()
    if data["result"]:
        return data["data"]["accessToken"]
    return None

def parse_price(price_str):
    try:
        price = str(price_str).split("--")[0].strip()
        return float(price)
    except:
        return 0.0

def search_products(keyword, page=1, limit=20):
    token = get_access_token()
    if not token:
        return {"error": "Token nahi mila"}
    
    url = f"{BASE_URL}/product/list"
    headers = {"CJ-Access-Token": token}
    params = {
        "productNameEn": keyword,
        "pageNum": page,
        "pageSize": limit
    }
    response = requests.get(url, headers=headers, params=params)
    data = response.json()
    
    if data["result"]:
        products = []
        for p in data["data"]["list"]:
            price_usd = parse_price(p["sellPrice"])
            products.append({
                "id": p["pid"],
                "name": p["productNameEn"],
                "image": p["productImage"],
                "price_usd": price_usd,
                "price_inr": round(price_usd * 84 * 1.4),
                "supplier": "CJ Dropshipping"
            })
        return products
    return []

if __name__ == "__main__":
    token = get_access_token()
    print("Token mila:", "Yes ✅" if token else "No ❌")
    if token:
        results = search_products("wireless earbuds")
        print(f"Total products: {len(results)}")
        for p in results:
            print(f"{p['name']} → ₹{p['price_inr']}")