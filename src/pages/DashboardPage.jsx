import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000";
const getToken = () => localStorage.getItem("token");

export function DashboardPage() {
  const [stats, setStats] = useState({
    total_products: 0,
    total_orders: 0,
    revenue: 0,
    profit: 0,
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/products`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      const prods = data.products || [];
      setProducts(prods);

      const revenue = prods.reduce((sum, p) => sum + (parseFloat(p.sell_price) || 0), 0);
      const profit = prods.reduce((sum, p) => sum + ((parseFloat(p.sell_price) || 0) - (parseFloat(p.cost_price) || 0)), 0);

      setStats({
        total_products: prods.length,
        total_orders: 0,
        revenue: revenue.toFixed(0),
        profit: profit.toFixed(0),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Total Products", value: stats.total_products, icon: "📦", color: "#6366f1" },
    { label: "Total Orders", value: stats.total_orders, icon: "🛒", color: "#0ea5e9" },
    { label: "Revenue", value: `₹${parseInt(stats.revenue).toLocaleString("en-IN")}`, icon: "💰", color: "#10b981" },
    { label: "Profit", value: `₹${parseInt(stats.profit).toLocaleString("en-IN")}`, icon: "📈", color: "#f59e0b" },
  ];

  return (
    <div style={{ fontFamily: "sans-serif", color: "#f1f5f9" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: "#f1f5f9" }}>Dashboard</h1>
        <p style={{ color: "#64748b", marginTop: 4 }}>AutoSell ka real-time overview</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
        {statCards.map((card) => (
          <div key={card.label} style={{ background: "#1e293b", borderRadius: 12, padding: 20, border: "1px solid #334155" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>{card.label}</span>
              <span style={{ fontSize: 24 }}>{card.icon}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: card.color }}>
              {loading ? "..." : card.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "#1e293b", borderRadius: 12, border: "1px solid #334155", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #334155" }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#f1f5f9" }}>📦 Recent Products</h2>
        </div>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Loading...</div>
        ) : products.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
            <p>Koi product nahi hai — Products page pe jaake add karo!</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#0f172a" }}>
                {["Product", "Platform", "Cost", "Sell", "Profit"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 16px", color: "#64748b", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 5).map((p, i) => (
                <tr key={p.id} style={{ background: i % 2 === 0 ? "#1e293b" : "#162032", borderTop: "1px solid #334155" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 600, color: "#f1f5f9" }}>{p.name}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: "#4c1d95", color: "#c4b5fd", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{p.platform}</span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#94a3b8" }}>₹{parseFloat(p.cost_price||0).toFixed(0)}</td>
                  <td style={{ padding: "12px 16px", color: "#f1f5f9", fontWeight: 700 }}>₹{parseFloat(p.sell_price||0).toFixed(0)}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: "#052e16", color: "#4ade80", padding: "2px 8px", borderRadius: 6, fontWeight: 700 }}>
                      ₹{(parseFloat(p.sell_price||0) - parseFloat(p.cost_price||0)).toFixed(0)}
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