from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from database import SessionLocal, Base, engine, Product, User
from werkzeug.security import check_password_hash, generate_password_hash
import os
import asyncio
from functools import wraps
import jwt

load_dotenv()
Base.metadata.create_all(bind=engine)

app = Flask(__name__)
# Allow both 5173 AND 5174 ports
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"], "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization"]}})

# Token decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Token is missing!'}), 401
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            # Simple token parsing - token format: token_<user_id>
            if token.startswith('token_'):
                user_id = int(token.split('_')[1])
                db = SessionLocal()
                user = db.query(User).filter(User.id == user_id).first()
                db.close()
                if user:
                    return f(user, *args, **kwargs)
                else:
                    return jsonify({'message': 'Token is invalid!'}), 401
            return jsonify({'message': 'Token is invalid!'}), 401
        except Exception as e:
            return jsonify({'message': f'Token is invalid! {str(e)}'}), 401
    
    return decorated

# ==================== Auth Routes ====================

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
            db.close()
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
        db.close()
        return jsonify({"success": True, "token": f"token_{new_user.id}"}), 201
    except Exception as e:
        db.rollback()
        db.close()
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        db = SessionLocal()
        data = request.json
        user = db.query(User).filter(User.email == data['email']).first()
        if user and check_password_hash(user.password, data['password']):
            db.close()
            return jsonify({"success": True, "token": f"token_{user.id}"}), 200
        db.close()
        return jsonify({"success": False, "error": "Invalid credentials"}), 401
    except Exception as e:
        db.close()
        return jsonify({"success": False, "error": str(e)}), 500

# ==================== CJ API Routes ====================

@app.route('/api/cj/search', methods=['POST'])
def cj_search():
    try:
        from cj_api import search_cj_products
        
        data = request.json
        query = data.get('query', '')
        
        # Run async function properly
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            results = loop.run_until_complete(search_cj_products(query))
        finally:
            loop.close()
        
        return jsonify({"success": True, "results": results}), 200
    except Exception as e:
        print(f"CJ Search error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/cj-products/search', methods=['GET'])
@token_required
def cj_products_search(current_user):
    """Search CJ products with proper error handling"""
    try:
        from cj_api import search_cj_products
        
        query = request.args.get('q', '')
        
        # Validate query
        if not query or len(query.strip()) == 0:
            return jsonify({
                "ok": False,
                "items": [],
                "count": 0,
                "error": "Query required"
            }), 400
        
        print(f"Searching CJ products for: {query}")
        
        # Run async function with error handling
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            results = loop.run_until_complete(search_cj_products(query))
        finally:
            loop.close()
        
        # Ensure results is a list
        if not isinstance(results, list):
            results = []
        
        print(f"Found {len(results)} products")
        
        return jsonify({
            "ok": True,
            "items": results,
            "count": len(results)
        }), 200
        
    except Exception as e:
        print(f"CJ Search error: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return jsonify({
            "ok": False,
            "items": [],
            "count": 0,
            "error": f"Search failed: {str(e)}"
        }), 500

# ==================== Products Routes ====================

@app.route('/api/products/list', methods=['GET'])
def list_products():
    try:
        db = SessionLocal()
        products = db.query(Product).all()
        db.close()
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
        db.close()
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/products/import', methods=['POST'])
@token_required
def import_product(current_user):
    """Import product from CJ to user's store"""
    try:
        db = SessionLocal()
        data = request.json
        
        # Handle both sellPrice (from CJ API) and sell_price variants
        sell_price = data.get('sellPrice') or data.get('sell_price') or 0
        original_price = data.get('originalPrice') or data.get('original_price') or 0
        image_url = data.get('image') or data.get('productImage') or ''
        product_name = data.get('name') or data.get('productName') or ''
        
        product = Product(
            user_id=current_user.id,
            pid=data.get('pid', ''),
            productName=product_name,
            productImage=image_url,
            sellPrice=float(sell_price),
            isFreeShipping=data.get('isFreeShipping', False),
            saleStatus=data.get('saleStatus', 'active'),
            supplier='cj_dropshipping'
        )
        db.add(product)
        db.commit()
        db.refresh(product)
        db.close()
        
        return jsonify({
            "ok": True,
            "success": True,
            "product": {
                "id": product.id,
                "name": product.productName
            }
        }), 201
    except Exception as e:
        db.rollback()
        db.close()
        print(f"Import error: {str(e)}")
        return jsonify({"ok": False, "success": False, "error": str(e)}), 500

@app.route('/api/products/get', methods=['GET'])
@token_required
def get_products(current_user):
    """Fetch all products for the logged-in user"""
    try:
        db = SessionLocal()
        products = db.query(Product).filter(Product.user_id == current_user.id).order_by(Product.created_at.desc()).all()
        db.close()
        
        products_list = []
        for product in products:
            products_list.append({
                'id': product.id,
                'pid': product.pid,
                'productName': product.productName,
                'productImage': product.productImage,
                'sellPrice': float(product.sellPrice) if product.sellPrice else 0,
                'isFreeShipping': product.isFreeShipping,
                'saleStatus': product.saleStatus,
                'created_at': product.created_at.isoformat() if product.created_at else None
            })
        
        return jsonify({
            'ok': True,
            'products': products_list,
            'count': len(products_list)
        }), 200
    
    except Exception as e:
        db.close()
        print(f"Error fetching products: {str(e)}")
        return jsonify({
            'ok': False,
            'error': str(e)
        }), 500

# ==================== Run ====================

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)