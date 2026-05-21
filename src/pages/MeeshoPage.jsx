import { useState } from "react";

export default function MeeshoPage() {
  const [file, setFile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return setMessage("Pehle CSV file select karo!");
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        "https://autosell-production-b292.up.railway.app/meesho/import-orders",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      setOrders(data.orders || []);
      setMessage(`✅ ${data.imported} orders import ho gaye!`);
    } catch (err) {
      setMessage("❌ Error aaya, dobara try karo.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-2">🛍️ Meesho Integration</h1>
      <p className="text-gray-400 mb-6">Meesho orders CSV upload karke import karo</p>

      {/* Upload Box */}
      <div className="bg-gray-900 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-purple-400">CSV Import</h2>
        
        <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center mb-4">
          <div className="text-4xl mb-2">📂</div>
          <p className="text-gray-400 mb-3">Meesho seller panel se CSV download karo aur yahan upload karo</p>
          <input
            type="file"
            accept=".csv"
            onChange={e => setFile(e.target.files[0])}
            className="text-sm text-gray-300"
          />
          {file && <p className="text-green-400 mt-2">✅ {file.name}</p>}
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 py-3 rounded-xl font-semibold transition"
        >
          {loading ? "Import ho raha hai..." : "Import Orders"}
        </button>

        {message && (
          <p className="mt-3 text-center text-sm font-medium">{message}</p>
        )}
      </div>

      {/* How to get CSV */}
      <div className="bg-gray-900 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-400">📋 CSV Kaise Download Karein?</h2>
        <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
          <li>Meesho Supplier Panel open karo</li>
          <li>Orders section mein jao</li>
          <li>"Download Orders" button pe click karo</li>
          <li>CSV download hogi — wahi yahan upload karo</li>
        </ol>
      </div>

      {/* Orders Table */}
      {orders.length > 0 && (
        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-green-400">
            📦 Imported Orders ({orders.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-800">
                  <th className="text-left py-2 px-3">Order ID</th>
                  <th className="text-left py-2 px-3">Product</th>
                  <th className="text-left py-2 px-3">Qty</th>
                  <th className="text-left py-2 px-3">Price</th>
                  <th className="text-left py-2 px-3">Status</th>
                  <th className="text-left py-2 px-3">Customer</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr key={i} className="border-b border-gray-800 hover:bg-gray-800">
                    <td className="py-2 px-3 text-purple-400">{order.order_id}</td>
                    <td className="py-2 px-3">{order.product_name}</td>
                    <td className="py-2 px-3">{order.quantity}</td>
                    <td className="py-2 px-3 text-green-400">₹{order.price}</td>
                    <td className="py-2 px-3">
                      <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded-full text-xs">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-gray-400">{order.customer_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}