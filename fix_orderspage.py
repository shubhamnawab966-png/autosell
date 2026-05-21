content = """import { useState, useEffect } from "react";

const API = "https://autosell-production-b292.up.railway.app";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetch(`${API}/orders/`)
      .then(res => res.json())
      .then(data => { setOrders(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = orders.filter(o =>
    (o.order_id?.toLowerCase().includes(search.toLowerCase()) ||
     o.customer_name?.toLowerCase().includes(search.toLowerCase())) &&
    (filterStatus === "All" || o.status === filterStatus.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#030712", color: "white", padding: "24px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "4px" }}>📦 Orders</h1>
      <p style={{ color: "#6b7280", marginBottom: "24px" }}>Real database se orders</p>

      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <input
          placeholder="Search orders..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, background: "#111827", border: "1px solid #374151", borderRadius: "8px", padding: "10px 16px", color: "white" }}
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          style={{ background: "#111827", border: "1px solid #374151", borderRadius: "8px", padding: "10px 16px", color: "white" }}
        >
          {["All", "Pending", "Shipped", "Delivered", "Cancelled"].map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div style={{ background: "#111827", borderRadius: "12px", overflow: "hidden" }}>
        {loading ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
            Koi order nahi — Meesho CSV import karo!
          </p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1f2937" }}>
                {["Order ID", "Product", "Customer", "Platform", "Price", "Status"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#6b7280", fontSize: "12px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #1f2937" }}>
                  <td style={{ padding: "12px 16px", color: "#a78bfa" }}>{o.order_id}</td>
                  <td style={{ padding: "12px 16px" }}>{o.product_name}</td>
                  <td style={{ padding: "12px 16px", color: "#9ca3af" }}>{o.customer_name}</td>
                  <td style={{ padding: "12px 16px", color: "#60a5fa" }}>{o.platform}</td>
                  <td style={{ padding: "12px 16px", color: "#4ade80" }}>Rs.{o.price}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: "#1f2937", padding: "4px 10px", borderRadius: "999px", fontSize: "12px" }}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
"""

with open("src/pages/OrdersPage.jsx", "w") as f:
    f.write(content)

print("OrdersPage fixed!")