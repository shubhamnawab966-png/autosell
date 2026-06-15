import { useState } from 'react';

export function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importingProducts, setImportingProducts] = useState(new Set());

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setResults([]);
    
    try {
      const response = await fetch('http://localhost:5000/api/cj/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const items = Array.isArray(data.results) 
          ? data.results 
          : (data.results?.items || []);
        setResults(items);
      }
    } catch (e) {
      console.error('Error:', e);
    }
    setLoading(false);
  }

  async function handleImportProduct(product) {
    // Add to importing set
    setImportingProducts(prev => new Set([...prev, product.pid]));
    
    try {
      const response = await fetch('http://localhost:5000/api/products/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: 1,
          name: product.productName,
          sellPrice: product.sellPrice,
          originalPrice: product.costPrice || product.sellPrice,
          image: product.productImage,
          sku: product.pid,
          description: product.productName,
          productImage: product.productImage
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('✅ Product imported successfully!');
      } else {
        alert('❌ Import failed: ' + (data.error || 'Unknown error'));
      }
    } catch (e) {
      alert('❌ Error: ' + e.message);
    }
    
    // Remove from importing set
    setImportingProducts(prev => {
      const newSet = new Set(prev);
      newSet.delete(product.pid);
      return newSet;
    });
  }

  return (
    <div className="p-6 bg-surface-950 min-h-screen">
      <h1 className="text-white text-3xl font-bold mb-6">Products</h1>
      
      <div className="bg-surface-900 p-6 rounded-2xl mb-6">
        <h2 className="text-white text-xl mb-4">🔍 CJ Dropshipping Catalog</h2>
        <div className="flex gap-2 mb-4">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search products..."
            className="flex-1 p-3 bg-surface-800 text-white rounded-lg"
          />
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {results.length > 0 && (
          <div>
            <p className="text-white mb-4">✅ Found {results.length} products</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map((product) => (
                <div key={product.pid} className="bg-surface-800 p-3 rounded-lg hover:bg-surface-700 transition">
                  <img 
                    src={product.productImage} 
                    alt={product.productName} 
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <h3 className="text-white text-sm font-bold line-clamp-2">{product.productName}</h3>
                  <p className="text-yellow-400 font-bold mt-1">₹{product.sellPrice}</p>
                  <button 
                    onClick={() => handleImportProduct(product)}
                    disabled={importingProducts.has(product.pid)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white text-sm py-2 rounded mt-2 font-bold disabled:opacity-50"
                  >
                    {importingProducts.has(product.pid) ? '⏳ Importing...' : '📥 Import'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {results.length === 0 && searchQuery && !loading && (
          <p className="text-gray-400">No products found</p>
        )}
      </div>
    </div>
  );
}