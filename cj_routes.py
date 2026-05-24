from flask import Blueprint, request, jsonify
from cj_api import search_products

cj_bp = Blueprint('cj', __name__)

@cj_bp.route('/api/products/search', methods=['GET'])
def search():
    keyword = request.args.get('q', 'trending')
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    
    products = search_products(keyword, page, limit)
    return jsonify({
        "success": True,
        "products": products,
        "total": len(products)
    })