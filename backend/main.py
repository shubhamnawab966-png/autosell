from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from database import SessionLocal, Base, engine, Product, User
import os

load_dotenv()

# Create tables
Base.metadata.create_all(bind=engine)

app = Flask(__name__)
CORS(app)

PORT = int(os.getenv('PORT', 5000))

@app.route('/', methods=['GET'])
def home():
    return {'status': 'AutoSell Backend Running ✅'}

# PRODUCTS ROUTES
@app.route('/api/products/import', methods=['POST'])
def import_product():
    try:
        db = SessionLocal()
        data = request.json
        
        # Check if exists
        existing = db.query(Product).filter(Product.sku == data['sku']).first()
        if existing:
            return jsonify({"success": False, "error": "Product already imported"}), 400
        
        # Create product
        product = Product(
            store_id=data['storeId'],
            name=data['name'],
            price=data['price'],
            original_price=data.get('originalPrice', data['price']),
            image_url=data.get('image'),
            sku=data['sku'],
            description=data.get('description'),
            supplier='cj_dropshipping',
            supplier_product_id=data.get('supplierId'),
            profit_margin=data.get('profitMargin', 30),
            status='active'
        )
        
        db.add(product)
        db.commit()
        db.refresh(product)
        
        return jsonify({
            "success": True,
            "message": "Product imported successfully",
            "product": {
                "id": product.id,
                "name": product.name,
                "price": product.price,
                "sku": product.sku
            }
        }), 201
    except Exception as e:
        db.rollback()
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        db.close()

@app.route('/api/products/<store_id>', methods=['GET'])
def get_products(store_id):
    try:
        db = SessionLocal()
        products = db.query(Product).filter(Product.store_id == store_id).all()
        
        return jsonify({
            "success": True,
            "products": [
                {
                    "id": p.id,
                    "name": p.name,
                    "price": p.price,
                    "originalPrice": p.original_price,
                    "image": p.image_url,
                    "sku": p.sku,
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

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        db = SessionLocal()
        product = db.query(Product).get(product_id)
        
        if not product:
            return jsonify({"success": False, "error": "Product not found"}), 404
        
        db.delete(product)
        db.commit()
        
        return jsonify({"success": True, "message": "Product deleted"}), 200
    except Exception as e:
        db.rollback()
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        db.close()

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=PORT)