import { useState, useEffect } from "react";

export function ProductsPage() {
  const [activeTab, setActiveTab] = useState("my-products");
  const [myProducts, setMyProducts] = useState([]);
  const [cjResults, setCJResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [importingProducts, setImportingProducts] = useState({});
  const [error, setError] = useState(null);

  // Fetch imported products from database
  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products/get", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();
      setMyProducts(data.products || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Search CJ products
  const handleSearchCJ = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setCJResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `/api/cj-products/search?q=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      setCJResults(data.items || []);
      setError(null);
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message);
      setCJResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Import product to database
  const handleImportProduct = async (product) => {
    const productKey = product.pid;
    setImportingProducts((prev) => ({ ...prev, [productKey]: true }));

    try {
      const response = await fetch("/api/products/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          pid: product.pid,
          productName: product.productName,
          productImage: product.productImage,
          sellPrice: product.sellPrice,
          isFreeShipping: product.isFreeShipping,
          saleStatus: product.saleStatus,
        }),
      });

      if (!response.ok) throw new Error("Import failed");

      // Show success message
      alert("Product imported successfully!");

      // Refresh my products
      await fetchMyProducts();

      // Remove from CJ results
      setCJResults((prev) =>
        prev.filter((p) => p.pid !== product.pid)
      );
    } catch (err) {
      console.error("Import error:", err);
      alert("Failed to import product: " + err.message);
    } finally {
      setImportingProducts((prev) => ({ ...prev, [productKey]: false }));
    }
  };

  return (
    <div className="w-full h-full bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Products</h1>
        <p className="text-gray-400">Manage your store inventory</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <span className="text-red-200">{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-700">
        <button
          onClick={() => setActiveTab("my-products")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "my-products"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          📦 My Products ({myProducts.length})
        </button>
        <button
          onClick={() => setActiveTab("cj-catalog")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "cj-catalog"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          🛍️ CJ Dropshipping Catalog
        </button>
      </div>

      {/* My Products Tab */}
      {activeTab === "my-products" && (
        <div>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <span className="text-4xl animate-spin">⏳</span>
            </div>
          ) : myProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No products imported yet</p>
              <p className="text-gray-500 text-sm">
                Search for products in CJ Dropshipping Catalog and import them
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {myProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="relative h-48 bg-gray-700 overflow-hidden">
                    <img
                      src={product.productImage || "/placeholder.png"}
                      alt={product.productName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                    {product.isFreeShipping && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        🚚 Free Shipping
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-2 truncate">
                      {product.productName}
                    </h3>
                    <p className="text-blue-400 font-bold mb-4">
                      ₹{product.sellPrice}
                    </p>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium transition">
                        ✏️ Edit
                      </button>
                      <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-medium transition">
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CJ Catalog Tab */}
      {activeTab === "cj-catalog" && (
        <div>
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products (e.g., shirt, phone case)..."
                value={searchQuery}
                onChange={(e) => handleSearchCJ(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <span className="absolute left-4 top-3 text-xl">🔍</span>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <span className="text-4xl animate-spin">⏳</span>
            </div>
          ) : cjResults.length === 0 && searchQuery ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No products found for "{searchQuery}"</p>
            </div>
          ) : searchQuery === "" ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Search for products to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cjResults.map((product) => (
                <div
                  key={product.pid}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="relative h-48 bg-gray-700 overflow-hidden">
                    <img
                      src={product.productImage || "/placeholder.png"}
                      alt={product.productName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                    {product.isFreeShipping && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        🚚 Free Shipping
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                      {product.productName}
                    </h3>
                    <p className="text-blue-400 font-bold mb-4">
                      ₹{product.sellPrice}
                    </p>
                    <button
                      onClick={() => handleImportProduct(product)}
                      disabled={importingProducts[product.pid]}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 rounded font-medium transition flex items-center justify-center gap-2"
                    >
                      {importingProducts[product.pid] ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          Importing...
                        </>
                      ) : (
                        "✓ Import"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}