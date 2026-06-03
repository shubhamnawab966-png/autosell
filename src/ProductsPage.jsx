import React, { useState, useEffect } from 'react';
import '../styles/ProductsPage.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [cjProducts, setCjProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [importedProducts, setImportedProducts] = useState(new Set());

  const storeId = localStorage.getItem('storeId') || 'default-store';
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/products/${storeId}`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
        setImportedProducts(new Set(data.products.map(p => p.sku)));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const searchCJProducts = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/cj/search?q=${searchQuery}`);
      const data = await response.json();
      if (data.success) {
        setCjProducts(data.products);
      }
    } catch (error) {
      console.error('Error searching CJ products:', error);
    } finally {
      setLoading(false);
    }
  };

  const importProduct = async (product) => {
    try {
      const response = await fetch(`${apiUrl}/api/products/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId,
          name: product.productName,
          price: product.sellPrice,
          originalPrice: product.originalPrice || product.sellPrice,
          image: product.productImage,
          sku: product.pid,
          description: product.description || '',
          supplierId: product.pid,
          profitMargin: 30
        })
      });
      const data = await response.json();
      if (data.success) {
        setImportedProducts(prev => new Set([...prev, product.pid]));
        fetchProducts();
      }
    } catch (error) {
      console.error('Error importing product:', error);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`${apiUrl}/api/products/${productId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="products-page">
      <div className="search-section">
        <h2>Search & Import Products</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search CJ Dropshipping products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchCJProducts()}
          />
          <button onClick={searchCJProducts} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {cjProducts.length > 0 && (
          <div className="cj-products">
            <h3>Available Products ({cjProducts.length})</h3>
            <div className="products-grid">
              {cjProducts.map((product) => (
                <div key={product.pid} className="product-card">
                  <img src={product.productImage} alt={product.productName} />
                  <h4>{product.productName}</h4>
                  <p className="price">₹{product.sellPrice}</p>
                  {product.isFreeShipping && (
                    <span className="badge">Free Shipping</span>
                  )}
                  <button
                    className={importedProducts.has(product.pid) ? 'imported' : 'import-btn'}
                    onClick={() => importProduct(product)}
                    disabled={importedProducts.has(product.pid)}
                  >
                    {importedProducts.has(product.pid) ? '✅ Imported' : '+ Import'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="store-products-section">
        <h2>Your Store Products ({products.length})</h2>
        {products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} />
                <h4>{product.name}</h4>
                <p className="price">₹{product.price}</p>
                <p className="supplier">{product.supplier}</p>
                <div className="actions">
                  <button className="edit-btn">Edit</button>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No products yet. Search and import from CJ!</p>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;