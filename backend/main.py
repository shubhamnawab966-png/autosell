from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from database import SessionLocal, Base, engine, Product, User
from werkzeug.security import check_password_hash, generate_password_hash
import os
import asyncio

load_dotenv()
Base.metadata.create_all(bind=engine)

app = Flask(__name__)
# Allow both 5173 AND 5174 ports
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"], "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization"]}})

@app.route('/', methods=['GET'])
def home():
    return {'status': 'AutoSell Backend Running'}

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    try:
        db = SessionLocal()
        data = request.json
        
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == data['email']).first()
        if existing_user:
            return jsonify({"success": False, "error": "Email already exists"}), 400
        
        # Create new user
        hashed_password = generate_password_hash(data['password'])
        new_user = User(
            email=data['email'],
            password=hashed_password,
            name=data.get('name', '')
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return jsonify({"success": True, "token": f"token_{new_user.id}"}), 201
    except Exception as e:
        db.rollback()
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        db.close()

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        db = SessionLocal()
        data = request.json
        user = db.query(User).filter(User.email == data['email']).first()
        if user and check_password_hash(user.password, data['password']):
            return jsonify({"success": True, "token": f"token_{user.id}"}), 200
        return jsonify({"success": False, "error": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        db.close()

@app.route('/api/cj/search', methods=['POST'])
def cj_search():
    try:
        from cj_api import search_cj_products
        
        data = request.json
        query = data.get('query', '')
        
        # Run async function properly
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        results = loop.run_until_complete(search_cj_products(query))
        loop.close()
        
        return jsonify({"success": True, "results": results}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/products/list', methods=['GET'])
def list_products():
    try:
        db = SessionLocal()
        products = db.query(Product).all()
        return jsonify({
            "success": True,
            "products": [
                {
                    "id": p.id,
                    "name": p.name,
                    "price": p.price,
                    "image_url": p.image_url,
                    "supplier": p.supplier,
                    "status": p.status
                }
                for p in products
            ]
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        db.close()

@app.route('/api/products/import', methods=['POST'])
def import_product():
    try:
        db = SessionLocal()
        data = request.json
        
        # Handle both sellPrice (from CJ API) and sell_price variants
        sell_price = data.get('sellPrice') or data.get('sell_price') or 0
        original_price = data.get('originalPrice') or data.get('original_price') or 0
        image_url = data.get('image') or data.get('productImage') or ''
        
        product = Product(
            store_id=data.get('storeId', 1),
            name=data.get('name', ''),
            price=float(sell_price),
            original_price=float(original_price),
            image_url=image_url,
            sku=data.get('sku', ''),
            description=data.get('description', ''),
            supplier='cj_dropshipping',
            status='active'
        )
        db.add(product)
        db.commit()
        db.refresh(product)
        return jsonify({"success": True, "product": {"id": product.id, "name": product.name}}), 201
    except Exception as e:
        db.rollback()
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        db.close()

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)