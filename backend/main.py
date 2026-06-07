from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from database import SessionLocal, Base, engine, Product, User
from werkzeug.security import check_password_hash, generate_password_hash
import os

load_dotenv()
Base.metadata.create_all(bind=engine)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5174", "http://127.0.0.1:5174"], "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization"]}})

@app.route('/', methods=['GET'])
def home():
    return {'status': 'AutoSell Backend Running'}

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

@app.route('/api/products/import', methods=['POST'])
def import_product():
    try:
        db = SessionLocal()
        data = request.json
        product = Product(
            store_id=data['storeId'],
            name=data['name'],
            price=float(data.get('sell_price', 0)),
            original_price=float(data.get('originalPrice', 0)),
            image_url=data.get('image'),
            sku=data['sku'],
            description=data.get('description'),
            supplier='cj_dropshipping',
            status='active'
        )
        db.add(product)
        db.commit()
        return jsonify({"success": True, "product": {"id": product.id, "name": product.name}}), 201
    except Exception as e:
        db.rollback()
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        db.close()

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)